import Link from "next/link";

import Logo from "@/components/Logo";
import {
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/SocialIcons";

const SOCIAL_LINKS = [
  { label: "Instagram da PHIQ", icon: InstagramIcon, href: "https://instagram.com" },
  { label: "LinkedIn da PHIQ", icon: LinkedinIcon, href: "https://linkedin.com" },
  { label: "YouTube da PHIQ", icon: YoutubeIcon, href: "https://youtube.com" },
] as const;

const FOOTER_LINKS = [
  { label: "Início", href: "/dashboard" },
  { label: "Sistemas", href: "/dashboard#solucoes" },
  { label: "Sobre", href: "/dashboard#sobre" },
  { label: "Contato", href: "mailto:contato@phiq.com.br" },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="sobre" className="relative scroll-mt-24 bg-phiq-dark text-white">
      {/* ── Footer principal — compacto ───────────────────────────── */}
      <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-10">
        {/* Esquerda: logo + institucional */}
        <div className="flex items-center gap-5">
          <Logo variant="light" />
          <div>
            <p className="text-sm font-semibold tracking-tight">
              PHIQ — Philipéia Indústria Química Ltda.
            </p>
            <p className="mt-0.5 text-sm text-white/55">
              Soluções para um futuro mais limpo.
            </p>
          </div>
        </div>

        {/* Centro: links */}
        <nav
          aria-label="Links do rodapé"
          className="flex flex-wrap items-center gap-x-7 gap-y-2 text-sm lg:justify-center"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-lg text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Direita: redes sociais */}
        <div className="flex items-center gap-2.5">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/15 transition-all duration-200 hover:bg-phiq-primary hover:text-white hover:ring-phiq-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <social.icon className="h-4 w-4" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      {/* ── Barra inferior — mais discreta ────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-1 px-6 py-2.5 text-[0.7rem] text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span>portal.phiq.com.br</span>
          <span>© {year} PHIQ</span>
        </div>
      </div>
    </footer>
  );
}
