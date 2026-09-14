import Image from "next/image";
import { Leaf, Lightbulb, ShieldCheck, Users, type LucideIcon } from "lucide-react";

type HeroPanelItem = {
  title: string;
  text: string;
  icon: LucideIcon;
};

const HERO_PANEL_ITEMS: HeroPanelItem[] = [
  { title: "Qualidade", text: "em cada processo", icon: ShieldCheck },
  { title: "Inovação", text: "em todas as áreas", icon: Lightbulb },
  { title: "Pessoas", text: "que fazem acontecer", icon: Users },
  { title: "Um futuro", text: "mais sustentável", icon: Leaf },
];

/** Container global: mesmo eixo do logo no header. */
const CONTAINER = "mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative h-[430px] w-full overflow-hidden bg-white"
    >
      {/* ── Imagem única — integrada ao fade ──────────────────────── */}
      <Image
        src="/images/hero-banner-final.jpg"
        alt="Profissional PHIQ em laboratório, com jaleco e óculos de proteção, trabalhando com pipeta"
        fill
        priority
        sizes="(min-width: 1024px) 65vw, 100vw"
        className="object-cover object-[70%_center]"
      />

      {/* Fade branco contínuo — sem coluna separada */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[48%] bg-linear-to-r from-white via-white to-transparent"
      />

      {/* ── Container global — mesmo eixo do logo do header ───────── */}
      <div className={`${CONTAINER} relative z-10 h-full`}>
        {/* Bloco esquerdo — centralizado verticalmente */}
        <div className="flex h-full w-[440px] max-w-[440px] flex-col justify-center">
          {/* Overline elegante */}
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-phiq-primary">
            Bem-vindo ao
          </span>

          {/* Título principal */}
          <h1
            id="hero-title"
            className="mt-1 text-[2.8rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-phiq-dark sm:text-[3.1rem] lg:text-[3.4rem]"
          >
            Portal PHIQ
          </h1>

          {/* Subtítulo — 2 linhas, line-height sofisticado */}
          <p className="mt-5 max-w-[280px] text-lg font-semibold leading-[1.35] text-phiq-dark sm:text-xl">
            Todos os nossos sistemas e soluções
            <br className="hidden sm:block" />
            em um único lugar.
          </p>

          {/* Descrição — largura contida */}
          <p className="mt-3.5 max-w-[310px] text-sm leading-relaxed text-phiq-muted">
            Acesse ferramentas, documentos, indicadores e plataformas PHIQ de
            forma simples e segura.
          </p>

          {/* Assinatura — uma linha, discreta */}
          <p className="mt-6 font-script text-lg leading-tight text-phiq-primary sm:text-xl">
            Soluções que impulsionam resultados
          </p>
          {/* Linha decorativa — alinhada ao início da assinatura */}
          <span
            aria-hidden="true"
            className="mt-2.5 block h-[3px] w-[70px] rounded-full bg-phiq-accent"
          />
        </div>
      </div>

      {/* ── Painel de valores — único, à direita ─────────────────── */}
      <div
        className="absolute z-10 w-[300px] max-w-[300px] rounded-3xl border border-white/20 bg-phiq-dark/35 p-5 shadow-2xl shadow-phiq-dark/30 backdrop-blur-xl"
        style={{ right: "40px", top: "50%", transform: "translateY(-50%)" }}
      >
        <ul className="flex flex-col gap-4">
          {HERO_PANEL_ITEMS.map((item) => (
            <li key={item.title} className="flex items-center gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/12 text-white/90">
                <item.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-[0.85rem] leading-snug text-white">
                <span className="block font-semibold">{item.title}</span>
                <span className="text-white/70">{item.text}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
