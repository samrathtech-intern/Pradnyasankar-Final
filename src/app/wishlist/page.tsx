"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Loader2,
  PackageOpen,
} from "lucide-react";

import { AppProvider } from "@/components/AppContext";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/components/AuthContext";
import {
  AnnouncementBar,
  Header,
} from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Reveal } from "@/components/Reveal";

type WishlistItem = {
  wishlistId: number;
  userId: number;
  variantId: number;
  productName: string;
  variantName: string;
  createdAt: string;
};

const WISHLIST_API_URL = "http://localhost:8080/api/wishlist";

function WishlistContent() {
  const { token, logout } = useAuth();

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * IMPORTANT:
   *
   * Your wishlist backend requires userId.
   *
   * Change this according to the actual shape
   * returned by your AuthContext.
   *
   * For example, if your auth context has:
   *
   * user: {
   *   userId: 1,
   *   email: "...",
   * }
   *
   * then use:
   *
   * const { token, logout, user } = useAuth();
   *
   * const userId = user?.userId;
   */

  const userId = getUserIdFromAuth();

  // ============================================================
  // LOAD WISHLIST
  // ============================================================

  useEffect(() => {
    if (!token || !userId) {
      setLoading(false);
      return;
    }

    loadWishlist();
  }, [token, userId]);

  async function loadWishlist() {
    if (!token || !userId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${WISHLIST_API_URL}/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (response.status === 401 || response.status === 403) {
        await logout();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load wishlist.");
      }

      const data = (await response.json()) as WishlistItem[];

      setWishlist(data);
    } catch (err) {
      console.error("Wishlist loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your wishlist."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // REMOVE FROM WISHLIST
  // ============================================================

  async function removeFromWishlist(variantId: number) {
    if (!token || !userId) {
      return;
    }

    try {
      setRemovingId(variantId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${WISHLIST_API_URL}?userId=${userId}&variantId=${variantId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        await logout();
        return;
      }

      if (!response.ok) {
        let message = "Failed to remove item from wishlist.";

        try {
          const data = await response.json();

          if (data?.message) {
            message = data.message;
          }
        } catch {
          // Ignore invalid/non-JSON response.
        }

        throw new Error(message);
      }

      setWishlist((previous) =>
        previous.filter(
          (item) => item.variantId !== variantId
        )
      );

      setSuccess("Removed from wishlist.");

      window.setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error("Wishlist remove error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove item."
      );
    } finally {
      setRemovingId(null);
    }
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2
          size={28}
          className="animate-spin text-[#8C52FF]"
        />
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      <div className="container-page py-10 lg:py-16">

        {/* Header */}

        <Reveal>
          <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">
            My Account
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-[-.04em] text-[#2E0569]">
                Wishlist
              </h1>

              <p className="mt-2 text-[14px] text-[#716A78]">
                Products you have saved for later.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E9E3EE] bg-white px-5 py-2.5 text-[12px] font-extrabold text-[#2E0569] transition hover:bg-[#F4EEFF]"
            >
              Continue Shopping
              <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>

        {/* Success */}

        {success && (
          <div className="mt-5 rounded-[14px] border border-[#CFE8C4] bg-[#EAF4E4] px-4 py-3 text-[13px] font-semibold text-[#315C20]">
            {success}
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="mt-5 rounded-[14px] border border-[#F5C6C2] bg-[#FDECEA] px-4 py-3 text-[13px] font-semibold text-[#C0392B]">
            {error}
          </div>
        )}

        {/* Wishlist */}

        {wishlist.length === 0 ? (
          <Reveal>
            <div className="mt-8 rounded-[24px] border border-[#E9E3EE] bg-white px-6 py-16 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#F4EEFF]">
                <Heart
                  size={28}
                  className="text-[#8C52FF]"
                />
              </div>

              <h2 className="mt-5 text-[19px] font-extrabold text-[#2E0569]">
                Your wishlist is empty
              </h2>

              <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-[#8B8292]">
                Save products you love to your wishlist
                and come back to them whenever you want.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8C52FF] to-[#2E0569] px-6 py-3 text-[12px] font-extrabold text-white transition hover:opacity-90"
              >
                Start Shopping
                <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => (
              <Reveal key={item.wishlistId}>
                <article className="group overflow-hidden rounded-[22px] border border-[#E9E3EE] bg-white">

                  {/* Product visual */}

                  <div className="relative flex h-52 items-center justify-center bg-[#FAF7FF]">
                    <div className="grid h-20 w-20 place-items-center rounded-full bg-[#F4EEFF]">
                      <PackageOpen
                        size={34}
                        className="text-[#8C52FF]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeFromWishlist(item.variantId)
                      }
                      disabled={
                        removingId === item.variantId
                      }
                      aria-label={`Remove ${item.productName} from wishlist`}
                      className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-[#C0392B] shadow-sm transition hover:bg-[#FDECEA] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {removingId === item.variantId ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <Heart
                          size={17}
                          fill="currentColor"
                        />
                      )}
                    </button>
                  </div>

                  {/* Product information */}

                  <div className="p-5">
                    <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#8C52FF]">
                      Saved Product
                    </p>

                    <h2 className="mt-2 line-clamp-2 text-[16px] font-extrabold text-[#2E0569]">
                      {item.productName}
                    </h2>

                    {item.variantName && (
                      <p className="mt-1 text-[12px] text-[#716A78]">
                        {item.variantName}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <Link
                        href={`/products/${item.variantId}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#F4EEFF] px-4 py-2.5 text-[11px] font-extrabold text-[#2E0569] transition hover:bg-[#EDE2FF]"
                      >
                        View Product
                        <ArrowRight size={13} />
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(item.variantId)
                        }
                        disabled={
                          removingId === item.variantId
                        }
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#C0392B] transition hover:underline disabled:opacity-50"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/*
 * ============================================================
 * TEMPORARY USER ID HELPER
 * ============================================================
 *
 * IMPORTANT:
 * Replace this with your actual AuthContext user ID.
 *
 * Ideally your AuthContext should expose:
 *
 * const { token, user, logout } = useAuth();
 *
 * and:
 *
 * const userId = user?.userId;
 *
 * I am leaving this isolated here so you can change it
 * in one place.
 */

function getUserIdFromAuth(): number | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser =
    localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    const parsed = JSON.parse(storedUser);

    const id =
      parsed?.userId ??
      parsed?.id;

    if (typeof id === "number") {
      return id;
    }

    if (typeof id === "string" && id.trim() !== "") {
      const numericId = Number(id);

      return Number.isFinite(numericId)
        ? numericId
        : null;
    }

    return null;
  } catch {
    return null;
  }
}

// ============================================================
// PAGE
// ============================================================

export default function WishlistPage() {
  return (
    <AppProvider>
      <div className="min-h-screen overflow-x-clip bg-[#FFFDF7]">
        <AnnouncementBar />

        <Header />

        <main>
          <AuthGuard>
            <WishlistContent />
          </AuthGuard>
        </main>

        <MobileBottomNav />
      </div>
    </AppProvider>
  );
}