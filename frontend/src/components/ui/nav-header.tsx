"use client"; 

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Features", href: "/#features" },
    { name: "Community", href: "/#community" },
  ];

  return (
    <>
      <nav className="absolute top-0 left-0 w-full z-50 px-4 lg:px-6 py-4 lg:py-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mix-blend-difference z-10 cursor-pointer hover:opacity-80 transition-opacity ml-2 lg:ml-4">
          <img src="/logo.png" alt="ChessMastery Logo" className="h-10 lg:h-14 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        </Link>

        {/* Center Nav — desktop only */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <NavHeader />
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4 z-10">
          {mounted && user ? (
            <Link href="/analyzer" className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-gray-300 font-semibold text-sm transition-colors mix-blend-difference">
                Log In
              </Link>
              <Link href="/register" className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile right-side buttons */}
        <div className="lg:hidden flex items-center gap-3 z-10">
          {mounted && user ? (
            <Link href="/analyzer" className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs hover:bg-gray-200 transition-colors">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="text-white font-semibold text-sm mix-blend-difference">
              Log In
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed top-0 left-0 right-0 z-40 pt-20 px-4 pb-6 bg-black/90 backdrop-blur-xl border-b border-white/10"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-white font-semibold text-base hover:bg-white/10 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            {!user && (
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 block w-full text-center bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition-colors"
              >
                Get Started Free
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const links = [
    { name: "Home", href: "/" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Features", href: "/#features" },
    { name: "Community", href: "/#community" },
  ];

  return (
    <ul
      className="relative mx-auto flex w-fit rounded-full border border-white/20 bg-black/40 backdrop-blur-md p-1.5"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {links.map((link) => (
        <Tab key={link.name} setPosition={setPosition} href={link.href}>
          {link.name}
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({
  children,
  setPosition,
  href,
}: {
  children: React.ReactNode;
  setPosition: any;
  href: string;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white mix-blend-difference md:px-6 md:py-2"
    >
      <Link href={href} className="w-full h-full block">{children}</Link>
    </li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute z-0 h-9 rounded-full bg-white md:h-9"
    />
  );
}
