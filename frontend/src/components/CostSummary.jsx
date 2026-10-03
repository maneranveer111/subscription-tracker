import { formatCurrency } from "../utils/formatters";

// The big number is the one thing this page leads with
export default function CostSummary({ summary }) {
  const { monthlyTotal, yearlyTotal, activeCount, pausedCount } = summary;

  return (
    <section>
      <p className="text-sm text-ink-soft">Your subscriptions cost about</p>
      <p className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
        {formatCurrency(monthlyTotal)}
        <span className="ml-2 text-xl font-medium text-ink-soft sm:text-2xl">a month</span>
      </p>
      <p className="mt-2 max-w-prose text-ink-soft">
        That adds up to {formatCurrency(yearlyTotal)} a year across {activeCount} active{" "}
        {activeCount === 1 ? "subscription" : "subscriptions"}
        {pausedCount > 0 ? `, with ${pausedCount} paused.` : "."}
      </p>
    </section>
  );
}
