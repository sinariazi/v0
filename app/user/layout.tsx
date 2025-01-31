import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <header className="bg-background border-b p-4">
          <h1 className="text-2xl font-bold">Mood Whisper</h1>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar
            sectionTitle="User Menu"
            menuItems={[
              { href: "/user", label: "Dashboard", icon: "LayoutDashboard" },
              { href: "/user/insights", label: "Insights", icon: "LineChart" },
              { href: "/user/surveys", label: "Surveys", icon: "FileText" },
              { href: "/user/profile", label: "Profile", icon: "User" },
              { href: "/user/settings", label: "Settings", icon: "Settings" },
            ]}
          />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
        <footer className="bg-background border-t p-4 text-center">
          <p>&copy; 2023 Mood Whisper. All rights reserved.</p>
        </footer>
      </div>
    </SidebarProvider>
  );
}
