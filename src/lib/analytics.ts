/**
 * Analytics service — Pradnyasanskar
 *
 * Architecture:
 * - All events are pushed to window.dataLayer (GTM standard).
 * - GTM container (NEXT_PUBLIC_GTM_ID) forwards events to GA4, ad pixels, etc.
 * - GTM container configuration is handled by the marketing/analytics team.
 * - Consent-aware loading: GTM script is injected only after consent is granted.
 *   Replace `hasAnalyticsConsent()` with your CMP integration when available.
 *
 * UTM attribution:
 * - UTM params are captured from the URL on first load and stored in sessionStorage.
 * - They are attached to every event for campaign attribution.
 */

/* ── Types ─────────────────────────────────────────────────────────────── */

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_category: string;
  item_variant?: string;
  price: number;
  quantity?: number;
};

export type PaymentResultStatus = "success" | "failure" | "cancelled" | "pending";

/* ── dataLayer helper ───────────────────────────────────────────────────── */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function push(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...getUtmParams(), ...params });
}

/* ── Consent stub ───────────────────────────────────────────────────────── */

/**
 * Replace this function with your CMP (e.g. Cookiebot, OneTrust) consent check.
 * Currently defaults to true so GTM loads in development.
 * In production, wire this to the user's actual consent state.
 */
export function hasAnalyticsConsent(): boolean {
  // TODO: integrate with CMP — e.g. return window.Cookiebot?.consent?.statistics ?? false
  return true;
}

/* ── GTM script loader ──────────────────────────────────────────────────── */

let gtmLoaded = false;

export function loadGTM(): void {
  if (typeof window === "undefined") return;
  if (gtmLoaded) return;
  if (!hasAnalyticsConsent()) return;

  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if (!id) {
    // GTM ID not configured — events still push to dataLayer for debugging
    return;
  }

  // Initialise dataLayer before GTM script
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  document.head.appendChild(script);

  gtmLoaded = true;
}

/* ── UTM attribution ────────────────────────────────────────────────────── */

const UTM_KEY = "ps_utm";
const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export function captureUtm(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  UTM_PARAMS.forEach((key) => {
    const val = params.get(key);
    if (val) utm[key] = val;
  });
  if (Object.keys(utm).length > 0) {
    try { sessionStorage.setItem(UTM_KEY, JSON.stringify(utm)); } catch {}
  }
}

function getUtmParams(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(UTM_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/* ── Event helpers ──────────────────────────────────────────────────────── */

function toItem(p: { id: string; name: string; range: string; format?: string; price: number }, qty = 1): AnalyticsItem {
  return {
    item_id: p.id,
    item_name: p.name,
    item_category: p.range,
    item_variant: p.format,
    price: p.price,
    quantity: qty,
  };
}

/* ── Events ─────────────────────────────────────────────────────────────── */

/** Fire on every route change — called from the GTM provider component */
export function trackPageView(path: string, title?: string): void {
  push("page_view", { page_path: path, page_title: title ?? document.title });
}

/** Fire when a product detail page is viewed */
export function trackViewItem(product: { id: string; name: string; range: string; format?: string; price: number }): void {
  push("view_item", {
    currency: "INR",
    value: product.price,
    items: [toItem(product)],
  });
}

/** Fire when the search input is submitted */
export function trackSearch(query: string, resultsCount: number): void {
  push("search", { search_term: query, results_count: resultsCount });
}

/** Fire when a catalogue filter is applied */
export function trackFilter(filterType: string, filterValue: string): void {
  push("filter", { filter_type: filterType, filter_value: filterValue });
}

/** Fire when a product is added to the bag */
export function trackAddToCart(product: { id: string; name: string; range: string; format?: string; price: number }): void {
  push("add_to_cart", {
    currency: "INR",
    value: product.price,
    items: [toItem(product)],
  });
}

/** Fire when the user reaches the checkout review step */
export function trackBeginCheckout(
  items: { id: string; name: string; range: string; format?: string; price: number }[],
  total: number,
  coupon?: string,
): void {
  push("begin_checkout", {
    currency: "INR",
    value: total,
    coupon: coupon ?? "",
    items: items.map((p) => toItem(p)),
  });
}

/** Fire when a coupon is successfully applied */
export function trackApplyCoupon(couponCode: string, discountAmount: number): void {
  push("apply_coupon", { coupon_code: couponCode, discount_amount: discountAmount });
}

/**
 * Fire after Razorpay modal closes with a result.
 * Note: `success` here is the browser callback only.
 * Authoritative purchase confirmation must come from backend webhook (PAY-003/PAY-004).
 */
export function trackPaymentResult(status: PaymentResultStatus, orderId?: string, amount?: number): void {
  push("payment_result", { payment_status: status, order_id: orderId ?? "", value: amount ?? 0, currency: "INR" });
}

/**
 * Fire on the order-confirmation page after the order is saved.
 * This is the frontend purchase event — backend must confirm via webhook for authoritative data.
 */
export function trackPurchase(
  orderId: string,
  items: { id: string; name: string; range: string; format?: string; price: number }[],
  total: number,
  tax: number,
  shipping: number,
  coupon?: string,
): void {
  push("purchase", {
    transaction_id: orderId,
    currency: "INR",
    value: total,
    tax,
    shipping,
    coupon: coupon ?? "",
    items: items.map((p) => toItem(p)),
  });
}

/**
 * Prepare refund event structure — to be fired by the backend team
 * when a refund is confirmed via Razorpay webhook.
 * Frontend fires this only when the admin marks a refund as completed.
 */
export function trackRefund(orderId: string, amount: number, items?: AnalyticsItem[]): void {
  push("refund", {
    transaction_id: orderId,
    currency: "INR",
    value: amount,
    ...(items ? { items } : {}),
  });
}

/** Fire when a B2B or contact enquiry form is submitted */
export function trackEnquirySubmission(enquiryType: "b2b" | "contact", formData: { enquiryType?: string; topic?: string }): void {
  push("enquiry_submission", {
    enquiry_channel: enquiryType,
    enquiry_type: formData.enquiryType ?? formData.topic ?? "",
  });
}
