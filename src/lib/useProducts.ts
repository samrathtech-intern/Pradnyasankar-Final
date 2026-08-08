"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/data";
import { fetchProducts } from "./productApi";

/**
 * Shared cached product catalogue hook.
 *
 * All product surfaces (catalogue, homepage showcase, search overlay, saved
 * drawer, product detail) fetch from the same backend endpoint once and share
 * the result, avoiding duplicate network calls. A module-level promise cache
 * ensures the first completed fetch is reused across consumers.
 */

let productsCache: Product[] | null = null;
let inflight: Promise<Product[]> | null = null;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(productsCache ?? []);
  const [loading, setLoading] = useState(!productsCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (productsCache) {
      setProducts(productsCache);
      setLoading(false);
      return;
    }

    if (!inflight) {
      inflight = fetchProducts()
        .then((data) => {
          productsCache = data;
          return data;
        })
        .catch((err: unknown) => {
          productsCache = [];
          throw err;
        })
        .finally(() => {
          inflight = null;
        });
    }

    inflight
      .then((data) => {
        if (cancelled) return;
        setProducts(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load products.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Allow callers to trigger a manual refresh.
  const refetch = () => {
    productsCache = null;
    inflight = null;
    setLoading(true);
    setError(null);
    fetchProducts()
      .then((data) => {
        productsCache = data;
        setProducts(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load products.");
        setLoading(false);
      });
  };

  return { products, loading, error, refetch };
}
