import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { Reveal } from "@/components/Reveal";
import { getContentPageBySlug } from "@/lib/contentPageApi";

export const metadata: Metadata = {
  title: "Returns & Refunds | Pradnyasanskar",
  description: "Pradnyasanskar returns and refunds policy — eligibility, process, timelines and how to raise a request.",
};

const SECTIONS = [
  { heading: "Return eligibility", body: "Returns are accepted within 7 days of delivery for products that are damaged, defective, incorrectly shipped or have a quality issue. Products must be unused, in their original packaging and accompanied by the original invoice. Opened or partially used products are not eligible for return unless they are defective." },
  { heading: "Non-returnable items", body: "The following are not eligible for return: products that have been opened and used (unless defective), products without original packaging, products purchased during clearance or final-sale events (where stated), and products damaged due to misuse or improper storage by the customer." },
  { heading: "How to raise a return request", body: "To initiate a return, contact us through the Contact page within 7 days of delivery. Include your order ID, the product(s) you wish to return, the reason for return and photographs of the product and packaging. Our team will review your request and respond within 2 working days." },
  { heading: "Return pickup", body: "If your return is approved, we will arrange a pickup from your delivery address through our courier partner. You will receive a pickup confirmation with the scheduled date. Ensure the product is securely packed in its original packaging before pickup." },
  { heading: "Inspection and approval", body: "Once the returned product is received and inspected, we will notify you of the outcome. If the return is approved, a refund will be initiated. If the product does not meet the return criteria upon inspection, we will notify you and the product may be returned to you." },
  { heading: "Refund process", body: "Approved refunds are processed to the original payment method within 5–7 working days of return approval. Razorpay processes the refund and the timeline for the amount to reflect in your account depends on your bank or payment provider. You will receive a refund confirmation by email." },
  { heading: "Partial refunds", body: "Partial refunds may be issued where only part of an order is returned or where a deduction applies (e.g. shipping charges on orders that no longer meet the free-shipping threshold after a return)." },
  { heading: "Order cancellations", body: "Orders can be cancelled before dispatch by contacting us immediately. Once an order has been dispatched, it cannot be cancelled — you may initiate a return after delivery. Refunds for cancelled orders are processed within 5–7 working days." },
  { heading: "Defective or wrong products", body: "If you receive a defective or incorrectly shipped product, contact us within 48 hours of delivery with photographs. We will arrange a replacement or full refund at no additional cost to you." },
];

export default async function ReturnsPolicyPage() {
  const returnsPage = await getContentPageBySlug("returns");

  console.log("Backend Returns Page:", returnsPage);
  return (
    <PageLayout>
      <div className="min-h-screen bg-[#FFFDF7]">
        <section className="border-b border-[#E9E3EE] bg-gradient-to-br from-[#F4EEFF] via-[#FFFDF7] to-[#FFF8EE] py-14 sm:py-18">
          <div className="container-page">
            <Reveal>
              <Link href="/policies" className="mb-6 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF] hover:text-[#2E0569] transition"><ArrowLeft size={13} /> All policies</Link>
              <h1 className="section-heading mt-2 max-w-2xl">Returns & Refunds</h1>
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
                For return and refund queries, contact us through the <Link href="/contact" className="underline hover:text-[#8C52FF]">Contact page</Link>. Please have your order ID and photographs ready.
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
