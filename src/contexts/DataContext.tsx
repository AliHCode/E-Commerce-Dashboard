import React, { createContext, useContext, useState, useEffect } from "react";

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

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH DATA FROM OUR EXPRESS BACKEND API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, customersRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/products'),
          fetch('/api/customers')
        ]);

        if (ordersRes.ok && productsRes.ok && customersRes.ok) {
          setOrders(await ordersRes.json());
          setProducts(await productsRes.json());
          setCustomers(await customersRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch data from backend API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Order Actions
  const addOrder = async (order: Omit<Order, "id">) => {
    const newOrder = { ...order, id: `ORD-${Date.now().toString().slice(-3)}` };
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      setOrders([newOrder as Order, ...orders]);
    } catch (err) { console.error(err); }
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o));
    } catch (err) { console.error(err); }
  };

  const deleteOrder = async (id: string) => {
    try {
      await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      setOrders(orders.filter(o => o.id !== id));
    } catch (err) { console.error(err); }
  };

  // Product Actions
  const addProduct = async (product: Omit<Product, "id">) => {
    const newProduct = { ...product, id: `INV-${Date.now().toString().slice(-3)}` };
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      setProducts([newProduct as Product, ...products]);
    } catch (err) { console.error(err); }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
    } catch (err) { console.error(err); }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  // Customer Actions
  const addCustomer = async (customer: Omit<Customer, "id">) => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
      });
      const data = await res.json();
      const newCustomer = { ...customer, id: data.id || Date.now() };
      setCustomers([newCustomer as Customer, ...customers]);
    } catch (err) { console.error(err); }
  };

  const deleteCustomer = async (id: number) => {
    try {
      await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err) { console.error(err); }
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
