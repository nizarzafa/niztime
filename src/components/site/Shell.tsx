import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/translations";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand shadow-glow">
        <span className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight" dir="ltr">
        TIMEFLOW <span className="text-gradient">AI</span>
      </span>
    </Link>
  );
}

function LangSwitch() {
  const { lang, setLang, t } = useI18n();
  const opts: { id: Lang; label: string }[] = [
    { id: "en", label: "EN" },
    { id: "fr", label: "FR" },
    { id: "ar", label: "ع" },
  ];
  return (
    <div className="glass flex items-center gap-1 rounded-full! p-1" aria-label={t.common.language}>
      <Globe className="mx-1.5 h-4 w-4 text-muted-foreground" />
      {opts.map((o) => (
        <button
          key={o.id}
          onClick={() => setLang(o.id)}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${lang === o.id ? "bg-gradient-brand text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const links = [
  { to: "/", key: "home" },
  { to: "/dashboard", key: "dashboard" },
  { to: "/planner", key: "planner" },
  { to: "/create", key: "create" },
  { to: "/pro", key: "pro" },
] as const;

export function Navbar() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-glass-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground!" }}
            >
              {t.nav[l.key]}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitch />
          <button className="glass rounded-xl! p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-glass-border px-4 py-3 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: true }}
              className="block rounded-lg px-3 py-2.5 text-muted-foreground"
              activeProps={{ className: "bg-secondary text-foreground!" }}
            >
              {t.nav[l.key]}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-glass-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="text-sm text-muted-foreground">{t.landing.footer}</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-foreground">{t.nav[l.key]}</Link>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">© 2026 TIMEFLOW AI. {t.landing.rights}</p>
      </div>
    </footer>
  );
}

export function PageHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-2 text-muted-foreground">{sub}</p>
    </div>
  );
}
