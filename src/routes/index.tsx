import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Layers, Target, CalendarRange, BarChart3, Languages, ShieldCheck, Check, Brain, CalendarCheck2, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { categoryColor, monthEvents, monthGrid } from "@/lib/sample-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NIZTIME AI — Master Your Time. Design Your Life." },
      { name: "description", content: "NIZTIME AI organizes your studies, fitness, work and personal goals in one futuristic planner." },
      { property: "og:title", content: "NIZTIME AI — Master Your Time. Design Your Life." },
      { property: "og:description", content: "One intelligent planner for study, fitness, work and life." },
    ],
  }),
  component: Landing,
});

function Calendar3D() {
  const { t } = useI18n();
  const cells = monthGrid(2026, 9);
  return (
    <div className="relative mx-auto w-full max-w-md [perspective:1200px]">
      <div className="absolute -inset-10 rounded-full bg-gradient-brand opacity-30 blur-3xl animate-pulse-glow" />
      <div className="glass relative animate-float p-5 shadow-glow [transform-style:preserve-3d]">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-display font-semibold">{t.months[9]} 2026</span>
          <span className="h-2 w-2 rounded-full bg-neon-cyan shadow-cyan" />
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] text-muted-foreground">
          {t.days.map((d) => <span key={d} className="truncate">{d.slice(0, 2)}</span>)}
          {cells.map((d, i) => (
            <div key={i} className={`relative aspect-square rounded-lg text-xs ${d ? "bg-glass text-foreground" : ""} ${d === 30 ? "bg-gradient-brand! text-primary-foreground font-bold" : ""}`}>
              <span className="absolute inset-0 grid place-items-center">{d}</span>
              {d && monthEvents[d] && d !== 30 && (
                <span className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                  {monthEvents[d].map((c, j) => <span key={j} className={`h-1 w-1 rounded-full ${categoryColor[c]}`} />)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="glass absolute -bottom-6 -start-6 hidden animate-float-slow p-3 sm:block">
        <div className="flex items-center gap-2 text-xs"><span className="h-2 w-2 rounded-full bg-neon-violet" />09:00 · {t.categories.study}</div>
      </div>
      <div className="glass absolute -top-6 -end-4 hidden animate-float-slow p-3 sm:block">
        <div className="flex items-center gap-2 text-xs"><span className="h-2 w-2 rounded-full bg-neon-cyan" />07:00 · {t.categories.fitness}</div>
      </div>
    </div>
  );
}

const icons = [Layers, Target, CalendarRange, BarChart3, Languages, ShieldCheck];
const heroCardIcons = [Brain, CalendarCheck2, TrendingUp];

function Landing() {
  const { t } = useI18n();
  const L = t.landing;
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-lines [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="glass inline-flex items-center gap-2 rounded-full! px-4 py-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-neon-cyan" /> {L.badge}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] sm:text-6xl">
              <span className="text-gradient">{L.tagline}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{L.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard" className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.03]">
                {t.common.getStarted} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180" />
              </Link>
              <a href="#features" className="glass inline-flex items-center rounded-full! px-7 py-3.5 font-semibold transition hover:bg-secondary">
                {t.common.learnMore}
              </a>
            </div>
            <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
              {L.heroCards.map(([title, desc], i) => {
                const Icon = heroCardIcons[i] ?? Brain;
                return (
                  <div key={title} className="glass group p-4 transition hover:-translate-y-1 hover:shadow-glow">
                    <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand">
                      <Icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <Calendar3D />
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{L.featuresTitle}</h2>
          <p className="mt-3 text-muted-foreground">{L.featuresSub}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {L.features.map(([title, desc], i) => {
            const Icon = icons[i] ?? Layers;
            return (
              <div key={title} className="glass group p-6 transition hover:-translate-y-1 hover:shadow-glow">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{L.pricingTitle}</h2>
          <p className="mt-3 text-muted-foreground">{L.pricingSub}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <PriceCard name={L.free} price="$0" items={L.freeItems} />
          <PriceCard name={L.proName} price="$9" items={L.proItems} featured />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <div className="glass relative overflow-hidden p-10">
          <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-brand opacity-30 blur-3xl" />
          <h2 className="text-2xl font-bold sm:text-3xl">{L.creatorTitle}</h2>
          <p className="mt-4 text-muted-foreground">{L.creatorText}</p>
          <p className="mt-6 font-display text-lg font-semibold"><span className="text-gradient">{L.creator}</span></p>
        </div>
      </section>
    </>
  );
}

function PriceCard({ name, price, items, featured }: { name: string; price: string; items: string[]; featured?: boolean }) {
  const { t } = useI18n();
  return (
    <div className={`glass relative p-8 ${featured ? "border-primary/60! shadow-glow" : ""}`}>
      {featured && (
        <span className="absolute -top-3 start-8 rounded-full bg-gradient-brand px-3 py-1 text-xs font-semibold text-primary-foreground">{t.landing.popular}</span>
      )}
      <h3 className="text-lg font-semibold">{name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-5xl font-bold" dir="ltr">{price}</span>
        <span className="text-muted-foreground">{t.landing.perMonth}</span>
      </div>
      <ul className="mt-6 space-y-3">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 text-neon-cyan" />{it}</li>
        ))}
      </ul>
      <Link to={featured ? "/pro" : "/dashboard"} className={`mt-8 block rounded-full py-3 text-center font-semibold transition ${featured ? "bg-gradient-brand text-primary-foreground" : "bg-secondary hover:bg-muted"}`}>
        {t.landing.choose}
      </Link>
    </div>
  );
}
