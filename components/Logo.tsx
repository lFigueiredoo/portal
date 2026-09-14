import Image from "next/image";

type LogoProps = {
  /** "dark" usa a logo oficial sobre fundo claro; "light" usa a versão branca sobre fundo escuro. */
  variant?: "dark" | "light";
};

export default function Logo({ variant = "dark" }: LogoProps) {
  const src = variant === "light" ? "/images/phiq-logo-light.png" : "/images/phiq-logo-dark.png";

  return (
    <Image
      src={src}
      alt="PHIQ — Philipéia Indústria Química Ltda."
      width={140}
      height={44}
      priority
      className="h-9 w-auto sm:h-10"
    />
  );
}


