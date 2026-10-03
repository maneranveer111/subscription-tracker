import Subscription from "../models/Subscription.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { rollForward } from "../utils/dateUtils.js";

// Past renewal dates are shown as the next upcoming one
const present = (doc) => {
  const obj = doc.toObject();
  obj.nextRenewalDate = rollForward(obj.nextRenewalDate, obj.cycle);
  return obj;
};

export const listSubscriptions = asyncHandler(async (req, res) => {
  const subs = await Subscription.find({ user: req.userId });
  const items = subs.map(present);
  items.sort((a, b) => new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate));
  res.json(items);
});

export const createSubscription = asyncHandler(async (req, res) => {
  const sub = await Subscription.create({ ...req.body, user: req.userId });
  res.status(201).json(present(sub));
});

export const updateSubscription = asyncHandler(async (req, res) => {
  const sub = await Subscription.findOneAndUpdate(
    { _id: req.params.id, user: req.userId }, // user filter = ownership check
    req.body,
    { new: true, runValidators: true }
  );
  if (!sub) return res.status(404).json({ message: "Subscription not found" });
  res.json(present(sub));
});

export const deleteSubscription = asyncHandler(async (req, res) => {
  const sub = await Subscription.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  if (!sub) return res.status(404).json({ message: "Subscription not found" });
  res.json({ message: "Subscription deleted" });
});
