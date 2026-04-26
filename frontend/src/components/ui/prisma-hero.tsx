"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

/* ---------------- WordsPullUp ---------------- */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- Hero ---------------- */
const PrismaHero = () => {
  return (
    <section className="h-screen w-full relative">
      <div className="relative h-full w-full overflow-hidden bg-black">
        
        {/* Background GIF */}
        <img
          src="/hero-bg.gif"
          alt="Chess Background"
          fetchPriority="high"
          decoding="async"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />

        {/* Noise overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.4] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 sm:px-10 md:px-16 lg:px-24">
          <div className="grid grid-cols-12 items-end gap-6">
            
            <div className="col-span-12 lg:col-span-8">
              <h1
                className="font-black leading-[0.85] tracking-[-0.07em] text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] xl:text-[10vw]"
                style={{ color: "#ffffff" }}
              >
                <WordsPullUp text="Checkmate" showAsterisk />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-6 pb-6 lg:col-span-4 lg:pb-8">
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm text-gray-300 sm:text-base md:text-lg font-medium"
                style={{ lineHeight: 1.4 }}
              >
                Elevate your game with world-class coaching, rigorous training, and a global community of passionate players. Your journey to Grandmaster starts here.
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="group inline-flex items-center gap-3 self-start rounded-full bg-white py-2 pl-6 pr-2 text-sm font-bold text-black transition-all hover:bg-gray-200 sm:text-base shadow-xl"
              >
                Start Training
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-12 sm:w-12">
                  <ArrowRight className="h-5 w-5 text-white" />
                </span>
              </motion.button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PrismaHero }
