import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/ia")({
  component: AiPage,
  head: () => ({
    meta: [
      { title: "Génération IA — DECIDOR" },
      { name: "description", content: "L'IA DECIDOR transforme une photo de votre pièce en intérieur photoréaliste, sur mesure." },
    ],
  }),
});

function AiPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <span className="text-xs tracking-[0.25em] text-accent">IA · PHASE 2</span>
      <h1 className="mt-3 text-5xl tracking-tight">{t("nav_ai")}</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        {t("ai_coming_desc")}
      </p>
      <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-left shadow-soft">
        <h3 className="mb-4 text-sm tracking-widest text-muted-foreground uppercase">Le pipeline IA</h3>
        <ol className="space-y-3 text-sm text-foreground">
          <li><span className="text-accent">01 ·</span> Choisir le type de pièce</li>
          <li><span className="text-accent">02 ·</span> Importer une photo réelle</li>
          <li><span className="text-accent">03 ·</span> Indiquer la superficie</li>
          <li><span className="text-accent">04 ·</span> Sélectionner un style (Classique, Minimaliste, Méditerranéen, Scandinave)</li>
          <li><span className="text-accent">05 ·</span> Choisir une palette de couleurs</li>
          <li><span className="text-accent">06 ·</span> Définir le budget en DZD</li>
          <li><span className="text-accent">07 ·</span> 3 propositions photoréalistes générées</li>
        </ol>
      </div>
      <Link to="/catalogue" className="mt-10 inline-block text-primary hover:underline">
        ← {t("nav_catalog")}
      </Link>
    </div>
  );
}
