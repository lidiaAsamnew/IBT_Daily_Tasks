"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Orders per day. Receives [{ day: "14 Oct", orders: 9 }, ...] - one row per day, zero-filled.
// A line may start anywhere, but this one starts at 0 too: it keeps the day-to-day change honest.
// Readable without colour: the points are marked with dots, the axis is named, and the table below has the numbers.
export default function OrdersChart({ data }) {
  return (
    <div
      className="h-72 w-full"
      role="img"
      aria-label="Line chart of orders per day. The same figures are in the table below."
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" tickLine={false} minTickGap={12} tick={{ fill: "#6b6256", fontSize: 12 }} />
          <YAxis
            width={56}
            domain={[0, "auto"]}
            allowDecimals={false}
            tick={{ fill: "#6b6256", fontSize: 12 }}
            label={{ value: "Orders", angle: -90, position: "insideLeft", fill: "#6b6256", fontSize: 12 }}
          />
          <Tooltip formatter={(v) => [v, "Orders"]} />
          <Line type="linear" dataKey="orders" name="Orders" stroke="#a8341f" strokeWidth={3} dot={{ r: 4, fill: "#fff", strokeWidth: 2 }} activeDot={{ r: 6 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
