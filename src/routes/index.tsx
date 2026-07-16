import { createFileRoute } from "@tanstack/react-router";
import heroDesktop from "@/assets/hero-portrait-new.png.asset.json";
import heroMobile from "@/assets/mobile-hero-portrait.png.asset.json";
import { Nav } from "@/components/home/Nav";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Hero } from "@/components/home/Hero";
import { PressLogos } from "@/components/home/PressLogos";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { WhyBlissley } from "@/components/home/WhyBlissley";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedPrograms } from "@/components/home/FeaturedPrograms";
import { SocialProof } from "@/components/home/SocialProof";
import { Numbers } from "@/components/home/Numbers";
import { Comparison } from "@/components/home/Comparison";
import { Products } from "@/components/home/Products";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Footer } from "@/components/home/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";

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
          "Weight loss, skin, sexual wellness, and longevity — physician-guided care delivered to your door.",
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

function Index() {
  return (
    <div className="min-h-screen bg-canvas">
      <SmoothScroll />
      <AnnouncementBar />
      <Nav />
      <main>
        <Hero />

        <PressLogos />
        <CategoryGrid />
        <WhyBlissley />
        <HowItWorks />
        <FeaturedPrograms />
        <SocialProof />
        <Numbers />
        <Products />
        <Comparison />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
