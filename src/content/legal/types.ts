// Structured legal-document model. Content is authored bilingually as data (not
// MDX) for build-time reliability; client-fillable facts are interpolated from
// site-config at module load, so a single edit to site-config updates every doc.

export type Block =
  | { h: string } // section heading
  | { p: string } // paragraph
  | { ul: string[] }; // bullet list

export type LegalDoc = {
  title: string;
  updated: string;
  intro?: string;
  blocks: Block[];
};

export type LegalBundle = { mr: LegalDoc; en: LegalDoc };

export const LEGAL_SLUGS = [
  "about",
  "contact",
  "terms",
  "privacy",
  "refund-policy",
  "shipping-policy",
] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];
