// Update this in one place if the event date changes — the reminder email
// countdown is calculated from it at send time.
export const EVENT_DATE = new Date("2026-07-21T09:00:00+01:00"); // Africa/Lagos (WAT)
export const EVENT_DATE_LABEL = "September 3rd, 2026";

/**
 * Days remaining until the event, rounded up so "today" still reads as
 * a sensible small number rather than 0 or a negative fraction.
 */
export function daysUntilEvent(from: Date = new Date()): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = EVENT_DATE.getTime() - from.getTime();
  return Math.ceil(diff / msPerDay);
}