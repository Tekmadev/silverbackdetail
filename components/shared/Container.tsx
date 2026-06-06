import { cn } from "@/lib/utils";

/** Centered content shell with consistent responsive gutters and max width. */
export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[var(--container-shell)] px-6 md:px-10 lg:px-12", className)}>
      {children}
    </Tag>
  );
}
