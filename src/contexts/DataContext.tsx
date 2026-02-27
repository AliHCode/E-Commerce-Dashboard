import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

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

interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

interface DataContextType {
  orders: Order[];
  ordersMeta: PaginationMeta | null;
  fetchOrders: (page: number) => Promise<void>;
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
  const [ordersMeta, setOrdersMeta] = useState<PaginationMeta | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { token, logout } = useAuth();

  const getFetchOptions = (method: string = 'GET', body?: any) => {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    return options;
  };

  const handleFetch = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options);
    // If the token is rejected (e.g. expired), force a logout
    if (res.status === 401 || res.status === 403) {
      logout();
      throw new Error("Authentication session expired.");
    }
    return res;
  };

  const fetchOrders = async (page: number = 1) => {
    if (!token) return;
    try {
      const res = await handleFetch(`/api/orders?page=${page}&limit=10`, getFetchOptions());
      if (res.ok) {
        const payload = await res.json();
        setOrders(payload.data);
        setOrdersMeta(payload.meta);
      }
    } catch (error) {
      console.error("Failed to fetch paginated orders:", error);
    }
  };

  // FETCH DATA FROM OUR EXPRESS BACKEND API
  useEffect(() => {
    const fetchInitialData = async () => {
      // Don't try to fetch data if we don't have a token (we'll just get 401s anyway)
      if (!token) {
        setOrders([]);
        setProducts([]);
        setCustomers([]);
        setIsLoading(false);
        return;
      }

      try {
        await fetchOrders(1); // Fetch first page of orders

        const [productsRes, customersRes] = await Promise.all([
          handleFetch('/api/products', getFetchOptions()),
          handleFetch('/api/customers', getFetchOptions())
        ]);

        if (productsRes.ok && customersRes.ok) {
          setProducts(await productsRes.json());
          setCustomers(await customersRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch initial data from backend API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [token]); // Re-fetch whenever the token changes (i.e. on login/logout)

  // Order Actions
  const addOrder = async (order: Omit<Order, "id">) => {
    const newOrder = { ...order, id: `ORD-${Date.now().toString().slice(-3)}` };
    try {
      await handleFetch('/api/orders', getFetchOptions('POST', newOrder));
      setOrders([newOrder as Order, ...orders]);
    } catch (err) { console.error(err); }
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      await handleFetch(`/api/orders/${id}`, getFetchOptions('PUT', updates));
      setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o));
    } catch (err) { console.error(err); }
  };

  const deleteOrder = async (id: string) => {
    try {
      await handleFetch(`/api/orders/${id}`, getFetchOptions('DELETE'));
      setOrders(orders.filter(o => o.id !== id));
    } catch (err) { console.error(err); }
  };

  // Product Actions
  const addProduct = async (product: Omit<Product, "id">) => {
    const newProduct = { ...product, id: `INV-${Date.now().toString().slice(-3)}` };
    try {
      await handleFetch('/api/products', getFetchOptions('POST', newProduct));
      setProducts([newProduct as Product, ...products]);
    } catch (err) { console.error(err); }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await handleFetch(`/api/products/${id}`, getFetchOptions('PUT', updates));
      setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
    } catch (err) { console.error(err); }
  };

  const deleteProduct = async (id: string) => {
    try {
      await handleFetch(`/api/products/${id}`, getFetchOptions('DELETE'));
      setProducts(products.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  // Customer Actions
  const addCustomer = async (customer: Omit<Customer, "id">) => {
    try {
      const res = await handleFetch('/api/customers', getFetchOptions('POST', customer));
      const data = await res.json();
      const newCustomer = { ...customer, id: data.id || Date.now() };
      setCustomers([newCustomer as Customer, ...customers]);
    } catch (err) { console.error(err); }
  };

  const deleteCustomer = async (id: number) => {
    try {
      await handleFetch(`/api/customers/${id}`, getFetchOptions('DELETE'));
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <DataContext.Provider value={{
      orders, ordersMeta, fetchOrders, products, customers,
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
