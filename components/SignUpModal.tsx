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
import { signUp } from "aws-amplify/auth";
import { configureAmplify } from "../lib/amplify-config";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    organizationId: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const configured = configureAmplify();
    setIsConfigured(configured);
    if (!configured) {
      setError(
        "Amplify configuration failed. Please check your environment variables."
      );
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setError("Amplify is not configured. Unable to sign up.");
      return;
    }
    setError(null);
    try {
      const { email, password, firstName, lastName, organizationId } = formData;
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName,
            family_name: lastName,
            "custom:organization_id": organizationId,
          },
        },
      });
      console.log("Sign up result:", result);
      onClose();
    } catch (error) {
      console.error("Error signing up:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSignUp} className="space-y-4">
          {["email", "password", "firstName", "lastName", "organizationId"].map(
            (field) => (
              <div key={field}>
                <Label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
                <Input
                  id={field}
                  type={field === "password" ? "password" : "text"}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleInputChange}
                  required
                  disabled={!isConfigured}
                />
              </div>
            )
          )}
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={!isConfigured}>
            Sign Up
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
