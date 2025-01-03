"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Users,
  ClipboardList,
  BarChart,
  Home,
  Zap,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Surveys",
    href: "/admin/surveys",
    icon: ClipboardList,
  },
  {
    title: "Insights",
    href: "/admin/insights",
    icon: BarChart,
  },
  {
    title: "Billing",
    href: "/admin/billing",
    icon: CreditCard,
  },
  {
    title: "Subscription",
    href: "/subscription",
    icon: Zap,
  },
];

export function AdminSideMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="h-full py-6">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Admin Panel
          </h2>
          <nav className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "bg-muted hover:bg-muted"
                )}
                onClick={() => handleNavClick(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
