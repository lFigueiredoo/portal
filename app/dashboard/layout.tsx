import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { requireUser } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: "Dashboard · Portal PHIQ",
};

// Autenticação é sempre por request — nunca pré-renderizar estas rotas.
export const dynamic = "force-dynamic";

/**
 * Layout das rotas autenticadas. `requireUser()` é a verificação REAL
 * de sessão (DAL) — redireciona para /login sem sessão válida, mesmo
 * que o `proxy.ts` seja contornado.
 */
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();

  return (
    <>
      <Header user={user} />
      {children}
      <Footer />
    </>
  );
}