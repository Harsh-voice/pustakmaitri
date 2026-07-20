import { siteConfig, formattedAddress, PLACEHOLDER } from "@/lib/site-config";
import type { Locale } from "@/i18n/routing";

// Renders a JSON-LD script. React escapes the JSON string safely.
function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd({ data }: { data: unknown }) {
  return <JsonLd data={data} />;
}

export function OrganizationJsonLd() {
  const base = siteConfig.baseUrl;
  const addr = siteConfig.contact.address;
  const hasRealAddress = !addr.city.startsWith(PLACEHOLDER);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.tradeName,
        url: base,
        email: siteConfig.contact.email,
        ...(hasRealAddress
          ? {
              address: {
                "@type": "PostalAddress",
                streetAddress: [addr.line1, addr.line2].filter(Boolean).join(", "),
                addressLocality: addr.city,
                addressRegion: addr.state,
                postalCode: addr.pincode,
                addressCountry: "IN",
              },
              description: formattedAddress(),
            }
          : {}),
      }}
    />
  );
}

export function WebSiteJsonLd({ locale }: { locale: Locale }) {
  const base = siteConfig.baseUrl;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.tradeName,
        url: `${base}/${locale}`,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${base}/${locale}/books?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}
