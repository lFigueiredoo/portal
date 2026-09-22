import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { getAccount } from "@/lib/appwrite/auth";
import { getUserProfile } from "@/lib/appwrite/users";
import { ROLE_DEFAULT_PERMISSIONS, hasPermission } from "@/lib/auth/permissions";
import type { PermissionKey, PublicUser, Role } from "@/lib/auth/types";

/**
 * Data Access Layer de autenticação — ponto único de verificação de
 * sessão/autorização no servidor. A sessão é do Appwrite Auth
 * (account.get()); as permissões continuam sob controle do PORTAL
 * (perfil em `user_profiles` + lib/auth/permissions.ts).
 *
 * O `proxy.ts` é apenas a verificação otimista (presença do cookie); a
 * proteção REAL acontece aqui — chamado por páginas e Server Actions.
 *
 * Memoizado por request via React `cache`.
 */

/** Usuário autenticado (DTO público) ou `null` sem sessão válida. */
export const getCurrentUser = cache(async (): Promise<PublicUser | null> => {
  // account.get() no Appwrite — a verificação real da sessão.
  const account = await getAccount();
  if (!account) {
    return null;
  }

  // Perfil com papel/permissões no banco do Appwrite.
  const profile = await getUserProfile(account.$id);
  const role: Role = profile?.role ?? "CLIENTE";

  return {
    id: account.$id,
    name: account.name || profile?.name || account.email,
    email: account.email,
    role,
    permissions: profile?.permissions ?? ROLE_DEFAULT_PERMISSIONS[role],
    companyId: profile?.companyId,
  };
});

/** Exige autenticação — redireciona para /login caso contrário. */
export async function requireUser(): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/** Exige autenticação + permissão específica (uso em rotas/ações futuras). */
export async function requirePermission(
  permission: PermissionKey,
): Promise<PublicUser> {
  const user = await requireUser();
  if (!hasPermission(user, permission)) {
    redirect("/dashboard");
  }
  return user;
}