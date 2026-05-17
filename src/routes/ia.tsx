import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { Sparkles } from "lucide-react";
import { roomTypes, designStyles, colorPalettes } from "@/lib/decidor-config";

export const Route = createFileRoute("/ia")({
  component: AiPage,
  head: () => ({
    meta: [
      { title: "Génération IA · DECIDOR" },
      { name: "description", content: "L'IA DECIDOR transforme une photo de votre pièce en intérieur photoréaliste personnalisé selon le style, la palette et le budget." },
    ],
  }),
});

function AiPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <span className="text-xs tracking-[0.25em] text-accent">IA · DECIDOR</span>
        <h1 className="mt-3 text-5xl tracking-tight">{t("nav_ai")}</h1>
        <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Importez une photo de votre pièce. Choisissez un style et une palette. Notre IA respecte la structure (murs, fenêtre, porte, perspective) et génère 3 propositions photoréalistes avec la liste complète des éléments.
        </p>
        <div className="mt-8">
          <Link
            to={user ? "/ia/nouveau" : "/auth"}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="h-4 w-4" /> {user ? t("ai_start") : t("nav_login")}
          </Link>
        </div>
      </div>

      <div className="mt-20 grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="mb-4 text-xs tracking-widest text-muted-foreground uppercase">{t("ai_step_room")}</h3>
          <ul className="space-y-1.5 text-sm">
            {roomTypes.slice(0, 8).map((r) => (
              <li key={r.slug}>{r.emoji} {lang === "ar" ? r.name_ar : r.name_fr}</li>
            ))}
            <li className="text-muted-foreground">+ {roomTypes.length - 8} autres</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="mb-4 text-xs tracking-widest text-muted-foreground uppercase">{t("ai_step_style")}</h3>
          <ul className="space-y-1.5 text-sm">
            {designStyles.map((s) => (
              <li key={s.slug}>· {lang === "ar" ? s.name_ar : s.name_fr}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="mb-4 text-xs tracking-widest text-muted-foreground uppercase">{t("ai_step_palette")}</h3>
          <div className="space-y-2">
            {colorPalettes.map((p) => (
              <div key={p.slug} className="flex items-center gap-3">
                <div className="flex h-5 w-16 overflow-hidden rounded">
                  {p.colors.map((c) => <div key={c} className="flex-1" style={{ background: c }} />)}
                </div>
                <span className="text-xs">{lang === "ar" ? p.name_ar : p.name_fr}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
