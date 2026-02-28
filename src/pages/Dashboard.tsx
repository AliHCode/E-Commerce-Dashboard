import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SalesChart } from "@/components/SalesChart";
import { RecentOrders } from "@/components/RecentOrders";
import { InventoryList } from "@/components/InventoryList";
import { ShoppingBag, DollarSign, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStats {
  revenue: { current: number; previous: number; trend: number };
  orders: { total: number; active: number; completed: number; previousTotal: number };
  customers: { total: number; active: number };
  products: { total: number; inStock: number };
  period: { days: number; from: string; to: string };
}

export function Dashboard() {
  const { orders, products, customers } = useData();
  const { token } = useAuth();
  const { theme } = useTheme();
  const [period, setPeriod] = useState(30);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/stats?days=${period}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setStats(await res.json());
      } catch (e) { console.error(e); }
    };
    fetchStats();
  }, [token, period]);

  const downloadCSV = () => {
    const headers = ['ID', 'Customer', 'Email', 'Amount', 'Status', 'Date'];
    const rows = orders.map(o => [o.id, o.customer, o.email, o.amount, o.status, o.date]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aether-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isDark = theme === 'dark';
  const cardClass = isDark ? 'bg-slate-900/80 text-slate-100 border-slate-800' : '';
  const subText = isDark ? 'text-slate-400' : 'text-gray-500';
  const iconColor = isDark ? 'text-slate-500' : 'text-gray-400';

  const trendIcon = (val: number) => val >= 0
    ? <ArrowUpRight className="w-3 h-3 text-emerald-500 inline" />
    : <ArrowDownRight className="w-3 h-3 text-red-500 inline" />;
  const trendColor = (val: number) => val >= 0 ? 'text-emerald-500' : 'text-red-500';

  const statCards = stats ? [
    {
      title: "Total Revenue",
      value: `$${stats.revenue.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: stats.revenue.trend,
      subtitle: `vs previous ${period} days`,
      icon: DollarSign,
    },
    {
      title: "Active Orders",
      value: stats.orders.active.toString(),
      trend: stats.orders.previousTotal > 0 ? ((stats.orders.total - stats.orders.previousTotal) / stats.orders.previousTotal * 100) : 0,
      subtitle: `${stats.orders.completed} completed`,
      icon: ShoppingBag,
    },
    {
      title: "Total Customers",
      value: stats.customers.total.toString(),
      trend: 0,
      subtitle: `${stats.customers.active} active`,
      icon: Users,
    },
    {
      title: "Total Products",
      value: stats.products.total.toString(),
      trend: 0,
      subtitle: `${stats.products.inStock} in stock`,
      icon: TrendingUp,
    }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className={cn(
              "h-9 rounded-md border px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500",
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'border-gray-200 bg-white'
            )}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={downloadCSV}
            className="h-9 px-3 sm:px-4 rounded-md bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className={cardClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={cn("h-4 w-4", iconColor)} />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-lg sm:text-2xl font-bold font-mono tracking-tight">{stat.value}</div>
              <p className={cn("text-[10px] sm:text-xs mt-1", subText)}>
                {stat.trend !== 0 && (
                  <span className={cn("font-medium mr-1", trendColor(stat.trend))}>
                    {trendIcon(stat.trend)} {stat.trend > 0 ? '+' : ''}{stat.trend.toFixed(1)}%
                  </span>
                )}
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Recent Orders */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className={cn("col-span-full lg:col-span-4", cardClass)}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base">Revenue Over Time</CardTitle>
            <CardDescription className={isDark ? 'text-slate-400' : ''}>
              Monthly revenue for the current year.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-1 sm:pl-2 p-4 pt-0 sm:p-6 sm:pt-0">
            <SalesChart />
          </CardContent>
        </Card>
        <Card className={cn("col-span-full lg:col-span-3", cardClass)}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base">Recent Orders</CardTitle>
            <CardDescription className={isDark ? 'text-slate-400' : ''}>
              You made {orders.length} sales this period.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <RecentOrders />
          </CardContent>
        </Card>
      </div>

      {/* Inventory Section */}
      <Card className={cardClass}>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-sm sm:text-base">Inventory Status</CardTitle>
          <CardDescription className={isDark ? 'text-slate-400' : ''}>
            Real-time stock levels and product status.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <InventoryList />
        </CardContent>
      </Card>
    </div>
  );
}
