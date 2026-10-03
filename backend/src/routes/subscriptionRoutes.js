import { Router } from "express";
import {
  listSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subscriptionController.js";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from "../validators/subscriptionSchemas.js";

const router = Router();
router.use(protect);

router.get("/", listSubscriptions);
router.post("/", validate(createSubscriptionSchema), createSubscription);
router.put("/:id", validate(updateSubscriptionSchema), updateSubscription);
router.delete("/:id", deleteSubscription);

export default router;
