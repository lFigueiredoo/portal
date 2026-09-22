import { hasPermission } from "@/lib/auth/permissions";
import type { PermissionKey, PublicUser } from "@/lib/auth/types";

/**
 * Fonte única de verdade dos aplicativos do Portal PHIQ.
 *
 * ── Como cadastrar uma URL futuramente ─────────────────────────
 * 1. Preencha o campo `url` do aplicativo (ex.: "https://docs.phiq.com.br").
 * 2. Troque `status` de "soon" para "available".
 * O card passa a exibir o link "Acessar" automaticamente; enquanto o status
 * for "soon", qualquer `url` preenchida é ignorada pela interface.
 *
 * ── Controle de acesso por permissão ───────────────────────────
 * O campo opcional `permission` declara a chave (lib/auth/types.ts) que
 * libera o sistema. Apps SEM `permission` ficam visíveis a todos os
 * autenticados. O filtro por usuário acontece AQUI (fonte única), na
 * função `getAppsForUser` — os componentes de interface não precisam mudar.
 */

export type ApplicationCategory =
  | "Clientes"
  | "Gestão"
  | "Conhecimento"
  | "Serviços";

export type ApplicationStatus = "available" | "soon";

/** Chaves de ícone aceitas (mapeadas para lucide-react em ApplicationCard). */
export type AppIconKey =
  | "file-check"
  | "clipboard-list"
  | "users"
  | "chart-column"
  | "graduation-cap"
  | "flask-conical";

export interface PhiqApplication {
  id: string;
  name: string;
  category: ApplicationCategory;
  description: string;
  /** Sem URL real por enquanto — preencher quando o sistema entrar no ar. */
  url?: string;
  icon: AppIconKey;
  status: ApplicationStatus;
  /** Rótulo opcional do botão do card (ex.: "Solicitar análise"). */
  cta?: string;
  /**
   * Permissão que libera o sistema (ver lib/auth/types.ts). Ausente =
   * visível a todos os usuários autenticados.
   */
  permission?: PermissionKey;
}

export interface ApplicationGroup {
  category: ApplicationCategory;
  slug: string;
  label: string;
  description: string;
  apps: PhiqApplication[];
}

/** Rótulos + linha descritiva curta de cada categoria. */
export const CATEGORY_META: Record<
  ApplicationCategory,
  { label: string; description: string }
> = {
  "Clientes": {
    label: "Para Clientes",
    description: "Acesse os seus documentos, indicadores e serviços.",
  },
  "Gestão": {
    label: "Para Gestão",
    description: "Ferramentas para o time PHIQ.",
  },
  "Conhecimento": {
    label: "Para Conhecimento",
    description: "Capacitação e desenvolvimento.",
  },
  "Serviços": {
    label: "Nossos Serviços",
    description: "Soluções especializadas.",
  },
};

/** Slugs estáveis usados como âncora (id) de cada categoria na home. */
const CATEGORY_SLUG: Record<ApplicationCategory, string> = {
  "Clientes": "clientes",
  "Gestão": "gestao",
  "Conhecimento": "conhecimento",
  "Serviços": "servicos",
};

export function categorySlug(category: ApplicationCategory): string {
  return CATEGORY_SLUG[category];
}

/**
 * Catálogo de aplicativos do portal.
 * Todos os itens estão SEM url real (status "soon") neste momento.
 */
export const APPS: PhiqApplication[] = [
  {
    id: "docs-q",
    name: "Docs-Q",
    category: "Clientes",
    description: "Documentos, indicadores e evidências da qualidade.",
    icon: "file-check",
    status: "soon",
    permission: "edocs",
  },
  {
    id: "area-do-cliente",
    name: "Área do Cliente",
    category: "Clientes",
    description: "Acompanhamento de serviços, relatórios e resultados.",
    icon: "clipboard-list",
    status: "soon",
    permission: "area-do-cliente",
  },
  {
    id: "crm-phiq-nexus",
    name: "CRM PHIQ Nexus",
    category: "Gestão",
    description: "Gestão comercial, atendimento e relacionamento.",
    icon: "users",
    status: "soon",
    permission: "crm",
  },
  {
    id: "bi-gestao-a-vista",
    name: "BI Gestão à Vista",
    category: "Gestão",
    description: "Indicadores estratégicos e desempenho.",
    icon: "chart-column",
    status: "soon",
    permission: "bi",
  },
  {
    id: "universidade-phiq",
    name: "Universidade PHIQ",
    category: "Conhecimento",
    description: "Treinamentos, cursos e capacitação.",
    icon: "graduation-cap",
    status: "soon",
    permission: "universidade",
  },
  {
    id: "phiq-lab",
    name: "PHIQ LAB",
    category: "Serviços",
    description: "Análises laboratoriais, laudos e qualidade da água.",
    icon: "flask-conical",
    status: "soon",
    cta: "Solicitar análise",
  },
];

/**
 * Filtra o catálogo pelas permissões do usuário autenticado.
 * É o único ponto de filtro do portal — as telas consomem esta função.
 */
export function getAppsForUser(user: PublicUser): PhiqApplication[] {
  return APPS.filter(
    (app) => !app.permission || hasPermission(user, app.permission),
  );
}

/**
 * Agrupa os aplicativos por categoria, na ordem fixa:
 * Clientes → Gestão → Conhecimento → Serviços.
 */
export function groupApplicationsByCategory(): ApplicationGroup[] {
  const order: ApplicationCategory[] = [
    "Clientes",
    "Gestão",
    "Conhecimento",
    "Serviços",
  ];

  return order.map((category) => ({
    category,
    slug: CATEGORY_SLUG[category],
    label: CATEGORY_META[category].label,
    description: CATEGORY_META[category].description,
    apps: APPS.filter((app) => app.category === category),
  }));
}