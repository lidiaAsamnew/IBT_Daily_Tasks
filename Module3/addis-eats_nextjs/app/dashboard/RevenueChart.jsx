"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { etb } from "@/lib/format";

// Recharts measures the DOM, so it must be a client component (Day 46). The page aggregates on the server
// and passes a handful of rows. The wrapper has a REAL height — a percentage of nothing is nothing.
export default function RevenueChart({ data }) {
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="area" />
          {/* A bar axis starts at zero, always. The label names the unit. */}
          <YAxis domain={[0, "auto"]} tickFormatter={etb} width={84} allowDecimals={false} />
          <Tooltip formatter={(v) => [etb(v), "Revenue"]} />
          <Bar dataKey="revenue" name="Revenue" fill="#247a4c" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
