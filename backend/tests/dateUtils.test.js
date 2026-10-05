import test from "node:test";
import assert from "node:assert/strict";
import { daysUntil, addCycle, rollForward } from "../src/utils/dateUtils.js";
import { monthlyCost, round2 } from "../src/utils/costUtils.js";

const from = new Date("2026-10-03T10:00:00Z");
const iso = (d) => d.toISOString().slice(0, 10);

test("daysUntil counts whole calendar days", () => {
  assert.equal(daysUntil("2026-10-06", from), 3);
  assert.equal(daysUntil("2026-10-03", from), 0);
  assert.equal(daysUntil("2026-10-01", from), -2);
});

test("month-end renewals clamp to the shorter month", () => {
  assert.equal(iso(addCycle(new Date("2027-01-31T00:00:00Z"), "monthly")), "2027-02-28");
  assert.equal(iso(addCycle(new Date("2028-01-31T00:00:00Z"), "monthly")), "2028-02-29"); // leap year
});

test("yearly cycle adds twelve months", () => {
  assert.equal(iso(addCycle(new Date("2026-12-01T00:00:00Z"), "yearly")), "2027-12-01");
});

test("rollForward moves a past monthly date to its next occurrence", () => {
  assert.equal(iso(rollForward("2026-07-15T00:00:00Z", "monthly", from)), "2026-10-15");
});

test("rollForward moves a past yearly date to its next occurrence", () => {
  assert.equal(iso(rollForward("2024-12-01T00:00:00Z", "yearly", from)), "2026-12-01");
});

test("rollForward leaves today and future dates alone", () => {
  assert.equal(iso(rollForward("2026-10-03T00:00:00Z", "monthly", from)), "2026-10-03");
  assert.equal(iso(rollForward("2026-11-01T00:00:00Z", "monthly", from)), "2026-11-01");
});

test("monthlyCost converts yearly plans to a monthly amount", () => {
  assert.equal(monthlyCost({ cost: 1200, cycle: "yearly" }), 100);
  assert.equal(monthlyCost({ cost: 649, cycle: "monthly" }), 649);
});

test("round2 rounds to two decimals", () => {
  assert.equal(round2(10.456), 10.46);
  assert.equal(round2(1818), 1818);
});
