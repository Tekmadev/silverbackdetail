import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CallToAction } from "@/components/shared/CallToAction";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getFaqSchema } from "@/lib/seo/schema";
import { faqs } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about car detailing, paint correction, ceramic coating, pricing, deposits, and mobile service in Hamilton, Ontario.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd id="faq-schema" data={getFaqSchema(faqs)} />
      <JsonLd
        id="faq-breadcrumb"
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <PageHeader
        eyebrow="Answers"
        title="Frequently asked questions"
        description="Everything you might want to know before booking. Still unsure? Get in touch and we will help."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
      />

      <section className="py-16 md:py-20">
        <Container className="max-w-3xl">
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={f.question} value={`faq-${i}`}>
                <AccordionTrigger>{f.question}</AccordionTrigger>
                <AccordionContent>{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </section>

      <CallToAction
        eyebrow="Still have questions?"
        title="We are happy to help"
        description="Reach out and we will walk you through the right service for your vehicle."
      />
    </>
  );
}
