"use client";

import { Navbar } from "@/components/ui/nav-header";
import { PrismaHero } from "@/components/ui/prisma-hero";
import { PerspectiveMarquee } from "@/components/ui/remocn-perspective-marquee";
import { SquishyPricing } from "@/components/ui/squishy-pricing";
import { GlobePolaroids } from "@/components/ui/cobe-globe-polaroids";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Footer } from "@/components/ui/footer";

const words = ["Win", "Conquer", "Lead", "Train", "Dominate", "Strategize", "Checkmate", "Improve"];

export default function Home() {
  return (
    <main className="min-h-screen bg-black w-full overflow-hidden flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <PrismaHero />

      {/* Marquee Section */}
      <section id="features" className="w-full bg-black py-20 flex flex-col items-center justify-center border-t border-white/10 relative z-10 scroll-mt-24">
        <div className="mb-10 text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">The Mindset of a Champion</h2>
          <p className="text-gray-400">Everything you need to outsmart your opponent.</p>
        </div>
        <div className="w-full h-[400px] relative overflow-hidden bg-black">
          <PerspectiveMarquee items={words} speed={30} />
        </div>
      </section>

      {/* Pricing Section */}
      <div id="pricing" className="scroll-mt-24">
        <SquishyPricing />
      </div>

      {/* Community / Globe Section */}
      <section id="community" className="w-full bg-black py-24 border-t border-white/10 overflow-hidden relative z-10 scroll-mt-24">
        <div className="container max-w-6xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-center gap-12 md:gap-20">
          <div className="lg:w-1/2 text-left z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              A Global <br/><span className="text-gray-500">Community</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
              Players and coaches from all over the world. The best community of passionate chess enthusiasts ready to learn, compete, and grow together.
            </p>
            <button className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl">
              Join the Network
            </button>
          </div>
          <div className="lg:w-1/2 w-full max-w-lg aspect-square">
             <GlobePolaroids />
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <BackgroundPaths />
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
