import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, CalendarDays, ListPlus, Crown, Flame, Clock, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/site/Shell";
import { categoryColor, goalProgress, monthEvents, monthGrid, todayEvents, weekHours, type Category } from "@/lib/sample-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TIMEFLOW AI" },
      { name: "description", content: "Your day, week and goals at a glance." },
      { property: "og:title", content: "Dashboard — TIMEFLOW AI" },
      { property: "og:description", content: "Your day, week and goals at a glance." },
    ],
  }),
  component: Dashboard,
});

const cats: Category[] = ["study", "fitness", "work", "personal"];

function Dashboard() {
  const { t, lang } = useI18n();
  const D = t.dashboard;
  const max = Math.max(...weekHours.map((d) => Object.values(d).reduce((a, b) => a + b, 0)));
  const cells = monthGrid(2026, 9);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader title={D.welcome} sub={D.sub} />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Clock, v: "6.5h", l: D.focus },
          { icon: CheckCircle2, v: "18/24", l: D.tasksDone },
          { icon: Flame, v: "12", l: D.streak },
        ].map(({ icon: Icon, v, l }) => (
          <div key={l} className="glass flex items-center gap-4 p-5">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand"><Icon className="h-5 w-5 text-primary-foreground" /></div>
            <div><div className="font-display text-2xl font-bold" dir="ltr">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="glass p-6 lg:col-span-2">
          <h2 className="mb-5 text-lg font-semibold">{D.today}</h2>
          <ol className="space-y-3">
            {todayEvents.map((e) => (
              <li key={e.time} className="flex items-center gap-4 rounded-xl bg-glass p-3 transition hover:bg-secondary">
                <span className={`h-10 w-1 rounded-full ${categoryColor[e.cat]}`} />
                <span className="w-24 shrink-0 text-sm text-muted-foreground" dir="ltr">{e.time} – {e.end}</span>
                <span className="flex-1 font-medium">{e.title[lang]}</span>
                <span className="hidden rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground sm:inline">{t.categories[e.cat]}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="glass p-6">
          <h2 className="mb-5 text-lg font-semibold">{D.quick}</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: "/create", icon: Plus, l: D.newPlan },
              { to: "/planner", icon: CalendarDays, l: D.openPlanner },
              { to: "/create", icon: ListPlus, l: D.addTask },
              { to: "/pro", icon: Crown, l: D.viewPro },
            ].map(({ to, icon: Icon, l }) => (
              <Link key={l} to={to} className="flex flex-col items-start gap-3 rounded-xl bg-glass p-4 text-sm font-medium transition hover:bg-secondary hover:shadow-glow">
                <Icon className="h-5 w-5 text-neon-cyan" />{l}
              </Link>
            ))}
          </div>
        </section>

        <section className="glass p-6 lg:col-span-2">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{D.week}</h2>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {cats.map((c) => <span key={c} className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${categoryColor[c]}`} />{t.categories[c]}</span>)}
            </div>
          </div>
          <div className="flex h-48 items-end gap-3">
            {weekHours.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full max-w-10 flex-col-reverse overflow-hidden rounded-lg" style={{ height: `${(Object.values(d).reduce((a, b) => a + b, 0) / max) * 160}px` }}>
                  {cats.map((c) => <div key={c} className={categoryColor[c]} style={{ flex: d[c] }} />)}
                </div>
                <span className="text-[11px] text-muted-foreground">{t.days[i]?.slice(0, 3)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass p-6">
          <h2 className="mb-4 text-lg font-semibold">{D.month} · {t.months[9]}</h2>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {cells.map((d, i) => (
              <div key={i} className={`relative aspect-square rounded-md ${d === 30 ? "bg-gradient-brand font-bold text-primary-foreground" : d ? "bg-glass" : ""}`}>
                <span className="absolute inset-0 grid place-items-center">{d}</span>
                {d && monthEvents[d] && d !== 30 && <span className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${categoryColor[monthEvents[d][0] ?? "work"]}`} />}
              </div>
            ))}
          </div>
        </section>

        <section className="glass p-6 lg:col-span-3">
          <h2 className="mb-5 text-lg font-semibold">{D.goals}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {D.goalList.map((g, i) => (
              <div key={g}>
                <div className="mb-2 flex justify-between text-sm"><span>{g}</span><span className="text-muted-foreground" dir="ltr">{goalProgress[i]}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-gradient-brand transition-all duration-700" style={{ width: `${goalProgress[i]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
