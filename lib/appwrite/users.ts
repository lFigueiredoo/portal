import "server-only";

import { Query } from "node-appwrite";

import { getAppwriteConfig, createAdminClient } from "@/lib/appwrite/client";
import { PERMISSION_KEYS, type PermissionKey, type Role } from "@/lib/auth/types";

/**
 * Informações adicionais do usuário — tabela `user_profiles` no banco
 * do Appwrite. A identidade (conta, e-mail, senha) é do Appwrite Auth;
 * aqui ficam os dados que o PORTAL controla:
 *
 *   coluna            tipo          conteúdo
 *   appwrite_user_id  string        account.$id (chave de busca)
 *   name              string        nome de exibição (opcional)
 *   role              string        ADMIN | COLABORADOR | FRANQUEADO | CLIENTE
 *   company_id        string        empresa vinculado (opcional)
 *   permissions       string[]      chaves explícitas (opcional; vazio = padrão do papel)
 */

/** Perfil do usuário no banco do Appwrite (papel + permissões). */
export interface UserProfile {
  role?: Role;
  /** Permissões explícitas; ausente/vazio = usa o padrão do papel. */
  permissions?: PermissionKey[];
  name?: string;
  companyId?: string;
}

/** Converte o valor do campo role para um papel válido ou `null`. */
function parseRole(value: unknown): Role | undefined {
  return typeof value === "string" &&
    ["ADMIN", "COLABORADOR", "FRANQUEADO", "CLIENTE"].includes(value)
    ? (value as Role)
    : undefined;
}

/** Filtra apenas chaves de permissão conhecidas (defesa contra dados inválidos). */
function parsePermissions(value: unknown): PermissionKey[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const permissions = value.filter(
    (key): key is PermissionKey =>
      typeof key === "string" && PERMISSION_KEYS.includes(key),
  );
  // Array vazio = sem permissões explícitas → usa o padrão do papel.
  return permissions.length > 0 ? permissions : undefined;
}

function missingProfileSource(): boolean {
  const config = getAppwriteConfig();
  return !config.databaseId || !config.userProfilesTableId;
}

/**
 * Busca o perfil (role/permissions) do usuário na tabela `user_profiles`.
 * Sem tabela configurada ou linha inexistente → `null` (o DAL aplica o
 * papel padrão CLIENTE). Erros de consulta são registrados, nunca propagados.
 */
export async function getUserProfile(appwriteUserId: string): Promise<UserProfile | null> {
  if (missingProfileSource()) {
    return null;
  }

  const config = getAppwriteConfig();
  const { tablesDB } = createAdminClient();

  try {
    const result = await tablesDB.listRows({
      databaseId: config.databaseId as string,
      tableId: config.userProfilesTableId as string,
      queries: [
        Query.equal("appwrite_user_id", appwriteUserId),
        Query.limit(1),
      ],
    });

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    const columns = row as Record<string, unknown>;
    const permissions = parsePermissions(columns["permissions"]);
    const role = parseRole(columns["role"]);

    return {
      role,
      permissions,
      name: typeof columns["name"] === "string" ? columns["name"] : undefined,
      companyId:
        typeof columns["company_id"] === "string"
          ? columns["company_id"]
          : undefined,
    };
  } catch (error) {
    console.warn(
      "[appwrite] não foi possível carregar o perfil do usuário:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}