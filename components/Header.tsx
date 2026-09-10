import Link from "next/link";

import Logo from "@/components/Logo";
import MobileNav from "@/components/MobileNav";

const NAV_LINKS = [
  { label: "Portal PHIQ", href: "/" },
  { label: "Sistemas", href: "/#solucoes" },
  { label: "Sobre", href: "/#sobre" },
] as const;

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-phiq-dark/10 bg-white/80 backdrop-blur-md">
      {/* Atalho de acessibilidade para o conteúdo principal */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-xl focus:bg-phiq-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Pular para o conteúdo
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Portal PHIQ — página inicial"
          className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2"
        >
          <Logo />
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-phiq-dark/80 transition-colors hover:bg-phiq-primary/5 hover:text-phiq-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Login único PHIQ: apenas visual por enquanto */}
          <button
            type="button"
            className="inline-flex items-center rounded-xl border border-phiq-primary/40 px-4 py-2 text-sm font-semibold text-phiq-primary transition-colors hover:bg-phiq-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2"
          >
            Entrar
          </button>

          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}