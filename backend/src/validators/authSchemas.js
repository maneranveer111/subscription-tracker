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
