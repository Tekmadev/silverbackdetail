import { WhatsAppIcon, InstagramIcon } from "@/components/shared/SocialIcons";
import { getWhatsAppLink, getInstagramDmLink } from "@/lib/config/site";

/**
 * Site-wide floating message buttons. The core of the ad funnel: a persistent,
 * one-tap path into a WhatsApp or Instagram DM from any marketing page. Sits
 * below the header (z-50) and under the mobile-nav overlay so it never blocks
 * navigation.
 */
export function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3 sm:bottom-6 sm:right-6">
      <a
        href={getInstagramDmLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message us on Instagram"
        className="flex size-12 items-center justify-center rounded-full border border-line-strong bg-ink-2/90 text-bone shadow-lg backdrop-blur transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <InstagramIcon className="size-6" />
      </a>
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message us on WhatsApp"
        className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <WhatsAppIcon className="size-7" />
      </a>
    </div>
  );
}
