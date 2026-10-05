import "dotenv/config";

const required = ["MONGO_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-3.8-flash",
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  currency: process.env.CURRENCY || "INR",
  reminderCron: process.env.REMINDER_CRON || "0 9 * * *",
  timezone: process.env.TIMEZONE || "Asia/Kolkata",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  brevoApiKey: process.env.BREVO_API_KEY || "",
  emailFrom: process.env.EMAIL_FROM || "",
  cronSecret: process.env.CRON_SECRET || "",
};
