"use client";

import { usePathname } from "next/navigation";
import { Menu, Search, Sun, Bell, User } from "lucide-react";


interface AdminTopbarProps {
  onMenuClick: () => void;
}

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/dua")) return "Dua Library";
    if (path.startsWith("/settings")) return "Settings";
    return "Admin Portal";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 shadow-sm">
      {/* Left side: Hamburger (mobile) & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 hover:bg-slate-50 lg:hidden text-slate-500 hover:text-slate-700 focus:outline-none"
          aria-label="Open Sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-[#022c22]">
          {getPageTitle(pathname)}
        </h1>
      </div>

      {/* Right side: Search, Theme Toggle, Notification, User Profile */}
      <div className="flex items-center gap-4">
        {/* Search Input (desktop placeholder) */}
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-1 focus:ring-emerald-700/20"
            disabled
          />
        </div>

        {/* Theme Toggle Placeholder */}
        <button
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 border border-transparent hover:border-slate-100"
          title="Theme Toggle"
          disabled
        >
          <Sun className="h-5 w-5" />
        </button>

        {/* Notification Placeholder */}
        <button
          className="relative rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 border border-transparent hover:border-slate-100"
          title="Notifications"
          disabled
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
        </button>

        {/* Admin Profile Placeholder */}
        <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-700">Admin User</span>
            <span className="text-[10px] text-slate-400">Owner</span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-[#022c22]/5 border border-slate-100 flex items-center justify-center text-[#022c22] font-semibold text-sm">
            <User className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>
    </header>
  );
}
