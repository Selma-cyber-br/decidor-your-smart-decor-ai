import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getMyProjects } from "@/lib/ai.functions";
import { useI18n } from "@/lib/i18n";
import { Sparkles, ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/mes-projets")({
  component: ProjectsPage,
  head: () => ({ meta: [{ title: "Mes projets IA · DECIDOR" }] }),
});

function ProjectsPage() {
  const { t } = useI18n();
  const fetchProjects = useServerFn(getMyProjects);
  const { data, isLoading } = useQuery({
    queryKey: ["my-projects"],
    queryFn: () => fetchProjects(),
  });
  const router = useRouter();

  const projects = data?.projects ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs tracking-[0.25em] text-accent">IA · MES CRÉATIONS</span>
          <h1 className="mt-2 text-4xl tracking-tight">{t("ai_my_projects_title")}</h1>
        </div>
        <Link
          to="/ia/nouveau"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4" /> {t("ai_start")}
        </Link>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Chargement…</p>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-16 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">{t("ai_no_projects")}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => router.navigate({ to: "/projet/$id", params: { id: p.id } })}
              className="group overflow-hidden rounded-xl border border-border bg-card text-left shadow-soft transition hover:shadow-elevated"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                {p.thumbnail ? (
                  <img src={p.thumbnail} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">…</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm tracking-wider uppercase text-foreground">{p.room_type}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.style} · {new Date(p.created_at).toLocaleDateString("fr-DZ")}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
