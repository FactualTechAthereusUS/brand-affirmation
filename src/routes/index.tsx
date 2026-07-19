import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import heroDesktop from "@/assets/hero-portrait-new.png.asset.json";
import heroMobile from "@/assets/mobile-hero-portrait.png.asset.json";
import { Nav } from "@/components/home/Nav";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Hero } from "@/components/home/Hero";
import { Footer } from "@/components/home/Footer";

// Above-the-fold stays eager. Everything below is lazy-loaded so the initial
// bundle is smaller and TTI/LCP improve.
const PressLogos = lazy(() => import("@/components/home/PressLogos").then(m => ({ default: m.PressLogos })));
const CategoryGrid = lazy(() => import("@/components/home/CategoryGrid").then(m => ({ default: m.CategoryGrid })));
const WhyBlissley = lazy(() => import("@/components/home/WhyBlissley").then(m => ({ default: m.WhyBlissley })));
const HowItWorks = lazy(() => import("@/components/home/HowItWorks").then(m => ({ default: m.HowItWorks })));
const FeaturedPrograms = lazy(() => import("@/components/home/FeaturedPrograms").then(m => ({ default: m.FeaturedPrograms })));
const SocialProof = lazy(() => import("@/components/home/SocialProof").then(m => ({ default: m.SocialProof })));
const Numbers = lazy(() => import("@/components/home/Numbers").then(m => ({ default: m.Numbers })));
const Products = lazy(() => import("@/components/home/Products").then(m => ({ default: m.Products })));
const Comparison = lazy(() => import("@/components/home/Comparison").then(m => ({ default: m.Comparison })));
const FAQ = lazy(() => import("@/components/home/FAQ").then(m => ({ default: m.FAQ })));
const FinalCTA = lazy(() => import("@/components/home/FinalCTA").then(m => ({ default: m.FinalCTA })));
const DeferredEffects = lazy(() => import("@/components/DeferredEffects").then(m => ({ default: m.DeferredEffects })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blissley — Personalized medicine, designed around you." },
      {
        name: "description",
        content:
          "Weight loss, skin, sexual wellness, and longevity — physician-guided care delivered to your door. Same price at every dose. Now in all 50 states.",
      },
      { property: "og:title", content: "Blissley — Personalized medicine, designed around you." },
      {
        property: "og:description",
        content:
          "Weight loss, skin, sexual wellness, and longevity — physician-guided care delivered to your door. Same price at every dose. Now in all 50 states.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroMobile.url, media: "(max-width: 767px)", fetchpriority: "high" },
      { rel: "preload", as: "image", href: heroDesktop.url, media: "(min-width: 768px)", fetchpriority: "high" },
    ],
  }),
  component: Index,
});

function Fallback({ h = 400 }: { h?: number }) {
  return <div style={{ minHeight: h }} aria-hidden />;
}

function Index() {
  return (
    <div className="min-h-screen bg-canvas">
      <AnnouncementBar />
      <Nav />
      <main>
        <Hero />
        <Suspense fallback={<Fallback h={120} />}><PressLogos /></Suspense>
        <Suspense fallback={<Fallback />}><CategoryGrid /></Suspense>
        <Suspense fallback={<Fallback />}><WhyBlissley /></Suspense>
        <Suspense fallback={<Fallback />}><HowItWorks /></Suspense>
        <Suspense fallback={<Fallback />}><FeaturedPrograms /></Suspense>
        <Suspense fallback={<Fallback />}><SocialProof /></Suspense>
        <Suspense fallback={<Fallback h={200} />}><Numbers /></Suspense>
        <Suspense fallback={<Fallback />}><Products /></Suspense>
        <Suspense fallback={<Fallback />}><Comparison /></Suspense>
        <Suspense fallback={<Fallback />}><FAQ /></Suspense>
        <Suspense fallback={<Fallback />}><FinalCTA /></Suspense>
      </main>
      <Footer />
      <Suspense fallback={null}><DeferredEffects /></Suspense>
    </div>
  );
}
