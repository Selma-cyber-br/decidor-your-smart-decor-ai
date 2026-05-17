import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { categories, products, formatDZD } from "@/lib/catalog";

export const Route = createFileRoute("/catalogue/$category")({
  component: CategoryPage,
  loader: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.category);
    if (!cat) throw notFound();
    return { cat };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl">Catégorie introuvable</h1>
      <Link to="/catalogue" className="mt-6 inline-block text-primary hover:underline">← Catalogue</Link>
    </div>
  ),
  head: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.category);
    return {
      meta: [
        { title: `${cat?.name_fr ?? "Catégorie"} — DECIDOR` },
        { name: "description", content: `Découvrez notre sélection ${cat?.name_fr ?? ""} sur DECIDOR. Prix en DZD, livraison Algérie.` },
      ],
    };
  },
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const items = products.filter((p) => p.category === cat.slug);
  const name = lang === "ar" ? cat.name_ar : cat.name_fr;

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <Link to="/catalogue" className="text-sm text-muted-foreground hover:text-primary">
        ← {t("nav_catalog")}
      </Link>

      <div className="mt-6 mb-12 grid gap-8 md:grid-cols-2 md:items-end">
        <div>
          <span className="text-xs tracking-[0.25em] text-accent">CATÉGORIE</span>
          <h1 className="mt-2 text-5xl tracking-tight">{name}</h1>
          <p className="mt-3 text-muted-foreground">
            {items.length} {t("products_in")} {name.toLowerCase()}
          </p>
        </div>
        <div className="overflow-hidden rounded-xl shadow-soft">
          <img src={cat.image} alt={name} className="h-48 w-full object-cover md:h-56" />
        </div>
      </div>

      {items.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">Bientôt disponible.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <Link
              key={p.id}
              to="/produit/$slug"
              params={{ slug: p.slug }}
              className="group rounded-xl bg-card p-3 shadow-soft transition hover:shadow-elevated"
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src={p.image}
                  alt={lang === "ar" ? p.name_ar : p.name_fr}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-1 pt-4 pb-2">
                <h3 className="line-clamp-1 text-base">{lang === "ar" ? p.name_ar : p.name_fr}</h3>
                <p className="mt-1 text-sm text-primary">{formatDZD(p.price, lang)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.variants.length} {t("variants").toLowerCase()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
