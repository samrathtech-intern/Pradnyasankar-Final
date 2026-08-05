"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft, CheckCircle2, ChevronDown, ChevronUp,
  Package, RefreshCw, Truck, XCircle,
} from "lucide-react";
import { AppProvider } from "@/components/AppContext";
import { AuthGuard } from "@/components/AuthGuard";
import { AnnouncementBar, Header } from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Reveal } from "@/components/Reveal";
import {
  DEMO_ORDERS, readOrders, updateOrder, writeOrders,
  type Order, type OrderStatus, type ReturnRequest,
} from "@/lib/orders";
import { DownloadInvoiceButton } from "@/components/DownloadInvoiceButton";

// ─── helpers ────────────────────────────────────────────────────────────────

const CANCELLABLE: OrderStatus[] = ["Confirmed", "Preparing"];
const RETURNABLE: OrderStatus[] = ["Delivered"];

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  Confirmed:         { label: "Confirmed",          color: "text-[#315C20]",  bg: "bg-[#EAF4E4]" },
  Preparing:         { label: "Preparing",          color: "text-[#7A5200]",  bg: "bg-[#FFF3CD]" },
  Shipped:           { label: "Shipped",            color: "text-[#1A4F8A]",  bg: "bg-[#E3EEFF]" },
  Delivered:         { label: "Delivered",          color: "text-[#315C20]",  bg: "bg-[#EAF4E4]" },
  Cancelled:         { label: "Cancelled",          color: "text-[#8B1A1A]",  bg: "bg-[#FDECEA]" },
  "Return Requested":{ label: "Return Requested",   color: "text-[#7A5200]",  bg: "bg-[#FFF3CD]" },
  "Return Approved": { label: "Return Approved",    color: "text-[#1A4F8A]",  bg: "bg-[#E3EEFF]" },
  "Refund Processing":{ label: "Refund Processing", color: "text-[#7A5200]",  bg: "bg-[#FFF3CD]" },
  "Refund Completed":{ label: "Refund Completed",   color: "text-[#315C20]",  bg: "bg-[#EAF4E4]" },
};

const RETURN_REASONS = [
  "Wrong product received",
  "Product damaged / defective",
  "Product expired",
  "Not as described",
  "Changed my mind",
  "Other",
];

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Refund tracker ─────────────────────────────────────────────────────────

const REFUND_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "Return Requested",  label: "Return requested" },
  { status: "Return Approved",   label: "Return approved" },
  { status: "Refund Processing", label: "Refund processing" },
  { status: "Refund Completed",  label: "Refund completed" },
];

function RefundTracker({ status }: { status: OrderStatus }) {
  const currentIdx = REFUND_STEPS.findIndex((s) => s.status === status);
  return (
    <div className="mt-4 flex items-center gap-0">
      {REFUND_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        return (
          <div key={step.status} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {i > 0 && <div className={`h-px flex-1 ${done ? "bg-[#8C52FF]" : "bg-[#E9E3EE]"}`} />}
              <div className={`h-3 w-3 shrink-0 rounded-full ${done ? "bg-[#8C52FF]" : "bg-[#E9E3EE]"}`} />
              {i < REFUND_STEPS.length - 1 && <div className={`h-px flex-1 ${i < currentIdx ? "bg-[#8C52FF]" : "bg-[#E9E3EE]"}`} />}
            </div>
            <p className={`mt-1.5 text-center text-[10px] font-semibold leading-tight ${done ? "text-[#8C52FF]" : "text-[#8B8292]"}`}>
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Cancel modal ────────────────────────────────────────────────────────────

function CancelModal({ order, onClose, onConfirm }: { order: Order; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-7 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#FDECEA]">
            <XCircle size={28} className="text-[#C0392B]" />
          </span>
          <h3 className="mt-4 text-[18px] font-extrabold text-[#2E0569]">Cancel order?</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[#716A78]">
            Are you sure you want to cancel order <span className="font-bold text-[#2E0569]">{order.id}</span>? This action cannot be undone.
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-full border border-[#E9E3EE] py-2.5 text-[13px] font-extrabold text-[#2E0569] transition hover:bg-[#F4EEFF]">
            Keep order
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-full bg-[#C0392B] py-2.5 text-[13px] font-extrabold text-white transition hover:bg-[#A93226]">
            Yes, cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Return form ─────────────────────────────────────────────────────────────

function ReturnForm({ order, onClose, onSubmit }: { order: Order; onClose: () => void; onSubmit: (req: ReturnRequest) => void }) {
  const [itemId, setItemId] = useState(order.items[0]?.id ?? "");
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [hasImage, setHasImage] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) return;
    onSubmit({ itemId, reason, comments, hasImage, requestedAt: new Date().toISOString() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="w-full max-w-md rounded-t-[28px] bg-white p-7 shadow-2xl sm:rounded-[28px]">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-extrabold text-[#2E0569]">Request a return</h3>
          <button onClick={onClose} className="text-[#8B8292] hover:text-[#2E0569]"><XCircle size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {order.items.length > 1 && (
            <div>
              <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">Select item</label>
              <select value={itemId} onChange={(e) => setItemId(e.target.value)}
                className="w-full rounded-[12px] border border-[#E9E3EE] bg-white px-4 py-2.5 text-[13px] text-[#2E0569] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]/30">
                {order.items.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">Reason for return</label>
            <select required value={reason} onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-[12px] border border-[#E9E3EE] bg-white px-4 py-2.5 text-[13px] text-[#2E0569] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]/30">
              <option value="">Select a reason…</option>
              {RETURN_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.08em] text-[#8B8292]">Additional comments <span className="font-normal normal-case">(optional)</span></label>
            <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={3}
              placeholder="Describe the issue…"
              className="w-full resize-none rounded-[12px] border border-[#E9E3EE] px-4 py-2.5 text-[13px] text-[#2E0569] placeholder:text-[#C4BDC9] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]/30" />
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={hasImage} onChange={(e) => setHasImage(e.target.checked)}
              className="h-4 w-4 accent-[#8C52FF]" />
            <span className="text-[13px] text-[#716A78]">I have photos of the issue (you can share them via email)</span>
          </label>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-full border border-[#E9E3EE] py-2.5 text-[13px] font-extrabold text-[#2E0569] transition hover:bg-[#F4EEFF]">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 rounded-full bg-gradient-to-r from-[#8C52FF] to-[#2E0569] py-2.5 text-[13px] font-extrabold text-white transition hover:opacity-90">
              Submit request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Order card ──────────────────────────────────────────────────────────────

function OrderCard({ order: initial, onUpdate }: { order: Order; onUpdate: (o: Order) => void }) {
  const [order, setOrder] = useState(initial);
  const [expanded, setExpanded] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showReturn, setShowReturn] = useState(false);

  function applyUpdate(patch: Partial<Order>) {
    const updated = { ...order, ...patch };
    updateOrder(order.id, patch);
    setOrder(updated);
    onUpdate(updated);
  }

  function handleCancel() {
    applyUpdate({ status: "Cancelled" });
    setShowCancel(false);
  }

  function handleReturn(req: ReturnRequest) {
    applyUpdate({ status: "Return Requested", returnRequest: req });
    setShowReturn(false);
  }

  const meta = STATUS_META[order.status];
  const canCancel = CANCELLABLE.includes(order.status);
  const canReturn = RETURNABLE.includes(order.status);
  const isRefundFlow = ["Return Requested", "Return Approved", "Refund Processing", "Refund Completed"].includes(order.status);

  return (
    <>
      <div className="rounded-[24px] border border-[#E9E3EE] bg-white overflow-hidden">
        {/* Card header */}
        <button onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-extrabold text-[#2E0569]">{order.id}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${meta.bg} ${meta.color}`}>
                {meta.label}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#8B8292]">
              {order.items.length} item{order.items.length > 1 ? "s" : ""} · Placed {fmt(order.placedAt)} · ₹{order.total.toLocaleString("en-IN")}
            </p>
          </div>
          {expanded ? <ChevronUp size={16} className="shrink-0 text-[#8B8292]" /> : <ChevronDown size={16} className="shrink-0 text-[#8B8292]" />}
        </button>

        {/* Expanded body */}
        {expanded && (
          <div className="border-t border-[#E9E3EE] px-6 pb-6 pt-5 space-y-5">
            {/* Items */}
            <div className="space-y-3">
              {order.items.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px] bg-gradient-to-br from-[#F4EEFF] to-[#FAF6FF]">
                    <Image src={p.image} alt={p.name} fill className="object-contain p-1.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">{p.range}</p>
                    <p className="truncate text-[13px] font-extrabold text-[#2E0569]">{p.name}</p>
                    <p className="text-[11px] text-[#8B8292]">{p.format}</p>
                  </div>
                  <p className="shrink-0 text-[13px] font-extrabold text-[#2E0569]">₹{p.price.toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-1.5 rounded-[14px] bg-[#FAFAFA] px-4 py-3 text-[12px]">
              <div className="flex justify-between text-[#716A78]"><span>Subtotal</span><span className="font-semibold text-[#2E0569]">₹{order.subtotal.toLocaleString("en-IN")}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-[#315C20]"><span>Discount</span><span className="font-semibold">−₹{order.discount.toLocaleString("en-IN")}</span></div>}
              <div className="flex justify-between text-[#716A78]"><span>Shipping</span><span className="font-semibold text-[#2E0569]">{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span></div>
              <div className="flex justify-between text-[#716A78]"><span>GST</span><span className="font-semibold text-[#2E0569]">₹{order.gst.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between border-t border-[#E9E3EE] pt-2 font-extrabold text-[#2E0569]"><span>Total</span><span>₹{order.total.toLocaleString("en-IN")}</span></div>
            </div>

            {/* Delivery address */}
            <div className="text-[12px] text-[#716A78]">
              <p className="font-extrabold text-[#2E0569]">{order.contact.name}</p>
              <p>{order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}</p>
              <p>{order.address.city}, {order.address.state} – {order.address.pincode}</p>
            </div>

            {/* Refund tracker */}
            {isRefundFlow && <RefundTracker status={order.status} />}

            {/* Return request details */}
            {order.returnRequest && (
              <div className="rounded-[14px] bg-[#FFF3CD] px-4 py-3 text-[12px]">
                <p className="font-extrabold text-[#7A5200]">Return request submitted</p>
                <p className="mt-0.5 text-[#7A5200]">Reason: {order.returnRequest.reason}</p>
                {order.returnRequest.comments && <p className="mt-0.5 text-[#7A5200]">{order.returnRequest.comments}</p>}
                <p className="mt-1 text-[10px] text-[#A07800]">Submitted on {fmt(order.returnRequest.requestedAt)}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-1">
              <DownloadInvoiceButton orderId={order.id} />
              {canCancel && (
                <button onClick={() => setShowCancel(true)}
                  className="flex items-center gap-1.5 rounded-full border border-[#FDECEA] bg-[#FDECEA] px-4 py-2 text-[12px] font-extrabold text-[#C0392B] transition hover:bg-[#F5C6C2]">
                  <XCircle size={13} /> Cancel order
                </button>
              )}
              {canReturn && (
                <button onClick={() => setShowReturn(true)}
                  className="flex items-center gap-1.5 rounded-full border border-[#E9E3EE] px-4 py-2 text-[12px] font-extrabold text-[#2E0569] transition hover:bg-[#F4EEFF]">
                  <RefreshCw size={13} /> Request return
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {showCancel && <CancelModal order={order} onClose={() => setShowCancel(false)} onConfirm={handleCancel} />}
      {showReturn && <ReturnForm order={order} onClose={() => setShowReturn(false)} onSubmit={handleReturn} />}
    </>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored = readOrders();
    if (stored.length > 0) {
      setOrders(stored);
    } else if (DEMO_ORDERS.length > 0) {
      // In development, seed demo orders into localStorage so cancel/return
      // actions can persist via updateOrder. DEMO_ORDERS is [] in production.
      writeOrders(DEMO_ORDERS);
      setOrders(DEMO_ORDERS);
    }
  }, []);

  function handleUpdate(updated: Order) {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      <div className="container-page py-12 lg:py-16">
        <Reveal>
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-[#8C52FF] hover:underline">
            <ArrowLeft size={13} /> Back to shop
          </Link>
          <h1 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-[-.04em] text-[#2E0569]">My orders</h1>
          <p className="mt-2 text-[14px] text-[#716A78]">Track, cancel, or return your orders below.</p>
        </Reveal>

        <div className="mt-8 space-y-4 max-w-2xl">
          {orders.length === 0 ? (
            <Reveal>
              <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[#E9E3EE] bg-white py-16 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-[#F4EEFF]">
                  <Package size={28} className="text-[#8C52FF]" />
                </span>
                <p className="text-[15px] font-extrabold text-[#2E0569]">No orders yet</p>
                <p className="text-[13px] text-[#716A78]">Your orders will appear here once you place one.</p>
                <Link href="/shop" className="btn-primary mt-2">
                  Start shopping <Truck size={14} />
                </Link>
              </div>
            </Reveal>
          ) : (
            orders.map((order) => (
              <Reveal key={order.id}>
                <OrderCard order={order} onUpdate={handleUpdate} />
              </Reveal>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

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
