import { z } from "zod";

export const registerSchema = z.object({
  name: z.string({ message: "Name is required" }).trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string({ message: "Email is required" }).trim().toLowerCase().email("Enter a valid email address"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or fewer"),
});

export const loginSchema = z.object({
  email: z.string({ message: "Email is required" }).trim().toLowerCase().email("Enter a valid email address"),
  password: z.string({ message: "Password is required" }).min(1, "Password is required"),
});

export const googleSchema = z.object({
  credential: z.string({ message: "Google credential is required" }).min(1, "Google credential is required"),
});

// Every field is optional: the profile page sends only what the user edits
export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60, "Name must be 60 characters or fewer").optional(),
  username: z.string().trim().max(30, "Username must be 30 characters or fewer").optional(),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").optional(),
  phone: z.string().trim().max(20, "Phone number is too long").optional(),
});
