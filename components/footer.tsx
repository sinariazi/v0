"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const { user } = useAuth();
  const { t } = useLanguage();

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
                {t("footer.home")}
              </Link>
              <Link
                href="/features"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {t("footer.features")}
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {t("footer.howItWorks")}
              </Link>
            </>
          )}
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("footer.blog")}
          </Link>
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("footer.about")}
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("footer.contact")}
          </Link>
          <Link
            href="/privacy-policy"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("footer.privacyPolicy")}
          </Link>
          <Link
            href="/terms-of-service"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("footer.termsOfService")}
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
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
