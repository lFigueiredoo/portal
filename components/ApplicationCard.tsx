import {
  ArrowRight,
  ChartColumn,
  ClipboardList,
  FileCheck2,
  FlaskConical,
  GraduationCap,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { AppIconKey, PhiqApplication } from "@/data/applications";

const APP_ICONS: Record<AppIconKey, LucideIcon> = {
  "file-check": FileCheck2,
  "clipboard-list": ClipboardList,
  "users": Users,
  "chart-column": ChartColumn,
  "graduation-cap": GraduationCap,
  "flask-conical": FlaskConical,
};

type ApplicationCardProps = {
  app: PhiqApplication;
  /** Cor do tint do ícone — "green" (padrão) ou "orange". */
  accent?: "green" | "orange";
};

export default function ApplicationCard({
  app,
  accent = "green",
}: ApplicationCardProps) {
  const Icon = APP_ICONS[app.icon];

  const iconTint =
    accent === "orange"
      ? "bg-phiq-accent/10 text-phiq-accent group-hover:bg-phiq-accent/20"
      : "bg-phiq-primary/10 text-phiq-primary group-hover:bg-phiq-primary/20";

  const statusBadge =
    app.status === "available" ? (
      <span className="inline-flex shrink-0 items-center rounded-full border border-phiq-primary/20 bg-phiq-primary/10 px-2.5 py-1 text-xs font-semibold text-phiq-primary">
        Disponível
      </span>
    ) : (
      <span className="inline-flex shrink-0 items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
        Em breve
      </span>
    );

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-phiq-dark/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-phiq-primary/30 hover:shadow-xl hover:shadow-phiq-dark/15">
      {/* Ícone em destaque */}
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105 ${iconTint}`}
      >
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>

      <div className="mt-5 flex items-start justify-between gap-3">
        <h4 className="text-lg font-semibold tracking-tight text-phiq-dark">
          {app.name}
        </h4>
        {statusBadge}
      </div>

      <p className="mt-1.5 pb-6 text-sm leading-relaxed text-phiq-muted">
        {app.description}
      </p>

      {/* Ação — largura total na base do card */}
      <div className="mt-auto border-t border-phiq-dark/10 pt-5">
        {app.status === "available" && app.url ? (
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-phiq-primary px-5 py-3 text-sm font-semibold text-white shadow-md shadow-phiq-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-phiq-dark hover:shadow-lg hover:shadow-phiq-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2"
          >
            Acessar
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1"
              aria-hidden="true"
            />
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Disponível em breve"
            className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-phiq-dark/10 bg-phiq-bg px-5 py-3 text-sm font-semibold text-phiq-muted/80"
          >
            Acessar
          </button>
        )}
      </div>
    </article>
  );
}