import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PlatformBand from "@/components/PlatformBand";

import { groupApplicationsByCategory } from "@/data/applications";

export default function Home() {
  const groups = groupApplicationsByCategory();

  return (
    <>
      <Header />
      <Hero />
      <PlatformBand />
      <main id="conteudo">
        <section
          id="solucoes"
          aria-labelledby="solucoes-title"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 pt-6 sm:px-6 sm:pb-24 lg:px-8"
        >
          <h2
            id="solucoes-title"
            className="text-2xl font-bold tracking-tight text-phiq-dark sm:text-3xl lg:text-4xl"
          >
            Nossas soluções digitais
          </h2>
          <p className="mt-3 max-w-2xl text-base text-phiq-muted sm:text-lg">
            Plataformas para clientes e equipes acessarem documentos,
            indicadores, gestão e conhecimento em um só lugar.
          </p>

          <div className="mt-10 space-y-14">
            {groups.map((group) => (
              <CategorySection
                key={group.category}
                category={group.category}
                title={group.label}
                description={group.description}
                apps={group.apps}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}