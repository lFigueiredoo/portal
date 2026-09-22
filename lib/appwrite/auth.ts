import "server-only";

import { cookies } from "next/headers";
import type { Models } from "node-appwrite";

import {
  SESSION_COOKIE,
  createAdminClient,
  createSessionClient,
  isAppwriteConfigured,
} from "@/lib/appwrite/client";

/**
 * Autenticação via Appwrite Auth — o Appwrite é o provedor oficial de
 * identidade do Portal (criação de usuários, login, logout, sessão e,
 * futuramente, recuperação de senha). O Portal mantém o controle de
 * permissões (lib/auth/permissions.ts) por cima do perfil no banco.
 */

/** Erro usado quando as variáveis de ambiente do Appwrite não estão definidas. */
export class AppwriteNotConfiguredError extends Error {
  constructor() {
    super(
      "Autenticação indisponível: configure as variáveis do Appwrite " +
        "(ver .env.example).",
    );
    this.name = "AppwriteNotConfiguredError";
  }
}

/**
 * Autentica com e-mail/senha (account.createEmailPasswordSession) e grava
 * o `session.secret` no cookie httpOnly do Portal.
 */
export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<void> {
  if (!isAppwriteConfigured()) {
    throw new AppwriteNotConfiguredError();
  }

  const { account } = createAdminClient();
  const session = await account.createEmailPasswordSession({ email, password });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.secret, {
    httpOnly: true,
    // Em HTTP local (dev) `secure` bloquearia o cookie; em produção é sempre HTTPS.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // A sessão expira exatamente quando a sessão do Appwrite expira.
    expires: new Date(session.expire),
  });
}

/** Usuário autenticado (account.get()) ou `null` sem sessão válida. */
export async function getAccount(): Promise<Models.User<Models.Preferences> | null> {
  // Leitura do cookie SEMPRE acontece — mesmo sem Appwrite configurado —
  // para que as rotas dependam de dados de request (render dinâmico).
  const secret = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!secret || !isAppwriteConfigured()) {
    return null;
  }

  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    // Sessão inválida/expirada ou Appwrite indisponível → tratado como sem sessão.
    console.warn(
      "[appwrite] sessão inválida ou indisponível:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/** Encerra a sessão no Appwrite (device atual) e remove o cookie. */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  if (cookieStore.get(SESSION_COOKIE)?.value) {
    try {
      const { account } = await createSessionClient();
      await account.deleteSession({ sessionId: "current" });
    } catch {
      // Sessão já inválida no Appwrite — apenas limpe o cookie local.
    }
  }
  cookieStore.delete(SESSION_COOKIE);
}