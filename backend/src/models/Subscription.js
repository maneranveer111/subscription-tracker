import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    cost: { type: Number, required: true, min: 0 },
    cycle: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
    category: { type: String, trim: true, default: "Other" },
    nextRenewalDate: { type: Date, required: true },
    reminderDaysBefore: { type: Number, default: 3, min: 0, max: 30 },
    usageNotes: { type: String, trim: true, maxlength: 500, default: "" },
    isActive: { type: Boolean, default: true },
    // The renewal date we last emailed about, so we never send the same reminder twice
    lastReminderFor: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
