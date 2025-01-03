"use client";

import React, {
  useReducer,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { UserTable } from "./UserTable";
import { AddUserDialog } from "./AddUserDialog";
import { UserManagementContext } from "./UserManagementContext";
import { userManagementReducer, initialState } from "./userManagementReducer";
import { useFetchUsers } from "./useFetchUsers";
import { User } from "./types";
import { ImportUsersDialog } from "./ImportUsersDialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function UserManagement() {
  const [state, dispatch] = useReducer(userManagementReducer, initialState);
  const { toast } = useToast();
  const fetchUsers = useFetchUsers(dispatch);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const debouncedFetchUsers = useCallback(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    fetchTimeoutRef.current = setTimeout(() => {
      fetchUsers();
    }, 500);
  }, [fetchUsers]);

  useEffect(() => {
    debouncedFetchUsers();
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [debouncedFetchUsers]);

  useEffect(() => {
    const fetchAdminEmail = async () => {
      try {
        const response = await fetch("/api/admin/get-email");
        if (response.ok) {
          const data = await response.json();
          setAdminEmail(data.email);
        } else {
          throw new Error("Failed to fetch admin email");
        }
      } catch (error) {
        console.error("Error fetching admin email:", error);
        toast({
          title: "Error",
          description:
            "Failed to fetch admin information. Some features may not work correctly.",
          variant: "destructive",
        });
      }
    };

    fetchAdminEmail();
  }, []);

  const syncUsersFromCognito = async () => {
    try {
      const response = await fetch("/api/sync-users-from-cognito", {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: data.message,
        });
        debouncedFetchUsers();
      } else {
        throw new Error("Failed to sync users");
      }
    } catch (error) {
      console.error("Error syncing users:", error);
      toast({
        title: "Error",
        description: "Failed to sync users from Cognito. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    syncUsersFromCognito();
  }, []);

  const handleAddUser = useCallback(async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Email": adminEmail || "",
        },
        body: JSON.stringify(state.newUser),
      });
      if (response.ok) {
        dispatch({ type: "SET_ADD_USER_OPEN", payload: false });
        dispatch({
          type: "SET_NEW_USER",
          payload: { role: "EMPLOYEE", gender: "OTHER" },
        });
        debouncedFetchUsers();
        toast({
          title: "Success",
          description: "User added successfully.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add user. Please try again.",
        variant: "destructive",
      });
    }
  }, [state.newUser, debouncedFetchUsers, toast, adminEmail]);

  const handleUpdateUser = useCallback(
    async (user: User) => {
      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        if (response.ok) {
          const updatedUser = await response.json();
          dispatch({ type: "UPDATE_USER", payload: updatedUser });
          toast({
            title: "Success",
            description: "User updated successfully.",
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to update user. Please try again.",
          variant: "destructive",
        });
        // Revert the changes in the UI
        debouncedFetchUsers();
      }
    },
    [debouncedFetchUsers, toast]
  );

  const handleRemoveUser = useCallback(
    async (userId: number) => {
      if (window.confirm("Are you sure you want to remove this user?")) {
        try {
          const response = await fetch(`/api/users/${userId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            dispatch({ type: "REMOVE_USER", payload: userId });
            toast({
              title: "Success",
              description: "User removed successfully.",
            });
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to remove user");
          }
        } catch (error) {
          console.error("Error removing user:", error);
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to remove user. Please try again.",
            variant: "destructive",
          });
          // Refresh the user list to ensure UI is in sync with backend
          debouncedFetchUsers();
        }
      }
    },
    [debouncedFetchUsers, toast]
  );

  if (state.isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <UserManagementContext.Provider
      value={{
        state,
        dispatch,
        handleAddUser,
        handleUpdateUser,
        handleRemoveUser,
      }}
    >
      <div className="space-y-4">
        <div className="flex space-x-4">
          <AddUserDialog debouncedFetchUsers={debouncedFetchUsers} />
          <Button onClick={() => setIsImportDialogOpen(true)}>
            Import Users
          </Button>
        </div>
        <UserTable />
        <ImportUsersDialog
          isOpen={isImportDialogOpen}
          onClose={() => setIsImportDialogOpen(false)}
        />
      </div>
    </UserManagementContext.Provider>
  );
}
