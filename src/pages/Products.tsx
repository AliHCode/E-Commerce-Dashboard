import React, { useState } from "react";
import { useData, Product } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { Plus, Search, AlertCircle, CheckCircle2, XCircle, Trash2, ImageIcon } from "lucide-react";

export function Products() {
  const { products, addProduct, deleteProduct } = useData();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isDark = theme === 'dark';

  const cardClass = isDark ? 'bg-slate-900/80 text-slate-100 border-slate-800' : '';
  const inputClass = isDark ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'border-gray-200 bg-white';
  const labelClass = isDark ? 'text-slate-300' : 'text-gray-700';
  const theadClass = isDark ? 'text-slate-400 bg-slate-800/50' : 'text-gray-500 bg-gray-50/50';
  const rowHover = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50/50';
  const divider = isDark ? 'divide-slate-800' : 'divide-gray-100';
  const mainText = isDark ? 'text-slate-100' : 'text-gray-900';
  const subText = isDark ? 'text-slate-400' : 'text-gray-500';

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = products.length;
  const lowStock = products.filter(p => p.status === "Low Stock").length;
  const outOfStock = products.filter(p => p.status === "Out of Stock").length;

  const [newProduct, setNewProduct] = useState({
    name: "", sku: "", stock: 0, status: "In Stock" as Product["status"], price: "", image_url: ""
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!newProduct.name.trim() || newProduct.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";
    if (!newProduct.sku.trim()) errs.sku = "SKU is required.";
    if (!newProduct.price.trim()) errs.price = "Price is required.";
    if (newProduct.stock < 0) errs.stock = "Stock cannot be negative.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addProduct(newProduct);
    setIsAddModalOpen(false);
    setNewProduct({ name: "", sku: "", stock: 0, status: "In Stock", price: "", image_url: "" });
    setErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Products</h1>
        <button onClick={() => setIsAddModalOpen(true)}
          className="h-9 px-4 rounded-md bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-3">
        {[
          { label: "Total Products", value: totalProducts, sub: "items in catalog", color: "" },
          { label: "Low Stock", value: lowStock, sub: "need restocking", color: "text-yellow-600" },
          { label: "Out of Stock", value: outOfStock, sub: "unavailable", color: "text-red-600" },
        ].map((s, i) => (
          <Card key={i} className={cardClass}>
            <CardHeader className="pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className={cn("text-xs sm:text-sm font-medium", subText)}>{s.label}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className={cn("text-lg sm:text-2xl font-bold", s.color)}>{s.value}</div>
              <p className={cn("text-[10px] sm:text-xs mt-1", subText)}>{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className={cardClass}>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm sm:text-base">Inventory Management</CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : ''}>Manage your product catalog and stock levels.</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className={cn("w-full sm:w-64 h-9 pl-9 pr-4 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all", inputClass)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className={cn("text-xs uppercase", theadClass)}>
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">SKU</th>
                  <th className="px-4 py-3 font-medium text-right">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Price</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={cn("divide-y", divider)}>
                {filteredProducts.map((item) => (
                  <tr key={item.id} className={cn("transition-colors", rowHover)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", isDark ? 'bg-slate-800' : 'bg-gray-100')}>
                            <ImageIcon className={cn("w-4 h-4", subText)} />
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
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteProduct(item.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr><td colSpan={6} className={cn("px-4 py-8 text-center", subText)}>No products found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setErrors({}); }} title="Add New Product">
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div className="space-y-2">
            <label className={cn("text-sm font-medium", labelClass)}>Product Name *</label>
            <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass, errors.name && 'border-red-500')} placeholder="Wireless Mouse" />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={cn("text-sm font-medium", labelClass)}>SKU *</label>
              <input type="text" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass, errors.sku && 'border-red-500')} placeholder="WM-001" />
              {errors.sku && <p className="text-xs text-red-500">{errors.sku}</p>}
            </div>
            <div className="space-y-2">
              <label className={cn("text-sm font-medium", labelClass)}>Price *</label>
              <input type="text" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass, errors.price && 'border-red-500')} placeholder="$29.99" />
              {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={cn("text-sm font-medium", labelClass)}>Stock</label>
              <input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass, errors.stock && 'border-red-500')} min={0} />
              {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
            </div>
            <div className="space-y-2">
              <label className={cn("text-sm font-medium", labelClass)}>Status</label>
              <select value={newProduct.status} onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value as any })}
                className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass)}>
                <option value="In Stock">In Stock</option><option value="Low Stock">Low Stock</option><option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className={cn("text-sm font-medium", labelClass)}>Image URL <span className={subText}>(optional)</span></label>
            <input type="url" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
              className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass)} placeholder="https://example.com/image.jpg" />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => { setIsAddModalOpen(false); setErrors({}); }}
              className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors", isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-100')}>Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors">Add Product</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
