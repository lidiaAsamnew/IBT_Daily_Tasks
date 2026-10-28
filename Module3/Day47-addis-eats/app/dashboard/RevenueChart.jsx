"use client"; // charts measure the DOM to size themselves, so this is a client LEAF; the page stays a server component

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { etb } from "@/lib/format";

// Revenue by neighbourhood. Receives a handful of summary rows: [{ area, revenue, orders }].
// Honest: the Y axis starts at 0 (a bar's length IS the value), ticks and tooltip say ETB, and every
// bar carries its value as a label, so the chart reads without colour (colour is not the key here).
export default function RevenueChart({ data }) {
  return (
    // A fixed height the container can measure (a percentage of nothing is nothing). It also reserves
    // the space, so the page does not jump when the chart appears.
    <div
      className="h-72 w-full"
      role="img"
      aria-label="Bar chart of revenue by neighbourhood, in ETB. The same figures are in the table below."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="area" tickLine={false} tick={{ fill: "#6b6256", fontSize: 12 }} />
          {/* width: formatted labels ("ETB 14,200") are wider than raw numbers and get clipped otherwise */}
          <YAxis tickFormatter={etb} width={92} domain={[0, "auto"]} allowDecimals={false} tick={{ fill: "#6b6256", fontSize: 12 }} />
          <Tooltip formatter={(v) => [etb(v), "Revenue"]} cursor={{ fill: "rgba(29, 92, 63, 0.08)" }} />
          <Bar dataKey="revenue" name="Revenue" fill="#1d5c3f" isAnimationActive={false}>
            <LabelList dataKey="revenue" position="top" formatter={etb} style={{ fill: "#26201a", fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
