"use client";

import { motion } from "framer-motion";

export interface PerspectiveMarqueeProps {
  items?: string[];
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  rotateY?: number;
  rotateX?: number;
  perspective?: number;
  fadeColor?: string;
  background?: string;
  speed?: number;
  className?: string;
}

const DEFAULT_ITEMS = [
  "Win",
  "Conquer",
  "Lead",
  "Train",
  "Dominate",
  "Strategize",
  "Checkmate",
  "Improve",
];

export function PerspectiveMarquee({
  items = DEFAULT_ITEMS,
  fontSize = 84,
  color = "#fafafa",
  fontWeight = 900,
  rotateY = -28,
  rotateX = 8,
  perspective = 1200,
  fadeColor = "#000000",
  background = "#000000",
  speed = 40,
  className,
}: PerspectiveMarqueeProps) {
  // We duplicate the items enough times so they can scroll seamlessly.
  const rendered = [...items, ...items, ...items, ...items];

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        perspective: `${perspective}px`,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: speed, // Duration in seconds
          }}
          style={{
            display: "flex",
            whiteSpace: "nowrap",
          }}
        >
          {rendered.map((item, i) => {
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontSize,
                  fontWeight,
                  color,
                  letterSpacing: "-0.03em",
                  paddingRight: fontSize * 0.9,
                  textTransform: "uppercase",
                }}
              >
                {item}
              </span>
            );
          })}
        </motion.div>
      </div>

      {/* Fade Overlays */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(90deg, ${fadeColor} 0%, transparent 20%, transparent 80%, ${fadeColor} 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(180deg, ${fadeColor} 0%, transparent 25%, transparent 75%, ${fadeColor} 100%)`,
        }}
      />
    </div>
  );
}
