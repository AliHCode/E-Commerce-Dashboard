import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, User, Palette, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, updateProfile, changePassword } = useAuth();
  const isDark = theme === 'dark';

  const nameParts = (user?.name || "").split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  const cardClass = isDark ? 'bg-slate-900/80 text-slate-100 border-slate-800' : '';
  const inputClass = isDark
    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500'
    : 'border-gray-200 text-slate-900 bg-white';
  const labelClass = isDark ? 'text-slate-300' : 'text-gray-700';
  const descClass = isDark ? 'text-slate-400' : '';
  const dividerClass = isDark ? 'border-slate-700' : 'border-gray-100';

  const handleProfileSave = async () => {
    setProfileMsg(null);
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName) { setProfileMsg({ type: 'error', text: 'Name is required.' }); return; }
    if (!email.trim()) { setProfileMsg({ type: 'error', text: 'Email is required.' }); return; }
    setProfileLoading(true);
    try {
      await updateProfile(fullName, email.trim());
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message });
    } finally {
      setProfileLoading(false);
      setTimeout(() => setProfileMsg(null), 4000);
    }
  };

  const handlePasswordChange = async () => {
    setPwMsg(null);
    if (!currentPassword) { setPwMsg({ type: 'error', text: 'Current password is required.' }); return; }
    if (newPassword.length < 6) { setPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' }); return; }
    if (newPassword !== confirmPassword) { setPwMsg({ type: 'error', text: 'Passwords do not match.' }); return; }
    setPwLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPwMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      setPwMsg({ type: 'error', text: err.message });
    } finally {
      setPwLoading(false);
      setTimeout(() => setPwMsg(null), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Settings</h1>

      <div className="grid gap-4 sm:gap-6">
        {/* Profile */}
        <Card className={cardClass}>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              <CardTitle className="text-sm sm:text-base">Profile Information</CardTitle>
            </div>
            <CardDescription className={descClass}>
              Update your account's profile information and email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
            {profileMsg && (
              <div className={cn("p-3 rounded-lg text-sm font-medium flex items-center gap-2", profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200')}>
                {profileMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {profileMsg.text}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", labelClass)}>First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass)} />
              </div>
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", labelClass)}>Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={cn("text-sm font-medium", labelClass)}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass)} />
            </div>
            <div className="space-y-2">
              <label className={cn("text-sm font-medium", labelClass)}>Role</label>
              <input type="text" defaultValue="Admin" disabled
                className={cn("w-full h-9 px-3 rounded-md border text-sm cursor-not-allowed opacity-70", isDark ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-gray-50 border-gray-200 text-gray-500')} />
            </div>
            <button onClick={handleProfileSave} disabled={profileLoading}
              className="h-9 px-4 rounded-md bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors disabled:opacity-60 flex items-center gap-2">
              {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
            </button>
          </CardContent>
        </Card>

        {/* Password */}
        <Card className={cardClass}>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary-600" />
              <CardTitle className="text-sm sm:text-base">Change Password</CardTitle>
            </div>
            <CardDescription className={descClass}>
              Ensure your account is using a secure password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
            {pwMsg && (
              <div className={cn("p-3 rounded-lg text-sm font-medium flex items-center gap-2", pwMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200')}>
                {pwMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {pwMsg.text}
              </div>
            )}
            <div className="space-y-2">
              <label className={cn("text-sm font-medium", labelClass)}>Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass)} placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", labelClass)}>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass)} placeholder="Min. 6 characters" />
              </div>
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", labelClass)}>Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn("w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", inputClass)} placeholder="••••••••" />
              </div>
            </div>
            <button onClick={handlePasswordChange} disabled={pwLoading}
              className="h-9 px-4 rounded-md bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors disabled:opacity-60 flex items-center gap-2">
              {pwLoading && <Loader2 className="w-4 h-4 animate-spin" />} Update Password
            </button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className={cardClass}>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-600" />
              <CardTitle className="text-sm sm:text-base">Notifications</CardTitle>
            </div>
            <CardDescription className={descClass}>Configure how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className={cn("text-sm font-medium", isDark ? 'text-slate-200' : 'text-gray-900')}>Email Notifications</p>
                <p className={cn("text-xs", isDark ? 'text-slate-500' : 'text-gray-500')}>Receive emails about account activity.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className={cn("w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600", isDark ? 'bg-slate-700 after:border-slate-600' : 'bg-gray-200 after:border-gray-300')}></div>
              </label>
            </div>
            <div className={cn("flex items-center justify-between py-2 border-t", dividerClass)}>
              <div>
                <p className={cn("text-sm font-medium", isDark ? 'text-slate-200' : 'text-gray-900')}>Order Updates</p>
                <p className={cn("text-xs", isDark ? 'text-slate-500' : 'text-gray-500')}>Get notified when order status changes.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className={cn("w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600", isDark ? 'bg-slate-700 after:border-slate-600' : 'bg-gray-200 after:border-gray-300')}></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className={cardClass}>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary-600" />
              <CardTitle className="text-sm sm:text-base">Appearance</CardTitle>
            </div>
            <CardDescription className={descClass}>Customize the look and feel of the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <div key={t} onClick={() => setTheme(t)} className="space-y-2 cursor-pointer group">
                  <div className={cn(
                    "h-16 sm:h-24 rounded-lg border-2 shadow-sm transition-all flex items-center justify-center",
                    t === 'light' ? 'bg-white' : t === 'dark' ? 'bg-slate-950' : (isDark ? 'bg-slate-800' : 'bg-gray-100'),
                    theme === t ? 'border-primary-600 ring-2 ring-primary-600/20' : 'border-transparent group-hover:border-gray-300'
                  )}>
                    {t === 'system' && <span className={cn("text-xs", isDark ? 'text-slate-500' : 'text-gray-400')}>Auto</span>}
                  </div>
                  <p className={cn("text-center text-xs font-medium capitalize", theme === t ? 'text-primary-600' : (isDark ? 'text-slate-400' : 'text-gray-500'))}>{t}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
