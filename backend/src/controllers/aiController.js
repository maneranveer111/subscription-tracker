import Subscription from "../models/Subscription.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { monthlyCost, round2 } from "../utils/costUtils.js";
import { generateJson, buildCancelPrompt } from "../services/geminiService.js";
import { env } from "../config/env.js";

const ACTIONS = new Set(["cancel", "keep", "review"]);
const COOLDOWN_MS = 10_000;
const lastCall = new Map(); // userId -> timestamp; protects the free Gemini quota

export const cancelSuggestions = asyncHandler(async (req, res) => {
  const now = Date.now();
  if (now - (lastCall.get(req.userId) || 0) < COOLDOWN_MS) {
    return res.status(429).json({ message: "Please wait a few seconds before asking again" });
  }
  lastCall.set(req.userId, now);

  const subs = await Subscription.find({ user: req.userId, isActive: true });
  if (!subs.length) {
    return res.json({
      summary: "You have no active subscriptions yet. Add some, then come back for suggestions.",
      suggestions: [],
      totalPotentialMonthlySavings: 0,
      totalPotentialYearlySavings: 0,
    });
  }

  const items = subs.map((s) => s.toObject());
  const ai = await generateJson(buildCancelPrompt(items, env.currency));

  // The AI picks the action and reason; the server calculates every number
  const byName = new Map(items.map((s) => [s.name.trim().toLowerCase(), s]));
  const suggestions = [];
  for (const raw of Array.isArray(ai?.suggestions) ? ai.suggestions : []) {
    const sub = byName.get(String(raw?.name || "").trim().toLowerCase());
    if (!sub) continue;
    const action = ACTIONS.has(raw.action) ? raw.action : "review";
    suggestions.push({
      name: sub.name,
      action,
      reason: String(raw.reason || "").slice(0, 300),
      monthlySavings: action === "cancel" ? round2(monthlyCost(sub)) : 0,
    });
  }

  const totalMonthly = round2(suggestions.reduce((sum, s) => sum + s.monthlySavings, 0));

  res.json({
    summary: String(ai?.summary || "").slice(0, 500),
    suggestions,
    totalPotentialMonthlySavings: totalMonthly,
    totalPotentialYearlySavings: round2(totalMonthly * 12),
  });
});
