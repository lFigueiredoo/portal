import "server-only";

import { cookies } from "next/headers";
import { Account, Client, TablesDB } from "node-appwrite";

/**
 * Inicialização do SDK Appwrite (node-appwrite — Server SDK).
 *
 * Dois clientes, conforme o guia oficial de SSR do Appwrite:
 * - `createAdminClient()` — usa APPWRITE_API_KEY; cria sessões (login) e
 *   consulta a tabela de perfis. A chave NUNCA vai para o navegador.
 * - `createSessionClient()` — criado por request com a sessão do usuário
 *   (cookie), para chamadas em nome do usuário (ex.: account.get()).
 */

/** Nome do cookie onde o Portal guarda o segredo da sessão do Appwrite. */
export const SESSION_COOKIE = "appwrite_session";

export interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  apiKey: string;
  databaseId?: string;
  userProfilesTableId?: string;
}

export function getAppwriteConfig(): Partial<AppwriteConfig> {
  return {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    apiKey: process.env.APPWRITE_API_KEY,
    databaseId: process.env.APPWRITE_DATABASE_ID,
    userProfilesTableId: process.env.APPWRITE_USER_PROFILES_TABLE_ID,
  };
}

/** true quando endpoint/project/key estão definidas (núcleo do Appwrite). */
export function isAppwriteConfigured(): boolean {
  const config = getAppwriteConfig();
  return Boolean(config.endpoint && config.projectId && config.apiKey);
}

function missingConfigError(): Error {
  return new Error(
    "Appwrite não configurado: defina NEXT_PUBLIC_APPWRITE_ENDPOINT, " +
      "NEXT_PUBLIC_APPWRITE_PROJECT_ID e APPWRITE_API_KEY (ver .env.example).",
  );
}

/** Cliente com API key — para Server Actions e consultas ao banco. */
export function createAdminClient(): {
  client: Client;
  account: Account;
  tablesDB: TablesDB;
} {
  const config = getAppwriteConfig();
  if (!config.endpoint || !config.projectId || !config.apiKey) {
    throw missingConfigError();
  }

  const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);

  return {
    client,
    account: new Account(client),
    tablesDB: new TablesDB(client),
  };
}

/**
 * Cliente da sessão do usuário — criado A CADA REQUEST com o segredo do
 * cookie (nunca reutilizar entre requests). Sem cookie → cliente sem
 * sessão (account.get() responde 401, tratado como não autenticado).
 */
export async function createSessionClient(): Promise<{
  client: Client;
  account: Account;
}> {
  const config = getAppwriteConfig();
  if (!config.endpoint || !config.projectId) {
    throw missingConfigError();
  }

  const secret = (await cookies()).get(SESSION_COOKIE)?.value;
  const client = new Client().setEndpoint(config.endpoint).setProject(config.projectId);
  if (secret) {
    client.setSession(secret);
  }

  return { client, account: new Account(client) };
}