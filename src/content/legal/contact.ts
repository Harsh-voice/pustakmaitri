import { siteConfig, formattedAddress } from "@/lib/site-config";
import type { LegalBundle } from "./types";

const c = siteConfig;

export const contact: LegalBundle = {
  en: {
    title: "Contact Us",
    updated: c.policyLastUpdated,
    intro: "We're happy to help with orders, deliveries, refunds or any question about our books.",
    blocks: [
      { h: "Business details" },
      {
        ul: [
          `Trade name: ${c.tradeName}`,
          `Legal (proprietorship) name: ${c.legalName}`,
          `Proprietor: ${c.proprietorName}`,
          `Udyam Registration Number: ${c.udyamRegistrationNumber}`,
        ],
      },
      { h: "Reach us" },
      {
        ul: [
          `Email: ${c.contact.email}`,
          `Phone: ${c.contact.phone}`,
          `WhatsApp: ${c.contact.whatsapp}`,
          `Business hours: ${c.contact.businessHours}`,
        ],
      },
      { h: "Registered address" },
      { p: formattedAddress() },
      { h: "Grievance officer" },
      {
        p: `In line with applicable Indian law, our grievance officer is ${c.grievanceOfficer.name}. For any complaint or data-related request, email ${c.grievanceOfficer.email}; we aim to acknowledge within ${c.grievanceOfficer.responseSlaHours} hours.`,
      },
      { h: "Order support" },
      {
        p: "To check an order, use the Track Order page with your order number and email. For refunds or cancellations, please see our Refund & Cancellation Policy.",
      },
    ],
  },
  mr: {
    title: "संपर्क",
    updated: c.policyLastUpdated,
    intro: "ऑर्डर, वितरण, परतावा किंवा आमच्या पुस्तकांविषयी कोणत्याही प्रश्नासाठी आम्ही मदतीस तयार आहोत.",
    blocks: [
      { h: "व्यवसाय तपशील" },
      {
        ul: [
          `व्यापार नाव: ${c.tradeNameMr}`,
          `कायदेशीर (मालकी) नाव: ${c.legalName}`,
          `मालक: ${c.proprietorName}`,
          `उद्यम नोंदणी क्रमांक: ${c.udyamRegistrationNumber}`,
        ],
      },
      { h: "आमच्याशी संपर्क" },
      {
        ul: [
          `ईमेल: ${c.contact.email}`,
          `फोन: ${c.contact.phone}`,
          `व्हॉट्सअ‍ॅप: ${c.contact.whatsapp}`,
          `कामाचे तास: ${c.contact.businessHours}`,
        ],
      },
      { h: "नोंदणीकृत पत्ता" },
      { p: formattedAddress() },
      { h: "तक्रार निवारण अधिकारी" },
      {
        p: `लागू भारतीय कायद्यानुसार, आमचे तक्रार निवारण अधिकारी ${c.grievanceOfficer.name} आहेत. कोणत्याही तक्रारीसाठी किंवा माहितीसंबंधी विनंतीसाठी ${c.grievanceOfficer.email} वर ईमेल करा; आम्ही ${c.grievanceOfficer.responseSlaHours} तासांत प्रतिसाद देण्याचा प्रयत्न करतो.`,
      },
      { h: "ऑर्डर सहाय्य" },
      {
        p: "ऑर्डर तपासण्यासाठी, तुमचा ऑर्डर क्रमांक व ईमेल वापरून ‘ऑर्डर ट्रॅक करा’ पान वापरा. परतावा किंवा रद्दीकरणासाठी कृपया आमचे परतावा व रद्दीकरण धोरण पहा.",
      },
    ],
  },
};
