import cron from "node-cron";
import { env } from "../config/env.js";
import { processReminders } from "../services/reminderService.js";

export function startReminderJob() {
  if (!cron.validate(env.reminderCron)) {
    console.error(`Invalid REMINDER_CRON "${env.reminderCron}". Reminder job not started.`);
    return;
  }

  cron.schedule(
    env.reminderCron,
    async () => {
      try {
        const result = await processReminders();
        console.log("Reminder job finished:", result);
      } catch (err) {
        console.error("Reminder job failed:", err);
      }
    },
    { timezone: env.timezone }
  );

  console.log(`Reminder job scheduled: "${env.reminderCron}" (${env.timezone})`);
}
