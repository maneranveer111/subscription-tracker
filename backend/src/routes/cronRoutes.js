import { Router } from "express";
import { runScheduledReminders } from "../controllers/cronController.js";

const router = Router();

router.post("/reminders", runScheduledReminders);

export default router;