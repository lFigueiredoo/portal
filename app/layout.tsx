import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://portal.phiq.com.br"),
  title: "Portal PHIQ",
  description: "O ecossistema digital que conecta qualidade, gestão e conhecimento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
