import {
  daysUntil,
  formatCurrency,
  formatDate,
  monthlyCost,
  renewalLabel,
} from "../utils/formatters";
import { btnDanger, btnSecondary } from "../utils/ui";

export default function SubscriptionCard({ sub, onEdit, onDelete, onToggle }) {
  const days = daysUntil(sub.nextRenewalDate);
  const urgent = sub.isActive && days <= 3;

  return (
    <article
      className={`rounded-lg border bg-white p-4 ${
        sub.isActive ? "border-line" : "border-dashed border-line opacity-75"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold">{sub.name}</h3>
          <p className="text-sm text-ink-soft">
            {sub.category}
            {!sub.isActive && " (paused)"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-lg font-semibold">
            {formatCurrency(sub.cost)}
            <span className="text-sm font-medium text-ink-soft">
              {sub.cycle === "yearly" ? " a year" : " a month"}
            </span>
          </p>
          {sub.cycle === "yearly" && (
            <p className="text-xs text-ink-soft">{formatCurrency(monthlyCost(sub))} a month</p>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm">
        <span className={urgent ? "font-semibold text-marigold" : "text-ink"}>
          {sub.isActive ? renewalLabel(days) : "Paused"}
        </span>
        <span className="text-ink-soft"> on {formatDate(sub.nextRenewalDate)}</span>
      </p>

      {sub.usageNotes && (
        <p className="mt-2 border-l-2 border-line pl-3 text-sm text-ink-soft">{sub.usageNotes}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => onEdit(sub)} className={btnSecondary}>
          Edit
        </button>
        <button onClick={() => onToggle(sub)} className={btnSecondary}>
          {sub.isActive ? "Pause" : "Resume"}
        </button>
        <button onClick={() => onDelete(sub)} className={btnDanger}>
          Delete
        </button>
      </div>
    </article>
  );
}
