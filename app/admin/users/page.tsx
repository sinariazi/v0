import { UserManagement } from '@/components/user-management'

export default function UserManagementPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">User Management</h1>
      <UserManagement />
    </div>
  )
}

