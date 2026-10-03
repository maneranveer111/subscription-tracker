import Subscription from "../models/Subscription.js";
import { sendRenewalReminder, isEmailConfigured } from "./emailService.js";
import { daysUntil, rollForward, startOfDay } from "../utils/dateUtils.js";

// Moves stored renewal dates that have passed to their next occurrence
export async function rollOverdueRenewals() {
  const overdue = await Subscription.find({
    isActive: true,
    nextRenewalDate: { $lt: startOfDay() },
  });
  for (const sub of overdue) {
    sub.nextRenewalDate = rollForward(sub.nextRenewalDate, sub.cycle);
    await sub.save();
  }
  return overdue.length;
}

const sameDay = (a, b) =>
  a && b && startOfDay(a).getTime() === startOfDay(b).getTime();

// Sends one email per user listing their subscriptions that are due a reminder.
// force = true (used by the test button) ignores each subscription's own
// reminder window and the "already sent" check, and looks 30 days ahead.
export async function processReminders({ userId, force = false } = {}) {
  await rollOverdueRenewals();

  const query = { isActive: true };
  if (userId) query.user = userId;
  const subs = await Subscription.find(query).populate("user", "name email");

  const byUser = new Map();
  for (const sub of subs) {
    if (!sub.user) continue;
    const daysLeft = daysUntil(sub.nextRenewalDate);
    const window = force ? 30 : sub.reminderDaysBefore;
    const alreadySent = !force && sameDay(sub.lastReminderFor, sub.nextRenewalDate);
    if (daysLeft < 0 || daysLeft > window || alreadySent) continue;

    const key = String(sub.user._id);
    if (!byUser.has(key)) byUser.set(key, { user: sub.user, entries: [] });
    byUser.get(key).entries.push({ sub, daysLeft });
  }

  let usersEmailed = 0;
  let subscriptionsDue = 0;

  for (const { user, entries } of byUser.values()) {
    subscriptionsDue += entries.length;
    try {
      const sent = await sendRenewalReminder(
        user.email,
        user.name,
        entries.map(({ sub, daysLeft }) => ({
          name: sub.name,
          cost: sub.cost,
          cycle: sub.cycle,
          daysLeft,
          date: sub.nextRenewalDate.toISOString().slice(0, 10),
        }))
      );
      if (sent) {
        usersEmailed += 1;
        if (!force) {
          await Promise.all(
            entries.map(({ sub }) =>
              Subscription.updateOne({ _id: sub._id }, { lastReminderFor: sub.nextRenewalDate })
            )
          );
        }
      }
    } catch (err) {
      // One failed email shouldn't stop everyone else's reminders
      console.error(`Reminder email to ${user.email} failed:`, err.message);
    }
  }

  return { usersEmailed, subscriptionsDue, emailConfigured: isEmailConfigured() };
}
