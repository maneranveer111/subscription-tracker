import Subscription from "../models/Subscription.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { rollForward, daysUntil } from "../utils/dateUtils.js";
import { monthlyCost, round2 } from "../utils/costUtils.js";

export const getSummary = asyncHandler(async (req, res) => {
  const all = await Subscription.find({ user: req.userId });
  const active = all
    .filter((s) => s.isActive)
    .map((s) => {
      const obj = s.toObject();
      obj.nextRenewalDate = rollForward(obj.nextRenewalDate, obj.cycle);
      return obj;
    });

  const monthlyTotal = round2(active.reduce((sum, s) => sum + monthlyCost(s), 0));

  const categoryMap = new Map();
  for (const s of active) {
    const entry = categoryMap.get(s.category) || { category: s.category, monthly: 0, count: 0 };
    entry.monthly += monthlyCost(s);
    entry.count += 1;
    categoryMap.set(s.category, entry);
  }
  const byCategory = [...categoryMap.values()]
    .map((c) => ({ ...c, monthly: round2(c.monthly) }))
    .sort((a, b) => b.monthly - a.monthly);

  const upcoming = active
    .map((s) => ({
      _id: s._id,
      name: s.name,
      cost: s.cost,
      cycle: s.cycle,
      category: s.category,
      nextRenewalDate: s.nextRenewalDate,
      daysLeft: daysUntil(s.nextRenewalDate),
    }))
    .filter((s) => s.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  res.json({
    activeCount: active.length,
    pausedCount: all.length - active.length,
    monthlyTotal,
    yearlyTotal: round2(monthlyTotal * 12),
    byCategory,
    upcoming,
  });
});
