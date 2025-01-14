"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";
import { AuthUser } from "aws-amplify/auth";

interface User {
  username: string;
  attributes: {
    email: string;
    email_verified: boolean;
    // Add other user attributes as needed
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (
    username: string,
    password: string
  ) => Promise<{ isSignedIn: boolean; userConfirmationRequired?: boolean }>;
  signOut: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
  isAuthenticated: boolean;
  getAuthToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = async (username: string, password: string) => {
    try {
      const { isSignedIn, nextStep } = await amplifySignIn({
        username,
        password,
      });
      if (isSignedIn) {
        await checkAuthStatus();
        return { isSignedIn: true };
      } else if (nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        return { isSignedIn: false, userConfirmationRequired: true };
      }
      return { isSignedIn: false };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await amplifySignOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      setUser({
        username: currentUser.username,
        attributes: {
          email: userAttributes.email || "",
          email_verified: userAttributes.email_verified === "true",
        },
      });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Error checking auth status:", error);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAuthToken = async () => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() || null;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    checkAuthStatus,
    isAuthenticated,
    getAuthToken,
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
