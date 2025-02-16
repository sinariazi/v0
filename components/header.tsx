"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { useLanguage, type Language } from "@/lib/language-context";
import { LogIn, LogOut, Menu, Moon, Sun, User, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import SignInModal from "./SignInModal";

type NavLink = {
  href: string;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", "/#pricing");
    }
  };

  useEffect(() => {
    if (window.location.hash === "#pricing") {
      const pricingSection = document.getElementById("pricing");
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  useEffect(() => {
    console.log("Auth state changed:", { user, loading });
  }, [user, loading]);

  useEffect(() => {
    if (user && !loading) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (user) {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  const navLinks: NavLink[] = user
    ? []
    : [
        { href: "/", label: t("header.home") },
        { href: "/features", label: t("header.features") },
        { href: "/how-it-works", label: t("header.howItWorks") },
        { href: "/about", label: t("header.about") },
        { href: "/contact", label: t("header.contact") },
        {
          href: "#pricing",
          label: t("header.pricing"),
          onClick: scrollToPricing,
        },
      ];

  const languageOptions: Record<Language, string> = {
    en: "English",
    de: "Deutsch",
    es: "Español",
    it: "Italiano",
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className={`container relative flex h-16 items-center ${
          user ? "justify-end" : "justify-between"
        }`}
      >
        <Link
          href={user ? "/admin" : "/"}
          className={`flex items-center space-x-2 ${
            user ? "absolute left-4" : ""
          }`}
          onClick={handleLogoClick}
        >
          <span className="text-2xl font-bold">Mood Whisper</span>
        </Link>
        <div className="flex items-center space-x-4">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="uppercase">{language}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.entries(languageOptions).map(([langCode, langName]) => (
                <DropdownMenuItem
                  key={langCode}
                  onClick={() => setLanguage(langCode as Language)}
                >
                  {langName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">
                {user.attributes.email}
              </span>
              <Button
                variant="ghost"
                onClick={() => router.push("/user/dashboard")}
              >
                <User className="mr-2 h-4 w-4" />
                User Area
              </Button>
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <nav className="hidden md:flex space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium hover:text-primary"
                    onClick={link.onClick}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => setIsSignInOpen(true)}>
                  <LogIn className="mr-2 h-4 w-4" />
                  {t("header.signIn")}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="hidden md:inline-flex"
                >
                  <Link href="/schedule-demo">{t("header.scheduleDemo")}</Link>
                </Button>
              </div>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-4 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-primary"
                onClick={link.onClick}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Button asChild variant="outline">
                <Link href="/schedule-demo">{t("header.scheduleDemo")}</Link>
              </Button>
            )}
          </nav>
        </div>
      )}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </header>
  );
}
