import { LineReveal } from "@/components/animations/LineReveal";

/**
 * Standard section heading. Delegates its markup to LineReveal so every section
 * title across the site shares the same line-by-line reveal cadence. Stays a
 * server component; LineReveal is the client boundary.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as = "h2",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <LineReveal
      eyebrow={eyebrow}
      title={title}
      description={description}
      align={align}
      as={as}
      className={className}
    />
  );
}
