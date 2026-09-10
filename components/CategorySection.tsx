import ApplicationCard from "@/components/ApplicationCard";
import {
  categorySlug,
  type ApplicationCategory,
  type PhiqApplication,
} from "@/data/applications";

/** Cor do marcador (dot) de cada categoria, dentro dos tokens PHIQ. */
const CATEGORY_DOTS: Record<ApplicationCategory, string> = {
  "Clientes": "bg-phiq-primary",
  "Gestão": "bg-phiq-accent",
  "Conhecimento": "bg-phiq-dark",
  "Serviços": "bg-phiq-muted",
};

type CategorySectionProps = {
  category: ApplicationCategory;
  /** Rótulo da categoria em CATEGORY_META (ex.: "Para Clientes"). */
  title: string;
  description: string;
  apps: PhiqApplication[];
};

export default function CategorySection({
  category,
  title,
  description,
  apps,
}: CategorySectionProps) {
  const slug = categorySlug(category);

  return (
    <section
      id={slug}
      aria-labelledby={`${slug}-title`}
      className="scroll-mt-24"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${CATEGORY_DOTS[category]}`}
        />
        <h3 className="text-xl font-bold tracking-tight text-phiq-dark sm:text-2xl">
          {title}
        </h3>
      </div>
      <p className="mt-1.5 max-w-2xl text-sm text-phiq-muted sm:text-base">
        {description}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {apps.map((app) => (
          <ApplicationCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
}