import { createContext } from "react";
import { State, Action, User } from "./types";

interface UserManagementContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  handleAddUser: () => Promise<void>;
  handleUpdateUser: (user: User) => Promise<void>;
  handleRemoveUser: (userId: number) => Promise<void>;
}

export const UserManagementContext = createContext<UserManagementContextType>(
  {} as UserManagementContextType,
);
