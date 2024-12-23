import React, { useContext } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserManagementContext } from "./UserManagementContext";
import { UserRole, Gender } from "./types";

export function AddUserDialog() {
  const { state, dispatch, handleAddUser } = useContext(UserManagementContext);

  return (
    <Dialog
      open={state.isAddUserOpen}
      onOpenChange={(open) =>
        dispatch({ type: "SET_ADD_USER_OPEN", payload: open })
      }
    >
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              First Name
            </Label>
            <Input
              id="firstName"
              value={state.newUser.firstName || ""}
              onChange={(e) =>
                dispatch({
                  type: "SET_NEW_USER",
                  payload: { ...state.newUser, firstName: e.target.value },
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={state.newUser.lastName || ""}
              onChange={(e) =>
                dispatch({
                  type: "SET_NEW_USER",
                  payload: { ...state.newUser, lastName: e.target.value },
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select
              value={state.newUser.role}
              onValueChange={(value: UserRole) =>
                dispatch({
                  type: "SET_NEW_USER",
                  payload: { ...state.newUser, role: value },
                })
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Gender
            </Label>
            <Select
              value={state.newUser.gender}
              onValueChange={(value: Gender) =>
                dispatch({
                  type: "SET_NEW_USER",
                  payload: { ...state.newUser, gender: value },
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
            <Label htmlFor="team" className="text-right">
              Team
            </Label>
            <Input
              id="team"
              value={state.newUser.team || ""}
              onChange={(e) =>
                dispatch({
                  type: "SET_NEW_USER",
                  payload: { ...state.newUser, team: e.target.value },
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="organizationId" className="text-right">
              Organization ID
            </Label>
            <Input
              id="organizationId"
              value={state.newUser.organizationId || ""}
              onChange={(e) =>
                dispatch({
                  type: "SET_NEW_USER",
                  payload: { ...state.newUser, organizationId: e.target.value },
                })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleAddUser}>Add User</Button>
      </DialogContent>
    </Dialog>
  );
}
