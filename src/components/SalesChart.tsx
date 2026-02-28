import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";

export function SalesChart() {
  const { orders } = useData();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const monthlyData = [
    { name: "Jan", total: 0 }, { name: "Feb", total: 0 }, { name: "Mar", total: 0 },
    { name: "Apr", total: 0 }, { name: "May", total: 0 }, { name: "Jun", total: 0 },
    { name: "Jul", total: 0 }, { name: "Aug", total: 0 }, { name: "Sep", total: 0 },
    { name: "Oct", total: 0 }, { name: "Nov", total: 0 }, { name: "Dec", total: 0 },
  ];

  orders.forEach((order) => {
    const date = new Date(order.date);
    if (!isNaN(date.getTime())) {
      const monthIndex = date.getMonth();
      const amount = parseFloat(order.amount.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(amount)) monthlyData[monthIndex].total += amount;
    }
  });

  const axisColor = isDark ? '#64748b' : '#888888';

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={monthlyData}>
        <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
        <Tooltip
          cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
          contentStyle={{
            backgroundColor: isDark ? '#0f172a' : '#1f2937',
            border: isDark ? '1px solid #1e293b' : 'none',
            borderRadius: '8px',
            color: '#fff'
          }}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]}
          className="fill-primary-600 hover:fill-primary-500 transition-colors" />
      </BarChart>
    </ResponsiveContainer>
  );
}
