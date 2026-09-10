type LogoProps = {
  /** "dark" usa texto verde-escuro (fundo claro); "light" usa branco (fundo escuro). */
  variant?: "dark" | "light";
};

export default function Logo({ variant = "dark" }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="1.5" y="1.5" width="31" height="31" rx="10" fill="#08766F" />
        <path
          d="M11 25V9.5h5.8a4.7 4.7 0 0 1 0 9.4H13.5"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="24" r="4" fill="#FF861F" />
      </svg>
      <span
        className={`text-xl font-bold tracking-tight ${
          variant === "light" ? "text-white" : "text-phiq-dark"
        }`}
      >
        PHIQ
      </span>
    </span>
  );
}