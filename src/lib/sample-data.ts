export type Category = "study" | "fitness" | "work" | "personal";

export const categoryColor: Record<Category, string> = {
  study: "bg-neon-violet",
  fitness: "bg-neon-cyan",
  work: "bg-neon-blue",
  personal: "bg-neon-magenta",
};

export type Event = { time: string; end: string; title: Record<"en" | "fr" | "ar", string>; cat: Category };

export const todayEvents: Event[] = [
  { time: "07:00", end: "08:00", cat: "fitness", title: { en: "Morning run · 8 km", fr: "Course matinale · 8 km", ar: "جري صباحي · 8 كم" } },
  { time: "09:00", end: "11:30", cat: "study", title: { en: "Thesis deep work", fr: "Thèse — travail profond", ar: "عمل مركّز على الأطروحة" } },
  { time: "13:00", end: "14:00", cat: "work", title: { en: "Product sync", fr: "Réunion produit", ar: "اجتماع المنتج" } },
  { time: "15:00", end: "17:00", cat: "work", title: { en: "Design review", fr: "Revue de design", ar: "مراجعة التصميم" } },
  { time: "19:30", end: "20:30", cat: "personal", title: { en: "Dinner with family", fr: "Dîner en famille", ar: "عشاء مع العائلة" } },
];

// hours per category for each weekday Mon..Sun
export const weekHours: Record<Category, number>[] = [
  { study: 3, fitness: 1, work: 4, personal: 1 },
  { study: 2, fitness: 1.5, work: 5, personal: 1 },
  { study: 4, fitness: 0, work: 3, personal: 2 },
  { study: 2.5, fitness: 1, work: 5, personal: 1 },
  { study: 2, fitness: 1, work: 4, personal: 2.5 },
  { study: 1, fitness: 2, work: 0, personal: 4 },
  { study: 1.5, fitness: 1, work: 0, personal: 5 },
];

export const goalProgress = [72, 55, 88, 40];

// sample events per day of month
export const monthEvents: Record<number, Category[]> = {
  2: ["work"], 4: ["study", "fitness"], 7: ["work", "personal"], 9: ["study"], 11: ["fitness", "work", "study"],
  14: ["personal"], 16: ["study", "work"], 18: ["fitness"], 21: ["work", "study", "personal"], 23: ["study"],
  25: ["fitness", "personal"], 28: ["work"], 30: ["study", "fitness"],
};

export function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday first
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

export type PlanTask = { id: number; name: string; priority: "high" | "medium" | "low"; deadline: string };

/** Simple deterministic draft: orders by priority then deadline, fills available hours from 08:00. Not AI. */
export function buildDraftSchedule(tasks: PlanTask[], hours: number) {
  const rank = { high: 0, medium: 1, low: 2 };
  const sorted = [...tasks].sort((a, b) => rank[a.priority] - rank[b.priority] || (a.deadline || "9").localeCompare(b.deadline || "9"));
  if (!sorted.length || hours <= 0) return [];
  const weights = sorted.map((t) => 3 - rank[t.priority]);
  const total = weights.reduce((a, b) => a + b, 0);
  let cursor = 8 * 60;
  return sorted.map((t, i) => {
    const mins = Math.max(15, Math.round(((hours * 60 * weights[i]) / total) / 15) * 15);
    const start = cursor;
    cursor += mins;
    const fmt = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    return { ...t, start: fmt(start), end: fmt(cursor), minutes: mins };
  });
}
