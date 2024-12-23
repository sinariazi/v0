"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Toast } from "@/components/ui/toast";

type UserRole = "EMPLOYEE" | "MANAGER" | "ADMIN";

interface User {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
  cognitoSub: string;
  cognitoUsername: string | null;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    role: UserRole;
  }>({
    name: "",
    email: "",
    role: "EMPLOYEE",
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  const { toast, toasts } = useToast();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!hasInitialFetch) {
      fetchUsers();
      setHasInitialFetch(true);
    }
  }, [fetchUsers, hasInitialFetch]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cognitoUsername?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleAddUser = useCallback(async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        setIsAddUserOpen(false);
        setNewUser({ name: "", email: "", role: "EMPLOYEE" });
        fetchUsers();
        toast({
          title: "Success",
          description: "User added successfully.",
        });
      } else {
        throw new Error("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      });
    }
  }, [newUser, fetchUsers, toast]);

  const handleUpdateUser = useCallback(
    async (user: User) => {
      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        if (response.ok) {
          fetchUsers();
          toast({
            title: "Success",
            description: "User updated successfully.",
          });
        } else {
          throw new Error("Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        toast({
          title: "Error",
          description: "Failed to update user. Please try again.",
          variant: "destructive",
        });
      }
    },
    [fetchUsers, toast]
  );

  const handleRemoveUser = useCallback(
    async (userId: number) => {
      if (window.confirm("Are you sure you want to remove this user?")) {
        try {
          const response = await fetch(`/api/users/${userId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            fetchUsers();
            toast({
              title: "Success",
              description: "User removed successfully.",
            });
          } else {
            throw new Error("Failed to remove user");
          }
        } catch (error) {
          console.error("Error removing user:", error);
          toast({
            title: "Error",
            description: "Failed to remove user. Please try again.",
            variant: "destructive",
          });
        }
      }
    },
    [fetchUsers, toast]
  );

  const syncUsers = useCallback(async () => {
    setIsSyncing(true);
    try {
      const response = await fetch("/api/sync-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        fetchUsers();
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        throw new Error(data.message || "Failed to sync users");
      }
    } catch (error) {
      console.error("Error syncing users:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to sync users with Cognito. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [fetchUsers, toast]);

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <div>
          <Button onClick={syncUsers} disabled={isSyncing} className="mr-2">
            {isSyncing ? "Syncing..." : "Sync with Cognito"}
          </Button>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>Add User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: UserRole) =>
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMPLOYEE">Employee</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Cognito Username</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value: UserRole) =>
                    handleUpdateUser({ ...user, role: value })
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
              <TableCell>{user.cognitoUsername || "N/A"}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleRemoveUser(user.id)}
                  variant="destructive"
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {toasts.map((toast, index) => (
        <Toast key={index} {...toast} />
      ))}
    </div>
  );
}
