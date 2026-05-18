import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getProjectDetail } from "@/lib/ai.functions";
import { useI18n } from "@/lib/i18n";
import { formatDZD, categories } from "@/lib/catalog";
import { useState } from "react";

const categoryImage = (cat: string): string | undefined => {
  const c = cat.toLowerCase();
  const match = categories.find((k) => c.includes(k.slug) || k.slug.includes(c));
  return match?.image ?? categories.find((k) => k.slug === "mobilier")?.image;
};

export const Route = createFileRoute("/_authenticated/projet/$id")({
  component: ProjectDetailPage,
  head: () => ({ meta: [{ title: "Projet IA · DECIDOR" }] }),
});

function ProjectDetailPage() {
  const { id } = Route.useParams();
  const { t, lang } = useI18n();
  const fetchDetail = useServerFn(getProjectDetail);
  const { data, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchDetail({ data: { id } }),
  });
  const [active, setActive] = useState(0);

  if (isLoading || !data) return <div className="mx-auto max-w-7xl px-6 py-20 text-muted-foreground">Chargement…</div>;

  const variant = data.designs[active];
  const totalCost = variant?.elements?.reduce((s, e) => s + (e.estimated_price_dzd ?? 0), 0) ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link to="/mes-projets" className="text-sm text-muted-foreground hover:text-primary">← {t("ai_my_projects_title")}</Link>

      <div className="mt-4 mb-10">
        <span className="text-xs tracking-[0.25em] text-accent">{data.style.toUpperCase()}</span>
        <h1 className="mt-2 text-4xl tracking-tight">{data.room_type}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Budget {data.budget_dzd && data.budget_dzd > 0 ? formatDZD(data.budget_dzd, lang) : "non précisé"} · {new Date(data.created_at).toLocaleString("fr-DZ")}
        </p>
      </div>

      {/* variant tabs */}
      <div className="mb-6 flex gap-2">
        {data.designs.map((d, i) => (
          <button
            key={d.id}
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-2 text-sm transition ${active === i ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:border-primary"}`}
          >
            {t("ai_variant")} {d.variant_index}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
          {variant?.image_url ? (
            <img src={variant.image_url} alt={`Variante ${variant.variant_index}`} className="w-full" />
          ) : (
            <div className="aspect-video bg-muted" />
          )}
        </div>
        <aside className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-sm tracking-widest text-muted-foreground uppercase">{t("ai_elements")}</h2>
          <ul className="mt-4 divide-y divide-border">
            {(variant?.elements ?? []).map((el, i) => (
              <li key={i} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-foreground">{el.name_fr}</div>
                    <div className="text-xs text-muted-foreground">{el.category} · {el.description}</div>
                  </div>
                  <div className="shrink-0 text-sm text-primary">{formatDZD(el.estimated_price_dzd ?? 0, lang)}</div>
                </div>
              </li>
            ))}
            {(!variant?.elements || variant.elements.length === 0) && (
              <li className="py-6 text-center text-sm text-muted-foreground">Liste non disponible pour cette variante.</li>
            )}
          </ul>
          <div className="mt-6 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("ai_estimated_cost")}</span>
              <span className="text-foreground">{formatDZD(totalCost, lang)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
