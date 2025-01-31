"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import {
  BarChart,
  ClipboardList,
  CreditCard,
  Home,
  Users,
  Zap,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function AdminSideMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const sidebarNavItems = [
    {
      title: t("adminSideMenu.dashboard"),
      href: "/admin",
      icon: Home,
    },
    {
      title: t("adminSideMenu.userManagement"),
      href: "/admin/users",
      icon: Users,
    },
    {
      title: t("adminSideMenu.surveys"),
      href: "/admin/surveys",
      icon: ClipboardList,
    },
    {
      title: t("adminSideMenu.insights"),
      href: "/admin/insights",
      icon: BarChart,
    },
    {
      title: t("adminSideMenu.billing"),
      href: "/admin/billing",
      icon: CreditCard,
    },
    {
      title: t("adminSideMenu.subscription"),
      href: "/subscription",
      icon: Zap,
    },
  ];

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="h-full py-6">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {t("adminSideMenu.title")}
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
