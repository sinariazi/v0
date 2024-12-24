import { getCurrentUser as getAmplifyCurrentUser } from "aws-amplify/auth";
import { NextApiRequest } from "next";

export async function getCurrentUser(req: NextApiRequest) {
  try {
    const user = await getAmplifyCurrentUser();
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
