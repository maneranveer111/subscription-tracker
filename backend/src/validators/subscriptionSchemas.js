import { z } from "zod";

// No .default() here on purpose: on updates, defaults would overwrite
// fields the user didn't send. Mongoose applies the defaults on create.
const fields = {
  name: z.string().trim().min(1, "Name is required").max(80),
  cost: z.coerce.number().min(0, "Cost can't be negative"),
  cycle: z.enum(["monthly", "yearly"]),
  category: z.string().trim().min(1).max(40),
  nextRenewalDate: z.coerce.date({ message: "Enter a valid renewal date" }),
  reminderDaysBefore: z.coerce.number().int().min(0).max(30),
  usageNotes: z.string().trim().max(500, "Usage notes can be 500 characters at most"),
  isActive: z.boolean(),
};

export const createSubscriptionSchema = z.object({
  name: fields.name,
  cost: fields.cost,
  cycle: fields.cycle,
  nextRenewalDate: fields.nextRenewalDate,
  category: fields.category.optional(),
  reminderDaysBefore: fields.reminderDaysBefore.optional(),
  usageNotes: fields.usageNotes.optional(),
  isActive: fields.isActive.optional(),
});

export const updateSubscriptionSchema = z
  .object(fields)
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "Send at least one field to update",
  });
