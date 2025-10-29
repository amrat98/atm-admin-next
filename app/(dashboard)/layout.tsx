"use client"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useUser } from "@/lib/userContext"
import { ThemeSwitcher } from "@/components/layout/themeSwitcher"
import { AppSidebar } from "@/components/layout/sidebar"
import { metaConfig } from "@/config/metaConfig"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"


export default function DashboardLayout({children,}: { children: React.ReactNode;}) {
  const {setToken} = useUser();
  const router = useRouter();
  const handleLogout = () => {
    setToken("");
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionToken = sessionStorage.getItem("token");
      sessionStorage.removeItem("email");
      if (!sessionToken) {
        router.push("/login");
        setToken("");
      }
  }
  });
  return (
    <>
    <SidebarProvider defaultOpen>
      <AppSidebar variant="inset" collapsible="icon" />
      <SidebarInset
        data-content-layout="full-width"
        className={cn(
          "data-[content-layout=centered]:!mx-auto data-[content-layout=centered]:max-w-screen-2xl",
          // Adds right margin for inset sidebar in centered layout up to 113rem.
          // On wider screens with collapsed sidebar, removes margin and sets margin auto for alignment.
          "max-[113rem]:peer-data-[variant=inset]:!mr-2 min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:!mr-auto",
        )}
      >
        <header
          data-navbar-style="sticky"
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
            // Handle sticky navbar style with conditional classes so blur, background, z-index, and rounded corners remain consistent across all SidebarVariant layouts.
            "data-[navbar-style=sticky]:bg-background/50 data-[navbar-style=sticky]:sticky data-[navbar-style=sticky]:top-0 data-[navbar-style=sticky]:z-50 data-[navbar-style=sticky]:overflow-hidden data-[navbar-style=sticky]:rounded-t-[inherit] data-[navbar-style=sticky]:backdrop-blur-md",
          )}
        >
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="data-[orientation=vertical]:h-6" />
              <span className="text-sm font-semibold">Admin Panel</span>
              {/* <SearchDialog /> */}
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="icon" variant="outline" aria-label="Logout" onClick={handleLogout}>
                    <LogOut className="text-red-500" />
                </Button>
                </TooltipTrigger>
                <TooltipContent>Logout</TooltipContent>
                </Tooltip>
              
              {/* <AccountSwitcher users={users} /> */}
            </div>
          </div>
        </header>
        <div className="h-full p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
    <div className="flex w-full justify-center md:justify-end p-3 pb-4">
        <div className="text-sm text-muted-foreground">{metaConfig.copyright}</div>
      </div>
    </>
  );
}