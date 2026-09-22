/**
 * Controle de acesso por perfil/permissão.
 *
 * Cada usuário possui um `role`. O papel concede um conjunto padrão de
 * permissões; o usuário pode ter permissões explícitas (campo
 * `permissions` no perfil em `user_profiles`) que substituem o padrão
 * do papel.
 *
 * A identidade vem do Appwrite Auth; este módulo é a camada de acesso
 * do PORTAL — se o provedor de identidade mudar, estas funções permanecem.
 */

import type { PermissionKey, Role } from "@/lib/auth/types";

/** Permissões padrão por papel (quando o usuário não tem lista explícita). */
export const ROLE_DEFAULT_PERMISSIONS: Record<Role, PermissionKey[]> = {
  ADMIN: ["edocs", "area-do-cliente", "crm", "bi", "universidade"],
  COLABORADOR: ["crm", "bi", "universidade"],
  FRANQUEADO: ["edocs", "universidade"],
  CLIENTE: ["edocs", "area-do-cliente", "universidade"],
};

/** Permissões efetivas do usuário — explícitas ou herdadas do papel. */
export function getEffectivePermissions(user: {
  role: Role;
  permissions?: PermissionKey[];
}): PermissionKey[] {
  return user.permissions ?? ROLE_DEFAULT_PERMISSIONS[user.role] ?? [];
}

/** Verifica se o usuário possui a permissão indicada. */
export function hasPermission(
  user: { role: Role; permissions?: PermissionKey[] },
  permission: PermissionKey,
): boolean {
  return getEffectivePermissions(user).includes(permission);
}