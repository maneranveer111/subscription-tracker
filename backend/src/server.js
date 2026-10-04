import dns from "dns";

try {
  dns.setServers(["8.8.8.8"]);
} catch (err) {
  console.warn("Custom DNS could not be set, using system default:", err.message);
}

import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import app from "./app.js";
import { startReminderJob } from "./jobs/reminderJob.js";

async function start() {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });

    startReminderJob();
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();