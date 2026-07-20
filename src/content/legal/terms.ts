import { siteConfig } from "@/lib/site-config";
import { formatInr } from "@/lib/utils";
import type { LegalBundle } from "./types";

const c = siteConfig;
const flat = formatInr(c.shipping.flatRateInr);
const free = formatInr(c.shipping.freeAboveInr);

export const terms: LegalBundle = {
  en: {
    title: "Terms & Conditions",
    updated: c.policyLastUpdated,
    intro: `These Terms govern your use of ${c.tradeName} (operated by ${c.legalName}) and any purchase you make on this website. By using the site or placing an order, you agree to these Terms.`,
    blocks: [
      { h: "1. Definitions" },
      { p: `"We", "us", "our" refer to ${c.legalName} operating as ${c.tradeName}. "You" refers to the customer using the site or placing an order.` },
      { h: "2. Eligibility" },
      { p: "You must be capable of entering into a legally binding contract under the Indian Contract Act, 1872. If you are a minor, you may use the site only under the involvement of a parent or guardian." },
      { h: "3. Orders" },
      {
        p: "Placing an order is an offer to purchase. Your order is confirmed only after successful online payment. We may decline or cancel an order (with a full refund of any amount charged) in cases such as a pricing error, unavailability of stock, or suspected fraud.",
      },
      { h: "4. Pricing" },
      {
        p: `All prices are listed in Indian Rupees (INR). Books sold on this site are exempt from GST under Indian law, so no GST is charged. The total payable is the sum of item prices plus applicable shipping (${flat} flat, free on orders above ${free}).`,
      },
      { h: "5. Payments" },
      {
        p: `Payments are accepted online only, via ${c.payments.gatewayName} (${c.payments.methods.join(", ")}). We do not offer Cash on Delivery. Card and payment credentials are handled by our PCI-DSS-compliant payment gateway and are never stored on our servers.`,
      },
      { h: "6. Shipping & delivery" },
      { p: "Physical books are delivered to the address you provide. Charges and timelines are described in our Shipping Policy." },
      { h: "7. Cancellation & refunds" },
      { p: "Cancellations, returns and refunds are governed by our Refund & Cancellation Policy." },
      { h: "8. Intellectual property" },
      { p: "All site content — text, layout, logos and design — is owned by us or our licensors and may not be copied or reused without permission. Book titles, cover text and author names remain the property of their respective owners." },
      { h: "9. Acceptable use" },
      { p: "You agree not to misuse the site, attempt unauthorised access, or interfere with its normal operation." },
      { h: "10. Disclaimer & liability" },
      {
        p: "The site is provided on an 'as is' basis. To the extent permitted by law, our liability for any claim relating to an order is limited to the amount you paid for that order.",
      },
      { h: "11. Governing law & jurisdiction" },
      { p: `These Terms are governed by the laws of India. Any dispute is subject to the exclusive jurisdiction of the courts at ${c.jurisdictionCity}, India.` },
      { h: "12. Changes" },
      { p: `We may update these Terms from time to time. The current version is dated ${c.policyLastUpdated}.` },
    ],
  },
  mr: {
    title: "अटी व शर्ती",
    updated: c.policyLastUpdated,
    intro: `या अटी ${c.tradeNameMr} (${c.legalName} द्वारे संचालित) च्या वापरास व या संकेतस्थळावरील तुमच्या कोणत्याही खरेदीस लागू होतात. संकेतस्थळ वापरून किंवा ऑर्डर देऊन तुम्ही या अटींना संमती देता.`,
    blocks: [
      { h: "१. व्याख्या" },
      { p: `"आम्ही", "आमचे" म्हणजे ${c.tradeNameMr} या नावाने कार्यरत ${c.legalName}. "तुम्ही" म्हणजे संकेतस्थळ वापरणारा किंवा ऑर्डर देणारा ग्राहक.` },
      { h: "२. पात्रता" },
      { p: "भारतीय करार कायदा, १८७२ अंतर्गत कायदेशीर करार करण्यास तुम्ही सक्षम असणे आवश्यक आहे. अल्पवयीन असल्यास, पालकांच्या सहभागानेच संकेतस्थळ वापरावे." },
      { h: "३. ऑर्डर" },
      {
        p: "ऑर्डर देणे ही खरेदीची विनंती आहे. यशस्वी ऑनलाइन पेमेंटनंतरच तुमची ऑर्डर निश्चित होते. किंमतीतील चूक, साठा उपलब्ध नसणे किंवा फसवणुकीचा संशय अशा प्रकरणांत आम्ही ऑर्डर नाकारू किंवा रद्द करू शकतो (आकारलेली रक्कम पूर्ण परत करून).",
      },
      { h: "४. किंमत" },
      {
        p: `सर्व किंमती भारतीय रुपयांत (INR) आहेत. भारतीय कायद्यानुसार या संकेतस्थळावरील पुस्तके GST मुक्त आहेत, त्यामुळे GST आकारला जात नाही. एकूण देय रक्कम = वस्तूंची किंमत अधिक लागू वितरण शुल्क (${flat} सरसकट, ${free} पेक्षा जास्त ऑर्डरवर मोफत).`,
      },
      { h: "५. पेमेंट" },
      {
        p: `पेमेंट फक्त ऑनलाइन, ${c.payments.gatewayName} द्वारे (UPI, कार्ड, नेट बँकिंग, वॉलेट) स्वीकारले जाते. कॅश ऑन डिलिव्हरी उपलब्ध नाही. कार्ड व पेमेंट माहिती आमच्या PCI-DSS सुसंगत गेटवेद्वारे हाताळली जाते व आमच्या सर्व्हरवर साठवली जात नाही.`,
      },
      { h: "६. वितरण" },
      { p: "प्रत्यक्ष पुस्तके तुम्ही दिलेल्या पत्त्यावर पाठवली जातात. शुल्क व कालावधी आमच्या वितरण धोरणात दिले आहेत." },
      { h: "७. रद्दीकरण व परतावा" },
      { p: "रद्दीकरण, परत व परतावा आमच्या परतावा व रद्दीकरण धोरणानुसार होतात." },
      { h: "८. बौद्धिक संपदा" },
      { p: "संकेतस्थळावरील सर्व मजकूर, रचना, लोगो व डिझाइन आमच्या किंवा आमच्या परवानाधारकांच्या मालकीचे आहेत व परवानगीशिवाय वापरता येणार नाहीत. पुस्तकांची शीर्षके व लेखकांची नावे त्यांच्या संबंधित मालकांची राहतात." },
      { h: "९. योग्य वापर" },
      { p: "संकेतस्थळाचा गैरवापर, अनधिकृत प्रवेशाचा प्रयत्न किंवा त्याच्या सामान्य कार्यात अडथळा न आणण्यास तुम्ही सहमत आहात." },
      { h: "१०. जबाबदारीची मर्यादा" },
      {
        p: "संकेतस्थळ 'जसे आहे तसे' पुरवले जाते. कायद्याने परवानगी असेल तेवढ्या मर्यादेत, ऑर्डरसंबंधी कोणत्याही दाव्यासाठी आमची जबाबदारी त्या ऑर्डरसाठी तुम्ही भरलेल्या रकमेपुरती मर्यादित आहे.",
      },
      { h: "११. कायदा व अधिकारक्षेत्र" },
      { p: `या अटी भारतीय कायद्यांनुसार आहेत. कोणताही वाद ${c.jurisdictionCity}, भारत येथील न्यायालयांच्या अनन्य अधिकारक्षेत्राखाली येईल.` },
      { h: "१२. बदल" },
      { p: `आम्ही या अटी वेळोवेळी अद्ययावत करू शकतो. सध्याची आवृत्ती ${c.policyLastUpdated} रोजीची आहे.` },
    ],
  },
};
