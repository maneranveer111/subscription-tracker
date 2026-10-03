import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/authMiddleware.js";
import { registerSchema, loginSchema } from "../validators/authSchemas.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, me);

export default router;
