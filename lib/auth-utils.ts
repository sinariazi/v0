import {
  getCurrentUser as getAmplifyCurrentUser,
  fetchUserAttributes,
  type AuthUser,
  type FetchUserAttributesOutput,
} from "aws-amplify/auth";
import { NextApiRequest } from "next";
import { configureAmplify } from "./amplify-config";

// Ensure Amplify is configured
configureAmplify();

export async function getCurrentUser(
  req?: NextApiRequest
): Promise<AuthUser | null> {
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
