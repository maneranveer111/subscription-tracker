import { useEffect, useState } from "react";
import {
  createSubscription,
  deleteSubscription,
  getSubscriptions,
  updateSubscription,
} from "../api/subscriptionApi";
import { getErrorMessage } from "../api/axios";
import Spinner from "../components/Spinner";
import SubscriptionCard from "../components/SubscriptionCard";
import SubscriptionForm from "../components/SubscriptionForm";
import { btnPrimary, card } from "../utils/ui";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "paused", label: "Paused" },
];

const sortByRenewal = (list) =>
  [...list].sort((a, b) => new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate));

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // the subscription being edited, or null when adding
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let ignore = false;
    getSubscriptions()
      .then((data) => !ignore && setSubs(data))
      .catch((err) => !ignore && setError(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  const openAdd = () => {
    setEditing(null);
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (sub) => {
    setEditing(sub);
    setFormError("");
    setFormOpen(true);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError("");
    try {
      if (editing) {
        const updated = await updateSubscription(editing._id, payload);
        setSubs((prev) => sortByRenewal(prev.map((s) => (s._id === updated._id ? updated : s))));
      } else {
        const created = await createSubscription(payload);
        setSubs((prev) => sortByRenewal([...prev, created]));
      }
      setFormOpen(false);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sub) => {
    if (!window.confirm(`Delete ${sub.name}? This can't be undone.`)) return;
    try {
      await deleteSubscription(sub._id);
      setSubs((prev) => prev.filter((s) => s._id !== sub._id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleToggle = async (sub) => {
    try {
      const updated = await updateSubscription(sub._id, { isActive: !sub.isActive });
      setSubs((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <Spinner />;

  const visible = subs.filter((s) =>
    filter === "all" ? true : filter === "active" ? s.isActive : !s.isActive
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Subscriptions</h1>
        <button onClick={openAdd} className={btnPrimary}>
          Add subscription
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">
          {error}
        </p>
      )}

      <div className="mt-5 flex gap-1" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              filter === f.id ? "bg-ink text-white" : "text-ink-soft hover:bg-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className={`${card} mt-4 text-center`}>
          <p className="text-sm text-ink-soft">
            {subs.length === 0
              ? "You haven't added any subscriptions yet. Add your first one to start tracking."
              : "No subscriptions match this filter."}
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {visible.map((sub) => (
            <SubscriptionCard
              key={sub._id}
              sub={sub}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <SubscriptionForm
          key={editing?._id || "new"}
          subscription={editing}
          onSubmit={handleSave}
          onCancel={() => setFormOpen(false)}
          saving={saving}
          error={formError}
        />
      )}
    </div>
  );
}
