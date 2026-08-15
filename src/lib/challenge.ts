const DAY_MS = 86_400_000;

export function localDateKey(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function unlockedDay(enrolledAt: Date, now: Date, timezone: string, adminOverride = false) {
  if (adminOverride) return 21;
  const enrolled = Date.parse(`${localDateKey(enrolledAt, timezone)}T00:00:00Z`);
  const current = Date.parse(`${localDateKey(now, timezone)}T00:00:00Z`);
  return Math.min(21, Math.max(1, Math.floor((current - enrolled) / DAY_MS) + 1));
}

export function canAccessLesson(input: { dayNumber: number; isBonus: boolean; bonusUnlocked: boolean; unlockedDay: number }) {
  if (input.isBonus) return input.bonusUnlocked;
  return input.dayNumber <= input.unlockedDay;
}

export function nextStreak(input: { current: number; longest: number; lastActive: Date | null; now: Date; timezone: string; freezeAvailable: boolean }) {
  const today = localDateKey(input.now, input.timezone);
  if (!input.lastActive) return { current: 1, longest: Math.max(1, input.longest), freezeAvailable: input.freezeAvailable };
  const previous = localDateKey(input.lastActive, input.timezone);
  if (previous === today) return { current: input.current, longest: input.longest, freezeAvailable: input.freezeAvailable };
  const elapsed = Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${previous}T00:00:00Z`)) / DAY_MS);
  if (elapsed === 1) {
    const current = input.current + 1;
    return { current, longest: Math.max(current, input.longest), freezeAvailable: input.freezeAvailable };
  }
  if (elapsed === 2 && input.freezeAvailable) return { current: input.current + 1, longest: Math.max(input.current + 1, input.longest), freezeAvailable: false };
  return { current: 1, longest: Math.max(1, input.longest), freezeAvailable: true };
}
