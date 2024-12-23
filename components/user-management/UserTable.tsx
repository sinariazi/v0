import React, { useContext, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserManagementContext } from './UserManagementContext'
import { User, UserRole, Gender } from './types'

export function UserTable() {
  const { state, dispatch, handleUpdateUser, handleRemoveUser } = useContext(UserManagementContext);

  const filteredUsers = useMemo(() => {
    return state.users.filter((user) =>
      (user.firstName?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
       user.lastName?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
       user.cognitoUsername?.toLowerCase().includes(state.searchTerm.toLowerCase())) ?? false
    );
  }, [state.users, state.searchTerm]);

  return (
    <>
      <Input
        placeholder="Search users..."
        value={state.searchTerm}
        onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>User ID (Sub)</TableHead>
            <TableHead>Email Verified</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Organization ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.firstName} {user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value: UserRole) => handleUpdateUser({ ...user, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{user.cognitoSub}</TableCell>
              <TableCell>{user.emailVerified ? 'Yes' : 'No'}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>
                <Select
                  value={user.gender}
                  onValueChange={(value: Gender) => handleUpdateUser({ ...user, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  value={user.team || ''}
                  onChange={(e) => handleUpdateUser({ ...user, team: e.target.value })}
                />
              </TableCell>
              <TableCell>{user.organizationId}</TableCell>
              <TableCell>
                <Button onClick={() => dispatch({ type: 'SET_EDITING_USER', payload: user })} className="mr-2">Edit</Button>
                <Button onClick={() => handleRemoveUser(user.id)} variant="destructive">Remove</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

