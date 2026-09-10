import { TrendingUp, Users, Workflow, type LucideIcon } from "lucide-react";

type Pillar = {
  title: string;
  text: string;
  icon: LucideIcon;
};

const PILLARS: Pillar[] = [
  {
    title: "Pessoas",
    text: "Um ponto de encontro digital que aproxima clientes, equipes e parceiros.",
    icon: Users,
  },
  {
    title: "Processos",
    text: "Rotinas padronizadas para sustentar a qualidade em cada etapa.",
    icon: Workflow,
  },
  {
    title: "Resultados",
    text: "Indicadores e desempenho das operações, sempre à mão.",
    icon: TrendingUp,
  },
];

/* Padrão de pontos sutil sobre a banda escura. */
function BandPattern() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-[0.07]"
    >
      <defs>
        <pattern
          id="plataforma-dots"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="1.5" fill="#FFFFFF" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#plataforma-dots)" />
    </svg>
  );
}

export default function PlatformBand() {
  return (
    <section
      aria-labelledby="plataforma-title"
      className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24"
    >
      <div className="relative overflow-hidden rounded-3xl bg-phiq-dark px-6 py-14 shadow-2xl shadow-phiq-dark/30 sm:px-10 sm:py-16 lg:px-14">
        <BandPattern />

        {/* Brilhos decorativos */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-phiq-accent/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-phiq-primary/40 blur-3xl"
        />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-phiq-accent/30 bg-phiq-accent/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-phiq-accent">
            Plataforma PHIQ
          </span>

          <h2
            id="plataforma-title"
            className="mt-5 max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl"
          >
            Um único ambiente para conectar pessoas, processos e resultados.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-white/20 hover:bg-white/10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-phiq-accent/15 text-phiq-accent">
                  <pillar.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}