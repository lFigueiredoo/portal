import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/appwrite/client";

/**
 * Proteção otimista de rotas (verificação barata em todas as rotas).
 *
 * Aqui só conferimos a PRESENÇA do cookie de sessão do Appwrite — a
 * validade REAL da sessão é confirmada com `account.get()` no DAL
 * (`lib/auth/dal.ts`), que protege de verdade as páginas e ações.
 * Isso evita uma chamada ao Appwrite a cada request no proxy.
 *
 * No Next.js 16, `middleware.ts` foi descontinuado e substituído por
 * `proxy.ts` (executa com o runtime Node.js por padrão).
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const hasSessionCookie = Boolean(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  // 1. Sem sessão: / e rotas internas vão para /login (a própria /login
  //    segue normal). Rotas internas preservam o destino em ?next= para
  //    voltar após o login.
  if (!hasSessionCookie) {
    if (pathname === "/login") {
      return NextResponse.next();
    }
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("next", `${pathname}${search}`);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. Com cookie: / leva ao dashboard. /login NÃO é redirecionado aqui —
  //    um cookie velho/revogado criaria um loop (/login → /dashboard →
  //    /login → ...). A própria /login resolve com a checagem real do DAL:
  //    com acesso → /dashboard; sem sessão válida → mostra o formulário.
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

/**
 * O proxy roda em todas as páginas, mas NUNCA em assets estáticos —
 * sem essa exclusão, o logo/imagens da própria tela de login seriam
 * redirecionados junto (quebrando a página).
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|images|hero-industry.jpg|sitemap.xml|robots.txt|api|.*\\.[\\w]+$).*)",
  ],
};