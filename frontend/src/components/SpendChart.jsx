import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS } from "../utils/constants";
import { formatCurrency } from "../utils/formatters";
import { card } from "../utils/ui";

function CategoryTick({ y, payload }) {
  return (
    <text
      x={0}
      y={y}
      dy={4}
      textAnchor="start"
      fill="#566178"
      fontSize={13}
    >
      {payload?.value}
    </text>
  );
}

export default function SpendChart({ byCategory }) {
  // 50px per bar keeps them compact whether there are 1 or 10 categories
  const height = byCategory.length * 50;

  return (
    <section className={card}>
      <h2 className="font-display text-lg font-semibold">Monthly spend by category</h2>

      {byCategory.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">
          Add a subscription and its category breakdown will show up here.
        </p>
      ) : (
        <div className="mt-4" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byCategory} layout="vertical" margin={{ left: 0, right: 16 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="category"
                width={140}
                interval={0}
                tickLine={false}
                axisLine={false}
                tick={CategoryTick}
              />
              <Tooltip
                cursor={{ fill: "#f3f5f7" }}
                formatter={(value) => [formatCurrency(value), "Per month"]}
              />
              <Bar dataKey="monthly" radius={[0, 4, 4, 0]} barSize={20}>
                {byCategory.map((entry, i) => (
                  <Cell key={entry.category} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
