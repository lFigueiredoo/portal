# Portal PHIQ

Portal digital corporativo da PHIQ — futuro domínio **portal.phiq.com.br**.
Acesso autenticado: login → dashboard → sistemas conforme permissão.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript estrito
- [Appwrite Auth](https://appwrite.io/docs/products/auth) — provedor oficial
  de identidade (contas, login, logout, sessão; recuperação de senha futura)
- [Tailwind CSS](https://tailwindcss.com) v4 — design tokens no bloco `@theme`
  de `app/globals.css`
- [lucide-react](https://lucide.dev) (ícones)

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) — sem sessão, cai em
`/login`. Verificações:

```bash
npm run typecheck
npm run lint
npm run build
```

## Fluxo de acesso

```
portal.phiq.com.br            → /login       (sem sessão)
                     ↘        → /dashboard   (com sessão)
/login  → Appwrite Auth       → /dashboard
/logout → encerra sessão      → /login
autenticado sem user_profiles → /sem-acesso  (acesso bloqueado)
```

- **Identidade (Appwrite Auth)** — `account.createEmailPasswordSession()`
  no login (Server Action), `account.get()` para validar a sessão,
  `account.deleteSession("current")` no logout. O segredo da sessão fica
  no cookie httpOnly `appwrite_session` (7 dias, expira junto com a sessão).
- **`proxy.ts`** — proteção otimista (presença do cookie) em todas as rotas:
  sem cookie → `/login?next=...`; com cookie, `/` → `/dashboard` (`/login`
  segue para a própria página, que decide com a checagem real).
- **`lib/auth/dal.ts`** — verificação REAL: `account.get()` no Appwrite +
  perfil no banco. Páginas e Server Actions chamam `requireUser`/
  `requirePermission`.

## Setup do Appwrite

1. **Projeto** — crie um projeto no [Appwrite Console](https://cloud.appwrite.io)
   (Cloud ou self-hosted).
2. **Plataforma Web** — no projeto, Settings → Platforms → Add Platform →
   Web app. Adicione:
   - `https://portal.phiq.com.br` (produção)
   - `http://localhost:3000` (desenvolvimento)
3. **API key** — Settings → API keys. Escopos mínimos:
   - `sessions.write` — criar sessão no login (Server Action)
   - `tablesdb.read` (ou `databases.read` + `tables.read`) — ler a tabela de
     perfis
4. **Usuários** — criados no Console (Auth → Users) ou via `account.create`.
5. **Banco de perfis** — crie um database e a tabela `user_profiles`
   (colunas abaixo). A permissão de leitura pode ficar restrita ao role
   `any`+API key — o portal lê via API key no servidor.
6. **Variáveis de ambiente** — copie `.env.example` para `.env.local` e
   preencha (Vercel: Project → Settings → Environment Variables).

### Tabela `user_profiles`

| Coluna | Tipo | Obrigatória | Conteúdo |
| --- | --- | --- | --- |
| `appwrite_user_id` | string | sim | `account.$id` (chave de busca) |
| `name` | string | não | nome de exibição |
| `role` | string | sim | `ADMIN` \| `COLABORADOR` \| `FRANQUEADO` \| `CLIENTE` |
| `company_id` | string | não | empresa vinculado |
| `permissions` | string[] | não | chaves explícitas (vazio = padrão do papel) |

Exemplo de linha:

```json
{
  "appwrite_user_id": "66f2...",
  "name": "Marina Costa",
  "role": "FRANQUEADO",
  "company_id": "phiq-sp",
  "permissions": ["crm", "edocs"]
}
```

Permissões válidas: `edocs`, `area-do-cliente`, `crm`, `bi`, `universidade`
(`lib/auth/types.ts`). Usuário autenticado **sem perfil** na tabela → acesso
bloqueado (`/sem-acesso`): o administrador precisa criar a linha antes do
primeiro acesso — não existe papel padrão.

## Estrutura

```
app/
  layout.tsx        # Metadata, fonte Inter, lang pt-BR
  page.tsx          # Redireciona: /login, /dashboard ou /sem-acesso
  login/page.tsx    # Tela de login (identidade PHIQ)
  dashboard/        # Área autenticada (layout exige sessão)
    layout.tsx      # Header com chip do usuário + Footer
    page.tsx        # Saudação + Hero + sistemas por permissão
  sem-acesso/page.tsx  # Autenticado sem perfil: mensagem + sair
  actions/auth.ts   # Server Actions: login, logout
  globals.css       # Design tokens (@theme) e base global
lib/appwrite/
  client.ts         # Clientes Appwrite (admin + sessão por request)
  auth.ts           # Login, logout, account.get (sessão)
  users.ts          # Perfil do usuário (user_profiles — role/permissions)
lib/auth/
  types.ts          # Roles + permissões + DTO público
  permissions.ts    # Permissões por papel + hasPermission
  dal.ts            # requireUser / requirePermission (proteção real)
proxy.ts            # Proteção otimista de rotas (ex-middleware do Next 16)
components/
  LoginForm.tsx     # Formulário de login ('use client')
  Header.tsx        # Header sticky com usuário autenticado
  MobileNav.tsx     # Menu mobile ('use client')
  Hero.tsx
  ApplicationCard.tsx
  CategorySection.tsx
  Footer.tsx        # id="sobre"
  Logo.tsx
data/
  applications.ts   # Fonte única de verdade + getAppsForUser (filtro)
```

## Deploy (Vercel + portal.phiq.com.br)

1. Projeto na Vercel (Next.js 16, sem configuração extra).
2. Configure as variáveis do `.env.example` em todas as envs de produção.
3. Domínio `portal.phiq.com.br` na Vercel.
4. No Appwrite, garanta a plataforma Web `https://portal.phiq.com.br`
   (passo 2 do setup) — sem ela, o browser bloqueia as chamadas CORS.

## Como cadastrar um sistema

1. Abra `data/applications.ts`.
2. No aplicativo desejado, preencha `url` (ex.: `"https://sistema.phiq.com.br"`)
   e troque `status` para `"available"`.
3. O card passa a exibir o link **Acessar** automaticamente — nenhuma outra
   alteração é necessária.

Para um sistema novo, adicione um objeto em `APPS` com `id`, `name`,
`category`, `description`, `icon`, `status` e, quando exigir controle de
acesso, `permission` (chave definida em `lib/auth/types.ts`).

## Roadmap futuro (não implementado)

- **Recuperação de senha** — o link "Esqueci minha senha" hoje abre um e-mail
  para contato@phiq.com.br; quando existir fluxo, usar
  `account.createRecovery` do Appwrite nativo.
- **Criação de contas no portal** — hoje os usuários nascem no Console
  Appwrite; criar cadastro self-service quando houver demanda.
- **Sessão deslizante** — renovar a validade a cada acesso via `proxy.ts`
  (hoje: expira junto com a sessão do Appwrite).
- **URLs reais** — nenhum card aponta para endereço externo ainda.