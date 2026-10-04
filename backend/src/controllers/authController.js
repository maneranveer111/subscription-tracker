import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signToken = (id) =>
  jwt.sign({ id: String(id) }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username || "",
  email: user.email,
  phone: user.phone || "",
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (await User.exists({ email })) {
    return res.status(409).json({ message: "That email is already registered" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  const valid = user && (await bcrypt.compare(password, user.password));

  // Same message for both cases so attackers can't tell which emails exist
  if (!valid) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  res.json({ token: signToken(user._id), user: publicUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "Account not found" });
  res.json({ user: publicUser(user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, username, email, phone } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "Account not found" });

  // Validate name
  if (name !== undefined) {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 60) {
      return res.status(400).json({ message: "Name must be 1–60 characters" });
    }
    user.name = trimmed;
  }

  // Validate & deduplicate username
  if (username !== undefined) {
    const trimmed = username.trim();
    if (trimmed.length > 30) {
      return res.status(400).json({ message: "Username must be at most 30 characters" });
    }
    if (trimmed) {
      const taken = await User.findOne({ username: trimmed, _id: { $ne: user._id } });
      if (taken) {
        return res.status(409).json({ message: "That username is already taken" });
      }
    }
    user.username = trimmed || null;
  }

  // Validate & deduplicate email
  if (email !== undefined) {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      return res.status(400).json({ message: "Email is required" });
    }
    const taken = await User.findOne({ email: trimmed, _id: { $ne: user._id } });
    if (taken) {
      return res.status(409).json({ message: "That email is already registered" });
    }
    user.email = trimmed;
  }

  // Phone
  if (phone !== undefined) {
    const trimmed = phone.trim();
    if (trimmed.length > 20) {
      return res.status(400).json({ message: "Phone number is too long" });
    }
    user.phone = trimmed;
  }

  await user.save();
  res.json({ user: publicUser(user) });
});
