import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { ArrowRight, Crown, Store, Hammer, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/fournisseurs")({
  component: SuppliersPage,
  head: () => ({
    meta: [
      { title: "Devenir Fournisseur ou Artisan — DECIDOR" },
      { name: "description", content: "Rejoignez le réseau DECIDOR : fournisseurs et artisans algériens premium. Inscription en 7 étapes, paiement Baridi Mob ou Dhahabia." },
    ],
  }),
});

function SuppliersPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();

  const start = () => {
    if (user) navigate({ to: "/fournisseurs/inscription" });
    else navigate({ to: "/auth", search: { redirect: "/fournisseurs/inscription" } });
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <span className="text-xs tracking-[0.25em] text-accent">PRO · DECIDOR</span>
        <h1 className="mt-3 text-5xl tracking-tight">{t("cta_supplier")}</h1>
        <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Vendez vos produits ou proposez vos services à des milliers de clients algériens en quête d'intérieurs premium. Inscription guidée en quelques minutes.
        </p>
        <button
          onClick={start}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Commencer mon inscription <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <Card icon={<Store className="h-6 w-6 text-accent" />} title="Fournisseurs"
              text="Boutique, mise en avant catalogue, commandes directes des clients DECIDOR." />
        <Card icon={<Hammer className="h-6 w-6 text-accent" />} title="Artisans"
              text="Peintres, carreleurs, menuisiers… présentez vos travaux par ville." />
        <Card icon={<Crown className="h-6 w-6 text-accent" />} title="Premium"
              text="Badge doré vérifié, visibilité prioritaire, commission réduite." />
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-soft">
        <h3 className="text-xs tracking-[0.25em] text-accent uppercase">Comment ça marche</h3>
        <ol className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          {[
            "Renseignez votre nom, prénom et numéro de téléphone.",
            "Choisissez l'offre Gratuit ou Premium.",
            "Payez en Baridi Mob ou Dhahabia (si Premium).",
            "Saisissez votre numéro de registre de commerce.",
            "Indiquez votre catégorie et votre ville.",
            "Ajoutez les photos de vos produits ou réalisations.",
          ].map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">{i + 1}</span>
              <span className="text-foreground/90">{s}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex items-center gap-3 rounded-lg bg-accent/10 p-4 text-sm">
          <ShieldCheck className="h-5 w-5 text-accent" />
          <p className="text-foreground">Vos informations sont étudiées sous <span className="text-primary">24 heures</span> par notre équipe.</p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link to="/" className="text-sm text-primary hover:underline">← Accueil</Link>
      </div>
    </div>
  );
}

function Card({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-3">{icon}</div>
      <h4 className="text-base">{title}</h4>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
