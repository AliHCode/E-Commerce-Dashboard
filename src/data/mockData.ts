import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Package, 
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";

export const STATS = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    icon: DollarSign,
    trend: "up"
  },
  {
    title: "Active Orders",
    value: "+2350",
    change: "+180.1% from last month",
    icon: ShoppingBag,
    trend: "up"
  },
  {
    title: "New Customers",
    value: "+12,234",
    change: "+19% from last month",
    icon: Users,
    trend: "up"
  },
  {
    title: "Active Now",
    value: "+573",
    change: "+201 since last hour",
    icon: TrendingUp,
    trend: "up"
  }
];

export const SALES_DATA = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 2800 },
  { name: "Jun", total: 3200 },
  { name: "Jul", total: 4500 },
  { name: "Aug", total: 4100 },
  { name: "Sep", total: 5200 },
  { name: "Oct", total: 4800 },
  { name: "Nov", total: 6100 },
  { name: "Dec", total: 7200 },
];

export const RECENT_ORDERS = [
  {
    id: "ORD-001",
    customer: "Liam Johnson",
    email: "liam@example.com",
    amount: "$250.00",
    status: "Completed",
    date: "2023-06-23",
  },
  {
    id: "ORD-002",
    customer: "Olivia Smith",
    email: "olivia@example.com",
    amount: "$150.00",
    status: "Processing",
    date: "2023-06-24",
  },
  {
    id: "ORD-003",
    customer: "Noah Williams",
    email: "noah@example.com",
    amount: "$350.00",
    status: "Completed",
    date: "2023-06-25",
  },
  {
    id: "ORD-004",
    customer: "Emma Brown",
    email: "emma@example.com",
    amount: "$450.00",
    status: "Pending",
    date: "2023-06-26",
  },
  {
    id: "ORD-005",
    customer: "Ava Jones",
    email: "ava@example.com",
    amount: "$550.00",
    status: "Completed",
    date: "2023-06-27",
  },
];

export const INVENTORY = [
  {
    id: "INV-001",
    name: "Mechanical Keyboard",
    sku: "MK-87-RGB",
    stock: 45,
    status: "In Stock",
    price: "$129.99"
  },
  {
    id: "INV-002",
    name: "Wireless Mouse",
    sku: "WM-PRO-X",
    stock: 12,
    status: "Low Stock",
    price: "$79.99"
  },
  {
    id: "INV-003",
    name: "27\" 4K Monitor",
    sku: "MON-4K-IPS",
    stock: 0,
    status: "Out of Stock",
    price: "$499.99"
  },
  {
    id: "INV-004",
    name: "USB-C Hub",
    sku: "USB-C-7IN1",
    stock: 89,
    status: "In Stock",
    price: "$49.99"
  },
];
