"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-8 px-4">
        <nav className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-4 md:gap-8 mb-6">
          {!user && (
            <>
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href="/features"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                How It Works
              </Link>
            </>
          )}
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
          <Link
            href="/privacy-policy"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms of Service
          </Link>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://www.linkedin.com/company/mood-whisper"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Mood Whisper on LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </Button>
        </nav>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © 2023 Mood Whisper. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
