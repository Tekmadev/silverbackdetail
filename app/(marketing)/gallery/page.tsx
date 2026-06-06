import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { BeforeAfterSlider } from "@/components/shared/BeforeAfterSlider";
import { CallToAction } from "@/components/shared/CallToAction";
import { FadeUp, FadeUpItem } from "@/components/animations/FadeUp";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import { galleryItems } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Before and after detailing, paint correction, and ceramic coating work from Silverback Detailing in Hamilton, Ontario.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        id="gallery-breadcrumb"
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
      <PageHeader
        eyebrow="The work"
        title="Proof, panel by panel"
        description="A look at recent transformations. Drag the featured comparisons to see correction work in action."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ]}
      />

      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading eyebrow="Drag to compare" title="Before and after" />
          <FadeUp className="mt-10 grid gap-6 lg:grid-cols-2">
            <BeforeAfterSlider hue={222} label="Paint correction · gloss black" />
            <BeforeAfterSlider hue={6} label="Ceramic coating · single stage" />
          </FadeUp>
        </Container>
      </section>

      <section className="border-t border-line py-16 md:py-24">
        <Container>
          <SectionHeading eyebrow="Recent details" title="From the studio" />
          <FadeUp stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((item) => (
              <FadeUpItem key={item.title}>
                <figure className="group overflow-hidden rounded-xl border border-line bg-ink-3">
                  <div
                    className="relative aspect-square"
                    style={{
                      background: `radial-gradient(120% 110% at 30% 0%, hsl(${item.hue} 32% 26%), hsl(${item.hue} 38% 8%) 72%)`,
                    }}
                  >
                    <div aria-hidden className="grain absolute inset-0" />
                    <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(255,255,255,0.14),transparent_35%)]" />
                  </div>
                  <figcaption className="flex items-center justify-between gap-2 p-4">
                    <span className="text-sm font-medium text-bone">{item.title}</span>
                    <Badge variant="outline" className="shrink-0">
                      {item.service}
                    </Badge>
                  </figcaption>
                </figure>
              </FadeUpItem>
            ))}
          </FadeUp>
          <p className="mt-8 text-sm text-bone-muted">
            Photography placeholders shown. Drop real images into <code className="text-silver">/public/images</code> and
            swap the gallery tiles for <code className="text-silver">next/image</code> to publish your own work.
          </p>
        </Container>
      </section>

      <CallToAction />
    </>
  );
}
