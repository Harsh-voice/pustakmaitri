import { siteConfig } from "@/lib/site-config";
import type { LegalBundle } from "./types";

const c = siteConfig;

export const privacy: LegalBundle = {
  en: {
    title: "Privacy Policy",
    updated: c.policyLastUpdated,
    intro: `This policy explains how ${c.legalName} ("${c.tradeName}") collects, uses and protects your personal data when you use this website.`,
    blocks: [
      { h: "1. Data controller" },
      { p: `${c.legalName}, operating as ${c.tradeName}. Contact: ${c.contact.email}.` },
      { h: "2. Data we collect" },
      {
        ul: [
          "Contact and delivery details: name, email, phone and shipping address.",
          "Order information: the books you order and your order history.",
          "Technical data: basic cookies needed for the site and cart to function.",
        ],
      },
      {
        p: `Payments are processed by ${c.payments.gatewayName}. We never receive or store your full card number, UPI PIN or bank credentials.`,
      },
      { h: "3. How we use your data" },
      {
        ul: [
          "To process and deliver your orders.",
          "To provide customer support and respond to queries.",
          "To meet legal, accounting and tax obligations.",
        ],
      },
      { h: "4. Legal basis & consent" },
      { p: "We process your data to perform the purchase contract with you and to comply with law. By placing an order you consent to this processing." },
      { h: "5. Sharing" },
      {
        ul: [
          `${c.payments.gatewayName} — to process payments.`,
          "Courier / logistics partners — to deliver your order.",
          "Our hosting provider — to run the website.",
        ],
      },
      { p: "We do not sell your personal data." },
      { h: "6. Cookies" },
      { p: "We use only the cookies and local storage needed for the site and your shopping cart to work. We do not use them to build advertising profiles." },
      { h: "7. Data retention" },
      { p: "We keep order records only as long as needed for fulfilment and to meet legal and tax requirements, then delete or anonymise them." },
      { h: "8. Security" },
      { p: "The site runs over HTTPS/TLS, and payments are handled by a PCI-DSS-compliant gateway. We apply reasonable safeguards to protect your data." },
      { h: "9. Your rights" },
      { p: `You may request access to, correction of, or deletion of your personal data by emailing ${c.contact.email}.` },
      { h: "10. Children" },
      { p: "The site is not directed at children under 18, and we do not knowingly collect their data." },
      { h: "11. Grievance officer" },
      {
        p: `For privacy questions or complaints, contact our grievance officer ${c.grievanceOfficer.name} at ${c.grievanceOfficer.email}. We aim to respond within ${c.grievanceOfficer.responseSlaHours} hours.`,
      },
      { h: "12. Changes" },
      { p: `We may update this policy; the current version is dated ${c.policyLastUpdated}.` },
    ],
  },
  mr: {
    title: "गोपनीयता धोरण",
    updated: c.policyLastUpdated,
    intro: `हे धोरण, तुम्ही हे संकेतस्थळ वापरताना ${c.legalName} ("${c.tradeNameMr}") तुमची वैयक्तिक माहिती कशी गोळा, वापर व संरक्षण करते हे स्पष्ट करते.`,
    blocks: [
      { h: "१. माहिती नियंत्रक" },
      { p: `${c.tradeNameMr} या नावाने कार्यरत ${c.legalName}. संपर्क: ${c.contact.email}.` },
      { h: "२. आम्ही गोळा करत असलेली माहिती" },
      {
        ul: [
          "संपर्क व वितरण तपशील: नाव, ईमेल, फोन व वितरण पत्ता.",
          "ऑर्डर माहिती: तुम्ही मागवलेली पुस्तके व तुमचा ऑर्डर इतिहास.",
          "तांत्रिक माहिती: संकेतस्थळ व कार्ट चालण्यासाठी आवश्यक मूलभूत कुकीज.",
        ],
      },
      {
        p: `पेमेंट ${c.payments.gatewayName} द्वारे प्रक्रिया केले जाते. तुमचा संपूर्ण कार्ड क्रमांक, UPI पिन किंवा बँक तपशील आम्हाला मिळत नाही व साठवला जात नाही.`,
      },
      { h: "३. माहितीचा वापर" },
      {
        ul: [
          "तुमच्या ऑर्डरची प्रक्रिया व वितरण करण्यासाठी.",
          "ग्राहक सहाय्य व प्रश्नांना उत्तर देण्यासाठी.",
          "कायदेशीर, लेखा व कर बंधने पूर्ण करण्यासाठी.",
        ],
      },
      { h: "४. कायदेशीर आधार व संमती" },
      { p: "तुमच्यासोबतचा खरेदी करार पूर्ण करण्यासाठी व कायद्याचे पालन करण्यासाठी आम्ही माहिती वापरतो. ऑर्डर देऊन तुम्ही या प्रक्रियेस संमती देता." },
      { h: "५. माहिती सामायिकरण" },
      {
        ul: [
          `${c.payments.gatewayName} — पेमेंट प्रक्रियेसाठी.`,
          "कुरिअर / लॉजिस्टिक्स भागीदार — ऑर्डर वितरणासाठी.",
          "आमचा होस्टिंग पुरवठादार — संकेतस्थळ चालवण्यासाठी.",
        ],
      },
      { p: "आम्ही तुमची वैयक्तिक माहिती विकत नाही." },
      { h: "६. कुकीज" },
      { p: "संकेतस्थळ व तुमची खरेदी कार्ट चालण्यासाठी आवश्यक तेवढ्याच कुकीज व लोकल स्टोरेज आम्ही वापरतो. जाहिरात प्रोफाइल तयार करण्यासाठी त्यांचा वापर करत नाही." },
      { h: "७. माहिती जतन" },
      { p: "ऑर्डर पूर्तता व कायदेशीर-कर आवश्यकतांसाठी लागेल तेवढाच काळ आम्ही नोंदी ठेवतो, नंतर त्या हटवतो किंवा निनावी करतो." },
      { h: "८. सुरक्षा" },
      { p: "संकेतस्थळ HTTPS/TLS वर चालते व पेमेंट PCI-DSS सुसंगत गेटवेद्वारे हाताळले जाते. तुमच्या माहितीच्या संरक्षणासाठी आम्ही योग्य उपाययोजना करतो." },
      { h: "९. तुमचे हक्क" },
      { p: `${c.contact.email} वर ईमेल करून तुम्ही तुमच्या वैयक्तिक माहितीचा प्रवेश, दुरुस्ती किंवा हटवण्याची विनंती करू शकता.` },
      { h: "१०. बालके" },
      { p: "हे संकेतस्थळ १८ वर्षांखालील बालकांसाठी नाही व आम्ही जाणूनबुजून त्यांची माहिती गोळा करत नाही." },
      { h: "११. तक्रार निवारण अधिकारी" },
      {
        p: `गोपनीयतेसंबंधी प्रश्न किंवा तक्रारींसाठी आमचे तक्रार निवारण अधिकारी ${c.grievanceOfficer.name} यांच्याशी ${c.grievanceOfficer.email} वर संपर्क साधा. आम्ही ${c.grievanceOfficer.responseSlaHours} तासांत प्रतिसाद देण्याचा प्रयत्न करतो.`,
      },
      { h: "१२. बदल" },
      { p: `आम्ही हे धोरण अद्ययावत करू शकतो; सध्याची आवृत्ती ${c.policyLastUpdated} रोजीची आहे.` },
    ],
  },
};
