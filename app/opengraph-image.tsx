import { ImageResponse } from "next/og";
import { businessConfig } from "@/lib/config/business";

export const alt = `${businessConfig.name} — ${businessConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { name, tagline, address, trust } = businessConfig;
  const locationLine = `Premium car detailing · ${address.city}, ${address.provinceCode}`;
  const ratingLine = `${trust.googleRating.toFixed(1)} rating · ${trust.reviewCount}+ reviews`;
  const servicesLine = "Paint correction · Ceramic coating · Mobile";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "radial-gradient(120% 120% at 50% 0%, #1d1f24 0%, #0a0a0b 55%, #000 100%)",
          color: "#f4f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              border: "2px solid #c7cad1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
              color: "#c7cad1",
            }}
          >
            S
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>{name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", width: 90, height: 6, background: "#d11a2a", borderRadius: 999 }} />
          <div style={{ display: "flex", fontSize: 78, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
            {tagline}
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#9a9da6" }}>{locationLine}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 26, color: "#c7cad1" }}>
          <div style={{ display: "flex" }}>{ratingLine}</div>
          <div style={{ display: "flex", color: "#33333a" }}>/</div>
          <div style={{ display: "flex" }}>{servicesLine}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
