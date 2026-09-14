import { Handshake, Sprout, TrendingUp } from "lucide-react";

/* Ícone de lâmpada inline (mesmo traço do Feather/Lucide). */
function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

type ValueItem = {
  title: string;
  text: string;
  /** LucideIcon OU componente SVG inline próprio (ex.: LightbulbIcon). */
  icon: (props: { className?: string }) => React.ReactNode;
};

/** Destaques da faixa institucional (inspirados na referência). */
const VALUE_ITEMS: ValueItem[] = [
  { title: "Inovação", text: "com propósito", icon: LightbulbIcon },
  { title: "Confiança", text: "em cada parceria", icon: Handshake },
  { title: "Resultados", text: "que geram valor", icon: TrendingUp },
  { title: "Compromisso", text: "com o meio ambiente", icon: Sprout },
];

/* Folhas estilizadas — arte própria da marca para a faixa (sem stock photo). */
function LeafArt() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 280"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="band-leaf-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d8a80" />
          <stop offset="100%" stopColor="#08766f" />
        </linearGradient>
        <linearGradient id="band-leaf-b" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a9a8f" />
          <stop offset="100%" stopColor="#0f5f5a" />
        </linearGradient>
      </defs>
      <path
        d="M-20 260C60 210 150 190 250 120c-90 10-170 40-270 100z"
        fill="url(#band-leaf-a)"
        opacity="0.85"
      />
      <path
        d="M40 300C130 230 210 200 330 150c-110 0-200 50-290 130z"
        fill="url(#band-leaf-b)"
        opacity="0.7"
      />
      <path
        d="M210 40c40-30 90-40 130-30-30 40-80 60-130 50 10-10 20-15 30-20-25 0-45 5-60 15 5-8 15-12 30-15z"
        fill="#2ab5a5"
        opacity="0.5"
      />
      <circle cx="290" cy="90" r="3" fill="#7dd8c9" opacity="0.6" />
      <circle cx="270" cy="130" r="2" fill="#7dd8c9" opacity="0.5" />
      <circle cx="305" cy="60" r="2" fill="#7dd8c9" opacity="0.4" />
    </svg>
  );
}

export default function PlatformBand() {
  return (
    <section
      aria-labelledby="plataforma-title"
      className="relative w-full overflow-hidden bg-phiq-dark"
    >
      {/* Painel de folhas à esquerda (desktop) — evoca sustentabilidade */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 hidden w-[26%] lg:block"
      >
        <LeafArt />
        <div className="absolute inset-0 bg-linear-to-r from-transparent to-phiq-dark" />
      </div>

      {/* Brilho decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-phiq-primary/30 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-[80rem] flex-col items-start gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:gap-8 lg:pl-[24%] lg:pr-8">
        {/* Título */}
        <h2
          id="plataforma-title"
          className="max-w-xs shrink-0 text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl"
        >
          Mais que produtos, soluções completas para um futuro mais limpo.
        </h2>

        {/* Divisor vertical (desktop) */}
        <span
          aria-hidden="true"
          className="hidden h-16 w-px shrink-0 bg-white/20 lg:block"
        />

        {/* Destaques com ícones */}
        <ul className="grid flex-1 grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
          {VALUE_ITEMS.map((item) => (
            <li
              key={item.title}
              className="flex items-start gap-3 min-w-0"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-emerald-200 ring-1 ring-white/15">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-sm leading-snug">
                <span className="block font-semibold text-white">
                  {item.title}
                </span>
                <span className="text-white/70">{item.text}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
