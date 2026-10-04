import mongoose from "mongoose";
import { env } from "./env.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function connectDB(retries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(env.mongoUri);
      console.log("MongoDB connected");
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed:`, err.message);
      if (attempt < retries) {
        console.log(`Retrying in ${delayMs / 1000}s...`);
        await sleep(delayMs);
        delayMs = Math.min(delayMs * 1.5, 15000); // exponential backoff, cap at 15s
      } else {
        throw err; // all retries exhausted, let server.js handle it
      }
    }
  }
}
