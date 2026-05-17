import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/compte")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "Mon compte · DECIDOR" }] }),
});

function AccountPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone").eq("id", user.id).single().then(({ data }) => {
      if (data) {
        setFullName(data.full_name ?? "");
        setPhone(data.phone ?? "");
      }
    });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName, phone, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success(t("account_saved"));
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-4xl tracking-tight">{t("account_title")}</h1>
      <form onSubmit={save} className="mt-10 space-y-5 rounded-2xl border border-border bg-card p-8 shadow-soft">
        <div>
          <label className="mb-1 block text-xs tracking-wider text-muted-foreground uppercase">{t("account_email")}</label>
          <input value={user?.email ?? ""} disabled className="w-full rounded-md border border-border bg-muted/50 px-4 py-2.5 text-muted-foreground" />
        </div>
        <div>
          <label className="mb-1 block text-xs tracking-wider text-muted-foreground uppercase">{t("account_name")}</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-md border border-border bg-background px-4 py-2.5 focus:border-primary outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs tracking-wider text-muted-foreground uppercase">{t("account_phone")}</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+213 ..." className="w-full rounded-md border border-border bg-background px-4 py-2.5 focus:border-primary outline-none" />
        </div>
        <button disabled={saving} className="rounded-md bg-primary px-6 py-2.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
          {saving ? t("auth_loading") : t("account_save")}
        </button>
      </form>
    </div>
  );
}
