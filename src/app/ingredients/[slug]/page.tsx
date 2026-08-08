"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  Moon,
  ShieldCheck,
  Zap,
  Activity,
  Sparkles,
  Droplets,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PageLayout } from "@/components/PageLayout";
import { useProducts } from "@/lib/useProducts";
import { useApp } from "@/components/AppContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type ConcernKey = "stress" | "immunity" | "energy" | "digestion" | "skin-hair" | "detox";

interface IngredientData {
  name: string;
  botanical: string;
  tagline: string;
  heroImage: string;
  heroImageAlt: string;
  accentColor: string;
  benefits: { icon: React.ElementType; title: string; description: string }[];
  about: {
    heading: string;
    paragraphs: string[];
    stat: { label: string; value: string; sub: string };
    classification: { label: string; value: string; sub: string };
  };
  tradition: { heading: string; points: string[] };
  concerns: ConcernKey[];
  relatedProductIds: string[];
}

// ─── Concern config ───────────────────────────────────────────────────────────

const concernConfig: Record<ConcernKey, { label: string; icon: React.ElementType; color: string }> = {
  stress:     { label: "Stress",       icon: Moon,       color: "bg-[#EEE8FF] text-[#5B3FA6]" },
  immunity:   { label: "Immunity",     icon: ShieldCheck, color: "bg-[#EAF4E4] text-[#315C20]" },
  energy:     { label: "Energy",       icon: Zap,        color: "bg-[#FFF1DA] text-[#9A5D0A]" },
  digestion:  { label: "Digestion",    icon: Activity,   color: "bg-[#E8F4FF] text-[#1A5C8A]" },
  "skin-hair":{ label: "Skin & Hair",  icon: Sparkles,   color: "bg-[#FFF0F5] text-[#8A1A4A]" },
  detox:      { label: "Detox",        icon: Droplets,   color: "bg-[#E8FFF4] text-[#1A6B4A]" },
};

// ─── Ingredient data ──────────────────────────────────────────────────────────

const ingredientData: Record<string, IngredientData> = {
  ashwagandha: {
    name: "Ashwagandha",
    botanical: "Withania somnifera",
    tagline: "The ancient adaptogen that helps your body find its natural balance.",
    heroImage: "/images/ashwagandha.webp",
    heroImageAlt: "Ashwagandha root and powder",
    accentColor: "#8C52FF",
    benefits: [
      {
        icon: Moon,
        title: "Stress Resilience",
        description:
          "Ashwagandha is classified as an adaptogen — a botanical that helps the body adapt to physical and mental stressors. It is traditionally used to support a calmer, more balanced stress response.",
      },
      {
        icon: Zap,
        title: "Energy & Vitality",
        description:
          "Used in Ayurveda as a Rasayana (rejuvenating herb), Ashwagandha is associated with supporting stamina, reducing feelings of fatigue, and promoting overall vitality.",
      },
      {
        icon: ShieldCheck,
        title: "Immune Support",
        description:
          "Ashwagandha contains withanolides and other bioactive compounds that have been studied for their role in supporting the body's natural immune function.",
      },
      {
        icon: Activity,
        title: "Physical Endurance",
        description:
          "Traditionally used by athletes and those with physically demanding lifestyles, Ashwagandha is associated with supporting muscle recovery and physical endurance.",
      },
    ],
    about: {
      heading: "What is Ashwagandha?",
      paragraphs: [
        "Ashwagandha (Withania somnifera) is a small shrub native to India, North Africa, and the Mediterranean. Its roots and berries have been used in Ayurvedic medicine for over 3,000 years, making it one of the most revered herbs in the tradition.",
        "The name 'Ashwagandha' comes from Sanskrit — 'Ashwa' meaning horse and 'Gandha' meaning smell — referring to the distinctive earthy scent of its roots and the traditional belief that consuming it imparts the strength and vitality of a horse.",
        "The primary active constituents are withanolides, a group of naturally occurring steroidal lactones unique to this plant. These compounds, along with alkaloids and sitoindosides, are the subject of ongoing scientific research into the herb's adaptogenic properties.",
        "Ashwagandha root extract is the most commonly used form in modern wellness products. Standardised extracts ensure a consistent level of withanolides per serving, which is important for product quality and reliability.",
      ],
      stat: {
        label: "Traditional Use",
        value: "3,000+",
        sub: "Years of documented use in Ayurvedic medicine",
      },
      classification: {
        label: "Classification",
        value: "Rasayana Herb",
        sub: "Ayurvedic category for rejuvenating and restorative botanicals",
      },
    },
    tradition: {
      heading: "Ashwagandha in Ayurvedic Tradition",
      points: [
        "Classified as a Rasayana herb — a category of Ayurvedic botanicals used for rejuvenation, longevity, and overall vitality.",
        "Mentioned in the Charaka Samhita and Sushruta Samhita, two of the foundational classical texts of Ayurveda, as a herb for promoting strength and nourishing the body.",
        "Traditionally prepared as a milk decoction (Ashwagandha Ksheerapaka) — the root powder simmered in warm milk — a format still used in many Ayurvedic households today.",
        "Considered to balance Vata and Kapha doshas, making it particularly relevant for individuals experiencing fatigue, anxiety, or low vitality according to Ayurvedic assessment.",
        "Used in classical formulations such as Ashwagandhadi Lehyam and Ashwagandha Churna, which remain part of the Ayurvedic pharmacopoeia.",
      ],
    },
    concerns: ["stress", "energy"],
    relatedProductIds: ["ashwagandha-capsules", "sleep-support", "chyawanprash"],
  },

  amla: {
    name: "Amla",
    botanical: "Emblica officinalis",
    tagline: "Nature's richest source of Vitamin C — a cornerstone of Ayurvedic wellness for over 5,000 years.",
    heroImage: "/images/amla.webp",
    heroImageAlt: "Fresh Amla (Indian gooseberry) fruit",
    accentColor: "#8C52FF",
    benefits: [
      {
        icon: ShieldCheck,
        title: "Immunity Support",
        description:
          "Amla is one of the richest natural sources of Vitamin C, a key nutrient for supporting the body's normal immune function. Its Vitamin C content is notably stable due to the presence of tannins that protect it from heat degradation.",
      },
      {
        icon: Sparkles,
        title: "Skin & Hair Nourishment",
        description:
          "Amla's high antioxidant content — including polyphenols, flavonoids, and Vitamin C — supports collagen synthesis and is traditionally used in hair oils and skin formulations to nourish and strengthen from within.",
      },
      {
        icon: Zap,
        title: "Antioxidant Nutrition",
        description:
          "Rich in ellagic acid, gallic acid, and other polyphenols, Amla provides broad antioxidant support that helps the body manage oxidative stress as part of a daily wellness routine.",
      },
      {
        icon: Activity,
        title: "Digestive Wellness",
        description:
          "In Ayurveda, Amla is considered a gentle digestive tonic. It is one of the three fruits in the classical Triphala formulation, traditionally used to support healthy digestion and gut comfort.",
      },
    ],
    about: {
      heading: "What is Amla?",
      stat: {
        label: "Vitamin C Content",
        value: "600–900 mg",
        sub: "Vitamin C per 100 g of fresh Amla fruit — one of the richest natural sources",
      },
      classification: {
        label: "Classification",
        value: "Rasayana & Tridoshic",
        sub: "Rare Ayurvedic herb that balances all three doshas — Vata, Pitta, and Kapha",
      },
      paragraphs: [
        "Amla, also known as Indian Gooseberry, is the fruit of the Emblica officinalis tree — a deciduous tree native to the Indian subcontinent. The small, round, pale-green fruit has been central to Ayurvedic medicine for thousands of years and is considered one of the most important botanicals in the tradition.",
        "The fruit is exceptionally rich in Vitamin C, containing significantly more per gram than most common fruits. What makes Amla's Vitamin C particularly valuable is that it is bound to tannins, which protect the vitamin from degradation during processing and storage — a quality that sets it apart from synthetic ascorbic acid.",
        "Beyond Vitamin C, Amla contains a broad spectrum of polyphenols including emblicanin A and B, punigluconin, pedunculagin, ellagic acid, and gallic acid. These compounds contribute to its antioxidant properties and are the subject of ongoing nutritional research.",
        "In modern wellness products, Amla is used in both internal formats (powders, capsules, and traditional preparations like Chyawanprash) and external formats (hair oils and serums), reflecting its versatility as a botanical ingredient.",
      ],
    },
    tradition: {
      heading: "Amla in Ayurvedic Tradition",
      points: [
        "Known as 'Amalaki' in Sanskrit, Amla is classified as a Rasayana herb — one of the most important rejuvenating botanicals in the Ayurvedic pharmacopoeia, used to support longevity and overall vitality.",
        "One of the three fruits in Triphala (alongside Haritaki and Bibhitaki) — the most widely used classical Ayurvedic formulation, referenced extensively in the Charaka Samhita for digestive and general wellness support.",
        "The primary ingredient in Chyawanprash, the classical Ayurvedic herbal jam, where Amalaki constitutes approximately 40% of the formulation and serves as the foundational ingredient.",
        "Considered to pacify all three doshas (Vata, Pitta, and Kapha) — a rare quality in Ayurveda — making it one of the most universally applicable herbs across different body constitutions.",
        "Traditionally used in Nasya (nasal administration) and as a hair wash (Shikakai preparations) in external Ayurvedic therapies, reflecting its importance in both internal and external wellness rituals.",
      ],
    },
    concerns: ["immunity", "energy", "skin-hair"],
    relatedProductIds: ["chyawanprash", "triphala", "herbal-hair-oil", "immunity-booster"],
  },

  turmeric: {
    name: "Turmeric",
    botanical: "Curcuma longa",
    tagline: "The golden spice of Ayurveda — revered for thousands of years for its role in supporting natural balance and everyday wellness.",
    heroImage: "/images/turmeric.webp",
    heroImageAlt: "Fresh turmeric root and ground turmeric powder",
    accentColor: "#8C52FF",
    benefits: [
      {
        icon: ShieldCheck,
        title: "Antioxidant Support",
        description:
          "Curcumin, the primary active compound in Turmeric, is a well-studied polyphenol with antioxidant properties. It helps the body manage oxidative stress as part of a balanced daily wellness routine.",
      },
      {
        icon: Activity,
        title: "Digestive Comfort",
        description:
          "Turmeric has a long history of use in Ayurveda as a digestive herb. It is traditionally used to support healthy digestion, stimulate bile production, and promote gut comfort after meals.",
      },
      {
        icon: Droplets,
        title: "Natural Detox Support",
        description:
          "In Ayurvedic practice, Turmeric is considered a natural purifier. It is traditionally used to support the body's natural detoxification processes, particularly in relation to liver and blood health.",
      },
      {
        icon: Sparkles,
        title: "Skin Wellness",
        description:
          "Turmeric has been used in traditional skin care for centuries. Its antioxidant and purifying properties make it a valued ingredient in external wellness formulations for supporting a healthy, even complexion.",
      },
    ],
    about: {
      heading: "What is Turmeric?",
      stat: {
        label: "Active Compound",
        value: "2–5%",
        sub: "Curcumin content in dried Turmeric root — the primary bioactive polyphenol",
      },
      classification: {
        label: "Classification",
        value: "Kaphahara & Pittahara",
        sub: "Ayurvedic classification — helps balance Kapha and Pitta doshas",
      },
      paragraphs: [
        "Turmeric (Curcuma longa) is a flowering plant of the ginger family, native to the Indian subcontinent and Southeast Asia. The rhizome — the underground stem — is dried and ground into the familiar golden-yellow powder that has been a staple of Indian cooking, medicine, and ritual for over 4,000 years.",
        "The primary bioactive compounds in Turmeric are curcuminoids, of which curcumin is the most studied. Curcumin gives Turmeric its characteristic deep yellow colour and is the subject of extensive nutritional and botanical research for its antioxidant properties.",
        "One important consideration with Turmeric is bioavailability. Curcumin on its own is poorly absorbed by the body. Traditional Ayurvedic preparations often combined Turmeric with black pepper (Piper nigrum), which contains piperine — a compound known to significantly enhance curcumin absorption. Many modern formulations follow this same principle.",
        "Beyond curcumin, Turmeric contains volatile oils (turmerone, atlantone, zingiberene), polysaccharides, and other plant compounds that contribute to its overall botanical profile. In wellness products, Turmeric is used in both internal formats (capsules, powders) and external formats (creams, face preparations).",
      ],
    },
    tradition: {
      heading: "Turmeric in Ayurvedic Tradition",
      points: [
        "Known as 'Haridra' in Sanskrit, Turmeric is one of the most frequently mentioned herbs in classical Ayurvedic texts including the Charaka Samhita and Sushruta Samhita, where it is described as a purifying and healing botanical.",
        "Classified as a Krimighna (antimicrobial), Varnya (skin-brightening), and Kushtaghna (skin-purifying) herb in Ayurveda — reflecting its traditional use across both internal and external wellness applications.",
        "Haldi doodh (turmeric milk or 'golden milk') is one of the oldest and most widely used traditional Ayurvedic preparations, combining Turmeric with warm milk and sometimes black pepper for daily wellness support.",
        "Used extensively in Panchakarma (Ayurvedic detoxification therapies) as part of preparatory and supportive treatments, reflecting its traditional role in supporting the body's natural cleansing processes.",
        "A central ingredient in traditional Ubtan (herbal paste) preparations used in Ayurvedic skin care rituals, applied topically before bathing to support skin health and complexion — a practice still observed in many Indian households today.",
      ],
    },
    concerns: ["immunity", "digestion", "detox"],
    relatedProductIds: ["joint-support", "glow-cream", "chyawanprash"],
  },

  "aloe-vera": {
    name: "Aloe Vera",
    botanical: "Aloe barbadensis",
    tagline: "The plant of immortality — a cooling, soothing botanical used for centuries in Ayurveda for skin nourishment and digestive wellness.",
    heroImage: "/images/aloe-vera.webp",
    heroImageAlt: "Fresh Aloe Vera plant with cut leaf showing gel",
    accentColor: "#8C52FF",
    benefits: [
      {
        icon: Sparkles,
        title: "Skin Hydration & Soothing",
        description:
          "Aloe Vera gel is composed of approximately 99% water along with polysaccharides, glycoproteins, and plant sterols that help maintain skin hydration and provide a soothing effect on the skin surface. It is widely used in external wellness formulations for its skin-comfort properties.",
      },
      {
        icon: Activity,
        title: "Digestive Comfort",
        description:
          "Aloe Vera latex and inner leaf gel have a long history of traditional use in supporting digestive comfort. In Ayurveda, Aloe is considered a cooling herb that helps soothe the digestive tract and support healthy gut function.",
      },
      {
        icon: Droplets,
        title: "Natural Moisturisation",
        description:
          "The mucilaginous polysaccharides in Aloe Vera gel — particularly acemannan — act as natural humectants, helping to attract and retain moisture in the skin. This makes it a valued ingredient in both internal hydration support and external skin care formats.",
      },
      {
        icon: ShieldCheck,
        title: "Antioxidant Compounds",
        description:
          "Aloe Vera contains vitamins C and E, beta-carotene, and various polyphenols that contribute to its antioxidant profile. These compounds support the skin's natural defence against environmental stressors when used in topical formulations.",
      },
    ],
    about: {
      heading: "What is Aloe Vera?",
      stat: {
        label: "Gel Composition",
        value: "~99%",
        sub: "Water content in fresh Aloe Vera inner leaf gel — the basis of its soothing and hydrating properties",
      },
      classification: {
        label: "Ayurvedic Classification",
        value: "Kumari",
        sub: "Sanskrit name meaning 'young girl' — reflecting its traditional association with rejuvenation and vitality",
      },
      paragraphs: [
        "Aloe Vera (Aloe barbadensis) is a succulent plant species of the genus Aloe, native to the Arabian Peninsula but now cultivated widely across tropical and subtropical regions including India. The thick, fleshy leaves store a clear gel that has been used in traditional medicine systems — including Ayurveda, ancient Egyptian, and Greek medicine — for thousands of years.",
        "The inner leaf gel contains over 75 potentially active constituents including polysaccharides (notably acemannan), vitamins (A, C, E, and B12), minerals, enzymes, amino acids, and plant sterols. The outer leaf layer contains anthraquinones, including aloin, which have traditionally been associated with digestive effects.",
        "In Ayurveda, Aloe Vera is known as 'Kumari' and is classified as a cooling (Sheeta) herb that helps pacify Pitta dosha. It is considered particularly beneficial for conditions associated with excess heat in the body, including skin irritation and digestive discomfort.",
        "In modern wellness products, Aloe Vera is used extensively in external formats — serums, creams, gels, and hair care products — as well as in internal formats such as juices and digestive supplements. Its versatility across both internal and external applications reflects its broad traditional use across multiple wellness traditions.",
      ],
    },
    tradition: {
      heading: "Aloe Vera in Ayurvedic Tradition",
      points: [
        "Known as 'Kumari' in Sanskrit — meaning 'young girl' or 'virgin' — reflecting its traditional association with youth, rejuvenation, and feminine wellness in Ayurvedic practice.",
        "Classified as a Pittahara herb in Ayurveda, used to pacify excess Pitta dosha. Its cooling and soothing properties make it traditionally relevant for skin conditions, digestive heat, and general inflammation-related concerns.",
        "Referenced in the Charaka Samhita and Sushruta Samhita as a herb for skin health, wound care, and digestive support. The Sushruta Samhita specifically mentions its use in external applications for skin conditions.",
        "Used in classical Ayurvedic formulations such as Kumaryasava — a fermented Aloe Vera preparation traditionally used to support digestive wellness and liver function — which remains part of the Ayurvedic pharmacopoeia.",
        "Traditionally applied as a topical gel directly from the fresh leaf for skin soothing, minor burns, and scalp care — a practice that continues in Ayurvedic households and is now supported by modern cosmetic science.",
      ],
    },
    concerns: ["digestion", "skin-hair"],
    relatedProductIds: ["face-serum", "glow-cream", "digestive-support"],
  },

  shatavari: {
    name: "Shatavari",
    botanical: "Asparagus racemosus",
    tagline: "Ayurveda's foremost rejuvenating herb for women — traditionally used to support hormonal balance, vitality, and nourishment at every stage of life.",
    heroImage: "/images/shatavari.webp",
    heroImageAlt: "Shatavari roots, stems and powder",
    accentColor: "#8C52FF",
    benefits: [
      {
        icon: Sparkles,
        title: "Women's Wellness",
        description:
          "Shatavari is Ayurveda's primary herb for supporting women's health across all life stages — from reproductive years through to menopause. It is traditionally used to support hormonal balance, menstrual comfort, and overall feminine vitality.",
      },
      {
        icon: Zap,
        title: "Rejuvenation & Vitality",
        description:
          "Classified as a Rasayana herb, Shatavari is associated with deep nourishment and rejuvenation. It is traditionally used to support energy, stamina, and overall vitality, particularly during periods of physical or emotional depletion.",
      },
      {
        icon: Activity,
        title: "Digestive Comfort",
        description:
          "Shatavari has a cooling, soothing quality in Ayurveda and is traditionally used to support the digestive tract. Its mucilaginous properties are associated with soothing the gut lining and supporting healthy digestion.",
      },
      {
        icon: ShieldCheck,
        title: "Immune & Nutritive Support",
        description:
          "Rich in steroidal saponins, polysaccharides, and flavonoids, Shatavari provides broad nutritive support. It is traditionally used as a tonic herb to nourish the body and support the immune system as part of a daily wellness routine.",
      },
    ],
    about: {
      heading: "What is Shatavari?",
      stat: {
        label: "Traditional Use",
        value: "5,000+",
        sub: "Years of documented use in Ayurvedic medicine — one of the oldest Rasayana herbs in the tradition",
      },
      classification: {
        label: "Ayurvedic Classification",
        value: "Stanya & Rasayana",
        sub: "Stanya — supports lactation and feminine wellness; Rasayana — rejuvenating and restorative botanical",
      },
      paragraphs: [
        "Shatavari (Asparagus racemosus) is a climbing shrub native to India, Sri Lanka, and the Himalayas. Its tuberous roots — the primary medicinal part — have been used in Ayurvedic medicine for thousands of years, making it one of the most revered herbs in the tradition, particularly for women's health.",
        "The name 'Shatavari' comes from Sanskrit — 'Shata' meaning one hundred and 'Vari' meaning husband or root — traditionally interpreted as 'she who possesses a hundred husbands' or 'she who has a hundred roots', reflecting its association with vitality, fertility, and nourishment.",
        "The primary bioactive compounds in Shatavari are steroidal saponins known as shatavarins (particularly shatavarin I–IV), along with isoflavones, polysaccharides, mucilage, and flavonoids including quercetin and rutin. These compounds are the subject of ongoing research into the herb's adaptogenic and nutritive properties.",
        "In modern wellness products, Shatavari is used in internal formats such as capsules, powders, and traditional preparations like Shatavari Kalpa (a sweetened milk preparation). It is particularly valued in women's wellness formulations and as a general Rasayana tonic for both men and women.",
      ],
    },
    tradition: {
      heading: "Shatavari in Ayurvedic Tradition",
      points: [
        "Classified as a Rasayana herb and the primary Stanya (galactagogue) in Ayurveda — traditionally used to support lactation, reproductive health, and feminine vitality across all life stages from menarche to menopause.",
        "Extensively referenced in the Charaka Samhita and Sushruta Samhita as a herb for promoting strength, nourishment, and reproductive wellness. The Charaka Samhita specifically lists it among the most important Rasayana herbs.",
        "Traditionally prepared as Shatavari Kalpa — a sweetened preparation of Shatavari root powder with milk, sugar, and ghee — a format still used in Ayurvedic households and clinics today for nourishment and rejuvenation.",
        "Considered to pacify Vata and Pitta doshas in Ayurveda. Its cooling, nourishing, and unctuous qualities make it particularly relevant for conditions associated with dryness, heat, and depletion — common imbalances in women's health.",
        "Used in classical Ayurvedic formulations such as Shatavari Ghrita (medicated clarified butter) and Phalaghrita, which are referenced in the Ashtanga Hridayam for supporting reproductive wellness and overall vitality.",
      ],
    },
    concerns: ["energy", "skin-hair"],
    relatedProductIds: ["ashwagandha-capsules", "chyawanprash", "immunity-booster"],
  },

  giloy: {
    name: "Giloy",
    botanical: "Tinospora cordifolia",
    tagline: "Ayurveda's divine herb of immortality — revered for thousands of years as the ultimate immunity tonic and natural detoxifier.",
    heroImage: "/images/giloy.webp",
    heroImageAlt: "Giloy (Tinospora cordifolia) stems and powder",
    accentColor: "#8C52FF",
    benefits: [
      {
        icon: ShieldCheck,
        title: "Immunity Support",
        description:
          "Giloy is one of Ayurveda's foremost immunity-supporting herbs. Its bioactive compounds — including tinosporin, berberine, and polysaccharides — are traditionally used to strengthen the body's natural defences and support a robust immune response.",
      },
      {
        icon: Droplets,
        title: "Natural Detoxification",
        description:
          "In Ayurvedic practice, Giloy is classified as a Deepana (digestive stimulant) and Pachana (digestive) herb. It is traditionally used to support the body's natural detoxification processes, particularly in relation to blood purification and liver health.",
      },
      {
        icon: Activity,
        title: "Digestive Wellness",
        description:
          "Giloy is traditionally used to support healthy digestion and gut comfort. Its bitter taste (Tikta rasa) is associated in Ayurveda with stimulating digestive fire (Agni), supporting nutrient absorption, and promoting overall digestive balance.",
      },
      {
        icon: Zap,
        title: "Energy & Vitality",
        description:
          "As a Rasayana herb, Giloy is associated with supporting overall vitality and reducing feelings of fatigue. It is traditionally used to help the body recover from illness, support stamina, and promote a sense of renewed energy and well-being.",
      },
    ],
    about: {
      heading: "What is Giloy?",
      stat: {
        label: "Sanskrit Name",
        value: "Guduchi",
        sub: "Meaning 'that which protects the body' — reflecting its deep traditional role as a guardian of health and immunity",
      },
      classification: {
        label: "Ayurvedic Classification",
        value: "Rasayana & Tridoshic",
        sub: "Rasayana — rejuvenating botanical; Tridoshic — balances all three doshas Vata, Pitta, and Kapha",
      },
      paragraphs: [
        "Giloy (Tinospora cordifolia) is a large, deciduous climbing shrub native to the tropical regions of India, Myanmar, and Sri Lanka. It grows extensively across the Indian subcontinent, often found climbing on neem and mango trees. The stem is the primary medicinal part used in Ayurveda, though the roots and leaves are also used in various classical preparations.",
        "The name 'Giloy' is derived from the Hindi vernacular, while its Sanskrit name 'Guduchi' means 'that which protects the body' — a name that reflects its deep traditional role as a guardian of health. It is also known as 'Amrita' in Sanskrit, meaning nectar of immortality, reflecting the high regard in which it is held in the Ayurvedic tradition.",
        "The primary bioactive compounds in Giloy include alkaloids (berberine, palmatine, tinosporin, isocolumbin), diterpenoid lactones (tinosporide, columbin), glycosides (tinosporaside), polysaccharides, and sterols. These compounds are the subject of ongoing research into Giloy's immunomodulatory and adaptogenic properties.",
        "In modern wellness products, Giloy is used in internal formats such as capsules, powders, and the traditional Giloy Sattva (a starch extract prepared from the stem). It is frequently combined with Tulsi and other immunity-supporting herbs in Ayurvedic formulations, reflecting its central role in immunity-focused wellness routines.",
      ],
    },
    tradition: {
      heading: "Giloy in Ayurvedic Tradition",
      points: [
        "Known as 'Guduchi' and 'Amrita' (nectar of immortality) in Sanskrit — one of the most revered herbs in the Ayurvedic pharmacopoeia, referenced extensively in the Charaka Samhita and Sushruta Samhita as a herb for longevity, immunity, and overall vitality.",
        "Classified as a Rasayana herb and one of the most important Tridoshic botanicals in Ayurveda — capable of balancing all three doshas (Vata, Pitta, and Kapha) — making it one of the most universally applicable herbs across different body constitutions.",
        "Traditionally prepared as Guduchi Sattva — a fine white starch extracted from the fresh stem by soaking and grinding — considered one of the purest and most potent forms of Giloy, used in classical Ayurvedic formulations for fever, digestive disorders, and general debility.",
        "Described in the Ashtanga Hridayam as a Jvarahara (fever-reducing) herb and used extensively in classical Ayurvedic fever management protocols, reflecting its traditional role in supporting the body's response to infection and illness.",
        "A key ingredient in classical Ayurvedic formulations including Guduchyadi Kwatha, Amritarishta, and Samshamani Vati — preparations that remain part of the Ayurvedic pharmacopoeia and are used in traditional practice today.",
      ],
    },
    concerns: ["immunity", "detox"],
    relatedProductIds: ["tulsi-giloy", "immunity-booster", "chyawanprash"],
  },

  neem: {
    name: "Neem",
    botanical: "Azadirachta indica",
    tagline: "Ayurveda's village pharmacy — a powerful purifying botanical revered for thousands of years for skin health, natural detoxification, and whole-body cleansing.",
    heroImage: "/images/neem-hibiscus.webp",
    heroImageAlt: "Neem leaves and branches",
    accentColor: "#8C52FF",
    benefits: [
      {
        icon: Sparkles,
        title: "Skin Health & Purification",
        description:
          "Neem is one of Ayurveda's foremost herbs for skin wellness. Its bioactive compounds — including nimbidin, nimbin, and quercetin — are traditionally used to support clear, healthy skin and are widely used in external formulations for their purifying and skin-soothing properties.",
      },
      {
        icon: Droplets,
        title: "Natural Detoxification",
        description:
          "Classified as a Raktashodhaka (blood purifier) in Ayurveda, Neem is traditionally used to support the body's natural detoxification processes. It is associated with cleansing the blood and supporting the elimination of toxins (Ama) from the body.",
      },
      {
        icon: ShieldCheck,
        title: "Immunity & Antimicrobial Support",
        description:
          "Neem contains a broad spectrum of bioactive compounds including limonoids, flavonoids, and polyphenols that have been studied for their role in supporting the body's natural defences. It is one of Ayurveda's most important herbs for supporting immune resilience.",
      },
      {
        icon: Activity,
        title: "Digestive & Metabolic Wellness",
        description:
          "In Ayurveda, Neem's bitter taste (Tikta rasa) is associated with stimulating digestive fire (Agni), supporting healthy metabolism, and promoting gut health. It is traditionally used to support digestive comfort and healthy blood sugar balance as part of a daily wellness routine.",
      },
    ],
    about: {
      heading: "What is Neem?",
      stat: {
        label: "Traditional Use",
        value: "4,000+",
        sub: "Years of documented use in Ayurvedic medicine — referenced in ancient texts as 'Sarva Roga Nivarini' (curer of all ailments)",
      },
      classification: {
        label: "Ayurvedic Classification",
        value: "Raktashodhaka & Krimighna",
        sub: "Raktashodhaka — blood purifier; Krimighna — antimicrobial herb that supports the body's natural cleansing",
      },
      paragraphs: [
        "Neem (Azadirachta indica) is a fast-growing evergreen tree native to the Indian subcontinent, now cultivated widely across tropical and subtropical regions of Asia and Africa. Every part of the tree — leaves, bark, seeds, flowers, and roots — has been used in Ayurvedic medicine for thousands of years, earning it the title 'Sarva Roga Nivarini' (the curer of all ailments) in classical texts.",
        "The primary bioactive compounds in Neem include limonoids (nimbin, nimbidin, nimbidol, azadirachtin), flavonoids (quercetin, kaempferol), polyphenols, tannins, and fatty acids (in Neem seed oil). The leaves are the most commonly used part in internal wellness formulations, while Neem seed oil is widely used in external skin and hair care products.",
        "In Ayurveda, Neem is classified as having a bitter (Tikta) and astringent (Kashaya) taste, a cooling potency (Sheeta virya), and a pungent post-digestive effect (Katu vipaka). These qualities make it particularly relevant for conditions associated with excess Pitta and Kapha doshas — including skin conditions, digestive imbalances, and inflammatory concerns.",
        "In modern wellness products, Neem is used extensively in both internal formats (capsules, powders, and traditional preparations like Neem Kwatha) and external formats (face washes, creams, hair oils, and serums). Its versatility across skin care, hair care, and internal wellness reflects its broad traditional use as one of Ayurveda's most complete botanical ingredients.",
      ],
    },
    tradition: {
      heading: "Neem in Ayurvedic Tradition",
      points: [
        "Known as 'Nimba' in Sanskrit and described as 'Sarva Roga Nivarini' — the curer of all ailments — in classical Ayurvedic texts. Neem is one of the most extensively referenced herbs in the Charaka Samhita and Sushruta Samhita, where it is described as a purifying, cooling, and antimicrobial botanical.",
        "Classified as a Raktashodhaka (blood purifier) and Krimighna (antimicrobial) herb in Ayurveda — two of the most important therapeutic categories for skin health and detoxification. Its blood-purifying action is considered foundational to its traditional role in supporting clear, healthy skin.",
        "Traditionally used in Panchakarma (Ayurvedic detoxification therapies) — particularly in Virechana (therapeutic purgation) and Raktamokshana (blood purification) protocols — reflecting its deep traditional role in supporting the body's natural cleansing and detoxification processes.",
        "Neem twigs have been used as natural tooth-cleaning sticks (Dantadhavana) in Ayurvedic oral hygiene practice for thousands of years — a tradition referenced in the Charaka Samhita and still practised in many parts of India today, now supported by modern dental research.",
        "A key ingredient in classical Ayurvedic formulations including Nimbadi Churna, Mahamarichyadi Taila, and Neem-based Lepa (topical pastes) — preparations used for skin conditions, scalp health, and general detoxification that remain part of the Ayurvedic pharmacopoeia.",
      ],
    },
    concerns: ["skin-hair", "detox"],
    relatedProductIds: ["herbal-hair-oil", "glow-cream", "face-serum"],
  },

  brahmi: {
    name: "Brahmi",
    botanical: "Bacopa monnieri",
    tagline: "Ayurveda's foremost herb for the mind — traditionally used to support memory, clarity, and a calm, focused state of being.",
    heroImage: "/images/tulsi-brahmi.webp",
    heroImageAlt: "Brahmi (Bacopa monnieri) plant with small white flowers",
    accentColor: "#8C52FF",
    benefits: [
      {
        icon: Moon,
        title: "Stress & Calm",
        description:
          "Brahmi is classified as an adaptogen in Ayurveda and is traditionally used to support a calm, composed mental state. It is associated with reducing the effects of everyday stress and promoting a sense of mental ease.",
      },
      {
        icon: Zap,
        title: "Memory & Cognitive Function",
        description:
          "The bacosides in Brahmi — its primary active compounds — have been studied for their role in supporting memory formation, learning, and overall cognitive function. Brahmi is one of the most researched Ayurvedic herbs for mental wellness.",
      },
      {
        icon: Sparkles,
        title: "Mental Clarity & Focus",
        description:
          "Traditionally used by students and scholars in India for centuries, Brahmi is associated with supporting sustained attention, mental clarity, and the ability to concentrate during demanding cognitive tasks.",
      },
      {
        icon: Droplets,
        title: "Hair & Scalp Nourishment",
        description:
          "In Ayurvedic external care, Brahmi is a valued ingredient in hair oils. It is traditionally used to nourish the scalp, support hair root strength, and promote a healthy scalp environment when applied topically.",
      },
    ],
    about: {
      heading: "What is Brahmi?",
      stat: {
        label: "Key Active Compounds",
        value: "Bacosides",
        sub: "Triterpenoid saponins unique to Bacopa monnieri — the primary bioactive compounds studied for cognitive support",
      },
      classification: {
        label: "Ayurvedic Classification",
        value: "Medhya Rasayana",
        sub: "A specific Rasayana category for herbs that nourish and support the mind (Medha = intellect)",
      },
      paragraphs: [
        "Brahmi (Bacopa monnieri) is a small, creeping herb native to the wetlands of India, Nepal, Sri Lanka, and parts of Southeast Asia. It thrives in marshy, waterlogged environments and has been a cornerstone of Ayurvedic medicine for over 3,000 years, particularly for its association with mental wellness and cognitive support.",
        "The name 'Brahmi' is derived from 'Brahma' — the Hindu deity associated with creation and knowledge — reflecting the herb's deep traditional connection to intellect, learning, and mental clarity. In some regions, the name Brahmi is also used for Centella asiatica (Gotu Kola), but Bacopa monnieri is the more widely recognised Brahmi in classical Ayurvedic texts.",
        "The primary bioactive compounds in Brahmi are bacosides — specifically bacoside A and bacoside B — which are triterpenoid saponins unique to this plant. These compounds are the focus of ongoing research into Brahmi's effects on memory, learning, and neuroprotection. Standardised Brahmi extracts are typically measured by their bacoside content.",
        "In modern wellness products, Brahmi is used in internal formats such as capsules, powders, and traditional preparations like Brahmi Ghrita (clarified butter infusion). It is also used in external formats, particularly in Ayurvedic hair oils, where it is valued for its traditional role in scalp and hair nourishment.",
      ],
    },
    tradition: {
      heading: "Brahmi in Ayurvedic Tradition",
      points: [
        "Classified as a Medhya Rasayana — one of four herbs specifically designated in Ayurveda for nourishing the intellect and supporting mental function. The other three are Shankhapushpi, Yashtimadhu, and Guduchi.",
        "Extensively referenced in the Charaka Samhita, where it is described as a herb that promotes intellect (Medha), memory (Smriti), and longevity (Ayus) — making it one of the most specifically mind-focused herbs in the classical Ayurvedic pharmacopoeia.",
        "Traditionally prepared as Brahmi Ghrita — a medicated clarified butter infusion — which was administered to support memory, learning, and mental clarity. This preparation is still referenced in Ayurvedic practice today.",
        "Considered to pacify Vata and Kapha doshas in Ayurveda. Excess Vata is associated with anxiety, scattered thinking, and poor memory — making Brahmi's Vata-pacifying quality particularly relevant to its traditional cognitive applications.",
        "Used in Nasya (nasal oil therapy) in classical Ayurvedic practice, where Brahmi oil was administered through the nasal passage as a direct route to support mental clarity and calm — a technique described in the Ashtanga Hridayam.",
      ],
    },
    concerns: ["stress"],
    relatedProductIds: ["chyawanprash", "herbal-hair-oil"],
  },
};

// ─── Product card (minimal, consistent with site) ─────────────────────────────

function RelatedProductCard({ productId }: { productId: string }) {
  const { products } = useProducts();
  const product = products.find((p) => p.id === productId);
  const { bag, addToBag } = useApp();
  if (!product) return null;
  const inBag = bag.some((item) => item.id === product.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[22px] border border-[#E9E3EE] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(46,5,105,.10)]">
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F4EEFF] to-[#FAF6FF]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 25vw"
          className="object-contain p-6 transition duration-500 group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex flex-1 flex-col border-t border-[#E9E3EE] p-5">
        <span className="text-[9px] font-extrabold uppercase tracking-[.13em] text-[#8C52FF]">
          {product.range}
        </span>
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-2 text-[16px] font-extrabold leading-tight tracking-[-0.03em] text-[#2E0569] transition hover:text-[#8C52FF]">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 flex-1 text-[12px] leading-[1.7] text-[#716A78] line-clamp-2">
          {product.descriptor}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-[16px] font-extrabold tracking-[-0.03em] text-[#2E0569]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.mrp !== product.price && (
            <span className="text-[11px] font-semibold text-[#8B8292] line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          )}
        </div>
        <button
          onClick={() => addToBag(product)}
          className={`mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-full text-[11px] font-extrabold uppercase tracking-[.1em] transition ${
            inBag
              ? "bg-[#EAF4E4] text-[#315C20]"
              : "bg-[#8C52FF] text-white hover:bg-[#2E0569]"
          }`}
        >
          {inBag ? (
            <><ShoppingBag size={13} /> In bag</>
          ) : (
            <><Plus size={13} /> Add to bag</>
          )}
        </button>
      </div>
    </article>
  );
}

// ─── Page content ─────────────────────────────────────────────────────────────

function IngredientDetailContent() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug.toLowerCase() : "";
  const data = ingredientData[slug];

  if (!data) return notFound();

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      {/* ── Breadcrumb ── */}
      <div className="border-b border-[#E9E3EE] bg-white">
        <div className="container-page flex items-center gap-2 py-4 text-[11px] font-semibold text-[#8B8292]">
          <Link href="/" className="transition hover:text-[#2E0569]">Home</Link>
          <span>/</span>
          <Link href="/ingredients" className="transition hover:text-[#2E0569]">Ingredients</Link>
          <span>/</span>
          <span className="text-[#2E0569]">{data.name}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F7F3FF] via-[#FFFDF7] to-[#F2EBFF] pb-16 pt-12 sm:pt-20">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#8C52FF]/[.06] blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-[#FFBB58]/[.08] blur-3xl" />

        <div className="container-page">
          <Link
            href="/ingredients"
            className="mb-10 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF] transition hover:text-[#2E0569]"
          >
            <ArrowLeft size={14} /> Back to Ingredients
          </Link>

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            {/* Left: text */}
            <Reveal>
              <span className="eyebrow">
                <Leaf size={13} />
                Ayurvedic Ingredient
              </span>
              <h1 className="mt-5 text-[clamp(48px,6vw,80px)] font-extrabold leading-[1.0] tracking-[-0.055em] text-[#2E0569]">
                {data.name}
                <span className="text-[#FFBB58]">.</span>
              </h1>
              <p className="mt-2 text-[14px] italic text-[#8C52FF]">{data.botanical}</p>
              <p className="mt-5 max-w-lg text-[15px] leading-[1.85] text-[#716A78]">
                {data.tagline}
              </p>

              {/* Concern tags */}
              <div className="mt-8 flex flex-wrap gap-2.5">
                {data.concerns.map((key) => {
                  const { label, icon: Icon, color } = concernConfig[key];
                  return (
                    <span
                      key={key}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-extrabold ${color}`}
                    >
                      <Icon size={13} />
                      {label}
                    </span>
                  );
                })}
              </div>
            </Reveal>

            {/* Right: hero image */}
            <Reveal delay={0.1}>
              <motion.div
                className="relative mx-auto aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-[32px] shadow-[0_40px_100px_rgba(46,5,105,.18)]"
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={data.heroImage}
                  alt={data.heroImageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2E0569]/20 via-transparent to-transparent" />
                {/* Botanical name badge */}
                <div className="absolute bottom-5 left-5 rounded-[14px] bg-white/90 px-4 py-2.5 backdrop-blur-sm">
                  <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#8C52FF]">Botanical Name</p>
                  <p className="mt-0.5 text-[13px] font-extrabold italic text-[#2E0569]">{data.botanical}</p>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="bg-[#FFFDF7] py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <span className="eyebrow">
              <Sparkles size={13} />
              Wellness Benefits
            </span>
            <h2 className="mt-5 text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#2E0569]">
              What {data.name} supports
              <span className="text-[#FFBB58]">.</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.benefits.map(({ icon: Icon, title, description }, i) => (
              <Reveal key={title} delay={i * 0.07}>
                <div className="group flex h-full flex-col rounded-[24px] border border-[#E9E3EE] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#CDBAF1] hover:shadow-[0_20px_50px_rgba(46,5,105,.10)]">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-[#F2EBFF] transition duration-300 group-hover:bg-[#8C52FF]">
                    <Icon size={20} className="text-[#8C52FF] transition duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="mt-5 text-[16px] font-extrabold tracking-[-0.03em] text-[#2E0569]">{title}</h3>
                  <p className="mt-3 flex-1 text-[13px] leading-[1.8] text-[#716A78]">{description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="bg-[#F7F3FF] py-20 sm:py-28">
        <div className="container-page">
          <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <span className="eyebrow">
                <Leaf size={13} />
                About the Ingredient
              </span>
              <h2 className="mt-5 text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#2E0569]">
                {data.about.heading}
                <span className="text-[#FFBB58]">.</span>
              </h2>

              {/* Stat card — ingredient-specific */}
              <div className="mt-10 rounded-[24px] border border-[#DDD3E5] bg-white p-7 shadow-[0_12px_40px_rgba(46,5,105,.07)]">
                <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8C52FF]">
                  {data.about.stat.label}
                </p>
                <p className="mt-2 text-[clamp(28px,3.5vw,44px)] font-extrabold leading-none tracking-[-0.05em] text-[#2E0569]">
                  {data.about.stat.value}
                </p>
                <p className="mt-1 text-[13px] text-[#716A78]">
                  {data.about.stat.sub}
                </p>
              </div>

              <div className="mt-6 rounded-[24px] border border-[#DDD3E5] bg-white p-7 shadow-[0_12px_40px_rgba(46,5,105,.07)]">
                <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8C52FF]">
                  {data.about.classification.label}
                </p>
                <p className="mt-2 text-[18px] font-extrabold text-[#2E0569]">{data.about.classification.value}</p>
                <p className="mt-1 text-[13px] text-[#716A78]">
                  {data.about.classification.sub}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-5">
                {data.about.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="text-[15px] leading-[1.9] text-[#4A4255]"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Ayurvedic Tradition ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2E0569] via-[#3D0880] to-[#210044] py-20 sm:py-28">
        {/* Decorative */}
        <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FFBB58]/[.06] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[#8C52FF]/[.15] blur-3xl" />

        <div className="container-page relative">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[.15em] text-[#FFBB58] backdrop-blur">
              <Leaf size={13} />
              Ayurvedic Tradition
            </span>
            <h2 className="mt-5 text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.045em] text-white">
              {data.tradition.heading}
              <span className="text-[#FFBB58]">.</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.tradition.points.map((point, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="flex items-start gap-4 rounded-[20px] border border-white/10 bg-white/[.07] p-6 backdrop-blur-sm transition duration-300 hover:bg-white/[.11]">
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#FFBB58]/20">
                    <span className="text-[12px] font-extrabold text-[#FFBB58]">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="text-[13.5px] leading-[1.8] text-white/85">{point}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Concerns ── */}
      <section className="bg-[#FFFDF7] py-20">
        <div className="container-page">
          <Reveal>
            <span className="eyebrow">
              <Activity size={13} />
              Related Wellness Concerns
            </span>
            <h2 className="mt-5 text-[clamp(28px,3.5vw,44px)] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#2E0569]">
              {data.name} is relevant for
              <span className="text-[#FFBB58]">.</span>
            </h2>
          </Reveal>

          <div className="mt-10 flex flex-wrap gap-4">
            {data.concerns.map((key) => {
              const { label, icon: Icon, color } = concernConfig[key];
              return (
                <Reveal key={key}>
                  <div className={`flex items-center gap-3 rounded-[20px] px-6 py-4 text-[13px] font-extrabold ${color}`}>
                    <Icon size={18} />
                    {label}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Related Products ── */}
      {data.relatedProductIds.length > 0 && (
        <section className="bg-[#F7F3FF] py-20 sm:py-28">
          <div className="container-page">
            <Reveal>
              <span className="eyebrow">
                <ShoppingBag size={13} />
                Products with {data.name}
              </span>
              <h2 className="mt-5 text-[clamp(28px,3.5vw,44px)] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#2E0569]">
                Explore {data.name} products
                <span className="text-[#FFBB58]">.</span>
              </h2>
              <p className="mt-3 max-w-lg text-[13.5px] leading-[1.8] text-[#716A78]">
                These products contain {data.name} as a key ingredient.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.relatedProductIds.map((id) => (
                <Reveal key={id} delay={0.06}>
                  <RelatedProductCard productId={id} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Back CTA ── */}
      <section className="bg-[#FFFDF7] py-16">
        <div className="container-page flex flex-col items-center gap-5 text-center">
          <Reveal>
            <p className="text-[13px] text-[#716A78]">Explore more ingredients in our library</p>
            <Link href="/ingredients" className="btn-primary mt-4 gap-2">
              Back to Ingredients Library <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default function IngredientDetailPage() {
  return (
    <PageLayout>
      <IngredientDetailContent />
    </PageLayout>
  );
}
