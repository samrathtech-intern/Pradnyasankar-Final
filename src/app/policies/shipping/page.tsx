import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { Reveal } from "@/components/Reveal";
import { getContentPageBySlug } from "@/lib/contentPageApi";

export const metadata: Metadata = {
  title: "Shipping Policy | Pradnyasanskar",
  description: "Pradnyasanskar shipping policy — delivery timelines, charges, serviceable areas and dispatch information.",
};

const SECTIONS = [
  { heading: "Serviceable areas", body: "We currently ship to serviceable addresses across India. Serviceability is checked at checkout using your pincode. Some remote or restricted areas may not be serviceable. If your pincode is not serviceable, you will be notified at checkout." },
  { heading: "Dispatch timeline", body: "Orders are typically dispatched within 1–2 working days of payment confirmation. During peak periods, sale events or public holidays, dispatch may take up to 3–4 working days. You will receive a dispatch confirmation with tracking details once your order is shipped." },
  { heading: "Delivery timeline", body: "Estimated delivery is 3–7 working days from dispatch, depending on your location. Metro cities typically receive orders faster than Tier 2/3 cities and rural areas. Delivery timelines are estimates and may vary due to courier delays, weather or other factors outside our control." },
  { heading: "Shipping charges", body: "Shipping is free on orders above ₹499. A flat shipping charge of ₹60 applies to orders below ₹499. Shipping charges are displayed at checkout before payment. We reserve the right to revise shipping charges with prior notice." },
  { heading: "Order tracking", body: "Once your order is dispatched, you will receive a shipping confirmation with the courier name, tracking number and a link to track your shipment. You can also track your order from the Order History section of your account." },
  { heading: "Delivery attempts", body: "Our courier partners will attempt delivery up to 3 times. If delivery is unsuccessful after 3 attempts, the order may be returned to us. In such cases, please contact us to arrange re-delivery. Additional shipping charges may apply for re-delivery." },
  { heading: "Damaged or missing items", body: "If your order arrives damaged or with missing items, contact us within 48 hours of delivery with your order ID and photographs of the packaging and product. We will investigate and resolve the issue as quickly as possible." },
  { heading: "Cash on delivery", body: "Cash on delivery (COD) is not available at this time. All orders must be paid online through Razorpay at checkout." },
];

export default async function ShippingPolicyPage() {
  const shippingPage = await getContentPageBySlug("shipping");

  console.log("Backend Shipping Page:", shippingPage);

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#FFFDF7]">
        <section className="border-b border-[#E9E3EE] bg-gradient-to-br from-[#F4EEFF] via-[#FFFDF7] to-[#FFF8EE] py-14 sm:py-18">
          <div className="container-page">
            <Reveal>
              <Link href="/policies" className="mb-6 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF] hover:text-[#2E0569] transition"><ArrowLeft size={13} /> All policies</Link>
              <h1 className="section-heading mt-2 max-w-2xl">Shipping Policy</h1>
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
                For shipping queries, contact us through the <Link href="/contact" className="underline hover:text-[#8C52FF]">Contact page</Link>. Please have your order ID ready.
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
