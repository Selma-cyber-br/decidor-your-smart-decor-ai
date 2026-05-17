import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { categories, products, formatDZD } from "@/lib/catalog";

export const Route = createFileRoute("/catalogue/")({
  component: CataloguePage,
  head: () => ({
    meta: [
      { title: "Catalogue DECIDOR — Décoration premium en Algérie" },
      { name: "description", content: "Explorez le catalogue DECIDOR : peinture, carrelage, mobilier, lustres, tapis et plus. Prix en DZD, livraison Algérie." },
    ],
  }),
});

function CataloguePage() {
  const { t, lang } = useI18n();

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-12">
        <span className="text-xs tracking-[0.25em] text-accent">CATALOGUE LIBRE</span>
        <h1 className="mt-2 text-5xl tracking-tight">{t("nav_catalog")}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("categories_subtitle")}</p>
      </div>

      {/* Catégories */}
      <h2 className="mb-6 text-sm tracking-[0.2em] text-muted-foreground uppercase">{t("categories_title")}</h2>
      <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to="/catalogue/$category"
            params={{ category: cat.slug }}
            className="group overflow-hidden rounded-xl bg-card shadow-soft transition hover:shadow-elevated"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={cat.image}
                alt={lang === "ar" ? cat.name_ar : cat.name_fr}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-anthracite/70 to-transparent" />
              <h3 className="absolute bottom-4 left-4 right-4 text-lg text-ivory">
                {lang === "ar" ? cat.name_ar : cat.name_fr}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Tous produits */}
      <h2 className="mb-6 text-sm tracking-[0.2em] text-muted-foreground uppercase">{t("view_all")}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
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
              <h3 className="line-clamp-1 text-base text-foreground">
                {lang === "ar" ? p.name_ar : p.name_fr}
              </h3>
              <p className="mt-1 text-sm text-primary">{formatDZD(p.price, lang)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
