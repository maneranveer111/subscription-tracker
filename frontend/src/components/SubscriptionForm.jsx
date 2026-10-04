import { useState } from "react";
import { CATEGORIES } from "../utils/constants";
import { toInputDate } from "../utils/formatters";
import { btnPrimary, btnSecondary, input, label } from "../utils/ui";

const emptyForm = {
  name: "",
  cost: "",
  cycle: "monthly",
  category: CATEGORIES[0],
  nextRenewalDate: "",
  reminderDaysBefore: 3,
  usageNotes: "",
};

const fromSubscription = (sub) => ({
  name: sub.name,
  cost: sub.cost,
  cycle: sub.cycle,
  category: sub.category,
  nextRenewalDate: toInputDate(sub.nextRenewalDate),
  reminderDaysBefore: sub.reminderDaysBefore,
  usageNotes: sub.usageNotes || "",
});

// Today's date in YYYY-MM-DD (local time) used as the minimum allowed renewal date
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Used for both adding (no `subscription`) and editing
export default function SubscriptionForm({ subscription, onSubmit, onCancel, saving, error }) {
  const [form, setForm] = useState(subscription ? fromSubscription(subscription) : emptyForm);
  const [dateError, setDateError] = useState("");

  const categories = CATEGORIES.includes(form.category) ? CATEGORIES : [form.category, ...CATEGORIES];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "nextRenewalDate") setDateError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Reject past dates
    if (form.nextRenewalDate < todayStr()) {
      setDateError("Renewal date cannot be in the past. Please pick today or a future date.");
      return;
    }
    setDateError("");
    onSubmit({
      name: form.name.trim(),
      cost: Number(form.cost),
      cycle: form.cycle,
      category: form.category,
      nextRenewalDate: form.nextRenewalDate,
      reminderDaysBefore: Number(form.reminderDaysBefore),
      usageNotes: form.usageNotes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-10 flex items-start justify-center overflow-y-auto bg-ink/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="my-8 w-full max-w-lg rounded-lg border border-line bg-white p-6"
      >
        <h2 className="font-display text-xl font-semibold">
          {subscription ? "Edit subscription" : "Add subscription"}
        </h2>

        {error && (
          <p role="alert" className="mt-4 rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">
            {error}
          </p>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className={label}>
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Netflix"
              required
              maxLength={80}
              className={input}
            />
          </div>

          <div>
            <label htmlFor="cost" className={label}>
              Cost
            </label>
            <input
              id="cost"
              name="cost"
              type="number"
              min="0"
              step="0.01"
              value={form.cost}
              onChange={handleChange}
              required
              className={input}
            />
          </div>

          <div>
            <label htmlFor="cycle" className={label}>
              Billed
            </label>
            <select id="cycle" name="cycle" value={form.cycle} onChange={handleChange} className={input}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className={label}>
              Category
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={input}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="nextRenewalDate" className={label}>
              Next renewal date
            </label>
            <input
              id="nextRenewalDate"
              name="nextRenewalDate"
              type="date"
              value={form.nextRenewalDate}
              onChange={handleChange}
              required
              min={todayStr()}
              className={`${input} ${dateError ? "border-coral ring-1 ring-coral/30" : ""}`}
            />
            {dateError && (
              <p role="alert" className="mt-1 text-xs text-coral">
                {dateError}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="reminderDaysBefore" className={label}>
              Email me this many days before it renews
            </label>
            <input
              id="reminderDaysBefore"
              name="reminderDaysBefore"
              type="number"
              min="0"
              max="30"
              value={form.reminderDaysBefore}
              onChange={handleChange}
              required
              className={input}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="usageNotes" className={label}>
              How much do you use it?
            </label>
            <textarea
              id="usageNotes"
              name="usageNotes"
              rows={3}
              maxLength={500}
              value={form.usageNotes}
              onChange={handleChange}
              placeholder="Watched two shows this month"
              className={input}
            />
            <p className="mt-1 text-xs text-ink-soft">
              The AI uses this to suggest what to cancel.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className={btnSecondary}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? "Saving..." : subscription ? "Save changes" : "Add subscription"}
          </button>
        </div>
      </form>
    </div>
  );
}
