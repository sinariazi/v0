"use client";

import React, { useReducer, useCallback, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UserTable } from "./UserTable";
import { AddUserDialog } from "./AddUserDialog";
import { UserManagementContext } from "./UserManagementContext";
import { userManagementReducer, initialState } from "./userManagementReducer";
import { useFetchUsers } from "./useFetchUsers";
import { User } from "./types";

export function UserManagement() {
  const [state, dispatch] = useReducer(userManagementReducer, initialState);
  const { toast } = useToast();
  const fetchUsers = useFetchUsers(dispatch);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleAddUser = useCallback(async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    } catch (error: unknown) {
      console.error("Error adding user:", error);
      let errorMessage = "Failed to add user. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [state.newUser, debouncedFetchUsers, toast]);

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
      } catch (error: unknown) {
        console.error("Error updating user:", error);
        let errorMessage = "Failed to update user. Please try again.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    [toast],
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
        } catch (error: unknown) {
          console.error("Error removing user:", error);
          let errorMessage = "Failed to remove user. Please try again.";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    },
    [toast],
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
        <AddUserDialog />
        <UserTable />
      </div>
    </UserManagementContext.Provider>
  );
}
