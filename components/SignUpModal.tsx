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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/use-toast";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [team, setTeam] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Sign up with email and other user details
      const signUpResult = await signUp(
        email,
        firstName,
        lastName,
        gender,
        team,
        organizationId
      );
      console.log("Sign up result:", signUpResult);

      toast({
        title: "Success",
        description:
          "Your account has been created. Please check your email for a temporary password to sign in.",
      });
      onClose();
    } catch (error) {
      console.error("Error signing up:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to sign up. Please try again."
      );
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to sign up. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
        </DialogHeader>
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
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender} required>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="team">Team</Label>
            <Input
              id="team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="organizationId">Organization ID</Label>
            <Input
              id="organizationId"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
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
      </DialogContent>
    </Dialog>
  );
}
