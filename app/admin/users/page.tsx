"use client";

import { memo } from "react";
import { UserManagement } from "@/components/user-management";

const MemoizedUserManagement = memo(UserManagement);

export default function UserManagementPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">User Management</h1>
      <MemoizedUserManagement />
    </div>
  );
}
