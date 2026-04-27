import { Navbar } from "@/components/ui/nav-header";
import { Footer } from "@/components/ui/footer";
import { Shield, Users, Globe2, Trophy } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container max-w-4xl mx-auto px-6">
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              About <span className="text-gray-500">Us</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              ChessMastery is a next-generation chess platform built for players who are serious about improving their game.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { label: "Players", value: "10K+", icon: Users },
              { label: "Countries", value: "50+", icon: Globe2 },
              { label: "Tournaments", value: "200+", icon: Trophy },
              { label: "Lessons", value: "500+", icon: Shield },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-zinc-900 rounded-2xl p-6 text-center border border-zinc-800">
                <Icon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <div className="text-3xl font-black text-white mb-1">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="bg-zinc-900 rounded-2xl p-10 border border-zinc-800 mb-10">
            <h2 className="text-3xl font-black mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              We believe chess is more than a game — it&apos;s a tool for developing strategic thinking, patience, and creativity. Our mission is to make high-quality chess training accessible to everyone, from beginners to grandmasters.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-10 border border-zinc-800">
            <h2 className="text-3xl font-black mb-4">Our Story</h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              Founded by passionate chess enthusiasts and software engineers, ChessMastery was born out of frustration with existing chess platforms. We set out to build something modern, fast, and beautiful — a platform that truly respects the player&apos;s time and intelligence.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
