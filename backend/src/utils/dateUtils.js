const DAY_MS = 24 * 60 * 60 * 1000;

// All dates are handled as UTC midnight, matching what <input type="date"> sends
export const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

export const daysUntil = (date, from = new Date()) =>
  Math.round((startOfDay(date) - startOfDay(from)) / DAY_MS);

// Adds months but clamps the day (Jan 31 + 1 month = Feb 28, not Mar 3)
const addMonths = (date, months) => {
  const d = new Date(date);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const lastDay = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)
  ).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return d;
};

export const addCycle = (date, cycle) =>
  addMonths(date, cycle === "yearly" ? 12 : 1);

// If a renewal date is in the past, move it forward to the next upcoming one
export function rollForward(date, cycle, from = new Date()) {
  const today = startOfDay(from);
  let next = new Date(date);
  let guard = 0;
  while (startOfDay(next) < today && guard < 1200) {
    next = addCycle(next, cycle);
    guard += 1;
  }
  return next;
}
