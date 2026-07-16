import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import heroDesktop from "@/assets/wl-hero-desktop.png.asset.json";
import heroMobile from "@/assets/wl-hero-mobile.png.asset.json";
import { Nav } from "@/components/home/Nav";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Footer } from "@/components/home/Footer";
import { WLHero } from "@/components/weight-loss/WLHero";
import { WLCalculator } from "@/components/weight-loss/WLCalculator";

const PressLogos = lazy(() =>
  import("@/components/home/PressLogos").then((m) => ({ default: m.PressLogos })),
);
const HowItWorks = lazy(() =>
  import("@/components/home/HowItWorks").then((m) => ({ default: m.HowItWorks })),
);
const WhyBlissley = lazy(() =>
  import("@/components/home/WhyBlissley").then((m) => ({ default: m.WhyBlissley })),
);
const WLPrograms = lazy(() =>
  import("@/components/weight-loss/WLPrograms").then((m) => ({ default: m.WLPrograms })),
);
const WLSocialProof = lazy(() =>
  import("@/components/weight-loss/WLSocialProof").then((m) => ({ default: m.WLSocialProof })),
);
const WLFinalCTA = lazy(() =>
  import("@/components/weight-loss/WLFinalCTA").then((m) => ({ default: m.WLFinalCTA })),
);
const WLBeforeAfter = lazy(() =>
  import("@/components/weight-loss/WLBeforeAfter").then((m) => ({ default: m.WLBeforeAfter })),
);
const DeferredEffects = lazy(() =>
  import("@/components/DeferredEffects").then((m) => ({ default: m.DeferredEffects })),
);

export const Route = createFileRoute("/weight-loss")({
  head: () => ({
    meta: [
      { title: "Weight Loss — Physician-prescribed GLP-1 | Blissley" },
      {
        name: "description",
        content:
          "Physician-prescribed semaglutide and tirzepatide. Same price at every dose. Free assessment, physician review within 24 hours, delivered to your door.",
      },
      { property: "og:title", content: "Weight Loss — Physician-prescribed GLP-1 | Blissley" },
      {
        property: "og:description",
        content:
          "Physician-prescribed semaglutide and tirzepatide. Same price at every dose. Delivered to your door.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/weight-loss" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/weight-loss" },
      { rel: "preload", as: "image", href: heroMobile.url, media: "(max-width: 767px)", fetchpriority: "high" },
      { rel: "preload", as: "image", href: heroDesktop.url, media: "(min-width: 768px)", fetchpriority: "high" },
    ],
  }),
  component: WeightLoss,
});

function Fallback({ h = 400 }: { h?: number }) {
  return <div style={{ minHeight: h }} aria-hidden />;
}

function WeightLoss() {
  return (
    <div className="min-h-screen bg-canvas">
      <AnnouncementBar />
      <Nav />
      <main>
        <WLHero />
        <Suspense fallback={<Fallback h={120} />}><PressLogos /></Suspense>
        <WLCalculator />
        <Suspense fallback={<Fallback />}><HowItWorks /></Suspense>
        <Suspense fallback={<Fallback />}><WLPrograms /></Suspense>
        <Suspense fallback={<Fallback />}><WhyBlissley /></Suspense>
        <Suspense fallback={<Fallback />}><WLSocialProof /></Suspense>
        <Suspense fallback={<Fallback />}><WLFinalCTA /></Suspense>
      </main>
      <Footer />
      <Suspense fallback={null}><DeferredEffects /></Suspense>
    </div>
  );
}
