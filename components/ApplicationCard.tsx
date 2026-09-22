import { ArrowUpRight } from "lucide-react";

import type { App } from "@/lib/apps/apps";

type ApplicationCardProps = {
  app: App;
};

/** Card de sistema do catálogo — abre em nova aba. */
export default function ApplicationCard({ app }: ApplicationCardProps) {
  return (
    <article className="group flex h-full flex-col gap-2 rounded-3xl bg-white px-5 pb-5 pt-4 shadow-lg shadow-phiq-dark/8 ring-1 ring-[#E5EEEE] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-phiq-dark/12 hover:ring-phiq-primary/25">
      {/* Categoria do sistema */}
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-phiq-primary">
        {app.category}
      </span>

      {/* Nome do sistema */}
      <h4 className="text-[1.05rem] font-bold leading-snug text-phiq-dark">
        {app.name}
      </h4>

      {app.description && (
        <p className="text-sm leading-relaxed text-phiq-muted">
          {app.description}
        </p>
      )}

      {/* Acessar — sempre em nova aba */}
      <div className="mt-auto pt-3">
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Acessar ${app.name} (abre em nova aba)`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-phiq-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-phiq-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-phiq-dark hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2"
        >
          Acessar
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}