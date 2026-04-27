"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black py-10 lg:py-16 px-5 md:px-12 relative z-10 text-gray-400">
      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-3 max-w-xs">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="ChessMastery Logo" className="h-9 w-auto object-contain" />
            <span className="text-white font-black text-lg tracking-tighter">
              CHESS<span className="text-zinc-500">MASTERY</span>
            </span>
          </Link>
          <p className="text-xs text-gray-500 leading-relaxed">
            The premier platform for chess enthusiasts to learn, play, and connect globally.
          </p>
        </div>

        {/* Links — 3 cols on mobile too, but smaller */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-6 md:gap-16 w-full md:w-auto">
          <div className="flex flex-col gap-2.5">
            <h3 className="text-white font-semibold text-sm mb-1">Platform</h3>
            <Link href="/play/bot" className="text-xs hover:text-white transition-colors">Play vs Bot</Link>
            <Link href="/play/online" className="text-xs hover:text-white transition-colors">Play Online</Link>
            <Link href="/analyzer" className="text-xs hover:text-white transition-colors">AI Analyzer</Link>
            <Link href="/lessons" className="text-xs hover:text-white transition-colors">Lessons</Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <h3 className="text-white font-semibold text-sm mb-1">Company</h3>
            <Link href="/about" className="text-xs hover:text-white transition-colors">About Us</Link>
            <Link href="/careers" className="text-xs hover:text-white transition-colors">Careers</Link>
            <Link href="/blog" className="text-xs hover:text-white transition-colors">Blog</Link>
            <Link href="/contact" className="text-xs hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <h3 className="text-white font-semibold text-sm mb-1">Legal</h3>
            <Link href="/terms" className="text-xs hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="text-xs hover:text-white transition-colors">Privacy</Link>
            <Link href="/cookies" className="text-xs hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto mt-10 lg:mt-16 pt-6 border-t border-white/10 text-center text-xs text-gray-600">
        <p>© {new Date().getFullYear()} ChessMastery. All rights reserved.</p>
      </div>
    </footer>
  );
}
