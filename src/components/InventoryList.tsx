import { useData } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export function InventoryList() {
  const { products } = useData();
  // Show only first 5 items for dashboard view
  const displayProducts = products.slice(0, 5);

  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
          <tr>
            <th className="px-4 py-3 font-medium">Product Name</th>
            <th className="px-4 py-3 font-medium">SKU</th>
            <th className="px-4 py-3 font-medium text-right">Stock</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {displayProducts.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
              <td className="px-4 py-3 font-mono text-gray-500 text-xs">{item.sku}</td>
              <td className="px-4 py-3 text-right font-mono">{item.stock}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {item.status === "In Stock" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  {item.status === "Low Stock" && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                  {item.status === "Out of Stock" && <XCircle className="w-4 h-4 text-red-500" />}
                  <span className={cn(
                    "font-medium text-xs",
                    item.status === "In Stock" && "text-green-700",
                    item.status === "Low Stock" && "text-yellow-700",
                    item.status === "Out of Stock" && "text-red-700",
                  )}>
                    {item.status}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-right font-mono">{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
