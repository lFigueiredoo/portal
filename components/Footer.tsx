import Link from "next/link";

import Logo from "@/components/Logo";

const FOOTER_LINKS = [
  { label: "Portal PHIQ", href: "/" },
  { label: "Sistemas", href: "/#solucoes" },
  { label: "Sobre", href: "/#sobre" },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="sobre" className="scroll-mt-24 bg-phiq-dark text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:gap-16">
          <div>
            <Logo variant="light" />
            <p className="mt-4 text-sm text-white/70">
              Philipéia Indústria Química Ltda.
            </p>
            <p className="mt-2 max-w-sm text-lg font-semibold text-white sm:text-xl">
              Soluções para um futuro mais limpo.
            </p>
          </div>

          <nav aria-label="Links do rodapé">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Navegação
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-lg text-sm text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <span>portal.phiq.com.br</span>
          <span>© {year} PHIQ — Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}