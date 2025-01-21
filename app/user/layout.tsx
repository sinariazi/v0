import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/user-side-menu";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <UserSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto py-6 px-4 md:px-6">
              {children}
            </div>
          </main>
          <footer className="bg-background border-t p-4 text-center">
            <p>&copy; 2023 Mood Whisper. All rights reserved.</p>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
