import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/lib/auth-context";
import { configureAmplify } from "@/lib/amplify-config";

const inter = Inter({ subsets: ["latin"] });

configureAmplify();

export const metadata = {
  title: "Mood Whisper - Employee Engagement Platform",
  description:
    "Enhance your workplace with real-time employee mood tracking and engagement solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
