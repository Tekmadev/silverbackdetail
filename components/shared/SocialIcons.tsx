/**
 * Inline brand glyphs. lucide-react removed trademarked brand logos, so social
 * marks are provided here as simple, consistent SVGs.
 */
type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M14 8.5V7c0-.8.2-1.5 1.5-1.5H17V3h-2.5C11.7 3 11 4.7 11 6.6V8.5H9V11h2v9h3v-9h2.2l.3-2.5H14Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M16 3c.3 2 1.6 3.5 3.5 3.8v2.6c-1.3 0-2.5-.4-3.5-1v5.3a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v2.7a2.7 2.7 0 1 0 1.9 2.6V3H16Z"
        fill="currentColor"
      />
    </svg>
  );
}
