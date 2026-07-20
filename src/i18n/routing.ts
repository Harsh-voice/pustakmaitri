import { defineRouting } from "next-intl/routing";

// Single source of truth for locales. routing.ts, request.ts, navigation.ts and
// proxy.ts must all agree on this list and the [locale] segment.
export const routing = defineRouting({
  locales: ["mr", "en"],
  defaultLocale: "mr",
  // Always prefix the URL with the locale (/mr, /en) so hreflang is reciprocal.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
