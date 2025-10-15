import {
    Users,
    LayoutDashboard,
    Gauge,
    Network,
    TrendingUp,
    Flame,
    type LucideIcon,
  } from "lucide-react"
  
  export interface NavSubItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    comingSoon?: boolean;
    newTab?: boolean;
    isNew?: boolean;
  }
  
  export interface NavMainItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    subItems?: NavSubItem[];
    comingSoon?: boolean;
    newTab?: boolean;
    isNew?: boolean;
  }
  
  export interface NavGroup {
    id: number;
    label?: string;
    items: NavMainItem[];
  }
  
  export const sidebarItems: NavGroup[] = [
    {
      id: 1,
      //label: "Dashboards",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Users",
          url: "/users",
          icon: Users,
        },
        {
          title: "Pool Users",
          url: "/pool-users",
          icon: Network,
        },
        {
          title: "Transactions",
          url: "/transactions",
          icon: Gauge,
        },
        {
          title: "Investment History",
          url: "/investments",
          icon: TrendingUp,
        },
        {
          title: "Burning Coins",
          url: "/burning",
          icon: Flame,
        },
      ],
    },
  ];