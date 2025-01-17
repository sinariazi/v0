import { Amplify } from "aws-amplify";

export function configureAmplify() {
  const userPoolId = process.env.NEXT_PUBLIC_AWS_USER_POOL_ID;
  const userPoolClientId = process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID;
  const region = process.env.NEXT_PUBLIC_AWS_REGION;

  console.log("Configuring Amplify with:", {
    userPoolId,
    userPoolClientId,
    region,
  });

  if (!userPoolId || !userPoolClientId || !region) {
    console.error(
      "Missing required environment variables for Amplify configuration:",
      {
        userPoolId,
        userPoolClientId,
        region,
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
          loginWith: {
            email: true,
            phone: false,
            username: false,
          },
        },
      },
    });

    console.log("Amplify configured successfully");
    return true;
  } catch (error) {
    console.error("Error configuring Amplify:", error);
    return false;
  }
}

// Ensure Amplify is configured on the server side
if (typeof window === "undefined") {
  configureAmplify();
}
