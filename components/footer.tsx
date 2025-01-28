"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-8 px-4">
        <nav className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-4 md:gap-8">
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
        </nav>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:text-foreground"
          >
            <a
              href="https://www.linkedin.com/company/mood-whisper"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Mood Whisper on LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:text-foreground"
          >
            <a
              href="https://www.instagram.com/moodwhisper_ai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Mood Whisper on Instagram"
            >
              <Instagram size={20} />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:text-foreground"
          >
            <a
              href="https://www.threads.net/@moodwhisper_ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Mood Whisper on Threads"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.75 2H6.25C3.9 2 2 3.9 2 6.25v11.5C2 20.1 3.9 22 6.25 22h11.5c2.35 0 4.25-1.9 4.25-4.25V6.25C22 3.9 20.1 2 17.75 2Z" />
                <path d="M12 7v10" />
                <path d="M8 9v6a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3h-2" />
              </svg>
            </a>
          </Button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            © 2023 Mood Whisper. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
