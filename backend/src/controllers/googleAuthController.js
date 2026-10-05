import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendWelcomeEmail } from "../services/emailService.js";

const client = new OAuth2Client(env.googleClientId);

const signToken = (id) =>
  jwt.sign({ id: String(id) }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username || "",
  email: user.email,
  phone: user.phone || "",
});

export const googleSignIn = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ message: "Google credential is required" });
  }

  if (!env.googleClientId) {
    return res.status(503).json({ message: "Google Sign-In is not configured on the server" });
  }

  // Verify the Google ID token
  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.googleClientId,
    });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ message: "Invalid Google token. Please try again." });
  }

  const { sub: googleId, email, name, email_verified } = payload;

  if (!email_verified) {
    return res.status(401).json({ message: "Your Google email is not verified." });
  }

  // Find existing user by email or google ID, or create a new one
  let user = await User.findOne({ $or: [{ email }, { googleId }] }).select("+googleId");
  let isNew = false;

  if (!user) {
    // Brand new user — create account
    user = await User.create({
      name: name || email.split("@")[0],
      email,
      googleId,
      isNewUser: true,
    });
    isNew = true;
  } else if (!user.googleId) {
    // Existing email/password user signing in with Google for the first time.
    // The old password is removed: email isn't verified at signup, so someone else
    // could have registered this address first and would otherwise keep access.
    await User.updateOne(
      { _id: user._id },
      { $set: { googleId }, $unset: { password: 1 } }
    );
  }

  // Send welcome email on first sign-in (fire-and-forget, don't block login)
  if (isNew || user.isNewUser) {
    sendWelcomeEmail(email, user.name).catch((err) =>
      console.error("Welcome email failed:", err.message)
    );
    if (user.isNewUser) {
      user.isNewUser = false;
      await user.save();
    }
  }

  res.json({ token: signToken(user._id), user: publicUser(user) });
});
