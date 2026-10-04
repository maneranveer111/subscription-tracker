import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSummary } from "../api/subscriptionApi";
import { getErrorMessage } from "../api/axios";
import CostSummary from "../components/CostSummary";
import RenewalList from "../components/RenewalList";
import SpendChart from "../components/SpendChart";
import Spinner from "../components/Spinner";
import { btnPrimary, card } from "../utils/ui";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    getSummary()
      .then((data) => !ignore && setSummary(data))
      .catch((err) => !ignore && setError(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <p role="alert" className="rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">
        {error}
      </p>
    );
  }

  const isEmpty = !summary || (summary.activeCount === 0 && summary.pausedCount === 0);

  if (isEmpty) {
    return (
      <div className={`${card} mx-auto max-w-md text-center`}>
        <h1 className="font-display text-xl font-semibold">No subscriptions yet</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Add the first one and you'll see what it costs and when it renews.
        </p>
        <Link to="/subscriptions" className={`${btnPrimary} mt-5`}>
          Add subscription
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CostSummary summary={summary} />
      <div className="grid gap-6 lg:grid-cols-2">
        <RenewalList upcoming={summary.upcoming} />
        <SpendChart byCategory={summary.byCategory} />
      </div>
    </div>
  );
}
