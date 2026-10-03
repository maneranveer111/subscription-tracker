import nodemailer from "nodemailer";
import { env } from "../config/env.js";

export const isEmailConfigured = () => Boolean(env.emailUser && env.emailPass);

let transporter;
const getTransporter = () => {
  if (!isEmailConfigured()) return null;
  transporter ??= nodemailer.createTransport({
    service: "gmail",
    auth: { user: env.emailUser, pass: env.emailPass },
  });
  return transporter;
};

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
  const mail = getTransporter();
  if (!mail) {
    console.warn("Email isn't configured (EMAIL_USER / EMAIL_PASS); skipping reminder");
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

  await mail.sendMail({
    from: `"Subscription Tracker" <${env.emailUser}>`,
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
