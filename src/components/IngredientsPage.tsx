"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, FlaskConical, Leaf, Package, ShieldCheck, Zap, Moon, Activity, Droplets, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";

// ─── Data ────────────────────────────────────────────────────────────────────

const concerns = [
  { label: "Stress", value: "stress", icon: Moon },
  { label: "Immunity", value: "immunity", icon: ShieldCheck },
  { label: "Energy", value: "energy", icon: Zap },
  { label: "Digestion", value: "digestion", icon: Activity },
  { label: "Skin & Hair", value: "skin-hair", icon: Sparkles },
  { label: "Detox", value: "detox", icon: Droplets },
];

const libraryIngredients = [
  {
    name: "Ashwagandha",
    technical: "Withania somnifera",
    image: "/images/ashwagandha.webp",
    copy: "Adaptogenic herb that helps the body manage stress and supports vitality and balance.",
    concerns: ["stress", "energy"],
  },
  {
    name: "Amla",
    technical: "Emblica officinalis",
    image: "/images/amla.webp",
    copy: "Rich in Vitamin C and antioxidants to support immunity, skin health and overall wellness.",
    concerns: ["immunity", "energy", "skin-hair"],
  },
  {
    name: "Turmeric",
    technical: "Curcuma longa",
    image: "/images/turmeric.webp",
    copy: "Traditionally used to support inflammation balance and natural healing.",
    concerns: ["immunity", "digestion", "detox"],
  },
  {
    name: "Aloe Vera",
    technical: "Aloe barbadensis",
    image: "/images/aloe-vera.webp",
    copy: "Cooling and soothing botanical that supports gut health and skin nourishment.",
    concerns: ["digestion", "skin-hair"],
  },
  {
    name: "Brahmi",
    technical: "Bacopa monnieri",
    image: "/images/tulsi-brahmi.webp",
    copy: "Supports memory, focus and cognitive function. A traditional herb for mental clarity.",
    concerns: ["stress"],
  },
  {
    name: "Shatavari",
    technical: "Asparagus racemosus",
    image: "/images/shatavari.webp",
    copy: "Rasayana herb that supports women's wellness, hormonal balance and daily vitality.",
    concerns: ["energy", "skin-hair"],
  },
  {
    name: "Giloy",
    technical: "Tinospora cordifolia",
    image: "/images/giloy.webp",
    copy: "Known as Amrita in Ayurveda, Giloy strengthens immunity and supports natural detox.",
    concerns: ["immunity", "detox"],
  },
  {
    name: "Neem",
    technical: "Azadirachta indica",
    image: "/images/neem-hibiscus.webp",
    copy: "Purifying botanical that supports skin health and natural detoxification.",
    concerns: ["skin-hair", "detox"],
  },
];

const featuredBenefits = [
  { icon: ShieldCheck, label: "Adaptogen", sub: "Helps the body adapt to stress" },
  { icon: Zap, label: "Energy & vitality", sub: "Supports stamina and reduces fatigue" },
  { icon: Moon, label: "Stress balance", sub: "Promotes calm, resilience and well-being" },
  { icon: Leaf, label: "Restorative support", sub: "Nourishes the body and mind" },
];

const approachPillars = [
  { icon: Leaf, title: "Thoughtfully sourced", sub: "From trusted farms and regions" },
  { icon: FlaskConical, title: "Scientifically evaluated", sub: "Tested for purity, potency and safety" },
  { icon: ShieldCheck, title: "Quality assured", sub: "Every batch meets rigorous standards" },
  { icon: Package, title: "Effective formulations", sub: "Blended for real wellness outcomes" },
];

const purposes = [
  { icon: Moon, label: "Balances stress & promotes calm" },
  { icon: ShieldCheck, label: "Strengthens immunity" },
  { icon: Activity, label: "Supports healthy digestion" },
  { icon: Sparkles, label: "Nourishes skin & natural glow" },
  { icon: Zap, label: "Enhances energy & stamina" },
  { icon: Droplets, label: "Supports detox & daily renewal" },
];

// ─── Hero Section ─────────────────────────────────────────────────────────────

function IngredientsHero({ onExploreAll, onBrowseByConcern }: { onExploreAll: () => void; onBrowseByConcern: () => void }) {
  return (
    <section className="relative overflow-hidden bg-[#FFFDF7] pb-10 pt-14 sm:pt-20">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute left-[-60px] top-[80px] h-[180px] w-[180px] rounded-full border-[3px] border-[#E9E3EE] opacity-60" />
      <div className="pointer-events-none absolute right-[20px] top-[60px] h-[22px] w-[22px] rounded-full bg-[#FFBB58]" />
      <div className="pointer-events-none absolute right-[60px] bottom-[40px] h-[18px] w-[18px] rounded-full bg-[#FFBB58]" />

      <div className="container-page">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_1fr_1fr]">

          {/* Col 1 ─ Left: headline + buttons */}
          <Reveal className="flex flex-col justify-center pt-2">
            <span className="eyebrow w-fit">
              <Leaf size={13} />
              Ingredients Library
            </span>
            <h1 className="mt-5 text-[clamp(38px,4.8vw,64px)] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#2E0569]">
              Ingredients,<br />
              understood clearly
              <span className="text-[#FFBB58]">.</span>
            </h1>
            <p className="mt-5 max-w-sm text-[13.5px] leading-[1.8] text-[#716A78]">
              Explore the herbs, botanicals, extracts and nutrients we use in our products. Clear, honest and backed by Ayurvedic wisdom and modern science.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={onExploreAll} className="btn-primary">
                Explore all ingredients <ArrowRight size={15} />
              </button>
              <button onClick={onBrowseByConcern} className="btn-secondary">
                Browse by concern
              </button>
            </div>
          </Reveal>

          {/* Col 2 ─ Centre: hero image */}
          <Reveal delay={0.1}>
            <div className="relative w-full overflow-hidden rounded-[20px] shadow-[0_8px_32px_rgba(46,5,105,.10)]" style={{ aspectRatio: "4/5" }}>
              <Image
                src="/images/ashwagandha.webp"
                alt="Ashwagandha — featured ingredient"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* Col 3 ─ Right: Featured Ingredient card */}
          <Reveal delay={0.18}>
            <div className="rounded-[20px] border border-[#E9E3EE] bg-white p-6 shadow-[0_8px_32px_rgba(46,5,105,.07)]">
              <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8C52FF]">
                Featured Ingredient
              </p>
              <h2 className="mt-3 text-[24px] font-extrabold tracking-[-0.04em] text-[#2E0569]">
                Ashwagandha
              </h2>
              <p className="text-[12px] italic text-[#716A78]">Withania somnifera</p>
              <div className="mt-5 space-y-4">
                {featuredBenefits.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#F2EBFF]">
                      <Icon size={13} className="text-[#8C52FF]" />
                    </div>
                    <div>
                      <p className="text-[12px] font-extrabold text-[#2E0569]">{label}</p>
                      <p className="text-[11px] leading-[1.5] text-[#716A78]">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="#library"
                className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-extrabold text-[#8C52FF] transition hover:gap-2.5"
              >
                View full details <ArrowRight size={13} />
              </a>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}

// ─── Shared Ingredient Card ───────────────────────────────────────────────────

function IngredientCard({ item, i }: { item: typeof libraryIngredients[0]; i: number }) {
  return (
    <Reveal delay={i * 0.05}>
      <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#E9E3EE] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(46,5,105,.10)]">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F7F3FF]">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-[15px] font-extrabold text-[#2E0569]">{item.name}</h3>
          <p className="text-[11px] italic text-[#716A78]">{item.technical}</p>
          <p className="mt-2.5 flex-1 text-[12.5px] leading-[1.7] text-[#716A78]">{item.copy}</p>
          <a
            href={`/ingredients/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-extrabold text-[#8C52FF] transition hover:gap-2.5"
          >
            View details <ArrowRight size={12} />
          </a>
        </div>
      </article>
    </Reveal>
  );
}

// ─── Full Ingredients Library ─────────────────────────────────────────────────

function IngredientsLibrary() {
  return (
    <section id="library" className="bg-[#FFFDF7] pb-16 pt-2">
      <div className="container-page">
        <Reveal>
          <p className="mb-7 text-[15px] font-extrabold text-[#2E0569]">Ingredients library</p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {libraryIngredients.map((item, i) => (
            <IngredientCard key={item.name} item={item} i={i} />
          ))}
        </div>
        <Reveal className="mt-12 flex justify-center">
          <button className="btn-secondary gap-2">
            View all ingredients <ArrowRight size={14} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Browse by Concern ────────────────────────────────────────────────────────

function BrowseByConcern() {
  const [activeConcern, setActiveConcern] = useState<string | null>(null);
  const filtered = activeConcern ? libraryIngredients.filter((i) => i.concerns.includes(activeConcern)) : [];

  return (
    <section id="concerns" className="bg-[#FFFDF7] py-10">
      <div className="container-page">
        <Reveal>
          <p className="mb-1 text-[15px] font-extrabold text-[#2E0569]">Browse by concern</p>
          <p className="mb-5 text-[12.5px] text-[#716A78]">Select a concern to see relevant ingredients.</p>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="flex flex-wrap gap-2.5">
            {concerns.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setActiveConcern(activeConcern === value ? null : value)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[11.5px] font-extrabold transition duration-200 ${
                  activeConcern === value
                    ? "border-[#8C52FF] bg-[#8C52FF] text-white shadow-[0_8px_20px_rgba(140,82,255,.28)]"
                    : "border-[#E9E3EE] bg-white text-[#2E0569] hover:border-[#8C52FF] hover:text-[#8C52FF]"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </Reveal>

        {activeConcern ? (
          <div className="mt-10">
            <Reveal>
              <p className="mb-6 text-[13px] text-[#716A78]">
                Showing ingredients for{" "}
                <span className="font-extrabold text-[#8C52FF]">
                  {concerns.find((c) => c.value === activeConcern)?.label}
                </span>
              </p>
            </Reveal>
            <div key={activeConcern} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((item, i) => (
                <IngredientCard key={item.name} item={item} i={i} />
              ))}
            </div>
          </div>
        ) : (
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-col items-center gap-3 rounded-[22px] border border-dashed border-[#DDD3E5] bg-white py-14 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[#F2EBFF]">
                <Leaf size={22} className="text-[#8C52FF]" />
              </div>
              <p className="text-[14px] font-extrabold text-[#2E0569]">Choose a concern above</p>
              <p className="text-[12.5px] text-[#716A78]">We&apos;ll show you the right ingredients for your wellness goal.</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

// ─── From Herb to Formulation ─────────────────────────────────────────────────

function HerbToFormulation() {
  return (
    <section className="bg-[#FFFDF7] py-20 sm:py-28">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
          {/* Image */}
          <Reveal>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px]">
              <Image
                src="/images/chyawanprash-herbs.webp"
                alt="Ayurvedic herbs and ingredients used in Chyawanprash formulation"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* Content */}
          <Reveal delay={0.1}>
            <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8C52FF]">
              Our Approach
            </p>
            <h2 className="mt-3 text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#2E0569]">
              From herb to formulation
              <span className="text-[#FFBB58]">.</span>
            </h2>
            <p className="mt-4 max-w-lg text-[13.5px] leading-[1.8] text-[#716A78]">
              Every ingredient we use is thoughtfully sourced, traditionally revered and scientifically evaluated to ensure purity, safety and efficacy in every product.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {approachPillars.map(({ icon: Icon, title, sub }, i) => (
                <Reveal key={title} delay={0.12 + i * 0.06}>
                  <div className="flex flex-col items-center text-center">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#F2EBFF]">
                      <Icon size={20} className="text-[#8C52FF]" />
                    </div>
                    <p className="mt-3 text-[12px] font-extrabold text-[#2E0569]">{title}</p>
                    <p className="mt-1 text-[11px] leading-[1.6] text-[#716A78]">{sub}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Ingredient Purpose ───────────────────────────────────────────────────────

function IngredientPurpose() {
  return (
    <section className="bg-[#F7F3FF] py-16 sm:py-20">
      <div className="container-page">
        <Reveal>
          <p className="mb-10 text-[15px] font-extrabold text-[#2E0569]">
            Ingredient purpose, your wellness.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {purposes.map(({ icon: Icon, label }, i) => (
            <Reveal key={label} delay={i * 0.06}>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full border border-[#DDD3E5] bg-white shadow-sm">
                  <Icon size={22} className="text-[#8C52FF]" />
                </div>
                <p className="text-[12px] font-extrabold leading-[1.5] text-[#2E0569]">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter Banner ────────────────────────────────────────────────────────

function IngredientNewsletter() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      setStatus("error");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    if (!consent) {
      setErrorMsg("Please agree to receive emails before subscribing.");
      setStatus("error");
      return;
    }

    // Submission success (replace with real API call when ready)
    setStatus("success");
    setEmail("");
    setConsent(false);
  };

  return (
    <section id="newsletter" className="relative overflow-hidden bg-[#F2EBFF] py-14">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#DDD3E5]/40 blur-3xl" />
      <div className="pointer-events-none absolute right-[40px] bottom-[20px] h-[18px] w-[18px] rounded-full bg-[#FFBB58]" />

      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          {/* ── Left: heading ── */}
          <div className="flex items-start gap-5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white shadow-md">
              <Sparkles size={22} className="text-[#8C52FF]" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8C52FF]">
                Stay Inspired
              </p>
              <h3 className="mt-1 text-[clamp(20px,2.8vw,32px)] font-extrabold tracking-[-0.04em] text-[#2E0569]">
                Wellness, delivered to your inbox
                <span className="text-[#FFBB58]">.</span>
              </h3>
              <p className="mt-1 text-[13px] text-[#716A78]">
                Get expert tips, ingredient insights and exclusive offers.
              </p>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="w-full lg:max-w-lg">
            {status === "success" ? (
              <div className="flex items-center gap-3 rounded-[18px] border border-[#C3E6CB] bg-[#EAF4E4] px-6 py-5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#315C20]/10">
                  <ShieldCheck size={18} className="text-[#315C20]" />
                </div>
                <div>
                  <p className="text-[13px] font-extrabold text-[#315C20]">You&apos;re subscribed!</p>
                  <p className="text-[12px] text-[#315C20]/80">Thank you for joining. We&apos;ll be in touch soon.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
                {/* Input + button row */}
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus("idle"); setErrorMsg(""); }}
                    placeholder="Your email address"
                    aria-label="Email address"
                    className={`h-12 w-full rounded-full border bg-white px-5 text-[13px] text-[#2E0569] placeholder:text-[#B0A8BA] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]/30 transition ${
                      status === "error" && !consent
                        ? "border-[#DDD3E5] focus:border-[#8C52FF]"
                        : status === "error"
                        ? "border-red-400 focus:border-red-400"
                        : "border-[#DDD3E5] focus:border-[#8C52FF]"
                    }`}
                  />
                  <button
                    type="submit"
                    className="btn-primary h-12 w-full shrink-0 sm:w-auto sm:px-7"
                  >
                    Subscribe
                  </button>
                </div>

                {/* Consent checkbox */}
                <label className="flex cursor-pointer items-start gap-2.5 px-1">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); setStatus("idle"); setErrorMsg(""); }}
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#8C52FF]"
                  />
                  <span className="text-[11.5px] leading-[1.6] text-[#716A78]">
                    I agree to receive emails and updates from Pradnyasanskar
                  </span>
                </label>

                {/* Error message */}
                {status === "error" && errorMsg && (
                  <p className="flex items-center gap-1.5 px-1 text-[11.5px] font-semibold text-red-500">
                    <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    {errorMsg}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function IngredientsPageContent() {
  const [view, setView] = useState<"none" | "library" | "concern">("none");

  const handleExploreAll = () => {
    setView("library");
    setTimeout(() => document.getElementById("library")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleBrowseByConcern = () => {
    setView("concern");
    setTimeout(() => document.getElementById("concerns")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <>
      <IngredientsHero onExploreAll={handleExploreAll} onBrowseByConcern={handleBrowseByConcern} />
      {view === "concern" && <BrowseByConcern />}
      {view === "library" && <IngredientsLibrary />}
      <HerbToFormulation />
      <IngredientPurpose />
      <IngredientNewsletter />
    </>
  );
}
