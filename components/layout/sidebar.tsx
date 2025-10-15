"use client"

import { Command, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { metaConfig } from "@/config/metaConfig"
import { sidebarItems } from "@/lib/navigation"
import { NavMain } from "@/components/layout/nav-items"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/userContext"
import { useRouter } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { setToken } = useUser();
    const router = useRouter();
    const handleLogout = () => {
        setToken("")
        router.push("/login");
      };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/dashboard">
                <Command />
                <span className="text-base font-semibold">{metaConfig.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Button variant="secondary" size="lg" className="text-red-500 justify-normal" onClick={handleLogout}>
                <LogOut /> 
                <span>Logout</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}