import { Link, useRouter } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function Header() {
  const { t, lang, setLang } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="group flex items-baseline gap-2">
          <span className="text-2xl tracking-[0.18em] text-foreground transition-colors group-hover:text-primary">
            DECIDOR
          </span>
          <span className="italic text-accent text-lg leading-none">φ</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm tracking-wide text-muted-foreground md:flex">
          <Link to="/catalogue" className="hover:text-primary" activeProps={{ className: "text-primary" }}>
            {t("nav_catalog")}
          </Link>
          <Link to="/ia" className="hover:text-primary" activeProps={{ className: "text-primary" }}>
            {t("nav_ai")}
          </Link>
          <Link to="/fournisseurs" className="hover:text-primary" activeProps={{ className: "text-primary" }}>
            {t("nav_suppliers")}
          </Link>
        </nav>

        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 text-xs">
          <button
            onClick={() => setLang("fr")}
            className={`rounded-full px-3 py-1 transition ${lang === "fr" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            FR
          </button>
          <button
            onClick={() => setLang("ar")}
            className={`rounded-full px-3 py-1 transition ${lang === "ar" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            ع
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl tracking-[0.18em]">DECIDOR</span>
              <span className="italic text-accent text-lg">φ</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("footer_about_text")}
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm tracking-widest text-foreground uppercase">{t("footer_links")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/catalogue" className="hover:text-primary">{t("nav_catalog")}</Link></li>
              <li><Link to="/ia" className="hover:text-primary">{t("nav_ai")}</Link></li>
              <li><Link to="/fournisseurs" className="hover:text-primary">{t("nav_suppliers")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm tracking-widest text-foreground uppercase">{t("footer_legal")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t("footer_terms")}</li>
              <li>{t("footer_privacy")}</li>
              <li>{t("footer_contact")}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-6 text-center text-xs tracking-wider text-muted-foreground">
          © {new Date().getFullYear()} DECIDOR · {t("footer_rights")} · Algérie
        </div>
      </div>
    </footer>
  );
}
