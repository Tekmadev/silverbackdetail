import type { Metadata } from "next";
import { ShieldCheck, Award, Target } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CallToAction } from "@/components/shared/CallToAction";
import { FadeUp } from "@/components/animations/FadeUp";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import { businessConfig } from "@/lib/config/business";

export const metadata: Metadata = {
  title: "About",
  description:
    "Silverback Detailing is a premium, certified detailing studio in Hamilton, Ontario. Meet the craftsmanship, philosophy, and credentials behind the finish.",
  alternates: { canonical: "/about" },
};

const values = [
  { icon: Target, title: "Precision over speed", text: "We measure, mask, and refine. A finish is only finished when it holds up under scrutiny." },
  { icon: ShieldCheck, title: "Protection that lasts", text: "We use coatings and sealants rated in years, and we tell you exactly how to keep them." },
  { icon: Award, title: "Certified standards", text: `${businessConfig.trust.certifications.join(" and ")}, trained to manufacturer specifications.` },
];

export default function AboutPage() {
  const { foundedYear, address, trust } = businessConfig;
  return (
    <>
      <JsonLd
        id="about-breadcrumb"
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHeader
        eyebrow="Our story"
        title="Built on the details others overlook"
        description={`Founded in ${foundedYear} in ${address.city}, Silverback Detailing exists to do detailing properly: methodically, transparently, and to a showroom standard.`}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="prose-sb">
              <p>
                Silverback Detailing started with a simple frustration: most detailing looks great for a weekend and
                then fades. We wanted to build results that last, using real correction work and proper protection
                instead of quick fixes that hide problems for a day.
              </p>
              <p>
                Every vehicle gets the same disciplined process. We inspect under controlled lighting, decontaminate,
                correct, and protect. We measure paint depth before we touch a polisher, and we explain what we are
                doing and why at every step.
              </p>
              <p>
                The name says it. A silverback leads with strength and patience, and protects what matters. That is how
                we treat every car that comes through the studio, whether it is a daily driver or a weekend showpiece.
              </p>
            </div>

            {/* Founder card (E-E-A-T) */}
            <FadeUp>
              <div className="rounded-xl border border-line bg-ink-3 p-7">
                <div className="flex items-center gap-4">
                  <span className="flex size-16 items-center justify-center rounded-full border border-line-strong bg-ink font-display text-2xl font-semibold text-silver">
                    SB
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-bone">The Silverback team</p>
                    <p className="text-sm text-bone-muted">Lead detailers · {address.city}, {address.provinceCode}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-bone-muted">
                  Our detailers are {trust.certifications.join(" and ")}, with hands-on training in machine polishing
                  and professional ceramic coating application. We treat every booking as a craft project, not a
                  conveyor belt.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {trust.certifications.map((c) => (
                    <li key={c} className="rounded-full border border-line bg-ink px-3 py-1 text-xs text-silver">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </Container>
      </section>

      <StatsCounter />

      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="What we stand for" title="The principles behind every detail" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="flex flex-col gap-4 rounded-xl border border-line bg-ink-3 p-7">
                <span className="flex size-11 items-center justify-center rounded-lg border border-line bg-ink text-silver">
                  <v.icon className="size-5" />
                </span>
                <h3 className="font-display text-lg font-semibold text-bone">{v.title}</h3>
                <p className="text-sm leading-relaxed text-bone-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <ProcessSection />
      <CallToAction />
    </>
  );
}
