# Portal PHIQ

Base visual do hub digital corporativo da PHIQ — futuro domínio
**portal.phiq.com.br**.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript estrito
- [Tailwind CSS](https://tailwindcss.com) v4 — design tokens no bloco `@theme`
  de `app/globals.css`
- [lucide-react](https://lucide.dev) (ícones)

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Build de produção:

```bash
npm run build
```

## Estrutura

```
app/
  layout.tsx        # Metadata, fonte Inter, lang pt-BR
  page.tsx          # Header + Hero + seção de soluções + Footer
  globals.css       # Design tokens (@theme) e base global
components/
  Header.tsx        # Header sticky (server component)
  MobileNav.tsx     # Menu mobile ('use client' — único componente client)
  Hero.tsx          # Título, CTAs e painel visual com cards de mock
  ApplicationCard.tsx
  CategorySection.tsx
  Footer.tsx        # id="sobre"
  Logo.tsx          # Marca SVG + wordmark
data/
  applications.ts   # Fonte única de verdade dos aplicativos
```

## Como cadastrar um sistema

1. Abra `data/applications.ts`.
2. No aplicativo desejado, preencha `url` (ex.: `"https://sistema.phiq.com.br"`)
   e troque `status` para `"available"`.
3. O card passa a exibir o link **Acessar** automaticamente — nenhuma outra
   alteração é necessária.

Para um sistema novo, adicione um objeto em `APPS` com `id`, `name`,
`category`, `description`, `icon` e `status`.

## Roadmap futuro (não implementado nesta base)

- **Login único PHIQ** — o botão "Entrar" hoje é apenas visual.
- **Controle de permissões e papéis** — `audiences`
  (`cliente` | `colaborador` | `administrador`) já está preparado em
  `data/applications.ts` para filtrar os cards por usuário autenticado.
- **URLs reais** — nenhum card aponta para endereço externo ainda.