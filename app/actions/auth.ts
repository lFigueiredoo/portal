"use server";

import { redirect } from "next/navigation";
import { AppwriteException } from "node-appwrite";

import {
  AppwriteNotConfiguredError,
  loginWithCredentials,
  logout as appwriteLogout,
} from "@/lib/appwrite/auth";

/** Estado retornado pela ação de login para o formulário (useActionState). */
export interface LoginState {
  /** Mensagem de erro genérica exibida acima do botão. */
  error?: string;
  /** E-mail digitado (mantido no campo após falha). */
  email?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Destinos pós-login aceitos — apenas caminhos relativos internos,
 * para evitar open redirect (`//malicioso`, `https://...` são rejeitados).
 */
function safeNextPath(value: FormDataEntryValue | null): string | null {
  const next = typeof value === "string" ? value.trim() : "";
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("://")) {
    return null;
  }
  return next;
}

/** Traduz erros do Appwrite para mensagens seguras e amigáveis. */
function describeLoginError(error: unknown): string {
  if (error instanceof AppwriteNotConfiguredError) {
    return error.message;
  }
  if (error instanceof AppwriteException) {
    if (error.type === "user_invalid_credentials" || error.code === 401) {
      return "E-mail ou senha inválidos.";
    }
    if (error.code === 429) {
      return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
    }
  }
  return "Falha ao entrar. Tente novamente em instantes.";
}

/**
 * Autentica via Appwrite Auth e cria a sessão. Falhas devolvem mensagem
 * genérica (não revelam se o e-mail existe).
 */
export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (!email || !password) {
    return { error: "Informe e-mail e senha.", email };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Informe um e-mail válido.", email };
  }

  try {
    await loginWithCredentials(email, password);
  } catch (error) {
    return { error: describeLoginError(error), email };
  }

  redirect(next ?? "/dashboard");
}

/** Encerra a sessão (Appwrite + cookie) e volta para a tela de login. */
export async function logout(): Promise<void> {
  await appwriteLogout();
  redirect("/login");
}