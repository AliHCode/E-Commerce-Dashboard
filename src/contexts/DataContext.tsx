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
          fetch('http://localhost:5000/api/orders'),
          fetch('http://localhost:5000/api/products'),
          fetch('http://localhost:5000/api/customers')
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
