"use client"; 

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-6 py-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter mix-blend-difference z-10 cursor-pointer">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black text-2xl">
          ♞
        </div>
        CHESS<span className="text-gray-400">MASTERY</span>
      </div>

      {/* Center Nav Header */}
      <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
        <NavHeader />
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4 z-10">
        <button className="text-white hover:text-gray-300 font-semibold text-sm transition-colors mix-blend-difference">
          Log In
        </button>
        <button className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl">
          Register
        </button>
      </div>
    </nav>
  );
}

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      className="relative mx-auto flex w-fit rounded-full border border-white/20 bg-black/40 backdrop-blur-md p-1.5"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      <Tab setPosition={setPosition}>Home</Tab>
      <Tab setPosition={setPosition}>Pricing</Tab>
      <Tab setPosition={setPosition}>Features</Tab>
      <Tab setPosition={setPosition}>Community</Tab>
      <Tab setPosition={setPosition}>Tournaments</Tab>

      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({
  children,
  setPosition,
}: {
  children: React.ReactNode;
  setPosition: any;
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
      {children}
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
