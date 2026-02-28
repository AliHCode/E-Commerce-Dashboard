import { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, ShoppingBag, AlertCircle, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface Notification {
    id: number;
    message: string;
    type: string;
    read: boolean;
    created_at: string;
}

export function NotificationPanel() {
    const { token } = useAuth();
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const panelRef = useRef<HTMLDivElement>(null);
    const isDark = theme === 'dark';

    useEffect(() => {
        if (!token) return;
        const fetchNotifications = async () => {
            try {
                const res = await fetch('/api/notifications', { headers: { 'Authorization': `Bearer ${token}` } });
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data.notifications);
                    setUnreadCount(data.unreadCount);
                }
            } catch (e) { /* silent */ }
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: number) => {
        try {
            await fetch(`/api/notifications/${id}/read`, {
                method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
            setUnreadCount(c => Math.max(0, c - 1));
        } catch (e) { /* silent */ }
    };

    const markAllRead = async () => {
        try {
            await fetch('/api/notifications/read-all', {
                method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(n => n.map(x => ({ ...x, read: true })));
            setUnreadCount(0);
        } catch (e) { /* silent */ }
    };

    const getIcon = (type: string) => {
        if (type === 'order') return <ShoppingBag className="w-4 h-4 text-primary-500" />;
        if (type === 'error') return <AlertCircle className="w-4 h-4 text-red-500" />;
        return <Info className="w-4 h-4 text-blue-500" />;
    };

    const timeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div ref={panelRef} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    "relative p-2.5 rounded-full transition-colors flex items-center justify-center border",
                    isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800 bg-slate-900/50' : 'text-slate-500 hover:text-slate-900 hover:bg-white border-slate-200 bg-white/50 shadow-sm'
                )}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(139,92,246,0.8)]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className={cn(
                    "absolute right-0 top-12 w-80 sm:w-96 rounded-xl border shadow-2xl z-50 overflow-hidden",
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                )}>
                    <div className={cn("flex items-center justify-between px-4 py-3 border-b", isDark ? 'border-slate-800' : 'border-slate-100')}>
                        <h3 className="text-sm font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                            </button>
                        )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className={cn("py-8 text-center text-sm", isDark ? 'text-slate-500' : 'text-gray-400')}>
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => !n.read && markAsRead(n.id)}
                                    className={cn(
                                        "flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer border-b last:border-0",
                                        isDark ? 'border-slate-800' : 'border-slate-50',
                                        !n.read && (isDark ? 'bg-primary-500/5' : 'bg-primary-50/50'),
                                        isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'
                                    )}
                                >
                                    <div className="mt-0.5">{getIcon(n.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn("text-sm leading-snug", !n.read && 'font-medium')}>{n.message}</p>
                                        <p className={cn("text-xs mt-1", isDark ? 'text-slate-500' : 'text-gray-400')}>{timeAgo(n.created_at)}</p>
                                    </div>
                                    {!n.read && <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
