import ApplicationCard from "@/components/ApplicationCard";
import { type PhiqApplication } from "@/data/applications";

type CategorySectionProps = {
  title: string;
  apps: PhiqApplication[];
};

export default function CategorySection({
  title,
  apps,
}: CategorySectionProps) {
  return (
    <section
      id="solucoes"
      aria-labelledby="solucoes-title"
      className="bg-[#F2F7F6]"
    >
      {/* Container global — mesmo eixo do Hero */}
      <div className="mx-auto max-w-[1280px] px-4 pb-6 pt-2.5 sm:px-6 sm:pb-7 sm:pt-4 lg:px-12">
        <h2
          id="solucoes-title"
          className="text-xl font-bold tracking-tight text-phiq-dark sm:text-2xl"
        >
          {title}
        </h2>

        {/* 6 cards em linha no desktop, 2 no mobile */}
        <div className="mt-2 grid grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-6">
          {apps.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
}








