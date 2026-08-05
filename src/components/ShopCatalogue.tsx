"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  Heart,
  LayoutGrid,
  List,
  Microscope,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Sparkles,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { products, type ProductRange } from "@/data";
import { useApp } from "./AppContext";
import { Reveal } from "./Reveal";
import { NotifyMeCompact } from "./NotifyMe";
import { trackFilter, trackSearch } from "@/lib/analytics";


/* ── types ────────────────────────────────────────────────────────────── */
type SortKey = "default" | "name-asc" | "name-desc" | "price-asc" | "price-desc";
type ViewMode = "grid" | "list";

/* ── constants ────────────────────────────────────────────────────────── */
const RANGE_TABS: { label: string; value: "all" | ProductRange }[] = [
  { label: "All Products", value: "all" },
  { label: "Ayurveda", value: "Ayurveda" },
  { label: "Nutraceuticals", value: "Nutraceuticals" },
  { label: "External Wellness", value: "External Wellness" },
];

const FORMATS = ["All formats", "Capsules", "Tablets", "Powder", "Oil", "Serum", "Cream", "Lehya"];

const GOALS = [
  "All goals",
  "Daily Wellness",
  "Digestive Wellness",
  "Immunity Support",
  "Energy & Vitality",
  "Skin & Hair",
  "Sleep & Relaxation",
  "Joint & Mobility",
];

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Default", value: "default" },
  { label: "Name A–Z", value: "name-asc" },
  { label: "Name Z–A", value: "name-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

const PRICE_MIN = 329;
const PRICE_MAX = 999;

function VegMarker({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
      aria-label={isVeg ? "Vegetarian" : "Non-vegetarian"}
      className={`inline-flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[3px] border ${
        isVeg ? "border-[#3A7D2C] bg-white" : "border-[#B03A2E] bg-white"
      }`}
    >
      <span className={`h-[6px] w-[6px] rounded-full ${
        isVeg ? "bg-[#3A7D2C]" : "bg-[#B03A2E]"
      }`} />
    </span>
  );
}

function statusStyle(status: string) {
  if (status === "Featured") return "bg-[#2E0569] text-white";
  if (status === "New") return "bg-[#EAF4E4] text-[#315C20]";
  return "bg-[#FFF1DA] text-[#9A5D0A]";
}

/* ── ShopCatalogue ────────────────────────────────────────────────────── */
export function ShopCatalogue({
  range,
  initialGoal,
  initialFormat,
}: {
  range: "all" | ProductRange;
  initialGoal?: string;
  initialFormat?: string;
}) {
  const { bag, saved, addToBag, toggleSaved, setQuickView } = useApp();

  const [activeRange, setActiveRange] = useState<"all" | ProductRange>(range);
  const [format, setFormat] = useState(initialFormat && FORMATS.includes(initialFormat) ? initialFormat : "All formats");
  const [goal, setGoal] = useState(initialGoal && GOALS.includes(initialGoal) ? initialGoal : "All goals");
  const [sort, setSort] = useState<SortKey>("default");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [minInput, setMinInput] = useState(String(PRICE_MIN));
  const [maxInput, setMaxInput] = useState(String(PRICE_MAX));
  const lastTrackedQuery = useRef("");
  const queryRef = useRef("");

  function setQueryAndRef(val: string) {
    queryRef.current = val;
    setQuery(val);
  }

  function handleMinChange(raw: string) {
    setMinInput(raw);
    const n = Number(raw);
    if (!isNaN(n) && raw !== "") setMinPrice(Math.max(PRICE_MIN, Math.min(n, maxPrice)));
  }
  function handleMaxChange(raw: string) {
    setMaxInput(raw);
    const n = Number(raw);
    if (!isNaN(n) && raw !== "") setMaxPrice(Math.min(PRICE_MAX, Math.max(n, minPrice)));
  }
  function commitMin(raw: string) {
    const n = Math.max(PRICE_MIN, Math.min(Number(raw) || PRICE_MIN, maxPrice));
    setMinPrice(n); setMinInput(String(n));
    trackFilter("price", `${n}-${maxPrice}`);
  }
  function commitMax(raw: string) {
    const n = Math.min(PRICE_MAX, Math.max(Number(raw) || PRICE_MAX, minPrice));
    setMaxPrice(n); setMaxInput(String(n));
    trackFilter("price", `${minPrice}-${n}`);
  }

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeRange !== "all") list = list.filter((p) => p.range === activeRange);
    if (format !== "All formats") list = list.filter((p) => p.format === format);
    if (goal !== "All goals") list = list.filter((p) => p.goals.includes(goal));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) =>
        [p.name, p.range, p.format, p.descriptor, ...p.goals].join(" ").toLowerCase().includes(q),
      );
    }

    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [activeRange, format, goal, query, sort, minPrice, maxPrice]);

  const hasFilters = format !== "All formats" || goal !== "All goals" || query.trim() !== "" || minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX;

  function resetFilters() {
    setQueryAndRef("");
    lastTrackedQuery.current = "";
    setFormat("All formats");
    setGoal("All goals");
    setSort("default");
    setMinPrice(PRICE_MIN);
    setMaxPrice(PRICE_MAX);
    setMinInput(String(PRICE_MIN));
    setMaxInput(String(PRICE_MAX));
  }

  // Track search when query is committed (on Enter or blur)
  function handleSearchCommit() {
    const term = queryRef.current.trim();
    if (!term) return;
    if (term === lastTrackedQuery.current) return;
    lastTrackedQuery.current = term;
    trackSearch(term, filtered.length);
  }

  function pushFilterEvent(filter_name: string, filter_value: string) {
    trackFilter(filter_name, filter_value);
  }

  function handleRangeChange(val: "all" | ProductRange) {
    setActiveRange(val);
    pushFilterEvent("category", val);
  }
  function handleFormatChange(val: string) {
    setFormat(val);
    pushFilterEvent("format", val);
  }
  function handleGoalChange(val: string) {
    setGoal(val);
    pushFilterEvent("goal", val);
  }
  function handleSortChange(val: SortKey) {
    setSort(val);
    pushFilterEvent("sort", val);
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      {/* ── Page header ── */}
      <section className="border-b border-[#E9E3EE] bg-gradient-to-br from-[#F4EEFF] via-[#FFFDF7] to-[#FFF8EE] py-16 sm:py-20">
        <div className="container-page">
          <Reveal>
            <span className="eyebrow">
              {activeRange === "Ayurveda" ? (
                <><Sparkles size={13} /> Ayurveda range</>
              ) : activeRange === "Nutraceuticals" ? (
                <><Microscope size={13} /> Nutraceuticals range</>
              ) : (
                <><Sparkles size={13} /> Complete collection</>
              )}
            </span>
            <h1 className="section-heading mt-5 max-w-3xl">
              {activeRange === "Ayurveda"
                ? "Traditional botanicals, modern clarity."
                : activeRange === "Nutraceuticals"
                ? "Designed for modern nutritional routines."
                : "Thoughtful wellness, one product at a time."}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.85] text-[#716A78]">
              {activeRange === "Ayurveda"
                ? "Explore Ayurvedic products with clear composition, approved directions and responsible information."
                : activeRange === "Nutraceuticals"
                ? "Discover vitamins, minerals, botanicals and modern formats through responsible product information."
                : "Explore Ayurveda, nutraceuticals and external wellness with clear product details and transparent information."}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-page py-10">
        {/* ── Range tabs ── */}
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16 xl:-mx-24 xl:px-24">
          {RANGE_TABS.map((tab) => {
            const isActive = activeRange === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleRangeChange(tab.value)}
                className={`relative shrink-0 min-h-[40px] rounded-full px-5 text-[11px] font-extrabold uppercase tracking-[.11em] transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#2E0569] to-[#8C52FF] text-white shadow-[0_6px_20px_rgba(140,82,255,.28)]"
                    : "border border-[#E9E3EE] bg-white text-[#2E0569] hover:border-[#8C52FF] hover:text-[#8C52FF]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Toolbar ── */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex min-h-11 flex-1 items-center gap-2.5 rounded-full border border-[#E9E3EE] bg-white px-4 shadow-[0_2px_10px_rgba(46,5,105,.05)] transition focus-within:border-[#8C52FF] focus-within:shadow-[0_4px_16px_rgba(140,82,255,.12)]">
            <Search size={16} className="shrink-0 text-[#8C52FF]" />
            <input
              value={query}
              onChange={(e) => setQueryAndRef(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchCommit()}
              onBlur={handleSearchCommit}
              placeholder="Search products, ingredients or goals…"
              className="w-full bg-transparent text-[13px] font-semibold text-[#2E0569] outline-none placeholder:text-[#9B93A1]"
            />
            {query && (
              <button
                onClick={() => { setQueryAndRef(""); lastTrackedQuery.current = ""; }}
                className="shrink-0 text-[#9B93A1] hover:text-[#2E0569]"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[11px] font-extrabold uppercase tracking-[.1em] transition sm:hidden ${
              filtersOpen || hasFilters
                ? "border-[#8C52FF] bg-[#F2EBFF] text-[#8C52FF]"
                : "border-[#E9E3EE] bg-white text-[#2E0569]"
            }`}
          >
            <SlidersHorizontal size={15} /> Filters
            {hasFilters && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#8C52FF] text-[9px] text-white">
                !
              </span>
            )}
          </button>

          {/* Desktop filters */}
          <div className="hidden items-center gap-2 sm:flex">
            <select
              value={format}
              onChange={(e) => handleFormatChange(e.target.value)}
              className="min-h-11 rounded-full border border-[#E9E3EE] bg-white px-4 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569] outline-none transition hover:border-[#8C52FF] focus:border-[#8C52FF]"
            >
              {FORMATS.map((f) => <option key={f}>{f}</option>)}
            </select>
            <select
              value={goal}
              onChange={(e) => handleGoalChange(e.target.value)}
              className="min-h-11 rounded-full border border-[#E9E3EE] bg-white px-4 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569] outline-none transition hover:border-[#8C52FF] focus:border-[#8C52FF]"
            >
              {GOALS.map((g) => <option key={g}>{g}</option>)}
            </select>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as SortKey)}
              className="min-h-11 rounded-full border border-[#E9E3EE] bg-white px-4 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569] outline-none transition hover:border-[#8C52FF] focus:border-[#8C52FF]"
            >
              {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            {/* Price range */}
            <div className="flex min-h-11 items-center gap-2 rounded-full border border-[#E9E3EE] bg-white px-4 text-[11px] font-extrabold text-[#2E0569] transition hover:border-[#8C52FF]">
              <span className="uppercase tracking-[.1em] text-[#8B8292]">₹</span>
              <input
                type="number"
                value={minInput}
                onChange={(e) => handleMinChange(e.target.value)}
                onBlur={(e) => commitMin(e.target.value)}
                className="w-14 bg-transparent outline-none"
              />
              <span className="text-[#D8CEE1]">–</span>
              <input
                type="number"
                value={maxInput}
                onChange={(e) => handleMaxChange(e.target.value)}
                onBlur={(e) => commitMax(e.target.value)}
                className="w-16 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Reset */}
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#E9E3EE] bg-white px-4 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#716A78] transition hover:border-[#8C52FF] hover:text-[#8C52FF]"
            >
              <RotateCcw size={13} /> Reset
            </button>
          )}

          {/* View toggle */}
          <div className="ml-auto hidden items-center gap-1 rounded-full border border-[#E9E3EE] bg-white p-1 sm:flex">
            <button
              onClick={() => setView("grid")}
              className={`grid h-9 w-9 place-items-center rounded-full transition ${view === "grid" ? "bg-[#2E0569] text-white" : "text-[#716A78] hover:text-[#2E0569]"}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`grid h-9 w-9 place-items-center rounded-full transition ${view === "list" ? "bg-[#2E0569] text-white" : "text-[#716A78] hover:text-[#2E0569]"}`}
              aria-label="List view"
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* ── Mobile filter panel ── */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden sm:hidden"
            >
              <div className="mt-3 flex flex-col gap-3 rounded-[20px] border border-[#E9E3EE] bg-white p-4">
                <select
                  value={format}
                  onChange={(e) => handleFormatChange(e.target.value)}
                  className="min-h-11 rounded-full border border-[#E9E3EE] bg-[#FFFDF7] px-4 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569] outline-none"
                >
                  {FORMATS.map((f) => <option key={f}>{f}</option>)}
                </select>
                <select
                  value={goal}
                  onChange={(e) => handleGoalChange(e.target.value)}
                  className="min-h-11 rounded-full border border-[#E9E3EE] bg-[#FFFDF7] px-4 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569] outline-none"
                >
                  {GOALS.map((g) => <option key={g}>{g}</option>)}
                </select>
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value as SortKey)}
                  className="min-h-11 rounded-full border border-[#E9E3EE] bg-[#FFFDF7] px-4 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569] outline-none"
                >
                  {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                {/* Price range (mobile) */}
                <div className="flex items-center gap-2 rounded-full border border-[#E9E3EE] bg-[#FFFDF7] px-4 py-2.5 text-[11px] font-extrabold text-[#2E0569]">
                  <span className="uppercase tracking-[.1em] text-[#8B8292]">Price ₹</span>
                  <input
                    type="number"
                    value={minInput}
                    onChange={(e) => handleMinChange(e.target.value)}
                    onBlur={(e) => commitMin(e.target.value)}
                    className="w-16 bg-transparent outline-none"
                  />
                  <span className="text-[#D8CEE1]">–</span>
                  <input
                    type="number"
                    value={maxInput}
                    onChange={(e) => handleMaxChange(e.target.value)}
                    onBlur={(e) => commitMax(e.target.value)}
                    className="w-16 bg-transparent outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Result count ── */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[13px] font-semibold text-[#716A78]">
            <span className="font-extrabold text-[#2E0569]">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "product" : "products"} found
          </p>
        </div>

        {/* ── Product grid / list ── */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10 rounded-[28px] border border-dashed border-[#CDBAF1] bg-[#F2EBFF] px-8 py-16 text-center"
            >
              <p className="text-[22px] font-extrabold text-[#2E0569]">No products match your filters.</p>
              <p className="mt-3 text-[14px] text-[#716A78]">Try adjusting your search, format or wellness goal.</p>
              <button onClick={resetFilters} className="btn-primary mt-6">
                <RotateCcw size={15} /> Reset filters
              </button>
            </motion.div>
          ) : view === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filtered.map((product, i) => {
                const inBag = bag.some((item) => item.id === product.id);
                const isSaved = saved.includes(product.id);
                return (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, delay: Math.min(i * 0.04, 0.32), ease: [0.22, 1, 0.36, 1] }}
                    className="group relative flex flex-col overflow-hidden rounded-[28px] border border-[#E9E3EE] bg-white transition duration-300 hover:-translate-y-1.5 hover:border-[#CDBAF1] hover:shadow-[0_20px_50px_rgba(46,5,105,.10)]"
                  >
                    {/* Image — links to product detail */}
                    <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F4EEFF] to-[#FAF6FF] block">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={`object-contain p-5 transition duration-500 group-hover:scale-[1.04] ${!product.inStock ? "opacity-40" : ""}`}
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="rounded-full bg-[#716A78]/90 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-white backdrop-blur-sm">Out of stock</span>
                        </div>
                      )}
                      <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.13em] ${statusStyle(product.status)}`}>
                        {product.status}
                      </span>
                      <button
                        onClick={(e) => { e.preventDefault(); toggleSaved(product.id); }}
                        aria-label={isSaved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
                        className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border transition ${
                          isSaved
                            ? "border-[#8C52FF] bg-[#8C52FF] text-white"
                            : "border-[#E9E3EE] bg-white text-[#2E0569] hover:text-[#8C52FF]"
                        }`}
                      >
                        <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); setQuickView(product); }}
                        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#2E0569] px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[.12em] text-white opacity-0 shadow-lg transition group-hover:opacity-100"
                      >
                        <Eye size={13} /> Quick view
                      </button>
                    </Link>

                    {/* Info */}
                    <div className="flex flex-1 flex-col border-t border-[#E9E3EE] p-5">
                      <div className="flex items-center justify-between gap-2 text-[9px] font-extrabold uppercase tracking-[.13em]">
                        <span className="text-[#8C52FF]">{product.range}</span>
                        <div className="flex items-center gap-1.5">
                          <VegMarker isVeg={product.isVeg} />
                          <span className="text-[#8B8292]">{product.format}</span>
                        </div>
                      </div>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="mt-3 text-[19px] font-extrabold leading-tight tracking-[-.03em] text-[#2E0569] transition hover:text-[#8C52FF]">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="mt-2 line-clamp-2 text-[12px] leading-[1.7] text-[#716A78]">
                        {product.descriptor}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {product.goals.slice(0, 2).map((g) => (
                          <span key={g} className="rounded-full border border-[#E9E3EE] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[.1em] text-[#6D5A7C]">
                            {g}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-[18px] font-extrabold tracking-[-.03em] text-[#2E0569]">₹{product.price.toLocaleString("en-IN")}</span>
                        {product.mrp !== product.price && (
                          <span className="text-[12px] font-semibold text-[#8B8292] line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
                        )}
                        {product.mrp !== product.price && (
                          <span className="rounded-full bg-[#EAF4E4] px-2 py-0.5 text-[9px] font-extrabold text-[#315C20]">
                            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                          </span>
                        )}
                      </div>
                      <div className="mt-auto pt-3">
                        {!product.inStock ? (
                          <NotifyMeCompact productId={product.id} />
                        ) : (
                        <button
                          onClick={() => addToBag(product)}
                          className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-[11px] font-extrabold uppercase tracking-[.1em] transition ${
                            inBag
                              ? "bg-[#EAF4E4] text-[#315C20]"
                              : "bg-[#8C52FF] text-white hover:bg-[#2E0569]"
                          }`}
                        >
                          {inBag ? (
                            <><ShoppingBag size={14} /> In wellness bag</>
                          ) : (
                            <><Plus size={14} /> Add to bag</>
                          )}
                        </button>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          ) : (
            /* ── List view ── */
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 flex flex-col gap-3"
            >
              {filtered.map((product, i) => {
                const inBag = bag.some((item) => item.id === product.id);
                const isSaved = saved.includes(product.id);
                return (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.24), ease: [0.22, 1, 0.36, 1] }}
                    className="group grid grid-cols-[88px_1fr_auto] items-center gap-5 overflow-hidden rounded-[22px] border border-[#E9E3EE] bg-white p-4 transition duration-300 hover:border-[#CDBAF1] hover:shadow-[0_10px_30px_rgba(46,5,105,.08)] sm:grid-cols-[110px_1fr_auto]"
                  >
                    {/* Thumbnail — links to product detail */}
                    <Link
                      href={`/products/${product.id}`}
                      className="relative aspect-square overflow-hidden rounded-[16px] bg-gradient-to-br from-[#F4EEFF] to-[#FAF6FF] block"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="110px"
                        className="object-contain p-2 transition duration-500 group-hover:scale-[1.05]"
                      />
                    </Link>

                    {/* Details */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] font-extrabold uppercase tracking-[.13em] text-[#8C52FF]">{product.range}</span>
                        <span className="text-[#D8CEE1]">·</span>
                        <VegMarker isVeg={product.isVeg} />
                        <span className="text-[9px] font-extrabold uppercase tracking-[.13em] text-[#8B8292]">{product.format}</span>
                        <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.11em] ${statusStyle(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="mt-1.5 text-[17px] font-extrabold leading-tight tracking-[-.03em] text-[#2E0569] transition hover:text-[#8C52FF]">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="mt-1 line-clamp-1 text-[12px] leading-relaxed text-[#716A78]">
                        {product.descriptor}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {product.goals.slice(0, 2).map((g) => (
                          <span key={g} className="rounded-full border border-[#E9E3EE] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.1em] text-[#6D5A7C]">
                            {g}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-[16px] font-extrabold tracking-[-.03em] text-[#2E0569]">₹{product.price.toLocaleString("en-IN")}</span>
                        {product.mrp !== product.price && (
                          <span className="text-[11px] font-semibold text-[#8B8292] line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
                        )}
                        {product.mrp !== product.price && (
                          <span className="rounded-full bg-[#EAF4E4] px-2 py-0.5 text-[9px] font-extrabold text-[#315C20]">
                            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <button
                        onClick={() => toggleSaved(product.id)}
                        aria-label={isSaved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
                        className={`grid h-10 w-10 place-items-center rounded-full border transition ${
                          isSaved
                            ? "border-[#8C52FF] bg-[#8C52FF] text-white"
                            : "border-[#E9E3EE] bg-white text-[#2E0569] hover:text-[#8C52FF]"
                        }`}
                      >
                        <Heart size={15} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => setQuickView(product)}
                        className="grid h-10 w-10 place-items-center rounded-full border border-[#E9E3EE] bg-white text-[#2E0569] transition hover:border-[#8C52FF] hover:text-[#8C52FF]"
                        aria-label={`Quick view ${product.name}`}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => addToBag(product)}
                        disabled={!product.inStock}
                        className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-[10px] font-extrabold uppercase tracking-[.1em] transition ${
                          !product.inStock
                            ? "hidden"
                            : inBag
                            ? "bg-[#EAF4E4] text-[#315C20]"
                            : "bg-[#8C52FF] text-white hover:bg-[#2E0569]"
                        }`}
                      >
                        {inBag ? (
                          <><ShoppingBag size={13} /><span className="hidden sm:inline">In bag</span></>
                        ) : (
                          <><Plus size={13} /><span className="hidden sm:inline">Add</span></>
                        )}
                      </button>
                      {!product.inStock && <NotifyMeCompact productId={product.id} />}
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom CTA ── */}
        {filtered.length > 0 && (
          <Reveal>
            <div className="mt-16 flex flex-col items-center gap-4 rounded-[28px] border border-[#E9E3EE] bg-gradient-to-br from-[#F4EEFF] to-[#EDE4FF] px-8 py-12 text-center">
              <span className="eyebrow">Looking for something specific?</span>
              <h2 className="text-[28px] font-extrabold tracking-[-.04em] text-[#2E0569] sm:text-[34px]">
                Can't find what you need?
              </h2>
              <p className="max-w-md text-[14px] leading-[1.8] text-[#716A78]">
                Use the search above or explore by wellness goal. For bulk, B2B or custom requirements, use our business enquiry form.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="/b2b" className="btn-primary">
                  Business enquiry <ArrowRight size={15} />
                </a>
                <a href="/contact" className="btn-secondary">
                  Contact us
                </a>
              </div>
            </div>
          </Reveal>
        )}

        <div className="pb-16" />
      </div>
    </div>
  );
}
