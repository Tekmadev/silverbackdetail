import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FadeUp, FadeUpItem } from "@/components/animations/FadeUp";
import { processSteps } from "@/lib/data/content";

export function ProcessSection() {
  return (
    <section id="process" className="relative py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="The process"
          title="Four stages, zero shortcuts"
          description="A repeatable, transparent method we follow on every vehicle that comes through the studio."
        />

        <FadeUp stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <FadeUpItem key={step.step}>
              <div className="relative flex h-full flex-col gap-3 rounded-xl border border-line bg-ink-3 p-7">
                <span className="font-display text-5xl font-semibold text-line-strong">{step.step}</span>
                <h3 className="font-display text-xl font-semibold text-bone">{step.title}</h3>
                <p className="text-sm leading-relaxed text-bone-muted">{step.description}</p>
              </div>
            </FadeUpItem>
          ))}
        </FadeUp>
      </Container>
    </section>
  );
}
