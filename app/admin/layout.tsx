import { AdminSideMenu } from "@/components/admin-side-menu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 border-r">
        <AdminSideMenu />
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
