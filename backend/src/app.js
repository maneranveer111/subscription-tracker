import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import cronRoutes from "./routes/cronRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Render sits behind a proxy. Without this, every visitor looks like the same IP
// to the rate limiter, and one person's requests could lock everyone out.
app.set("trust proxy", 1);

// Security headers. The API is called from another origin (Vercel), so allow cross-origin reads.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// CLIENT_URL can hold several origins separated by commas (e.g. "http://localhost:5173,https://your-app.vercel.app")
const allowedOrigins = env.clientUrl
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);

// The JWT travels in the Authorization header, not cookies, so credentials aren't needed
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "100kb" }));

// Outside /api on purpose, so uptime pings are never rate limited
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ---- Rate limiting (counters live in memory; fine for one server instance) ----
const limiterBase = {
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again in a few minutes." },
};

// General limit for the whole API
const apiLimiter = rateLimit({ ...limiterBase, windowMs: 15 * 60 * 1000, limit: 300 });

// Login / Google sign-in: only failed attempts count, so real users aren't locked out
const loginLimiter = rateLimit({
  ...limiterBase,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
});

// Signup: every attempt counts, which stops scripts from creating fake accounts
const registerLimiter = rateLimit({ ...limiterBase, windowMs: 60 * 60 * 1000, limit: 10 });

app.use("/api", apiLimiter);
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/google", loginLimiter);
app.use("/api/auth/register", registerLimiter);

app.use("/api/internal", cronRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reminders", reminderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
