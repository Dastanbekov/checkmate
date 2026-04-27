"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Activity, Play, Users, LogOut, User as UserIcon, BookOpen } from "lucide-react";

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links = [
    { name: "Play vs Bot", href: "/play/bot", icon: Play },
    { name: "Play Online", href: "/play/online", icon: Users },
    { name: "CS:GO Mode", href: "/play/csgo", icon: Activity },
    { name: "Analyzer", href: "/analyzer", icon: Activity },
    { name: "Lessons", href: "/lessons", icon: BookOpen },
    { name: "Communities", href: "/community", icon: Users },
  ];

  return (
    <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-900 flex flex-col fixed left-0 top-0 text-zinc-300">
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
  );
}
