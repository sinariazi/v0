"use client";

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
import { useLanguage } from "@/lib/language-context";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onPasswordChanged: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  email,
  onPasswordChanged,
}: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { confirmSignIn } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError(t("changePasswordModal.newPasswordsDoNotMatch"));
      return;
    }

    try {
      const result = await confirmSignIn(newPassword);
      if (result.isSignedIn) {
        toast({
          title: t("changePasswordModal.success"),
          description: t("changePasswordModal.passwordChangedSuccessfully"),
        });
        onPasswordChanged();
      } else {
        throw new Error(t("changePasswordModal.failedToConfirmSignIn"));
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError(
        error instanceof Error
          ? error.message
          : t("changePasswordModal.failedToChangePassword")
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("changePasswordModal.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">{t("changePasswordModal.email")}</Label>
            <Input id="email" type="email" value={email} disabled />
          </div>
          <div>
            <Label htmlFor="newPassword">
              {t("changePasswordModal.newPassword")}
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">
              {t("changePasswordModal.confirmNewPassword")}
            </Label>
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
          <Button type="submit">
            {t("changePasswordModal.setNewPasswordButton")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
