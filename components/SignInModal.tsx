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
import SignUpModal from "./SignUpModal";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConfirmationRequired, setIsConfirmationRequired] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const { signIn, confirmSignUp, loading, user } = useAuth();

  useEffect(() => {
    console.log("SignInModal: Attempting to configure Amplify...");
    const configured = configureAmplify();
    console.log("SignInModal: Amplify configuration result:", configured);
    setIsConfigured(configured);
    if (!configured) {
      setError(
        "Amplify configuration failed. Please check your environment variables."
      );
    }
  }, []);

  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await signIn(email, password);
      if (result.isSignedIn) {
        console.log("Sign-in successful");
        onClose();
      } else if (result.userConfirmationRequired) {
        setIsConfirmationRequired(true);
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError(
        "Failed to sign in. Please check your credentials and try again."
      );
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const isConfirmed = await confirmSignUp(email, confirmationCode);
      if (isConfirmed) {
        console.log("Email confirmed successfully");
        // Attempt to sign in again after confirmation
        const result = await signIn(email, password);
        if (result.isSignedIn) {
          console.log("Sign-in successful after confirmation");
          onClose();
        } else {
          setError(
            "Sign-in failed after confirmation. Please try signing in again."
          );
        }
      } else {
        setError(
          "Failed to confirm email. Please check the confirmation code and try again."
        );
      }
    } catch (error) {
      console.error("Error confirming sign up:", error);
      setError("Failed to confirm email. Please try again.");
    }
  };

  const handleOpenSignUp = () => {
    setIsSignUpOpen(true);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isConfirmationRequired ? "Confirm Email" : "Sign In"}
            </DialogTitle>
          </DialogHeader>
          {!isConfirmationRequired ? (
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
              <div className="text-center mt-4">
                <Button variant="link" onClick={handleOpenSignUp}>
                  Not a user yet? Sign up
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleConfirmSignUp} className="space-y-4">
              <div>
                <Label htmlFor="confirmationCode">Confirmation Code</Label>
                <Input
                  id="confirmationCode"
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  required
                  disabled={!isConfigured}
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" disabled={!isConfigured || loading}>
                {loading ? "Confirming..." : "Confirm Email"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />
    </>
  );
}
