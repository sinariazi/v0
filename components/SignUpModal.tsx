import { useState } from "react";
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

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp, confirmSignUp } = useAuth();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signUp(email, password, email);
      setIsConfirming(true);
      toast({
        title: "Success",
        description: "Please check your email for the confirmation code",
      });
    } catch (error) {
      console.error("Error signing up:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to sign up. Please try again."
      );
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await confirmSignUp(email, confirmationCode);
      toast({
        title: "Success",
        description: "Your account has been confirmed. You can now sign in.",
      });
      onClose();
    } catch (error) {
      console.error("Error confirming sign up:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to confirm sign up. Please try again."
      );
    }
  };

  const renderSignUpForm = () => (
    <form onSubmit={handleSignUp} className="space-y-4">
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
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      {error && (
        <p className="text-red-500" role="alert">
          {error}
        </p>
      )}
      <Button type="submit">Sign Up</Button>
    </form>
  );

  const renderConfirmationForm = () => (
    <form onSubmit={handleConfirmSignUp} className="space-y-4">
      <div>
        <Label htmlFor="confirmationCode">Confirmation Code</Label>
        <Input
          id="confirmationCode"
          type="text"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          required
        />
      </div>
      {error && (
        <p className="text-red-500" role="alert">
          {error}
        </p>
      )}
      <Button type="submit">Confirm Sign Up</Button>
    </form>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isConfirming ? "Confirm Sign Up" : "Sign Up"}
          </DialogTitle>
        </DialogHeader>
        {isConfirming ? renderConfirmationForm() : renderSignUpForm()}
      </DialogContent>
    </Dialog>
  );
}
