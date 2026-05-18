import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { submitSupplierApplication } from "@/lib/suppliers.functions";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Upload, X, Crown, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/fournisseurs/inscription")({
  component: SupplierWizard,
  head: () => ({ meta: [{ title: "Devenir fournisseur · DECIDOR" }] }),
});

const TOTAL = 7;

const CATEGORIES = [
  "Peinture", "Carrelage & Faïence", "Mobilier", "Lustres & Éclairage",
  "Tapis", "Cuisine équipée", "Parquet & Sol", "Rideaux",
];
const ARTISAN_TYPES = [
  "Peintre", "Carreleur", "Menuisier", "Plombier", "Électricien",
  "Plâtrier", "Tapissier", "Ferronnier", "Décorateur", "Maçon",
];
const VILLES = [
  "Alger", "Oran", "Constantine", "Annaba", "Blida", "Sétif", "Batna",
  "Tlemcen", "Béjaïa", "Skikda", "Tizi Ouzou", "Mostaganem", "Ouargla",
  "Ghardaïa", "Tipaza", "Chlef", "Médéa", "Djelfa",
];

type Photo = { data: string; name: string };

function SupplierWizard() {
  const navigate = useNavigate();
  const submit = useServerFn(submitSupplierApplication);

  const [step, setStep] = useState(1);
  const [type, setType] = useState<"fournisseur" | "artisan">("fournisseur");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState<"gratuit" | "premium">("gratuit");
  const [paymentMethod, setPaymentMethod] = useState<"baridimob" | "dhahabia" | "none">("none");
  const [paymentRef, setPaymentRef] = useState("");
  const [rc, setRc] = useState("");
  const [category, setCategory] = useState("");
  const [artisanType, setArtisanType] = useState("");
  const [city, setCity] = useState("");
  const [productPhotos, setProductPhotos] = useState<Photo[]>([]);
  const [workSamples, setWorkSamples] = useState<Photo[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const prodRef = useRef<HTMLInputElement>(null);
  const workRef = useRef<HTMLInputElement>(null);

  const readFiles = (files: FileList, setter: (p: Photo[]) => void, existing: Photo[]) => {
    const arr = Array.from(files).slice(0, 10 - existing.length);
    Promise.all(
      arr.map(
        (f) =>
          new Promise<Photo>((resolve) => {
            if (f.size > 5 * 1024 * 1024) {
              toast.error(`${f.name}: max 5 Mo`);
              return resolve({ data: "", name: f.name });
            }
            const r = new FileReader();
            r.onload = () => resolve({ data: r.result as string, name: f.name });
            r.readAsDataURL(f);
          }),
      ),
    ).then((res) => setter([...existing, ...res.filter((p) => p.data)]));
  };

  const canNext = () => {
    if (step === 1) return firstName.trim() && lastName.trim() && phone.trim().length >= 6;
    if (step === 2) return true; // plan
    if (step === 3) return plan === "gratuit" || (paymentMethod !== "none" && paymentRef.trim().length >= 4);
    if (step === 4) return rc.trim().length >= 3;
    if (step === 5) return !!type && !!category && (type === "fournisseur" || !!artisanType) && !!city;
    if (step === 6) return productPhotos.length > 0;
    if (step === 7) return true;
    return false;
  };

  const next = () => {
    // skip step 3 (payment) if plan is gratuit
    if (step === 2 && plan === "gratuit") {
      setPaymentMethod("none");
      setPaymentRef("");
      setStep(4);
      return;
    }
    setStep((s) => Math.min(TOTAL, s + 1));
  };
  const prev = () => {
    if (step === 4 && plan === "gratuit") {
      setStep(2);
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  };

  const send = async () => {
    setSubmitting(true);
    try {
      await submit({
        data: {
          type,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          plan,
          payment_method: paymentMethod,
          payment_reference: paymentRef.trim() || undefined,
          registre_commerce: rc.trim(),
          category,
          artisan_type: type === "artisan" ? artisanType : undefined,
          city,
          product_photos: productPhotos,
          work_samples: workSamples,
        },
      });
      setDone(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur d'envoi");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl tracking-tight">Demande reçue</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Merci {firstName}. Votre dossier a bien été transmis à notre équipe.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left shadow-soft">
          <h3 className="text-xs tracking-[0.25em] text-accent uppercase">Prochaine étape</h3>
          <p className="mt-3 text-foreground">
            Nos équipes vont étudier vos informations dans un délai de <span className="text-primary">24 heures</span>. Vous recevrez une notification dès validation.
          </p>
        </div>
        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-10 rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <p className="text-muted-foreground">Envoi de votre dossier en cours…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 text-center">
        <span className="text-xs tracking-[0.25em] text-accent">DEVENIR FOURNISSEUR / ARTISAN</span>
        <h1 className="mt-2 text-3xl tracking-tight">Inscription DECIDOR Pro</h1>
      </div>

      {/* progress */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs tracking-wider text-muted-foreground">
          <span>Étape {step} / {TOTAL}</span>
          <span>{Math.round((step / TOTAL) * 100)}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-border">
          <div className="h-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${(step / TOTAL) * 100}%` }} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-soft min-h-[420px]">
        {step === 1 && (
          <div>
            <h2 className="mb-2 text-2xl tracking-tight">Vos coordonnées</h2>
            <p className="mb-6 text-sm text-muted-foreground">Pour vous contacter dès validation.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Prénom" value={firstName} set={setFirstName} placeholder="Karim" />
              <Field label="Nom" value={lastName} set={setLastName} placeholder="Benali" />
              <div className="sm:col-span-2">
                <Field label="Numéro de téléphone" value={phone} set={setPhone} placeholder="+213 555 12 34 56" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-2 text-2xl tracking-tight">Choisissez votre offre</h2>
            <p className="mb-6 text-sm text-muted-foreground">Évoluez selon votre activité.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <PlanCard
                active={plan === "gratuit"}
                onClick={() => setPlan("gratuit")}
                title="Gratuit"
                price="0 DZD"
                features={["Profil visible", "Jusqu'à 5 produits", "Commission standard"]}
              />
              <PlanCard
                active={plan === "premium"}
                onClick={() => setPlan("premium")}
                title="Premium"
                price="2 500 DZD / mois"
                badge="Recommandé"
                premium
                features={["Mise en avant prioritaire", "Produits illimités", "Commission réduite", "Statistiques avancées", "Badge vérifié doré"]}
              />
            </div>
          </div>
        )}

        {step === 3 && plan === "premium" && (
          <div>
            <h2 className="mb-2 text-2xl tracking-tight">Paiement Premium</h2>
            <p className="mb-6 text-sm text-muted-foreground">Choisissez votre moyen de paiement algérien.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <PayCard active={paymentMethod === "baridimob"} onClick={() => setPaymentMethod("baridimob")} name="Baridi Mob" sub="Algérie Poste" color="bg-yellow-500" />
              <PayCard active={paymentMethod === "dhahabia"} onClick={() => setPaymentMethod("dhahabia")} name="Dhahabia" sub="Carte interbancaire" color="bg-amber-600" />
            </div>
            {paymentMethod !== "none" && (
              <div className="mt-6">
                <Field
                  label={paymentMethod === "baridimob" ? "Référence transaction Baridi Mob" : "Numéro de carte Dhahabia (16 chiffres)"}
                  value={paymentRef}
                  set={setPaymentRef}
                  placeholder={paymentMethod === "baridimob" ? "Ex: BM-2026-..." : "•••• •••• •••• ••••"}
                />
                <p className="mt-3 rounded-lg bg-accent/10 p-3 text-xs text-muted-foreground">
                  Effectuez le virement de 2 500 DZD au RIB <span className="text-foreground">00799999000123456789</span> (DECIDOR SARL) puis indiquez la référence.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="mb-2 text-2xl tracking-tight">Registre de commerce</h2>
            <p className="mb-6 text-sm text-muted-foreground">Numéro officiel délivré par le CNRC.</p>
            <Field label="Numéro RC" value={rc} set={setRc} placeholder="16/00-1234567 B 23" />
            <p className="mt-4 text-xs text-muted-foreground">
              Les artisans inscrits à la Chambre d'Artisanat peuvent saisir leur numéro de carte artisanale.
            </p>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="mb-2 text-2xl tracking-tight">Votre activité</h2>
            <p className="mb-6 text-sm text-muted-foreground">Type, catégorie et ville d'intervention.</p>

            <label className="mb-1 block text-xs tracking-wider text-muted-foreground uppercase">Vous êtes</label>
            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              {(["fournisseur", "artisan"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-xl border p-4 text-left transition ${type === t ? "border-primary bg-primary/5" : "border-border hover:border-accent"}`}
                >
                  <div className="text-base capitalize">{t}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {t === "fournisseur" ? "Je vends des produits" : "Je propose un service / savoir-faire"}
                  </div>
                </button>
              ))}
            </div>

            <Select label="Catégorie" value={category} set={setCategory} options={CATEGORIES} />

            {type === "artisan" && (
              <div className="mt-4">
                <Select label="Type d'artisan" value={artisanType} set={setArtisanType} options={ARTISAN_TYPES} />
              </div>
            )}

            <div className="mt-4">
              <Select label="Ville" value={city} set={setCity} options={VILLES} />
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h2 className="mb-2 text-2xl tracking-tight">Photos de vos produits</h2>
            <p className="mb-6 text-sm text-muted-foreground">Ajoutez 1 à 10 photos (jusqu'à 5 Mo chacune).</p>
            <input ref={prodRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => e.target.files && readFiles(e.target.files, setProductPhotos, productPhotos)} />
            <PhotoGrid photos={productPhotos} remove={(i) => setProductPhotos(productPhotos.filter((_, j) => j !== i))} />
            {productPhotos.length < 10 && (
              <button
                onClick={() => prodRef.current?.click()}
                className="mt-4 flex h-32 w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary"
              >
                <Upload className="h-5 w-5" /> Ajouter des photos
              </button>
            )}
          </div>
        )}

        {step === 7 && (
          <div>
            <h2 className="mb-2 text-2xl tracking-tight">
              {type === "artisan" ? "Exemples de vos travaux" : "Photos complémentaires (optionnel)"}
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {type === "artisan"
                ? "Montrez quelques réalisations récentes pour rassurer vos futurs clients."
                : "Ajoutez certificats, vitrine, ou laissez vide pour passer."}
            </p>
            <input ref={workRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => e.target.files && readFiles(e.target.files, setWorkSamples, workSamples)} />
            <PhotoGrid photos={workSamples} remove={(i) => setWorkSamples(workSamples.filter((_, j) => j !== i))} />
            {workSamples.length < 10 && (
              <button
                onClick={() => workRef.current?.click()}
                className="mt-4 flex h-32 w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary"
              >
                <Upload className="h-5 w-5" /> Ajouter
              </button>
            )}

            <div className="mt-8 rounded-xl border border-accent/30 bg-accent/5 p-5 text-sm">
              <p className="text-foreground">
                Récapitulatif : <span className="text-muted-foreground">{type} · {category}{artisanType ? ` · ${artisanType}` : ""} · {city} · plan {plan}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={prev}
          disabled={step === 1}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" /> Précédent
        </button>
        {step < TOTAL ? (
          <button
            onClick={next}
            disabled={!canNext()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            Suivant <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={send}
            disabled={!canNext()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            <Sparkles className="h-4 w-4" /> Envoyer ma demande
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, set, placeholder }: { label: string; value: string; set: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs tracking-wider text-muted-foreground uppercase">{label}</label>
      <input
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-background px-4 py-2.5 outline-none focus:border-primary"
      />
    </div>
  );
}

function Select({ label, value, set, options }: { label: string; value: string; set: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="mb-1 block text-xs tracking-wider text-muted-foreground uppercase">{label}</label>
      <select
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-4 py-2.5 outline-none focus:border-primary"
      >
        <option value="">— Choisir —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function PlanCard({ active, onClick, title, price, features, badge, premium }: {
  active: boolean; onClick: () => void; title: string; price: string; features: string[]; badge?: string; premium?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl border p-6 text-left transition ${active ? "border-primary bg-primary/5" : "border-border hover:border-accent"}`}
    >
      {badge && (
        <span className="absolute -top-3 right-4 rounded-full bg-accent px-3 py-1 text-[10px] tracking-wider text-accent-foreground uppercase">
          {badge}
        </span>
      )}
      <div className="flex items-center gap-2">
        {premium && <Crown className="h-5 w-5 text-accent" />}
        <h3 className="text-xl">{title}</h3>
      </div>
      <p className="mt-2 text-2xl tracking-tight text-primary">{price}</p>
      <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        {features.map((f) => <li key={f}>· {f}</li>)}
      </ul>
    </button>
  );
}

function PayCard({ active, onClick, name, sub, color }: { active: boolean; onClick: () => void; name: string; sub: string; color: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${active ? "border-primary bg-primary/5" : "border-border hover:border-accent"}`}
    >
      <div className={`h-10 w-10 rounded-md ${color}`} />
      <div>
        <div className="text-base">{name}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      {active && <Check className="ml-auto h-5 w-5 text-primary" />}
    </button>
  );
}

function PhotoGrid({ photos, remove }: { photos: Photo[]; remove: (i: number) => void }) {
  if (!photos.length) return null;
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {photos.map((p, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-border">
          <img src={p.data} alt={p.name} className="h-full w-full object-cover" />
          <button
            onClick={() => remove(i)}
            className="absolute top-1 right-1 rounded-full bg-background/90 p-1 text-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
