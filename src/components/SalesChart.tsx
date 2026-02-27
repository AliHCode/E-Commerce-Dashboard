import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

import { useData } from "@/contexts/DataContext";

export function SalesChart() {
  const { orders } = useData();

  // Initialize all 12 months to 0
  const monthlyData = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];

  // Aggregate real order data
  orders.forEach((order) => {
    // Basic date parsing assuming "YYYY-MM-DD" or similar
    const date = new Date(order.date);
    if (!isNaN(date.getTime())) {
      const monthIndex = date.getMonth(); // 0 for Jan, 11 for Dec
      const amount = parseFloat(order.amount.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(amount)) {
        monthlyData[monthIndex].total += amount;
      }
    }
  });

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={monthlyData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          cursor={{ fill: 'transparent' }}
          contentStyle={{
            backgroundColor: '#1f2937',
            border: 'none',
            borderRadius: '8px',
            color: '#fff'
          }}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary-600 hover:fill-primary-500 transition-colors"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
