import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { useState, useRef, useEffect } from "react";
import { User as UserIcon, LogOut, FolderOpen, ChevronDown } from "lucide-react";

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const displayName = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "";

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

        <div className="flex items-center gap-3">
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

          {user ? (
            <div className="relative" ref={ref}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-primary transition"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {displayName.charAt(0).toUpperCase() || "D"}
                </span>
                <span className="hidden sm:inline max-w-[120px] truncate">{displayName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
                  <Link to="/compte" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-accent/30">
                    <UserIcon className="h-4 w-4 text-accent" /> {t("nav_my_account")}
                  </Link>
                  <Link to="/mes-projets" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-accent/30">
                    <FolderOpen className="h-4 w-4 text-accent" /> {t("nav_my_projects")}
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); void signOut(); }}
                    className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-left text-sm hover:bg-accent/30"
                  >
                    <LogOut className="h-4 w-4 text-muted-foreground" /> {t("nav_logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 transition"
            >
              {t("nav_login")}
            </Link>
          )}
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
