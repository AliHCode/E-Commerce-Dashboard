import { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_OPTIONS = ["Pending", "Processing", "Completed", "Delivered", "Cancelled"] as const;
const STATUS_COLORS: Record<string, { light: string; dark: string }> = {
  Completed: { light: "bg-green-100 text-green-700", dark: "bg-green-500/10 text-green-400" },
  Processing: { light: "bg-blue-100 text-blue-700", dark: "bg-blue-500/10 text-blue-400" },
  Pending: { light: "bg-yellow-100 text-yellow-700", dark: "bg-yellow-500/10 text-yellow-400" },
  Delivered: { light: "bg-emerald-100 text-emerald-700", dark: "bg-emerald-500/10 text-emerald-400" },
  Cancelled: { light: "bg-red-100 text-red-700", dark: "bg-red-500/10 text-red-400" },
};

export function Orders() {
  const { orders, ordersMeta, fetchOrders, updateOrder } = useData();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const isDark = theme === 'dark';

  const cardClass = isDark ? 'bg-slate-900/80 text-slate-100 border-slate-800' : '';
  const inputClass = isDark ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'border-gray-200 bg-gray-50';
  const selectClass = isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'border-gray-200 bg-white';
  const theadClass = isDark ? 'text-slate-400 bg-slate-800/50' : 'text-gray-500 bg-gray-50/50';
  const rowHover = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50/50';
  const divider = isDark ? 'divide-slate-800' : 'divide-gray-100';
  const subText = isDark ? 'text-slate-400' : 'text-gray-500';
  const mainText = isDark ? 'text-slate-100' : 'text-gray-900';

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) updateOrder(orderId, { ...order, status: newStatus as any });
  };

  const handlePageChange = (newPage: number) => fetchOrders(newPage);

  const exportOrders = () => {
    const headers = ['ID', 'Customer', 'Email', 'Amount', 'Status', 'Date'];
    const rows = filteredOrders.map(o => [o.id, o.customer, o.email, o.amount, o.status, o.date]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Orders</h1>
        <button onClick={exportOrders} className={cn("h-9 px-4 rounded-md border text-sm font-medium shadow-sm transition-colors flex items-center gap-2 w-fit", isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50')}>
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <Card className={cardClass}>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm sm:text-base">All Orders</CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : ''}>Manage and view all customer orders.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn("w-full sm:w-64 h-9 pl-9 pr-4 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all", inputClass)} />
              </div>
              <div className="relative">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className={cn("h-9 pl-3 pr-8 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none cursor-pointer", selectClass)}>
                  <option value="All">All Status</option>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className={cn("text-xs uppercase", theadClass)}>
                <tr>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={cn("divide-y", divider)}>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className={cn("transition-colors", rowHover)}>
                      <td className={cn("px-4 py-3 font-mono text-xs font-medium", mainText)}>#{order.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className={cn("font-medium", mainText)}>{order.customer}</span>
                          <span className={cn("text-xs", subText)}>{order.email}</span>
                        </div>
                      </td>
                      <td className={cn("px-4 py-3 hidden sm:table-cell", subText)}>{order.date}</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={cn(
                            "text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                            isDark ? STATUS_COLORS[order.status]?.dark : STATUS_COLORS[order.status]?.light
                          )}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className={cn("px-4 py-3 text-right font-mono font-medium", mainText)}>{order.amount}</td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/orders/${order.id}`} className="text-primary-600 hover:text-primary-500 font-medium text-xs">View</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className={cn("px-4 py-8 text-center", subText)}>No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {ordersMeta && ordersMeta.totalPages > 1 && (
            <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t mt-0 px-4 pb-4", isDark ? 'border-slate-800' : 'border-gray-100')}>
              <div className={cn("text-xs", subText)}>
                Showing {((ordersMeta.currentPage - 1) * ordersMeta.limit) + 1} to {Math.min(ordersMeta.currentPage * ordersMeta.limit, ordersMeta.totalItems)} of {ordersMeta.totalItems}
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => handlePageChange(ordersMeta.currentPage - 1)} disabled={ordersMeta.currentPage === 1}
                  className={cn("p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed", isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: ordersMeta.totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => handlePageChange(page)}
                    className={cn("w-7 h-7 rounded text-xs font-medium flex items-center justify-center transition-colors",
                      ordersMeta.currentPage === page ? "bg-primary-600 text-white" : isDark ? "text-slate-400 hover:bg-slate-800" : "text-gray-600 hover:bg-gray-100"
                    )}>
                    {page}
                  </button>
                ))}
                <button onClick={() => handlePageChange(ordersMeta.currentPage + 1)} disabled={ordersMeta.currentPage === ordersMeta.totalPages}
                  className={cn("p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed", isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
