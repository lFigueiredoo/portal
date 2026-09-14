import { User } from "lucide-react";
import Link from "next/link";

import Logo from "@/components/Logo";
import MobileNav from "@/components/MobileNav";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Sistemas", href: "/#solucoes" },
  { label: "Sobre", href: "/#sobre" },
] as const;

const NAV_ACTIONS = [
  { label: "Acessar minha conta", variant: "solid" },
] as const;

export default function Header() {
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
          href="/"
          aria-label="Portal PHIQ — página inicial"
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

        {/* Botão do portal — sólido, corporativo e elegante */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2.5 rounded-lg bg-phiq-primary px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-phiq-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-phiq-dark hover:shadow-lg hover:shadow-phiq-dark/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2 sm:px-5"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/15">
              <User className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="hidden sm:inline">Acessar minha conta</span>
            <span className="sm:hidden">Minha conta</span>
          </button>

          <MobileNav links={NAV_LINKS} actions={NAV_ACTIONS} />
        </div>
      </div>
    </header>
  );
}







