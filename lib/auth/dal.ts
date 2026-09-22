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
 * Regra de acesso: autenticado no Appwrite SEM perfil válido em
 * `user_profiles` → acesso BLOQUEADO (não há mais papel padrão).
 * Com perfil → papel do perfil, com permissões explícitas tendo
 * prioridade sobre o padrão do papel.
 *
 * O `proxy.ts` é apenas a verificação otimista (presença do cookie); a
 * proteção REAL acontece aqui — chamado por páginas e Server Actions.
 *
 * Memoizado por request via React `cache`.
 */

/** Estado de acesso do visitante — a raiz de todas as verificações do portal. */
export type AuthState =
  /** Sem sessão válida no Appwrite. */
  | { status: "anon" }
  /** Autenticado, mas sem perfil válido em `user_profiles` — acesso não configurado. */
  | { status: "blocked"; name: string; email: string }
  /** Autenticado e autorizado a usar o portal. */
  | { status: "ok"; user: PublicUser };

export const getAuthState = cache(async (): Promise<AuthState> => {
  // account.get() no Appwrite — a verificação real da sessão.
  const account = await getAccount();
  if (!account) {
    return { status: "anon" };
  }

  // Perfil com papel/permissões no banco do Appwrite. Sem perfil (ou sem
  // papel válido na linha) o acesso NÃO é liberado — fail-closed.
  const profile = await getUserProfile(account.$id);
  if (!profile?.role) {
    console.warn(
      "[auth] usuário autenticado sem perfil válido em `user_profiles` — acesso bloqueado:",
      account.email || account.$id,
    );
    return {
      status: "blocked",
      name: account.name || account.email,
      email: account.email,
    };
  }

  const role: Role = profile.role;
  return {
    status: "ok",
    user: {
      id: account.$id,
      name: account.name || profile.name || account.email,
      email: account.email,
      role,
      permissions: profile.permissions ?? ROLE_DEFAULT_PERMISSIONS[role],
      companyId: profile.companyId,
    },
  };
});

/** Usuário autorizado (DTO público) ou `null` — sem sessão OU sem perfil. */
export const getCurrentUser = cache(async (): Promise<PublicUser | null> => {
  const state = await getAuthState();
  return state.status === "ok" ? state.user : null;
});

/** Exige autenticação — /login sem sessão, /sem-acesso sem perfil. */
export async function requireUser(): Promise<PublicUser> {
  const state = await getAuthState();
  if (state.status === "anon") {
    redirect("/login");
  }
  if (state.status === "blocked") {
    redirect("/sem-acesso");
  }
  return state.user;
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