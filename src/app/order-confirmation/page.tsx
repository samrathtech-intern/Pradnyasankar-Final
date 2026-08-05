"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ClipboardList, Package, Truck } from "lucide-react";
import { useApp } from "@/components/AppContext";
import { AppProvider } from "@/components/AppContext";
import { AnnouncementBar, Header } from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Reveal } from "@/components/Reveal";
import { generateOrderId, saveOrder, type Order } from "@/lib/orders";
import { trackPurchase } from "@/lib/analytics";
import { DownloadInvoiceButton } from "@/components/DownloadInvoiceButton";

const TRACKER_STEPS = [
  { icon: CheckCircle2, label: "Order confirmed", sub: "Your order has been placed", done: true },
  { icon: Package, label: "Preparing", sub: "Being packed for dispatch", done: false },
  { icon: Truck, label: "Shipped", sub: "On its way to you", done: false },
];

function OrderConfirmationContent() {
  const { setPendingOrder } = useApp();
  const savedRef = useRef(false);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;

    // Read the pending order written by checkout directly to localStorage
    try {
      const raw = localStorage.getItem("ps_pending_order");
      if (raw) {
        const pending = JSON.parse(raw);
        const newOrder: Order = {
          ...pending,
          id: generateOrderId(),
          placedAt: new Date().toISOString(),
          status: "Confirmed",
        };
        saveOrder(newOrder);
        setOrder(newOrder);
        localStorage.removeItem("ps_pending_order");
        trackPurchase(
          newOrder.id,
          (pending.items ?? []).map((p: { id: string; name: string; range: string; format?: string; price: number }) => ({
            id: p.id, name: p.name, range: p.range, format: p.format, price: p.price ?? 0,
          })),
          pending.total ?? 0,
          pending.gst ?? 0,
          pending.shipping ?? 0,
          pending.couponApplied ? "WELCOME10" : undefined,
        );
        return;
      }
    } catch {}

    // Fallback: show the most recently placed real order (not demo orders)
    try {
      const raw = localStorage.getItem("ps_orders");
      if (raw) {
        const orders: Order[] = JSON.parse(raw);
        const real = orders.find((o) => !o.id.startsWith("PS-DEMO"));
        if (real) setOrder(real);
      }
    } catch {}
  }, [setPendingOrder]);

  const subtotal = order?.subtotal ?? 0;
  const shipping = order?.shipping ?? 0;
  const gst = order?.gst ?? 0;
  const total = order?.total ?? 0;
  const items = order?.items ?? [];

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      <div className="container-page py-12 lg:py-16">
        {/* Success header */}
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 16, stiffness: 200 }}
            >
              <span className="grid h-24 w-24 place-items-center rounded-full bg-[#EAF4E4] text-[#315C20]">
                <CheckCircle2 size={48} />
              </span>
            </motion.div>
            <h1 className="mt-6 text-[clamp(32px,5vw,52px)] font-extrabold tracking-[-.04em] text-[#2E0569]">
              Order confirmed!
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#716A78]">
              Thank you for your order. You will receive a confirmation email with your order details and tracking information once dispatched.
            </p>
            {order && (
              <div className="mt-4 rounded-full border border-[#E9E3EE] bg-white px-5 py-2.5 text-[12px] font-extrabold text-[#2E0569]">
                Order ID: <span className="text-[#8C52FF]">{order.id}</span>
              </div>
            )}
          </div>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl space-y-6">
          {/* Order status tracker */}
          <Reveal>
            <div className="rounded-[28px] border border-[#E9E3EE] bg-white p-7">
              <h2 className="text-[16px] font-extrabold text-[#2E0569]">Order status</h2>
              <div className="relative mt-6">
                {/* connector line */}
                <div className="absolute left-[16.5%] right-[16.5%] top-6 h-px bg-[#E9E3EE]" />
                <div className="absolute left-[16.5%] top-6 h-px w-[10%] bg-[#4CAF50]" />
                <div className="flex items-start justify-between gap-2">
                  {TRACKER_STEPS.map(({ icon: Icon, label, sub, done }) => (
                    <div key={label} className="flex flex-1 flex-col items-center text-center">
                      <div className={`grid h-12 w-12 place-items-center rounded-full ${done ? "bg-[#EAF4E4] text-[#315C20]" : "border-2 border-[#E9E3EE] bg-white text-[#8B8292]"}`}>
                        <Icon size={20} />
                      </div>
                      <p className={`mt-2 text-[12px] font-extrabold ${done ? "text-[#2E0569]" : "text-[#8B8292]"}`}>{label}</p>
                      <p className="mt-0.5 text-[10px] text-[#8B8292]">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Order items */}
          {items.length > 0 && (
            <Reveal>
              <div className="rounded-[28px] border border-[#E9E3EE] bg-white p-7">
                <h2 className="text-[16px] font-extrabold text-[#2E0569]">Items ordered</h2>
                <div className="mt-5 space-y-4">
                  {items.map((p) => (
                    <div key={p.id} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[14px] bg-gradient-to-br from-[#F4EEFF] to-[#FAF6FF]">
                        <Image src={p.image} alt={p.name} fill className="object-contain p-1.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">{p.range}</p>
                        <p className="mt-0.5 truncate text-[14px] font-extrabold text-[#2E0569]">{p.name}</p>
                        <p className="text-[11px] text-[#8B8292]">{p.format}</p>
                      </div>
                      <p className="shrink-0 text-[14px] font-extrabold text-[#2E0569]">₹{p.price.toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-2 border-t border-[#E9E3EE] pt-5 text-[13px]">
                  <div className="flex justify-between text-[#716A78]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#2E0569]">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {(order?.discount ?? 0) > 0 && (
                    <div className="flex justify-between text-[#315C20]">
                      <span>Coupon discount</span>
                      <span className="font-semibold">−₹{order!.discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#716A78]">
                    <span>Shipping</span>
                    <span className="font-semibold text-[#2E0569]">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-[#716A78]">
                    <span>GST</span>
                    <span className="font-semibold text-[#2E0569]">₹{gst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E9E3EE] pt-3 text-[16px] font-extrabold text-[#2E0569]">
                    <span>Total paid</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* What's next */}
          <Reveal>
            <div className="rounded-[28px] border border-[#E9E3EE] bg-white p-7">
              <h2 className="text-[16px] font-extrabold text-[#2E0569]">What happens next?</h2>
              <div className="mt-5 space-y-4">
                {[
                  { step: "1", text: "You will receive an order confirmation email within a few minutes." },
                  { step: "2", text: "Our team will prepare and pack your order within 1–2 working days." },
                  { step: "3", text: "Once dispatched, you will receive a shipping confirmation with tracking details." },
                  { step: "4", text: "Your order will be delivered to your address within the estimated delivery window." },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#F2EBFF] text-[11px] font-extrabold text-[#8C52FF]">{step}</span>
                    <p className="text-[13px] leading-relaxed text-[#716A78]">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Link href="/orders" className="btn-primary">
                <ClipboardList size={15} /> View my orders
              </Link>
              {order && <DownloadInvoiceButton orderId={order.id} variant="primary" />}
              <Link href="/shop" className="btn-secondary">
                Continue shopping <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <AppProvider>
      <div className="min-h-screen overflow-x-clip bg-[#FFFDF7]">
        <AnnouncementBar />
        <Header />
        <main>
          <OrderConfirmationContent />
        </main>
        <MobileBottomNav />
      </div>
    </AppProvider>
  );
}
