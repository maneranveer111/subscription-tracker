import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    username: {
      type: String,
      trim: true,
      maxlength: 30,
      sparse: true,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true, maxlength: 20, default: "" },
    // select: false keeps the hash out of normal queries
    password: { type: String, required: false, select: false },
    // Set when the user signs in with Google; null for email/password accounts
    googleId: { type: String, default: null, select: false },
    // Track first sign-in to send welcome email once
    isNewUser: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

