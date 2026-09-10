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
      ? "bg-phiq-accent/10 text-phiq-accent"
      : "bg-phiq-primary/10 text-phiq-primary";

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-phiq-dark/10 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-phiq-primary/30 hover:shadow-lg sm:p-6">
      <div className="flex items-start gap-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconTint}`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h4 className="text-base font-semibold text-phiq-dark sm:text-lg">
            {app.name}
          </h4>
          <p className="mt-1 text-sm leading-relaxed text-phiq-muted">
            {app.description}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-phiq-dark/5 pt-4">
        {app.status === "available" && app.url ? (
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-phiq-primary transition-colors hover:text-phiq-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2"
          >
            Acessar
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        ) : (
          <>
            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
              Em breve
            </span>
            <span className="text-xs text-phiq-muted">Acesso em breve</span>
          </>
        )}
      </div>
    </article>
  );
}