import { Navbar } from "@/components/ui/nav-header";
import { Footer } from "@/components/ui/footer";
import { Mail, MessageCircle, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              Get in <span className="text-gray-500">Touch</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have questions or feedback? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="flex flex-col gap-6">
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <div className="font-bold">Email</div>
                  <div className="text-gray-400 text-sm">support@chessmastery.com</div>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <div className="font-bold">Discord</div>
                  <div className="text-gray-400 text-sm">discord.gg/chessmastery</div>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <div className="font-bold">Location</div>
                  <div className="text-gray-400 text-sm">Remote-first, worldwide</div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your name"
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
              <input
                type="email"
                placeholder="Your email"
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
              <textarea
                rows={6}
                placeholder="Your message..."
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
              />
              <button
                type="submit"
                className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
