import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, Lock, User, Globe, CreditCard, Palette } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <button className="h-9 px-4 rounded-md bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors">
          Save Changes
        </button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Update your account's profile information and email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  defaultValue="Alex"
                  className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  defaultValue="Morgan"
                  className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                defaultValue="alex@aether.io"
                className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <textarea
                className="w-full h-24 px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                defaultValue="Product Manager at Aether Inc. Love building great user experiences."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-600" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive emails about your account activity.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-500">Receive push notifications on your device.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary-600" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>
              Customize the look and feel of the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div
                onClick={() => setTheme('light')}
                className="space-y-2 cursor-pointer group"
              >
                <div className={cn(
                  "h-24 rounded-lg bg-white border-2 shadow-sm transition-all",
                  theme === 'light' ? 'border-primary-600 ring-2 ring-primary-600/20' : 'border-gray-200 group-hover:border-gray-300'
                )}></div>
                <p className={cn(
                  "text-center text-xs font-medium",
                  theme === 'light' ? 'text-primary-600' : 'text-gray-500'
                )}>Light</p>
              </div>
              <div
                onClick={() => setTheme('dark')}
                className="space-y-2 cursor-pointer group"
              >
                <div className={cn(
                  "h-24 rounded-lg bg-slate-950 border-2 shadow-sm transition-all",
                  theme === 'dark' ? 'border-primary-600 ring-2 ring-primary-600/20' : 'border-transparent group-hover:border-gray-300'
                )}></div>
                <p className={cn(
                  "text-center text-xs font-medium",
                  theme === 'dark' ? 'text-primary-600' : 'text-gray-500'
                )}>Dark</p>
              </div>
              <div
                onClick={() => setTheme('system')}
                className="space-y-2 cursor-pointer group"
              >
                <div className={cn(
                  "h-24 rounded-lg bg-gray-100 border-2 shadow-sm flex items-center justify-center transition-all",
                  theme === 'system' ? 'border-primary-600 ring-2 ring-primary-600/20' : 'border-transparent group-hover:border-gray-300'
                )}>
                  <span className="text-xs text-gray-400">Auto</span>
                </div>
                <p className={cn(
                  "text-center text-xs font-medium",
                  theme === 'system' ? 'text-primary-600' : 'text-gray-500'
                )}>System</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
