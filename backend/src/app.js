import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// CLIENT_URL can hold several origins separated by commas
app.use(cors({ origin: env.clientUrl.split(",").map((o) => o.trim()) }));
app.use(express.json({ limit: "100kb" }));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reminders", reminderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
