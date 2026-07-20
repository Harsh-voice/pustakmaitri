// Canonical category set (34) + normalization for the 82 messy raw values found
// in the source spreadsheet's column 20. Shared by the seed importer and the UI
// so both render exactly the same set.

export type CanonicalCategory = {
  slug: string;
  nameEn: string;
  nameMr: string;
};

export const CANONICAL_CATEGORIES: CanonicalCategory[] = [
  { slug: "balsahitya", nameEn: "Children's Literature", nameMr: "बालसाहित्य" },
  { slug: "katha", nameEn: "Short Stories", nameMr: "कथासंग्रह" },
  { slug: "charitra", nameEn: "Biography", nameMr: "चरित्र" },
  { slug: "kadambari", nameEn: "Novel", nameMr: "कादंबरी" },
  { slug: "mahitipar", nameEn: "Informative", nameMr: "माहितीपर" },
  { slug: "vyaktimatva-vikas", nameEn: "Personality Development", nameMr: "व्यक्तिमत्त्व विकास" },
  { slug: "kavita", nameEn: "Poetry", nameMr: "कवितासंग्रह" },
  { slug: "vaicharik", nameEn: "Ideas & Thought", nameMr: "वैचारिक" },
  { slug: "aadiwasi-sahitya", nameEn: "Tribal Literature", nameMr: "आदिवासी साहित्य" },
  { slug: "lekhsangrah", nameEn: "Essays", nameMr: "लेखसंग्रह" },
  { slug: "adhyatmik", nameEn: "Spiritual", nameMr: "आध्यात्मिक" },
  { slug: "sahitya-samiksha", nameEn: "Literary Criticism", nameMr: "साहित्य समीक्षा" },
  { slug: "vidnyan", nameEn: "Science", nameMr: "विज्ञान" },
  { slug: "lalit", nameEn: "Lalit (Literary Prose)", nameMr: "ललित" },
  { slug: "aitihasik", nameEn: "Historical", nameMr: "ऐतिहासिक" },
  { slug: "aatmakathan", nameEn: "Autobiography", nameMr: "आत्मकथन" },
  { slug: "arogya", nameEn: "Health", nameMr: "आरोग्य" },
  { slug: "anubhavkathan", nameEn: "Memoir / Experiences", nameMr: "अनुभवकथन" },
  { slug: "natak", nameEn: "Drama", nameMr: "नाटक" },
  { slug: "shaikshanik", nameEn: "Educational", nameMr: "शैक्षणिक" },
  { slug: "spardha-pariksha", nameEn: "Competitive Exams", nameMr: "स्पर्धा परीक्षा" },
  { slug: "sahitya", nameEn: "Literature (general)", nameMr: "साहित्य" },
  { slug: "arth-vitta", nameEn: "Finance & Economics", nameMr: "अर्थशास्त्र" },
  { slug: "krida", nameEn: "Sports", nameMr: "क्रीडा" },
  { slug: "manasshastra", nameEn: "Psychology", nameMr: "मानसशास्त्र" },
  { slug: "palakatva", nameEn: "Parenting", nameMr: "पालकत्व" },
  { slug: "krushi", nameEn: "Agriculture", nameMr: "कृषी" },
  { slug: "pravasvarnan", nameEn: "Travelogue", nameMr: "प्रवासवर्णन" },
  { slug: "kayda", nameEn: "Law", nameMr: "कायदा" },
  { slug: "paakkala", nameEn: "Cookery", nameMr: "पाककला" },
  { slug: "kala", nameEn: "Arts", nameMr: "कला" },
  { slug: "fiction", nameEn: "Fiction", nameMr: "कथात्मक साहित्य" },
  { slug: "samajik-rajkiy", nameEn: "Social & Political", nameMr: "सामाजिक-राजकीय" },
  { slug: "itar", nameEn: "Other", nameMr: "इतर" },
];

const CANONICAL_SLUGS = new Set(CANONICAL_CATEGORIES.map((c) => c.slug));

// Raw (UPPERCASED, trimmed) spreadsheet value -> canonical slug.
// Covers every one of the 82 distinct raw values, incl. typos and leaked
// publisher names (folded to `itar`).
const CATEGORY_ALIASES: Record<string, string> = {
  BALSAHITYA: "balsahitya",
  KUMARVANGMAY: "balsahitya",
  KATHASANGRAHA: "katha",
  CHARITRA: "charitra",
  VYAKTICHARITRA: "charitra",
  VYAKTICHITRE: "charitra",
  "VAICHARIK CHARITRA": "charitra",
  KADAMBARI: "kadambari",
  KADMBARI: "kadambari",
  "AADIWASI KADMBRI": "kadambari",
  "AATMCHARITRATMAK KADMBARI": "kadambari",
  PREMKAHANI: "kadambari",
  INFORMATIVE: "mahitipar",
  MAHITIPAR: "mahitipar",
  "NON FICTION": "mahitipar",
  "PERSONALITY DEVELOPMENT": "vyaktimatva-vikas",
  CARRER: "vyaktimatva-vikas",
  CAREER: "vyaktimatva-vikas",
  KAVITASANGRAHA: "kavita",
  VAICHARIK: "vaicharik",
  "AADIWASI SAHITYA": "aadiwasi-sahitya",
  LEKHSANGRAH: "lekhsangrah",
  PATRASAGRAH: "lekhsangrah",
  SPIRTUAL: "adhyatmik",
  SPRITUAL: "adhyatmik",
  SPIRITUAL: "adhyatmik",
  "SANT SAHITYA": "adhyatmik",
  GEETA: "adhyatmik",
  SHREEVIDYA: "adhyatmik",
  GARBHSANSKAR: "adhyatmik",
  "SAHITYA SAMIKSHA": "sahitya-samiksha",
  SAMIKSHA: "sahitya-samiksha",
  SCIENCE: "vidnyan",
  TECHNICAL: "vidnyan",
  LALIT: "lalit",
  LATIT: "lalit",
  HISTORICAL: "aitihasik",
  POURANIK: "aitihasik",
  "SAHITYA ITIHAS": "aitihasik",
  "VANGMAY ITIHAS": "aitihasik",
  AATMKATHAN: "aatmakathan",
  AATMACHARITRA: "aatmakathan",
  AATMCHARITRA: "aatmakathan",
  HEALTH: "arogya",
  ANUBHAVKATHAN: "anubhavkathan",
  NATAK: "natak",
  EDUCATIONAL: "shaikshanik",
  ABHYASKRAM: "shaikshanik",
  BHASHA: "shaikshanik",
  "MARATHI VYAKARAN": "shaikshanik",
  "COMPETATIVE EXAM": "spardha-pariksha",
  SAHITYA: "sahitya",
  "DIWALI ANK": "sahitya",
  LOKSAHITYA: "sahitya",
  FINANCE: "arth-vitta",
  ARTH: "arth-vitta",
  BUSINESS: "arth-vitta",
  SPORT: "krida",
  PSYCHOLOGY: "manasshastra",
  PCSYCHOLOGY: "manasshastra",
  PHILOSOPHY: "manasshastra",
  PALKATAV: "palakatva",
  AGRICUITURE: "krushi",
  AGRICULTURE: "krushi",
  KRUSHI: "krushi",
  PRAWASWARNAN: "pravasvarnan",
  PRAWASVARNAN: "pravasvarnan",
  PRAVASVARNAN: "pravasvarnan",
  LAW: "kayda",
  PAKKALA: "paakkala",
  MUSIC: "kala",
  VASTU: "kala",
  FICTION: "fiction",
  SAMAJIK: "samajik-rajkiy",
  RAJKIY: "samajik-rajkiy",
  JOURNALISAM: "samajik-rajkiy",
  SANSHODHAN: "samajik-rajkiy",
  // Leaked publisher names / junk -> Other
  NA: "itar",
  "400": "itar",
  NBT: "itar",
  ROHAN: "itar",
  FRAME: "itar",
  EARTH: "itar",
  "ENGLISH LITERATURE": "itar",
};

/** Map a raw spreadsheet category value to a canonical slug (fallback `itar`). */
export function normalizeCategory(raw?: string | null): string {
  const key = (raw ?? "").trim().toUpperCase();
  if (!key) return "itar";
  if (CATEGORY_ALIASES[key]) return CATEGORY_ALIASES[key];
  const lower = key.toLowerCase();
  if (CANONICAL_SLUGS.has(lower)) return lower;
  return "itar";
}
