import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { InstagramIcon, FacebookIcon } from "@/components/shared/SocialIcons";
import { businessConfig } from "@/lib/config/business";
import { legalNav } from "@/lib/config/nav";
import {
  formatEmailForLink,
  formatPhoneForLink,
  getOpenStatus,
} from "@/lib/config/site";

export function Footer() {
  const { contact, address, social, services, serviceAreas, name, tagline } = businessConfig;
  const year = new Date().getFullYear();
  const status = getOpenStatus();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-line bg-ink-2">
      <div aria-hidden className="grain absolute inset-0" />
      <Container className="relative z-10 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-5">
            <Logo size={32} />
            <p className="max-w-xs text-sm leading-relaxed text-bone-muted">{businessConfig.longDescription}</p>
            <div className="flex items-center gap-3 pt-1">
              <Link
                href={social.instagram.url}
                aria-label="Instagram"
                className="rounded-md p-1.5 text-bone-muted transition-colors hover:text-bone"
              >
                <InstagramIcon className="size-5" />
              </Link>
              <Link
                href={social.facebook.url}
                aria-label="Facebook"
                className="rounded-md p-1.5 text-bone-muted transition-colors hover:text-bone"
              >
                <FacebookIcon className="size-5" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Services" className="space-y-4">
            <h2 className="eyebrow">Services</h2>
            <ul className="space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-bone-muted transition-colors hover:text-bone"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Service areas */}
          <nav aria-label="Service areas" className="space-y-4">
            <h2 className="eyebrow">Service areas</h2>
            <ul className="space-y-2.5 text-sm">
              {serviceAreas.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/service-areas/${a.slug}`}
                    className="text-bone-muted transition-colors hover:text-bone"
                  >
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="space-y-4">
            <h2 className="eyebrow">Contact</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={formatPhoneForLink()}
                  className="flex items-start gap-2.5 text-bone-muted transition-colors hover:text-bone"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-silver" />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={formatEmailForLink(contact.email)}
                  className="flex items-start gap-2.5 text-bone-muted transition-colors hover:text-bone"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-silver" />
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-bone-muted">
                <MapPin className="mt-0.5 size-4 shrink-0 text-silver" />
                <span>
                  {address.street}
                  <br />
                  {address.city}, {address.provinceCode} {address.postalCode}
                </span>
              </li>
            </ul>
            <p className="text-sm">
              <span className={status.open ? "text-success" : "text-bone-muted"}>●</span>{" "}
              <span className="text-bone-muted">{status.label}</span>
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-7 text-sm text-bone-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {businessConfig.legalName}. {tagline}
          </p>
          <nav aria-label="Legal" className="flex items-center gap-5">
            {legalNav.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-bone">
                {link.label}
              </Link>
            ))}
            <span className="hidden sm:inline">·</span>
            <span className="text-bone-muted/70">{name}</span>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
