"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
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
  const router = useRouter();
  const { t } = useLanguage();

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
        setError(`${t("signInModal.failedToSignIn")}: ${error.message}`);
      } else {
        setError(t("signInModal.failedToSignInCheckCredentials"));
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
        setError(`${t("signInModal.failedToConfirmSignIn")}: ${error.message}`);
      } else {
        setError(t("signInModal.failedToConfirmSignInTryAgain"));
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await resetPassword(email);
      setIsForgotPasswordFlow(true);
      setError(t("signInModal.passwordResetCodeSent"));
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setError(t("signInModal.failedToSendPasswordResetEmail"));
    }
  };

  const handleConfirmForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmNewPassword) {
      setError(t("signInModal.newPasswordsDoNotMatch"));
      return;
    }
    try {
      await confirmResetPassword(email, newPassword, confirmationCode);
      setError(t("signInModal.passwordResetSuccessful"));
      setIsForgotPasswordFlow(false);
    } catch (error) {
      console.error("Error confirming password reset:", error);
      setError(t("signInModal.failedToResetPassword"));
    }
  };

  const renderSignInForm = () => (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div>
        <Label htmlFor="email">{t("signInModal.email")}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">{t("signInModal.password")}</Label>
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
        {loading ? t("signInModal.signingIn") : t("signInModal.signIn")}
      </Button>
      <div className="flex justify-between items-center mt-4">
        <Button variant="link" onClick={() => setIsSignUpOpen(true)}>
          {t("signInModal.notAUserYet")}
        </Button>
        <Button variant="link" onClick={() => setIsForgotPasswordFlow(true)}>
          {t("signInModal.forgotPassword")}
        </Button>
      </div>
    </form>
  );

  const renderConfirmSignInForm = () => (
    <form onSubmit={handleConfirmSignIn} className="space-y-4">
      <div>
        <Label htmlFor="newPassword">{t("signInModal.newPassword")}</Label>
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
        {loading
          ? t("signInModal.confirming")
          : t("signInModal.setNewPassword")}
      </Button>
    </form>
  );

  const renderForgotPasswordForm = () => (
    <form onSubmit={handleForgotPassword} className="space-y-4">
      <div>
        <Label htmlFor="email">{t("signInModal.email")}</Label>
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
        {loading
          ? t("signInModal.sendingResetCode")
          : t("signInModal.sendResetCode")}
      </Button>
      <Button variant="link" onClick={() => setIsForgotPasswordFlow(false)}>
        {t("signInModal.backToSignIn")}
      </Button>
    </form>
  );

  const renderForgotPasswordConfirmationForm = () => (
    <form onSubmit={handleConfirmForgotPassword} className="space-y-4">
      <div>
        <Label htmlFor="confirmationCode">{t("signInModal.resetCode")}</Label>
        <Input
          id="confirmationCode"
          type="text"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="newPassword">{t("signInModal.newPassword")}</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmNewPassword">
          {t("signInModal.confirmNewPassword")}
        </Label>
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
        {loading
          ? t("signInModal.resettingPassword")
          : t("signInModal.resetPassword")}
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
                ? t("signInModal.forgotPassword")
                : isPasswordResetRequired
                ? t("signInModal.resetPassword")
                : isConfirmSignInRequired
                ? t("signInModal.setNewPassword")
                : t("signInModal.signIn")}
            </DialogTitle>
          </DialogHeader>
          {isForgotPasswordFlow
            ? error && error.includes(t("signInModal.passwordResetCodeSent"))
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
