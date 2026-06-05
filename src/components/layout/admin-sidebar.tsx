import { navigationItems } from "@/lib/nav-items";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SITE_CONFIG } from "@/lib/constants";
import { Moon } from "lucide-react";

interface AdminSidebarProps {
  onLinkClick?: () => void;
}

export function AdminSidebar({ onLinkClick }: AdminSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-emerald-950 text-white border-r border-emerald-900/40">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-emerald-900/40">
        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 shadow-md">
          <Moon className="h-5 w-5 text-emerald-950 fill-emerald-950" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-wide text-white">
            {SITE_CONFIG.name}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-amber-500 font-bold">
            {SITE_CONFIG.subName}
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {navigationItems.map((item, index) => (
          <SidebarNavItem key={index} item={item} onLinkClick={onLinkClick} />
        ))}
      </div>

      {/* Footer / User Profile Summary */}
      <div className="p-4 border-t border-emerald-900/40 bg-emerald-950/80">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="h-8 w-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-sm">
            A
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold text-emerald-50 truncate">Administrator</span>
            <span className="text-[10px] text-emerald-300/60 truncate">admin@amaltracker.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
