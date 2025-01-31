import type { AppProps } from "next/app";
import { AuthProvider } from "@/lib/auth-context";
import "@/app/globals.css";
import { Providers } from "@/app/providers";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Providers>
  );
}

export default MyApp;
