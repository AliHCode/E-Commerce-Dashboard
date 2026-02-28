import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, XCircle, ImageIcon } from "lucide-react";

export function InventoryList() {
  const { products } = useData();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const displayProducts = products.slice(0, 5);

  const theadClass = isDark ? 'text-slate-400 bg-slate-800/50' : 'text-gray-500 bg-gray-50/50';
  const rowHover = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50/50';
  const divider = isDark ? 'divide-slate-800' : 'divide-gray-100';
  const mainText = isDark ? 'text-slate-100' : 'text-gray-900';
  const subText = isDark ? 'text-slate-400' : 'text-gray-500';

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left min-w-[500px]">
        <thead className={cn("text-xs uppercase", theadClass)}>
          <tr>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium hidden sm:table-cell">SKU</th>
            <th className="px-4 py-3 font-medium text-right">Stock</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Price</th>
          </tr>
        </thead>
        <tbody className={cn("divide-y", divider)}>
          {displayProducts.map((item) => (
            <tr key={item.id} className={cn("transition-colors", rowHover)}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", isDark ? 'bg-slate-800' : 'bg-gray-100')}>
                      <ImageIcon className={cn("w-3.5 h-3.5", subText)} />
                    </div>
                  )}
                  <span className={cn("font-medium", mainText)}>{item.name}</span>
                </div>
              </td>
              <td className={cn("px-4 py-3 font-mono text-xs hidden sm:table-cell", subText)}>{item.sku}</td>
              <td className={cn("px-4 py-3 text-right font-mono", mainText)}>{item.stock}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  {item.status === "In Stock" && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                  {item.status === "Low Stock" && <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />}
                  {item.status === "Out of Stock" && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                  <span className={cn("font-medium text-xs",
                    item.status === "In Stock" && "text-green-600",
                    item.status === "Low Stock" && "text-yellow-600",
                    item.status === "Out of Stock" && "text-red-600",
                  )}>{item.status}</span>
                </div>
              </td>
              <td className={cn("px-4 py-3 text-right font-mono", mainText)}>{item.price}</td>
            </tr>
          ))}
          {displayProducts.length === 0 && (
            <tr><td colSpan={5} className={cn("px-4 py-8 text-center", subText)}>No products yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
