import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Privacy Policy | Pradnyasanskar",
  description: "Pradnyasanskar's privacy policy — how we collect, use, store and protect your personal information.",
};

const SECTIONS = [
  { heading: "Information we collect", body: "We collect information you provide directly — such as your name, email address, mobile number and delivery address when you place an order, create an account or submit an enquiry. We also collect order and transaction data, and usage data such as pages visited and search queries, to improve the website experience." },
  { heading: "How we use your information", body: "We use your information to process and fulfil orders, send order confirmations and shipping updates, respond to enquiries and support requests, improve the website and product catalogue, and send marketing communications where you have given explicit consent. We do not use your information for automated decision-making or profiling." },
  { heading: "Data sharing", body: "We share your information only with service providers necessary to fulfil your order — including payment processors (Razorpay), courier partners and email/SMS notification providers. We do not sell your personal data to third parties. All service providers are required to handle your data securely and only for the purpose for which it was shared." },
  { heading: "Payment data", body: "Payment transactions are processed by Razorpay. We do not store card numbers, CVV or full payment credentials on our systems. Razorpay's privacy policy governs the handling of payment data. We store only the transaction reference, amount, status and method summary required for order management." },
  { heading: "Cookies and tracking", body: "We use cookies and similar technologies to maintain your session, remember your cart and preferences, and measure website performance. Analytics and advertising tags are loaded with consent where required. You can manage cookie preferences through your browser settings." },
  { heading: "Data retention", body: "We retain your personal data for as long as necessary to fulfil the purposes described in this policy, comply with legal obligations (including tax and invoice records) and resolve disputes. Order and invoice data is retained for the period required under applicable Indian law." },
  { heading: "Your rights", body: "You have the right to access, correct or request deletion of your personal data. To make a request, contact us through the Contact page. We will respond within a reasonable timeframe. Note that some data may be retained for legal or operational reasons even after a deletion request." },
  { heading: "Security", body: "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, disclosure, alteration or destruction. All data is transmitted over HTTPS. Access to personal data is restricted to authorised personnel on a need-to-know basis." },
  { heading: "Changes to this policy", body: "We may update this privacy policy from time to time. Material changes will be communicated through the website. Continued use of the website after changes constitutes acceptance of the updated policy. The date of the last update is shown at the bottom of this page." },
  { heading: "Contact", body: "For privacy-related queries, data requests or concerns, contact us through the Contact page on this website. We aim to respond within 5 working days." },
  { heading: "Grievance officer", body: "In accordance with the Information Technology Act 2000 and the Consumer Protection (E-Commerce) Rules 2020, the name and contact details of the Grievance Officer are: Name: [Grievance Officer Name — to be updated before launch] | Designation: Grievance Officer | Organisation: Pradnyasanskar Enterprises Pvt. Ltd. | Email: grievance@pradnyasanskar.com | Address: [Registered office address — to be updated before launch] | Working hours: Monday to Friday, 10:00 AM – 6:00 PM IST. Complaints will be acknowledged within 48 hours and resolved within 30 days of receipt." },
];

export default function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-[#FFFDF7]">
        <section className="border-b border-[#E9E3EE] bg-gradient-to-br from-[#F4EEFF] via-[#FFFDF7] to-[#FFF8EE] py-14 sm:py-18">
          <div className="container-page">
            <Reveal>
              <Link href="/policies" className="mb-6 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF] hover:text-[#2E0569] transition"><ArrowLeft size={13} /> All policies</Link>
              <h1 className="section-heading mt-2 max-w-2xl">Privacy Policy</h1>
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
                This policy applies to pradnyasanskar.com and all associated services operated by Pradnyasanskar Enterprises Pvt. Ltd., India.
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
