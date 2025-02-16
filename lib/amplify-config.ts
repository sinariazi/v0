import { cognitoUserPoolsTokenProvider } from "@aws-amplify/auth/cognito";
import type { KeyValueStorageInterface } from "@aws-amplify/core";
import { Amplify } from "aws-amplify";

// Create a wrapper for localStorage that conforms to KeyValueStorageInterface
const localStorageWrapper: KeyValueStorageInterface = {
  setItem: (key: string, value: string): Promise<void> => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
    return Promise.resolve();
  },
  getItem: (key: string): Promise<string | null> => {
    if (typeof window !== "undefined") {
      return Promise.resolve(localStorage.getItem(key));
    }
    return Promise.resolve(null);
  },
  removeItem: (key: string): Promise<void> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
    return Promise.resolve();
  },
  clear: (): Promise<void> => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    return Promise.resolve();
  },
};

export function configureAmplify() {
  const userPoolId = process.env.NEXT_PUBLIC_AWS_USER_POOL_ID;
  const userPoolClientId = process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID;
  const region = process.env.NEXT_PUBLIC_AWS_REGION;

  if (!userPoolId || !userPoolClientId || !region) {
    console.error(
      "Missing required environment variables for Amplify configuration"
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

    // Use the wrapper instead of localStorage directly
    cognitoUserPoolsTokenProvider.setKeyValueStorage(localStorageWrapper);

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
