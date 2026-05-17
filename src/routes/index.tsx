import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-interior.jpg";
import { useI18n } from "@/lib/i18n";
import { categories } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "DECIDOR — L'art de la décoration intérieure" },
      { name: "description", content: "Transformez votre intérieur grâce à l'IA. Catalogue premium d'artisans algériens, prix en DZD." },
    ],
  }),
});

function Index() {
  const { t, lang } = useI18n();

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:py-24 md:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs tracking-widest text-accent">
              <span className="italic">φ</span> {t("hero_eyebrow")}
            </div>
            <h1 className="text-5xl leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
              {t("hero_title")}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t("hero_subtitle")}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/catalogue"
                className="rounded-full bg-primary px-7 py-3.5 text-sm tracking-wide text-primary-foreground shadow-elevated transition hover:bg-primary/90"
              >
                {t("hero_explore")} →
              </Link>
              <Link
                to="/ia"
                className="rounded-full border border-accent bg-transparent px-7 py-3.5 text-sm tracking-wide text-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                {t("hero_try_ai")}
              </Link>
            </div>
            <p className="text-xs tracking-wider text-muted-foreground">
              ✓ {t("free_access")}
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-mauve opacity-20 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl shadow-elevated">
              <img
                src={heroImg}
                alt="Intérieur DECIDOR"
                width={1600}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 rounded-xl bg-card/95 px-5 py-4 shadow-gold backdrop-blur md:left-10 md:right-10">
              <div className="flex items-center justify-between text-xs">
                <span className="tracking-widest text-muted-foreground">PROPORTION φ</span>
                <span className="italic text-accent">1.618</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choix Client / Fournisseur */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-2 md:py-20">
          <Link
            to="/catalogue"
            className="group relative overflow-hidden rounded-2xl border border-border bg-background p-8 transition hover:border-primary hover:shadow-elevated md:p-10"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-mauve opacity-10 blur-2xl transition group-hover:opacity-30" />
            <span className="text-xs tracking-[0.25em] text-accent">01 · CLIENT</span>
            <h2 className="mt-3 text-3xl tracking-tight text-foreground">{t("cta_client")}</h2>
            <p className="mt-3 text-muted-foreground">{t("cta_client_sub")}</p>
            <div className="mt-8 inline-flex items-center gap-2 text-sm text-primary">
              {t("hero_explore")} <span className="transition group-hover:translate-x-1">{lang === "ar" ? "←" : "→"}</span>
            </div>
          </Link>

          <Link
            to="/fournisseurs"
            className="group relative overflow-hidden rounded-2xl border border-border bg-background p-8 transition hover:border-accent hover:shadow-gold md:p-10"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-gold opacity-10 blur-2xl transition group-hover:opacity-30" />
            <span className="text-xs tracking-[0.25em] text-accent">02 · PRO</span>
            <h2 className="mt-3 text-3xl tracking-tight text-foreground">{t("cta_supplier")}</h2>
            <p className="mt-3 text-muted-foreground">{t("cta_supplier_sub")}</p>
            <div className="mt-8 inline-flex items-center gap-2 text-sm text-accent">
              {t("nav_about")} <span className="transition group-hover:translate-x-1">{lang === "ar" ? "←" : "→"}</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Catégories */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <span className="text-xs tracking-[0.25em] text-accent">CATALOGUE</span>
            <h2 className="mt-2 text-4xl tracking-tight md:text-5xl">{t("categories_title")}</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">{t("categories_subtitle")}</p>
          </div>
          <Link to="/catalogue" className="hidden text-sm tracking-wide text-primary hover:underline md:inline">
            {t("view_all")} →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((cat, i) => (
            <Link
              key={cat.slug}
              to="/catalogue/$category"
              params={{ category: cat.slug }}
              className="group overflow-hidden rounded-xl bg-card shadow-soft transition hover:shadow-elevated"
              style={{ aspectRatio: i % 3 === 0 ? "1 / 1.618" : "1.618 / 1" }}
            >
              <div className="relative h-full w-full">
                <img
                  src={cat.image}
                  alt={lang === "ar" ? cat.name_ar : cat.name_fr}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-anthracite/80 via-anthracite/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl text-ivory">
                    {lang === "ar" ? cat.name_ar : cat.name_fr}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
