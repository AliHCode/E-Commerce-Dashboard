import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";

export function RecentOrders() {
  const { orders } = useData();
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-4">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{order.customer}</p>
            <p className="text-sm text-gray-500">{order.email}</p>
          </div>
          <div className="ml-auto font-medium font-mono">{order.amount}</div>
          <div className={cn(
            "ml-4 text-xs px-2 py-1 rounded-full",
            order.status === "Completed" && "bg-green-100 text-green-700",
            order.status === "Processing" && "bg-blue-100 text-blue-700",
            order.status === "Pending" && "bg-yellow-100 text-yellow-700",
            order.status === "Cancelled" && "bg-red-100 text-red-700",
          )}>
            {order.status}
          </div>
        </div>
      ))}
      <div className="pt-2 text-center">
        <Link to="/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all orders
        </Link>
      </div>
    </div>
  );
}
