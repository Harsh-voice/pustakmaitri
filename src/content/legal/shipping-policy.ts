import { siteConfig } from "@/lib/site-config";
import { formatInr } from "@/lib/utils";
import type { LegalBundle } from "./types";

const c = siteConfig;
const flat = formatInr(c.shipping.flatRateInr);
const free = formatInr(c.shipping.freeAboveInr);

export const shippingPolicy: LegalBundle = {
  en: {
    title: "Shipping Policy",
    updated: c.policyLastUpdated,
    intro: `How we ship your books — coverage, charges and timelines.`,
    blocks: [
      { h: "1. Coverage" },
      { p: `We currently ship ${c.shipping.coverage}. We do not ship internationally.` },
      { h: "2. Shipping charges" },
      {
        p: `A flat shipping charge of ${flat} applies per order. Shipping is free on orders above ${free}. The charge (if any) is shown at checkout before you pay.`,
      },
      { h: "3. Dispatch & delivery time" },
      {
        p: `Orders are usually dispatched within ${c.shipping.dispatchDays} business days of payment. Delivery typically takes ${c.shipping.deliveryEstimateDays} days after dispatch, depending on your location. Remote areas may take longer.`,
      },
      { h: "4. Tracking your order" },
      { p: "You can check the status of your order any time using the Track Order page with your order number and email." },
      { h: "5. Delays" },
      { p: "Delivery timelines are estimates. Delays can occur due to courier issues, weather, festivals or events beyond our control. We'll do our best to keep you informed." },
      { h: "6. Undelivered orders" },
      { p: "If a package is returned to us as undelivered (for example, an incorrect address or repeated failed attempts), we'll contact you to arrange re-delivery; re-shipping charges may apply." },
      { h: "7. Contact" },
      { p: `Questions about shipping? Email ${c.contact.email}.` },
    ],
  },
  mr: {
    title: "वितरण धोरण",
    updated: c.policyLastUpdated,
    intro: "आम्ही तुमची पुस्तके कशी पाठवतो — क्षेत्र, शुल्क व कालावधी.",
    blocks: [
      { h: "१. वितरण क्षेत्र" },
      { p: `सध्या आम्ही संपूर्ण भारतात वितरण करतो. आंतरराष्ट्रीय वितरण करत नाही.` },
      { h: "२. वितरण शुल्क" },
      {
        p: `प्रत्येक ऑर्डरवर ${flat} इतके सरसकट वितरण शुल्क लागू होते. ${free} पेक्षा जास्त ऑर्डरवर वितरण मोफत आहे. शुल्क (असल्यास) पेमेंटपूर्वी चेकआउटवर दाखवले जाते.`,
      },
      { h: "३. पाठवणी व वितरण कालावधी" },
      {
        p: `पेमेंटनंतर साधारणतः ${c.shipping.dispatchDays} कामकाजी दिवसांत ऑर्डर पाठवली जाते. पाठवणीनंतर तुमच्या ठिकाणानुसार साधारणतः ${c.shipping.deliveryEstimateDays} दिवसांत वितरण होते. दुर्गम भागात अधिक वेळ लागू शकतो.`,
      },
      { h: "४. ऑर्डर ट्रॅकिंग" },
      { p: "तुमचा ऑर्डर क्रमांक व ईमेल वापरून ‘ऑर्डर ट्रॅक करा’ पानावर तुम्ही कधीही ऑर्डरची स्थिती पाहू शकता." },
      { h: "५. विलंब" },
      { p: "वितरण कालावधी हे अंदाज आहेत. कुरिअर अडचणी, हवामान, सण किंवा आमच्या नियंत्रणाबाहेरील कारणांमुळे विलंब होऊ शकतो. तुम्हाला माहिती देण्याचा आम्ही प्रयत्न करू." },
      { h: "६. वितरित न झालेल्या ऑर्डर" },
      { p: "पॅकेज आम्हाला परत आल्यास (उदा. चुकीचा पत्ता किंवा वारंवार अयशस्वी प्रयत्न), पुन्हा वितरणासाठी आम्ही तुमच्याशी संपर्क साधू; पुन्हा-पाठवणी शुल्क लागू शकते." },
      { h: "७. संपर्क" },
      { p: `वितरणाबद्दल प्रश्न? ${c.contact.email} वर ईमेल करा.` },
    ],
  },
};
