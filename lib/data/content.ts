/**
 * Marketing content collections. Business facts live in `business.ts`; this file
 * holds editorial content (testimonials, FAQs, gallery, process, differentiators)
 * so it can be edited without touching layout code.
 */

import { businessConfig } from "@/lib/config/business";

export type Testimonial = {
  name: string;
  location: string;
  vehicle: string;
  service: string;
  rating: number;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Marcus Bell",
    location: "Ancaster, ON",
    vehicle: "BMW M4 Competition",
    service: "Ceramic Coating",
    rating: 5,
    quote:
      "The depth of the finish is unreal. Water beads and rolls straight off, and after six months it still looks like the day I picked it up. Worth every dollar.",
  },
  {
    name: "Priya Sharma",
    location: "Burlington, ON",
    vehicle: "Audi Q5",
    service: "Interior Detail",
    rating: 5,
    quote:
      "Two kids and a dog had destroyed our interior. They brought it back to better than new. It honestly smelled like a brand new car when I got in.",
  },
  {
    name: "Dave Thompson",
    location: "Hamilton, ON",
    vehicle: "Ford F-150",
    service: "Paint Correction",
    rating: 5,
    quote:
      "Years of swirl marks gone in a single visit. The before and after under their lights was night and day. These guys are genuine craftsmen.",
  },
  {
    name: "Elena Rossi",
    location: "Stoney Creek, ON",
    vehicle: "Tesla Model 3",
    service: "Mobile Detailing",
    rating: 5,
    quote:
      "They came to my driveway and I never had to leave the house. Professional, on time, and the car looked showroom ready when they left.",
  },
  {
    name: "Jordan Lee",
    location: "Dundas, ON",
    vehicle: "Porsche 911",
    service: "Ceramic Coating",
    rating: 5,
    quote:
      "I am extremely particular about my car and they exceeded my expectations. The attention to the smallest details is what sets Silverback apart.",
  },
  {
    name: "Aisha Khan",
    location: "Waterdown, ON",
    vehicle: "Honda CR-V",
    service: "Exterior Detail",
    rating: 5,
    quote:
      "Booked online in two minutes, dropped it off, and picked up a car that looked five years younger. I will not take my vehicle anywhere else.",
  },
];

export type WhyUsPoint = {
  title: string;
  description: string;
  icon: "shield" | "sparkles" | "award" | "clock" | "mapPin" | "gauge";
};

export const whyUs: WhyUsPoint[] = [
  {
    title: "Certified craftsmanship",
    description: `${businessConfig.trust.certifications.join(" and ")}. Trained to manufacturer standards on every coating we apply.`,
    icon: "award",
  },
  {
    title: "Showroom-grade results",
    description:
      "Controlled lighting, measured paint depth, and a refined process that catches what others miss.",
    icon: "sparkles",
  },
  {
    title: "Protection that lasts",
    description:
      "Coatings rated for years, not weeks. Hydrophobic, UV stable, and backed by clear aftercare.",
    icon: "shield",
  },
  {
    title: "On time, every time",
    description:
      "Transparent scheduling and honest timelines. Your vehicle is ready when we say it will be.",
    icon: "clock",
  },
  {
    title: "In-shop or mobile",
    description:
      "Bring it to the studio or let our self-contained mobile unit come to your driveway.",
    icon: "mapPin",
  },
  {
    title: "Obsessive attention",
    description:
      "We work where others stop looking. Every panel, seam, and surface gets the same care.",
    icon: "gauge",
  },
];

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Inspect",
    description:
      "We assess your paint, interior, and problem areas under proper lighting and record paint depth where correction is involved.",
  },
  {
    step: "02",
    title: "Prep",
    description:
      "Decontamination, careful masking, and surface preparation. The unglamorous work that makes the finish last.",
  },
  {
    step: "03",
    title: "Refine",
    description:
      "Multi-stage polishing, deep cleaning, and conditioning. This is where the transformation happens.",
  },
  {
    step: "04",
    title: "Protect",
    description:
      "Sealants and ceramic coatings applied and cured, then a final inspection before your keys come back.",
  },
];

export type GalleryItem = {
  title: string;
  service: string;
  // Hue is used to render a tasteful CSS gradient placeholder until real photography
  // is dropped into /public/images. Replace `image` with a path to enable next/image.
  hue: number;
  image?: string;
};

export const galleryItems: GalleryItem[] = [
  { title: "Swirl removal, single stage", service: "Paint Correction", hue: 220 },
  { title: "9 year ceramic, gloss black", service: "Ceramic Coating", hue: 0 },
  { title: "Full interior revival", service: "Interior Detail", hue: 30 },
  { title: "Oxidation reversal", service: "Paint Correction", hue: 280 },
  { title: "Hydrophobic coating", service: "Ceramic Coating", hue: 200 },
  { title: "Leather restoration", service: "Interior Detail", hue: 40 },
  { title: "Showroom exterior", service: "Exterior Detail", hue: 240 },
  { title: "Driveway mobile detail", service: "Mobile Detailing", hue: 160 },
];

export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "How much does ceramic coating cost in Hamilton?",
    answer:
      "Ceramic coating at Silverback Detailing starts at $1,200 CAD and includes full paint correction prep. The final price depends on vehicle size, paint condition, and whether you choose a 2, 5, or 9 year package.",
  },
  {
    question: "How does paint correction work?",
    answer:
      "Paint correction is a multi-stage machine polishing process that removes swirl marks, light scratches, oxidation, and water spots. We measure paint depth first, then refine the clear coat in stages to restore a true mirror gloss. It starts at $800 CAD and typically takes one to two days.",
  },
  {
    question: "Do you offer mobile detailing?",
    answer:
      "Yes. Our self-contained mobile unit carries its own water and power, so we can detail your vehicle at your home or workplace anywhere in Hamilton, Burlington, Ancaster, Stoney Creek, Dundas, and Waterdown. Mobile detailing starts at $200 CAD.",
  },
  {
    question: "Is my deposit refundable?",
    answer:
      "Deposits for paint correction and ceramic coating are fully refundable up to 48 hours before your scheduled service. The deposit is credited toward your final invoice on the day of service.",
  },
  {
    question: "How long does a ceramic coating last?",
    answer:
      "Depending on the package you choose, our ceramic coatings are rated to last 2, 5, or 9 years. Longevity also depends on maintenance, and we provide an aftercare kit and guidance with every coating.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve Hamilton and the surrounding region, including Burlington, Ancaster, Stoney Creek, Dundas, and Waterdown. In-shop service is available at our Hamilton studio, and mobile service is available across the full coverage area.",
  },
  {
    question: "How do I prepare my car for a detail?",
    answer:
      "Just remove personal belongings and child seats if you would like those areas cleaned. For mobile appointments, please provide a parking spot with a little room to work around the vehicle. We handle everything else.",
  },
  {
    question: "Do you guarantee your work?",
    answer:
      "Yes. Every service is backed by a satisfaction guarantee, and our coatings come with clear, written longevity expectations. If something is not right, we make it right.",
  },
];
