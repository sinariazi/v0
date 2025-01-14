import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import { configureAmplify } from "@/lib/amplify-config";

// Configure Amplify
configureAmplify();

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
