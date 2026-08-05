"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { Reveal } from "@/components/Reveal";
import { trackEnquirySubmission } from "@/lib/analytics";

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

const TOPICS = [
  "Product information",
  "Order support",
  "Shipping & delivery",
  "Returns & refunds",
  "General enquiry",
  "Other",
];

const ORDER_ID_TOPICS = ["Order support", "Shipping & delivery", "Returns & refunds"];
const IMAGE_TOPICS = ["Returns & refunds"];

type Form = { name: string; email: string; phone: string; topic: string; orderId: string; message: string; image: File | null };
type Errors = Partial<Record<keyof Form, string>>;

const EMPTY: Form = { name: "", email: "", phone: "", topic: "", orderId: "", message: "", image: null };

function ContactContent() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function set(field: keyof Form, value: string | File | null) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  const showOrderId = ORDER_ID_TOPICS.includes(form.topic);
  const showImage = IMAGE_TOPICS.includes(form.topic);

  function validate() {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required";
    if (!form.topic) e.topic = "Please select a topic";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      trackEnquirySubmission("contact", { topic: form.topic });
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 18 }}>
          <span className="grid h-24 w-24 place-items-center rounded-full bg-[#EAF4E4] text-[#315C20]">
            <CheckCircle2 size={44} />
          </span>
        </motion.div>
        <h2 className="text-[32px] font-extrabold tracking-[-.04em] text-[#2E0569]">Message sent</h2>
        <p className="max-w-md text-[15px] leading-relaxed text-[#716A78]">
          Thank you, <strong className="text-[#2E0569]">{form.name}</strong>. We have received your message and will respond within 1–2 working days.
        </p>
        <button onClick={() => { setForm(EMPTY); setSubmitted(false); }} className="btn-secondary mt-2">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      {/* Hero */}
      <section className="border-b border-[#E9E3EE] bg-gradient-to-br from-[#F4EEFF] via-[#FFFDF7] to-[#FFF8EE] py-16 sm:py-20">
        <div className="container-page">
          <Reveal>
            <span className="eyebrow"><MessageCircle size={13} /> Get in touch</span>
            <h1 className="section-heading mt-5 max-w-2xl">We're here to help.</h1>
            <p className="mt-5 max-w-xl text-[15px] leading-[1.85] text-[#716A78]">
              Have a question about a product, an order or anything else? Send us a message and our team will get back to you.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <Reveal>
            <div className="rounded-[28px] border border-[#E9E3EE] bg-white p-6 sm:p-10">
              <h2 className="text-[22px] font-extrabold tracking-[-.04em] text-[#2E0569]">Send a message</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[#716A78]">We aim to respond within 1–2 working days.</p>

              <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label required>Full name</Label>
                    <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={inputCls(!!errors.name)} />
                    <FieldError msg={errors.name} />
                  </div>
                  <div>
                    <Label required>Email address</Label>
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={inputCls(!!errors.email)} />
                    <FieldError msg={errors.email} />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label>Mobile number (optional)</Label>
                    <div className="flex gap-2">
                      <span className="flex min-h-[48px] items-center rounded-[14px] border border-[#E9E3EE] bg-[#FAF7FF] px-4 text-[13px] font-extrabold text-[#2E0569]">+91</span>
                      <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="10-digit number" maxLength={10} className={`${inputCls()} flex-1`} />
                    </div>
                  </div>
                  <div>
                    <Label required>Topic</Label>
                    <select value={form.topic} onChange={(e) => set("topic", e.target.value)} className={inputCls(!!errors.topic)}>
                      <option value="">Select a topic</option>
                      {TOPICS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                    <FieldError msg={errors.topic} />
                  </div>
                </div>

                {showOrderId && (
                  <div>
                    <Label>Order ID</Label>
                    <input value={form.orderId} onChange={(e) => set("orderId", e.target.value)} placeholder="e.g. PS-ABC123-XY12" className={inputCls()} />
                    <p className="mt-1 text-[11px] text-[#8B8292]">Find your Order ID in your confirmation email or on the <a href="/orders" className="underline hover:text-[#8C52FF]">Orders page</a>.</p>
                  </div>
                )}

                {showImage && (
                  <div>
                    <Label>Attach image (optional)</Label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-dashed border-[#CDBAF1] bg-[#FAF7FF] px-4 py-3 transition hover:border-[#8C52FF]">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          if (file && file.size > 5 * 1024 * 1024) {
                            setErrors((err) => ({ ...err, image: "File must be under 5 MB" }));
                            e.target.value = "";
                            return;
                          }
                          set("image", file);
                        }}
                      />
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F2EBFF] text-[#8C52FF]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </span>
                      <span className="text-[13px] font-semibold text-[#716A78]">
                        {form.image ? form.image.name : "Upload photo of the issue"}
                      </span>
                    </label>
                    <p className="mt-1 text-[11px] text-[#8B8292]">Accepted: JPG, PNG, WEBP. Max 5 MB.</p>
                    <FieldError msg={errors.image} />
                  </div>
                )}

                <div>
                  <Label required>Message</Label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Describe your question or concern in detail…"
                    rows={5}
                    className={`${inputCls(!!errors.message)} resize-none`}
                  />
                  <FieldError msg={errors.message} />
                </div>

                <button type="submit" className="btn-primary w-full sm:w-auto">
                  Send message <ArrowRight size={15} />
                </button>
              </form>
            </div>
          </Reveal>

          {/* Info sidebar */}
          <Reveal delay={0.08}>
            <div className="space-y-4 lg:sticky lg:top-28">
              {[
                { icon: Mail, label: "Email", value: "support@pradnyasanskar.com", sub: "We respond within 1–2 working days" },
                { icon: Phone, label: "Phone", value: "Available soon", sub: "Please use email or the contact form" },
                { icon: MapPin, label: "Location", value: "India", sub: "Domestic orders and enquiries only" },
              ].map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="flex items-start gap-4 rounded-[20px] border border-[#E9E3EE] bg-white p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#F2EBFF] text-[#8C52FF]">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">{label}</p>
                    <p className="mt-1 text-[14px] font-extrabold text-[#2E0569]">{value}</p>
                    <p className="mt-0.5 text-[11px] text-[#8B8292]">{sub}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-[20px] bg-gradient-to-br from-[#F4EEFF] to-[#EDE4FF] p-5">
                <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">Business enquiry?</p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#5F5765]">
                  For distributor, bulk, private-label or manufacturing enquiries, use our dedicated B2B form.
                </p>
                <a href="/b2b" className="btn-primary mt-4 w-full justify-center">
                  B2B enquiry <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <PageLayout>
      <ContactContent />
    </PageLayout>
  );
}
