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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signUp } from "aws-amplify/auth";
import { configureAmplify } from "../lib/amplify-config";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SignUpError {
  name: string;
  message: string;
  code?: string;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("OTHER");
  const [team, setTeam] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    console.log("SignUpModal: Attempting to configure Amplify...");
    const configured = configureAmplify();
    console.log("SignUpModal: Amplify configuration result:", configured);
    setIsConfigured(configured);
    if (!configured) {
      setError(
        "Amplify configuration failed. Please check your environment variables."
      );
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setError("Amplify is not configured. Unable to sign up.");
      return;
    }
    setError(null);
    try {
      console.log("Attempting sign up with:", {
        email,
        firstName,
        lastName,
        gender,
        team,
        organizationId,
      });
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName,
            family_name: lastName,
            gender,
            "custom:team": team,
            "custom:organization_id": organizationId,
          },
        },
      });
      console.log("Sign up result:", result);
      onClose();
    } catch (error) {
      console.error("Error signing up:", error);
      const signUpError = error as SignUpError;
      console.error("Error name:", signUpError.name);
      console.error("Error message:", signUpError.message);
      if (signUpError.code) {
        console.error("Error code:", signUpError.code);
      }
      setError(signUpError.message || "An unknown error occurred");
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
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={!isConfigured}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={!isConfigured}
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={gender}
              onValueChange={(value: "MALE" | "FEMALE" | "OTHER") =>
                setGender(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="team">Team</Label>
            <Input
              id="team"
              type="text"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              disabled={!isConfigured}
            />
          </div>
          <div>
            <Label htmlFor="organizationId">Organization ID</Label>
            <Input
              id="organizationId"
              type="text"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              required
              disabled={!isConfigured}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={!isConfigured}>
            Sign Up
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
