import { getCurrentUser } from "aws-amplify/auth";
import { NextApiRequest } from "next";
import { configureAmplify } from "./amplify-config";

export async function getCurrentUserServer(req: NextApiRequest) {
  try {
    // Ensure Amplify is configured before getting the current user
    const isConfigured = configureAmplify();
    if (!isConfigured) {
      throw new Error("Amplify configuration failed");
    }
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

