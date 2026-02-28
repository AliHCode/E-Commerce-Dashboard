import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, { light: string; dark: string }> = {
  Completed: { light: "bg-green-100 text-green-700", dark: "bg-green-500/10 text-green-400" },
  Processing: { light: "bg-blue-100 text-blue-700", dark: "bg-blue-500/10 text-blue-400" },
  Pending: { light: "bg-yellow-100 text-yellow-700", dark: "bg-yellow-500/10 text-yellow-400" },
  Delivered: { light: "bg-emerald-100 text-emerald-700", dark: "bg-emerald-500/10 text-emerald-400" },
  Cancelled: { light: "bg-red-100 text-red-700", dark: "bg-red-500/10 text-red-400" },
};

export function RecentOrders() {
  const { orders } = useData();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-3 sm:space-y-4">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center gap-2">
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className={cn("text-sm font-medium leading-none truncate", isDark ? 'text-slate-100' : '')}>{order.customer}</p>
            <p className={cn("text-xs truncate", isDark ? 'text-slate-500' : 'text-gray-500')}>{order.email}</p>
          </div>
          <div className={cn("font-medium font-mono text-sm shrink-0", isDark ? 'text-slate-200' : '')}>{order.amount}</div>
          <span className={cn("text-xs px-2 py-1 rounded-full shrink-0",
            isDark ? STATUS_COLORS[order.status]?.dark : STATUS_COLORS[order.status]?.light
          )}>
            {order.status}
          </span>
        </div>
      ))}
      {recentOrders.length === 0 && (
        <div className={cn("py-6 text-center text-sm", isDark ? 'text-slate-500' : 'text-gray-400')}>
          No orders yet. Create your first order.
        </div>
      )}
      {recentOrders.length > 0 && (
        <div className="pt-2 text-center">
          <Link to="/orders" className="text-sm text-primary-600 hover:text-primary-500 font-medium">View all orders</Link>
        </div>
      )}
    </div>
  );
}
