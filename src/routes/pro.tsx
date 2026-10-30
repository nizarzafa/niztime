import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Crown, Route as RouteIcon, RefreshCw, LineChart, LayoutTemplate, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/pro")({
  head: () => ({
    meta: [
      { title: "Pro Features — NIZTIME AI" },
      { name: "description", content: "Advanced planning, smart adjustments, analytics and premium templates." },
      { property: "og:title", content: "Pro Features — NIZTIME AI" },
      { property: "og:description", content: "Advanced planning, smart adjustments, analytics and premium templates." },
    ],
  }),
  component: Pro,
});

const icons = [RouteIcon, RefreshCw, LineChart, LayoutTemplate];

function Pro() {
  const { t } = useI18n();
  const [joined, setJoined] = useState(false);
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-14 text-center">
        <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand shadow-glow"><Crown className="h-8 w-8 text-primary-foreground" /></span>
        <h1 className="text-4xl font-extrabold sm:text-5xl"><span className="text-gradient">{t.pro.title}</span></h1>
        <p className="mt-3 text-muted-foreground">{t.pro.sub}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {t.pro.items.map(([title, desc], i) => {
          const Icon = icons[i] ?? Crown;
          return (
            <div key={title} className="glass group relative overflow-hidden p-8 transition hover:-translate-y-1 hover:shadow-glow">
              <div className="absolute -end-16 -top-16 h-40 w-40 rounded-full bg-gradient-brand opacity-20 blur-3xl transition group-hover:opacity-40" />
              <Icon className="relative mb-5 h-8 w-8 text-neon-cyan" />
              <h3 className="relative text-xl font-semibold">{title}</h3>
              <p className="relative mt-2 text-muted-foreground">{desc}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-12 text-center">
        <button onClick={() => setJoined(true)} className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-8 py-4 font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.03]">
          {joined ? <Check className="h-5 w-5" /> : <Crown className="h-5 w-5" />}{t.pro.cta}
        </button>
        <p className="mt-3 text-xs text-muted-foreground">{t.pro.note}</p>
      </div>
    </div>
  );
}
