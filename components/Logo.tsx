import Image from "next/image";

/** Site oficial da PHIQ — destino do clique na logo. */
const SITE_URL = "https://phiq.com.br/";

type LogoProps = {
  /** "dark" usa a logo oficial sobre fundo claro; "light" usa a versão branca sobre fundo escuro. */
  variant?: "dark" | "light";
};

/** Logo da PHIQ. Clicar leva ao site oficial em uma nova aba. */
export default function Logo({ variant = "dark" }: LogoProps) {
  const src = variant === "light" ? "/images/phiq-logo-light.png" : "/images/phiq-logo-dark.png";

  return (
    <a
      href={SITE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="PHIQ — abrir o site oficial (phiq.com.br)"
      className="inline-flex rounded-xl transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2"
    >
      <Image
        src={src}
        alt="PHIQ — Philipéia Indústria Química Ltda."
        width={140}
        height={44}
        priority
        className="h-9 w-auto sm:h-10"
      />
    </a>
  );
}


