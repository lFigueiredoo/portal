import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";

import { logout } from "@/app/actions/auth";
import Logo from "@/components/Logo";
import { getAuthState } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: "Acesso não configurado · Portal PHIQ",
  robots: { index: false, follow: false },
};

// Estado de acesso sempre verificado por request — nunca pré-renderizar.
export const dynamic = "force-dynamic";

/**
 * Exibida a quem autentica no Appwrite mas ainda não tem perfil
 * (`user_profiles`) configurado no Portal. O usuário NÃO entra no
 * dashboard — vê a mensagem e pode encerrar a sessão.
 */
export default async function NoAccessPage() {
  const state = await getAuthState();
  if (state.status === "anon") {
    redirect("/login");
  }
  if (state.status === "ok") {
    redirect("/dashboard");
  }

  return (
    <main
      id="conteudo"
      className="flex min-h-screen flex-col items-center justify-center px-4 py-10"
    >
      <div className="w-full max-w-[26rem]">
        <div className="rounded-3xl bg-white px-7 pb-8 pt-9 shadow-xl shadow-phiq-dark/8 ring-1 ring-[#E5EEEE] sm:px-9">
          <div className="flex flex-col items-center text-center">
            <Logo />
            <span className="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-phiq-primary">
              Portal PHIQ
            </span>
            <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-phiq-dark">
              Acesso não configurado
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-phiq-muted">
              Sua conta foi autenticada, mas o acesso ao Portal PHIQ
              <br className="hidden sm:block" /> ainda não foi configurado
              para este usuário.
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-phiq-bg px-4 py-3.5 text-center">
            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-phiq-muted">
              Autenticado como
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-phiq-dark">
              {state.email}
            </p>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-phiq-muted">
            Solicite ao administrador da PHIQ a liberação do seu acesso.
            <br />
            Depois de liberado, entre novamente com as suas credenciais.
          </p>

          <form action={logout} className="mt-6">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-phiq-dark/15 bg-white px-4 py-2.5 text-sm font-semibold text-phiq-dark transition-all duration-200 hover:border-phiq-primary/40 hover:text-phiq-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair da conta
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs leading-relaxed text-phiq-muted">
          © {new Date().getFullYear()} PHIQ — Philipéia Indústria Química Ltda.
        </p>
      </div>
    </main>
  );
}