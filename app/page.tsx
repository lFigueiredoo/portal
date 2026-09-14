import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

import { APPS } from "@/data/applications";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <main id="conteudo">
        <div className="mx-auto max-w-[84rem] px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8">
          <CategorySection title="Acesse nossos sistemas" apps={APPS} />
        </div>
      </main>
      <Footer />
    </>
  );
}
