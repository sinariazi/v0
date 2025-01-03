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
import { useToast } from "@/components/ui/use-toast";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"EMPLOYEE" | "MANAGER" | "ADMIN">(
    "EMPLOYEE"
  );
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("OTHER");
  const [team, setTeam] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          role,
          gender,
          team,
          organizationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign up");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description:
          "Your account has been created. Please check your email for the temporary password.",
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
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={(value: "EMPLOYEE" | "MANAGER" | "ADMIN") =>
                setRole(value)
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMPLOYEE">Employee</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
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
              value={team}
              onChange={(e) => setTeam(e.target.value)}
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
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit">Sign Up</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
