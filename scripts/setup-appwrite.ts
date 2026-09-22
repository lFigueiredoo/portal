/**
 * Setup inicial do Appwrite para o Portal PHIQ — prepara todo o ambiente
 * pela API, sem criar nada manualmente no painel:
 *
 *   1. valida a conexão (endpoint responde) e os escopos da API key
 *   2. cria o database (idempotente — não duplica)
 *   3. cria a tabela user_profiles + colunas (idempotente)
 *   4. garante permissões de servidor: só a API key acessa — usuários
 *      finais não podem ler nem alterar perfis
 *   5. cria (ou reutiliza) o usuário administrador no Appwrite
 *   6. cria (ou reutiliza) o perfil ADMIN em user_profiles
 *
 * Uso:
 *   npm run setup:appwrite
 *
 * Variáveis lidas de .env / .env.local ou do ambiente (ver .env.example):
 *   APPWRITE_ENDPOINT        ex.: https://nyc.cloud.appwrite.io/v1
 *   APPWRITE_PROJECT_ID      id do projeto no painel do Appwrite
 *   APPWRITE_API_KEY         escopos: users.read, users.write,
 *                            tablesdb.read, tablesdb.write, sessions.write
 *   ADMIN_EMAIL              login do primeiro administrador
 *   ADMIN_PASSWORD           senha (8 a 256 caracteres)
 *   ADMIN_NAME               nome de exibição do administrador
 *   DATABASE_ID              id do database criado pelo script
 *   USER_PROFILES_TABLE_ID   id da tabela de perfis
 *
 * Aceita também os nomes usados pelo portal em runtime
 * (NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID,
 * APPWRITE_DATABASE_ID, APPWRITE_USER_PROFILES_TABLE_ID) para evitar
 * valores duplicados no .env — a variação específica do setup prevalece.
 *
 * Sem fallbacks: nenhuma variável tem valor padrão; faltando qualquer
 * uma, o script interrompe com a lista do que está faltando.
 *
 * Nota: o Appwrite não possui coluna de tipo JSON; `permissions` é criada
 * como coluna de strings em array (`array: true`), que chega ao portal
 * como array nativo — exatamente o formato que `lib/appwrite/users.ts`
 * consome.
 */

import { existsSync, readFileSync } from "node:fs";

import {
  AppwriteException,
  Client,
  ID,
  Query,
  TablesDB,
  Users,
  type Models,
} from "node-appwrite";

// ── Constantes do ambiente provisionado ─────────────────────────────

const DATABASE_NAME = "portal";
const TABLE_NAME = "user_profiles";
const ADMIN_ROLE = "ADMIN";
const ADMIN_PERMISSIONS = [
  "edocs",
  "crm",
  "bi",
  "universidade",
  "area-do-cliente",
];

// ── Erros e utilitários de saída ────────────────────────────────────

class SetupError extends Error {}

function step(label: string): void {
  console.log(`\n▶ ${label}`);
}

function ok(message: string): void {
  console.log(`  ✅ ${message}`);
}

function skip(message: string): void {
  console.log(`  ↩︎  ${message}`);
}

function isNotFound(error: unknown): boolean {
  return error instanceof AppwriteException && error.code === 404;
}

function isConflict(error: unknown): boolean {
  return error instanceof AppwriteException && error.code === 409;
}

// ── Carregamento de variáveis (parser .env próprio, sem dependências) ─

/** Lê KEY=VALUE de um arquivo .env sem sobrescrever o que já está definido. */
function loadEnvFile(path: string): void {
  if (!existsSync(path)) {
    return;
  }
  const content = readFileSync(path, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const separator = line.indexOf("=");
    if (separator <= 0) {
      continue;
    }
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    const quoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));
    if (quoted && value.length >= 2) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

// ── Resolução e validação das variáveis ─────────────────────────────

interface EnvVarSpec {
  /** Nome principal (o usado por este script). */
  key: string;
  /** Nomes alternativos aceitos (variações usadas pelo portal). */
  aliases: readonly string[];
}

const ENV_VARS = {
  endpoint: {
    key: "APPWRITE_ENDPOINT",
    aliases: ["NEXT_PUBLIC_APPWRITE_ENDPOINT"],
  },
  projectId: {
    key: "APPWRITE_PROJECT_ID",
    aliases: ["NEXT_PUBLIC_APPWRITE_PROJECT_ID"],
  },
  apiKey: { key: "APPWRITE_API_KEY", aliases: [] },
  adminEmail: { key: "ADMIN_EMAIL", aliases: [] },
  adminPassword: { key: "ADMIN_PASSWORD", aliases: [] },
  adminName: { key: "ADMIN_NAME", aliases: [] },
  databaseId: { key: "DATABASE_ID", aliases: ["APPWRITE_DATABASE_ID"] },
  userProfilesTableId: {
    key: "USER_PROFILES_TABLE_ID",
    aliases: ["APPWRITE_USER_PROFILES_TABLE_ID"],
  },
} satisfies Record<string, EnvVarSpec>;

type ConfigKey = keyof typeof ENV_VARS;

interface ResolvedEnv {
  value: string;
  /** Nome da variável de onde o valor veio (para exibição). */
  via: string;
}

type SetupConfig = Record<ConfigKey, ResolvedEnv>;

/** Interrompe se faltar variável — lista tudo o que está ausente de uma vez. */
function resolveConfig(): SetupConfig {
  const missing: string[] = [];
  const resolved = {} as SetupConfig;

  for (const field of Object.keys(ENV_VARS) as ConfigKey[]) {
    const { key, aliases } = ENV_VARS[field];
    const names = [key, ...aliases];
    const found = names.find((name) => process.env[name]?.trim());
    if (found) {
      resolved[field] = { value: process.env[found]!.trim(), via: found };
    } else {
      const hint = aliases.length > 0 ? ` (ou ${aliases.join(" / ")})` : "";
      resolved[field] = { value: "", via: key };
      missing.push(`${key}${hint}`);
    }
  }

  if (missing.length > 0) {
    throw new SetupError(
      "Variáveis de ambiente ausentes — preencha no .env.local (ver .env.example) e rode novamente:\n" +
        missing.map((name) => `  • ${name}`).join("\n"),
    );
  }
  return resolved;
}

/** Validações de formato — falham antes de qualquer chamada ao Appwrite. */
function validateConfig(config: SetupConfig): void {
  const errors: string[] = [];

  if (!/^https?:\/\//.test(config.endpoint.value)) {
    errors.push(
      "APPWRITE_ENDPOINT deve ser uma URL completa, ex.: https://nyc.cloud.appwrite.io/v1",
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.adminEmail.value)) {
    errors.push("ADMIN_EMAIL deve ser um e-mail válido.");
  }
  if (config.adminPassword.value.length < 8) {
    errors.push("ADMIN_PASSWORD deve ter pelo menos 8 caracteres (limite do Appwrite).");
  }
  if (config.adminPassword.value.length > 256) {
    errors.push("ADMIN_PASSWORD deve ter no máximo 256 caracteres.");
  }
  if (config.adminName.value.length > 128) {
    errors.push("ADMIN_NAME deve ter no máximo 128 caracteres (limite do Appwrite).");
  }
  for (const field of ["databaseId", "userProfilesTableId"] as const) {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(config[field].value)) {
      errors.push(
        `${ENV_VARS[field].key} inválido: 1–36 caracteres, iniciando por letra/número ` +
          `(permitidos: letras, números, ponto, hífen e underline).`,
      );
    }
  }

  if (errors.length > 0) {
    throw new SetupError(
      "Variáveis com valores inválidos:\n" +
        errors.map((message) => `  • ${message}`).join("\n"),
    );
  }
}

// ── Etapas do setup ─────────────────────────────────────────────────

/** 1. Endpoint responde e a API key tem os escopos mínimos (users.read). */
async function checkConnection(users: Users, endpoint: string): Promise<void> {
  try {
    await users.list({ queries: [Query.limit(1)] });
    ok(`Endpoint respondeu e a API key foi aceita (${endpoint}).`);
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new SetupError(
        `O endpoint respondeu, mas a API key foi rejeitada ` +
          `(HTTP ${error.code}${error.type ? ` — ${error.type}` : ""}). ` +
          "Confira APPWRITE_API_KEY e se a key possui os escopos: " +
          "users.read, users.write, tablesdb.read, tablesdb.write, sessions.write.",
      );
    }
    throw new SetupError(
      `Não foi possível conectar ao endpoint ${endpoint}. ` +
        "Verifique a URL (deve terminar em /v1) e a sua conexão. " +
        `Detalhe: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/** 2. Database do portal — cria apenas se não existir. */
async function ensureDatabase(
  tablesDB: TablesDB,
  databaseId: string,
): Promise<void> {
  try {
    await tablesDB.get({ databaseId });
    skip(`Database "${databaseId}" já existe — mantido.`);
    return;
  } catch (error) {
    if (!isNotFound(error)) {
      throw error;
    }
  }
  await tablesDB.create({ databaseId, name: DATABASE_NAME });
  ok(`Database "${databaseId}" (${DATABASE_NAME}) criado.`);
}

/** 3. Tabela user_profiles — cria apenas se não existir. */
async function ensureTable(
  tablesDB: TablesDB,
  databaseId: string,
  tableId: string,
): Promise<void> {
  try {
    const existing = await tablesDB.getTable({ databaseId, tableId });
    skip(`Tabela "${tableId}" já existe — mantida.`);
    const permissions = existing.$permissions ?? [];
    if (permissions.length > 0) {
      console.log(
        `  ⚠️  A tabela possui permissões próprias (${permissions.length}) — ` +
          "revise no painel se clientes não devem acessá-la.",
      );
    }
    return;
  } catch (error) {
    if (!isNotFound(error)) {
      throw error;
    }
  }
  await tablesDB.createTable({
    databaseId,
    tableId,
    name: TABLE_NAME,
    // 4. Permissões: nenhuma para clientes/usuários finais — o acesso é
    //    exclusivo do servidor (API key com escopos tablesdb.*).
    permissions: [],
    rowSecurity: false,
  });
  ok(`Tabela "${tableId}" (${TABLE_NAME}) criada.`);
}

/** 3b. Colunas — cria as que faltam; existentes são mantidas. */
async function ensureColumns(
  tablesDB: TablesDB,
  databaseId: string,
  tableId: string,
): Promise<void> {
  // `permissions` como string-array: o Appwrite não tem coluna JSON e o
  // array chega ao portal já pronto para lib/appwrite/users.ts.
  const columns: Array<{
    key: string;
    size: number;
    required: boolean;
    array?: boolean;
  }> = [
    { key: "appwrite_user_id", size: 64, required: true },
    { key: "name", size: 128, required: true },
    { key: "role", size: 32, required: true },
    { key: "company_id", size: 128, required: false },
    { key: "permissions", size: 64, required: false, array: true },
  ];

  for (const column of columns) {
    try {
      await tablesDB.createStringColumn({
        databaseId,
        tableId,
        key: column.key,
        size: column.size,
        required: column.required,
        array: column.array,
      });
      ok(
        `Coluna "${column.key}" criada ` +
          `(string${column.array ? "[]" : ""}${column.required ? ", obrigatória" : ""}).`,
      );
    } catch (error) {
      if (isConflict(error)) {
        skip(`Coluna "${column.key}" já existe — mantida.`);
        continue;
      }
      throw error;
    }
  }
}

/** 5. Usuário administrador — busca por e-mail; cria apenas se ausente. */
async function ensureAdminUser(
  users: Users,
  adminEmail: string,
  adminPassword: string,
  adminName: string,
): Promise<Models.User<Models.Preferences>> {
  const found = await users.list({
    queries: [Query.equal("email", adminEmail)],
  });
  const existing = found.users[0];
  if (existing) {
    skip(`Usuário ${adminEmail} já existe (id ${existing.$id}) — mantido.`);
    return existing;
  }
  const created = await users.create({
    userId: ID.unique(),
    email: adminEmail,
    password: adminPassword,
    name: adminName,
  });
  ok(`Usuário ${adminEmail} criado (id ${created.$id}).`);
  return created;
}

/** 6. Perfil ADMIN em user_profiles — busca pelo appwrite_user_id. */
async function ensureAdminProfile(
  tablesDB: TablesDB,
  databaseId: string,
  tableId: string,
  adminUserId: string,
  adminName: string,
): Promise<void> {
  const found = await tablesDB.listRows({
    databaseId,
    tableId,
    queries: [
      Query.equal("appwrite_user_id", adminUserId),
      Query.limit(1),
    ],
  });
  const existing = found.rows[0];
  if (existing) {
    const role = (existing as Record<string, unknown>)["role"];
    skip(
      `Perfil já existe em "${tableId}" (role: ${typeof role === "string" ? role : "?"}) — mantido.`,
    );
    if (role !== ADMIN_ROLE) {
      console.log(
        `  ⚠️  O perfil existente não tem role "${ADMIN_ROLE}" — ajuste no painel se necessário.`,
      );
    }
    return;
  }
  await tablesDB.createRow({
    databaseId,
    tableId,
    rowId: ID.unique(),
    data: {
      appwrite_user_id: adminUserId,
      name: adminName,
      role: ADMIN_ROLE,
      permissions: [...ADMIN_PERMISSIONS],
    },
  });
  ok(
    `Perfil ADMIN criado em "${tableId}" ` +
      `(permissions: ${ADMIN_PERMISSIONS.join(", ")}).`,
  );
}

// ── Execução ────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // .env primeiro, .env.local depois (o local prevalece; o ambiente do
  // shell prevalece sobre ambos).
  loadEnvFile(".env");
  loadEnvFile(".env.local");

  const config = resolveConfig();
  console.log("== Setup do Appwrite — Portal PHIQ ==");
  console.log(
    `  endpoint   : ${config.endpoint.value} ` +
      `(via ${config.endpoint.via})`,
  );
  console.log(`  project    : ${config.projectId.value} (via ${config.projectId.via})`);
  console.log(`  api key    : *** (via ${config.apiKey.via})`);
  console.log(`  database   : ${config.databaseId.value} (via ${config.databaseId.via})`);
  console.log(
    `  tabela     : ${config.userProfilesTableId.value} ` +
      `(via ${config.userProfilesTableId.via})`,
  );

  validateConfig(config);

  const client = new Client()
    .setEndpoint(config.endpoint.value)
    .setProject(config.projectId.value)
    .setKey(config.apiKey.value);
  const tablesDB = new TablesDB(client);
  const users = new Users(client);

  step("1/6 — Validando conexão e escopos da API key");
  await checkConnection(users, config.endpoint.value);

  step("2/6 — Database");
  await ensureDatabase(tablesDB, config.databaseId.value);

  step("3/6 — Tabela user_profiles");
  await ensureTable(
    tablesDB,
    config.databaseId.value,
    config.userProfilesTableId.value,
  );
  await ensureColumns(
    tablesDB,
    config.databaseId.value,
    config.userProfilesTableId.value,
  );

  step("4/6 — Permissões (servidor apenas)");
  console.log(
    "  ✅ Tabela acessível somente pela API key do servidor — " +
      "usuários finais não podem ler nem alterar perfis.",
  );

  step("5/6 — Usuário administrador");
  const admin = await ensureAdminUser(
    users,
    config.adminEmail.value,
    config.adminPassword.value,
    config.adminName.value,
  );

  step("6/6 — Perfil ADMIN em user_profiles");
  await ensureAdminProfile(
    tablesDB,
    config.databaseId.value,
    config.userProfilesTableId.value,
    admin.$id,
    config.adminName.value,
  );

  console.log("\n✅ Setup concluído com sucesso.");
  console.log(
    `   Faça o primeiro login no portal com: ${config.adminEmail.value}`,
  );
}

main().catch((error: unknown) => {
  const message =
    error instanceof SetupError
      ? error.message
      : error instanceof AppwriteException
        ? `Erro do Appwrite (HTTP ${error.code}${error.type ? ` — ${error.type}` : ""}): ${error.message}`
        : `Erro inesperado: ${error instanceof Error ? error.message : String(error)}`;
  console.error(`\n❌ Setup interrompido.\n${message}`);
  process.exitCode = 1;
});