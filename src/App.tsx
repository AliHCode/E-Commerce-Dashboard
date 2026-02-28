import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings as SettingsIcon,
  Search,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Contexts
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { DataProvider, useData } from "@/contexts/DataContext";

// Components
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LogoIcon } from "@/components/LogoIcon";
import { NotificationPanel } from "@/components/NotificationPanel";

// Pages
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Orders } from "@/pages/Orders";
import { OrderDetails } from "@/pages/OrderDetails";
import { Products } from "@/pages/Products";
import { Customers } from "@/pages/Customers";
import { Settings } from "@/pages/Settings";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Search debounce
  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults(null); setSearchOpen(false); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setSearchOpen(true);
        }
      } catch (e) { /* silent */ }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, token]);

  const handleSearchClick = (path: string) => {
    navigate(path);
    setSearchQuery("");
    setSearchOpen(false);
  };

  return (
    <div className={cn(
      "min-h-screen font-sans flex transition-colors duration-300 relative overflow-hidden",
      isDark ? 'bg-[#030712] text-slate-100' : 'bg-slate-50 text-slate-900'
    )}>
      {/* Background ambient light effects for dark mode */}
      {isDark && (
        <>
          <div className="absolute top-0 left-0 w-full h-[500px] bg-primary-900/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent-500/5 blur-[150px] rounded-full pointer-events-none translate-y-1/3 translate-x-1/3"></div>
        </>
      )}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] lg:translate-x-0 lg:static lg:flex lg:flex-col lg:h-[calc(100vh-2rem)] lg:m-4 lg:rounded-2xl lg:shadow-2xl",
        isDark
          ? 'bg-slate-900/80 backdrop-blur-xl border-slate-800 lg:border'
          : 'bg-white/90 backdrop-blur-xl border-slate-200 lg:border shadow-sm',
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 sm:h-20 items-center px-6 sm:px-8">
          <div className="flex items-center font-bold text-xl tracking-tight">
            <LogoIcon className={cn("w-7 h-7 -mr-0.5", isDark ? 'text-white' : 'text-slate-900')} />
            <span className={cn(
              "font-sans text-xl sm:text-2xl tracking-tight font-bold",
              isDark ? 'text-white' : 'text-slate-900'
            )}>
              ether
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto lg:hidden text-slate-500 hover:text-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 sm:py-6 px-3 sm:px-4 space-y-1.5 scrollbar-thin">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === "/"} onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/orders" icon={ShoppingCart} label="Orders" active={location.pathname.startsWith("/orders")} onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/products" icon={Package} label="Products" active={location.pathname.startsWith("/products")} onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/customers" icon={Users} label="Customers" active={location.pathname.startsWith("/customers")} onClick={() => setIsSidebarOpen(false)} />

          <div className="pt-6 sm:pt-8 pb-3 px-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Settings & Prefs</p>
          </div>
          <NavItem to="/settings" icon={SettingsIcon} label="Settings" active={location.pathname === "/settings"} onClick={() => setIsSidebarOpen(false)} />
        </div>

        <div className={cn(
          "p-4 sm:p-5 m-3 sm:m-4 rounded-xl backdrop-blur-md",
          isDark ? 'bg-white/[0.03] border border-white/[0.05]' : 'bg-slate-100/50 border border-slate-200'
        )}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full ring-2 ring-primary-500/20 bg-primary-500/10 flex items-center justify-center text-sm font-bold text-primary-600 shrink-0">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-semibold truncate", isDark ? 'text-slate-100' : 'text-slate-900')}>
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email || "user@example.com"}</p>
            </div>
            <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 z-10 lg:my-4 lg:mr-4">
        {/* Header */}
        <header className={cn(
          "h-14 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 transition-all duration-200 backdrop-blur-md pt-2 lg:pt-0",
          isDark ? 'bg-[#030712]/70 border-b lg:border-none border-slate-800' : 'bg-slate-50/70 border-b lg:border-none border-slate-200 lg:bg-transparent',
          "lg:bg-transparent lg:rounded-2xl lg:mx-4"
        )}>
          <div className="flex items-center gap-3 sm:gap-4 w-full max-w-xl">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div ref={searchRef} className="relative hidden md:block w-full">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, products, customers..."
                className={cn(
                  "w-full h-10 pl-10 pr-4 rounded-full text-sm focus:outline-none transition-all duration-300 shadow-sm",
                  isDark
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:bg-slate-800 focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50'
                    : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
                )}
              />
              {/* Search Results Dropdown */}
              {searchOpen && searchResults && (
                <div className={cn(
                  "absolute top-12 left-0 right-0 rounded-xl border shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto",
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                )}>
                  {searchResults.orders?.length > 0 && (
                    <div>
                      <p className={cn("px-4 py-2 text-[10px] uppercase font-bold tracking-wider", isDark ? 'text-slate-500 bg-slate-800/50' : 'text-gray-400 bg-gray-50')}>Orders</p>
                      {searchResults.orders.map((o: any) => (
                        <div key={o.id} onClick={() => handleSearchClick(`/orders/${o.id}`)} className={cn("px-4 py-2.5 cursor-pointer text-sm flex justify-between", isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50')}>
                          <span className="font-medium">{o.id}</span>
                          <span className={cn("text-xs", isDark ? 'text-slate-400' : 'text-gray-500')}>{o.customer} · {o.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.products?.length > 0 && (
                    <div>
                      <p className={cn("px-4 py-2 text-[10px] uppercase font-bold tracking-wider", isDark ? 'text-slate-500 bg-slate-800/50' : 'text-gray-400 bg-gray-50')}>Products</p>
                      {searchResults.products.map((p: any) => (
                        <div key={p.id} onClick={() => handleSearchClick('/products')} className={cn("px-4 py-2.5 cursor-pointer text-sm flex justify-between", isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50')}>
                          <span className="font-medium">{p.name}</span>
                          <span className={cn("text-xs", isDark ? 'text-slate-400' : 'text-gray-500')}>{p.sku} · {p.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.customers?.length > 0 && (
                    <div>
                      <p className={cn("px-4 py-2 text-[10px] uppercase font-bold tracking-wider", isDark ? 'text-slate-500 bg-slate-800/50' : 'text-gray-400 bg-gray-50')}>Customers</p>
                      {searchResults.customers.map((c: any) => (
                        <div key={c.id} onClick={() => handleSearchClick('/customers')} className={cn("px-4 py-2.5 cursor-pointer text-sm flex justify-between", isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50')}>
                          <span className="font-medium">{c.name}</span>
                          <span className={cn("text-xs", isDark ? 'text-slate-400' : 'text-gray-500')}>{c.email}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {!searchResults.orders?.length && !searchResults.products?.length && !searchResults.customers?.length && (
                    <div className={cn("py-6 text-center text-sm", isDark ? 'text-slate-500' : 'text-gray-400')}>No results found</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <NotificationPanel />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-3 pb-4 pt-2 sm:px-4 lg:px-8 lg:pb-8 lg:pt-2 relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false, to, onClick }: { icon: any, label: string, active?: boolean, to: string, onClick?: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group overflow-hidden",
        active
          ? isDark
            ? "text-primary-300 bg-primary-500/10 shadow-[inset_0_0_0_1px_rgba(20,184,166,0.2)]"
            : "text-primary-700 bg-primary-50 shadow-[inset_0_0_0_1px_rgba(20,184,166,0.2)]"
          : isDark
            ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
      )}
    >
      {active && isDark && (
        <span className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent pointer-events-none" />
      )}
      {active && (
        <span className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full shadow-[0_0_10px_rgba(20,184,166,0.5)]",
          isDark ? "bg-primary-400" : "bg-primary-500"
        )} />
      )}
      <Icon className={cn(
        "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
        active ? (isDark ? "text-primary-400" : "text-primary-600") : "opacity-70"
      )} />
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
