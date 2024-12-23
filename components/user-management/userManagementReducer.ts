import { Action, State } from "./types";

export const initialState: State = {
  users: [],
  isLoading: true,
  error: null,
  searchTerm: "",
  isAddUserOpen: false,
  newUser: { role: "EMPLOYEE", gender: "OTHER" },
};

export function userManagementReducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_USERS_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_USERS_SUCCESS":
      return { ...state, isLoading: false, users: action.payload };
    case "FETCH_USERS_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_ADD_USER_OPEN":
      return { ...state, isAddUserOpen: action.payload };
    case "SET_NEW_USER":
      return { ...state, newUser: action.payload };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user,
        ),
      };
    case "REMOVE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      };
    default:
      return state;
  }
}
