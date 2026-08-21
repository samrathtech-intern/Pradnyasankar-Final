
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Package,
  RefreshCw,
  Truck,
  XCircle,
  CreditCard,
  MapPin,
  Phone,
  User,
  AlertCircle,
} from "lucide-react";

import { AppProvider } from "@/components/AppContext";
import { AuthGuard } from "@/components/AuthGuard";
import { AnnouncementBar, Header } from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Reveal } from "@/components/Reveal";
import { DownloadInvoiceButton } from "@/components/DownloadInvoiceButton";

// ─────────────────────────────────────────────────────────────────────────────
// Backend response types
// ─────────────────────────────────────────────────────────────────────────────

type BackendOrderItem = {
  orderItemId: number;
  variantId: number;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  subtotal: number;
};

type BackendOrder = {
  orderId: number;
  orderNumber: string;
  userId: number;

  customerName: string;
  fullName: string;
  mobileNumber: string;

  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  orderStatus: string;
  paymentStatus: string;

  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingCharge: number;
  totalAmount: number;

  notes: string;
  orderedAt: string;

  items: BackendOrderItem[];

  razorpayOrderId: string | null;
  amount: number | null;
  currency: string | null;
  status: string | null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatCurrency(value: number | null | undefined) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso: string) {
  if (!iso) return "-";

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  if (!iso) return "-";

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Order status
// ─────────────────────────────────────────────────────────────────────────────

const ORDER_STATUS_META: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
  }
> = {
  PENDING: {
    label: "Pending",
    color: "text-[#7A5200]",
    bg: "bg-[#FFF3CD]",
  },

  CONFIRMED: {
    label: "Confirmed",
    color: "text-[#315C20]",
    bg: "bg-[#EAF4E4]",
  },

  PROCESSING: {
    label: "Processing",
    color: "text-[#7A5200]",
    bg: "bg-[#FFF3CD]",
  },

  PACKED: {
    label: "Packed",
    color: "text-[#7A5200]",
    bg: "bg-[#FFF3CD]",
  },

  SHIPPED: {
    label: "Shipped",
    color: "text-[#1A4F8A]",
    bg: "bg-[#E3EEFF]",
  },

  OUT_FOR_DELIVERY: {
    label: "Out for delivery",
    color: "text-[#1A4F8A]",
    bg: "bg-[#E3EEFF]",
  },

  DELIVERED: {
    label: "Delivered",
    color: "text-[#315C20]",
    bg: "bg-[#EAF4E4]",
  },

  CANCELLED: {
    label: "Cancelled",
    color: "text-[#8B1A1A]",
    bg: "bg-[#FDECEA]",
  },

  RETURNED: {
    label: "Returned",
    color: "text-[#8B1A1A]",
    bg: "bg-[#FDECEA]",
  },
};

function getOrderStatusMeta(status: string) {
  return (
    ORDER_STATUS_META[status?.toUpperCase()] ?? {
      label: status || "Unknown",
      color: "text-[#716A78]",
      bg: "bg-[#F4F4F4]",
    }
  );
}

const PAYMENT_STATUS_META: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
  }
> = {
  PENDING: {
    label: "Payment pending",
    color: "text-[#7A5200]",
    bg: "bg-[#FFF3CD]",
  },

  SUCCESS: {
    label: "Payment successful",
    color: "text-[#315C20]",
    bg: "bg-[#EAF4E4]",
  },

  FAILED: {
    label: "Payment failed",
    color: "text-[#8B1A1A]",
    bg: "bg-[#FDECEA]",
  },

  REFUNDED: {
    label: "Refunded",
    color: "text-[#1A4F8A]",
    bg: "bg-[#E3EEFF]",
  },
}; 

function getPaymentStatusMeta(status: string) {
  return (
    PAYMENT_STATUS_META[status?.toUpperCase()] ?? {
      label: status || "Unknown",
      color: "text-[#716A78]",
      bg: "bg-[#F4F4F4]",
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Order card
// ─────────────────────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: BackendOrder }) {
  const [expanded, setExpanded] = useState(false);

  const orderStatus = getOrderStatusMeta(order.orderStatus);
  const paymentStatus = getPaymentStatusMeta(order.paymentStatus);

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E9E3EE] bg-white">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-[#FFFCFF]"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-extrabold text-[#2E0569]">
              {order.orderNumber}
            </span>

            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${orderStatus.bg} ${orderStatus.color}`}
            >
              {orderStatus.label}
            </span>

            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${paymentStatus.bg} ${paymentStatus.color}`}
            >
              {paymentStatus.label}
            </span>
          </div>

          <p className="mt-1 text-[11px] text-[#8B8292]">
            {order.items.length} item
            {order.items.length !== 1 ? "s" : ""} · Placed{" "}
            {formatDate(order.orderedAt)} ·{" "}
            <span className="font-bold text-[#2E0569]">
              {formatCurrency(order.totalAmount)}
            </span>
          </p>
        </div>

        {expanded ? (
          <ChevronUp
            size={17}
            className="shrink-0 text-[#8B8292]"
          />
        ) : (
          <ChevronDown
            size={17}
            className="shrink-0 text-[#8B8292]"
          />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="space-y-6 border-t border-[#E9E3EE] px-6 pb-6 pt-5">
          {/* Order information */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[14px] bg-[#FAFAFA] px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                Order number
              </p>
              <p className="mt-1 text-[12px] font-bold text-[#2E0569]">
                {order.orderNumber}
              </p>
            </div>

            <div className="rounded-[14px] bg-[#FAFAFA] px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                Order date
              </p>
              <p className="mt-1 text-[12px] font-bold text-[#2E0569]">
                {formatDateTime(order.orderedAt)}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Package size={15} className="text-[#8C52FF]" />
              <h3 className="text-[13px] font-extrabold text-[#2E0569]">
                Order items
              </h3>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.orderItemId}
                  className="flex items-center gap-3 rounded-[16px] border border-[#F0EBF2] bg-[#FFFEFC] p-3"
                >
                  {/* No image exists in the backend response,
                      so use an icon instead of inventing an image URL. */}
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[12px] bg-gradient-to-br from-[#F4EEFF] to-[#FAF6FF]">
                    <Package
                      size={23}
                      className="text-[#8C52FF]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-extrabold text-[#2E0569]">
                      {item.productName}
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-[#716A78]">
                      {item.variantName}
                    </p>

                    <p className="mt-1 text-[11px] text-[#8B8292]">
                      Qty:{" "}
                      <span className="font-bold text-[#2E0569]">
                        {item.quantity}
                      </span>{" "}
                      × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[13px] font-extrabold text-[#2E0569]">
                      {formatCurrency(item.subtotal)}
                    </p>

                    {item.discountAmount > 0 && (
                      <p className="mt-0.5 text-[10px] text-[#315C20]">
                        Discount{" "}
                        {formatCurrency(item.discountAmount)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <CreditCard size={15} className="text-[#8C52FF]" />
              <h3 className="text-[13px] font-extrabold text-[#2E0569]">
                Price details
              </h3>
            </div>

            <div className="space-y-1.5 rounded-[16px] bg-[#FAFAFA] px-4 py-4 text-[12px]">
              <div className="flex justify-between text-[#716A78]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2E0569]">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-[#315C20]">
                  <span>Discount</span>
                  <span className="font-semibold">
                    −{formatCurrency(order.discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-[#716A78]">
                <span>Tax / GST</span>
                <span className="font-semibold text-[#2E0569]">
                  {formatCurrency(order.taxAmount)}
                </span>
              </div>

              <div className="flex justify-between text-[#716A78]">
                <span>Shipping</span>
                <span className="font-semibold text-[#2E0569]">
                  {order.shippingCharge === 0
                    ? "Free"
                    : formatCurrency(order.shippingCharge)}
                </span>
              </div>

              <div className="mt-2 flex justify-between border-t border-[#E9E3EE] pt-3 text-[13px] font-extrabold text-[#2E0569]">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <User size={15} className="text-[#8C52FF]" />
              <h3 className="text-[13px] font-extrabold text-[#2E0569]">
                Customer details
              </h3>
            </div>

            <div className="rounded-[16px] bg-[#FAFAFA] px-4 py-4">
              <p className="text-[13px] font-extrabold text-[#2E0569]">
                {order.fullName || order.customerName}
              </p>

              {order.customerName &&
                order.customerName !== order.fullName && (
                  <p className="mt-1 text-[11px] text-[#8B8292]">
                    Account: {order.customerName}
                  </p>
                )}

              {order.mobileNumber && (
                <div className="mt-2 flex items-center gap-2 text-[12px] text-[#716A78]">
                  <Phone size={13} />
                  <span>{order.mobileNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery address */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <MapPin size={15} className="text-[#8C52FF]" />
              <h3 className="text-[13px] font-extrabold text-[#2E0569]">
                Delivery address
              </h3>
            </div>

            <div className="rounded-[16px] bg-[#FAFAFA] px-4 py-4 text-[12px] leading-relaxed text-[#716A78]">
              <p className="font-extrabold text-[#2E0569]">
                {order.fullName || order.customerName}
              </p>

              <p className="mt-1">
                {order.addressLine1}
                {order.addressLine2
                  ? `, ${order.addressLine2}`
                  : ""}
              </p>

              {order.landmark && (
                <p>
                  Landmark:{" "}
                  <span className="font-semibold">
                    {order.landmark}
                  </span>
                </p>
              )}

              <p>
                {order.city}, {order.state} – {order.postalCode}
              </p>

              <p>{order.country}</p>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="rounded-[16px] bg-[#F4EEFF] px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#8C52FF]">
                Order notes
              </p>

              <p className="mt-1 text-[12px] text-[#716A78]">
                {order.notes}
              </p>
            </div>
          )}

          {/* Payment information */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <CreditCard size={15} className="text-[#8C52FF]" />
              <h3 className="text-[13px] font-extrabold text-[#2E0569]">
                Payment
              </h3>
            </div>

            <div className="rounded-[16px] bg-[#FAFAFA] px-4 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${paymentStatus.bg} ${paymentStatus.color}`}
                >
                  {paymentStatus.label}
                </span>

                {order.currency && (
                  <span className="text-[11px] text-[#8B8292]">
                    Currency: {order.currency}
                  </span>
                )}
              </div>

              {order.razorpayOrderId && (
                <div className="mt-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">
                    Razorpay order ID
                  </p>

                  <p className="mt-1 break-all text-[11px] font-semibold text-[#2E0569]">
                    {order.razorpayOrderId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Invoice */}
          <div className="flex flex-wrap gap-2 pt-1">
            <DownloadInvoiceButton
              orderId={String(order.orderId)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Orders content
// ─────────────────────────────────────────────────────────────────────────────

function OrdersContent() {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchOrders() {
    try {
      setLoading(true);
      setError("");

      // Adjust these keys if your AuthContext uses a different
      // localStorage key for the JWT.
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("jwt");

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        "/api/orders/my-orders",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please login again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "You are not authorized to view your orders."
          );
        }

        throw new Error(
          `Unable to load orders. Server returned ${response.status}.`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid orders response received from the server."
        );
      }

      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading your orders."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      <div className="container-page py-12 lg:py-16">
        <Reveal>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-[#8C52FF] hover:underline"
          >
            <ArrowLeft size={13} />
            Back to shop
          </Link>

          <h1 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-[-.04em] text-[#2E0569]">
            My orders
          </h1>

          <p className="mt-2 text-[14px] text-[#716A78]">
            Track your orders, payment status, delivery details, and
            order items below.
          </p>
        </Reveal>

        <div className="mt-8 max-w-2xl space-y-4">
          {/* Loading */}
          {loading && (
            <Reveal>
              <div className="flex flex-col items-center justify-center rounded-[24px] border border-[#E9E3EE] bg-white py-16 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-[#F4EEFF]">
                  <Package
                    size={28}
                    className="animate-pulse text-[#8C52FF]"
                  />
                </div>

                <p className="mt-4 text-[15px] font-extrabold text-[#2E0569]">
                  Loading your orders...
                </p>

                <p className="mt-1 text-[13px] text-[#716A78]">
                  Please wait while we fetch your latest orders.
                </p>
              </div>
            </Reveal>
          )}

          {/* Error */}
          {!loading && error && (
            <Reveal>
              <div className="rounded-[24px] border border-[#FDECEA] bg-white px-6 py-10 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#FDECEA]">
                  <AlertCircle
                    size={28}
                    className="text-[#C0392B]"
                  />
                </div>

                <p className="mt-4 text-[15px] font-extrabold text-[#2E0569]">
                  Unable to load orders
                </p>

                <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-[#716A78]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchOrders}
                  className="btn-primary mt-5"
                >
                  Try again
                </button>
              </div>
            </Reveal>
          )}

          {/* Empty */}
          {!loading && !error && orders.length === 0 && (
            <Reveal>
              <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[#E9E3EE] bg-white py-16 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-[#F4EEFF]">
                  <Package
                    size={28}
                    className="text-[#8C52FF]"
                  />
                </span>

                <p className="text-[15px] font-extrabold text-[#2E0569]">
                  No orders yet
                </p>

                <p className="text-[13px] text-[#716A78]">
                  Your orders will appear here once you place one.
                </p>

                <Link
                  href="/shop"
                  className="btn-primary mt-2"
                >
                  Start shopping
                  <Truck size={14} />
                </Link>
              </div>
            </Reveal>
          )}

          {/* Orders */}
          {!loading &&
            !error &&
            orders.map((order) => (
              <Reveal key={order.orderId}>
                <OrderCard order={order} />
              </Reveal>
            ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  return (
    <AppProvider>
      <div className="min-h-screen overflow-x-clip bg-[#FFFDF7]">
        <AnnouncementBar />

        <Header />

        <main>
          <AuthGuard>
            <OrdersContent />
          </AuthGuard>
        </main>

        <MobileBottomNav />
      </div>
    </AppProvider>
  );
}

