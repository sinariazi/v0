"use client";

import { UserManagement } from "@/components/user-management/UserManagement";
import { useLanguage } from "@/lib/language-context";
import { memo } from "react";
const MemoizedUserManagement = memo(UserManagement);

export default function UserManagementPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">
        {t("adminSideMenu.userManagement")}
      </h1>
      <MemoizedUserManagement />
    </div>
  );
}
