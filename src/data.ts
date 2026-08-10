import {
  Activity,
  Apple,
  Bone,
  Brain,
  Flower2,
  Leaf,
  MoonStar,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  Zap,
} from "lucide-react";

export type ProductRange = "Ayurveda" | "Nutraceuticals" | "External Wellness";
export type ProductStatus = "Signature" | "New" | "Featured";

export type Product = {
  id: string;
  name: string;
  range: string | ProductRange;
  format: string;
  image: string;
  descriptor: string;
  goals: string[];
  status: string | ProductStatus;
  mrp: number;
  price: number;
  isVeg: boolean;
  inStock: boolean;
// Additional API fields (mapped directly from the backend; optional & additive)
  category?: string;
  variantId?: number;
  sku?: string;
  brand?: string;
  rating?: number;
  discountPercentage?: number;
  stock?: number;
  available?: boolean;
  slug?: string;
  packSize?: string;
  composition?: string;
  dosageForm?: string;
  manufacturer?: string;
  keyIngredients?: string;
  directions?: string;
  warnings?: string;
  storage?: string;
  gst?: number;
  licence?: string;
};

export const announcements = [
  "Welcome to Pradnyasanskar — thoughtful wellness begins with clarity.",
  "Explore Ayurveda, nutraceuticals and external wellness in one modern experience.",
  "Join the Pradnyasanskar community for product stories, ingredient education and brand updates.",
];

export const heroSlides = [
  {
    id: "wisdom",
    eyebrow: "Ayurvedic wisdom. Modern clarity.",
    titleLead: "Rooted in",
    accent: "wisdom.",
    titleEnd: "Made for everyday life.",
    copy: "Explore Ayurveda, nutraceuticals and external wellness through transparent compositions, familiar formats and routines designed to make every choice easier to understand.",
    image: "/images/skin-glow.webp",
    supportImage: "/images/hero-products.webp",
    imagePosition: "center 22%",
    primary: "Explore products",
    secondary: "Find your focus",
    floatingEyebrow: "Clarity before choice",
    floatingCopy: "Understand the range, ingredients, format and intended routine before you explore.",
  },
  {
    id: "routines",
    eyebrow: "Wellness that moves with you",
    titleLead: "Build a",
    accent: "rhythm",
    titleEnd: "that fits real life.",
    copy: "Discover products through the moments they naturally belong in—from a clear morning start to nourishment, care, family time and a quieter close.",
    image: "/images/daily-wellness.webp",
    supportImage: "/images/hero-composition-2.webp",
    imagePosition: "center 28%",
    primary: "Shop by routine",
    secondary: "Discover the range",
    floatingEyebrow: "Your everyday rhythm",
    floatingCopy: "Six familiar moments, connected through one simple and lively wellness journey.",
  },
  {
    id: "gifting",
    eyebrow: "Wellness, thoughtfully shared",
    titleLead: "Beautifully chosen.",
    accent: "Meaningfully",
    titleEnd: "shared.",
    copy: "Bring together considered wellness selections for personal rituals, family care, celebrations and gifts that feel genuinely useful.",
    image: "/images/campaign-gift.webp",
    supportImage: "/images/cta-gift.webp",
    imagePosition: "center 28%",
    primary: "Explore wellness sets",
    secondary: "Join the community",
    floatingEyebrow: "A more thoughtful gift",
    floatingCopy: "Purposeful combinations, premium presentation and product information kept clear.",
  },
];

export const wellnessFocus = [
  {
    id: "skin",
    title: "Skin & Glow",
    copy: "Bring beauty nutrition and external care together in one clear skin-and-glow routine.",
    image: "/images/source/wellness-focus-1.png",
    alternateImage: "/images/extra-skin.webp",
    icon: Sparkles,
    goal: "Skin & Hair",
    accent: "#FFE9DD",
  },
  {
    id: "hair",
    title: "Hair Wellness",
    copy: "Explore hair oils, serums and nutritional formats as parts of one considered hair-care ritual.",
    image: "/images/source/wellness-focus-2.png",
    alternateImage: "/images/extra-hair.webp",
    icon: Flower2,
    goal: "Skin & Hair",
    accent: "#F0E9FF",
  },
  {
    id: "digestion",
    title: "Digestion & Gut",
    copy: "Discover practical digestive-wellness formats that can fit comfortably into everyday routines.",
    image: "/images/source/wellness-focus-3.png",
    icon: Apple,
    goal: "Digestive Wellness",
    accent: "#FFF0D9",
  },
  {
    id: "immunity",
    title: "Immunity Support",
    copy: "Explore everyday nutritional and botanical formats grouped around immunity-support routines.",
    image: "/images/source/wellness-focus-4.png",
    icon: ShieldCheck,
    goal: "Immunity Support",
    accent: "#EAF4E4",
  },
  {
    id: "energy",
    title: "Energy & Vitality",
    copy: "Find nutrition-led formats that complement active days and consistent wellness habits.",
    image: "/images/source/wellness-focus-5.png",
    alternateImage: "/images/extra-energy.webp",
    icon: Zap,
    goal: "Energy & Vitality",
    accent: "#FFF0D8",
  },
  {
    id: "sleep",
    title: "Sleep & Relaxation",
    copy: "Explore relaxation-led formats for quieter evenings and thoughtful wind-down rituals.",
    image: "/images/source/wellness-focus-6.png",
    icon: MoonStar,
    goal: "Sleep & Relaxation",
    accent: "#EEE8FF",
  },
  {
    id: "mobility",
    title: "Joint & Mobility",
    copy: "Discover movement-focused products for active, uncomplicated joint and mobility routines.",
    image: "/images/source/wellness-focus-7.png",
    alternateImage: "/images/extra-mobility.webp",
    icon: Bone,
    goal: "Joint & Mobility",
    accent: "#EDF4E8",
  },
  {
    id: "daily",
    title: "Daily Wellness",
    copy: "Browse flexible daily essentials designed for regular, easy-to-follow wellness habits.",
    image: "/images/source/wellness-focus-8.png",
    alternateImage: "/images/extra-daily.webp",
    icon: Sun,
    goal: "Daily Wellness",
    accent: "#F5EDFF",
  },
];

export const routines = [
  { title: "Morning Wellness", copy: "Begin with hydration, nutrition and a simple ritual that feels easy to repeat.", image: "/images/source/routine-rhythm-1.png", icon: Sun },
  { title: "Focused Hours", copy: "Keep supportive formats close while work, study and everyday responsibilities take centre stage.", image: "/images/source/routine-rhythm-2.png", icon: Zap },
  { title: "Personal Care", copy: "Create a slower care moment around skin, hair and external-wellness formats.", image: "/images/source/routine-rhythm-3.png", icon: Sparkles },
  { title: "Everyday Nutrition", copy: "Bring familiar nutritional formats into meals and moments that already belong to your routine.", image: "/images/source/routine-rhythm-4.png", icon: Activity },
  { title: "Evening Unwind", copy: "Shift into a gentler pace with warm, calm and uncomplicated evening rituals.", image: "/images/source/routine-rhythm-5.png", icon: MoonStar },
  { title: "Family Wellness", copy: "Make room for flexible wellness choices that can sit naturally within a shared household.", image: "/images/family-wellness.webp", icon: Users },
];

export const products: Product[] = [
  { id: "ashwagandha-capsules", name: "Ashwagandha Capsules", range: "Ayurveda", format: "Capsules", image: "/images/ashwagandha-capsules.png", descriptor: "A recognised Ayurvedic botanical in a convenient capsule format.", goals: ["Daily Wellness", "Sleep & Relaxation", "Energy & Vitality"], status: "Featured", mrp: 599, price: 499, isVeg: true, inStock: true },
  { id: "plant-protein", name: "Plant Protein", range: "Nutraceuticals", format: "Powder", image: "/images/plant-protein.png", descriptor: "A modern powder format for everyday nutritional routines.", goals: ["Energy & Vitality", "Daily Wellness"], status: "Signature", mrp: 1299, price: 999, isVeg: true, inStock: true },
  { id: "daily-greens", name: "Daily Greens", range: "Nutraceuticals", format: "Powder", image: "/images/daily-greens.png", descriptor: "A greens-based format created for simple daily discovery.", goals: ["Daily Wellness", "Energy & Vitality"], status: "New", mrp: 999, price: 849, isVeg: true, inStock: true },
  { id: "immunity-booster", name: "Immunity Booster", range: "Nutraceuticals", format: "Capsules", image: "/images/immunity-booster.png", descriptor: "A nutritional capsule format grouped within immunity-focused discovery.", goals: ["Immunity Support", "Daily Wellness"], status: "Featured", mrp: 649, price: 549, isVeg: true, inStock: true },
  { id: "multivitamin", name: "Multivitamin", range: "Nutraceuticals", format: "Capsules", image: "/images/multivitamin.png", descriptor: "A familiar nutritional format for everyday wellness routines.", goals: ["Daily Wellness", "Energy & Vitality"], status: "Signature", mrp: 699, price: 599, isVeg: true, inStock: true },
  { id: "triphala", name: "Triphala Capsules", range: "Ayurveda", format: "Capsules", image: "/images/triphala.png", descriptor: "A traditional Ayurvedic combination presented in a modern format.", goals: ["Digestive Wellness", "Daily Wellness"], status: "New", mrp: 449, price: 379, isVeg: true, inStock: true },
  { id: "chyawanprash", name: "Chyawanprash", range: "Ayurveda", format: "Lehya", image: "/images/chyawanprash.png", descriptor: "A traditional wellness format presented with clear product information.", goals: ["Daily Wellness", "Immunity Support"], status: "Signature", mrp: 549, price: 469, isVeg: false, inStock: true },
  { id: "herbal-hair-oil", name: "Herbal Hair Oil", range: "External Wellness", format: "Oil", image: "/images/herbal-hair-oil.png", descriptor: "An external wellness format for thoughtful hair-care routines.", goals: ["Skin & Hair"], status: "Featured", mrp: 449, price: 379, isVeg: true, inStock: true },
  { id: "herbal-hair-serum", name: "Herbal Hair Serum", range: "External Wellness", format: "Serum", image: "/images/herbal-hair-serum.png", descriptor: "A lightweight external format for modern hair-care discovery.", goals: ["Skin & Hair"], status: "New", mrp: 499, price: 429, isVeg: false, inStock: true },
  { id: "face-serum", name: "Herbal Face Serum", range: "External Wellness", format: "Serum", image: "/images/face-serum.png", descriptor: "A botanical external-care format for skin-focused routines.", goals: ["Skin & Hair"], status: "Featured", mrp: 699, price: 599, isVeg: true, inStock: true },
  { id: "glow-cream", name: "Glow Cream", range: "External Wellness", format: "Cream", image: "/images/glow-cream.png", descriptor: "A cream format designed for easy external-care discovery.", goals: ["Skin & Hair"], status: "Signature", mrp: 599, price: 499, isVeg: true, inStock: true },
  { id: "digestive-support", name: "Digestive Support", range: "Nutraceuticals", format: "Capsules", image: "/images/digestive-support.png", descriptor: "A modern capsule format grouped for digestive-wellness browsing.", goals: ["Digestive Wellness"], status: "New", mrp: 549, price: 469, isVeg: true, inStock: true },
  { id: "tulsi-giloy", name: "Tulsi-Giloy", range: "Ayurveda", format: "Capsules", image: "/images/tulsi-giloy.png", descriptor: "Recognised botanicals presented through a convenient modern format.", goals: ["Immunity Support", "Daily Wellness"], status: "Featured", mrp: 499, price: 429, isVeg: true, inStock: true },
  { id: "vitamin-c", name: "Vitamin C", range: "Nutraceuticals", format: "Tablets", image: "/images/vitamin-c.png", descriptor: "A familiar nutritional ingredient in a straightforward tablet format.", goals: ["Immunity Support", "Daily Wellness"], status: "Signature", mrp: 399, price: 329, isVeg: true, inStock: true },
  { id: "zinc-selenium", name: "Zinc + Selenium", range: "Nutraceuticals", format: "Capsules", image: "/images/zinc-selenium.png", descriptor: "A mineral-focused capsule format for responsible product discovery.", goals: ["Immunity Support", "Daily Wellness"], status: "New", mrp: 449, price: 379, isVeg: true, inStock: true },
  { id: "joint-support", name: "Joint Support", range: "Nutraceuticals", format: "Capsules", image: "/images/joint-support.png", descriptor: "A capsule format grouped within movement-focused wellness discovery.", goals: ["Joint & Mobility"], status: "Featured", mrp: 749, price: 649, isVeg: false, inStock: true },
  { id: "sleep-support", name: "Sleep Support", range: "Nutraceuticals", format: "Capsules", image: "/images/sleep-support.png", descriptor: "A product format grouped for calm evening and wind-down browsing.", goals: ["Sleep & Relaxation"], status: "Signature", mrp: 649, price: 549, isVeg: true, inStock: true },
  { id: "probiotic-gut-balance", name: "Probiotic Gut Balance", range: "Nutraceuticals", format: "Capsules", image: "/images/probiotic-gut-balance.png", descriptor: "A modern capsule format grouped within digestive-wellness discovery.", goals: ["Digestive Wellness"], status: "New", mrp: 799, price: 699, isVeg: true, inStock: true },
];

export const ingredients = [
  {
    name: "Ashwagandha",
    technical: "Withania somnifera",
    image: "/images/source/botanical-1.png",
    copy: "A widely recognised Ayurvedic botanical used across traditional wellness formats.",
    nutrients: ["Withanolides", "Plant alkaloids", "Sitoindosides"],
    benefits: ["Stress-response routines", "Daily vitality", "Evening wellness rituals"],
  },
  {
    name: "Amla",
    technical: "Phyllanthus emblica",
    image: "/images/source/botanical-2.png",
    copy: "A familiar botanical found in multiple traditional product categories.",
    nutrients: ["Vitamin C", "Polyphenols", "Natural tannins"],
    benefits: ["Antioxidant nutrition", "Skin and hair formats", "Everyday wellness"],
  },
  {
    name: "Turmeric",
    technical: "Curcuma longa",
    image: "/images/source/botanical-3.png",
    copy: "A recognised botanical presented with product-specific composition and directions.",
    nutrients: ["Curcuminoids", "Volatile oils", "Plant polysaccharides"],
    benefits: ["Antioxidant support", "Movement-focused routines", "Daily botanical nutrition"],
  },
  {
    name: "Aloe Vera",
    technical: "Aloe barbadensis",
    image: "/images/source/botanical-4.png",
    copy: "A botanical ingredient commonly used across external-care product formats.",
    nutrients: ["Polysaccharides", "Plant sterols", "Amino acids"],
    benefits: ["Hydration-focused care", "Skin-comfort routines", "External wellness formats"],
  },
  {
    name: "Tulsi & Brahmi",
    technical: "Ocimum tenuiflorum + Bacopa monnieri",
    image: "/images/source/botanical-6.png",
    copy: "Two familiar botanicals presented with ingredient identity and quantity linked to approved product information.",
    nutrients: ["Eugenol", "Ursolic acid", "Bacosides"],
    benefits: ["Focus-oriented routines", "Calm daily rituals", "Traditional botanical blends"],
  },
  {
    name: "Saffron & Rose",
    technical: "Crocus sativus + Rosa species",
    image: "/images/source/botanical-5.png",
    copy: "An educational look at botanicals often seen in beauty and external wellness formats.",
    nutrients: ["Crocin", "Safranal", "Rose flavonoids"],
    benefits: ["Sensory wellness rituals", "Beauty-care formats", "Premium botanical blends"],
  },
  {
    name: "Neem & Hibiscus",
    technical: "Azadirachta indica + Hibiscus rosa-sinensis",
    image: "/images/source/botanical-7.png",
    copy: "A visual ingredient guide for hair and external-care product discovery.",
    nutrients: ["Neem limonoids", "Anthocyanins", "Plant mucilage"],
    benefits: ["Scalp-care routines", "Hair-focused formats", "Cleansing botanical blends"],
  },
  {
    name: "Greens Nutrition",
    technical: "Modern nutritional blend",
    image: "/images/source/botanical-8.png",
    copy: "A contemporary nutritional format presented through clear composition information.",
    nutrients: ["Chlorophyll", "Phytonutrients", "Fibre and micronutrients"],
    benefits: ["Daily nutrient variety", "Convenient greens routines", "Everyday nourishment"],
  },
];

export const brandPrinciples = [
  { title: "Understand", copy: "Composition, product format, directions and cautions should be easy to find.", icon: Brain },
  { title: "Choose", copy: "Ayurveda and nutraceutical ranges should remain clearly distinct and easy to compare.", icon: Leaf },
  { title: "Use responsibly", copy: "Approved directions and warnings belong close to every product decision.", icon: ShieldCheck },
];

export const faqs = [
  ["What is Pradnyasanskar?", "Pradnyasanskar Enterprises Pvt. Ltd. is a modern Indian wellness brand bringing Ayurveda, nutraceuticals and external-wellness formats together through clear, responsible product information."],
  ["How are Ayurveda and nutraceutical products distinguished?", "Each range has its own visual identity, product classification, composition structure and information hierarchy so that customers can understand what they are exploring."],
  ["Where can I find complete composition and directions?", "Complete composition, directions, cautions, storage information and declarations are presented on the individual product page and product label."],
  ["Can the website recommend treatment or personalised dosage?", "No. The discovery tools are designed for general product browsing and education; they do not diagnose, prescribe or replace advice from a qualified professional."],
  ["How can I receive brand updates?", "Join the Pradnyasanskar community through the newsletter form to receive product stories, ingredient education and approved offers."],
  ["How can businesses connect with Pradnyasanskar?", "The business enquiry channel covers distributor interest, bulk purchase, institutional supply, private label, product development and contract-manufacturing discussions, subject to company confirmation."],
] as const;
