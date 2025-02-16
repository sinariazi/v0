import { hasCookieConsent } from "@/lib/cookieConsent";
import Script from "next/script";

export function Analytics() {
  if (!hasCookieConsent()) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  );
}

type GtagArgs =
  | [string, string, Record<string, unknown>]
  | [string, Record<string, unknown>]
  | [string, string, string, Record<string, unknown>];

declare global {
  interface Window {
    gtag: (...args: GtagArgs) => void;
    dataLayer: Array<Record<string, unknown>>;
  }
}

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (hasCookieConsent() && typeof window !== "undefined") {
    window.gtag("event", eventName, eventParams || {});
  }
};

export const trackPageView = (url: string) => {
  if (hasCookieConsent() && typeof window !== "undefined") {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "", {
      page_path: url,
    });
  }
};
