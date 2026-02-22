import React, { createContext, useContext, useState } from "react";
import { RECENT_ORDERS, INVENTORY, SALES_DATA } from "@/data/mockData";

// Define types based on mock data
export interface Order {
  id: string;
  customer: string;
  email: string;
  amount: string;
  status: "Completed" | "Processing" | "Pending" | "Cancelled";
  date: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  price: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  orders: number;
  spent: string;
  status: "Active" | "Inactive" | "New";
  avatar: string;
}

interface DataContextType {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  addOrder: (order: Omit<Order, "id">) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCustomer: (customer: Omit<Customer, "id">) => void;
  deleteCustomer: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Customers Data (moved from Customers.tsx to here for global state)
const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: "Alex Morgan",
    email: "alex@aether.io",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    orders: 12,
    spent: "$1,234.56",
    status: "Active",
    avatar: "https://picsum.photos/seed/alex/100/100"
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah@example.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, USA",
    orders: 8,
    spent: "$856.22",
    status: "Active",
    avatar: "https://picsum.photos/seed/sarah/100/100"
  },
  {
    id: 3,
    name: "James Wilson",
    email: "james@example.com",
    phone: "+1 (555) 456-7890",
    location: "London, UK",
    orders: 3,
    spent: "$234.00",
    status: "Inactive",
    avatar: "https://picsum.photos/seed/james/100/100"
  },
  {
    id: 4,
    name: "Maria Garcia",
    email: "maria@example.com",
    phone: "+1 (555) 234-5678",
    location: "Madrid, Spain",
    orders: 24,
    spent: "$3,456.78",
    status: "Active",
    avatar: "https://picsum.photos/seed/maria/100/100"
  },
  {
    id: 5,
    name: "David Kim",
    email: "david@example.com",
    phone: "+1 (555) 876-5432",
    location: "Seoul, Korea",
    orders: 1,
    spent: "$45.00",
    status: "New",
    avatar: "https://picsum.photos/seed/david/100/100"
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(RECENT_ORDERS as Order[]);
  const [products, setProducts] = useState<Product[]>(INVENTORY as Product[]);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  // Order Actions
  const addOrder = (order: Omit<Order, "id">) => {
    const newOrder = { ...order, id: `ORD-${Date.now().toString().slice(-3)}` };
    setOrders([newOrder, ...orders]);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  // Product Actions
  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = { ...product, id: `INV-${Date.now().toString().slice(-3)}` };
    setProducts([newProduct, ...products]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Customer Actions
  const addCustomer = (customer: Omit<Customer, "id">) => {
    const newCustomer = { ...customer, id: Date.now() };
    setCustomers([newCustomer, ...customers]);
  };

  const deleteCustomer = (id: number) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  return (
    <DataContext.Provider value={{
      orders, products, customers,
      addOrder, updateOrder, deleteOrder,
      addProduct, updateProduct, deleteProduct,
      addCustomer, deleteCustomer
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
