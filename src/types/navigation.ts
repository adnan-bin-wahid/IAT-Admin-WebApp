export interface NavigationSubItem {
  title: string;
  href: string;
  icon?: string;
}

export interface NavigationItem {
  title: string;
  href?: string;
  icon?: string;
  items?: NavigationSubItem[];
}
