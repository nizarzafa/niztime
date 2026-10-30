import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, CalendarDays, CheckSquare, BarChart3, CalendarClock, Check } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { usePlanCopy, planColors } from '@/lib/planning/copy';
import { usePlanning } from '@/lib/planning/store';
import { type Entry, type PlanStore, localDate, shiftDate, timeLabel, timeMinutes, toggleEntry, summarize, entryMinutes } from '@/lib/planning/model';
import { moveEntry } from '@/lib/planning/scheduler';

export const inputClass = 'w-full min-w-0 rounded-xl border border-input bg-glass px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30';
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="flex min-w-0 flex-col gap-2 text-sm text-muted-foreground"><span>{label}</span>{children}</label>;
}
export function PlanTabs({ active }: { active: 'smart' | 'daily' | 'reports' }) {
  const { c } = usePlanCopy();
  return <nav className="mb-8 flex flex-wrap gap-2" aria-label="NIZTIME">
    {([{ key: 'smart', to: '/create', icon: CalendarDays }, { key: 'daily', to: '/dashboard', icon: CheckSquare }, { key: 'reports', to: '/planner', icon: BarChart3 }] as const).map(({ key, to, icon: Icon }) => <Button key={key} asChild variant={key === active ? 'default' : 'secondary'} className={key === active ? 'h-auto min-h-10 whitespace-normal rounded-full bg-gradient-brand' : 'h-auto min-h-10 whitespace-normal rounded-full'}><Link to={to}><Icon />{c[key]}</Link></Button>)}
  </nav>;
}
export function StorageStatus() {
  const { c } = usePlanCopy(); const { error, ready } = usePlanning();
  return <p role={error ? 'alert' : 'status'} className={`mb-6 text-xs ${error ? 'text-destructive' : 'text-muted-foreground'}`}>{!ready ? c.loading : error === 'load' ? c.loadError : error === 'save' ? c.saveError : c.storageNote}</p>;
}
export function DateNav({ date, onChange, weekly = false }: { date: string; onChange: (date: string) => void; weekly?: boolean }) {
  const { c } = usePlanCopy();
  return <div className="mb-6 flex flex-wrap items-center gap-2"><Button variant="secondary" size="icon" title={c.previous} aria-label={c.previous} onClick={() => onChange(shiftDate(date, weekly ? -7 : -1))}><ChevronLeft className="rtl:rotate-180" /></Button><input type="date" aria-label={c.date} value={date} onChange={e => e.target.value && onChange(e.target.value)} className={`${inputClass} w-40`} /><Button variant="secondary" size="icon" title={c.next} aria-label={c.next} onClick={() => onChange(shiftDate(date, weekly ? 7 : 1))}><ChevronRight className="rtl:rotate-180" /></Button><Button variant="ghost" onClick={() => onChange(localDate())}>{c.today}</Button></div>;
}
export function Metrics({ entries }: { entries: Entry[] }) {
  const { c } = usePlanCopy(); const s = summarize(entries);
  return <><div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3">
    {[[c.total, s.total], [c.done, s.completed], [c.remaining, s.remaining], [c.percentage, `${s.percentage}%`], [c.planned, `${s.plannedMinutes} ${c.minutes}`], [c.actual, `${s.completedMinutes} ${c.minutes}`]].map(([label, value]) => <div key={label} className="glass min-w-0 p-4"><div className="break-words font-display text-2xl font-bold text-gradient">{value}</div><div className="mt-1 text-xs text-muted-foreground">{label}</div></div>)}
  </div><progress aria-label={c.percentage} max={100} value={s.percentage} className="mb-6 h-3 w-full overflow-hidden rounded-full accent-primary" /><p className="mb-6 text-xs text-muted-foreground">{c.actualNote}</p></>;
}
function TaskRow({ entry }: { entry: Entry }) {
  const { c } = usePlanCopy(); const { store, update } = usePlanning();
  const [notice, setNotice] = useState(''); const [moving, setMoving] = useState(false);
  const [date, setDate] = useState(entry.date); const [start, setStart] = useState(timeLabel(entry.segments[0]?.start ?? 0));
  const [actual, setActual] = useState(entry.completedAt ? entry.actualMinutes : entryMinutes(entry));
  function changeCompletion() {
    if (!Number.isFinite(actual) || actual < 0 || actual > 1440) { setNotice(c.invalid); return; }
    const completed = !entry.completedAt;
    if (update(toggleEntry(store, entry.id, completed, actual))) setNotice(completed ? c.completed : c.undone);
  }
  function reschedule() {
    const now = new Date();
    const next = moveEntry(store, entry.id, date, timeMinutes(start), localDate(now), now.getHours() * 60 + now.getMinutes());
    if (!next) { setNotice(c.conflict); return; }
    if (update(next)) { setMoving(false); setNotice(c.moved); }
  }
  return <li className={`border-b border-glass-border py-4 ${entry.completedAt ? 'bg-glass' : ''}`}>
    <div className="flex items-start gap-3"><input type="checkbox" aria-label={`${c.done}: ${entry.task.title}`} checked={entry.completedAt !== null} onChange={changeCompletion} className="mt-1 h-5 w-5 shrink-0 accent-primary" />
      <span className={`mt-1 h-10 w-1 shrink-0 rounded-full ${planColors[entry.task.category]}`} />
      <div className="min-w-0 flex-1"><div className={`break-words font-semibold ${entry.completedAt ? 'text-muted-foreground line-through' : ''}`}>{entry.task.title}</div><div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground"><span>{c[entry.task.category]}</span><span>{c[entry.task.priority]}</span><span>{c[entry.task.difficulty]}</span><span>{entryMinutes(entry)} {c.minutes}</span><span>{entry.completedAt ? c.done : c.pending}</span>{entry.task.deadline && <span>{c.deadline}: {entry.task.deadline}</span>}</div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-neon-cyan" dir="ltr">{entry.segments.map((s, i) => <span key={i}>{i > 0 && <span className="text-muted-foreground">{c.break} · </span>}{timeLabel(s.start)}–{timeLabel(s.end)}</span>)}</div>
      </div><Button size="icon" variant="ghost" disabled={entry.completedAt !== null} title={c.reschedule} aria-label={`${c.reschedule}: ${entry.task.title}`} onClick={() => setMoving(!moving)}><CalendarClock /></Button>
    </div>
    <div className="mt-3 flex flex-wrap items-center gap-2 ps-9"><label className="flex items-center gap-2 text-xs text-muted-foreground">{c.actualInput}<input type="number" min={0} max={1440} aria-label={`${c.actualInput}: ${entry.task.title}`} className={`${inputClass} w-24`} value={actual} onChange={e => setActual(Number(e.target.value))} onBlur={() => { if (entry.completedAt && Number.isFinite(actual) && actual >= 0 && actual <= 1440) update(toggleEntry(store, entry.id, true, actual)); }} /></label>{entry.completedAt && <Check className="h-4 w-4 text-neon-cyan" />}</div>
    {moving && <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]"><Field label={c.date}><input type="date" className={inputClass} value={date} min={localDate()} onChange={e => setDate(e.target.value)} /></Field><Field label={c.start}><input type="time" className={inputClass} value={start} onChange={e => setStart(e.target.value)} /></Field><Button className="self-end" onClick={reschedule}>{c.save}</Button><Button variant="secondary" className="self-end" onClick={() => setMoving(false)}>{c.cancel}</Button></div>}
    {notice && <p role="status" className="mt-2 text-xs text-neon-cyan">{notice}</p>}
  </li>;
}
export function TaskList({ entries }: { entries: Entry[] }) {
  const { c } = usePlanCopy();
  return entries.length ? <ul>{[...entries].sort((a, b) => (a.segments[0]?.start ?? 0) - (b.segments[0]?.start ?? 0)).map(e => <TaskRow key={e.id + e.date + (e.segments[0]?.start ?? 0)} entry={e} />)}</ul> : <div className="py-10 text-center text-sm text-muted-foreground"><CalendarDays className="mx-auto mb-3 h-8 w-8 text-neon-cyan" />{c.emptySchedule}</div>;
}
export function deleteTask(store: PlanStore, id: string, today: string) {
  return { ...store, tasks: store.tasks.filter(t => t.id !== id), entries: store.entries.filter(e => e.task.id !== id || e.completedAt !== null || e.date < today), unscheduled: store.unscheduled.filter(u => u.taskId !== id) };
}
