import Image from "next/image";

import { ArrowRight, Sparkles } from "lucide-react";

/**
 * Imagem institucional da coluna visual do hero.
 *
 * Se o asset existir em `public/`, o hero usa a foto institucional
 * (next/image, fill + object-cover). Se a constante for `null`
 * (ex.: arquivo indisponível), renderiza a variante institucional com
 * gradiente da marca + padrão de pontos — nunca mockups de software.
 */
const HERO_IMAGE: string | null = "/hero-industry.jpg";

/* Padrão de pontos sutil (apenas na variante gradiente). */
function HeroPattern() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-15"
    >
      <defs>
        <pattern
          id="hero-dots"
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="1.5" fill="#FFFFFF" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-dots)" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-white"
    >
      {/* Divisor suave entre o hero e a faixa seguinte */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-phiq-dark/10 to-transparent"
      />

      {/* Brilho decorativo suave */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-phiq-primary/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pb-24 lg:pt-20">
        {/* Coluna de texto */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-phiq-primary/15 bg-phiq-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-phiq-primary">
            Central digital da PHIQ
          </span>

          <h1
            id="hero-title"
            className="mt-6 text-4xl font-bold tracking-tight text-phiq-dark sm:text-5xl lg:text-6xl"
          >
            Portal PHIQ
          </h1>

          <p className="mt-5 max-w-xl text-xl font-semibold leading-snug text-phiq-dark sm:text-2xl">
            O ecossistema digital que conecta qualidade, gestão e conhecimento.
          </p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-phiq-muted sm:text-lg">
            Acesse documentos, indicadores, sistemas e soluções PHIQ em um
            único lugar.
          </p>

          <div className="mt-8">
            <a
              href="#solucoes"
              className="group inline-flex items-center gap-2 rounded-2xl bg-phiq-primary px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-phiq-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-phiq-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2"
            >
              Acessar sistemas
              <ArrowRight
                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        {/* Coluna visual — imagem institucional */}
        <div>
          <div className="relative min-h-[360px] w-full overflow-hidden rounded-3xl shadow-2xl shadow-phiq-dark/25 ring-1 ring-phiq-dark/10 sm:min-h-[440px] lg:min-h-[540px]">
            {HERO_IMAGE ? (
              <Image
                src={HERO_IMAGE}
                alt="Vidraria e tubos de ensaio em laboratório durante análises de qualidade"
                fill
                priority
                sizes="(min-width: 1024px) 33rem, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-phiq-primary to-phiq-dark">
                <HeroPattern />
              </div>
            )}

            {/* Gradiente verde sutil na base da imagem */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-phiq-dark/90 via-phiq-primary/40 to-transparent"
            />

            {/* Chip de identidade sobre a imagem */}
            <span className="absolute bottom-5 left-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-phiq-accent px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-phiq-accent/30">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Qualidade PHIQ
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}