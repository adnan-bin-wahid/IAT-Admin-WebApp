import { NavigationItem } from "@/types/navigation";

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Content Management",
    icon: "FolderTree",
    items: [
      {
        title: "Dua Library",
        href: "/dua",
        icon: "BookOpen",
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings",
  },
];
