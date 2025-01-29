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
import { useLanguage } from "@/lib/language-context";

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
  const { t } = useLanguage();

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
        title: t("signUpModal.success"),
        description: t("signUpModal.accountCreatedCheckEmail"),
      });
      onClose();
    } catch (error) {
      console.error("Error signing up:", error);
      setError(
        error instanceof Error ? error.message : t("signUpModal.failedToSignUp")
      );
      toast({
        title: t("signUpModal.error"),
        description:
          error instanceof Error
            ? error.message
            : t("signUpModal.failedToSignUp"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("signUpModal.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Label htmlFor="email">{t("signUpModal.email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="firstName">{t("signUpModal.firstName")}</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">{t("signUpModal.lastName")}</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="gender">{t("signUpModal.gender")}</Label>
            <Select value={gender} onValueChange={setGender} required>
              <SelectTrigger id="gender">
                <SelectValue placeholder={t("signUpModal.selectGender")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t("signUpModal.male")}</SelectItem>
                <SelectItem value="female">
                  {t("signUpModal.female")}
                </SelectItem>
                <SelectItem value="other">{t("signUpModal.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="team">{t("signUpModal.team")}</Label>
            <Input
              id="team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="organizationId">
              {t("signUpModal.organizationId")}
            </Label>
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
          <Button type="submit">{t("signUpModal.signUpButton")}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
