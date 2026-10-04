export default function AuthHero() {
  return (
    <div className="flex flex-col justify-between py-2 lg:py-6">
      <div>
        {/* Brand & Pill Badge */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white shadow-md shadow-ink/15">
            <svg
              className="h-6 w-6 text-marigold"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div>
            <span className="font-display text-2xl font-bold tracking-tight text-ink">
              SubTracker
            </span>
            <span className="block text-xs font-semibold uppercase tracking-wider text-teal">
              Smart Subscription Management
            </span>
          </div>
        </div>

        {/* Hero Pitch */}
        <div className="mt-7 space-y-3">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Take complete control of your recurring subscriptions.
          </h1>
          <p className="text-base leading-relaxed text-ink-soft">
            SubTracker centralizes all your recurring bills—streaming, utilities, software, and memberships—giving you visibility, automated renewal alerts, and AI savings advice in one place.
          </p>
        </div>

        {/* Value Highlights */}
        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">Monthly & Yearly Spend Analytics</h3>
              <p className="text-xs text-ink-soft">
                Break down costs by category and know your exact monthly commitment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-marigold/15 text-marigold">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">Zero-Surprise Renewal Reminders</h3>
              <p className="text-xs text-ink-soft">
                Receive proactive email reminders days before any renewal charge hits your card.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-coral/10 text-coral">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">AI Cancellation Advisor</h3>
              <p className="text-xs text-ink-soft">
                Gemini AI reviews your usage notes to spot underused services and calculate savings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful Hint Card */}
      <div className="mt-8 rounded-xl border border-line bg-white/70 p-4 backdrop-blur-sm">
        <p className="text-xs text-ink-soft">
          <span className="font-semibold text-ink">💡 Smart Saver Tip:</span> Track renewal dates so you can cancel free trials or unused annual plans before they renew.
        </p>
      </div>
    </div>
  );
}
