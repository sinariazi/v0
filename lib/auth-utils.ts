import {
  fetchUserAttributes,
  getCurrentUser as getAmplifyCurrentUser,
  type AuthUser,
  type FetchUserAttributesOutput,
} from "aws-amplify/auth";
import { configureAmplify } from "./amplify-config";

// Ensure Amplify is configured
configureAmplify();

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const user = await getAmplifyCurrentUser();
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getCurrentUserServer(): Promise<
  (AuthUser & { attributes: FetchUserAttributesOutput }) | null
> {
  try {
    const user = await getAmplifyCurrentUser();
    if (user) {
      const attributes = await fetchUserAttributes();
      return {
        ...user,
        attributes,
      };
    }
    return null;
  } catch (error) {
    console.error(
      "Error getting current user on server:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return null;
  }
}

export async function checkTrialStatus(): Promise<{
  trialStatus: string;
  trialEndDate: Date | null;
}> {
  try {
    const response = await fetch("/api/check-trial-status");
    if (!response.ok) {
      throw new Error("Failed to check trial status");
    }
    const data = await response.json();
    return {
      trialStatus: data.trialStatus,
      trialEndDate: data.trialEndDate ? new Date(data.trialEndDate) : null,
    };
  } catch (error) {
    console.error(
      "Error checking trial status:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return { trialStatus: "ERROR", trialEndDate: null };
  }
}
