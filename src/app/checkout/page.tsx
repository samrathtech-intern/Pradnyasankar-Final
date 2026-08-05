"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Lock, Package, ShieldCheck, Truck } from "lucide-react";
import { useApp } from "@/components/AppContext";
import { AppProvider } from "@/components/AppContext";
import { type BagItem } from "@/components/AppContext";
import { trackBeginCheckout, trackPaymentResult, trackApplyCoupon } from "@/lib/analytics";
import { AuthGuard } from "@/components/AuthGuard";
import { AnnouncementBar, Header } from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";

/* ── types ── */
type Step = "contact" | "address" | "review";

const STEPS: { key: Step; label: string }[] = [
  { key: "contact", label: "Contact" },
  { key: "address", label: "Address" },
  { key: "review", label: "Review & Pay" },
];

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

function inputCls(err?: boolean) {
  return `w-full rounded-[14px] border ${err ? "border-red-400 bg-red-50" : "border-[#E9E3EE] bg-white"} px-4 py-3 text-[14px] font-semibold text-[#2E0569] outline-none transition placeholder:text-[#9B93A1] focus:border-[#8C52FF] focus:shadow-[0_0_0_3px_rgba(140,82,255,.12)]`;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569]">
      {children}{required && <span className="ml-1 text-red-400">*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1 text-[11px] font-semibold text-red-500">{msg}</p> : null;
}

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={step.key} className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-extrabold transition ${done ? "bg-[#8C52FF] text-white" : active ? "bg-[#2E0569] text-white" : "border-2 border-[#E9E3EE] bg-white text-[#8B8292]"}`}>
              {done ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span className={`ml-2 text-[11px] font-extrabold uppercase tracking-[.1em] ${active ? "text-[#2E0569]" : done ? "text-[#8C52FF]" : "text-[#8B8292]"}`}>
              {step.label}
            </span>
            {i < STEPS.length - 1 && <div className={`mx-3 h-px w-8 sm:w-14 ${i < idx ? "bg-[#8C52FF]" : "bg-[#E9E3EE]"}`} />}
          </div>
        );
      })}
    </div>
  );
}

type OrderSummaryProps = {
  bag: BagItem[];
  coupon: string;
  couponApplied: boolean;
  couponErr: string;
  subtotal: number;
  discount: number;
  shipping: number;
  gst: number;
  total: number;
  onCouponChange: (value: string) => void;
  onApplyCoupon: () => void;
};

function OrderSummary({
  bag, coupon, couponApplied, couponErr,
  subtotal, discount, shipping, gst, total,
  onCouponChange, onApplyCoupon,
}: OrderSummaryProps) {
  return (
    <div className="rounded-[28px] border border-[#E9E3EE] bg-white p-6">
      <h2 className="text-[15px] font-extrabold text-[#2E0569]">Order summary</h2>
      <div className="mt-5 space-y-4">
        {bag.map((p) => (
          <div key={p.id} className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[14px] bg-gradient-to-br from-[#F4EEFF] to-[#FAF6FF]">
              <Image src={p.image} alt={p.name} fill className="object-contain p-1.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">{p.range}</p>
              <p className="mt-0.5 truncate text-[13px] font-extrabold text-[#2E0569]">{p.name}</p>
              <p className="text-[11px] text-[#8B8292]">{p.format}{p.quantity > 1 ? ` × ${p.quantity}` : ""}</p>
            </div>
            <p className="shrink-0 text-[14px] font-extrabold text-[#2E0569]">₹{(p.price * p.quantity).toLocaleString("en-IN")}</p>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="mt-6 border-t border-[#E9E3EE] pt-5">
        <Label>Coupon code</Label>
        <div className="flex gap-2">
          <input
            value={coupon}
            onChange={(e) => onCouponChange(e.target.value)}
            placeholder="e.g. WELCOME10"
            className={inputCls(!!couponErr)}
          />
          <button
            onClick={onApplyCoupon}
            className="shrink-0 rounded-[14px] bg-[#2E0569] px-4 text-[11px] font-extrabold uppercase tracking-[.1em] text-white transition hover:bg-[#8C52FF]"
          >
            Apply
          </button>
        </div>
        {couponErr && <p className="mt-1 text-[11px] font-semibold text-red-500">{couponErr}</p>}
        {couponApplied && <p className="mt-1 text-[11px] font-semibold text-[#315C20]">✓ 10% discount applied</p>}
      </div>

      {/* Totals */}
      <div className="mt-5 space-y-2.5 border-t border-[#E9E3EE] pt-5 text-[13px]">
        <div className="flex justify-between text-[#716A78]">
          <span>Subtotal ({bag.reduce((n, p) => n + p.quantity, 0)} item{bag.reduce((n, p) => n + p.quantity, 0) !== 1 ? "s" : ""})</span>
          <span className="font-semibold text-[#2E0569]">₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-[#315C20]">
            <span>Coupon discount</span>
            <span className="font-semibold">−₹{discount.toLocaleString("en-IN")}</span>
          </div>
        )}
        <div className="flex justify-between text-[#716A78]">
          <span>Shipping</span>
          <span className="font-semibold text-[#2E0569]">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
        </div>
        <div className="flex justify-between text-[#716A78]">
          <span>GST (estimated)</span>
          <span className="font-semibold text-[#2E0569]">₹{gst.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between border-t border-[#E9E3EE] pt-3 text-[16px] font-extrabold text-[#2E0569]">
          <span>Total payable</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Trust */}
      <div className="mt-5 flex flex-col gap-2">
        {[
          { icon: Lock, text: "Secure Razorpay checkout" },
          { icon: ShieldCheck, text: "Authentic Pradnyasanskar products" },
          { icon: Truck, text: "Free shipping on orders above ₹499" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-[11px] font-semibold text-[#716A78]">
            <Icon size={13} className="shrink-0 text-[#8C52FF]" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckoutContent() {
  const { bag, hydrated, clearBag } = useApp();
  const router = useRouter();
  const scriptLoaded = useRef(false);
  const [payError, setPayError] = useState("");
  const [paying, setPaying] = useState(false);

  // Load Razorpay checkout script once
  useEffect(() => {
    if (scriptLoaded.current) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    scriptLoaded.current = true;
  }, []);

  const [step, setStep] = useState<Step>("contact");
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  /* contact */
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [contactErr, setContactErr] = useState<Partial<typeof contact>>({});

  /* address */
  const [addr, setAddr] = useState({ line1: "", line2: "", city: "", state: "", pincode: "" });
  const [addrErr, setAddrErr] = useState<Partial<typeof addr>>({});

  /* coupon */
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponErr, setCouponErr] = useState("");

  /* pricing */
  const subtotal = bag.reduce((sum, p) => sum + (p.price ?? 0) * p.quantity, 0);
  const shipping = subtotal >= 499 ? 0 : 60;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const gst = Math.round((subtotal - discount) * 0.12);
  const total = subtotal - discount + shipping + gst;

  /* validation */
  function validateContact() {
    const err: Partial<typeof contact> = {};
    if (!contact.name.trim()) err.name = "Full name is required";
    if (!contact.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) err.email = "Valid email is required";
    if (!contact.phone.trim() || !/^[6-9]\d{9}$/.test(contact.phone.replace(/\s/g, ""))) err.phone = "Valid 10-digit mobile number required";
    setContactErr(err);
    return Object.keys(err).length === 0;
  }

  function validateAddr() {
    const err: Partial<typeof addr> = {};
    if (!addr.line1.trim()) err.line1 = "Address line 1 is required";
    if (!addr.city.trim()) err.city = "City is required";
    if (!addr.state) err.state = "State is required";
    if (!addr.pincode.trim() || !/^\d{6}$/.test(addr.pincode)) err.pincode = "Valid 6-digit pincode required";
    setAddrErr(err);
    return Object.keys(err).length === 0;
  }

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "WELCOME10") {
      setCouponApplied(true);
      setCouponErr("");
      trackApplyCoupon("WELCOME10", Math.round(subtotal * 0.1));
    } else {
      setCouponApplied(false);
      setCouponErr("Invalid or expired coupon code.");
    }
  }

  function handleCouponChange(value: string) {
    setCoupon(value);
    setCouponErr("");
    setCouponApplied(false);
  }

  function handleContactNext() {
    if (validateContact()) setStep("address");
  }

  function handleAddressNext() {
    if (validateAddr()) {
      setStep("review");
      trackBeginCheckout(
        bag.map((p) => ({ id: p.id, name: p.name, range: p.range, format: p.format, price: p.price ?? 0 })),
        total,
        couponApplied ? "WELCOME10" : undefined,
      );
    }
  }

  /* empty bag — only show after localStorage has hydrated */
  if (hydrated && bag.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-[#F2EBFF] text-[#8C52FF]">
          <Package size={32} />
        </span>
        <h2 className="text-[28px] font-extrabold tracking-[-.04em] text-[#2E0569]">Your bag is empty</h2>
        <p className="max-w-xs text-[14px] leading-relaxed text-[#716A78]">Add products to your wellness bag before checking out.</p>
        <Link href="/shop" className="btn-primary mt-2">Browse products <ArrowRight size={15} /></Link>
      </div>
    );
  }

  const summaryProps: OrderSummaryProps = {
    bag, coupon, couponApplied, couponErr,
    subtotal, discount, shipping, gst, total,
    onCouponChange: handleCouponChange,
    onApplyCoupon: applyCoupon,
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      {/* Page header */}
      <div className="border-b border-[#E9E3EE] bg-white">
        <div className="container-page py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/shop" className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF] transition hover:text-[#2E0569]">
              <ArrowLeft size={14} /> Continue shopping
            </Link>
            <StepIndicator current={step} />
          </div>
        </div>
      </div>

      <div className="container-page py-10 lg:py-14">
        {/* Mobile order summary toggle */}
        <button
          onClick={() => setOrderSummaryOpen((o) => !o)}
          className="mb-6 flex w-full items-center justify-between rounded-[20px] border border-[#E9E3EE] bg-white px-5 py-4 lg:hidden"
        >
          <span className="text-[13px] font-extrabold text-[#2E0569]">
            Order summary · ₹{total.toLocaleString("en-IN")}
          </span>
          <ChevronDown size={18} className={`text-[#8C52FF] transition ${orderSummaryOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {orderSummaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden lg:hidden"
            >
              <OrderSummary {...summaryProps} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* ── Left: form steps ── */}
          <div>
            <AnimatePresence mode="wait">
              {/* STEP 1 — Contact */}
              {step === "contact" && (
                <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <div className="rounded-[28px] border border-[#E9E3EE] bg-white p-6 sm:p-8">
                    <span className="eyebrow mb-5 inline-flex">Step 1 of 3</span>
                    <h1 className="text-[26px] font-extrabold tracking-[-.04em] text-[#2E0569]">Contact details</h1>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#716A78]">We'll use these details for your order confirmation and delivery updates.</p>

                    <div className="mt-7 space-y-5">
                      <div>
                        <Label required>Full name</Label>
                        <input
                          value={contact.name}
                          onChange={(e) => setContact({ ...contact, name: e.target.value })}
                          placeholder="Your full name"
                          className={inputCls(!!contactErr.name)}
                        />
                        <FieldError msg={contactErr.name} />
                      </div>
                      <div>
                        <Label required>Email address</Label>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => setContact({ ...contact, email: e.target.value })}
                          placeholder="you@example.com"
                          className={inputCls(!!contactErr.email)}
                        />
                        <FieldError msg={contactErr.email} />
                      </div>
                      <div>
                        <Label required>Mobile number</Label>
                        <div className="flex gap-2">
                          <span className="flex min-h-[48px] items-center rounded-[14px] border border-[#E9E3EE] bg-[#FAF7FF] px-4 text-[13px] font-extrabold text-[#2E0569]">+91</span>
                          <input
                            type="tel"
                            value={contact.phone}
                            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                            className={`${inputCls(!!contactErr.phone)} flex-1`}
                          />
                        </div>
                        <FieldError msg={contactErr.phone} />
                      </div>
                    </div>

                    <p className="mt-5 text-[11px] leading-relaxed text-[#8B8292]">
                      By continuing, you agree to our <Link href="/policies/terms" className="underline hover:text-[#8C52FF]">Terms of Use</Link> and <Link href="/policies/privacy" className="underline hover:text-[#8C52FF]">Privacy Policy</Link>.
                    </p>

                    <button onClick={handleContactNext} className="btn-primary mt-6 w-full sm:w-auto">
                      Continue to address <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — Address */}
              {step === "address" && (
                <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <div className="rounded-[28px] border border-[#E9E3EE] bg-white p-6 sm:p-8">
                    <span className="eyebrow mb-5 inline-flex">Step 2 of 3</span>
                    <h1 className="text-[26px] font-extrabold tracking-[-.04em] text-[#2E0569]">Delivery address</h1>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#716A78]">Enter the address where you'd like your order delivered.</p>

                    <div className="mt-7 space-y-5">
                      <div>
                        <Label required>Address line 1</Label>
                        <input
                          value={addr.line1}
                          onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
                          placeholder="House / flat no., building, street"
                          className={inputCls(!!addrErr.line1)}
                        />
                        <FieldError msg={addrErr.line1} />
                      </div>
                      <div>
                        <Label>Address line 2 (optional)</Label>
                        <input
                          value={addr.line2}
                          onChange={(e) => setAddr({ ...addr, line2: e.target.value })}
                          placeholder="Area, landmark"
                          className={inputCls()}
                        />
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <Label required>City</Label>
                          <input
                            value={addr.city}
                            onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                            placeholder="City"
                            className={inputCls(!!addrErr.city)}
                          />
                          <FieldError msg={addrErr.city} />
                        </div>
                        <div>
                          <Label required>Pincode</Label>
                          <input
                            value={addr.pincode}
                            onChange={(e) => setAddr({ ...addr, pincode: e.target.value })}
                            placeholder="6-digit pincode"
                            maxLength={6}
                            className={inputCls(!!addrErr.pincode)}
                          />
                          <FieldError msg={addrErr.pincode} />
                        </div>
                      </div>
                      <div>
                        <Label required>State</Label>
                        <select
                          value={addr.state}
                          onChange={(e) => setAddr({ ...addr, state: e.target.value })}
                          className={inputCls(!!addrErr.state)}
                        >
                          <option value="">Select state</option>
                          {STATES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        <FieldError msg={addrErr.state} />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button onClick={() => setStep("contact")} className="btn-secondary">
                        <ArrowLeft size={15} /> Back
                      </button>
                      <button onClick={handleAddressNext} className="btn-primary">
                        Review order <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 — Review & Pay */}
              {step === "review" && (
                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <div className="rounded-[28px] border border-[#E9E3EE] bg-white p-6 sm:p-8">
                    <span className="eyebrow mb-5 inline-flex">Step 3 of 3</span>
                    <h1 className="text-[26px] font-extrabold tracking-[-.04em] text-[#2E0569]">Review & pay</h1>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#716A78]">Confirm your details before proceeding to secure payment.</p>

                    {/* Contact summary */}
                    <div className="mt-7 rounded-[20px] border border-[#E9E3EE] p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">Contact</p>
                        <button onClick={() => setStep("contact")} className="text-[11px] font-extrabold text-[#8C52FF] hover:underline">Edit</button>
                      </div>
                      <p className="mt-2 text-[14px] font-semibold text-[#2E0569]">{contact.name}</p>
                      <p className="text-[13px] text-[#716A78]">{contact.email} · +91 {contact.phone}</p>
                    </div>

                    {/* Address summary */}
                    <div className="mt-3 rounded-[20px] border border-[#E9E3EE] p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">Delivery address</p>
                        <button onClick={() => setStep("address")} className="text-[11px] font-extrabold text-[#8C52FF] hover:underline">Edit</button>
                      </div>
                      <p className="mt-2 text-[14px] font-semibold text-[#2E0569]">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                      <p className="text-[13px] text-[#716A78]">{addr.city}, {addr.state} — {addr.pincode}</p>
                    </div>

                    {/* Payment note */}
                    <div className="mt-6 rounded-[20px] bg-gradient-to-br from-[#F4EEFF] to-[#EDE4FF] p-5">
                      <div className="flex items-center gap-3">
                        <Lock size={18} className="shrink-0 text-[#8C52FF]" />
                        <div>
                          <p className="text-[13px] font-extrabold text-[#2E0569]">Secure payment via Razorpay</p>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-[#716A78]">
                            You will be redirected to Razorpay's secure checkout. UPI, cards, net banking and wallets accepted. Your card details are never stored.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Final total */}
                    <div className="mt-6 flex items-center justify-between rounded-[20px] border border-[#E9E3EE] bg-white px-5 py-4">
                      <span className="text-[14px] font-extrabold text-[#2E0569]">Total payable</span>
                      <span className="text-[22px] font-extrabold tracking-[-.04em] text-[#2E0569]">₹{total.toLocaleString("en-IN")}</span>
                    </div>

                    <p className="mt-4 text-[11px] leading-relaxed text-[#8B8292]">
                      By placing this order you confirm you have read our <Link href="/policies/shipping" className="underline hover:text-[#8C52FF]">Shipping</Link>, <Link href="/policies/returns" className="underline hover:text-[#8C52FF]">Returns</Link> and <Link href="/policies/privacy" className="underline hover:text-[#8C52FF]">Privacy</Link> policies.
                    </p>

                    {payError && (
                      <p className="mt-4 rounded-[14px] bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-600">
                        {payError}
                      </p>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button onClick={() => setStep("address")} className="btn-secondary">
                        <ArrowLeft size={15} /> Back
                      </button>
                      <button
                        disabled={paying}
                        onClick={() => {
                          setPayError("");
                          if (!window.Razorpay) {
                            setPayError("Payment gateway failed to load. Please refresh and try again.");
                            return;
                          }
                          const pending = { items: bag, subtotal, discount, shipping, gst, total, contact, address: addr, couponApplied };
                          setPaying(true);
                          const rzp = new window.Razorpay({
                            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
                            amount: total * 100, // paise
                            currency: "INR",
                            name: "Pradnyasanskar",
                            description: `Order — ${bag.length} item${bag.length > 1 ? "s" : ""}`,
                            prefill: { name: contact.name, email: contact.email, contact: contact.phone },
                            theme: { color: "#8C52FF" },
                            handler: () => {
                              // Payment successful — persist order and navigate
                              trackPaymentResult("success", undefined, total);
                              try { localStorage.setItem("ps_pending_order", JSON.stringify(pending)); } catch {}
                              clearBag();
                              router.push("/order-confirmation");
                            },
                            modal: {
                              ondismiss: () => {
                                setPaying(false);
                                setPayError("Payment was cancelled. You can try again.");
                                trackPaymentResult("cancelled", undefined, total);
                              },
                            },
                          });
                          rzp.open();
                        }}
                        className="btn-primary flex-1 justify-center sm:flex-none disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Lock size={15} /> {paying ? "Opening payment…" : `Pay ₹${total.toLocaleString("en-IN")} securely`}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: order summary (desktop) ── */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <OrderSummary {...summaryProps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AppProvider>
      <div className="min-h-screen overflow-x-clip bg-[#FFFDF7]">
        <AnnouncementBar />
        <Header />
        <main>
          <AuthGuard>
            <CheckoutContent />
          </AuthGuard>
        </main>
        <MobileBottomNav />
      </div>
    </AppProvider>
  );
}
