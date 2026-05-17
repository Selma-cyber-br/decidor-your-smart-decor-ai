import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { products, categories, formatDZD, type ProductVariant } from "@/lib/catalog";

export const Route = createFileRoute("/produit/$slug")({
  component: ProductPage,
  loader: ({ params }) => {
    const p = products.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return { product: p };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl">Produit introuvable</h1>
      <Link to="/catalogue" className="mt-6 inline-block text-primary hover:underline">← Catalogue</Link>
    </div>
  ),
  head: ({ params }) => {
    const p = products.find((x) => x.slug === params.slug);
    return {
      meta: [
        { title: `${p?.name_fr ?? "Produit"} — DECIDOR` },
        { name: "description", content: p?.description_fr ?? "Produit DECIDOR." },
        { property: "og:image", content: p?.image ?? "" },
      ],
    };
  },
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.id);

  const variant = product.variants.find((v: ProductVariant) => v.id === selectedVariant) ?? product.variants[0];
  const category = categories.find((c) => c.slug === product.category);
  const inStock = product.stock > 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs tracking-wide text-muted-foreground">
        <Link to="/catalogue" className="hover:text-primary">{t("nav_catalog")}</Link>
        <span>/</span>
        {category && (
          <>
            <Link
              to="/catalogue/$category"
              params={{ category: category.slug }}
              className="hover:text-primary"
            >
              {lang === "ar" ? category.name_ar : category.name_fr}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground">{lang === "ar" ? product.name_ar : product.name_fr}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        {/* Images */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl bg-card shadow-elevated">
            <img
              src={variant?.image ?? product.image}
              alt={lang === "ar" ? product.name_ar : product.name_fr}
              className="aspect-square w-full object-cover"
            />
          </div>
          {product.variants.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {product.variants.map((v: ProductVariant) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v.id)}
                  className={`overflow-hidden rounded-lg border-2 transition ${
                    selectedVariant === v.id ? "border-primary shadow-soft" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={v.image} alt={v.name_fr} className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="space-y-6">
          <div>
            {category && (
              <span className="text-xs tracking-[0.25em] text-accent">
                {(lang === "ar" ? category.name_ar : category.name_fr).toUpperCase()}
              </span>
            )}
            <h1 className="mt-2 text-4xl tracking-tight md:text-5xl">
              {lang === "ar" ? product.name_ar : product.name_fr}
            </h1>
            <p className="mt-4 text-3xl text-primary">{formatDZD(variant?.price ?? product.price, lang)}</p>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
              inStock ? "bg-accent/15 text-accent-foreground" : "bg-destructive/15 text-destructive"
            }`}>
              <span className={`h-2 w-2 rounded-full ${inStock ? "bg-accent" : "bg-destructive"}`} />
              {inStock ? `${product.stock} ${t("stock_available")}` : t("stock_out")}
            </span>
          </div>

          {/* Variantes */}
          {product.variants.length > 1 && (
            <div>
              <h3 className="mb-3 text-sm tracking-widest text-muted-foreground uppercase">
                {t("similar_variants")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: ProductVariant) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      selectedVariant === v.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {lang === "ar" ? v.name_ar : v.name_fr}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="mb-2 text-sm tracking-widest text-muted-foreground uppercase">
              {t("description")}
            </h3>
            <p className="leading-relaxed text-foreground">
              {lang === "ar" ? product.description_ar : product.description_fr}
            </p>
          </div>

          {/* Détails */}
          <div className="grid gap-4 rounded-xl border border-border bg-card p-5 text-sm sm:grid-cols-2">
            {product.dimensions && (
              <div>
                <div className="text-xs tracking-widest text-muted-foreground uppercase">{t("dimensions")}</div>
                <div className="mt-1 text-foreground">{product.dimensions}</div>
              </div>
            )}
            <div>
              <div className="text-xs tracking-widest text-muted-foreground uppercase">{t("delivery")}</div>
              <div className="mt-1 text-foreground">{lang === "ar" ? product.delivery_ar : product.delivery_fr}</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              disabled={!inStock}
              className="flex-1 rounded-full bg-primary px-7 py-3.5 text-sm tracking-wide text-primary-foreground shadow-elevated transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("buy_now")}
            </button>
            <button
              disabled={!inStock}
              className="rounded-full border border-accent bg-transparent px-7 py-3.5 text-sm tracking-wide text-foreground transition hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("add_to_cart")}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            ✓ Création de compte requise au moment de l'achat
          </p>
        </div>
      </div>
    </div>
  );
}
