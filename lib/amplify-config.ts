"use client";

import { Amplify } from "aws-amplify";

export function configureAmplify() {
  const userPoolId = process.env.NEXT_PUBLIC_AWS_USER_POOL_ID;
  const userPoolClientId = process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID;
  // TODO:remove console.log
  console.log("Environment variables:", {
    userPoolId,
    userPoolClientId,
  });

  if (!userPoolId || !userPoolClientId) {
    console.error(
      "Missing required environment variables for Amplify configuration:",
      {
        userPoolId,
        userPoolClientId,
      }
    );
    return false;
  }

  try {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId,
          userPoolClientId,
        },
      },
    });

    console.log("Amplify configured successfully with:", {
      userPoolId,
      userPoolClientId,
    });
    return true;
  } catch (error) {
    console.error("Error configuring Amplify:", error);
    return false;
  }
}
