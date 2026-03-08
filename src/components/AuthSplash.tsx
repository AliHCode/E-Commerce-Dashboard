import React from "react";
import { LogoIcon } from "@/components/LogoIcon";

export function AuthSplash() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center">
          <LogoIcon className="w-10 h-10 text-slate-900 -mr-1" />
          <span className="text-4xl font-sans font-bold tracking-tight text-slate-900 leading-none">ether</span>
        </div>
        <div className="w-28 h-1 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
          <div className="h-full w-1/2 rounded-full bg-primary-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
