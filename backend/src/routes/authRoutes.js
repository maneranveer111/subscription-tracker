import { Router } from "express";
import { register, login, me, updateProfile } from "../controllers/authController.js";
import { googleSignIn } from "../controllers/googleAuthController.js";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/authMiddleware.js";
import { registerSchema, loginSchema } from "../validators/authSchemas.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google", googleSignIn);
router.get("/me", protect, me);
router.put("/profile", protect, updateProfile);

export default router;

