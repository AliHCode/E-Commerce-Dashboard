import React, { useState } from "react";
import { useData, Customer } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Search, Mail, Phone, MapPin, MoreHorizontal, Plus, Trash2 } from "lucide-react";

export function Customers() {
  const { customers, addCustomer, deleteCustomer } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter Logic
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    orders: 0,
    spent: "$0.00",
    status: "New" as Customer["status"],
    avatar: `https://picsum.photos/seed/${Date.now()}/100/100`
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(newCustomer);
    setIsAddModalOpen(false);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      location: "",
      orders: 0,
      spent: "$0.00",
      status: "New",
      avatar: `https://picsum.photos/seed/${Date.now()}/100/100`
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 h-9 pl-9 pr-4 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 px-4 rounded-md bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="overflow-hidden group">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex items-center gap-3">
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <CardTitle className="text-base">{customer.name}</CardTitle>
                  <CardDescription className="text-xs">{customer.email}</CardDescription>
                </div>
              </div>
              <button
                onClick={() => deleteCustomer(customer.id)}
                className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate font-mono">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{customer.location}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Orders</p>
                  <p className="text-lg font-semibold text-gray-900">{customer.orders}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Spent</p>
                  <p className="text-lg font-semibold text-gray-900">{customer.spent}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Status</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1
                    ${customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                      customer.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'}`}>
                    {customer.status}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button className="w-full h-9 rounded border border-gray-200 text-xs font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Mail className="w-3 h-3" />
                  Send Email
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Customer"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="Jane Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="jane@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                required
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                required
                value={newCustomer.location}
                onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
                className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="City, Country"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
            >
              Add Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
