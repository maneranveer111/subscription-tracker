import { env } from "../config/env.js";

export const isEmailConfigured = () => Boolean(env.brevoApiKey && env.emailFrom);

// Render's free tier blocks SMTP ports (25/465/587), so we send over HTTPS via Brevo's API.
async function sendMail({ to, subject, html, text }) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": env.brevoApiKey,
    },
    body: JSON.stringify({
      sender: { name: "Subscription Tracker", email: env.emailFrom },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
    signal: AbortSignal.timeout(15_000), // fail in 15s instead of hanging for minutes
  });

  if (!response.ok) {
    throw new Error(`Brevo API ${response.status}: ${await response.text()}`);
  }
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const money = (n) =>
  new Intl.NumberFormat(env.currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency: env.currency,
  }).format(n);

const whenLabel = (days) =>
  days === 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days`;

// items: [{ name, cost, cycle, daysLeft, date }]
export async function sendRenewalReminder(to, userName, items) {
  if (!isEmailConfigured()) {
    console.warn("Email isn't configured (BREVO_API_KEY / EMAIL_FROM); skipping reminder");
    return false;
  }

  const rowsHtml = items
    .map(
      (i) =>
        `<li><strong>${escapeHtml(i.name)}</strong> renews ${whenLabel(i.daysLeft)} (${escapeHtml(i.date)}): ${money(i.cost)} per ${i.cycle === "yearly" ? "year" : "month"}</li>`
    )
    .join("");
  const rowsText = items
    .map((i) => `- ${i.name} renews ${whenLabel(i.daysLeft)} (${i.date}): ${money(i.cost)}`)
    .join("\n");

  await sendMail({
    to,
    subject:
      items.length === 1
        ? `${items[0].name} renews ${whenLabel(items[0].daysLeft)}`
        : `${items.length} subscriptions are about to renew`,
    text: `Hi ${userName},\n\nThese subscriptions are about to renew:\n${rowsText}\n\nCancel any you no longer use before the renewal date.`,
    html: `<p>Hi ${escapeHtml(userName)},</p><p>These subscriptions are about to renew:</p><ul>${rowsHtml}</ul><p>Cancel any you no longer use before the renewal date.</p>`,
  });
  return true;
}

// Sent once when a user first signs in with Google
export async function sendWelcomeEmail(to, userName) {
  if (!isEmailConfigured()) {
    console.warn("Email isn't configured (BREVO_API_KEY / EMAIL_FROM); skipping welcome email");
    return false;
  }

  await sendMail({
    to,
    subject: `Welcome to Subscription Tracker, ${userName}!`,
    text: `Hi ${userName},\n\nWelcome to Subscription Tracker! You're now signed in with Google.\n\nStart by adding your subscriptions to track renewals, costs, and get AI-powered cancel suggestions.\n\nHappy tracking!`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#14213d">Welcome, ${escapeHtml(userName)}!</h2>
        <p>You've successfully signed in with Google to <strong>Subscription Tracker</strong>.</p>
        <ul>
          <li><strong>Track</strong> all your subscriptions in one place</li>
          <li><strong>See</strong> exactly how much you spend each month</li>
          <li><strong>Get AI suggestions</strong> on what to cancel</li>
          <li><strong>Receive email reminders</strong> before renewals</li>
        </ul>
        <p>Start by adding your first subscription!</p>
      </div>
    `,
  });
  return true;
}