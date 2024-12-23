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
    } catch (error: unknown) {
      console.error("Error fetching users:", error);
      let errorMessage = "Error fetching users";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = String(error.message);
      }
      dispatch({ type: "FETCH_USERS_ERROR", payload: errorMessage });
    }
  }, [dispatch]);

  return fetchUsers;
}
