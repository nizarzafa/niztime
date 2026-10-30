import { type Entry, type PlanStore, type Settings, type Task, entryMinutes, shiftDate, timeMinutes, weekDates } from './model';

const ranks = { high: 0, medium: 1, low: 2 };
export function validateSettings(settings: Settings) {
  const start = timeMinutes(settings.start), end = timeMinutes(settings.end);
  return start >= 0 && end <= 1440 && end > start && settings.hours > 0;
}
// Tasks keep their full duration. Long tasks are split into focus sessions within one day.
function fitTask(task: Task, date: string, entries: Entry[], settings: Settings, nowMinute: number) {
  const day = entries.filter(e => e.date === date);
  const used = day.reduce((s, e) => s + entryMinutes(e), 0);
  if (used + task.duration > settings.hours * 60) return null;
  const start = Math.max(timeMinutes(settings.start), nowMinute), end = timeMinutes(settings.end);
  const occupied = day.flatMap(e => e.segments).sort((a, b) => a.start - b.start);
  const sessionLength = task.difficulty === 'hard' ? 45 : 60;
  // Search minute-by-minute for an uninterrupted task footprint, including its internal breaks.
  for (let cursor = start; cursor < end; cursor++) {
    let position = cursor, left = task.duration;
    const segments: Entry['segments'] = [];
    while (left > 0) {
      const minutes = Math.min(sessionLength, left);
      segments.push({ start: position, end: position + minutes });
      left -= minutes;
      position += minutes + (left > 0 ? settings.breakMinutes : 0);
    }
    if (position > end) break;
    const conflict = occupied.some(s => cursor < s.end + settings.breakMinutes && position + settings.breakMinutes > s.start);
    if (!conflict) return segments;
  }
  return null;
}
export function generateSchedule(store: PlanStore, today: string, nowMinute = 0): PlanStore {
  if (!validateSettings(store.settings)) throw new Error('availability');
  const dates = store.settings.period === 'today' ? [today] : weekDates(today).filter(d => d >= today);
  // Preserve history, completed work and plans outside the selected period.
  const preserved = store.entries.filter(e => !dates.includes(e.date) || e.completedAt !== null);
  const existingIds = new Set(preserved.map(e => e.task.id));
  const ordered = store.tasks.filter(t => !existingIds.has(t.id)).sort((a, b) => {
    const urgentA = a.deadline && a.deadline <= shiftDate(today, 1) ? 0 : 1;
    const urgentB = b.deadline && b.deadline <= shiftDate(today, 1) ? 0 : 1;
    return urgentA - urgentB || ranks[a.priority] - ranks[b.priority] || (a.deadline || '9999').localeCompare(b.deadline || '9999') || a.id.localeCompare(b.id);
  });
  const entries = [...preserved];
  const unscheduled: PlanStore['unscheduled'] = [];
  for (const task of ordered) {
    const candidates = dates.filter(d => !task.deadline || d <= task.deadline)
      .map(date => ({ date, load: entries.filter(e => e.date === date).reduce((n, e) => n + entryMinutes(e), 0) }))
      .sort((a, b) => a.load - b.load || a.date.localeCompare(b.date));
    let placed = false;
    for (const candidate of candidates) {
      const segments = fitTask(task, candidate.date, entries, store.settings, candidate.date === today ? nowMinute : 0);
      if (!segments) continue;
      entries.push({ id: `${task.id}:${candidate.date}`, task: { ...task }, date: candidate.date, segments, completedAt: null, actualMinutes: 0 });
      placed = true;
      break;
    }
    if (!placed) unscheduled.push({ taskId: task.id, reason: candidates.length ? 'capacity' : 'deadline' });
  }
  return { ...store, entries: entries.sort((a, b) => a.date.localeCompare(b.date) || (a.segments[0]?.start ?? 0) - (b.segments[0]?.start ?? 0)), unscheduled };
}
export function moveEntry(store: PlanStore, id: string, date: string, start: number, today: string, nowMinute: number): PlanStore | null {
  const entry = store.entries.find(e => e.id === id);
  if (!entry || entry.completedAt || date < today || (date === today && start < nowMinute) || (entry.task.deadline && date > entry.task.deadline)) return null;
  const delta = start - (entry.segments[0]?.start ?? start);
  const segments = entry.segments.map(s => ({ start: s.start + delta, end: s.end + delta }));
  if (segments.some(s => s.start < timeMinutes(store.settings.start) || s.end > timeMinutes(store.settings.end))) return null;
  const others = store.entries.filter(e => e.id !== id && e.date === date);
  if (others.reduce((n, e) => n + entryMinutes(e), 0) + entryMinutes(entry) > store.settings.hours * 60) return null;
  const first = segments[0], last = segments.at(-1);
  if (!first || !last || others.some(e => e.segments.some(s => first.start < s.end + store.settings.breakMinutes && last.end + store.settings.breakMinutes > s.start))) return null;
  return { ...store, entries: store.entries.map(e => e.id === id ? { ...e, date, segments } : e) };
}
