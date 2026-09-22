import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Logo from "@/components/Logo";
import LoginForm from "@/components/LoginForm";
import { getAuthState } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: "Entrar · Portal PHIQ",
  robots: { index: false, follow: false },
};

// Sessão sempre verificada por request — nunca pré-renderizar.
export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Defesa extra: quem tem acesso vai para o dashboard; autenticado sem
  // perfil configurado vai para a página de acesso bloqueado.
  const state = await getAuthState();
  if (state.status === "ok") {
    redirect("/dashboard");
  }
  if (state.status === "blocked") {
    redirect("/sem-acesso");
  }

  const { next } = await searchParams;

  return (
    <main
      id="conteudo"
      className="flex min-h-screen flex-col items-center justify-center px-4 py-10"
    >
      {/* Card de acesso — limpo, centralizado, identidade PHIQ */}
      <div className="w-full max-w-[26rem]">
        <div className="rounded-3xl bg-white px-7 pb-8 pt-9 shadow-xl shadow-phiq-dark/8 ring-1 ring-[#E5EEEE] sm:px-9">
          <div className="flex flex-col items-center text-center">
            <Logo />
            <span className="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-phiq-primary">
              Portal PHIQ
            </span>
            <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-phiq-dark">
              Acesse sua conta
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-phiq-muted">
              Entre com as suas credenciais para acessar os
              <br className="hidden sm:block" /> sistemas da PHIQ.
            </p>
          </div>

          <div className="mt-7">
            <LoginForm next={next} />
          </div>
        </div>

        <p className="mt-5 text-center text-xs leading-relaxed text-phiq-muted">
          Acesso restrito a colaboradores, franqueados e clientes PHIQ.
          <br />
          © {new Date().getFullYear()} PHIQ — Philipéia Indústria Química Ltda.
        </p>
      </div>
    </main>
  );
}