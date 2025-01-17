"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/use-toast";
import SignUpModal from "./SignUpModal";
import ChangePasswordModal from "./ChangePasswordModal";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({
  isOpen: propIsOpen,
  onClose,
}: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPasswordResetRequired, setIsPasswordResetRequired] = useState(false);
  const [isForgotPasswordFlow, setIsForgotPasswordFlow] = useState(false);
  const [isConfirmSignInRequired, setIsConfirmSignInRequired] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isRouterReady, setIsRouterReady] = useState(false);
  const {
    signIn,
    confirmSignIn,
    resetPassword,
    confirmResetPassword,
    loading,
    user,
  } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsRouterReady(true);
  }, []);

  useEffect(() => {
    if (propIsOpen) {
      setIsForgotPasswordFlow(false);
      setIsPasswordResetRequired(false);
      setIsConfirmSignInRequired(false);
      setError(null);
    }
    setIsOpen(propIsOpen);
  }, [propIsOpen]);

  useEffect(() => {
    if (user && isRouterReady) {
      onClose();
      router.push("/admin");
    }
  }, [user, router, onClose, isRouterReady]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await signIn(email, password);
      if (result.isSignedIn) {
        console.log("Sign-in successful");
        if (isRouterReady) {
          onClose();
          router.push("/admin");
        }
      } else if (
        result.nextStep?.signInStep ===
        "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        setIsChangePasswordOpen(true);
      } else {
        throw new Error("Unexpected sign-in result");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      if (error instanceof Error) {
        setError(`Failed to sign in: ${error.message}`);
      } else {
        setError(
          "Failed to sign in. Please check your credentials and try again."
        );
      }
    }
  };

  const handleConfirmSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await confirmSignIn(newPassword);
      if (result.isSignedIn) {
        console.log("Sign-in confirmation successful");
        if (isRouterReady) {
          onClose();
          router.push("/admin");
        }
      } else {
        throw new Error("Unexpected confirm sign-in result");
      }
    } catch (error) {
      console.error("Error confirming sign-in:", error);
      if (error instanceof Error) {
        setError(`Failed to confirm sign-in: ${error.message}`);
      } else {
        setError("Failed to confirm sign-in. Please try again.");
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await resetPassword(email);
      setIsForgotPasswordFlow(true);
      setError("Password reset code sent. Please check your email.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setError("Failed to send password reset email. Please try again.");
    }
  };

  const handleConfirmForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }
    try {
      await confirmResetPassword(email, newPassword, confirmationCode);
      setError(
        "Password reset successful. You can now sign in with your new password."
      );
      setIsForgotPasswordFlow(false);
    } catch (error) {
      console.error("Error confirming password reset:", error);
      setError("Failed to reset password. Please try again.");
    }
  };

  const renderSignInForm = () => (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </Button>
      <div className="flex justify-between items-center mt-4">
        <Button variant="link" onClick={() => setIsSignUpOpen(true)}>
          Not a user yet? Sign up
        </Button>
        <Button variant="link" onClick={() => setIsForgotPasswordFlow(true)}>
          Forgot Password?
        </Button>
      </div>
    </form>
  );

  const renderConfirmSignInForm = () => (
    <form onSubmit={handleConfirmSignIn} className="space-y-4">
      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Confirming..." : "Set New Password"}
      </Button>
    </form>
  );

  const renderForgotPasswordForm = () => (
    <form onSubmit={handleForgotPassword} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Sending Reset Code..." : "Send Reset Code"}
      </Button>
      <Button variant="link" onClick={() => setIsForgotPasswordFlow(false)}>
        Back to Sign In
      </Button>
    </form>
  );

  const renderForgotPasswordConfirmationForm = () => (
    <form onSubmit={handleConfirmForgotPassword} className="space-y-4">
      <div>
        <Label htmlFor="confirmationCode">Reset Code</Label>
        <Input
          id="confirmationCode"
          type="text"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
        <Input
          id="confirmNewPassword"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Resetting Password..." : "Reset Password"}
      </Button>
    </form>
  );

  return (
    <>
      <Dialog
        open={isOpen || propIsOpen}
        onOpenChange={(open) => {
          if (!open) {
            onClose();
          }
          setIsOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isForgotPasswordFlow
                ? "Forgot Password"
                : isPasswordResetRequired
                ? "Reset Password"
                : isConfirmSignInRequired
                ? "Set New Password"
                : "Sign In"}
            </DialogTitle>
          </DialogHeader>
          {isForgotPasswordFlow
            ? error && error.includes("Password reset code sent")
              ? renderForgotPasswordConfirmationForm()
              : renderForgotPasswordForm()
            : isConfirmSignInRequired
            ? renderConfirmSignInForm()
            : renderSignInForm()}
        </DialogContent>
      </Dialog>
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        email={email}
        onPasswordChanged={() => {
          setIsChangePasswordOpen(false);
          onClose();
        }}
      />
    </>
  );
}
