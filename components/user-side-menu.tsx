"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { User, Calendar, BarChart, ClipboardList } from "lucide-react";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/user/profile",
    icon: User,
  },
  {
    title: "1-on-1 Sessions",
    href: "/user/sessions",
    icon: Calendar,
  },
  {
    title: "Insights",
    href: "/user/insights",
    icon: BarChart,
  },
  {
    title: "Surveys",
    href: "/user/surveys",
    icon: ClipboardList,
  },
];

export function UserSideMenu() {
  const pathname = usePathname();

  return (
    <div className="h-full py-6">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            User Area
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
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
