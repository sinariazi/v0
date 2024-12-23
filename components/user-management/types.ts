export type UserRole = "EMPLOYEE" | "MANAGER" | "ADMIN";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type UserStatus =
  | "UNCONFIRMED"
  | "CONFIRMED"
  | "ARCHIVED"
  | "COMPROMISED"
  | "UNKNOWN"
  | "RESET_REQUIRED"
  | "FORCE_CHANGE_PASSWORD";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  cognitoSub: string;
  cognitoUsername: string | null;
  emailVerified: boolean;
  status: UserStatus;
  gender: Gender;
  organizationId: string;
  team: string | null;
}

export type State = {
  users: User[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  isAddUserOpen: boolean;
  newUser: Partial<User>;
  editingUser: User | null;
};

export type Action =
  | { type: "FETCH_USERS_START" }
  | { type: "FETCH_USERS_SUCCESS"; payload: User[] }
  | { type: "FETCH_USERS_ERROR"; payload: string }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_ADD_USER_OPEN"; payload: boolean }
  | { type: "SET_NEW_USER"; payload: Partial<User> }
  | { type: "SET_EDITING_USER"; payload: User | null }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "REMOVE_USER"; payload: number };
