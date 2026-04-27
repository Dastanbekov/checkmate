import { Navbar } from "@/components/ui/nav-header";
import { Footer } from "@/components/ui/footer";
import { Calendar } from "lucide-react";

const posts = [
  {
    title: "Understanding the ELO Rating System in Chess",
    excerpt: "How your rating is calculated and what it means for your journey as a chess player.",
    date: "April 25, 2026",
    tag: "Strategy",
    readTime: "5 min",
  },
  {
    title: "The Sicilian Defense: A Complete Guide",
    excerpt: "Master one of the most popular and complex openings in chess with our in-depth breakdown.",
    date: "April 20, 2026",
    tag: "Openings",
    readTime: "8 min",
  },
  {
    title: "How AI Is Changing Chess Training",
    excerpt: "From Stockfish to LLM analysis — how modern AI tools are revolutionizing the way we study chess.",
    date: "April 15, 2026",
    tag: "Technology",
    readTime: "6 min",
  },
  {
    title: "Top 5 Endgame Mistakes Beginners Make",
    excerpt: "Avoid these common errors and convert your winning positions into victories more consistently.",
    date: "April 10, 2026",
    tag: "Tips",
    readTime: "4 min",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              Our <span className="text-gray-500">Blog</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Insights, guides, and news from the world of competitive chess.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article key={post.title} className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500 bg-zinc-800 px-3 py-1 rounded-full">{post.tag}</span>
                  <span className="text-xs text-gray-600">{post.readTime} read</span>
                </div>
                <h2 className="text-xl font-black mb-3 group-hover:text-gray-300 transition-colors leading-tight">{post.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
