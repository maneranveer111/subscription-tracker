import { daysUntil, formatCurrency, formatShortDate, renewalLabel } from "../utils/formatters";
import { card } from "../utils/ui";

export default function RenewalList({ upcoming }) {
  return (
    <section className={card}>
      <h2 className="font-display text-lg font-semibold">Renewing in the next 30 days</h2>

      {upcoming.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">
          Nothing is due to renew soon. You won't be charged for anything in the next 30 days.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {upcoming.map((sub) => {
            const days = daysUntil(sub.nextRenewalDate);
            const urgent = days <= 3;
            return (
              <li key={sub._id} className="flex items-center gap-4 py-3">
                <div className="w-14 shrink-0 font-display text-sm font-semibold leading-tight">
                  {formatShortDate(sub.nextRenewalDate)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{sub.name}</p>
                  <p
                    className={`text-xs ${
                      urgent ? "font-semibold text-marigold" : "text-ink-soft"
                    }`}
                  >
                    {renewalLabel(days)}
                  </p>
                </div>
                <p className="text-sm font-semibold">{formatCurrency(sub.cost)}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
