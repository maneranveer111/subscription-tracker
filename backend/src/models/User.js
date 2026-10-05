import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    username: {
      type: String,
      trim: true,
      maxlength: 30,
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
    // Only the Google sign-up path sets this to true, to send the welcome email once
    isNewUser: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Usernames must be unique, but most users have none (null), so only index real strings
userSchema.index(
  { username: 1 },
  { unique: true, partialFilterExpression: { username: { $type: "string" } } }
);

export default mongoose.model("User", userSchema);

