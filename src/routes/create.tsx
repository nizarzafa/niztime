import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Dumbbell, Briefcase, Heart, Plus, Trash2, Wand2, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/site/Shell";
import { buildDraftSchedule, categoryColor, type Category, type PlanTask } from "@/lib/sample-data";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create My Plan — TIMEFLOW AI" },
      { name: "description", content: "Build a personal schedule from your tasks, hours and priorities." },
      { property: "og:title", content: "Create My Plan — TIMEFLOW AI" },
      { property: "og:description", content: "Build a personal schedule from your tasks, hours and priorities." },
    ],
  }),
  component: CreatePlan,
});

const catIcons: Record<Category, typeof BookOpen> = { study: BookOpen, fitness: Dumbbell, work: Briefcase, personal: Heart };

function CreatePlan() {
  const { t } = useI18n();
  const C = t.create;
  const [cat, setCat] = useState<Category>("study");
  const [hours, setHours] = useState(4);
  const [tasks, setTasks] = useState<PlanTask[]>([
    { id: 1, name: "Revise chapter 2", priority: "high", deadline: "2026-11-05" },
    { id: 2, name: "Practice exercises", priority: "medium", deadline: "2026-11-08" },
  ]);
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<PlanTask["priority"]>("medium");
  const [deadline, setDeadline] = useState("");
  const [result, setResult] = useState<ReturnType<typeof buildDraftSchedule> | null>(null);

  const add = () => {
    if (!name.trim()) return;
    setTasks([...tasks, { id: Date.now(), name: name.trim(), priority, deadline }]);
    setName(""); setDeadline("");
  };
  const input = "w-full rounded-xl border border-input bg-glass px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader title={C.title} sub={C.sub} />
      <div className="space-y-6">
        <section className="glass p-6">
          <h2 className="mb-4 font-semibold">1 · {C.step1}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {(Object.keys(catIcons) as Category[]).map((c) => {
              const Icon = catIcons[c];
              return (
                <button key={c} onClick={() => setCat(c)} className={`flex flex-col items-center gap-3 rounded-2xl border p-5 transition ${cat === c ? "border-primary bg-secondary shadow-glow" : "border-glass-border bg-glass hover:bg-secondary"}`}>
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${categoryColor[c]}`}><Icon className="h-5 w-5 text-primary-foreground" /></span>
                  <span className="text-sm font-medium">{t.categories[c]}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="glass p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">2 · {C.step2}</h2>
            <span className="font-display text-2xl font-bold text-gradient" dir="ltr">{hours}{C.hours}</span>
          </div>
          <input type="range" min={1} max={12} step={0.5} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full accent-primary" />
        </section>

        <section className="glass p-6">
          <h2 className="mb-4 font-semibold">3 · {C.step3}</h2>
          <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
            <input className={input} placeholder={C.taskName} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
            <select className={input} value={priority} onChange={(e) => setPriority(e.target.value as PlanTask["priority"])} aria-label={C.priority}>
              {(["high", "medium", "low"] as const).map((p) => <option key={p} value={p} className="bg-popover">{t.priority[p]}</option>)}
            </select>
            <input type="date" className={input} value={deadline} onChange={(e) => setDeadline(e.target.value)} aria-label={C.deadline} />
            <button onClick={add} className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold hover:bg-muted"><Plus className="h-4 w-4" />{C.add}</button>
          </div>
          <ul className="mt-5 space-y-2">
            {tasks.map((tk) => (
              <li key={tk.id} className="flex items-center gap-3 rounded-xl bg-glass p-3 text-sm">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tk.priority === "high" ? "bg-neon-magenta text-primary-foreground" : tk.priority === "medium" ? "bg-neon-violet text-primary-foreground" : "bg-secondary"}`}>{t.priority[tk.priority]}</span>
                <span className="flex-1">{tk.name}</span>
                {tk.deadline && <span className="text-xs text-muted-foreground" dir="ltr">{tk.deadline}</span>}
                <button onClick={() => setTasks(tasks.filter((x) => x.id !== tk.id))} aria-label={C.remove} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        </section>

        <button onClick={() => setResult(buildDraftSchedule(tasks, hours))} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand py-4 font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.01]">
          <Wand2 className="h-5 w-5" />{C.generate}
        </button>

        {result && (
          <section className="glass p-6">
            <h2 className="mb-2 font-semibold">{C.resultTitle} · {t.categories[cat]}</h2>
            <p className="mb-5 flex items-start gap-2 text-xs text-muted-foreground"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />{C.note}</p>
            {result.length === 0 ? <p className="text-sm text-muted-foreground">{C.empty}</p> : (
              <ol className="space-y-3">
                {result.map((r) => (
                  <li key={r.id} className="flex items-center gap-4 rounded-xl bg-glass p-3">
                    <span className={`h-10 w-1 rounded-full ${categoryColor[cat]}`} />
                    <span className="w-28 text-sm text-muted-foreground" dir="ltr">{r.start} – {r.end}</span>
                    <span className="flex-1 font-medium">{r.name}</span>
                    <span className="text-xs text-muted-foreground">{t.priority[r.priority]}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
