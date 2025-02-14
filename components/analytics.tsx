"use client";

import { hasCookieConsent } from "@/lib/cookieConsent";
import Script from "next/script";
import { useEffect } from "react";

export function Analytics() {
  useEffect(() => {
    if (hasCookieConsent()) {
      // Initialize analytics here if needed
    }
  }, []);

  if (!hasCookieConsent()) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
