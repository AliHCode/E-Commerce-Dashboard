import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/LogoIcon";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    login(email);
    navigate("/");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Premium Light Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.08),transparent_50%)] pointer-events-none" />

      {/* Animated subtle grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none mix-blend-overlay" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] relative z-10 bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
      >
        <div className="mb-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center justify-center mb-2">
              <LogoIcon className="w-10 h-10 text-slate-900 -mr-1" />
              <h1 className="text-4xl font-sans font-bold tracking-tight text-slate-900 leading-none">
                ether
              </h1>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              Sign in to your enterprise dashboard
            </p>
          </motion.div>
        </div>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 shadow-sm"
                placeholder="name@aether.io"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <a href="#" className="text-xs text-primary-600 hover:text-primary-700 transition-colors font-medium">Forgot password?</a>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2 pb-4">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <div className="relative w-5 h-5 rounded-md border border-slate-300 bg-white flex items-center justify-center transition-colors group-hover:border-primary-500">
                <input type="checkbox" className="peer appearance-none absolute inset-0 rounded-md cursor-pointer" />
                <div className="w-2.5 h-2.5 bg-primary-500 rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-200" />
              </div>
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-medium">Remember me for 30 days</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/30 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center text-xs text-slate-500 mt-8 font-medium space-x-2"
        >
          <span className="hover:text-slate-800 cursor-pointer transition-colors">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-slate-800 cursor-pointer transition-colors">Terms of Service</span>
        </motion.p>
      </motion.div>
    </div>
  );
}
