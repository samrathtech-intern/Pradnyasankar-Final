"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "@/data";
import { Order } from "@/lib/orders";
import { trackAddToCart } from "@/lib/analytics";

export type BagItem = Product & { quantity: number };

type AppContextValue = {
  bag: BagItem[];
  saved: string[];
  hydrated: boolean;
  searchOpen: boolean;
  bagOpen: boolean;
  savedOpen: boolean;
  quickView: Product | null;
  pendingOrder: Omit<Order, "id" | "placedAt" | "status"> | null;
  addToBag: (product: Product, qty?: number) => void;
  removeFromBag: (id: string) => void;
  updateBagQty: (id: string, qty: number) => void;
  clearBag: () => void;
  toggleSaved: (id: string) => void;
  setSearchOpen: (open: boolean) => void;
  setBagOpen: (open: boolean) => void;
  setSavedOpen: (open: boolean) => void;
  setQuickView: (product: Product | null) => void;
  setPendingOrder: (order: Omit<Order, "id" | "placedAt" | "status"> | null) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [bag, setBag] = useState<BagItem[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [pendingOrder, setPendingOrder] = useState<Omit<Order, "id" | "placedAt" | "status"> | null>(null);

  // Hydrate from localStorage after mount so server and first client render match
  useEffect(() => {
    const rawBag = readStorage<BagItem[]>("ps_bag", []);
    // Filter out any stale items missing required fields; default quantity to 1 for legacy items
    setBag(rawBag.filter((p) => p && p.id && p.price != null).map((p) => ({ ...p, quantity: p.quantity ?? 1 })));
    setSaved(readStorage<string[]>("ps_saved", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("ps_bag", JSON.stringify(bag)); } catch {}
  }, [bag, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("ps_saved", JSON.stringify(saved)); } catch {}
  }, [saved, hydrated]);

  const value = useMemo<AppContextValue>(() => ({
    bag,
    saved,
    hydrated,
    searchOpen,
    bagOpen,
    savedOpen,
    quickView,
    pendingOrder,
    addToBag: (product, qty = 1) => {
      setBag((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: Math.min(10, item.quantity + qty) }
              : item
          );
        }
        return [...current, { ...product, quantity: Math.min(10, qty) }];
      });
      setBagOpen(true);
      trackAddToCart(product);
    },
    removeFromBag: (id) => setBag((current) => current.filter((item) => item.id !== id)),
    updateBagQty: (id, qty) => setBag((current) =>
      qty < 1
        ? current.filter((item) => item.id !== id)
        : current.map((item) => item.id === id ? { ...item, quantity: Math.min(10, qty) } : item)
    ),
    clearBag: () => setBag([]),
    toggleSaved: (id) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]),
    setSearchOpen,
    setBagOpen,
    setSavedOpen,
    setQuickView,
    setPendingOrder,
  }), [bag, saved, hydrated, searchOpen, bagOpen, savedOpen, quickView, pendingOrder]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
