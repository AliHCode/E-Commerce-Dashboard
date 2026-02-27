import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SalesChart } from "@/components/SalesChart";
import { RecentOrders } from "@/components/RecentOrders";
import { InventoryList } from "@/components/InventoryList";
import { ShoppingBag, DollarSign, Users, TrendingUp } from "lucide-react";

export function Dashboard() {
  const { orders, customers } = useData();

  // Calculate Stats
  const totalRevenue = orders.reduce((acc, order) => {
    const amount = parseFloat(order.amount.replace(/[^0-9.-]+/g, ""));
    return acc + amount;
  }, 0);

  const activeOrders = orders.filter(o => o.status === "Processing" || o.status === "Pending").length;
  const newCustomers = customers.filter(c => c.status === "New").length;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+20.1% from last month",
      icon: DollarSign,
    },
    {
      title: "Active Orders",
      value: activeOrders.toString(),
      change: "+180.1% from last month",
      icon: ShoppingBag,
    },
    {
      title: "New Customers",
      value: `+${newCustomers}`,
      change: "+19% from last month",
      icon: Users,
    },
    {
      title: "Active Now",
      value: "+573",
      change: "+201 since last hour",
      icon: TrendingUp,
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="flex items-center gap-2">
          <select className="h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="h-9 px-4 rounded-md bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tight">{stat.value}</div>
              <p className="text-xs text-muted-foreground text-gray-500 mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Recent Orders */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>
              Monthly revenue performance for the current fiscal year.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              You made {orders.length} sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOrders />
          </CardContent>
        </Card>
      </div>

      {/* Inventory Section */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
          <CardDescription>
            Real-time stock levels and product status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryList />
        </CardContent>
      </Card>
    </div>
  );
}
