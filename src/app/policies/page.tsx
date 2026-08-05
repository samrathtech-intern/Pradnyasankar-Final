import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, UserCheck } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Policies | Pradnyasanskar",
  description: "Read Pradnyasanskar's privacy policy, shipping policy, returns & refunds policy and terms of use.",
};

const POLICIES = [
  { href: "/policies/privacy", title: "Privacy Policy", desc: "How we collect, use and protect your personal information." },
  { href: "/policies/shipping", title: "Shipping Policy", desc: "Delivery timelines, shipping charges, serviceable areas and dispatch information." },
  { href: "/policies/returns", title: "Returns & Refunds", desc: "Eligibility, process and timelines for returns, cancellations and refunds." },
  { href: "/policies/terms", title: "Terms of Use", desc: "The terms and conditions governing use of the Pradnyasanskar website and services." },
];

export default function PoliciesPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-[#FFFDF7]">
        <section className="border-b border-[#E9E3EE] bg-gradient-to-br from-[#F4EEFF] via-[#FFFDF7] to-[#FFF8EE] py-16 sm:py-20">
          <div className="container-page">
            <Reveal>
              <span className="eyebrow"><FileText size={13} /> Legal & policies</span>
              <h1 className="section-heading mt-5 max-w-2xl">Our policies, clearly stated.</h1>
              <p className="mt-5 max-w-xl text-[15px] leading-[1.85] text-[#716A78]">Everything you need to know about how we handle your data, orders, shipping and returns.</p>
            </Reveal>
          </div>
        </section>
        <section className="container-page py-14">
          <div className="grid gap-5 sm:grid-cols-2">
            {POLICIES.map(({ href, title, desc }, i) => (
              <Reveal key={href} delay={i * 0.06}>
                <Link href={href} className="group flex items-start justify-between gap-4 rounded-[24px] border border-[#E9E3EE] bg-white p-7 transition hover:-translate-y-1 hover:border-[#CDBAF1] hover:shadow-[0_20px_50px_rgba(46,5,105,.08)]">
                  <div>
                    <h2 className="text-[18px] font-extrabold text-[#2E0569] group-hover:text-[#8C52FF] transition">{title}</h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#716A78]">{desc}</p>
                  </div>
                  <ArrowRight size={18} className="mt-1 shrink-0 text-[#8C52FF] transition group-hover:translate-x-1" />
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-8 rounded-[24px] border border-[#E9E3EE] bg-[#FAF7FF] p-7">
              <div className="flex items-center gap-3">
                <UserCheck size={18} className="shrink-0 text-[#8C52FF]" />
                <h2 className="text-[18px] font-extrabold text-[#2E0569]">Grievance Officer</h2>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[#716A78]">
                In accordance with the Consumer Protection (E-Commerce) Rules 2020 and the Information Technology Act 2000, a Grievance Officer has been designated to address consumer complaints and data-related concerns.
              </p>
              <div className="mt-4 grid gap-1 text-[13px] text-[#2E0569]">
                <p><span className="font-extrabold">Name:</span> [To be updated before launch]</p>
                <p><span className="font-extrabold">Email:</span> grievance@pradnyasanskar.com</p>
                <p><span className="font-extrabold">Organisation:</span> Pradnyasanskar Enterprises Pvt. Ltd., India</p>
                <p><span className="font-extrabold">Hours:</span> Monday – Friday, 10:00 AM – 6:00 PM IST</p>
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-[#8B8292]">Complaints will be acknowledged within 48 hours and resolved within 30 days of receipt.</p>
            </div>
          </Reveal>
        </section>
      </div>
    </PageLayout>
  );
}
