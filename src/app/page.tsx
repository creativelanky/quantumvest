import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Features } from "@/components/sections/Features";
import { DashboardPreview } from "@/components/sections/DashboardPreview";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { InvestmentPlans } from "@/components/sections/InvestmentPlans";
import { Testimonials } from "@/components/sections/Testimonials";
import { Security } from "@/components/sections/Security";
import { BTCSection } from "@/components/sections/BTCSection";
import { FeatureImages } from "@/components/sections/FeatureImages";
import { MarketAnalysis } from "@/components/sections/MarketAnalysis";
import { UpToTheMinute } from "@/components/sections/UpToTheMinute";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { LiveTradeFeed } from "@/components/ui/LiveTradeFeed";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <BTCSection />
        <Features />
        <FeatureImages />
        <MarketAnalysis />
        <DashboardPreview />
        <HowItWorks />
        <InvestmentPlans />
        <Testimonials />
        <Security />
        <UpToTheMinute />
        <FinalCTA />
      </main>
      <Footer />
      <LiveTradeFeed />
    </>
  );
}
