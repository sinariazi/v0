"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import {
  fetchAuthSession,
  getCurrentUser,
  signIn,
  signOut,
  resetPassword,
  confirmResetPassword,
  confirmSignIn,
  updatePassword,
  signUp,
  confirmSignUp,
  type ConfirmSignInInput,
  type SignUpInput,
} from "aws-amplify/auth";
import { configureAmplify } from "./amplify-config";

// Ensure Amplify is configured
configureAmplify();

interface User {
  username: string;
  attributes: {
    email: string;
    email_verified: boolean;
  };
}

interface SignInResult {
  isSignedIn: boolean;
  nextStep?: {
    signInStep: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<SignInResult>;
  signUp: (username: string, password: string, email: string) => Promise<any>;
  confirmSignUp: (username: string, code: string) => Promise<any>;
  confirmSignIn: (challengeResponse: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
  isAuthenticated: boolean;
  getAuthToken: () => Promise<string | null>;
  resetPassword: (username: string) => Promise<void>;
  confirmResetPassword: (
    username: string,
    newPassword: string,
    confirmationCode: string
  ) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signInData, setSignInData] = useState<any>(null);

  const handleSignIn = async (
    username: string,
    password: string
  ): Promise<SignInResult> => {
    try {
      const result = await signIn({ username, password });
      setSignInData(result);

      if (result.isSignedIn) {
        await checkAuthStatus();
        return { isSignedIn: true };
      }

      if (
        result.nextStep?.signInStep ===
        "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        return {
          isSignedIn: false,
          nextStep: { signInStep: result.nextStep.signInStep },
        };
      }

      return { isSignedIn: false };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const handleSignUp = async (
    username: string,
    password: string,
    email: string
  ) => {
    try {
      const result = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      } as SignUpInput);
      return result;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const handleConfirmSignUp = async (username: string, code: string) => {
    try {
      const result = await confirmSignUp({ username, confirmationCode: code });
      return result;
    } catch (error) {
      console.error("Error confirming sign up:", error);
      throw error;
    }
  };

  const handleConfirmSignIn = async (
    newPassword: string
  ): Promise<SignInResult> => {
    if (!signInData) {
      throw new Error("No sign-in data available");
    }
    try {
      const result = await confirmSignIn({
        challengeResponse: newPassword,
      });

      if (result.isSignedIn) {
        await checkAuthStatus();
        return { isSignedIn: true };
      }

      return {
        isSignedIn: false,
        nextStep: result.nextStep
          ? { signInStep: result.nextStep.signInStep }
          : undefined,
      };
    } catch (error) {
      console.error("Error confirming sign-in:", error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
      setSignInData(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;

      if (currentUser && idToken) {
        setUser({
          username: currentUser.username,
          attributes: {
            email: (idToken.payload.email as string) || "",
            email_verified:
              (idToken.payload.email_verified as boolean) || false,
          },
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
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

  const handleResetPassword = async (username: string) => {
    try {
      await resetPassword({ username });
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  const handleConfirmResetPassword = async (
    username: string,
    newPassword: string,
    confirmationCode: string
  ) => {
    try {
      await confirmResetPassword({ username, newPassword, confirmationCode });
    } catch (error) {
      console.error("Error confirming reset password:", error);
      throw error;
    }
  };

  const handleChangePassword = async (
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      await updatePassword({ oldPassword, newPassword });
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    confirmSignUp: handleConfirmSignUp,
    confirmSignIn: handleConfirmSignIn,
    signOut: handleSignOut,
    checkAuthStatus,
    isAuthenticated,
    getAuthToken,
    resetPassword: handleResetPassword,
    confirmResetPassword: handleConfirmResetPassword,
    changePassword: handleChangePassword,
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
