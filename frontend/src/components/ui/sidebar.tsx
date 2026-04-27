"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Activity, Play, Users, LogOut, User as UserIcon, BookOpen, Gamepad2, X, Menu } from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: "Play vs Bot", href: "/play/bot", icon: Play },
    { name: "Play Online", href: "/play/online", icon: Users },
    { name: "CS:GO Mode", href: "/play/csgo", icon: Gamepad2 },
    { name: "Analyzer", href: "/analyzer", icon: Activity },
    { name: "Lessons", href: "/lessons", icon: BookOpen },
    { name: "Community", href: "/community", icon: Users },
  ];

  return (
    <>
      {/* ========= DESKTOP SIDEBAR ========= */}
      <aside className="hidden lg:flex w-64 h-screen bg-zinc-950 border-r border-zinc-900 flex-col fixed left-0 top-0 text-zinc-300 z-40">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity ml-4">
            <img src="/logo.png" alt="ChessMastery Logo" className="h-12 w-auto object-contain mx-auto drop-shadow-lg" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "bg-zinc-800 text-white"
                    : "hover:bg-zinc-900 hover:text-white"
                  }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-zinc-900">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-900 cursor-pointer transition-colors mb-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium text-white leading-none truncate">{user?.name}</span>
                <span className="text-xs text-zinc-400 mt-1 font-bold">
                  {user?.elo_rating ? `${user.elo_rating} ELO` : "Unrated"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-zinc-900 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ========= MOBILE BOTTOM NAV ========= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 flex items-center justify-around px-2 py-2 safe-area-bottom">
        {links.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-all ${isActive ? "bg-zinc-800" : ""}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold leading-none">
                {link.name.split(" ")[0]}
              </span>
            </Link>
          );
        })}

        {/* More button → opens full menu */}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-zinc-500 hover:text-zinc-300 transition-all"
        >
          <div className="p-1.5 rounded-lg">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold leading-none">More</span>
        </button>
      </nav>

      {/* ========= MOBILE FULL MENU OVERLAY ========= */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-zinc-950 rounded-t-3xl border-t border-zinc-800 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-6" />

            {/* User info */}
            <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 rounded-xl mb-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white shrink-0">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user?.name}</p>
                <p className="text-xs text-zinc-400">
                  {user?.elo_rating ? `${user.elo_rating} ELO` : "Unrated"}
                </p>
              </div>
            </div>

            {/* All links */}
            <div className="space-y-1 mb-4">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>

            <button
              onClick={() => setMobileOpen(false)}
              className="w-full mt-3 py-3 text-zinc-500 text-sm font-medium rounded-xl hover:bg-zinc-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
