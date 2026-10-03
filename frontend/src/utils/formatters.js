const currency = import.meta.env.VITE_CURRENCY || "INR";
const locale = currency === "INR" ? "en-IN" : "en-US";

const moneyFormat = new Intl.NumberFormat(locale, {
  style: "currency",
  currency,
  maximumFractionDigits: 2,
});

export const formatCurrency = (n) => moneyFormat.format(n ?? 0);

// Dates are stored as UTC midnight, so format them in UTC to avoid off-by-one days
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export const formatShortDate = (iso) =>
  new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

// "2026-10-10" for <input type="date">
export const toInputDate = (iso) => new Date(iso).toISOString().slice(0, 10);

export const daysUntil = (iso) => {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const d = new Date(iso);
  const target = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.round((target - today) / 86400000);
};

export const renewalLabel = (days) => {
  if (days === 0) return "Renews today";
  if (days === 1) return "Renews tomorrow";
  if (days < 0) return `Renewed ${-days} days ago`;
  return `Renews in ${days} days`;
};

export const monthlyCost = (sub) => (sub.cycle === "yearly" ? sub.cost / 12 : sub.cost);
