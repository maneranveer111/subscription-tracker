import { asyncHandler } from "../utils/asyncHandler.js";
import { processReminders } from "../services/reminderService.js";

// Lets a logged-in user send themselves a test reminder email
export const runReminders = asyncHandler(async (req, res) => {
  const result = await processReminders({ userId: req.userId, force: true });
  res.json(result);
});
