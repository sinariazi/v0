"use client"

import {
  confirmResetPassword,
  confirmSignIn,
  fetchAuthSession,
  getCurrentUser,
  resetPassword,
  signIn,
  SignInOutput,
  signOut,
  updatePassword,
  type AuthUser,
  type ConfirmResetPasswordInput,
  type ConfirmSignInInput,
  type ResetPasswordInput,
  type SignInInput,
  type UpdatePasswordInput,
} from "aws-amplify/auth"
import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { configureAmplify } from "./amplify-config"

// Ensure Amplify is configured
configureAmplify()

interface UserAttributes {
  email?: string
  email_verified?: boolean
  given_name?: string
  family_name?: string
  gender?: string
  "custom:organization_id"?: string
  "custom:team"?: string
}

interface User {
  username: string
  attributes: UserAttributes
}

interface NextAuthStep {
  signInStep: string
  additionalInfo?: Record<string, string>
}

interface SignInResult {
  isSignedIn: boolean
  nextStep?: NextAuthStep
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<SignInResult>
  signUp: (
    email: string,
    firstName: string,
    lastName: string,
    gender: string,
    team: string,
    organizationId: string,
  ) => Promise<{ user: AuthUser }>
  confirmSignIn: (newPassword: string) => Promise<SignInResult>
  signOut: () => Promise<void>
  checkAuthStatus: () => Promise<boolean>
  isAuthenticated: boolean
  getAuthToken: () => Promise<string | null>
  resetPassword: (username: string) => Promise<void>
  confirmResetPassword: (username: string, newPassword: string, confirmationCode: string) => Promise<void>
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [signInData, setSignInData] = useState<SignInOutput | null>(null)
  const [hasSignedOut, setHasSignedOut] = useState(false)

  const handleSignIn = async (username: string, password: string): Promise<SignInResult> => {
    try {
      const signInInput: SignInInput = { username, password }
      const result = await signIn(signInInput)
      setSignInData(result)
      setHasSignedOut(false)

      if (result.isSignedIn) {
        await checkAuthStatus()
        return { isSignedIn: true }
      }

      if (result.nextStep) {
        return { isSignedIn: false, nextStep: result.nextStep }
      }

      return { isSignedIn: false }
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const handleSignUp = async (
    email: string,
    firstName: string,
    lastName: string,
    gender: string,
    team: string,
    organizationId: string,
  ): Promise<{ user: AuthUser }> => {
    try {
      const response = await fetch("/api/auth/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          gender,
          team,
          organizationId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create user")
      }

      return await response.json()
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const handleConfirmSignIn = async (newPassword: string): Promise<SignInResult> => {
    if (!signInData) {
      throw new Error("No sign-in data available")
    }
    try {
      const confirmSignInInput: ConfirmSignInInput = {
        challengeResponse: newPassword,
      }
      const result = await confirmSignIn(confirmSignInInput)

      if (result.isSignedIn) {
        await checkAuthStatus()
        return { isSignedIn: true }
      }

      return { isSignedIn: false, nextStep: result.nextStep }
    } catch (error) {
      console.error("Error confirming sign-in:", error)
      throw error
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
      setIsAuthenticated(false)
      setSignInData(null)
      setHasSignedOut(true)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const checkAuthStatus = useCallback(async () => {
    if (hasSignedOut) {
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
      return false
    }

    try {
      const currentUser = await getCurrentUser()
      const session = await fetchAuthSession()
      const idToken = session.tokens?.idToken

      if (currentUser && idToken) {
        const payload = idToken.payload as unknown as UserAttributes
        setUser({
          username: currentUser.username,
          attributes: {
            email: payload.email || "",
            email_verified: payload.email_verified || false,
            given_name: payload.given_name || "",
            family_name: payload.family_name || "",
            gender: payload.gender || "",
            "custom:organization_id": payload["custom:organization_id"] || "",
            "custom:team": payload["custom:team"] || "",
          },
        })
        setIsAuthenticated(true)
        return true
      }
      throw new Error("No authenticated user")
    } catch (error) {
      if (error instanceof Error && error.name === "UserUnAuthenticatedException") {
        // User is not authenticated, which is a normal state
        setUser(null)
        setIsAuthenticated(false)
        return false
      }
      // Log other types of errors
      console.error("Error checking auth status:", error)
      setUser(null)
      setIsAuthenticated(false)
      return false
    } finally {
      setLoading(false)
    }
  }, [hasSignedOut])

  const getAuthToken = async () => {
    if (hasSignedOut) {
      return null
    }

    try {
      const session = await fetchAuthSession()
      return session.tokens?.accessToken?.toString() || null
    } catch (error) {
      console.error("Error getting auth token:", error)
      return null
    }
  }

  const handleResetPassword = async (username: string) => {
    try {
      const resetPasswordInput: ResetPasswordInput = { username }
      await resetPassword(resetPasswordInput)
    } catch (error) {
      console.error("Error resetting password:", error)
      throw error
    }
  }

  const handleConfirmResetPassword = async (username: string, newPassword: string, confirmationCode: string) => {
    try {
      const confirmResetPasswordInput: ConfirmResetPasswordInput = {
        username,
        newPassword,
        confirmationCode,
      }
      await confirmResetPassword(confirmResetPasswordInput)
    } catch (error) {
      console.error("Error confirming reset password:", error)
      throw error
    }
  }

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const updatePasswordInput: UpdatePasswordInput = {
        oldPassword,
        newPassword,
      }
      await updatePassword(updatePasswordInput)
    } catch (error) {
      console.error("Error changing password:", error)
      throw error
    }
  }

  useEffect(() => {
    if (!hasSignedOut) {
      checkAuthStatus()
    }
  }, [hasSignedOut, checkAuthStatus])

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    confirmSignIn: handleConfirmSignIn,
    signOut: handleSignOut,
    checkAuthStatus,
    isAuthenticated,
    getAuthToken,
    resetPassword: handleResetPassword,
    confirmResetPassword: handleConfirmResetPassword,
    changePassword: handleChangePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

