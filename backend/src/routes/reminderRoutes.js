import { Router } from "express";
import { runReminders } from "../controllers/reminderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/run", protect, runReminders);

export default router;
