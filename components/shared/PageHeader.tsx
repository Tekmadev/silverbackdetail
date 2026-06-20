import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { LineReveal } from "@/components/animations/LineReveal";
import { cn } from "@/lib/utils";

const PAGE_TITLE =
  "max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-bone sm:text-5xl md:text-6xl";

/**
 * Standard top-of-page header for inner pages. Includes the top padding needed
 * to clear the fixed site header, optional breadcrumbs, and a decorative glow.
 * The heading content uses the shared LineReveal cadence (breadcrumbs and any
 * children animate in on the same timeline).
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: { name: string; path: string }[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-line pt-32 pb-16 md:pt-40 md:pb-20", className)}>
      <div aria-hidden className="grain absolute inset-0" />
      <div
        aria-hidden
        className="absolute right-[-10%] top-[-20%] -z-0 size-[40vw] rounded-full bg-silver/5 blur-[120px]"
      />
      <Container className="relative z-10">
        <LineReveal
          as="h1"
          eyebrow={eyebrow}
          title={title}
          description={description}
          titleClassName={PAGE_TITLE}
          before={breadcrumbs && (
            <div className="pb-3">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}
          after={children && <div className="pt-4">{children}</div>}
        />
      </Container>
    </section>
  );
}
