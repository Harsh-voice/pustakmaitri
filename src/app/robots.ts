import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const base = siteConfig.baseUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private / transactional routes out of the index (both locales).
      // Legal + catalog pages stay crawlable (needed for Razorpay review + SEO).
      disallow: ["/api/", "/admin", "/*/admin", "/*/cart", "/*/checkout", "/*/order/", "/*/track"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
