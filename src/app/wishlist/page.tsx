"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Trash2,
  Loader2,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

import { useAuth } from "@/components/AuthContext";

import {
  getWishlist,
  removeFromWishlist,
  type WishlistItem,
} from "@/lib/wishlistApi";

export default function WishlistPage() {
  const { user, token } = useAuth();

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // ==========================
  // Load Wishlist
  // ==========================

  useEffect(() => {
    async function loadWishlist() {
      if (!user || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getWishlist(Number(user.userId));

        setWishlist(data);
      } catch (err) {
        console.error("Wishlist error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load wishlist."
        );
      } finally {
        setLoading(false);
      }
    }

    loadWishlist();
  }, [user, token]);

  // ==========================
  // Remove Wishlist Item
  // ==========================

  async function handleRemove(variantId: number) {
    if (!user || !token) return;

    try {
      setRemovingId(variantId);
      setError("");

      await removeFromWishlist(Number(user.userId), variantId);

      // Remove immediately from UI
      setWishlist((current) =>
        current.filter(
          (item) => item.variantId !== variantId
        )
      );
    } catch (err) {
      console.error("Remove wishlist error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove product."
      );
    } finally {
      setRemovingId(null);
    }
  }

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF8FC]">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={32}
            className="animate-spin text-[#8C52FF]"
          />

          <p className="text-sm font-semibold text-[#716A78]">
            Loading your wishlist...
          </p>
        </div>
      </main>
    );
  }

  // ==========================
  // Not Logged In
  // ==========================

  if (!user || !token) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF8FC] px-6">
        <div className="w-full max-w-md rounded-[28px] border border-[#E9E3EE] bg-white p-10 text-center shadow-[0_20px_60px_rgba(46,5,105,.08)]">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F2EBFF]">
            <Heart
              size={30}
              className="text-[#8C52FF]"
            />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-[#2E0569]">
            Sign in to view your wishlist
          </h1>

          <p className="mt-2 text-sm text-[#716A78]">
            Save your favorite products and access them anytime.
          </p>

          <Link
            href="/auth/login?redirect=/wishlist"
            className="mt-7 inline-flex rounded-full bg-[#8C52FF] px-7 py-3 text-sm font-extrabold text-white transition hover:bg-[#2E0569]"
          >
            Sign In
          </Link>

        </div>
      </main>
    );
  }

  // ==========================
  // Wishlist Page
  // ==========================

  return (
    <main className="min-h-screen bg-[#FAF8FC] px-5 py-10 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8">

          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#716A78] transition hover:text-[#8C52FF]"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2EBFF]">
              <Heart
                size={24}
                className="text-[#8C52FF]"
                fill="currentColor"
              />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-[-.03em] text-[#2E0569]">
                My Wishlist
              </h1>

              <p className="mt-1 text-sm text-[#716A78]">
                {wishlist.length}{" "}
                {wishlist.length === 1
                  ? "product"
                  : "products"}{" "}
                saved
              </p>
            </div>

          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* Empty Wishlist */}

        {wishlist.length === 0 ? (
          <div className="rounded-[28px] border border-[#E9E3EE] bg-white px-6 py-16 text-center shadow-[0_15px_40px_rgba(46,5,105,.05)]">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F7F2FF]">
              <Heart
                size={38}
                className="text-[#B8A6D1]"
              />
            </div>

            <h2 className="mt-6 text-xl font-extrabold text-[#2E0569]">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#716A78]">
              You haven't added any products to your wishlist yet.
              Browse our products and save your favorites here.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#8C52FF] px-7 py-3 text-sm font-extrabold text-white transition hover:bg-[#2E0569]"
            >
              <ShoppingBag size={16} />
              Browse Products
            </Link>

          </div>
        ) : (

          /* Wishlist Products */

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {wishlist.map((item) => (

              <div
                key={item.wishlistId}
                className="group overflow-hidden rounded-[24px] border border-[#E9E3EE] bg-white shadow-[0_12px_35px_rgba(46,5,105,.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(46,5,105,.10)]"
              >

                {/* Product Image Placeholder */}

                <div className="relative flex h-52 items-center justify-center bg-[#F7F2FF]">

                  <Heart
                    size={55}
                    className="text-[#8C52FF]"
                    fill="currentColor"
                  />

                  {/* Remove button */}

                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(item.variantId)
                    }
                    disabled={
                      removingId === item.variantId
                    }
                    aria-label={`Remove ${item.productName} from wishlist`}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {removingId === item.variantId ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={17} />
                    )}
                  </button>

                </div>

                {/* Product Information */}

                <div className="p-5">

                  <h2 className="line-clamp-2 min-h-[48px] text-lg font-extrabold text-[#2E0569]">
                    {item.productName}
                  </h2>

                  <p className="mt-2 min-h-[40px] text-sm font-medium text-[#716A78]">
                    {item.variantName}
                  </p>

                  <div className="mt-4 border-t border-[#F0EBF4] pt-4">

                    <p className="text-xs text-[#9B93A1]">
                      Added on{" "}
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemove(item.variantId)
                      }
                      disabled={
                        removingId === item.variantId
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-3 text-sm font-extrabold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {removingId === item.variantId ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                          Removing...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} />
                          Remove from Wishlist
                        </>
                      )}
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </main>
  );
}