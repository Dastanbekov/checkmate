import { Navbar } from "@/components/ui/nav-header";
import { Footer } from "@/components/ui/footer";
import { Code2, Paintbrush, Server, BarChart3 } from "lucide-react";

const roles = [
  {
    title: "Full-Stack Engineer",
    team: "Engineering",
    type: "Full-time · Remote",
    icon: Code2,
  },
  {
    title: "UI/UX Designer",
    team: "Design",
    type: "Full-time · Hybrid",
    icon: Paintbrush,
  },
  {
    title: "Backend Engineer",
    team: "Engineering",
    type: "Full-time · Remote",
    icon: Server,
  },
  {
    title: "Growth Analyst",
    team: "Marketing",
    type: "Full-time · Remote",
    icon: BarChart3,
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              Join our <span className="text-gray-500">Team</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We are a remote-first team passionate about chess and technology. Come build the future of competitive chess with us.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {roles.map(({ title, team, type, icon: Icon }) => (
              <div key={title} className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 flex items-center justify-between hover:border-zinc-600 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                    <Icon className="w-6 h-6 text-gray-300" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{title}</div>
                    <div className="text-sm text-gray-500">{team} · {type}</div>
                  </div>
                </div>
                <div className="text-gray-500 group-hover:text-white transition-colors font-bold text-xl">→</div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-zinc-900 rounded-2xl p-8 border border-zinc-800 text-center">
            <h3 className="text-xl font-bold mb-2">Don&apos;t see a role for you?</h3>
            <p className="text-gray-400 mb-4">We&apos;re always looking for exceptional talent. Send us your resume.</p>
            <a href="mailto:careers@chessmastery.com" className="inline-block bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
              Send Resume
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
