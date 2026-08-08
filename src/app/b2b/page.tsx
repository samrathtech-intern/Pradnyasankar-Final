"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Factory,
  Loader2,
  Package,
  Truck,
  Users,
} from "lucide-react";

import { PageLayout } from "@/components/PageLayout";
import { Reveal } from "@/components/Reveal";
import { submitB2BEnquiry } from "@/lib/b2bApi";
import { trackEnquirySubmission } from "@/lib/analytics";

const BUSINESS_TYPES = [
  "Retailer",
  "Distributor",
  "Wholesaler",
  "Hospital",
  "Clinic",
  "Pharmacy",
  "Online Seller",
  "Other",
];

const WHY_CARDS = [
  {
    icon: Factory,
    title: "Manufacturing Excellence",
    copy:
      "High-quality Ayurvedic and Nutraceutical manufacturing with strict quality control.",
  },
  {
    icon: Package,
    title: "Private Label",
    copy:
      "Custom branding and packaging solutions for business partners.",
  },
  {
    icon: Truck,
    title: "Bulk Supply",
    copy:
      "Reliable bulk supply across India with efficient logistics.",
  },
  {
    icon: Users,
    title: "Long-term Partnership",
    copy:
      "Building trusted relationships with distributors and institutions.",
  },
];

function inputCls(error?: boolean) {
  return `w-full rounded-[14px] border ${
    error
      ? "border-red-400 bg-red-50"
      : "border-[#E9E3EE] bg-white"
  } px-4 py-3 text-[14px] font-semibold text-[#2E0569] outline-none transition placeholder:text-[#9B93A1] focus:border-[#8C52FF]`;
}

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[.1em] text-[#2E0569]">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;

  return (
    <p className="mt-1 text-[11px] font-semibold text-red-500">
      {msg}
    </p>
  );
}

type FormState = {
  companyName: string;
  contactPerson: string;
  email: string;
  mobileNumber: string;
  gstNumber: string;
  businessType: string;
  message: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  companyName: "",
  contactPerson: "",
  email: "",
  mobileNumber: "",
  gstNumber: "",
  businessType: "",
  message: "",
  consent: false,
};

function B2BContent() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  function set(
    field: keyof FormState,
    value: string | boolean
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  }

  function validate() {
    const e: FormErrors = {};

    if (!form.companyName.trim())
      e.companyName = "Company name is required";

    if (!form.contactPerson.trim())
      e.contactPerson = "Contact person is required";

    if (
      !form.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    )
      e.email = "Valid email required";

    if (
      !/^[6-9]\d{9}$/.test(
        form.mobileNumber.replace(/\s/g, "")
      )
    )
      e.mobileNumber = "Enter valid mobile number";

    if (!form.message.trim())
      e.message = "Message is required";

    if (!form.consent)
      e.consent = "Please accept consent";

    setErrors(e);

    return Object.keys(e).length === 0;
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
) {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      await submitB2BEnquiry({
        companyName: form.companyName,
        contactPerson: form.contactPerson,
        email: form.email,
        mobileNumber: form.mobileNumber,
        gstNumber: form.gstNumber,
        businessType: form.businessType,
        enquiryType: "General Enquiry",
        message: form.message,
      });

trackEnquirySubmission("b2b", {
        enquiryType: "General Enquiry",
      });

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const faqs = [
    [
      "Who can submit a B2B enquiry?",
      "Distributors, wholesalers, hospitals, pharmacies, clinics and institutional buyers can submit enquiries.",
    ],
    [
      "How long does it take to respond?",
      "Our team generally responds within 2–3 working days.",
    ],
    [
      "Can I enquire about bulk orders?",
      "Yes. Mention your requirement in the message field.",
    ],
    [
      "Is this a quotation request?",
      "No. This form is only for business enquiries.",
    ],
  ];  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 18 }}
        >
          <span className="grid h-24 w-24 place-items-center rounded-full bg-[#EAF4E4] text-[#315C20]">
            <CheckCircle2 size={44} />
          </span>
        </motion.div>

        <h2 className="text-[32px] font-extrabold tracking-[-.04em] text-[#2E0569]">
          Enquiry received
        </h2>

        <p className="max-w-md text-[15px] leading-relaxed text-[#716A78]">
          Thank you,
          <strong className="text-[#2E0569]">
            {" "}
            {form.contactPerson}
          </strong>
          . We have received your business enquiry and our team will contact
          you shortly.
        </p>

        <button
          onClick={() => {
            setForm(EMPTY);
            setSubmitted(false);
          }}
          className="btn-secondary mt-2"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }  return (
    <div className="min-h-screen bg-[#FFFDF7]">

      {/* Hero Section */}

      <section className="border-b border-[#E9E3EE] bg-gradient-to-br from-[#F4EEFF] via-[#FFFDF7] to-[#FFF8EE] py-16 sm:py-20">
        <div className="container-page">
          <Reveal>

            <span className="eyebrow">
              <Building2 size={13} />
              Business enquiries
            </span>

            <h1 className="section-heading mt-5 max-w-3xl">
              Partner with Pradnyasanskar.
            </h1>

            <p className="mt-5 max-w-2xl text-[15px] leading-[1.85] text-[#716A78]">
              We work with distributors, retailers, wholesalers,
              institutions and wellness businesses looking for reliable
              Ayurveda and nutraceutical products.
            </p>

          </Reveal>
        </div>
      </section>

      {/* Why Partner Cards */}

      <section className="container-page py-14">
        <Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {WHY_CARDS.map(({ icon: Icon, title, copy }) => (

              <div
                key={title}
                className="rounded-[24px] border border-[#E9E3EE] bg-white p-6"
              >

                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F2EBFF] text-[#8C52FF]">
                  <Icon size={20} />
                </span>

                <h3 className="mt-4 text-[15px] font-extrabold text-[#2E0569]">
                  {title}
                </h3>

                <p className="mt-2 text-[13px] leading-relaxed text-[#716A78]">
                  {copy}
                </p>

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

              <span className="eyebrow mb-5 inline-flex">
                Business enquiry form
              </span>

              <h2 className="text-[26px] font-extrabold tracking-[-.04em] text-[#2E0569]">
                Tell us about your requirement
              </h2>

              <p className="mt-2 text-[13px] leading-relaxed text-[#716A78]">
                Fill in the details below. Our business team will review your
                enquiry and get back to you.
              </p>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-8 space-y-5"
              >

                {submitError && (
                  <div className="rounded-[14px] bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
                    {submitError}
                  </div>
                )}                {/* Company Name */}
                <div>
                  <Label required>Company Name</Label>
                  <input
                    value={form.companyName}
                    onChange={(e) =>
                      set("companyName", e.target.value)
                    }
                    placeholder="Company Name"
                    className={inputCls(!!errors.companyName)}
                  />
                  <FieldError msg={errors.companyName} />
                </div>

                {/* Contact Person */}
                <div>
                  <Label required>Contact Person</Label>
                  <input
                    value={form.contactPerson}
                    onChange={(e) =>
                      set("contactPerson", e.target.value)
                    }
                    placeholder="Contact Person"
                    className={inputCls(!!errors.contactPerson)}
                  />
                  <FieldError msg={errors.contactPerson} />
                </div>

                {/* Email + Mobile */}
                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <Label required>Email Address</Label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        set("email", e.target.value)
                      }
                      placeholder="you@company.com"
                      className={inputCls(!!errors.email)}
                    />
                    <FieldError msg={errors.email} />
                  </div>

                  <div>
                    <Label required>Mobile Number</Label>

                    <div className="flex gap-2">

                      <span className="flex min-h-[48px] items-center rounded-[14px] border border-[#E9E3EE] bg-[#FAF7FF] px-4 text-[13px] font-extrabold text-[#2E0569]">
                        +91
                      </span>

                      <input
                        type="tel"
                        value={form.mobileNumber}
                        onChange={(e) =>
                          set("mobileNumber", e.target.value)
                        }
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        className={`${inputCls(
                          !!errors.mobileNumber
                        )} flex-1`}
                      />

                    </div>

                    <FieldError msg={errors.mobileNumber} />

                  </div>

                </div>

                {/* GST Number */}
                <div>
                  <Label>GST Number</Label>

                  <input
                    value={form.gstNumber}
                    onChange={(e) =>
                      set("gstNumber", e.target.value)
                    }
                    placeholder="GST Number (Optional)"
                    className={inputCls()}
                  />
                </div>

                {/* Business Type */}
                <div>

                  <Label>Business Type</Label>

                  <select
                    value={form.businessType}
                    onChange={(e) =>
                      set("businessType", e.target.value)
                    }
                    className={inputCls()}
                  >

                    <option value="">
                      Select Business Type
                    </option>

                    {BUSINESS_TYPES.map((type) => (
                      <option key={type}>
                        {type}
                      </option>
                    ))}

                  </select>

                </div>                {/* Message */}

                <div>

                  <Label required>
                    Requirement / Message
                  </Label>

                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      set("message", e.target.value)
                    }
                    placeholder="Describe your business enquiry..."
                    className={`${inputCls(
                      !!errors.message
                    )} resize-none`}
                  />

                  <FieldError msg={errors.message} />

                </div>

                {/* Consent */}
                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) =>
                        set("consent", e.target.checked)
                      }
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#8C52FF]"
                    />
                    <span className="text-[12px] leading-relaxed text-[#5F5765]">
                      I agree to be contacted by Pradnyasanskar regarding
                      this business enquiry.
                    </span>
                  </label>
                  <FieldError msg={errors.consent} />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full items-center justify-center sm:w-auto"
                >
                  {submitting ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Enquiry
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

              </form>

            </div>

          </Reveal>          {/* FAQ Sidebar */}

          <Reveal delay={0.08}>

            <div className="lg:sticky lg:top-28 space-y-4">

              <div className="rounded-[24px] border border-[#E9E3EE] bg-white p-6">

                <h3 className="text-[16px] font-extrabold text-[#2E0569]">
                  Frequently Asked
                </h3>

                <div className="mt-4 space-y-2">

                  {faqs.map(([q, a], i) => (

                    <div
                      key={q}
                      className="overflow-hidden rounded-[16px] border border-[#E9E3EE]"
                    >

                      <button
                        onClick={() =>
                          setFaqOpen(
                            faqOpen === i ? null : i
                          )
                        }
                        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
                      >

                        <span className="text-[12px] font-extrabold text-[#2E0569]">
                          {q}
                        </span>

                        <ChevronDown
                          size={15}
                          className={`shrink-0 text-[#8C52FF] transition ${
                            faqOpen === i
                              ? "rotate-180"
                              : ""
                          }`}
                        />

                      </button>

                      <AnimatePresence initial={false}>

                        {faqOpen === i && (

                          <motion.div
                            initial={{
                              height: 0,
                              opacity: 0,
                            }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                            }}
                            className="overflow-hidden"
                          >

                            <p className="border-t border-[#F0EAF4] px-4 py-3.5 text-[12px] leading-relaxed text-[#716A78]">
                              {a}
                            </p>

                          </motion.div>

                        )}

                      </AnimatePresence>

                    </div>

                  ))}

                </div>

              </div>

              <div className="rounded-[24px] bg-gradient-to-br from-[#F4EEFF] to-[#EDE4FF] p-6">

                <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">
                  Need Help?
                </p>

                <p className="mt-2 text-[13px] leading-relaxed text-[#5F5765]">
                  For product-related or customer support queries,
                  please visit our Contact page.
                </p>

                <a
                  href="/contact"
                  className="btn-secondary mt-4 w-full justify-center"
                >
                  Go to Contact
                </a>

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