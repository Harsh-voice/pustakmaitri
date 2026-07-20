import { siteConfig } from "@/lib/site-config";
import type { LegalBundle } from "./types";

const c = siteConfig;

export const about: LegalBundle = {
  en: {
    title: "About Us",
    updated: c.policyLastUpdated,
    intro: `${c.tradeName} is a bilingual (Marathi & English) online bookstore offering a curated collection of around 2,900 Marathi titles — novels, poetry, biographies, children's literature, spirituality and more — delivered across India.`,
    blocks: [
      { h: "Who we are" },
      {
        p: `${c.tradeName} is operated by ${c.legalName}, a sole proprietorship registered under the Udyam (MSME) scheme (Udyam Registration Number: ${c.udyamRegistrationNumber}). The proprietor is ${c.proprietorName}.`,
      },
      { p: `Principal place of business: ${[c.contact.address.city, c.contact.address.state].filter(Boolean).join(", ")}.` },
      { h: "What we do" },
      {
        p: "We help readers discover and buy Marathi books online, with secure online payments and doorstep delivery. Our catalogue spans a wide range of categories so readers of every interest can find something to enjoy.",
      },
      {
        ul: [
          "A large, searchable catalogue of Marathi titles.",
          "Secure online payments (UPI, cards, net banking, wallets) via Razorpay.",
          "Doorstep delivery across India.",
        ],
      },
      { h: "Contact" },
      {
        p: `Questions? Email us at ${c.contact.email} or visit our Contact page. You can also review our Terms, Privacy, Refund and Shipping policies, all linked in the footer.`,
      },
    ],
  },
  mr: {
    title: "आमच्याविषयी",
    updated: c.policyLastUpdated,
    intro: `${c.tradeNameMr} हे द्विभाषिक (मराठी व इंग्रजी) ऑनलाइन पुस्तकांचे दुकान असून सुमारे २,९०० निवडक मराठी पुस्तके — कादंबरी, कविता, चरित्रे, बालसाहित्य, अध्यात्म व बरेच काही — संपूर्ण भारतात घरपोच पुरवते.`,
    blocks: [
      { h: "आम्ही कोण आहोत" },
      {
        p: `${c.tradeNameMr} हे ${c.legalName} या उद्यम (MSME) योजनेअंतर्गत नोंदणीकृत एकल मालकी संस्थेद्वारे चालवले जाते (उद्यम नोंदणी क्रमांक: ${c.udyamRegistrationNumber}). मालक: ${c.proprietorName}.`,
      },
      { p: `मुख्य व्यवसाय ठिकाण: ${[c.contact.address.city, c.contact.address.state].filter(Boolean).join(", ")}.` },
      { h: "आम्ही काय करतो" },
      {
        p: "वाचकांना मराठी पुस्तके ऑनलाइन शोधण्यात व खरेदी करण्यात आम्ही मदत करतो — सुरक्षित ऑनलाइन पेमेंट व घरपोच वितरणासह. आमच्या संग्रहात विविध विभाग आहेत, त्यामुळे प्रत्येक आवडीच्या वाचकाला काहीतरी सापडेल.",
      },
      {
        ul: [
          "मराठी पुस्तकांचा मोठा, शोधण्यायोग्य संग्रह.",
          "Razorpay द्वारे सुरक्षित ऑनलाइन पेमेंट (UPI, कार्ड, नेट बँकिंग, वॉलेट).",
          "संपूर्ण भारतात घरपोच वितरण.",
        ],
      },
      { h: "संपर्क" },
      {
        p: `प्रश्न आहेत? आम्हाला ${c.contact.email} वर ईमेल करा किंवा आमचे संपर्क पान पहा. तळटीपेत अटी, गोपनीयता, परतावा व वितरण धोरणेही उपलब्ध आहेत.`,
      },
    ],
  },
};
