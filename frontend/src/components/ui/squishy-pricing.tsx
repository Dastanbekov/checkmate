"use client";

import { motion } from 'framer-motion';

export const SquishyPricing = () => {
  return (
    <section className="bg-black px-4 py-24 min-h-screen flex flex-col items-center justify-center transition-colors">
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Master Your Game</h2>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">Choose a plan that fits your ambition. From casual players to aspiring grandmasters, we have the resources you need.</p>
      </div>
      <div className="mx-auto flex w-fit flex-wrap justify-center gap-8">
          <PricingCard
            label="Amateur"
            monthlyPrice="19"
            description="For casual players who want to learn openings, tactics, and analyze their games."
            cta="Start Free Trial"
            background="bg-zinc-800"
            BGComponent={BGComponent1}
          />
          <PricingCard
            label="Pro"
            monthlyPrice="49"
            description="For serious competitors who need advanced AI analysis and live coaching sessions."
            cta="Upgrade to Pro"
            background="bg-indigo-600"
            BGComponent={BGComponent2}
          />
          <PricingCard
            label="Grandmaster"
            monthlyPrice="199"
            description="For elite players looking for 1-on-1 mentorship from titled players and custom training plans."
            cta="Apply Now"
            background="bg-rose-600"
            BGComponent={BGComponent3}
          />
        </div>
      </section>
  );
};

const PricingCard = ({ label, monthlyPrice, description, cta, background, BGComponent }: any) => {
  return (
    <motion.div
      whileHover="hover"
      transition={{ duration: 1, ease: "backInOut" }}
      variants={{ hover: { scale: 1.05 } }}
      className={`relative h-[28rem] w-80 shrink-0 overflow-hidden rounded-2xl p-8 ${background} shadow-2xl hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transition-shadow`}
    >
      <div className="relative z-10 text-white flex flex-col h-full">
        <span className="mb-4 block w-fit rounded-full bg-white/20 backdrop-blur-md px-4 py-1 text-sm font-bold text-white border border-white/30">
          {label}
        </span>
        <motion.span
          initial={{ scale: 0.85 }}
          variants={{ hover: { scale: 1 } }}
          transition={{ duration: 1, ease: "backInOut" }}
          className="my-4 block origin-top-left font-sans text-6xl font-black leading-[1.1] tracking-tight"
        >
          ${monthlyPrice}<span className="text-3xl">/mo</span>
        </motion.span>
        <p className="text-base text-white/90 leading-relaxed flex-grow">{description}</p>
      </div>
      <button className="absolute bottom-6 left-6 right-6 z-20 rounded-xl border-2 border-white bg-white py-3 text-center font-bold uppercase tracking-wider text-black backdrop-blur-sm transition-all duration-200 hover:bg-transparent hover:text-white hover:border-white focus:outline-none focus:ring-4 focus:ring-white/30">
        {cta}
      </button>
      <BGComponent />
    </motion.div>
  );
};

const BGComponent1 = () => (
  <motion.svg
    width="320"
    height="384"
    viewBox="0 0 320 384"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    variants={{ hover: { scale: 1.5 } }}
    transition={{ duration: 1, ease: "backInOut" }}
    className="absolute inset-0 z-0 opacity-50"
  >
    <motion.circle
      variants={{ hover: { scaleY: 0.5, y: -25 } }}
      transition={{ duration: 1, ease: "backInOut", delay: 0.2 }}
      cx="160.5"
      cy="114.5"
      r="101.5"
      fill="rgba(255, 255, 255, 0.1)"
    />
    <motion.ellipse
      variants={{ hover: { scaleY: 2.25, y: -25 } }}
      transition={{ duration: 1, ease: "backInOut", delay: 0.2 }}
      cx="160.5"
      cy="265.5"
      rx="101.5"
      ry="43.5"
      fill="rgba(255, 255, 255, 0.1)"
    />
  </motion.svg>
);

const BGComponent2 = () => (
  <motion.svg
    width="320"
    height="384"
    viewBox="0 0 320 384"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    variants={{ hover: { scale: 1.05 } }}
    transition={{ duration: 1, ease: "backInOut" }}
    className="absolute inset-0 z-0 opacity-50"
  >
    <motion.rect
      x="14"
      width="153"
      height="153"
      rx="15"
      fill="rgba(255, 255, 255, 0.1)"
      variants={{ hover: { y: 219, rotate: "90deg", scaleX: 2 } }}
      style={{ y: 12 }}
      transition={{ delay: 0.2, duration: 1, ease: "backInOut" }}
    />
    <motion.rect
      x="155"
      width="153"
      height="153"
      rx="15"
      fill="rgba(255, 255, 255, 0.1)"
      variants={{ hover: { y: 12, rotate: "90deg", scaleX: 2 } }}
      style={{ y: 219 }}
      transition={{ delay: 0.2, duration: 1, ease: "backInOut" }}
    />
  </motion.svg>
);

const BGComponent3 = () => (
  <motion.svg
    width="320"
    height="384"
    viewBox="0 0 320 384"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    variants={{ hover: { scale: 1.25 } }}
    transition={{ duration: 1, ease: "backInOut" }}
    className="absolute inset-0 z-0 opacity-50"
  >
    <motion.path
      variants={{ hover: { y: -50 } }}
      transition={{ delay: 0.3, duration: 1, ease: "backInOut" }}
      d="M148.893 157.531C154.751 151.673 164.249 151.673 170.107 157.531L267.393 254.818C273.251 260.676 273.251 270.173 267.393 276.031L218.75 324.674C186.027 357.397 132.973 357.397 100.25 324.674L51.6068 276.031C45.7489 270.173 45.7489 260.676 51.6068 254.818L148.893 157.531Z"
      fill="rgba(255, 255, 255, 0.1)"
    />
    <motion.path
      variants={{ hover: { y: -50 } }}
      transition={{ delay: 0.2, duration: 1, ease: "backInOut" }}
      d="M148.893 99.069C154.751 93.2111 164.249 93.2111 170.107 99.069L267.393 196.356C273.251 202.213 273.251 211.711 267.393 217.569L218.75 266.212C186.027 298.935 132.973 298.935 100.25 266.212L51.6068 217.569C45.7489 211.711 45.7489 202.213 51.6068 196.356L148.893 99.069Z"
      fill="rgba(255, 255, 255, 0.1)"
    />
    <motion.path
      variants={{ hover: { y: -50 } }}
      transition={{ delay: 0.1, duration: 1, ease: "backInOut" }}
      d="M148.893 40.6066C154.751 34.7487 164.249 34.7487 170.107 40.6066L267.393 137.893C273.251 143.751 273.251 153.249 267.393 159.106L218.75 207.75C186.027 240.473 132.973 240.473 100.25 207.75L51.6068 159.106C45.7489 153.249 45.7489 143.751 51.6068 137.893L148.893 40.6066Z"
      fill="rgba(255, 255, 255, 0.1)"
    />
  </motion.svg>
);
