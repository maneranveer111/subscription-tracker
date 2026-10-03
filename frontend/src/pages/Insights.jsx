import { useState } from "react";
import { getCancelSuggestions } from "../api/aiApi";
import { sendTestReminder } from "../api/subscriptionApi";
import { getErrorMessage } from "../api/axios";
import AiSuggestions from "../components/AiSuggestions";
import { btnPrimary, btnSecondary, card } from "../utils/ui";

export default function Insights() {
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const [sending, setSending] = useState(false);
  const [reminderMsg, setReminderMsg] = useState(null); // { ok: boolean, text: string }

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError("");
    try {
      setResult(await getCancelSuggestions());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReminder = async () => {
    setSending(true);
    setReminderMsg(null);
    try {
      const r = await sendTestReminder();
      if (r.subscriptionsDue === 0) {
        setReminderMsg({
          ok: false,
          text: "Nothing renews in the next 30 days. Set a renewal date within 30 days and try again.",
        });
      } else if (!r.emailConfigured) {
        setReminderMsg({
          ok: false,
          text: "Email isn't set up on the server. Add EMAIL_USER and EMAIL_PASS to the backend .env file.",
        });
      } else if (r.usersEmailed === 0) {
        setReminderMsg({ ok: false, text: "The email couldn't be sent. Check the server logs." });
      } else {
        setReminderMsg({ ok: true, text: "Sent. Check your inbox (and spam folder)." });
      }
    } catch (err) {
      setReminderMsg({ ok: false, text: getErrorMessage(err) });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-2xl font-semibold">AI insights</h1>
        <p className="mt-1 max-w-prose text-sm text-ink-soft">
          The AI reads the usage notes on your active subscriptions and suggests what to cancel.
          Subscriptions without notes are marked for review, so add a short note to each for better
          advice.
        </p>

        <button onClick={handleAnalyze} disabled={analyzing} className={`${btnPrimary} mt-4`}>
          {analyzing ? "Analyzing..." : result ? "Analyze again" : "Analyze my subscriptions"}
        </button>

        {error && (
          <p role="alert" className="mt-4 rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-4">
            <AiSuggestions result={result} />
          </div>
        )}
      </section>

      <section className={card}>
        <h2 className="font-display text-lg font-semibold">Email reminders</h2>
        <p className="mt-1 max-w-prose text-sm text-ink-soft">
          You get an email before each renewal, at the number of days set on the subscription. Send
          yourself a test email to check that it works.
        </p>
        <button onClick={handleReminder} disabled={sending} className={`${btnSecondary} mt-4`}>
          {sending ? "Sending..." : "Send me a test reminder"}
        </button>
        {reminderMsg && (
          <p
            role="status"
            className={`mt-3 text-sm ${reminderMsg.ok ? "text-teal" : "text-coral"}`}
          >
            {reminderMsg.text}
          </p>
        )}
      </section>
    </div>
  );
}
