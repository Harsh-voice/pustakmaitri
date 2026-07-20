import { siteConfig } from "@/lib/site-config";
import type { LegalBundle } from "./types";

const c = siteConfig;
const cancelH = c.refund.cancellationWindowHours;
const returnD = c.refund.returnWindowDays;
const procD = c.refund.processingDays;

export const refundPolicy: LegalBundle = {
  en: {
    title: "Refund & Cancellation Policy",
    updated: c.policyLastUpdated,
    intro: `We want you to be happy with your order. This policy explains when you can cancel, return or get a refund. Since we sell physical books, some conditions apply.`,
    blocks: [
      { h: "1. Order cancellation" },
      {
        p: `You can cancel an order free of charge within ${cancelH} hours of placing it, provided it has not yet been dispatched. Once an order has been dispatched, it can no longer be cancelled.`,
      },
      { h: "2. Returns & replacements" },
      { p: "As books are physical goods, we accept returns only where the item is:" },
      {
        ul: [
          "damaged or defective on arrival,",
          "the wrong title from what you ordered, or",
          "materially different from its description.",
        ],
      },
      {
        p: `To be eligible, raise a request within ${returnD} days of delivery with photos/an unboxing video as proof. Books that have been used, read, marked or damaged after delivery are not eligible for return.`,
      },
      { h: "3. How to request" },
      {
        p: `Email ${c.contact.email} with your order number and details of the issue. You can find your order number on the confirmation page or via Track Order.`,
      },
      { h: "4. Refund method & timeline" },
      {
        p: `Approved refunds are made to your original payment method through ${c.payments.gatewayName} (all payments are electronic — there is no Cash on Delivery). Refunds are typically processed within ${procD} business days after approval; the time for the amount to reflect depends on your bank.`,
      },
      { h: "5. Shipping charges" },
      { p: "Shipping charges are non-refundable unless the return is due to our error (a damaged, defective or wrong item)." },
      { h: "6. Contact" },
      { p: `Questions about a refund? Email ${c.contact.email} and we'll help.` },
    ],
  },
  mr: {
    title: "परतावा व रद्दीकरण धोरण",
    updated: c.policyLastUpdated,
    intro: "तुमच्या ऑर्डरबद्दल तुम्ही समाधानी असावे अशी आमची इच्छा आहे. रद्दीकरण, परत व परतावा केव्हा शक्य आहे हे या धोरणात स्पष्ट केले आहे. आम्ही प्रत्यक्ष पुस्तके विकत असल्याने काही अटी लागू होतात.",
    blocks: [
      { h: "१. ऑर्डर रद्दीकरण" },
      {
        p: `ऑर्डर दिल्यापासून ${cancelH} तासांच्या आत, ती अद्याप पाठवली नसल्यास, तुम्ही ती विनाशुल्क रद्द करू शकता. ऑर्डर एकदा पाठवली गेल्यावर ती रद्द करता येणार नाही.`,
      },
      { h: "२. परत व बदली" },
      { p: "पुस्तके प्रत्यक्ष वस्तू असल्याने, खालील परिस्थितीतच आम्ही परत स्वीकारतो:" },
      {
        ul: [
          "मिळाल्यावर खराब किंवा सदोष असल्यास,",
          "तुम्ही मागवलेले नसलेले चुकीचे शीर्षक असल्यास, किंवा",
          "वर्णनापेक्षा लक्षणीयरीत्या वेगळे असल्यास.",
        ],
      },
      {
        p: `पात्र होण्यासाठी, वितरणानंतर ${returnD} दिवसांच्या आत फोटो/अनबॉक्सिंग व्हिडिओ पुराव्यासह विनंती नोंदवा. वितरणानंतर वापरलेली, वाचलेली, खुणा केलेली किंवा खराब झालेली पुस्तके परत करण्यास पात्र नाहीत.`,
      },
      { h: "३. विनंती कशी करावी" },
      {
        p: `तुमचा ऑर्डर क्रमांक व समस्येचा तपशील ${c.contact.email} वर ईमेल करा. ऑर्डर क्रमांक पुष्टी पानावर किंवा ‘ऑर्डर ट्रॅक करा’ मध्ये मिळेल.`,
      },
      { h: "४. परतावा पद्धत व कालावधी" },
      {
        p: `मंजूर परतावे ${c.payments.gatewayName} द्वारे तुमच्या मूळ पेमेंट पद्धतीत केले जातात (सर्व पेमेंट इलेक्ट्रॉनिक आहेत — कॅश ऑन डिलिव्हरी नाही). मंजुरीनंतर साधारणतः ${procD} कामकाजी दिवसांत परतावा प्रक्रिया केली जाते; रक्कम दिसण्याचा कालावधी तुमच्या बँकेवर अवलंबून असतो.`,
      },
      { h: "५. वितरण शुल्क" },
      { p: "परत आमच्या चुकीमुळे (खराब, सदोष किंवा चुकीची वस्तू) नसेल तर वितरण शुल्क परत केले जात नाही." },
      { h: "६. संपर्क" },
      { p: `परताव्याबद्दल प्रश्न? ${c.contact.email} वर ईमेल करा, आम्ही मदत करू.` },
    ],
  },
};
