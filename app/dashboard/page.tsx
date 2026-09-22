import Hero from "@/components/Hero";

import { requireUser } from "@/lib/auth/dal";
import { getAppsForUser, groupAppsByCategory } from "@/lib/apps/apps";
import { ROLE_LABEL } from "@/lib/auth/types";

import ApplicationCard from "@/components/ApplicationCard";

/** Primeiro nome para a saudação. */
function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export default async function DashboardPage() {
  const user = await requireUser();
  const apps = getAppsForUser(user);
  const groups = groupAppsByCategory(apps);

  return (
    <>
      <Hero />

      <main id="conteudo">
        {/* Saudação do usuário autenticado */}
        <section
          aria-label="Saudação do usuário"
          className="border-y border-phiq-dark/8 bg-white"
        >
          <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-12">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-phiq-primary">
                Seu painel
              </p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-phiq-dark sm:text-2xl">
                Olá, {firstNameOf(user.name)}
              </h2>
            </div>
            <p className="text-sm text-phiq-muted">
              <span className="font-semibold text-phiq-dark">
                {ROLE_LABEL[user.role]}
              </span>{" "}
              · acesso liberado a {apps.length}{" "}
              {apps.length === 1 ? "sistema" : "sistemas"}
            </p>
          </div>
        </section>

        {/* Sistemas — fonte única (lib/apps), filtrado por permissão e
            agrupado por categoria */}
        <div
          id="solucoes"
          className="mx-auto max-w-[84rem] px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8"
        >
          {groups.map((group) => (
            <section
              key={group.category}
              aria-label={group.category}
              className="mt-9 first:mt-0"
            >
              <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-phiq-primary">
                {group.category}
              </h3>

              <div className="mt-3 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {group.apps.map((app) => (
                  <ApplicationCard key={app.id} app={app} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}