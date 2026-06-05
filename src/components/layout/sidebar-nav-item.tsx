"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NavigationItem } from "@/types/navigation";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  item: NavigationItem;
  onLinkClick?: () => void;
}

export function SidebarNavItem({ item, onLinkClick }: SidebarNavItemProps) {
  const pathname = usePathname();
  const hasSubItems = !!item.items && item.items.length > 0;
  
  // Determine if any sub-item is active
  const isChildActive = hasSubItems
    ? item.items!.some((sub) => pathname === sub.href || pathname.startsWith(sub.href + "/"))
    : false;
    
  // Determine if direct link is active
  const isDirectActive = item.href ? pathname === item.href || pathname.startsWith(item.href + "/") : false;
  
  const isActive = isDirectActive || isChildActive;
  
  const [isOpen, setIsOpen] = useState(isChildActive);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Sync open state when path changes (during render)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (isChildActive) {
      setIsOpen(true);
    }
  }

  const toggleOpen = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const itemContent = (
    <>
      <div className="flex items-center gap-3">
        {item.icon && (
          <DynamicIcon
            name={item.icon}
            className={cn(
              "h-5 w-5 transition-colors duration-200",
              isActive ? "text-[#d97706]" : "text-emerald-300/60 group-hover:text-emerald-100"
            )}
          />
        )}
        <span className="font-medium">{item.title}</span>
      </div>
      {hasSubItems && (
        isOpen ? (
          <ChevronDown className="h-4 w-4 text-emerald-300/60" />
        ) : (
          <ChevronRight className="h-4 w-4 text-emerald-300/60" />
        )
      )}
    </>
  );

  const baseClasses = cn(
    "group flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer mb-1",
    isActive 
      ? "bg-emerald-900/50 text-white font-medium border-l-4 border-[#d97706] pl-3" 
      : "text-emerald-100/70 hover:text-white hover:bg-emerald-900/30"
  );

  return (
    <div className="w-full">
      {item.href ? (
        <Link href={item.href} className={baseClasses} onClick={onLinkClick}>
          {itemContent}
        </Link>
      ) : (
        <button onClick={toggleOpen} className={cn(baseClasses, "w-full text-left")}>
          {itemContent}
        </button>
      )}

      {hasSubItems && isOpen && (
        <div className="mt-1 ml-4 pl-4 border-l border-emerald-800/40 space-y-1">
          {item.items!.map((subItem, index) => {
            const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href + "/");
            return (
              <Link
                key={index}
                href={subItem.href}
                onClick={onLinkClick}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all duration-200",
                  isSubActive
                    ? "bg-emerald-900/30 text-white font-medium text-[#d97706]"
                    : "text-emerald-200/50 hover:text-white hover:bg-emerald-900/20"
                )}
              >
                {subItem.icon && (
                  <DynamicIcon
                    name={subItem.icon}
                    className={cn(
                      "h-3.5 w-3.5",
                      isSubActive ? "text-[#d97706]" : "text-emerald-300/40"
                    )}
                  />
                )}
                <span>{subItem.title}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
