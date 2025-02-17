import "@/app/globals.css";
import { Analytics } from "@/components/analytics";
import CookieConsent from "@/components/CookieConsent";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language-context";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mood Whisper",
  description:
    "Empowering organizations with AI-driven employee engagement insights",
};

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const segment =
    (children as { props?: { childProp?: { segment?: string } } })?.props
      ?.childProp?.segment ?? "";
  const canonicalUrl = `${process.env.NEXT_PUBLIC_APP_URL}${
    segment === "" ? "" : `/${segment}`
  }`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={canonicalUrl} />
      </head>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <LanguageProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <Toaster />
              <CookieConsent />
            </LanguageProvider>
          </AuthProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
