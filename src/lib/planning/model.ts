import { z } from 'zod';
import { addDays, format, startOfWeek } from 'date-fns';

export const categories = ['study', 'work', 'fitness', 'personal', 'other'] as const;
export const taskSchema = z.object({
  id: z.string(), title: z.string().trim().min(1).max(200),
  category: z.enum(categories), priority: z.enum(['high', 'medium', 'low']),
  duration: z.number().int().min(5).max(1440), deadline: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});
export type Task = z.infer<typeof taskSchema>;
export const settingsSchema = z.object({
  hours: z.number().min(0.5).max(16), start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/), breakMinutes: z.number().int().min(5).max(60),
  period: z.enum(['today', 'week']),
});
export type Settings = z.infer<typeof settingsSchema>;
const entrySchema = z.object({
  id: z.string(), task: taskSchema, date: z.string(),
  segments: z.array(z.object({ start: z.number(), end: z.number() })).min(1),
  completedAt: z.string().nullable(), actualMinutes: z.number().min(0),
});
export type Entry = z.infer<typeof entrySchema>;
export const storeSchema = z.object({
  version: z.literal(1), tasks: z.array(taskSchema), settings: settingsSchema,
  entries: z.array(entrySchema), unscheduled: z.array(z.object({ taskId: z.string(), reason: z.enum(['capacity', 'deadline']) })),
});
export type PlanStore = z.infer<typeof storeSchema>;
export const storageKey = 'niztime-planning-v1';
export function emptyStore(): PlanStore {
  return { version: 1, tasks: [], entries: [], unscheduled: [], settings: { hours: 4, start: '09:00', end: '18:00', breakMinutes: 15, period: 'today' } };
}
export function localDate(date = new Date()) { return format(date, 'yyyy-MM-dd'); }
export function shiftDate(date: string, days: number) { return localDate(addDays(new Date(`${date}T12:00:00`), days)); }
export function weekDates(date: string) {
  const monday = startOfWeek(new Date(`${date}T12:00:00`), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => localDate(addDays(monday, i)));
}
export function timeMinutes(time: string) {
  const [h = 0, m = 0] = time.split(':').map(Number);
  return h * 60 + m;
}
export function timeLabel(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}
export function entryMinutes(entry: Entry) { return entry.segments.reduce((total, s) => total + s.end - s.start, 0); }
export function summarize(entries: Entry[]) {
  const done = entries.filter(e => e.completedAt !== null);
  return { total: entries.length, completed: done.length, remaining: entries.length - done.length,
    percentage: entries.length ? Math.round(done.length / entries.length * 100) : 0,
    plannedMinutes: entries.reduce((sum, e) => sum + entryMinutes(e), 0),
    completedMinutes: done.reduce((sum, e) => sum + e.actualMinutes, 0) };
}
export function toggleEntry(store: PlanStore, id: string, completed: boolean, actualMinutes?: number): PlanStore {
  return { ...store, entries: store.entries.map(e => e.id !== id ? e : {
    ...e, completedAt: completed ? e.completedAt ?? new Date().toISOString() : null,
    actualMinutes: completed ? actualMinutes ?? entryMinutes(e) : 0,
  }) };
}
