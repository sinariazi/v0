import { hasCookieConsent } from "@/lib/cookieConsent";
import Script from "next/script";

export function Analytics() {
  const isDebug =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("gadebug");

  if (!hasCookieConsent() && !isDebug) {
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
              cookie_flags: 'SameSite=None;Secure',
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false
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
  if (typeof window !== "undefined" && hasCookieConsent()) {
    window.gtag("event", eventName, eventParams || {});
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && hasCookieConsent()) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "", {
      page_path: url,
    });
  }
};
