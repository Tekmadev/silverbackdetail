import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { cn } from "@/lib/utils";

/**
 * Standard top-of-page header for inner pages. Includes the top padding needed
 * to clear the fixed site header, optional breadcrumbs, and a decorative glow.
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
        {breadcrumbs && (
          <div className="mb-7">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-bone sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-muted">{description}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
