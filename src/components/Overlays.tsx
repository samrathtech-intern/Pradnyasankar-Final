"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Eye, Heart, Minus, Plus, Search, ShoppingBag, Trash2, X } from "lucide-react";
import type { Product } from "@/data";
import { useApp } from "./AppContext";
import { useProducts } from "@/lib/useProducts";
import { trackBeginCheckout } from "@/lib/analytics";

function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [locked]);
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function useFocusTrap(ref: React.RefObject<HTMLElement | null>, active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    // Focus first focusable element
    const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
    focusable[0]?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const all = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!all.length) return;
      const first = all[0];
      const last = all[all.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, ref, onClose]);
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, setQuickView } = useApp();
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useBodyLock(searchOpen);
  useFocusTrap(ref, searchOpen, () => setSearchOpen(false));
  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return products.slice(0, 6);
    return products.filter((product) => [product.name, product.range, product.format, product.descriptor, ...product.goals].join(" ").toLowerCase().includes(value)).slice(0, 8);
  }, [query]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div ref={ref} role="dialog" aria-modal="true" aria-label="Search" className="fixed inset-0 z-[100] bg-[#FFFDF7]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="container-page flex h-full flex-col py-5 sm:py-8">
            <div className="flex items-center gap-3">
              <div className="flex min-h-14 flex-1 items-center gap-3 rounded-full border border-[#E9E3EE] bg-white px-5 shadow-soft">
                <Search size={20} className="text-[#8C52FF]" />
                <label className="sr-only" htmlFor="site-search">Search</label>
                <input autoFocus id="site-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, ingredients or wellness goals" className="w-full bg-transparent text-[15px] font-semibold text-[#2E0569] outline-none placeholder:text-[#9B93A1]" />
              </div>
              <button className="header-icon" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={21} /></button>
            </div>
            <div className="mt-8 flex-1 overflow-y-auto pb-10">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#8C52FF]">{query ? "Search results" : "Popular discoveries"}</p>
                  <h2 className="mt-2 text-[32px] font-extrabold tracking-[-.04em] text-[#2E0569]">{query ? `${results.length} matches` : "Start with a product or wellness focus"}</h2>
                </div>
              </div>
              {results.length ? (
                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {results.map((product) => (
                    <article key={product.id} className="group relative overflow-hidden rounded-[26px] border border-[#E9E3EE] bg-white transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(46,5,105,.10)]">
                      {/* Card image — navigates to detail page */}
                      <Link
                        href={`/products/${product.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="block"
                      >
                        <div className="relative aspect-[4/5] overflow-hidden bg-white">
                          <Image src={product.image} alt={product.name} fill className="object-contain p-3 transition duration-500 group-hover:scale-[1.025]" />
                        </div>
                        <div className="p-5">
                          <p className="text-[9px] font-extrabold uppercase tracking-[.13em] text-[#8C52FF]">{product.range}</p>
                          <h3 className="mt-2 text-[19px] font-extrabold text-[#2E0569] transition group-hover:text-[#8C52FF]">{product.name}</h3>
                          <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#2E0569]">
                            View details <ArrowRight size={15} />
                          </span>
                        </div>
                      </Link>
                      {/* Quick view — secondary action */}
                      <button
                        onClick={() => { setSearchOpen(false); setQuickView(product); }}
                        aria-label={`Quick view ${product.name}`}
                        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-[#E9E3EE] bg-white/90 text-[#2E0569] opacity-0 shadow-sm backdrop-blur-sm transition group-hover:opacity-100 hover:border-[#8C52FF] hover:text-[#8C52FF]"
                      >
                        <Eye size={15} />
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-10 rounded-[30px] border border-dashed border-[#D8CEE1] bg-white p-12 text-center">
                  <h3 className="text-[25px] font-extrabold text-[#2E0569]">No matching result found.</h3>
                  <p className="mt-3 text-[13px] text-[#716A78]">Try a product name, range, ingredient or wellness category.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BagDrawer() {
  const { bag, bagOpen, setBagOpen, removeFromBag, updateBagQty, setQuickView, cartLoading, cartError } = useApp();
  const ref = useRef<HTMLElement>(null);
  useBodyLock(bagOpen);
  useFocusTrap(ref, bagOpen, () => setBagOpen(false));

  const subtotal = bag.reduce((sum, p) => sum + (p.price ?? 0) * p.quantity, 0);

  function handleProceedToCheckout() {
    trackBeginCheckout(
      bag.map((p) => ({ id: p.id, name: p.name, range: p.range, format: p.format, price: p.price ?? 0 })),
      subtotal,
    );
    setBagOpen(false);
  }
  return (
    <AnimatePresence>
      {bagOpen && (
        <>
          <motion.button aria-label="Close wellness bag" onClick={() => setBagOpen(false)} className="fixed inset-0 z-[100] bg-[#21182B]/[.45] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside ref={ref} role="dialog" aria-modal="true" aria-label="Wellness bag" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 29, stiffness: 260 }} className="fixed inset-y-0 right-0 z-[110] flex w-[min(94vw,460px)] flex-col bg-[#FFFDF7] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E9E3EE] px-6 py-5">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#8C52FF]">Saved products</p>
                <h2 className="mt-1 text-[25px] font-extrabold text-[#2E0569]">Your wellness bag</h2>
              </div>
              <button className="header-icon" onClick={() => setBagOpen(false)} aria-label="Close wellness bag"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {bag.length ? (
                <div className="space-y-3">
                  {bag.map((product) => (
                    <article key={product.id} className="grid grid-cols-[92px_1fr_auto] gap-4 rounded-[22px] border border-[#E9E3EE] bg-white p-3">
                      <button className="relative h-[92px] overflow-hidden rounded-[16px] bg-white" onClick={() => setQuickView(product)}>
                        <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                      </button>
                      <div className="py-2">
                        <p className="text-[9px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">{product.range}</p>
                        <h3 className="mt-1 text-[15px] font-extrabold text-[#2E0569]">{product.name}</h3>
                        {product.price != null && (
                          <p className="mt-1 text-[13px] font-extrabold text-[#2E0569]">
                            ₹{(product.price * product.quantity).toLocaleString("en-IN")}
                            {product.quantity > 1 && (
                              <span className="ml-1.5 text-[11px] font-semibold text-[#8B8292]">
                                (₹{product.price.toLocaleString("en-IN")} × {product.quantity})
                              </span>
                            )}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-1">
                          <button
                            onClick={() => updateBagQty(product.id, product.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="grid h-7 w-7 place-items-center rounded-full border border-[#E9E3EE] text-[#2E0569] transition hover:border-[#8C52FF] hover:text-[#8C52FF]"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="min-w-[20px] text-center text-[13px] font-extrabold text-[#2E0569]">{product.quantity}</span>
                          <button
                            onClick={() => updateBagQty(product.id, product.quantity + 1)}
                            disabled={product.quantity >= 10}
                            aria-label="Increase quantity"
                            className="grid h-7 w-7 place-items-center rounded-full border border-[#E9E3EE] text-[#2E0569] transition hover:border-[#8C52FF] hover:text-[#8C52FF] disabled:cursor-not-allowed disabled:text-[#C8C0D0]"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <a href={`/products/${product.id}`} onClick={() => setBagOpen(false)} className="mt-1 inline-block text-[10px] font-semibold text-[#8C52FF] hover:underline">View details</a>
                      </div>
                      <button className="mt-2 grid h-9 w-9 place-items-center rounded-full text-[#8B8292] transition hover:bg-[#FFE6D7] hover:text-[#8D3D21]" onClick={() => removeFromBag(product.id)} aria-label={`Remove ${product.name}`}><Trash2 size={16} /></button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-[#F2EBFF] text-[#8C52FF]"><ShoppingBag size={31} /></span>
                  <h3 className="mt-6 text-[28px] font-extrabold text-[#2E0569]">Your wellness bag is waiting.</h3>
                  <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-[#716A78]">Save products while exploring and review your wellness selections together here.</p>
                  <button onClick={() => setBagOpen(false)} className="btn-primary mt-7">Start exploring</button>
                </div>
              )}
            </div>
            {bag.length > 0 && (
              <div className="border-t border-[#E9E3EE] bg-white p-6">
                {cartError && (
                  <p className="mb-3 rounded-[12px] bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-600">{cartError}</p>
                )}
                {cartLoading && (
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold text-[#8C52FF]">
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[#8C52FF] border-t-transparent" />
                    Syncing with your account…
                  </div>
                )}
                <div className="mb-3 flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-[#716A78]">Subtotal ({bag.reduce((n, p) => n + p.quantity, 0)} item{bag.reduce((n, p) => n + p.quantity, 0) !== 1 ? "s" : ""})</span>
                  <span className="font-extrabold text-[#2E0569]">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <Link href="/checkout" onClick={handleProceedToCheckout} className="btn-primary mt-2 w-full">Proceed to checkout</Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function SavedDrawer() {
  const { saved, savedOpen, setSavedOpen, toggleSaved, addToBag, setQuickView } = useApp();
  const { products } = useProducts();
  const savedProducts = products.filter((product) => saved.includes(product.id));
  const moveToBag = (product: Product) => { setSavedOpen(false); addToBag(product); };
  const openQuickView = (product: Product) => { setSavedOpen(false); setQuickView(product); };
  const ref = useRef<HTMLElement>(null);
  useBodyLock(savedOpen);
  useFocusTrap(ref, savedOpen, () => setSavedOpen(false));

  return (
    <AnimatePresence>
      {savedOpen && (
        <>
          <motion.button aria-label="Close saved products" onClick={() => setSavedOpen(false)} className="fixed inset-0 z-[100] bg-[#21182B]/45 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside ref={ref} role="dialog" aria-modal="true" aria-label="Saved products" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 29, stiffness: 260 }} className="fixed inset-y-0 right-0 z-[110] flex w-[min(94vw,480px)] flex-col bg-[#FFFDF7] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E9E3EE] px-6 py-5">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#8C52FF]">Your shortlist</p>
                <h2 className="mt-1 text-[25px] font-extrabold text-[#2E0569]">Saved products</h2>
              </div>
              <button className="header-icon" onClick={() => setSavedOpen(false)} aria-label="Close saved products"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {savedProducts.length ? (
                <div className="space-y-3">
                  {savedProducts.map((product) => (
                    <article key={product.id} className="grid grid-cols-[108px_1fr] gap-4 rounded-[24px] border border-[#E9E3EE] bg-white p-3">
                      <button className="relative min-h-[132px] overflow-hidden rounded-[18px] bg-white" onClick={() => openQuickView(product)} aria-label={`Quick view ${product.name}`}>
                        <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                      </button>
                      <div className="flex flex-col py-2">
                        <p className="text-[9px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">{product.range} • {product.format}</p>
                        <h3 className="mt-1 text-[16px] font-extrabold text-[#2E0569]">{product.name}</h3>
                        <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-[#716A78]">{product.descriptor}</p>
                        <div className="mt-auto flex gap-2 pt-3">
                          <button onClick={() => moveToBag(product)} className="min-h-9 flex-1 rounded-full bg-[#8C52FF] px-3 text-[9px] font-extrabold uppercase tracking-[.1em] text-white transition hover:bg-[#2E0569]">Add to bag</button>
                          <button onClick={() => toggleSaved(product.id)} className="grid h-9 w-9 place-items-center rounded-full border border-[#E9E3EE] text-[#8C52FF] transition hover:bg-[#F2EBFF]" aria-label={`Remove ${product.name} from saved products`}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-[#F2EBFF] text-[#8C52FF]"><Heart size={31} /></span>
                  <h3 className="mt-6 text-[28px] font-extrabold text-[#2E0569]">Save the products that catch your eye.</h3>
                  <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-[#716A78]">Tap the heart on any product card to build a personal shortlist.</p>
                  <button onClick={() => setSavedOpen(false)} className="btn-primary mt-7">Explore products</button>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function QuickViewModal() {
  const { quickView, setQuickView, addToBag, bag } = useApp();
  const ref = useRef<HTMLElement>(null);
  useBodyLock(Boolean(quickView));
  useFocusTrap(ref, Boolean(quickView), () => setQuickView(null));
  if (!quickView) return null;
  const inBag = bag.some((item) => item.id === quickView.id);
  return (
    <AnimatePresence>
      <motion.div role="dialog" aria-modal="true" aria-label="Quick view" className="fixed inset-0 z-[120] grid place-items-center bg-[#21182B]/[.55] p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setQuickView(null); }}>
        <motion.article ref={ref} initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18 }} className="relative grid max-h-[92vh] w-full max-w-[980px] overflow-y-auto rounded-[34px] bg-white shadow-2xl lg:grid-cols-2">
          <button className="absolute right-4 top-4 z-10 header-icon" onClick={() => setQuickView(null)} aria-label="Close quick view"><X size={20} /></button>
          <div className="relative min-h-[430px] bg-white lg:min-h-[650px]">
            <Image src={quickView.image} alt={quickView.name} fill className="object-contain p-6" />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <span className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#8C52FF]">{quickView.range} • {quickView.format}</span>
            <h2 className="mt-4 text-[clamp(36px,5vw,58px)] font-extrabold leading-[1.02] tracking-[-.05em] text-[#2E0569]">{quickView.name}</h2>
            <p className="mt-5 text-[14px] leading-[1.8] text-[#645D68]">{quickView.descriptor}</p>
            <div className="mt-7 rounded-[22px] bg-[#FAF7FF] p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[.13em] text-[#8C52FF]">Product information</p>
              <ul className="mt-4 space-y-2 text-[12px] leading-relaxed text-[#716A78]">
                <li>• Full approved composition and quantity information</li>
                <li>• Directions for use, warnings and storage conditions</li>
                <li>• Pack size, manufacturer and marketer information</li>
                <li>• Pack information and customer-care details</li>
              </ul>
            </div>
            <div className="mt-7 flex gap-3">
              <button
                disabled={inBag}
                onClick={() => addToBag(quickView)}
                className={`min-h-[52px] flex-1 rounded-full px-6 text-[11px] font-extrabold uppercase tracking-[.12em] transition ${inBag ? "bg-[#EAF4E4] text-[#315C20]" : "bg-[#8C52FF] text-white hover:bg-[#2E0569]"}`}
              >
                {inBag ? "Saved to wellness bag" : "Add to wellness bag"}
              </button>
              <a
                href={`/products/${quickView.id}`}
                onClick={() => setQuickView(null)}
                className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-[#E9E3EE] px-5 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569] transition hover:border-[#8C52FF] hover:text-[#8C52FF]"
              >
                Full details
              </a>
            </div>
            <p className="mt-4 text-[10px] leading-relaxed text-[#8B8292]">This page supports product discovery only and does not provide diagnosis, prescription or personalised medical advice.</p>
          </div>
        </motion.article>
      </motion.div>
    </AnimatePresence>
  );
}
