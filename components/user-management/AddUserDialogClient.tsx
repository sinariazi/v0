"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/lib/language-context";
import { useCallback, useContext } from "react";
import { UserManagementContext } from "./UserManagementContext";

export default function AddUserDialogClient({
  debouncedFetchUsers,
}: {
  debouncedFetchUsers: () => void;
}) {
  const { state, dispatch } = useContext(UserManagementContext);
  const { toast } = useToast();
  const { t } = useLanguage();

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
  }, [state.newUser, debouncedFetchUsers, toast, dispatch, t]); // Added dispatch to dependencies

  return (
    <Dialog
      open={state.isAddUserOpen}
      onOpenChange={(open) =>
        dispatch({ type: "SET_ADD_USER_OPEN", payload: open })
      }
    >
      <DialogTrigger asChild>
        <Button>{t("userManagement.addUser")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("userManagement.addUserDialogTitle")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              {t("userManagement.email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={state.newUser.email || ""}
              onChange={(e) =>
                dispatch({
                  type: "SET_NEW_USER",
                  payload: { ...state.newUser, email: e.target.value },
                })
              }
              className="col-span-3"
            />
          </div>
          {/* ... other input fields */}
        </div>
        <Button onClick={handleAddUser}>{t("userManagement.addUser")}</Button>
      </DialogContent>
    </Dialog>
  );
}
