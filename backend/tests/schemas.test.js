import test from "node:test";
import assert from "node:assert/strict";
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from "../src/validators/subscriptionSchemas.js";
import { registerSchema, updateProfileSchema } from "../src/validators/authSchemas.js";

test("create: trims, converts types and strips unknown fields", () => {
  const result = createSubscriptionSchema.parse({
    name: "  Netflix ",
    cost: "649",
    cycle: "monthly",
    nextRenewalDate: "2026-10-10",
    user: "someone-elses-id", // must never get through
    lastReminderFor: "2026-01-01",
  });
  assert.equal(result.name, "Netflix");
  assert.equal(result.cost, 649);
  assert.ok(result.nextRenewalDate instanceof Date);
  assert.equal("user" in result, false);
  assert.equal("lastReminderFor" in result, false);
});

test("create: rejects negative cost and unknown billing cycle", () => {
  const base = { name: "X", cost: 1, cycle: "monthly", nextRenewalDate: "2026-10-10" };
  assert.equal(createSubscriptionSchema.safeParse({ ...base, cost: -5 }).success, false);
  assert.equal(createSubscriptionSchema.safeParse({ ...base, cycle: "weekly" }).success, false);
});

test("update: a partial update contains only the fields that were sent", () => {
  assert.deepEqual(updateSubscriptionSchema.parse({ cost: "199" }), { cost: 199 });
});

test("update: an empty body is rejected", () => {
  assert.equal(updateSubscriptionSchema.safeParse({}).success, false);
});

test("register: enforces password length and normalizes email", () => {
  assert.equal(registerSchema.safeParse({ name: "Ann", email: "a@b.co", password: "short" }).success, false);
  const ok = registerSchema.parse({ name: "Ann", email: " ANN@Example.COM ", password: "longenough1" });
  assert.equal(ok.email, "ann@example.com");
});

test("profile update: validates types so bad input can't crash the server", () => {
  assert.equal(updateProfileSchema.safeParse({ name: 123 }).success, false);
  assert.equal(updateProfileSchema.safeParse({ email: "not-an-email" }).success, false);
  assert.equal(updateProfileSchema.safeParse({ phone: "1".repeat(21) }).success, false);
  assert.deepEqual(updateProfileSchema.parse({ username: " ranveer " }), { username: "ranveer" });
});
