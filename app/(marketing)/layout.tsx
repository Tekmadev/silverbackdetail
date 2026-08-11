import { SmoothScrollProvider } from "@/app/providers/SmoothScrollProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/shared/FloatingContact";
import { PromoBanner } from "@/components/promo/PromoBanner";
import { ScrollProgressThread } from "@/components/animations/ScrollProgressThread";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <ScrollProgressThread />
      <div className="flex min-h-dvh flex-col">
        <Header />
        <PromoBanner />
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
      </div>
      <FloatingContact />
    </SmoothScrollProvider>
  );
}
