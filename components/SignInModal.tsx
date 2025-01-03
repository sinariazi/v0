import { useState, useEffect } from "react";
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
import { configureAmplify } from "../lib/amplify-config";
import { useToast } from "@/components/ui/use-toast";
import SignUpModal from "./SignUpModal";

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
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isPasswordResetRequired, setIsPasswordResetRequired] = useState(false);
  const [isForgotPasswordFlow, setIsForgotPasswordFlow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const {
    signIn,
    completeNewPassword,
    forgotPassword,
    confirmForgotPassword,
    loading,
    user,
  } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const configured = configureAmplify();
    console.log("Amplify configuration result:", configured);
    setIsConfigured(configured);
    if (!configured) {
      setError(
        "Amplify configuration failed. Please check your environment variables."
      );
    }
  }, []);

  useEffect(() => {
    if (propIsOpen) {
      setIsForgotPasswordFlow(false);
      setIsPasswordResetRequired(false);
      setError(null);
    }
    setIsOpen(propIsOpen);
  }, [propIsOpen]);

  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      console.log("Attempting to sign in with:", { email, password: "******" });
      const result = await signIn(email, password);
      console.log("Sign-in result:", result);
      if (result.isSignedIn) {
        console.log("Sign-in successful");
        onClose();
      } else if (result.forceChangePassword) {
        console.log("Password change required");
        setIsPasswordResetRequired(true);
      } else if (result.userConfirmationRequired) {
        console.log("User confirmation required");
        setError(
          "Please confirm your account. Check your email for a confirmation code."
        );
      } else {
        console.log("Unexpected sign-in result:", result);
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

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }
    try {
      console.log("Attempting to complete new password");
      const result = await completeNewPassword(password, newPassword);
      console.log("Complete new password result:", result);
      if (result.isSignedIn) {
        console.log("Password changed and signed in successfully");
        toast({
          title: "Success",
          description:
            "Your password has been changed and you are now signed in.",
        });
        onClose();
      } else {
        console.log("Failed to change password, result:", result);
        setError("Failed to change password. Please try again.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError(
        "An error occurred while changing the password. Please try again."
      );
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await forgotPassword(email);
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
      await confirmForgotPassword(email, newPassword, password); // Using 'password' field for the confirmation code
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
          disabled={!isConfigured}
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
          disabled={!isConfigured}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={!isConfigured || loading}>
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

  const renderPasswordResetForm = () => (
    <form onSubmit={handlePasswordReset} className="space-y-4">
      <div>
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={!isConfigured}
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
          disabled={!isConfigured}
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
          disabled={!isConfigured}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={!isConfigured || loading}>
        {loading ? "Changing Password..." : "Change Password"}
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
          disabled={!isConfigured}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={!isConfigured || loading}>
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={!isConfigured}
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
          disabled={!isConfigured}
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
          disabled={!isConfigured}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={!isConfigured || loading}>
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
                : "Sign In"}
            </DialogTitle>
          </DialogHeader>
          {isForgotPasswordFlow
            ? error && error.includes("Password reset code sent")
              ? renderForgotPasswordConfirmationForm()
              : renderForgotPasswordForm()
            : isPasswordResetRequired
            ? renderPasswordResetForm()
            : renderSignInForm()}
        </DialogContent>
      </Dialog>
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />
    </>
  );
}
