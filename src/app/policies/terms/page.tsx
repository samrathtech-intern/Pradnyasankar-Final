import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Terms of Use | Pradnyasanskar",
  description: "Terms and conditions governing use of the Pradnyasanskar website and services.",
};

const SECTIONS = [
  { heading: "Acceptance of terms", body: "By accessing or using the Pradnyasanskar website (pradnyasanskar.com), you agree to be bound by these Terms of Use. If you do not agree, please do not use the website. We reserve the right to update these terms at any time. Continued use of the website after changes constitutes acceptance." },
  { heading: "Use of the website", body: "You may use this website for lawful purposes only. You must not use the website in any way that violates applicable laws, infringes intellectual property rights, transmits harmful or malicious content, or interferes with the operation of the website or its services." },
  { heading: "Product information and medical disclaimer", body: "Product information on this website is provided for general education and discovery purposes only. It does not constitute medical advice, diagnosis, prescription or personalised treatment recommendations. Always refer to the product label for complete directions and cautions. Consult a qualified healthcare professional before using any product if you have a medical condition, are pregnant, breastfeeding or on medication." },
  { heading: "Purchases and orders", body: "By placing an order, you confirm that the information you provide is accurate and complete. Orders are subject to availability and acceptance. We reserve the right to cancel or refuse any order at our discretion. Prices are in Indian Rupees (INR) and include applicable GST unless stated otherwise." },
  { heading: "Payments", body: "All payments are processed securely through Razorpay. By completing a purchase, you agree to Razorpay's terms and conditions. We do not store card details. Payment confirmation does not guarantee order fulfilment — orders are subject to stock availability and verification." },
  { heading: "Intellectual property", body: "All content on this website — including text, images, logos, product descriptions, design elements and code — is the property of Pradnyasanskar Enterprises Pvt. Ltd. or its licensors. You may not reproduce, distribute, modify or use any content without prior written permission." },
  { heading: "User accounts", body: "If you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. Notify us immediately if you suspect unauthorised access. We reserve the right to suspend or terminate accounts that violate these terms." },
  { heading: "Limitation of liability", body: "To the maximum extent permitted by law, Pradnyasanskar Enterprises Pvt. Ltd. shall not be liable for any indirect, incidental, special or consequential damages arising from use of the website or products. Our total liability for any claim shall not exceed the amount paid for the relevant order." },
  { heading: "Governing law", body: "These terms are governed by the laws of India. Any disputes arising from use of this website or purchase of products shall be subject to the exclusive jurisdiction of the courts in India." },
  { heading: "Contact", body: "For questions about these terms, contact us through the Contact page on this website." },
];

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-[#FFFDF7]">
        <section className="border-b border-[#E9E3EE] bg-gradient-to-br from-[#F4EEFF] via-[#FFFDF7] to-[#FFF8EE] py-14 sm:py-18">
          <div className="container-page">
            <Reveal>
              <Link href="/policies" className="mb-6 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF] hover:text-[#2E0569] transition"><ArrowLeft size={13} /> All policies</Link>
              <h1 className="section-heading mt-2 max-w-2xl">Terms of Use</h1>
              <p className="mt-4 text-[13px] text-[#8B8292]">Last updated: July 2026</p>
            </Reveal>
          </div>
        </section>
        <section className="container-page py-12">
          <div className="mx-auto max-w-3xl space-y-10">
            {SECTIONS.map(({ heading, body }, i) => (
              <Reveal key={heading} delay={i * 0.04}>
                <div>
                  <h2 className="text-[18px] font-extrabold tracking-[-.03em] text-[#2E0569]">{heading}</h2>
                  <p className="mt-3 text-[14px] leading-[1.9] text-[#716A78]">{body}</p>
                </div>
              </Reveal>
            ))}
            <Reveal>
              <div className="rounded-[20px] border border-[#E9E3EE] bg-[#FAF7FF] p-6 text-[12px] leading-relaxed text-[#8B8292]">
                These terms apply to pradnyasanskar.com and all associated services operated by Pradnyasanskar Enterprises Pvt. Ltd., India.
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
