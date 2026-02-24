import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings as SettingsIcon,
  Bell,
  Search,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Contexts
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { DataProvider } from "@/contexts/DataContext";

// Components
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LogoIcon } from "@/components/LogoIcon";

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
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  return (
    <div className={cn(
      "min-h-screen font-sans flex transition-colors duration-300 relative overflow-hidden",
      theme === 'dark' ? 'bg-[#030712] text-slate-100' : 'bg-slate-50 text-slate-900'
    )}>
      {/* Background ambient light effects for dark mode */}
      {theme === 'dark' && (
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

      {/* Sidebar - Floating style on desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] lg:translate-x-0 lg:static lg:flex lg:flex-col lg:h-[calc(100vh-2rem)] lg:m-4 lg:rounded-2xl lg:shadow-2xl",
        theme === 'dark'
          ? 'bg-slate-900/80 backdrop-blur-xl border-slate-800 lg:border'
          : 'bg-white/90 backdrop-blur-xl border-slate-200 lg:border shadow-sm',
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-20 items-center px-8">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
            <LogoIcon className={cn("w-8 h-8", theme === 'dark' ? 'text-white' : 'text-slate-900')} />
            <span className={cn(
              "font-sans text-2xl tracking-tight font-bold",
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            )}>
              Aether
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto lg:hidden text-slate-500 hover:text-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-thin">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === "/"} onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/orders" icon={ShoppingCart} label="Orders" active={location.pathname.startsWith("/orders")} onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/products" icon={Package} label="Products" active={location.pathname.startsWith("/products")} onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/customers" icon={Users} label="Customers" active={location.pathname.startsWith("/customers")} onClick={() => setIsSidebarOpen(false)} />

          <div className="pt-8 pb-3 px-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Settings & Prefs</p>
          </div>
          <NavItem to="/settings" icon={SettingsIcon} label="Settings" active={location.pathname === "/settings"} onClick={() => setIsSidebarOpen(false)} />
        </div>

        <div className={cn(
          "p-5 m-4 rounded-xl backdrop-blur-md",
          theme === 'dark' ? 'bg-white/[0.03] border border-white/[0.05]' : 'bg-slate-100/50 border border-slate-200'
        )}>
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || "https://picsum.photos/seed/avatar/100/100"}
              alt="User"
              className="w-10 h-10 rounded-full ring-2 ring-primary-500/20 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-semibold truncate", theme === 'dark' ? 'text-slate-100' : 'text-slate-900')}>
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
        {/* Header - Floating minimalist style */}
        <header className={cn(
          "h-20 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 transition-all duration-200 backdrop-blur-md",
          theme === 'dark' ? 'bg-[#030712]/70 border-b lg:border-none border-slate-800' : 'bg-slate-50/70 border-b lg:border-none border-slate-200 lg:bg-transparent',
          "lg:bg-transparent lg:rounded-2xl lg:mt-2 lg:mx-4"
        )}>
          <div className="flex items-center gap-4 w-full max-w-xl">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden md:block w-full">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources, orders, or data..."
                className={cn(
                  "w-full h-10 pl-10 pr-4 rounded-full text-sm focus:outline-none transition-all duration-300 shadow-sm",
                  theme === 'dark'
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:bg-slate-800 focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50'
                    : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
                )}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className={cn(
              "relative p-2.5 rounded-full transition-colors flex items-center justify-center border",
              theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800 bg-slate-900/50' : 'text-slate-500 hover:text-slate-900 hover:bg-white border-slate-200 bg-white/50 shadow-sm'
            )}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)]"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
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

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group overflow-hidden",
        active
          ? theme === 'dark'
            ? "text-primary-300 bg-primary-500/10 shadow-[inset_0_0_0_1px_rgba(20,184,166,0.2)]"
            : "text-primary-700 bg-primary-50 shadow-[inset_0_0_0_1px_rgba(20,184,166,0.2)]"
          : theme === 'dark'
            ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
      )}
    >
      {active && theme === 'dark' && (
        <span className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent pointer-events-none" />
      )}
      {active && (
        <span className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full shadow-[0_0_10px_rgba(20,184,166,0.5)]",
          theme === 'dark' ? "bg-primary-400" : "bg-primary-500"
        )} />
      )}
      <Icon className={cn(
        "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
        active ? (theme === 'dark' ? "text-primary-400" : "text-primary-600") : "opacity-70"
      )} />
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
