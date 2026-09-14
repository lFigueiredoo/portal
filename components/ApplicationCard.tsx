import { ArrowRight } from "lucide-react";

import type { AppIconKey, PhiqApplication } from "@/data/applications";
import {
  ChartColumn,
  ClipboardList,
  FileCheck2,
  FlaskConical,
  GraduationCap,
  Users,
  type LucideIcon,
} from "lucide-react";

const APP_ICONS: Record<AppIconKey, LucideIcon> = {
  "file-check": FileCheck2,
  "clipboard-list": ClipboardList,
  "users": Users,
  "chart-column": ChartColumn,
  "graduation-cap": GraduationCap,
  "flask-conical": FlaskConical,
};

/** Sistemas com acento laranja (conforme identidade PHIQ). */
const ORANGE_APPS = new Set(["crm-phiq-nexus", "bi-gestao-a-vista"]);

type ApplicationCardProps = {
  app: PhiqApplication;
};

export default function ApplicationCard({ app }: ApplicationCardProps) {
  const Icon = APP_ICONS[app.icon];
  const isOrange = ORANGE_APPS.has(app.id);

  const iconCircle = isOrange
    ? "bg-phiq-accent/10 text-phiq-accent"
    : "bg-phiq-primary/10 text-phiq-primary";

  const action =
    app.status === "available" && app.url ? (
      <a
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Acessar ${app.name}`}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          isOrange
            ? "bg-phiq-accent shadow-phiq-accent/25 hover:bg-phiq-dark focus-visible:ring-phiq-accent"
            : "bg-phiq-primary shadow-phiq-primary/25 hover:bg-phiq-dark focus-visible:ring-phiq-primary"
        }`}
      >
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </a>
    ) : (
      <span
        aria-label={`${app.name} — em breve`}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md transition-all duration-200 ${
          isOrange
            ? "bg-phiq-accent/90 shadow-phiq-accent/20"
            : "bg-phiq-primary/90 shadow-phiq-primary/20"
        }`}
      >
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </span>
    );

  return (
    <article
      className={`group flex h-full flex-col gap-2.5 rounded-3xl bg-white px-4 pb-4 pt-5 text-center shadow-lg shadow-phiq-dark/8 ring-1 ring-[#E5EEEE] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-phiq-dark/12 ${
        isOrange ? "hover:ring-phiq-accent/25" : "hover:ring-phiq-primary/25"
      }`}
    >
      {/* Ícone grande dentro de círculo de 72px */}
      <span
        className={`mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 ${iconCircle}`}
      >
        <Icon className="h-9 w-9" aria-hidden="true" strokeWidth={1.9} />
      </span>

      {/* Nome do sistema — destaque */}
      <h4 className="mt-2 text-[0.95rem] font-bold leading-tight text-phiq-dark">
        {app.name}
      </h4>

      {/* Descrição — até 3 linhas, sem cortes */}
      <p className="px-0.5 text-[0.7rem] leading-relaxed text-phiq-muted">
        {app.description}
      </p>

      {/* Botão circular — canto inferior direito, com alinhamento fino */}
      <div className="-mb-1 mt-auto flex justify-end">{action}</div>
    </article>
  );
}


