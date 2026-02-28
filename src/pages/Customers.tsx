import React, { useState } from "react";
import { useData, Customer } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { Search, Mail, Phone, MapPin, Plus, Trash2 } from "lucide-react";

export function Customers() {
  const { customers, addCustomer, deleteCustomer } = useData();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isDark = theme === 'dark';

  const cardClass = isDark ? 'bg-slate-900/80 text-slate-100 border-slate-800' : '';
  const inputClass = isDark ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'border-gray-200 bg-white';
  const labelClass = isDark ? 'text-slate-300' : 'text-gray-700';
  const mainText = isDark ? 'text-slate-100' : 'text-gray-900';
  const subText = isDark ? 'text-slate-400' : 'text-gray-500';

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [newCustomer, setNewCustomer] = useState({
    name: "", email: "", phone: "", location: "",
    orders: 0, spent: "$0.00", status: "New" as Customer["status"], avatar: ""
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!newCustomer.name.trim() || newCustomer.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";
    if (!newCustomer.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email)) errs.email = "Invalid email format.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addCustomer(newCustomer);
    setIsAddModalOpen(false);
    setNewCustomer({ name: "", email: "", phone: "", location: "", orders: 0, spent: "$0.00", status: "New", avatar: "" });
    setErrors({});
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Active: isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700',
      Inactive: isDark ? 'bg-gray-500/10 text-gray-400' : 'bg-gray-100 text-gray-600',
      New: isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700',
    };
    return <span className={cn("text-xs px-2 py-1 rounded-full font-medium", colors[status] || colors.Active)}>{status}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Customers</h1>
        <button onClick={() => setIsAddModalOpen(true)}
          className="h-9 px-4 rounded-md bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <Card className={cardClass}>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm sm:text-base">Customer Directory</CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : ''}>
                {customers.length} total customers · {customers.filter(c => c.status === 'Active').length} active
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search customers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className={cn("w-full sm:w-64 h-9 pl-9 pr-4 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all", inputClass)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="grid gap-3 sm:gap-4">
            {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
              <div key={customer.id} className={cn(
                "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-colors",
                isDark ? 'border-slate-800 hover:bg-slate-800/50' : 'border-gray-100 hover:bg-gray-50/50'
              )}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-500/10 flex items-center justify-center text-sm font-bold text-primary-600 shrink-0">
                  {(customer.name || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("font-semibold text-sm", mainText)}>{customer.name}</span>
                    {statusBadge(customer.status)}
                  </div>
                  <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs", subText)}>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{customer.email}</span>
                    {customer.phone && <span className="flex items-center gap-1 hidden sm:flex"><Phone className="w-3 h-3" />{customer.phone}</span>}
                    {customer.location && <span className="flex items-center gap-1 hidden md:flex"><MapPin className="w-3 h-3" />{customer.location}</span>}
                  </div>
                </div>
                <button onClick={() => deleteCustomer(customer.id)} className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-500/10 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )) : (
              <div className={cn("py-8 text-center text-sm", subText)}>No customers found.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Customer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setErrors({}); }} title="Add New Customer">
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div className="space-y-2">
            <label className={cn("text-sm font-medium", labelClass)}>Full Name *</label>
            <input type="text" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass, errors.name && 'border-red-500')} placeholder="Jane Smith" />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <label className={cn("text-sm font-medium", labelClass)}>Email Address *</label>
            <input type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass, errors.email && 'border-red-500')} placeholder="jane@example.com" />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={cn("text-sm font-medium", labelClass)}>Phone</label>
              <input type="tel" value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass)} placeholder="+1 234 567 890" />
            </div>
            <div className="space-y-2">
              <label className={cn("text-sm font-medium", labelClass)}>Location</label>
              <input type="text" value={newCustomer.location} onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
                className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass)} placeholder="New York, USA" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => { setIsAddModalOpen(false); setErrors({}); }}
              className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors", isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-100')}>Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors">Add Customer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
