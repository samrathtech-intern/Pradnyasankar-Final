"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, ChevronDown, Factory, Package, Truck, Users } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { Reveal } from "@/components/Reveal";
import { trackEnquirySubmission } from "@/lib/analytics";

const ENQUIRY_TYPES = [
  "Distributor / Dealer",
  "Bulk / Institutional Purchase",
  "Contract Manufacturing",
  "Private Label",
  "Formulation / Product Development",
  "General Business Enquiry",
];

const CATEGORIES = [
  "Ayurveda",
  "Nutraceuticals",
  "External Wellness",
  "Multiple categories",
];

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

const WHY_CARDS = [
  { icon: Factory, title: "Manufacturing capability", copy: "In-house formulation and manufacturing with quality controls across Ayurvedic and nutraceutical product categories." },
  { icon: Package, title: "Private label ready", copy: "Custom branding, packaging and formulation options available for qualified business partners." },
  { icon: Truck, title: "Bulk supply", copy: "Structured supply arrangements for distributors, institutions and large-volume buyers across India." },
  { icon: Users, title: "Partnership approach", copy: "We work with serious business partners who share our commitment to quality and responsible product information." },
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

type FormState = {
  name: string;
  org: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  enquiryType: string;
  category: string;
  quantity: string;
  message: string;
  document: File | null;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  name: "", org: "", email: "", phone: "",
  city: "", state: "", enquiryType: "",
  category: "", quantity: "", message: "", document: null, consent: false,
};

function B2BContent() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

function set(field: keyof FormState, value: string | boolean | File | null) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.org.trim()) e.org = "Organisation name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Valid 10-digit mobile number required";
    if (!form.enquiryType) e.enquiryType = "Please select an enquiry type";
    if (!form.category) e.category = "Please select a product category";
    if (!form.consent) e.consent = "Please confirm your consent to proceed";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      trackEnquirySubmission("b2b", { enquiryType: form.enquiryType });
      setSubmitted(true);
    }
  }

  const faqs = [
    ["What types of business enquiries do you accept?", "We welcome enquiries from distributors, dealers, bulk buyers, institutions, private-label partners and contract-manufacturing prospects. Use the form to describe your requirement and our team will respond."],
    ["Is this form a quotation or manufacturing commitment?", "No. Submitting this form is an expression of interest only. It does not constitute a quotation, price commitment or manufacturing agreement. All commercial terms are subject to separate discussion and approval."],
    ["How long does it take to receive a response?", "Our team aims to respond to all serious business enquiries within 2–3 working days. Complex manufacturing or formulation enquiries may take longer for an initial assessment."],
    ["Can I request product samples?", "Sample requests can be mentioned in the message field. Sample availability and terms are subject to the nature of the enquiry and company policy at the time."],
  ];

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 18 }}>
          <span className="grid h-24 w-24 place-items-center rounded-full bg-[#EAF4E4] text-[#315C20]">
            <CheckCircle2 size={44} />
          </span>
        </motion.div>
        <h2 className="text-[32px] font-extrabold tracking-[-.04em] text-[#2E0569]">Enquiry received</h2>
        <p className="max-w-md text-[15px] leading-relaxed text-[#716A78]">
          Thank you, <strong className="text-[#2E0569]">{form.name}</strong>. We have received your business enquiry and will be in touch within 2–3 working days.
        </p>
        <p className="max-w-sm text-[12px] leading-relaxed text-[#8B8292]">
          This submission is not a quotation or manufacturing commitment. All commercial terms are subject to separate discussion and approval by Pradnyasanskar.
        </p>
        <button onClick={() => { setForm(EMPTY); setSubmitted(false); }} className="btn-secondary mt-2">
          Submit another enquiry
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
            <span className="eyebrow"><Building2 size={13} /> Business enquiries</span>
            <h1 className="section-heading mt-5 max-w-3xl">
              Partner with Pradnyasanskar.
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-[1.85] text-[#716A78]">
              We work with distributors, bulk buyers, private-label partners and contract-manufacturing prospects who share our commitment to quality and responsible wellness products.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Why cards */}
      <section className="container-page py-14">
        <Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CARDS.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="rounded-[24px] border border-[#E9E3EE] bg-white p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F2EBFF] text-[#8C52FF]">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-[15px] font-extrabold text-[#2E0569]">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#716A78]">{copy}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Form + FAQ */}
      <section className="container-page pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <Reveal>
            <div className="rounded-[28px] border border-[#E9E3EE] bg-white p-6 sm:p-10">
              <span className="eyebrow mb-5 inline-flex">Business enquiry form</span>
              <h2 className="text-[26px] font-extrabold tracking-[-.04em] text-[#2E0569]">Tell us about your requirement</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[#716A78]">
                Fill in the details below. Submission is not a quotation or commitment — our team will review and respond.
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                {/* Name + Org */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label required>Full name</Label>
                    <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" className={inputCls(!!errors.name)} />
                    <FieldError msg={errors.name} />
                  </div>
                  <div>
                    <Label required>Organisation</Label>
                    <input value={form.org} onChange={(e) => set("org", e.target.value)} placeholder="Company / organisation name" className={inputCls(!!errors.org)} />
                    <FieldError msg={errors.org} />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label required>Email address</Label>
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" className={inputCls(!!errors.email)} />
                    <FieldError msg={errors.email} />
                  </div>
                  <div>
                    <Label required>Mobile number</Label>
                    <div className="flex gap-2">
                      <span className="flex min-h-[48px] items-center rounded-[14px] border border-[#E9E3EE] bg-[#FAF7FF] px-4 text-[13px] font-extrabold text-[#2E0569]">+91</span>
                      <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="10-digit number" maxLength={10} className={`${inputCls(!!errors.phone)} flex-1`} />
                    </div>
                    <FieldError msg={errors.phone} />
                  </div>
                </div>

                {/* City + State */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label>City</Label>
                    <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="City" className={inputCls()} />
                  </div>
                  <div>
                    <Label>State</Label>
                    <select value={form.state} onChange={(e) => set("state", e.target.value)} className={inputCls()}>
                      <option value="">Select state</option>
                      {STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Enquiry type */}
                <div>
                  <Label required>Enquiry type</Label>
                  <select value={form.enquiryType} onChange={(e) => set("enquiryType", e.target.value)} className={inputCls(!!errors.enquiryType)}>
                    <option value="">Select enquiry type</option>
                    {ENQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <FieldError msg={errors.enquiryType} />
                </div>

                {/* Category + Quantity */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label required>Product category of interest</Label>
                    <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls(!!errors.category)}>
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <FieldError msg={errors.category} />
                  </div>
                  <div>
                    <Label>Expected quantity / volume</Label>
                    <input value={form.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="e.g. 500 units/month" className={inputCls()} />
                  </div>
                </div>

                {/* Document upload */}
                <div>
                  <Label>Company document (optional)</Label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-dashed border-[#CDBAF1] bg-[#FAF7FF] px-4 py-3 transition hover:border-[#8C52FF]">
                    <input
                      type="file"
                      accept="application/pdf,image/jpeg,image/png"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        if (file && file.size > 5 * 1024 * 1024) {
                          setErrors((err) => ({ ...err, document: "File must be under 5 MB" }));
                          e.target.value = "";
                          return;
                        }
                        set("document", file);
                      }}
                    />
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F2EBFF] text-[#8C52FF]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </span>
                    <span className="text-[13px] font-semibold text-[#716A78]">
                      {form.document ? form.document.name : "Upload company profile, GST certificate or relevant document"}
                    </span>
                  </label>
                  <p className="mt-1 text-[11px] text-[#8B8292]">Accepted: PDF, JPG, PNG. Max 5 MB.</p>
                  <FieldError msg={errors.document} />
                </div>

                {/* Message */}
                <div>
                  <Label>Requirement details</Label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Describe your requirement, product interest, packaging needs or any other relevant details…"
                    rows={5}
                    className={`${inputCls()} resize-none`}
                  />
                </div>

                {/* Consent */}
                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => set("consent", e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#8C52FF]"
                    />
                    <span className="text-[12px] leading-relaxed text-[#716A78]">
                      I consent to Pradnyasanskar contacting me regarding this enquiry. I understand this submission is not a quotation, price commitment or manufacturing agreement.
                    </span>
                  </label>
                  <FieldError msg={errors.consent} />
                </div>

                <button type="submit" className="btn-primary w-full sm:w-auto">
                  Submit enquiry <ArrowRight size={15} />
                </button>
              </form>
            </div>
          </Reveal>

          {/* FAQ sidebar */}
          <Reveal delay={0.08}>
            <div className="lg:sticky lg:top-28 space-y-4">
              <div className="rounded-[24px] border border-[#E9E3EE] bg-white p-6">
                <h3 className="text-[16px] font-extrabold text-[#2E0569]">Frequently asked</h3>
                <div className="mt-4 space-y-2">
                  {faqs.map(([q, a], i) => (
                    <div key={q} className="overflow-hidden rounded-[16px] border border-[#E9E3EE]">
                      <button
                        onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
                      >
                        <span className="text-[12px] font-extrabold text-[#2E0569]">{q}</span>
                        <ChevronDown size={15} className={`shrink-0 text-[#8C52FF] transition ${faqOpen === i ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {faqOpen === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <p className="border-t border-[#F0EAF4] px-4 py-3.5 text-[12px] leading-relaxed text-[#716A78]">{a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] bg-gradient-to-br from-[#F4EEFF] to-[#EDE4FF] p-6">
                <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">Not a business enquiry?</p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#5F5765]">For general product questions or customer support, use our contact page.</p>
                <a href="/contact" className="btn-secondary mt-4 w-full justify-center">Go to contact</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default function B2BPage() {
  return (
    <PageLayout>
      <B2BContent />
    </PageLayout>
  );
}
