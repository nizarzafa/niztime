import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/site/Shell";
import { categoryColor, monthEvents, monthGrid, todayEvents, type Category } from "@/lib/sample-data";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Planner — NIZTIME AI" },
      { name: "description", content: "Daily, weekly and monthly planner views." },
      { property: "og:title", content: "Planner — NIZTIME AI" },
      { property: "og:description", content: "Daily, weekly and monthly planner views." },
    ],
  }),
  component: Planner,
});

type View = "daily" | "weekly" | "monthly";
const hours = Array.from({ length: 15 }, (_, i) => i + 7);

const weekBlocks: { day: number; start: number; len: number; cat: Category }[] = [
  { day: 0, start: 7, len: 1, cat: "fitness" }, { day: 0, start: 9, len: 3, cat: "study" }, { day: 0, start: 14, len: 3, cat: "work" },
  { day: 1, start: 9, len: 4, cat: "work" }, { day: 1, start: 18, len: 1.5, cat: "fitness" },
  { day: 2, start: 8, len: 4, cat: "study" }, { day: 2, start: 19, len: 2, cat: "personal" },
  { day: 3, start: 10, len: 5, cat: "work" }, { day: 3, start: 7, len: 1, cat: "fitness" },
  { day: 4, start: 9, len: 2, cat: "study" }, { day: 4, start: 13, len: 4, cat: "work" },
  { day: 5, start: 10, len: 2, cat: "fitness" }, { day: 5, start: 15, len: 4, cat: "personal" },
  { day: 6, start: 11, len: 1.5, cat: "study" }, { day: 6, start: 16, len: 5, cat: "personal" },
];

function Planner() {
  const { t, lang } = useI18n();
  const [view, setView] = useState<View>("weekly");
  const [month, setMonth] = useState(9);
  const [selected, setSelected] = useState(30);
  const cells = monthGrid(2026, month);
  const toMin = (s: string) => { const [h = 0, m = 0] = s.split(":").map(Number); return h * 60 + m; };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader title={t.planner.title} sub={t.planner.sub} />
      <div className="glass mb-6 inline-flex rounded-full! p-1">
        {(["daily", "weekly", "monthly"] as View[]).map((v) => (
          <button key={v} onClick={() => setView(v)} className={`rounded-full px-5 py-2 text-sm font-medium transition ${view === v ? "bg-gradient-brand text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"}`}>
            {t.planner[v]}
          </button>
        ))}
      </div>

      {view === "daily" && (
        <div className="glass p-6">
          <h2 className="mb-4 font-semibold">{t.daysLong[4]}, 30 {t.months[9]}</h2>
          <div className="relative" style={{ height: hours.length * 56 }}>
            {hours.map((h, i) => (
              <div key={h} className="absolute inset-x-0 flex border-t border-glass-border" style={{ top: i * 56 }}>
                <span className="w-14 -translate-y-2.5 bg-card/0 text-xs text-muted-foreground" dir="ltr">{String(h).padStart(2, "0")}:00</span>
              </div>
            ))}
            {todayEvents.map((e) => {
              const top = ((toMin(e.time) - 420) / 60) * 56;
              const height = ((toMin(e.end) - toMin(e.time)) / 60) * 56;
              return (
                <div key={e.time} className="absolute end-0 start-16 overflow-hidden rounded-xl bg-secondary p-3 transition hover:shadow-glow" style={{ top, height }}>
                  <span className={`absolute inset-y-0 start-0 w-1 ${categoryColor[e.cat]}`} />
                  <div className="ps-2 text-sm font-medium">{e.title[lang]}</div>
                  <div className="ps-2 text-xs text-muted-foreground" dir="ltr">{e.time} – {e.end}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "weekly" && (
        <div className="glass overflow-x-auto p-4 sm:p-6">
          <div className="grid min-w-[760px] grid-cols-[56px_repeat(7,1fr)]">
            <div />
            {t.daysLong.map((d, i) => (
              <div key={d} className={`pb-3 text-center text-sm font-semibold ${i === 4 ? "text-neon-cyan" : ""}`}>{d}</div>
            ))}
            <div className="relative" style={{ height: hours.length * 44 }}>
              {hours.map((h, i) => <span key={h} className="absolute text-[11px] text-muted-foreground" style={{ top: i * 44 - 6 }} dir="ltr">{h}:00</span>)}
            </div>
            {t.daysLong.map((_, di) => (
              <div key={di} className={`relative border-s border-glass-border ${di === 4 ? "bg-glass" : ""}`} style={{ height: hours.length * 44 }}>
                {hours.map((h, i) => <div key={h} className="absolute inset-x-0 border-t border-glass-border" style={{ top: i * 44 }} />)}
                {weekBlocks.filter((b) => b.day === di).map((b, i) => (
                  <div key={i} className={`absolute inset-x-1 rounded-lg ${categoryColor[b.cat]} p-1.5 text-[11px] font-semibold text-primary-foreground opacity-90 transition hover:opacity-100`} style={{ top: (b.start - 7) * 44, height: b.len * 44 - 3 }}>
                    {t.categories[b.cat]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "monthly" && (
        <div className="glass p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <button onClick={() => setMonth((m) => (m + 11) % 12)} className="rounded-full bg-secondary p-2"><ChevronLeft className="h-4 w-4 rtl:rotate-180" /></button>
            <h2 className="font-display text-xl font-semibold">{t.months[month]} 2026</h2>
            <button onClick={() => setMonth((m) => (m + 1) % 12)} className="rounded-full bg-secondary p-2"><ChevronRight className="h-4 w-4 rtl:rotate-180" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {t.days.map((d) => <div key={d} className="truncate pb-2 text-center text-xs text-muted-foreground">{d}</div>)}
            {cells.map((d, i) => {
              const ev = d ? monthEvents[d] : undefined;
              const active = d === selected;
              return (
                <button key={i} disabled={!d} onClick={() => d && setSelected(d)} className={`min-h-16 rounded-xl p-2 text-start text-sm transition sm:min-h-24 ${!d ? "" : active ? "bg-gradient-brand text-primary-foreground shadow-glow" : "bg-glass hover:bg-secondary"}`}>
                  {d && <span className="font-semibold">{d}</span>}
                  {ev && (
                    <div className="mt-1.5 hidden space-y-1 sm:block">
                      {ev.map((c, j) => <div key={j} className={`truncate rounded px-1.5 py-0.5 text-[10px] ${active ? "bg-background/30" : categoryColor[c] + " text-primary-foreground"}`}>{t.categories[c]}</div>)}
                    </div>
                  )}
                  {ev && <div className="mt-1 flex gap-0.5 sm:hidden">{ev.map((c, j) => <span key={j} className={`h-1.5 w-1.5 rounded-full ${categoryColor[c]}`} />)}</div>}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{selected} {t.months[month]} · {(monthEvents[selected]?.length ?? 0)} {t.planner.events}</p>
        </div>
      )}
    </div>
  );
}
