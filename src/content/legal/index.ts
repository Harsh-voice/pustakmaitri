import type { Locale } from "@/i18n/routing";
import { LEGAL_SLUGS, type LegalBundle, type LegalSlug } from "./types";
import { about } from "./about";
import { contact } from "./contact";
import { terms } from "./terms";
import { privacy } from "./privacy";
import { refundPolicy } from "./refund-policy";
import { shippingPolicy } from "./shipping-policy";

const BUNDLES: Record<LegalSlug, LegalBundle> = {
  about,
  contact,
  terms,
  privacy,
  "refund-policy": refundPolicy,
  "shipping-policy": shippingPolicy,
};

export { LEGAL_SLUGS };
export type { LegalSlug };

export function isLegalSlug(slug: string): slug is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(slug);
}

export function getLegalDoc(slug: LegalSlug, locale: Locale) {
  return BUNDLES[slug][locale];
}
