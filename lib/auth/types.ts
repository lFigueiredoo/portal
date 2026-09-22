/**
 * Tipos de identidade e acesso do Portal PHIQ.
 *
 * O Appwrite Auth é o provedor de identidade (conta, login, sessão).
 * Este módulo mantém os papéis e permissões que o PORTAL controla —
 * independentemente do provedor de autenticação.
 */

/** Perfis de usuário do portal. ADMIN é o perfil mais amplo. */
export type Role = "ADMIN" | "COLABORADOR" | "FRANQUEADO" | "CLIENTE";

/**
 * Chaves de permissão por sistema. Cada aplicativo do catálogo
 * (`data/applications.ts`) declara a permissão que libera o seu acesso.
 * Adicionar um sistema novo = adicionar uma chave aqui.
 */
export type PermissionKey =
  | "edocs"
  | "area-do-cliente"
  | "crm"
  | "bi"
  | "universidade";

/** Lista fechada de permissões — usada para validar o campo da tabela. */
export const PERMISSION_KEYS: readonly string[] = [
  "edocs",
  "area-do-cliente",
  "crm",
  "bi",
  "universidade",
];

/** Rótulos de exibição de cada perfil. */
export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Administrador",
  COLABORADOR: "Colaborador",
  FRANQUEADO: "Franqueado",
  CLIENTE: "Cliente",
};

/**
 * DTO seguro exposto à interface/cliente — identidade vem do Appwrite
 * (id, name, email), permissões do perfil no banco (user_profiles).
 */
export interface PublicUser {
  /** Id do usuário no Appwrite (account.$id). */
  id: string;
  name: string;
  email: string;
  role: Role;
  /** Permissões efetivas (explícitas do perfil ou padrão do papel). */
  permissions: PermissionKey[];
  /** Empresa vinculado no perfil (user_profiles.company_id), quando existir. */
  companyId?: string;
}