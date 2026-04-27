"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black py-16 px-6 md:px-12 relative z-10 text-gray-400">
      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-4 max-w-sm">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="ChessMastery Logo" className="h-10 w-auto object-contain" />
            <span className="text-white font-black text-xl tracking-tighter">
              CHESS<span className="text-zinc-500">MASTERY</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500">
            The premier platform for chess enthusiasts to learn, play, and connect globally. Elevate your game to the next level.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold mb-2">Platform</h3>
            <Link href="/play/bot" className="text-sm hover:text-white transition-colors">Play vs Bot</Link>
            <Link href="/play/online" className="text-sm hover:text-white transition-colors">Play Online</Link>
            <Link href="/analyzer" className="text-sm hover:text-white transition-colors">AI Analyzer</Link>
            <Link href="/lessons" className="text-sm hover:text-white transition-colors">Lessons</Link>
          </div>
          
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold mb-2">Company</h3>
            <Link href="#" className="text-sm hover:text-white transition-colors">About Us</Link>
            <Link href="#" className="text-sm hover:text-white transition-colors">Careers</Link>
            <Link href="#" className="text-sm hover:text-white transition-colors">Blog</Link>
            <Link href="#" className="text-sm hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold mb-2">Legal</h3>
            <Link href="#" className="text-sm hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
      
      <div className="container max-w-6xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} ChessMastery. All rights reserved. Play with passion.</p>
      </div>
    </footer>
  );
}
