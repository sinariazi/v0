"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  signIn,
  signOut,
  signUp,
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
  confirmSignUp,
} from "aws-amplify/auth";

interface User {
  username: string;
  attributes: {
    email: string;
    // Add other user attributes as needed
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (
    username: string,
    password: string,
  ) => Promise<{ isSignedIn: boolean; userConfirmationRequired?: boolean }>;
  signOut: () => Promise<void>;
  signUp: (username: string, password: string, email: string) => Promise<void>;
  confirmSignUp: (username: string, code: string) => Promise<boolean>;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      const userInfo = {
        username: currentUser.username,
        attributes: attributes as { email: string },
      };
      console.log("Current user:", userInfo);
      setUser(userInfo);
    } catch (error) {
      console.error("Error checking user:", error);
      if (
        error instanceof Error &&
        error.name === "UserUnAuthenticatedException"
      ) {
        setUser(null);
      } else {
        console.error("Unexpected error during authentication check:", error);
      }
    }
  }, []);

  const checkSession = useCallback(async () => {
    setLoading(true);
    try {
      const session = await fetchAuthSession();
      if (session.tokens) {
        await checkUser();
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [checkUser]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  async function checkAuthStatus() {
    try {
      const session = await fetchAuthSession();
      console.log("Current session:", session);
      return session.tokens !== undefined;
    } catch (error) {
      console.error("Error checking auth status:", error);
      return false;
    }
  }

  async function handleSignIn(username: string, password: string) {
    setLoading(true);
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password });
      if (isSignedIn) {
        await checkUser();
        return { isSignedIn: true };
      } else if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
        return { isSignedIn: false, userConfirmationRequired: true };
      } else {
        console.log("Additional sign-in step required:", nextStep);
        return { isSignedIn: false };
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(
    username: string,
    password: string,
    email: string,
  ) {
    setLoading(true);
    try {
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmSignUp(username: string, code: string) {
    setLoading(true);
    try {
      await confirmSignUp({ username, confirmationCode: code });
      return true;
    } catch (error) {
      console.error("Error confirming sign up:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    signUp: handleSignUp,
    confirmSignUp: handleConfirmSignUp,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
