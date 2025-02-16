const COOKIE_CONSENT_KEY = "cookie-consent";

export const hasCookieConsent = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  return consent === "true";
};

export const setCookieConsent = (consent: boolean): void => {
  localStorage.setItem(COOKIE_CONSENT_KEY, String(consent));
};

export const removeCookieConsent = (): void => {
  localStorage.removeItem(COOKIE_CONSENT_KEY);
};
