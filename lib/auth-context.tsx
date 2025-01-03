"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signIn,
  signOut,
  signUp,
  getCurrentUser,
  confirmSignUp,
  AuthUser,
  confirmSignIn,
  resetPassword,
  confirmResetPassword,
  resendSignUpCode,
  fetchUserAttributes,
} from "aws-amplify/auth";
import {
  SignInOutput,
  ResetPasswordOutput,
  FetchUserAttributesOutput,
} from "@aws-amplify/auth";

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
  ) => Promise<{
    isSignedIn: boolean;
    userConfirmationRequired?: boolean;
    forceChangePassword?: boolean;
    nextStep?: SignInOutput["nextStep"];
  }>;
  signOut: () => Promise<void>;
  signUp: (
    username: string,
    password: string,
    email: string
  ) => Promise<{ userConfirmationRequired: boolean }>;
  confirmSignUp: (username: string, code: string) => Promise<boolean>;
  checkAuthStatus: () => Promise<boolean>;
  isAuthenticated: boolean;
  completeNewPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ isSignedIn: boolean; userConfirmationRequired?: boolean }>;
  forgotPassword: (username: string) => Promise<ResetPasswordOutput>;
  confirmForgotPassword: (
    username: string,
    newPassword: string,
    code: string
  ) => Promise<void>;
  resendConfirmationCode: (username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = async (username: string, password: string) => {
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password });
      if (isSignedIn) {
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
        return { isSignedIn: true };
      } else if (
        nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        return { isSignedIn: false, forceChangePassword: true, nextStep };
      } else if (nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        return { isSignedIn: false, userConfirmationRequired: true, nextStep };
      }
      return { isSignedIn: false, nextStep };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const handleSignUp = async (
    username: string,
    password: string,
    email: string
  ) => {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: { email },
        },
      });

      return { userConfirmationRequired: !isSignUpComplete };
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const handleConfirmSignUp = async (username: string, code: string) => {
    try {
      await confirmSignUp({ username, confirmationCode: code });
      return true;
    } catch (error) {
      console.error("Error confirming sign up:", error);
      throw error;
    }
  };

  const handleCompleteNewPassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse: newPassword,
      });
      if (isSignedIn) {
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
        return { isSignedIn: true };
      } else if (nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        const currentUser = await getCurrentUser();
        await resendSignUpCode({ username: currentUser.username });
        return { isSignedIn: false, userConfirmationRequired: true };
      }
      return { isSignedIn: false };
    } catch (error) {
      console.error("Error completing new password:", error);
      throw error;
    }
  };

  const handleForgotPassword = async (username: string) => {
    try {
      return await resetPassword({ username });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  };

  const handleConfirmForgotPassword = async (
    username: string,
    newPassword: string,
    code: string
  ) => {
    try {
      await confirmResetPassword({
        username,
        newPassword,
        confirmationCode: code,
      });
    } catch (error) {
      console.error("Error confirming password reset:", error);
      throw error;
    }
  };

  const handleResendConfirmationCode = async (username: string) => {
    try {
      await resendSignUpCode({ username });
    } catch (error) {
      console.error("Error resending confirmation code:", error);
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
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      await checkAuthStatus();
      setLoading(false);
    };
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    signUp: handleSignUp,
    confirmSignUp: handleConfirmSignUp,
    checkAuthStatus,
    isAuthenticated,
    completeNewPassword: handleCompleteNewPassword,
    forgotPassword: handleForgotPassword,
    confirmForgotPassword: handleConfirmForgotPassword,
    resendConfirmationCode: handleResendConfirmationCode,
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
