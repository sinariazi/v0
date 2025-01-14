import { UserSideMenu } from "@/components/user-side-menu";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-100 border-r">
          <UserSideMenu />
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
