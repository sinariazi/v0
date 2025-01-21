"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  FileText,
  User,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

interface MenuItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const menuItems: MenuItem[] = [
  { href: "/user", label: "Dashboard", icon: LayoutDashboard },
  { href: "/user/insights", label: "Insights", icon: LineChart },
  { href: "/user/surveys", label: "Surveys", icon: FileText },
  { href: "/user/profile", label: "Profile", icon: User },
  { href: "/user/settings", label: "Settings", icon: Settings },
];

export function UserSidebar() {
  const pathname = usePathname();
  const { toggleSidebar, isMobile } = useSidebar();

  const handleItemClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-2xl font-bold px-4 py-2">User Area</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    onClick={handleItemClick}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 w-full px-4 py-2 rounded",
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
