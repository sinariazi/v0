import { useCallback } from "react";
import { Action } from "./types";

export function useFetchUsers(dispatch: React.Dispatch<Action>) {
  const fetchUsers = useCallback(async () => {
    dispatch({ type: "FETCH_USERS_START" });
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      dispatch({ type: "FETCH_USERS_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH_USERS_ERROR", payload: "Error fetching users" });
    }
  }, [dispatch]);

  return fetchUsers;
}
