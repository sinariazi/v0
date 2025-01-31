"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import type * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

interface MenuItem {
  href: string;
  label: string;
  icon: IconName;
}

interface AppSidebarProps {
  menuItems: MenuItem[];
  sectionTitle: string;
}

export function AppSidebar({ menuItems, sectionTitle }: AppSidebarProps) {
  const pathname = usePathname();
  const { toggleSidebar, isMobile } = useSidebar();

  const handleItemClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{sectionTitle}</SidebarGroupLabel>
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
                      <Icon name={item.icon} className="w-5 h-5" />
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
