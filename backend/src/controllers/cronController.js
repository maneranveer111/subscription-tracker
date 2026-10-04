import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { processReminders } from "../services/reminderService.js";
import { env } from "../config/env.js";

export const runScheduledReminders = asyncHandler(async (req, res) => {
  if (!env.cronSecret) {
    return res.status(503).json({ message: "Cron job is not configured" });
  }

  const provided = req.get("x-cron-secret") || "";
  const expected = Buffer.from(env.cronSecret);
  const actual = Buffer.from(provided);

  if (
    expected.length !== actual.length ||
    !crypto.timingSafeEqual(expected, actual)
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const result = await processReminders();
  res.json(result);
});