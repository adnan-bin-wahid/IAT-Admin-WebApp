"use client";

import { X } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className={cn("fixed inset-0 z-50 lg:hidden", isOpen ? "visible" : "invisible")}>
      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sidebar drawer container */}
      <div
        className={cn(
          "fixed bottom-0 top-0 left-0 z-50 w-72 max-w-[80vw] transition-transform duration-300 ease-in-out flex flex-col shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close Button overlay inside the sidebar */}
        <div className="absolute right-4 top-4 z-50 lg:hidden">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900/60 hover:text-white transition-all outline-none"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1">
          <AdminSidebar onLinkClick={onClose} />
        </div>
      </div>
    </div>
  );
}
