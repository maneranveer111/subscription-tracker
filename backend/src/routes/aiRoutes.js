import { Router } from "express";
import { cancelSuggestions } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/cancel-suggestions", protect, cancelSuggestions);

export default router;
