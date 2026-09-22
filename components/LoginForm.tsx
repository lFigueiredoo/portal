"use client";

import { useActionState } from "react";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";

import { login, type LoginState } from "@/app/actions/auth";

type LoginFormProps = {
  /** Destino pós-login informado pela proteção de rotas (?next=...). */
  next?: string;
};

const INITIAL_STATE: LoginState = {};

export default function LoginForm({ next }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(login, INITIAL_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {/* Preserva o destino original (rota protegida acessada sem sessão) */}
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {/* Mensagem de erro — genérica, não revela se o e-mail existe */}
      {state.error ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{state.error}</span>
        </div>
      ) : null}

      {/* E-mail */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-semibold text-phiq-dark"
        >
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email}
          placeholder="nome@empresa.com.br"
          className="h-11 rounded-xl border border-phiq-dark/15 bg-white px-3.5 text-sm text-phiq-dark outline-none transition-colors placeholder:text-phiq-muted/60 hover:border-phiq-dark/25 focus:border-phiq-primary focus:ring-2 focus:ring-phiq-primary/20"
        />
      </div>

      {/* Senha */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor="password" className="text-sm font-semibold text-phiq-dark">
            Senha
          </label>
          {/* TODO: apontar para o fluxo real de recuperação quando existir */}
          <a
            href="mailto:contato@phiq.com.br?subject=Recuperação%20de%20senha%20—%20Portal%20PHIQ"
            className="rounded-lg text-[0.8rem] font-semibold text-phiq-primary transition-colors hover:text-phiq-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary"
          >
            Esqueci minha senha
          </a>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Sua senha"
          className="h-11 rounded-xl border border-phiq-dark/15 bg-white px-3.5 text-sm text-phiq-dark outline-none transition-colors placeholder:text-phiq-muted/60 hover:border-phiq-dark/25 focus:border-phiq-primary focus:ring-2 focus:ring-phiq-primary/20"
        />
      </div>

      {/* Entrar */}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-phiq-primary px-5 text-sm font-semibold text-white shadow-md shadow-phiq-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-phiq-dark hover:shadow-lg hover:shadow-phiq-dark/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Entrando…
          </>
        ) : (
          <>
            Entrar
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}