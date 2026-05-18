import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef } from "react";
import { generateDesigns } from "@/lib/ai.functions";
import { roomTypes, designStyles, colorPalettes } from "@/lib/decidor-config";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { Upload, Sparkles, ArrowLeft, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ia/nouveau")({
  component: WizardPage,
  head: () => ({ meta: [{ title: "Nouvelle génération IA · DECIDOR" }] }),
});

const TOTAL_STEPS = 6;

function WizardPage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const generate = useServerFn(generateDesigns);

  const [step, setStep] = useState(1);
  const [roomSlug, setRoomSlug] = useState<string>("");
  const [photo, setPhoto] = useState<string>(""); // data URL
  const [length, setLength] = useState(4);
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(2.8);
  const [styleSlug, setStyleSlug] = useState<string>("");
  const [paletteSlug, setPaletteSlug] = useState<string>("");
  const [budget, setBudget] = useState(0); // 0 = non précisé (optionnel)
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const room = roomTypes.find((r) => r.slug === roomSlug);
  const style = designStyles.find((s) => s.slug === styleSlug);
  const palette = colorPalettes.find((p) => p.slug === paletteSlug);

  const canNext = () => {
    if (step === 1) return !!roomSlug;
    if (step === 2) return !!photo;
    if (step === 3) return length > 0 && width > 0 && height > 0;
    if (step === 4) return !!styleSlug;
    if (step === 5) return !!paletteSlug;
    if (step === 6) return true; // budget optionnel
    return false;
  };

  const onFile = (f: File) => {
    if (f.size > 8 * 1024 * 1024) {
      toast.error("Image trop volumineuse (max 8 Mo)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(f);
  };

  const launch = async () => {
    if (!room || !style || !palette) return;
    setLoading(true);
    try {
      const res = await generate({
        data: {
          roomType: lang === "ar" ? room.name_ar : room.name_fr,
          roomTypePromptEn: room.prompt_en,
          style: lang === "ar" ? style.name_ar : style.name_fr,
          stylePromptEn: style.prompt_en,
          palette: { slug: palette.slug, name_fr: palette.name_fr, colors: palette.colors },
          dimensions: { length, width, height },
          budget,
          sourceImageBase64: photo,
        },
      });
      toast.success("Vos 3 variantes sont prêtes !");
      navigate({ to: "/projet/$id", params: { id: res.projectId } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de génération");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <div className="mx-auto mb-8 h-16 w-16 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <h2 className="text-2xl tracking-tight">{t("ai_generating")}</h2>
        <p className="mt-4 text-sm text-muted-foreground">L'IA respecte la structure de votre pièce, applique le style {style?.name_fr}, la palette {palette?.name_fr}, et produit 3 propositions photoréalistes.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* progress */}
      <div className="mb-10">
        <div className="mb-3 flex items-center justify-between text-xs tracking-wider text-muted-foreground">
          <span>{t("ai_step")} {step} {t("ai_of")} {TOTAL_STEPS}</span>
          <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-border">
          <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-soft min-h-[500px]">
        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 className="mb-2 text-2xl tracking-tight">{t("ai_step_room")}</h2>
            <p className="mb-6 text-sm text-muted-foreground">Choisissez le type de pièce à transformer.</p>
            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
              {roomTypes.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => setRoomSlug(r.slug)}
                  className={`rounded-xl border p-4 text-left transition ${roomSlug === r.slug ? "border-primary bg-primary/5" : "border-border hover:border-accent"}`}
                >
                  <div className="text-2xl">{r.emoji}</div>
                  <div className="mt-2 text-sm">{lang === "ar" ? r.name_ar : r.name_fr}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 className="mb-2 text-2xl tracking-tight">{t("ai_step_photo")}</h2>
            <p className="mb-6 text-sm text-muted-foreground">L'IA préservera la structure: murs, fenêtres, portes, perspective.</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            {photo ? (
              <div className="space-y-4">
                <img src={photo} alt="aperçu" className="mx-auto max-h-[400px] rounded-xl object-contain" />
                <button onClick={() => fileRef.current?.click()} className="text-sm text-primary hover:underline">Changer la photo</button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-background hover:border-primary transition"
              >
                <Upload className="h-10 w-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t("ai_upload_hint")}</span>
              </button>
            )}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h2 className="mb-2 text-2xl tracking-tight">{t("ai_step_dimensions")}</h2>
            <p className="mb-6 text-sm text-muted-foreground">Pour que les meubles soient à la bonne échelle.</p>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { l: t("ai_length"), v: length, set: setLength, min: 1, max: 30, step: 0.1 },
                { l: t("ai_width"), v: width, set: setWidth, min: 1, max: 30, step: 0.1 },
                { l: t("ai_height"), v: height, set: setHeight, min: 2, max: 6, step: 0.1 },
              ].map((f, i) => (
                <div key={i}>
                  <label className="mb-1 block text-xs tracking-wider text-muted-foreground uppercase">{f.l} (m)</label>
                  <input type="number" min={f.min} max={f.max} step={f.step} value={f.v} onChange={(e) => f.set(parseFloat(e.target.value) || 0)} className="w-full rounded-md border border-border bg-background px-4 py-2.5 focus:border-primary outline-none" />
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg bg-accent/10 p-4 text-sm text-muted-foreground">
              Surface au sol : <span className="text-foreground">{(length * width).toFixed(1)} m²</span>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div>
            <h2 className="mb-2 text-2xl tracking-tight">{t("ai_step_style")}</h2>
            <p className="mb-6 text-sm text-muted-foreground">7 styles signés DECIDOR.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {designStyles.map((s) => (
                <button
                  key={s.slug}
                  onClick={() => setStyleSlug(s.slug)}
                  className={`rounded-xl border p-5 text-left transition ${styleSlug === s.slug ? "border-primary bg-primary/5" : "border-border hover:border-accent"}`}
                >
                  <div className="text-base">{lang === "ar" ? s.name_ar : s.name_fr}</div>
                  {styleSlug === s.slug && <Check className="mt-2 h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div>
            <h2 className="mb-2 text-2xl tracking-tight">{t("ai_step_palette")}</h2>
            <p className="mb-6 text-sm text-muted-foreground">L'IA respectera ces tons précis.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {colorPalettes.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => setPaletteSlug(p.slug)}
                  className={`rounded-xl border p-4 text-left transition ${paletteSlug === p.slug ? "border-primary bg-primary/5" : "border-border hover:border-accent"}`}
                >
                  <div className="mb-3 flex h-12 overflow-hidden rounded-md">
                    {p.colors.map((c) => (<div key={c} className="flex-1" style={{ background: c }} />))}
                  </div>
                  <div className="text-sm">{lang === "ar" ? p.name_ar : p.name_fr}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6 */}
        {step === 6 && (
          <div>
            <h2 className="mb-2 text-2xl tracking-tight">{t("ai_step_budget")} <span className="text-sm text-muted-foreground">(optionnel)</span></h2>
            <p className="mb-6 text-sm text-muted-foreground">Si vous le précisez, l'IA adaptera matériaux et mobilier. Sinon, laissez "Non précisé".</p>
            <div className="mb-4 flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={budget === 0} onChange={(e) => setBudget(e.target.checked ? 0 : 300000)} />
                Non précisé
              </label>
            </div>
            {budget > 0 && (
              <>
                <input type="range" min={50000} max={5000000} step={10000} value={budget} onChange={(e) => setBudget(parseInt(e.target.value))} className="w-full accent-primary" />
                <div className="mt-4 text-center text-3xl tracking-tight text-primary">
                  {new Intl.NumberFormat("fr-DZ").format(budget)} DZD
                </div>
              </>
            )}
            <div className="mt-8 rounded-lg border border-border bg-background/50 p-5 text-sm">
              <h3 className="mb-3 text-xs tracking-wider text-muted-foreground uppercase">Récapitulatif</h3>
              <ul className="space-y-1.5 text-foreground">
                <li>Pièce : <span className="text-muted-foreground">{room?.name_fr}</span></li>
                <li>Dimensions : <span className="text-muted-foreground">{length}×{width}×{height} m</span></li>
                <li>Style : <span className="text-muted-foreground">{style?.name_fr}</span></li>
                <li>Palette : <span className="text-muted-foreground">{palette?.name_fr}</span></li>
                <li>Budget : <span className="text-muted-foreground">{budget > 0 ? `${new Intl.NumberFormat("fr-DZ").format(budget)} DZD` : "Non précisé"}</span></li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" /> {t("ai_prev")}
        </button>
        {step < TOTAL_STEPS ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            {t("ai_next")} <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={launch}
            disabled={!canNext()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            <Sparkles className="h-4 w-4" /> {t("ai_generate")}
          </button>
        )}
      </div>
    </div>
  );
}
