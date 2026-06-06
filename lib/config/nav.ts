/** Navigation structure. Single place to add/remove nav items site-wide. */

export type NavLink = { label: string; href: string };

export const primaryNav: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Mobile", href: "/mobile-detailing" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const legalNav: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
