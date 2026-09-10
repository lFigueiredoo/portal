/**
 * Fonte única de verdade dos aplicativos do Portal PHIQ.
 *
 * ── Como cadastrar uma URL futuramente ─────────────────────────
 * 1. Preencha o campo `url` do aplicativo (ex.: "https://docs.phiq.com.br").
 * 2. Troque `status` de "soon" para "available".
 * O card passa a exibir o link "Acessar" automaticamente; enquanto o status
 * for "soon", qualquer `url` preenchida é ignorada pela interface.
 *
 * ── Onde entra audiences / controle de permissão ───────────────
 * O campo opcional `audiences` declara quais papéis enxergam o sistema:
 * "cliente" | "colaborador" | "administrador". Quando o login único PHIQ for
 * implementado, o filtro por papel deve acontecer AQUI (fonte única) — por
 * exemplo, filtrando `APPS` pelo papel do usuário autenticado antes de
 * exportar; os componentes de interface não precisam mudar.
 */

export type ApplicationCategory =
  | "Clientes"
  | "Gestão"
  | "Conhecimento"
  | "Serviços";

export type Audience = "cliente" | "colaborador" | "administrador";

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
  /** Papéis com acesso (login único / permissões no futuro). */
  audiences?: Audience[];
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
    description:
      "Documentos, acompanhamento de serviços e resultados para clientes PHIQ.",
  },
  "Gestão": {
    label: "Para Gestão",
    description:
      "Sistemas comerciais e indicadores estratégicos para decisões do dia a dia.",
  },
  "Conhecimento": {
    label: "Para Conhecimento",
    description: "Treinamentos e capacitação contínua para equipes e parceiros.",
  },
  "Serviços": {
    label: "Para Serviços",
    description:
      "Soluções especializadas em qualidade, análises e atendimento técnico.",
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
    description: "Documentos, indicadores e conformidade da qualidade.",
    icon: "file-check",
    status: "soon",
  },
  {
    id: "area-do-cliente",
    name: "Área do Cliente",
    category: "Clientes",
    description: "Acompanhamento de serviços, relatórios e resultados.",
    icon: "clipboard-list",
    status: "soon",
  },
  {
    id: "crm-phiq-nexus",
    name: "CRM PHIQ Nexus",
    category: "Gestão",
    description: "Gestão comercial, atendimento e relacionamento.",
    icon: "users",
    status: "soon",
  },
  {
    id: "bi-gestao-a-vista",
    name: "BI Gestão à Vista",
    category: "Gestão",
    description: "Indicadores estratégicos e desempenho.",
    icon: "chart-column",
    status: "soon",
  },
  {
    id: "universidade-phiq",
    name: "Universidade PHIQ",
    category: "Conhecimento",
    description: "Treinamentos, cursos e capacitação.",
    icon: "graduation-cap",
    status: "soon",
  },
  {
    id: "phiq-lab",
    name: "PHIQ LAB",
    category: "Serviços",
    description: "Análises laboratoriais e soluções em qualidade.",
    icon: "flask-conical",
    status: "soon",
  },
];

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