import React, { useContext, useMemo, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserManagementContext } from "./UserManagementContext";
import { User, UserRole, Gender } from "./types";

export function UserTable() {
  const { state, dispatch, handleUpdateUser, handleRemoveUser } = useContext(
    UserManagementContext,
  );
  const [changedUsers, setChangedUsers] = useState<{ [key: number]: boolean }>(
    {},
  );

  const filteredUsers = useMemo(() => {
    return state.users.filter(
      (user) =>
        (user.firstName
          ?.toLowerCase()
          .includes(state.searchTerm.toLowerCase()) ||
          user.lastName
            ?.toLowerCase()
            .includes(state.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          user.cognitoUsername
            ?.toLowerCase()
            .includes(state.searchTerm.toLowerCase())) ??
        false,
    );
  }, [state.users, state.searchTerm]);

  const handleInputChange = (
    user: User,
    field: keyof User,
    value: string | UserRole | Gender,
  ) => {
    const updatedUser = { ...user, [field]: value };
    dispatch({ type: "UPDATE_USER", payload: updatedUser });
    setChangedUsers((prev) => ({ ...prev, [user.id]: true }));
  };

  const handleSave = async (user: User) => {
    await handleUpdateUser(user);
    setChangedUsers((prev) => ({ ...prev, [user.id]: false }));
  };

  return (
    <>
      <Input
        placeholder="Search users..."
        value={state.searchTerm}
        onChange={(e) =>
          dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
        }
        className="max-w-sm mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>User ID (Sub)</TableHead>
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
              <TableCell>
                <Input
                  value={user.firstName}
                  onChange={(e) =>
                    handleInputChange(user, "firstName", e.target.value)
                  }
                  className="w-full"
                />
                <Input
                  value={user.lastName}
                  onChange={(e) =>
                    handleInputChange(user, "lastName", e.target.value)
                  }
                  className="w-full mt-2"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={user.email}
                  onChange={(e) =>
                    handleInputChange(user, "email", e.target.value)
                  }
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value: UserRole) =>
                    handleInputChange(user, "role", value)
                  }
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
              <TableCell>{user.status}</TableCell>
              <TableCell>
                <Select
                  value={user.gender}
                  onValueChange={(value: Gender) =>
                    handleInputChange(user, "gender", value)
                  }
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
                  value={user.team || ""}
                  onChange={(e) =>
                    handleInputChange(user, "team", e.target.value)
                  }
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={user.organizationId}
                  onChange={(e) =>
                    handleInputChange(user, "organizationId", e.target.value)
                  }
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleSave(user)}
                  disabled={!changedUsers[user.id]}
                >
                  Save
                </Button>
                <Button
                  onClick={() => handleRemoveUser(user.id)}
                  variant="destructive"
                  className="ml-2"
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
