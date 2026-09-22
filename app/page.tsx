import { redirect } from "next/navigation";

import { getAuthState } from "@/lib/auth/dal";

// Sempre por request — o destino depende do estado de acesso do visitante.
export const dynamic = "force-dynamic";

/**
 * A raiz do portal é apenas um ponto de entrada: sem sessão → /login,
 * autenticado sem perfil → /sem-acesso, com acesso → /dashboard. O
 * `proxy.ts` normalmente resolve isto antes; este redirecionamento é a
 * defesa adicional no servidor.
 */
export default async function RootPage() {
  const state = await getAuthState();
  if (state.status === "anon") {
    redirect("/login");
  }
  redirect(state.status === "blocked" ? "/sem-acesso" : "/dashboard");
}