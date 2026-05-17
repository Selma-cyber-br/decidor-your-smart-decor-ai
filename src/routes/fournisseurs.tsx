import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/fournisseurs")({
  component: SuppliersPage,
  head: () => ({
    meta: [
      { title: "Fournisseurs & Artisans — DECIDOR" },
      { name: "description", content: "Rejoignez le réseau DECIDOR d'artisans et fournisseurs algériens premium." },
    ],
  }),
});

function SuppliersPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <span className="text-xs tracking-[0.25em] text-accent">PRO · PHASE 3</span>
      <h1 className="mt-3 text-5xl tracking-tight">{t("cta_supplier")}</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        {t("supplier_coming_desc")}
      </p>
      <div className="mt-10 grid gap-4 rounded-2xl border border-border bg-card p-8 text-left shadow-soft sm:grid-cols-2">
        <div>
          <h4 className="text-sm tracking-widest text-accent uppercase">Revenus</h4>
          <p className="mt-2 text-sm text-foreground">Tableau de bord avec commandes, demandes, note client.</p>
        </div>
        <div>
          <h4 className="text-sm tracking-widest text-accent uppercase">Wallet</h4>
          <p className="mt-2 text-sm text-foreground">Commissions débitées uniquement après livraison confirmée.</p>
        </div>
        <div>
          <h4 className="text-sm tracking-widest text-accent uppercase">Chat sécurisé</h4>
          <p className="mt-2 text-sm text-foreground">Anonymat préservé, filtrage anti-bypass.</p>
        </div>
        <div>
          <h4 className="text-sm tracking-widest text-accent uppercase">Algorithme</h4>
          <p className="mt-2 text-sm text-foreground">Classement par note, prix et proximité géographique.</p>
        </div>
      </div>
      <Link to="/" className="mt-10 inline-block text-primary hover:underline">
        ← Accueil
      </Link>
    </div>
  );
}
