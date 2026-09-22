import { LogOut } from "lucide-react";
import Link from "next/link";

import { logout } from "@/app/actions/auth";
import Logo from "@/components/Logo";
import MobileNav from "@/components/MobileNav";
import { ROLE_LABEL, type PublicUser } from "@/lib/auth/types";

const NAV_LINKS = [
  { label: "Início", href: "/dashboard" },
  { label: "Sistemas", href: "/dashboard#solucoes" },
  { label: "Sobre", href: "/dashboard#sobre" },
] as const;

/** Iniciais do nome (até 2) para o avatar do usuário. */
function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type HeaderProps = {
  /** Usuário autenticado (dashboard). Sempre presente — as rotas públicas não usam este header. */
  user: PublicUser;
};

export default function Header({ user }: HeaderProps) {
  const mobileActions = [
    { label: "Sair", variant: "outline" as const, action: logout },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-phiq-dark/10 bg-white">
      {/* Atalho de acessibilidade para o conteúdo principal */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-xl focus:bg-phiq-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Pular para o conteúdo
      </a>

      <div className="mx-auto flex h-[64px] max-w-[80rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo à esquerda */}
        <Link
          href="/dashboard"
          aria-label="Portal PHIQ — início"
          className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2"
        >
          <Logo />
        </Link>

        {/* Menu central simples e institucional */}
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1.5 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-2 text-[0.925rem] font-medium text-phiq-dark/75 transition-colors hover:bg-phiq-primary/5 hover:text-phiq-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Usuário autenticado — chip com iniciais + sair */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2.5 sm:flex">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-phiq-primary/10 text-xs font-bold text-phiq-primary ring-1 ring-phiq-primary/20"
            >
              {initialsOf(user.name)}
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-phiq-dark">
                {user.name}
              </span>
              <span className="text-[0.7rem] font-medium text-phiq-muted">
                {ROLE_LABEL[user.role]}
              </span>
            </span>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-phiq-dark/15 bg-white px-3.5 py-2 text-xs font-semibold text-phiq-dark transition-all duration-200 hover:-translate-y-0.5 hover:border-phiq-primary/40 hover:text-phiq-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </form>

          <MobileNav links={NAV_LINKS} actions={mobileActions} />
        </div>
      </div>
    </header>
  );
}