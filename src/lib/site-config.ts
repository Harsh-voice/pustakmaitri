/**
 * Single source of truth for every client-fillable fact about the business.
 * Legal pages, footer, metadata and JSON-LD all read from here so the client
 * edits ONE file before Razorpay KYC.
 *
 * Fields marked `TODO(client)` MUST be replaced with real values before going
 * live — the pre-launch QA gate (scripts/check-placeholders.ts) fails while any
 * `TODO(client)` marker remains.
 */

export const PLACEHOLDER = "TODO(client)";

export const siteConfig = {
  // ---- Identity -----------------------------------------------------------
  tradeName: "Pustak Maitri",
  tradeNameMr: "पुस्तक मैत्री",
  // Legal proprietorship name exactly as on Udyam / PAN. Razorpay matches this.
  legalName: "TODO(client): Registered proprietorship name (as per Udyam/PAN)",
  proprietorName: "TODO(client): Proprietor full name",
  udyamRegistrationNumber: "TODO(client): UDYAM-XX-00-0000000",
  foundedYear: 2024,

  // ---- Contact ------------------------------------------------------------
  contact: {
    email: "harsh@iskcon-navimumbai.org",
    phone: "TODO(client): +91 XXXXX XXXXX",
    whatsapp: "TODO(client): +91 XXXXX XXXXX",
    businessHours: "Mon–Sat, 10:00 AM – 7:00 PM IST",
    address: {
      line1: "TODO(client): Building / street address line 1",
      line2: "",
      city: "TODO(client): City",
      state: "TODO(client): State",
      pincode: "TODO(client): 000000",
      country: "India",
    },
  },

  // Grievance / nodal officer — required by the DPDP Act 2023 & RBI PA norms.
  grievanceOfficer: {
    name: "TODO(client): Grievance officer name",
    email: "harsh@iskcon-navimumbai.org",
    responseSlaHours: 48,
  },

  // ---- Commerce policy knobs (safe defaults; client can tweak) ------------
  shipping: {
    flatRateInr: 49,
    freeAboveInr: 499,
    dispatchDays: "1–2",
    deliveryEstimateDays: "5–8",
    coverage: "PAN-India",
  },
  refund: {
    cancellationWindowHours: 24,
    returnWindowDays: 7,
    processingDays: "5–7",
  },
  payments: {
    methods: ["UPI", "Cards", "Net Banking", "Wallets"],
    codAvailable: false,
    gatewayName: "Razorpay",
  },
  gst: {
    applicable: false, // Books are GST-exempt in India.
  },

  // ---- Legal meta ---------------------------------------------------------
  policyLastUpdated: "2026-07-20",
  jurisdictionCity: "TODO(client): City",

  // ---- URLs & social ------------------------------------------------------
  get baseUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  },
  social: {
    instagram: "",
    facebook: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Formatted single-line postal address (skips empty parts & placeholders). */
export function formattedAddress(): string {
  const a = siteConfig.contact.address;
  return [a.line1, a.line2, a.city, a.state, a.pincode, a.country]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
}
