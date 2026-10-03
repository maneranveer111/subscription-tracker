export const monthlyCost = (sub) =>
  sub.cycle === "yearly" ? sub.cost / 12 : sub.cost;

export const round2 = (n) => Math.round(n * 100) / 100;
