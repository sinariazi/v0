import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserManagementContext } from "./UserManagementContext";
import { Gender } from "./types";

export function EditUserDialog() {
  const { state, dispatch, handleUpdateUser } = useContext(
    UserManagementContext
  );

  if (!state.editingUser) return null;

  return (
    <Dialog
      open={!!state.editingUser}
      onOpenChange={() => dispatch({ type: "SET_EDITING_USER", payload: null })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-firstName" className="text-right">
              First Name
            </Label>
            <Input
              id="edit-firstName"
              value={state.editingUser.firstName}
              onChange={(e) =>
                dispatch({
                  type: "SET_EDITING_USER",
                  payload: { ...state.editingUser, firstName: e.target.value },
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-lastName" className="text-right">
              Last Name
            </Label>
            <Input
              id="edit-lastName"
              value={state.editingUser.lastName}
              onChange={(e) =>
                dispatch({
                  type: "SET_EDITING_USER",
                  payload: { ...state.editingUser, lastName: e.target.value },
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-gender" className="text-right">
              Gender
            </Label>
            <Select
              value={state.editingUser.gender}
              onValueChange={(value: Gender) =>
                dispatch({
                  type: "SET_EDITING_USER",
                  payload: { ...state.editingUser, gender: value },
                })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-team" className="text-right">
              Team
            </Label>
            <Input
              id="edit-team"
              value={state.editingUser.team || ""}
              onChange={(e) =>
                dispatch({
                  type: "SET_EDITING_USER",
                  payload: { ...state.editingUser, team: e.target.value },
                })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={() => handleUpdateUser(state.editingUser)}>
          Update User
        </Button>
      </DialogContent>
    </Dialog>
  );
}
