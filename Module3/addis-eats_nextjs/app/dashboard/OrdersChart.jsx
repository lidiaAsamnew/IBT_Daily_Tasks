"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function OrdersChart({ data }) {
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" interval="preserveStartEnd" minTickGap={24} />
          <YAxis allowDecimals={false} width={36} domain={[0, "auto"]} />
          <Tooltip formatter={(v) => [v, "Orders"]} />
          <Line type="monotone" dataKey="orders" name="Orders" stroke="#b45309" strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
