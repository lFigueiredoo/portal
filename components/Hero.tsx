import {
  ArrowRight,
  ChartColumn,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Sparkles,
} from "lucide-react";

/* Alturas (%) das barras do mock de indicadores */
const CHART_BARS = [42, 66, 54, 80, 62, 92, 74];

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
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Brilho decorativo suave */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-phiq-primary/10 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pb-24 lg:pt-20">
        {/* Coluna de texto */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-phiq-accent/30 bg-phiq-accent/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-phiq-dark">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-phiq-accent"
            />
            Central digital da PHIQ
          </span>

          <h1
            id="hero-title"
            className="mt-6 text-4xl font-bold tracking-tight text-phiq-dark sm:text-5xl lg:text-6xl"
          >
            Portal PHIQ
          </h1>

          <p className="mt-4 max-w-xl text-lg font-semibold text-phiq-dark/90 sm:text-xl">
            Todos os sistemas, soluções e conhecimentos da PHIQ em um único
            lugar.
          </p>

          <p className="mt-3 max-w-xl text-base text-phiq-muted sm:text-lg">
            Uma experiência integrada para acessar ferramentas digitais,
            indicadores, documentos e plataformas PHIQ.
          </p>

          <div className="mt-8">
            <a
              href="#solucoes"
              className="group inline-flex items-center gap-2 rounded-2xl bg-phiq-primary px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-phiq-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-phiq-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2"
            >
              Acessar sistemas
              <ArrowRight
                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        {/* Coluna visual — painel com cards flutuantes */}
        <div className="relative">
          <div className="relative flex min-h-[420px] flex-col justify-between gap-5 overflow-hidden rounded-3xl bg-linear-to-br from-phiq-primary to-phiq-dark p-5 shadow-2xl shadow-phiq-dark/25 sm:min-h-[460px] sm:p-6">
            <HeroPattern />

            <span className="relative z-10 inline-flex items-center gap-1.5 self-end rounded-full bg-phiq-accent px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-phiq-accent/30">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Qualidade PHIQ
            </span>

            {/* Mock: indicadores de qualidade */}
            <div className="relative z-10 w-full max-w-xs -rotate-1 rounded-2xl border border-white/25 bg-white/10 p-4 shadow-xl backdrop-blur-md sm:self-start">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                  <ChartColumn
                    className="h-4 w-4 text-white"
                    aria-hidden="true"
                  />
                </span>
                <p className="text-sm font-semibold text-white">
                  Indicadores de qualidade
                </p>
              </div>
              <div
                aria-hidden="true"
                className="mt-3 flex h-16 items-end gap-1.5"
              >
                {CHART_BARS.map((height, index) => (
                  <div
                    key={index}
                    style={{ height: `${height}%` }}
                    className={`flex-1 rounded-t-md ${
                      index === CHART_BARS.length - 1
                        ? "bg-phiq-accent"
                        : "bg-white/60"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-white/75">
                Conformidade em alta no último trimestre
              </p>
            </div>

            {/* Mock: status de documentos do Docs-Q */}
            <div className="relative z-10 w-full max-w-xs rotate-1 rounded-2xl border border-white/25 bg-white/10 p-4 shadow-xl backdrop-blur-md sm:self-end">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                  <FileCheck2
                    className="h-4 w-4 text-white"
                    aria-hidden="true"
                  />
                </span>
                <p className="text-sm font-semibold text-white">Docs-Q</p>
                <span className="ml-auto text-xs text-white/70">
                  Documentos
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-white/85">
                <li className="flex items-center justify-between gap-3">
                  <span>Relatórios de análise</span>
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-emerald-300"
                    aria-hidden="true"
                  />
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span>Certificados de qualidade</span>
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-emerald-300"
                    aria-hidden="true"
                  />
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span>Fichas técnicas</span>
                  <Clock3
                    className="h-4 w-4 shrink-0 text-amber-200"
                    aria-hidden="true"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}