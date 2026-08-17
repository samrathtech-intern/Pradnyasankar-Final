"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  X,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { announcements } from "@/data";
import { useApp } from "./AppContext";
import { useAuth } from "./AuthContext";

const menuColumns = [
  {
    title: "Shop by range",
    links: [
      ["All products", "/shop"],
      ["Ayurveda", "/shop/ayurveda"],
      ["Nutraceuticals", "/shop/nutraceuticals"],
      ["External wellness", "/shop?range=External+Wellness"],
      ["Wellness sets", "/shop?range=Wellness+Sets"],
    ],
  },
  {
    title: "Shop by focus",
    links: [
      ["Daily wellness", "/shop?goal=Daily+Wellness"],
      ["Digestive wellness", "/shop?goal=Digestive+Wellness"],
      ["Immunity support", "/shop?goal=Immunity+Support"],
      ["Energy & vitality", "/shop?goal=Energy+%26+Vitality"],
      ["Skin & hair", "/shop?goal=Skin+%26+Hair"],
      ["Sleep & relaxation", "/shop?goal=Sleep+%26+Relaxation"],
    ],
  },
  {
    title: "Shop by format",
    links: [
      ["Capsules", "/shop?format=Capsules"],
      ["Tablets", "/shop?format=Tablets"],
      ["Powders", "/shop?format=Powder"],
      ["Oils", "/shop?format=Oil"],
      ["Serums", "/shop?format=Serum"],
      ["Creams", "/shop?format=Cream"],
    ],
  },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % announcements.length),
      5200,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative z-[70] overflow-hidden bg-gradient-to-r from-[#210044] via-[#2E0569] to-[#3D0880]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,.06)_50%,transparent_60%)] bg-[length:200%_100%] animate-[shimmer_3.5s_linear_infinite]" />
      <div className="mx-auto flex min-h-[42px] max-w-[1500px] items-center justify-center px-10 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.38 }}
            className="text-[10px] font-extrabold uppercase tracking-[.14em] text-white sm:text-[11px]"
          >
            {announcements[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      <motion.div
        key={index}
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#FFBB58] to-[#FFD98A]"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 5.2, ease: "linear" }}
      />
    </div>
  );
}

export function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { bag, saved, setSearchOpen, setBagOpen, setSavedOpen } = useApp();
  const { user, logout } = useAuth();
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close mega menu on click outside
  useEffect(() => {
    if (!megaOpen) return;
    function handleClick(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [megaOpen]);

  const pathname = usePathname();
  const closeMega = () => setMegaOpen(false);

  return (
    <header
      ref={megaRef}
      className={`sticky top-0 z-[60] border-b transition-all duration-500 ${
        scrolled
          ? "border-[#E9E3EE] bg-white/96 shadow-[0_16px_50px_rgba(46,5,105,.09)] backdrop-blur-xl"
          : "border-transparent bg-[#FFFDF7]/[.94] backdrop-blur-lg"
      }`}
    >
      <div className="container-page flex h-[74px] items-center justify-between gap-5 lg:h-[84px]">
        {/* Mobile menu trigger */}
        <button
          className="grid h-11 w-11 place-items-center rounded-full border border-[#E9E3EE] bg-white text-[#2E0569] transition hover:border-[#8C52FF] hover:text-[#8C52FF] lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <a
          href="/"
          className="group relative block h-[48px] w-[190px] shrink-0 sm:w-[215px]"
          aria-label="Pradnyasanskar home"
        >
          <Image
            src="/logo.png"
            alt="Pradnyasanskar Enterprises Pvt. Ltd."
            fill
            priority
            className="object-contain object-left transition duration-300 group-hover:opacity-85"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">
          <button
            type="button"
            className="nav-link"
            onMouseEnter={() => setMegaOpen(true)}
            onFocus={() => setMegaOpen(true)}
            onClick={() => setMegaOpen((open) => !open)}
            aria-expanded={megaOpen}
          >
            Shop{" "}
            <ChevronDown
              size={13}
              className={`transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`}
            />
          </button>
          {[
            ["Ayurveda", "/shop/ayurveda"],
            ["Nutraceuticals", "/shop/nutraceuticals"],
            ["Routines", "/#routines"],
            ["Ingredients", "/ingredients"],
            ["Knowledge", "/knowledge"],
            ["Our story", "/about"],
          ].map(([label, href]) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <a
                key={label}
                className={`nav-link relative after:absolute after:bottom-1 after:left-3 after:right-3 after:h-[2px] after:rounded-full after:bg-[#8C52FF] after:transition-transform after:duration-300 ${
                  isActive
                    ? "text-[#8C52FF] after:scale-x-100"
                    : "after:scale-x-0 hover:after:scale-x-100"
                }`}
                href={href}
                onMouseEnter={closeMega}
              >
                {label}
              </a>
            );
          })}
        </nav>

        {/* Icon actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            className="header-icon"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search size={19} />
          </button>
          <button
            className="header-icon relative hidden sm:grid"
            onClick={() => setSavedOpen(true)}
            aria-label={`${saved.length} saved products`}
          >
            <Heart size={19} />
            {saved.length > 0 && (
              <span className="counter-badge">{saved.length}</span>
            )}
          </button>
          <button
            className="header-icon relative"
            onClick={() => setBagOpen(true)}
            aria-label={`${bag.length} products in wellness bag`}
          >
            <ShoppingBag size={19} />
            {bag.length > 0 && (
              <span className="counter-badge">{bag.length}</span>
            )}
          </button>
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="max-w-[100px] truncate text-[11px] font-extrabold text-[#2E0569]">
                {user?.firstName || user?.name?.split(" ")[0] || "User"}
              </span>
              <button
                onClick={() => logout()}
                className="rounded-full border border-[#E9E3EE] bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#716A78] transition hover:border-[#8C52FF] hover:text-[#8C52FF]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <a
              href="/auth/login"
              className="hidden rounded-full border border-[#E9E3EE] bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#2E0569] transition hover:border-[#8C52FF] hover:text-[#8C52FF] sm:inline-flex"
            >
              Sign in
            </a>
          )}
        </div>
      </div>

      {/* Mega menu */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onMouseLeave={closeMega}
            className="absolute inset-x-0 top-full hidden border-y border-[#E9E3EE] bg-white/98 shadow-[0_32px_80px_rgba(46,5,105,.13)] backdrop-blur-xl lg:block"
          >
            <div className="container-page grid grid-cols-[1fr_1fr_1fr_1.25fr] gap-10 py-10">
              {menuColumns.map((column) => (
                <div key={column.title}>
                  <p className="text-[10px] font-extrabold uppercase tracking-[.17em] text-[#8C52FF]">
                    {column.title}
                  </p>
                  <div className="mt-5 space-y-3">
                    {column.links.map(([link, href]) => (
                      <a
                        key={link}
                        href={href}
                        onClick={closeMega}
                        className="group flex items-center gap-2 text-[13px] font-bold text-[#382D42] transition duration-200 hover:text-[#8C52FF]"
                      >
                        <span className="h-px w-0 rounded-full bg-[#8C52FF] transition-all duration-300 group-hover:w-4" />
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              {/* Featured card */}
              <a
                href="/shop"
                onClick={closeMega}
                className="group relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#F2EBFF] to-[#E8DEFF] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(140,82,255,.18)]"
              >
                <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[#FFBB58]/[.40] blur-xl transition-transform duration-500 group-hover:scale-125" />
                <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-[#8C52FF]/[.12] blur-lg" />
                <p className="relative text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8C52FF]">
                  Guided discovery
                </p>
                <h3 className="relative mt-3 max-w-[220px] text-[24px] font-extrabold leading-tight tracking-[-.04em] text-[#2E0569]">
                  Find a wellness routine that fits your day.
                </h3>
                <span className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-[#2E0569] px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-[.1em] text-white transition duration-300 group-hover:bg-[#8C52FF]">
                  Shop all products <ArrowUpRight size={14} />
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer — rendered via portal to escape header's backdrop-filter stacking context */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.button
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-[80] bg-[#21182B]/[.50] backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 260 }}
                className="fixed inset-y-0 left-0 z-[90] flex w-[min(92vw,420px)] flex-col bg-[#FFFDF7] shadow-[24px_0_80px_rgba(46,5,105,.18)]"
              >
                {/* Drawer header */}
                <div className="flex items-center justify-between border-b border-[#E9E3EE] px-5 py-4">
                  <div className="relative h-12 w-52">
                    <Image src="/logo.png" alt="Pradnyasanskar" fill className="object-contain object-left" />
                  </div>
                  <button
                    className="grid h-10 w-10 place-items-center rounded-full border border-[#E9E3EE] bg-white text-[#2E0569] transition hover:border-[#8C52FF] hover:text-[#8C52FF]"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Search bar */}
                <div className="p-5">
                  <button
                    onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                    className="flex min-h-12 w-full items-center gap-3 rounded-full border border-[#E9E3EE] bg-white px-5 text-left text-[13px] font-semibold text-[#716A78] transition hover:border-[#8C52FF]"
                  >
                    <Search size={17} className="text-[#8C52FF]" />
                    Search products, goals or ingredients
                  </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto px-5 pb-8">
                  {[
                    ["Shop all", "/shop"],
                    ["Ayurveda", "/shop/ayurveda"],
                    ["Nutraceuticals", "/shop/nutraceuticals"],
                    ["Routines", "/#routines"],
                    ["Ingredients", "/ingredients"],
                    ["Knowledge", "/knowledge"],
                    ["Our story", "/about"],
                    ["Quality", "/quality"],
                    ["Contact", "/contact"],
                    ["Business enquiry", "/b2b"],
                    ["Policies", "/policies"],
                  ].map(([label, href]) => {
                    const active = pathname === href || pathname.startsWith(href + "/");
                    return (
                      <a
                        key={label}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex min-h-[56px] items-center justify-between border-b border-[#F0EAF4] text-[15px] font-extrabold transition hover:text-[#8C52FF] ${
                          active ? "text-[#8C52FF]" : "text-[#2E0569]"
                        }`}
                      >
                        {label}
                        <ArrowUpRight size={15} className={active ? "text-[#8C52FF]" : "text-[#8C52FF]/60"} />
                      </a>
                    );
                  })}
                </nav>

                {/* Drawer footer CTA */}
                <div className="border-t border-[#E9E3EE] bg-gradient-to-br from-[#F2EBFF] to-[#EDE4FF] p-5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#8C52FF]" />
                    <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[#8C52FF]">
                      Pradnyasanskar community
                    </p>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#5F5765]">
                    Join for product stories, ingredient education and collection updates.
                  </p>
                  <a
                    href="/#newsletter"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary mt-4 w-full"
                  >
                    Join the community
                  </a>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
