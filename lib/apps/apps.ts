import { hasPermission } from "@/lib/auth/permissions";
import type { PermissionKey, PublicUser } from "@/lib/auth/types";

/**
 * Fonte única de verdade do catálogo de sistemas do Portal PHIQ.
 * As telas NÃO guardam links — consomem `getAppsForUser(user)`.
 *
 * ── Como cadastrar um sistema novo ─────────────────────────────
 * 1. Adicione a entrada em `APPS` (id, name, url, category, permission);
 * 2. Garanta a chave em `PermissionKey` (lib/auth/types.ts).
 *
 * O filtro por permissão acontece AQUI — componentes de interface apenas
 * consomem a lista já filtrada e agrupada.
 */

export type App = {
  id: string;
  name: string;
  description?: string;
  url: string;
  category: string;
  permission: PermissionKey;
};

/** Catálogo oficial dos sistemas do Portal PHIQ. */
export const APPS: readonly App[] = [
  {
    id: "plano-acao",
    name: "Plano de Ação",
    url: "https://momentum-map-hub.lovable.app/",
    category: "Operações",
    permission: "plano-acao",
  },
  {
    id: "contrato-certo",
    name: "Contrato Certo",
    url: "https://assinatura-segura-contratos.lovable.app/",
    category: "Jurídico",
    permission: "contrato-certo",
  },
  {
    id: "assistente-performance",
    name: "Assistente PHIQ Performance",
    url: "https://insight-mate-78.lovable.app",
    category: "Performance",
    permission: "performance",
  },
  {
    id: "planejamento-pcp",
    name: "Planejamento PCP",
    url: "https://agile-prod-sync.lovable.app",
    category: "Produção",
    permission: "pcp",
  },
  {
    id: "edocs",
    name: "Documentação PHIQ",
    url: "https://edocs.phiq.com.br/",
    category: "Documentação",
    permission: "edocs",
  },
  {
    id: "portal-franqueado",
    name: "Portal do Franqueado PHIQ",
    url: "https://app.notion.com/p/Portal-Interno-PHIQ-CS-2e00ff67837a80a5acf8c6516bf8604e",
    category: "Documentação",
    permission: "portal-franqueado",
  },
  {
    id: "crm",
    name: "CRM PHIQ",
    url: "https://crm.phiq.com.br/login",
    category: "CRM",
    permission: "crm",
  },
  {
    id: "phiqlab",
    name: "Relatório PHIQLab",
    url: "https://clear-water-lab.lovable.app",
    category: "PHIQLAB",
    permission: "phiqlab",
  },
] as const satisfies readonly App[];

/**
 * Filtra o catálogo pelas permissões do usuário autenticado.
 * ADMIN enxerga o catálogo inteiro; os demais papéis, apenas o que está
 * nas permissões (explícitas do perfil ou padrão do papel).
 */
export function getAppsForUser(user: PublicUser): App[] {
  if (user.role === "ADMIN") {
    return [...APPS];
  }
  return APPS.filter((app) => hasPermission(user, app.permission));
}

/** Agrupa aplicativos por categoria, preservando a ordem do catálogo. */
export function groupAppsByCategory(
  apps: App[],
): Array<{ category: string; apps: App[] }> {
  const groups: Array<{ category: string; apps: App[] }> = [];
  for (const app of apps) {
    const group = groups.find((g) => g.category === app.category);
    if (group) {
      group.apps.push(app);
    } else {
      groups.push({ category: app.category, apps: [app] });
    }
  }
  return groups;
}