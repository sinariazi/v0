import { NextApiRequest } from "next";
import {
  getCurrentUser as getAmplifyCurrentUser,
  AuthUser,
} from "aws-amplify/auth";

export async function getCurrentUser(
  req: NextApiRequest
): Promise<AuthUser | null> {
  try {
    const user = await getAmplifyCurrentUser();
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
