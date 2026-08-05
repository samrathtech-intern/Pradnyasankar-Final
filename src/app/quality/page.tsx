import type { Metadata } from "next";
import { ArrowRight, Award, CheckCircle2, ClipboardList, FlaskConical, Leaf, ShieldCheck } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Quality & Standards | Pradnyasanskar",
  description: "Learn about Pradnyasanskar's quality approach — formulation standards, manufacturing practices, certifications and responsible product information.",
};

const PILLARS = [
  { icon: FlaskConical, title: "Approved formulations", copy: "Every product is formulated using approved ingredients, quantities and processes. Composition is published on the product page and label — not hidden behind marketing language." },
  { icon: ClipboardList, title: "Responsible content", copy: "Product benefits, directions and warnings are company-approved before publication. We do not auto-generate or exaggerate claims. Regulatory declarations are included where required." },
  { icon: ShieldCheck, title: "Licence & registration", copy: "Applicable Ayurvedic licences and nutraceutical registrations are maintained and referenced on product pages. Only current, verifiable information is displayed." },
  { icon: Award, title: "Manufacturing standards", copy: "Products are manufactured under controlled conditions with quality checks at each stage. Manufacturer and marketer details are disclosed on every product." },
  { icon: Leaf, title: "Ingredient transparency", copy: "Composition, ingredient identity and quantity are presented in clear, approved terminology. Customers can read exactly what is in each product before purchasing." },
  { icon: CheckCircle2, title: "Continuous review", copy: "Product content, policy pages and regulatory information are reviewed before launch and updated when required. Unpublished products retain historical order and invoice data." },
];

const STANDARDS = [
  { label: "Product classification", value: "Each product is classified as Ayurvedic, nutraceutical or external wellness — never mixed or misrepresented." },
  { label: "Composition disclosure", value: "Full ingredient list with quantities published on product pages and labels as approved by the company." },
  { label: "Approved claims only", value: "No disease-treatment implications, no diagnostic recommendations, no auto-generated benefit statements." },
  { label: "Mandatory declarations", value: "Veg/non-veg markers, allergen information, storage conditions and applicable regulatory declarations included." },
  { label: "Manufacturer details", value: "Legal entity name, address, licence number and customer-care information published on every product." },
  { label: "Content governance", value: "All product content is approved by Pradnyasanskar representatives before publication. No third-party content rewriting." },
];

export default function QualityPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-[#FFFDF7]">
        {/* Hero */}
        <section className="border-b border-[#E9E3EE] bg-gradient-to-br from-[#F4EEFF] via-[#FFFDF7] to-[#FFF8EE] py-16 sm:py-24">
          <div className="container-page">
            <Reveal>
              <span className="eyebrow"><ShieldCheck size={13} /> Quality & standards</span>
              <h1 className="section-heading mt-5 max-w-3xl">
                Quality you can read, verify and trust.
              </h1>
              <p className="mt-6 max-w-2xl text-[15px] leading-[1.9] text-[#716A78]">
                At Pradnyasanskar, quality is not a marketing claim — it is a set of practices, disclosures and standards that are visible on every product page, every label and every policy document we publish.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Pillars */}
        <section className="container-page py-16 sm:py-20">
          <Reveal>
            <span className="eyebrow">Our quality pillars</span>
            <h2 className="section-heading mt-5 max-w-2xl">Six commitments behind every product.</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, copy }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-[24px] border border-[#E9E3EE] bg-white p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[#F2EBFF] text-[#8C52FF]">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 text-[17px] font-extrabold leading-tight tracking-[-.03em] text-[#2E0569]">{title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#716A78]">{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Standards table */}
        <section className="bg-gradient-to-br from-[#F4EEFF] to-[#FFFDF7] py-16 sm:py-20">
          <div className="container-page">
            <Reveal>
              <span className="eyebrow">What this means in practice</span>
              <h2 className="section-heading mt-5 max-w-2xl">Our product content standards.</h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#716A78]">
                These standards apply to every product published on the Pradnyasanskar website.
              </p>
            </Reveal>
            <div className="mt-10 overflow-hidden rounded-[28px] border border-[#E9E3EE] bg-white">
              {STANDARDS.map(({ label, value }, i) => (
                <Reveal key={label} delay={i * 0.05}>
                  <div className={`grid gap-4 px-7 py-5 sm:grid-cols-[220px_1fr] ${i < STANDARDS.length - 1 ? "border-b border-[#E9E3EE]" : ""}`}>
                    <p className="text-[12px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">{label}</p>
                    <p className="text-[14px] leading-relaxed text-[#2E0569]">{value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="container-page py-16">
          <Reveal>
            <div className="rounded-[28px] border border-[#E9E3EE] bg-white p-8 sm:p-10">
              <h2 className="text-[22px] font-extrabold tracking-[-.04em] text-[#2E0569]">Important notice</h2>
              <div className="mt-5 space-y-4 text-[14px] leading-relaxed text-[#716A78]">
                <p>Product information on this website is provided for general education and discovery purposes only. It does not constitute medical advice, diagnosis, prescription or personalised treatment recommendations.</p>
                <p>Refer to the individual product label for complete and current composition, directions, warnings, storage conditions and regulatory declarations.</p>
                <p>Consult a qualified healthcare professional before using any product if you are pregnant, lactating, on medication or have a medical condition.</p>
                <p>Licences, certifications and regulatory details are updated before launch and reviewed periodically. Contact us if you have a specific query about a product's regulatory status.</p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="/shop" className="btn-primary">View all products <ArrowRight size={15} /></a>
                <a href="/contact" className="btn-secondary">Contact us</a>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </PageLayout>
  );
}
