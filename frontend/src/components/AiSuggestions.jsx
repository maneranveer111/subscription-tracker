import { formatCurrency } from "../utils/formatters";
import { card } from "../utils/ui";

const ACTION_STYLE = {
  cancel: { text: "Cancel", cls: "bg-coral/10 text-coral" },
  review: { text: "Review", cls: "bg-marigold/20 text-ink" },
  keep: { text: "Keep", cls: "bg-teal/10 text-teal" },
};

export default function AiSuggestions({ result }) {
  const { summary, suggestions, totalPotentialMonthlySavings, totalPotentialYearlySavings } = result;

  return (
    <section className={card}>
      {summary && <p className="max-w-prose text-ink">{summary}</p>}

      {totalPotentialMonthlySavings > 0 && (
        <p className="mt-4 font-display text-2xl font-semibold">
          You could save {formatCurrency(totalPotentialMonthlySavings)} a month
          <span className="ml-2 text-base font-medium text-ink-soft">
            ({formatCurrency(totalPotentialYearlySavings)} a year)
          </span>
        </p>
      )}

      {suggestions.length > 0 && (
        <ul className="mt-4 divide-y divide-line">
          {suggestions.map((s) => {
            const style = ACTION_STYLE[s.action] || ACTION_STYLE.review;
            return (
              <li key={s.name} className="flex items-start gap-4 py-3">
                <span
                  className={`mt-0.5 w-16 shrink-0 rounded-md px-2 py-1 text-center text-xs font-semibold ${style.cls}`}
                >
                  {style.text}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-ink-soft">{s.reason}</p>
                </div>
                {s.monthlySavings > 0 && (
                  <p className="text-sm font-semibold">{formatCurrency(s.monthlySavings)} a month</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
