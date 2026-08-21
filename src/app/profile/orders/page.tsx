"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Package,
  RefreshCw,
  Truck,
  XCircle,
  AlertCircle,
  Loader2,
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
import { DownloadInvoiceButton } from "@/components/DownloadInvoiceButton";

// ============================================================
// TYPES
// ============================================================

type BackendOrderItem = {
  orderItemId?: number | string;
  variantId?: number | string;

  productName?: string;
  variantName?: string;

  categoryName?: string;
  category?: string;

  quantity?: number;

  unitPrice?: number;
  totalPrice?: number;

  discountAmount?: number;
  taxAmount?: number;
  subtotal?: number;

  imageUrl?: string;
  productImageUrl?: string;
};

type BackendOrder = {
  orderId?: number | string;
  orderNumber?: string;

  userId?: number | string;

  customerName?: string;
  fullName?: string;
  customerFullName?: string;

  mobileNumber?: string;
  phone?: string;

  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;

  city?: string;
  state?: string;
  postalCode?: string;
  pincode?: string;
  country?: string;

  orderStatus?: string;
  status?: string;

  paymentStatus?: string;

  subtotal?: number;
  discountAmount?: number;

  taxAmount?: number;
  gstAmount?: number;

  shippingCharge?: number;
  shippingAmount?: number;
  shippingCost?: number;

  totalAmount?: number;

  notes?: string;

  orderedAt?: string;
  createdAt?: string;
  orderDate?: string;

  items?: BackendOrderItem[];

  razorpayOrderId?: string | null;
  amount?: number | null;
  currency?: string | null;

  invoiceUrl?: string | null;
};

// ============================================================
// HELPERS
// ============================================================

function formatCurrency(
  value: number | null | undefined
) {
  const amount = Number(value ?? 0);

  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(
  value?: string | null
) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getOrderDate(order: BackendOrder) {
  return (
    order.orderedAt ??
    order.createdAt ??
    order.orderDate ??
    ""
  );
}

function getOrderItems(order: BackendOrder) {
  return Array.isArray(order.items)
    ? order.items
    : [];
}

function getItemCount(order: BackendOrder) {
  return getOrderItems(order).reduce(
    (total, item) =>
      total + Number(item.quantity ?? 0),
    0
  );
}

function getItemTotal(
  item: BackendOrderItem
) {
  if (
    item.totalPrice !== undefined &&
    item.totalPrice !== null
  ) {
    return Number(item.totalPrice);
  }

  if (
    item.subtotal !== undefined &&
    item.subtotal !== null
  ) {
    return Number(item.subtotal);
  }

  return (
    Number(item.unitPrice ?? 0) *
    Number(item.quantity ?? 0)
  );
}

function getSubtotal(
  order: BackendOrder
) {
  if (
    order.subtotal !== undefined &&
    order.subtotal !== null
  ) {
    return Number(order.subtotal);
  }

  return getOrderItems(order).reduce(
    (total, item) =>
      total + getItemTotal(item),
    0
  );
}

function getShipping(
  order: BackendOrder
) {
  if (
    order.shippingCharge !== undefined &&
    order.shippingCharge !== null
  ) {
    return Number(order.shippingCharge);
  }

  if (
    order.shippingAmount !== undefined &&
    order.shippingAmount !== null
  ) {
    return Number(order.shippingAmount);
  }

  if (
    order.shippingCost !== undefined &&
    order.shippingCost !== null
  ) {
    return Number(order.shippingCost);
  }

  return 0;
}

function getGST(
  order: BackendOrder,
  subtotal: number,
  shipping: number
) {
  if (
    order.taxAmount !== undefined &&
    order.taxAmount !== null
  ) {
    return Number(order.taxAmount);
  }

  if (
    order.gstAmount !== undefined &&
    order.gstAmount !== null
  ) {
    return Number(order.gstAmount);
  }

  const total = Number(
    order.totalAmount ?? 0
  );

  const calculatedGST =
    total - subtotal - shipping;

  return calculatedGST > 0
    ? calculatedGST
    : 0;
}

function getTotal(
  order: BackendOrder,
  subtotal: number,
  shipping: number,
  gst: number
) {
  if (
    order.totalAmount !== undefined &&
    order.totalAmount !== null
  ) {
    return Number(order.totalAmount);
  }

  return subtotal + shipping + gst;
}

function normalizeStatus(
  status?: string | null
) {
  return (
    status
      ?.trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, "") || ""
  );
}

function getDisplayStatus(
  status?: string | null
) {
  if (!status) {
    return "Pending";
  }

  return status
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function getStatusClasses(
  status?: string | null
) {
  const normalized =
    normalizeStatus(status);

  if (
    normalized === "delivered" ||
    normalized === "completed"
  ) {
    return {
      background: "bg-[#EAF4E4]",
      text: "text-[#315C20]",
    };
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled" ||
    normalized === "failed"
  ) {
    return {
      background: "bg-[#FDECEA]",
      text: "text-[#8B1A1A]",
    };
  }

  if (
    normalized === "shipped" ||
    normalized === "outfordelivery"
  ) {
    return {
      background: "bg-[#E3EEFF]",
      text: "text-[#1A4F8A]",
    };
  }

  if (
    normalized === "processing" ||
    normalized === "confirmed" ||
    normalized === "placed" ||
    normalized === "packed"
  ) {
    return {
      background: "bg-[#EAF4E4]",
      text: "text-[#315C20]",
    };
  }

  return {
    background: "bg-[#FFF3CD]",
    text: "text-[#7A5200]",
  };
}

// ============================================================
// API ERROR HELPER
// ============================================================

async function getApiErrorMessage(
  response: Response
): Promise<string> {
  const contentType =
    response.headers.get("content-type") ?? "";

  try {
    if (
      contentType.includes("application/json")
    ) {
      const data = await response.json();

      if (
        typeof data === "object" &&
        data !== null
      ) {
        const errorData = data as {
          message?: unknown;
          error?: unknown;
          detail?: unknown;
        };

        if (errorData.message) {
          return String(errorData.message);
        }

        if (errorData.error) {
          return String(errorData.error);
        }

        if (errorData.detail) {
          return String(errorData.detail);
        }
      }

      return `Request failed (${response.status})`;
    }

    const text = await response.text();

    return (
      text ||
      `Request failed (${response.status})`
    );
  } catch {
    return `Request failed (${response.status})`;
  }
}

// ============================================================
// ORDER CARD
// ============================================================

function OrderCard({
  order,
  onOrderCancelled,
}: {
  order: BackendOrder;
  onOrderCancelled?: (
    orderId: number | string
  ) => void;
}) {
  const { token } = useAuth();

  const [expanded, setExpanded] =
    useState(false);

  const [cancelling, setCancelling] =
    useState(false);

  const [
    currentStatus,
    setCurrentStatus,
  ] = useState(
    order.orderStatus ??
      order.status ??
      ""
  );

  useEffect(() => {
    setCurrentStatus(
      order.orderStatus ??
        order.status ??
        ""
    );
  }, [
    order.orderStatus,
    order.status,
  ]);

  const items = getOrderItems(order);

  const itemCount =
    getItemCount(order);

  const subtotal =
    getSubtotal(order);

  const shipping =
    getShipping(order);

  const gst =
    getGST(
      order,
      subtotal,
      shipping
    );

  const total =
    getTotal(
      order,
      subtotal,
      shipping,
      gst
    );

  const statusClasses =
    getStatusClasses(currentStatus);

  const customerName =
    order.fullName ||
    order.customerFullName ||
    order.customerName ||
    "Customer";

  const orderNumber =
    order.orderNumber ||
    `PS-ORDER-${String(
      order.orderId ?? ""
    ).padStart(4, "0")}`;

  // ==========================================================
  // STATUS ACTIONS
  // ==========================================================

  const normalizedCurrentStatus =
    String(currentStatus)
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, "_");

  const cancelAvailable =
    normalizedCurrentStatus ===
      "PENDING" ||
    normalizedCurrentStatus ===
      "CONFIRMED" ||
    normalizedCurrentStatus ===
      "PROCESSING" ||
    normalizedCurrentStatus ===
      "PACKED";

  const returnAvailable =
    normalizedCurrentStatus ===
    "DELIVERED";

  // ==========================================================
  // CANCEL ORDER
  // ==========================================================

  async function handleCancelOrder() {
    if (!token) {
      window.alert(
        "Please login again."
      );
      return;
    }

    const orderId =
      order.orderId;

    if (
      orderId === undefined ||
      orderId === null ||
      String(orderId).trim() === ""
    ) {
      window.alert(
        "Order ID is missing."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);

      /*
       * IMPORTANT:
       *
       * Spring Boot controller:
       *
       * @PutMapping("/{orderId}/cancel")
       *
       * Therefore frontend must call:
       *
       * PUT /api/orders/{orderId}/cancel
       *
       * NOT:
       *
       * DELETE /api/orders/{orderId}
       */

      const response = await fetch(
        `/api/orders/${encodeURIComponent(
          String(orderId)
        )}/cancel`,
        {
          method: "PUT",

          headers: {
            Accept:
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message =
          await getApiErrorMessage(
            response
          );

        throw new Error(
          message
        );
      }

      /*
       * The backend returns OrderResponseDTO.
       * We don't strictly need to parse it,
       * but parsing allows us to use the returned
       * status when available.
       */

      let cancelledOrder:
        | BackendOrder
        | null = null;

      const contentType =
        response.headers.get(
          "content-type"
        ) ?? "";

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        try {
          cancelledOrder =
            (await response.json()) as BackendOrder;
        } catch {
          cancelledOrder = null;
        }
      }

      const backendStatus =
        cancelledOrder?.orderStatus ??
        cancelledOrder?.status;

      setCurrentStatus(
        backendStatus || "CANCELLED"
      );

      if (onOrderCancelled) {
        onOrderCancelled(
          orderId
        );
      }

      window.alert(
        "Order cancelled successfully."
      );
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to cancel the order."
      );
    } finally {
      setCancelling(false);
    }
  }

  return (
    <article
      className={`
        overflow-hidden
        rounded-[24px]
        border
        bg-white
        transition-all
        duration-200
        ${
          expanded
            ? "border-[#D8CAE4] shadow-[0_12px_35px_rgba(46,5,105,0.08)]"
            : "border-[#E9E3EE] hover:border-[#DCD0E7] hover:shadow-[0_8px_28px_rgba(46,5,105,0.06)]"
        }
      `}
    >
      {/* ==================================================
          ORDER HEADER
      ================================================== */}

      <button
        type="button"
        onClick={() =>
          setExpanded(
            (previous) =>
              !previous
          )
        }
        className="
          flex
          w-full
          items-center
          justify-between
          gap-5
          px-6
          py-6
          text-left
          transition
          hover:bg-[#FFFEFF]
          sm:px-7
        "
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className="
                text-[14px]
                font-black
                tracking-[0.01em]
                text-[#2E0569]
              "
            >
              {orderNumber}
            </span>

            <span
              className={`
                rounded-full
                px-3
                py-1
                text-[10px]
                font-extrabold
                ${statusClasses.background}
                ${statusClasses.text}
              `}
            >
              {getDisplayStatus(
                currentStatus
              )}
            </span>
          </div>

          <div
            className="
              mt-2
              flex
              flex-wrap
              items-center
              gap-x-2
              gap-y-1
              text-[11px]
              leading-relaxed
              text-[#8B8292]
            "
          >
            <span>
              {itemCount}{" "}
              {itemCount === 1
                ? "item"
                : "items"}
            </span>

            <span className="text-[#C9BFCE]">
              ·
            </span>

            <span>
              Placed{" "}
              {formatDate(
                getOrderDate(order)
              )}
            </span>

            <span className="text-[#C9BFCE]">
              ·
            </span>

            <span
              className="
                font-bold
                text-[#2E0569]
              "
            >
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <span
          className="
            grid
            h-8
            w-8
            shrink-0
            place-items-center
            rounded-full
            text-[#8B8292]
            transition
            hover:bg-[#F4EEFF]
            hover:text-[#2E0569]
          "
        >
          {expanded ? (
            <ChevronUp size={17} />
          ) : (
            <ChevronDown
              size={17}
            />
          )}
        </span>
      </button>

      {/* ==================================================
          EXPANDED INFORMATION
      ================================================== */}

      {expanded && (
        <div
          className="
            border-t
            border-[#E9E3EE]
            px-6
            pb-7
            pt-5
            sm:px-7
          "
        >
          {/* ==================================================
              ORDER ITEMS
          ================================================== */}

          <section>
            <div className="mb-4">
              <h3
                className="
                  text-[13px]
                  font-extrabold
                  text-[#2E0569]
                "
              >
                Order Items
              </h3>

              <p
                className="
                  mt-1
                  text-[11px]
                  leading-relaxed
                  text-[#8B8292]
                "
              >
                Products included in
                this order
              </p>
            </div>

            <div className="space-y-1">
              {items.length > 0 ? (
                items.map(
                  (
                    item,
                    index
                  ) => {
                    const category =
                      item.categoryName ||
                      item.category ||
                      "Wellness";

                    const itemTotal =
                      getItemTotal(
                        item
                      );

                    const imageUrl =
                      item.imageUrl ||
                      item.productImageUrl;

                    return (
                      <div
                        key={
                          item.orderItemId ??
                          `${orderNumber}-item-${index}`
                        }
                        className="
                          grid
                          grid-cols-[58px_minmax(0,1fr)_auto]
                          items-center
                          gap-4
                          border-b
                          border-[#F3EFF4]
                          py-3
                          last:border-b-0
                        "
                      >
                        {/* Product image */}

                        <div
                          className="
                            grid
                            h-[58px]
                            w-[58px]
                            shrink-0
                            place-items-center
                            overflow-hidden
                            rounded-[13px]
                            bg-[#F8F4FB]
                          "
                        >
                          {imageUrl ? (
                            <img
                              src={
                                imageUrl
                              }
                              alt={
                                item.productName ||
                                "Product"
                              }
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />
                          ) : (
                            <Package
                              size={21}
                              className="
                                text-[#8C52FF]
                              "
                            />
                          )}
                        </div>

                        {/* Product info */}

                        <div
                          className="
                            min-w-0
                            space-y-0.5
                          "
                        >
                          <p
                            className="
                              text-[9px]
                              font-black
                              uppercase
                              tracking-[0.1em]
                              text-[#8C52FF]
                            "
                          >
                            {category}
                          </p>

                          <h4
                            className="
                              overflow-hidden
                              break-words
                              text-[14px]
                              font-black
                              leading-[1.4]
                              text-[#2E0569]
                            "
                          >
                            {item.productName ||
                              "Product"}
                          </h4>

                          {item.variantName && (
                            <p
                              className="
                                text-[11px]
                                leading-[1.5]
                                text-[#716A78]
                              "
                            >
                              {
                                item.variantName
                              }
                            </p>
                          )}

                          <p
                            className="
                              pt-0.5
                              text-[10px]
                              leading-[1.5]
                              text-[#8B8292]
                            "
                          >
                            Qty:{" "}
                            <span
                              className="
                                font-semibold
                                text-[#2E0569]
                              "
                            >
                              {
                                item.quantity
                              }
                            </span>
                          </p>
                        </div>

                        {/* Price */}

                        <div
                          className="
                            shrink-0
                            self-center
                            pl-2
                            text-right
                          "
                        >
                          <p
                            className="
                              whitespace-nowrap
                              text-[14px]
                              font-black
                              text-[#2E0569]
                            "
                          >
                            {formatCurrency(
                              itemTotal
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <div
                  className="
                    py-4
                    text-[12px]
                    text-[#8B8292]
                  "
                >
                  Order item details
                  unavailable.
                </div>
              )}
            </div>
          </section>

          {/* ==================================================
              PRICE SUMMARY
          ================================================== */}

          <section className="mt-5">
            <div
              className="
                rounded-[18px]
                bg-[#FAFAFA]
                px-5
                py-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-5
                  py-1
                  text-[12px]
                "
              >
                <span className="text-[#716A78]">
                  Subtotal
                </span>

                <span
                  className="
                    font-semibold
                    text-[#2E0569]
                  "
                >
                  {formatCurrency(
                    subtotal
                  )}
                </span>
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-5
                  py-1
                  text-[12px]
                "
              >
                <span className="text-[#716A78]">
                  Shipping
                </span>

                <span
                  className="
                    font-semibold
                    text-[#2E0569]
                  "
                >
                  {shipping === 0
                    ? "Free"
                    : formatCurrency(
                        shipping
                      )}
                </span>
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-5
                  py-1
                  text-[12px]
                "
              >
                <span className="text-[#716A78]">
                  GST
                </span>

                <span
                  className="
                    font-semibold
                    text-[#2E0569]
                  "
                >
                  {formatCurrency(
                    gst
                  )}
                </span>
              </div>

              <div
                className="
                  mt-2
                  flex
                  items-center
                  justify-between
                  gap-5
                  border-t
                  border-[#E9E3EE]
                  pt-3
                "
              >
                <span
                  className="
                    text-[14px]
                    font-black
                    text-[#2E0569]
                  "
                >
                  Total
                </span>

                <span
                  className="
                    text-[14px]
                    font-black
                    text-[#2E0569]
                  "
                >
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </section>

          {/* ==================================================
              DELIVERY ADDRESS
          ================================================== */}

          <section className="mt-6">
            <div className="mb-3">
              <p
                className="
                  text-[13px]
                  font-extrabold
                  text-[#2E0569]
                "
              >
                {customerName}
              </p>
            </div>

            <div
              className="
                text-[12px]
                leading-[1.7]
                text-[#716A78]
              "
            >
              {order.addressLine1 && (
                <p>
                  {order.addressLine1}
                </p>
              )}

              {order.addressLine2 && (
                <p>
                  {order.addressLine2}
                </p>
              )}

              {order.landmark && (
                <p>
                  {order.landmark}
                </p>
              )}

              {(order.city ||
                order.state ||
                order.postalCode ||
                order.pincode) && (
                <p>
                  {order.city
                    ? `${order.city}, `
                    : ""}

                  {order.state
                    ? `${order.state} – `
                    : ""}

                  {order.postalCode ||
                    order.pincode ||
                    ""}
                </p>
              )}

              {order.country && (
                <p>
                  {order.country}
                </p>
              )}

              {!order.addressLine1 &&
                !order.addressLine2 &&
                !order.landmark &&
                !order.city &&
                !order.state &&
                !order.postalCode &&
                !order.pincode &&
                !order.country && (
                  <p>
                    Delivery address
                    unavailable.
                  </p>
                )}
            </div>
          </section>

          {/* ==================================================
              ORDER NOTES
          ================================================== */}

          {order.notes && (
            <section className="mt-5">
              <div
                className="
                  rounded-[14px]
                  bg-[#F4EEFF]
                  px-4
                  py-3
                "
              >
                <p
                  className="
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.08em]
                    text-[#8C52FF]
                  "
                >
                  Order notes
                </p>

                <p
                  className="
                    mt-1
                    text-[12px]
                    leading-relaxed
                    text-[#716A78]
                  "
                >
                  {order.notes}
                </p>
              </div>
            </section>
          )}

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div
            className="
              mt-7
              flex
              flex-wrap
              items-center
              gap-2.5
            "
          >
            {/* DOWNLOAD INVOICE */}

            <DownloadInvoiceButton
              orderId={String(
                order.orderId ?? ""
              )}
            />

            {/* CANCEL ORDER */}

            {cancelAvailable && (
              <button
                type="button"
                disabled={cancelling}
                onClick={
                  handleCancelOrder
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-[#F5C6C2]
                  bg-white
                  px-5
                  py-2.5
                  text-[12px]
                  font-extrabold
                  text-[#C0392B]
                  transition
                  hover:border-[#E8AAA5]
                  hover:bg-[#FDECEA]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {cancelling ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <XCircle
                    size={15}
                  />
                )}

                <span>
                  {cancelling
                    ? "Cancelling..."
                    : "Cancel Order"}
                </span>
              </button>
            )}

            {/* REQUEST RETURN */}

            {returnAvailable && (
              <button
                type="button"
                onClick={() => {
                  window.alert(
                    "Return request API is not connected yet."
                  );
                }}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-[#E9E3EE]
                  bg-white
                  px-5
                  py-2.5
                  text-[12px]
                  font-extrabold
                  text-[#2E0569]
                  transition
                  hover:border-[#D8CAE4]
                  hover:bg-[#FAF6FF]
                "
              >
                <RefreshCw
                  size={15}
                />

                <span>
                  Request Return
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

// ============================================================
// ORDERS CONTENT
// ============================================================

function OrdersContent() {
  const { token } = useAuth();

  const [orders, setOrders] =
    useState<BackendOrder[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================================
  // FETCH MY ORDERS
  // ==========================================================

  const fetchOrders =
    useCallback(async () => {
      if (!token) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        /*
         * Spring Boot controller:
         *
         * @GetMapping("/my-orders")
         *
         * Therefore:
         *
         * GET /api/orders/my-orders
         */

        const response = await fetch(
          "/api/orders/my-orders",
          {
            method: "GET",

            headers: {
              Accept:
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            cache: "no-store",
          }
        );

        if (!response.ok) {
          const message =
            await getApiErrorMessage(
              response
            );

          throw new Error(
            message
          );
        }

        const contentType =
          response.headers.get(
            "content-type"
          ) ?? "";

        if (
          !contentType.includes(
            "application/json"
          )
        ) {
          throw new Error(
            "Server returned an invalid response while loading orders."
          );
        }

        const data =
          await response.json();

        /*
         * Backend normally returns:
         *
         * List<OrderResponseDTO>
         *
         * But this also supports:
         *
         * { orders: [...] }
         */

        const responseData =
          data as
            | BackendOrder[]
            | {
                orders?: BackendOrder[];
              };

        const orderList =
          Array.isArray(
            responseData
          )
            ? responseData
            : Array.isArray(
                  responseData?.orders
                )
              ? responseData.orders
              : [];

        setOrders(orderList);
      } catch (err) {
        console.error(
          "My Orders error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your orders."
        );

        setOrders([]);
      } finally {
        setLoading(false);
      }
    }, [token]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  // ==========================================================
  // AFTER CANCEL
  // ==========================================================

  const handleOrderCancelled =
    useCallback(
      (
        orderId: number | string
      ) => {
        /*
         * Keep the order in the list because
         * cancelled orders should remain visible.
         *
         * We only update its status locally.
         */

        setOrders(
          (previousOrders) =>
            previousOrders.map(
              (order) =>
                String(
                  order.orderId
                ) ===
                String(orderId)
                  ? {
                      ...order,
                      orderStatus:
                        "CANCELLED",
                      status:
                        "CANCELLED",
                    }
                  : order
            )
        );
      },
      []
    );

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#FFFDF7]
      "
    >
      <div
        className="
          container-page
          py-12
          lg:py-16
        "
      >
        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <Reveal>
          <Link
            href="/shop"
            className="
              inline-flex
              items-center
              gap-1.5
              text-[12px]
              font-extrabold
              text-[#8C52FF]
              transition
              hover:text-[#2E0569]
              hover:underline
            "
          >
            <ArrowLeft size={13} />

            Back to shop
          </Link>

          <p
            className="
              mt-7
              text-[10px]
              font-black
              uppercase
              tracking-[0.14em]
              text-[#8C52FF]
            "
          >
            Your Account
          </p>

          <h1
            className="
              mt-2
              text-[clamp(30px,4vw,46px)]
              font-extrabold
              tracking-[-0.045em]
              text-[#2E0569]
            "
          >
            My Orders
          </h1>

          <p
            className="
              mt-2
              max-w-xl
              text-[14px]
              leading-relaxed
              text-[#716A78]
            "
          >
            View your order details,
            track deliveries, and
            manage your orders.
          </p>
        </Reveal>

        {/* ==================================================
            ORDERS
        ================================================== */}

        <div
          className="
            mt-8
            w-full
            max-w-[920px]
            space-y-4
          "
        >
          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (
            <Reveal>
              <div
                className="
                  flex
                  min-h-[400px]
                  flex-col
                  items-center
                  justify-center
                  rounded-[24px]
                  border
                  border-[#E9E3EE]
                  bg-white
                  px-6
                  text-center
                "
              >
                <Loader2
                  size={30}
                  className="
                    animate-spin
                    text-[#8C52FF]
                  "
                />

                <p
                  className="
                    mt-4
                    text-[14px]
                    font-extrabold
                    text-[#2E0569]
                  "
                >
                  Loading your
                  orders...
                </p>

                <p
                  className="
                    mt-1
                    text-[12px]
                    text-[#8B8292]
                  "
                >
                  Please wait while we
                  fetch your latest
                  orders.
                </p>
              </div>
            </Reveal>
          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading && error && (
            <Reveal>
              <div
                className="
                  rounded-[24px]
                  border
                  border-[#F5C6C2]
                  bg-white
                  px-6
                  py-12
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    grid
                    h-14
                    w-14
                    place-items-center
                    rounded-full
                    bg-[#FDECEA]
                  "
                >
                  <AlertCircle
                    size={26}
                    className="text-[#C0392B]"
                  />
                </div>

                <h2
                  className="
                    mt-4
                    text-[15px]
                    font-extrabold
                    text-[#2E0569]
                  "
                >
                  Unable to load
                  orders
                </h2>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-md
                    text-[12px]
                    leading-relaxed
                    text-[#716A78]
                  "
                >
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    void fetchOrders()
                  }
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-gradient-to-r
                    from-[#8C52FF]
                    to-[#2E0569]
                    px-5
                    py-2.5
                    text-[12px]
                    font-extrabold
                    text-white
                    transition
                    hover:opacity-90
                  "
                >
                  Try again
                </button>
              </div>
            </Reveal>
          )}

          {/* ==================================================
              EMPTY
          ================================================== */}

          {!loading &&
            !error &&
            orders.length === 0 && (
              <Reveal>
                <div
                  className="
                    flex
                    min-h-[400px]
                    flex-col
                    items-center
                    justify-center
                    rounded-[24px]
                    border
                    border-[#E9E3EE]
                    bg-white
                    px-6
                    text-center
                  "
                >
                  <div
                    className="
                      grid
                      h-16
                      w-16
                      place-items-center
                      rounded-full
                      bg-[#F4EEFF]
                    "
                  >
                    <Package
                      size={28}
                      className="text-[#8C52FF]"
                    />
                  </div>

                  <h2
                    className="
                      mt-4
                      text-[15px]
                      font-extrabold
                      text-[#2E0569]
                    "
                  >
                    No orders yet
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[13px]
                      text-[#716A78]
                    "
                  >
                    Your orders will
                    appear here once
                    you place one.
                  </p>

                  <Link
                    href="/shop"
                    className="
                      mt-5
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-gradient-to-r
                      from-[#8C52FF]
                      to-[#2E0569]
                      px-5
                      py-2.5
                      text-[12px]
                      font-extrabold
                      text-white
                      transition
                      hover:opacity-90
                    "
                  >
                    Start shopping

                    <Truck size={14} />
                  </Link>
                </div>
              </Reveal>
            )}

          {/* ==================================================
              ORDER LIST
          ================================================== */}

          {!loading &&
            !error &&
            orders.length > 0 &&
            orders.map(
              (order, index) => (
                <Reveal
                  key={
                    order.orderId ??
                    order.orderNumber ??
                    `order-${index}`
                  }
                >
                  <OrderCard
                    order={order}
                    onOrderCancelled={
                      handleOrderCancelled
                    }
                  />
                </Reveal>
              )
            )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function OrdersPage() {
  return (
    <AppProvider>
      <div
        className="
          min-h-screen
          overflow-x-clip
          bg-[#FFFDF7]
        "
      >
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