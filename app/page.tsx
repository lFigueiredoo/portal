import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/dal";

// Sempre por request — o destino depende da sessão do visitante.
export const dynamic = "force-dynamic";

/**
 * A raiz do portal é apenas um ponto de entrada: sem sessão → /login,
 * com sessão → /dashboard. O `proxy.ts` normalmente resolve isto antes;
 * este redirecionamento é a defesa adicional no servidor.
 */
export default async function RootPage() {
  const user = await getCurrentUser();
  redirect(user ? "/dashboard" : "/login");
}