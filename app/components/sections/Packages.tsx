"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Reveal from "@/app/components/ui/Reveal";
import Eyebrow from "@/app/components/ui/Eyebrow";

const packages = [
  {
    tier: "Bronze",
    price: "₦50K – ₦100K",
    perks: [
      "Logo on sponsor list & publicity channels",
      "Access to 1,000+ leads via event & publicity content",
    ],
    highlight: false,
  },
  {
    tier: "Silver",
    price: "₦100K – ₦500K",
    perks: [
      "All Bronze benefits",
      "300+ registrations driven to your platform",
      "Enhanced logo placement",
    ],
    highlight: false,
  },
  {
    tier: "Gold",
    price: "₦500K – ₦1M",
    perks: [
      "All Silver benefits",
      "Speaking slot at the panel session",
      "Booth at the venue to engage leads",
      "10 minutes to present your product on stage",
    ],
    highlight: false,
  },
  {
    tier: "Platinum",
    price: "₦1M & Above",
    perks: [
      "All Gold benefits",
      "Keynote speaking slot at the event",
      "Exclusive co-branding / naming rights on a signature segment",
      "Premium, headline-level brand placement",
    ],
    highlight: true,
  },
];

function PackageCard({ pkg, index }: { pkg: typeof packages[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current!.style.background = pkg.highlight
      ? `radial-gradient(circle at ${x}% ${y}%, rgba(57,255,20,0.18), rgba(6,182,212,0.05))`
      : `radial-gradient(circle at ${x}% ${y}%, rgba(57,255,20,0.07), rgba(255,255,255,0.01))`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.background = "";
  };

  return (
    <Reveal delay={0.1 * (index + 1)}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative rounded-2xl p-7 h-full cursor-default"
        style={{
          border: pkg.highlight ? "1px solid rgba(57,255,20,0.35)" : "1px solid rgba(255,255,255,0.07)",
          background: pkg.highlight ? "rgba(57,255,20,0.08)" : "rgba(255,255,255,0.02)",
        }}
      >
        {pkg.highlight && (
          <div className="absolute -top-px right-5 bg-[#39FF14] text-black font-[var(--font-mono)] text-[0.55rem] tracking-[0.15em] uppercase font-bold px-2.5 py-1 rounded-b">
            Best Value
          </div>
        )}

        <p className="font-[var(--font-mono)] text-[0.65rem] tracking-[0.2em] uppercase text-white/40 mb-1.5">
          {pkg.tier}
        </p>
        <p
          className="font-[var(--font-mono)] font-bold text-xl mb-8"
          style={{ color: pkg.highlight ? "#39FF14" : "#fff" }}
        >
          {pkg.price}
        </p>

        <ul className="flex flex-col gap-3">
          {pkg.perks.map((perk) => (
            <li key={perk} className="text-sm text-white/65 pl-5 relative leading-snug">
              <span className="absolute left-0 text-[#39FF14] font-bold text-xs">✓</span>
              {perk}
            </li>
          ))}
        </ul>
      </motion.div>
    </Reveal>
  );
}

export default function PackagesSection() {
  return (
    <section id="packages" className="relative z-10 py-32 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Reveal><Eyebrow>Choose Your Level</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-bold tracking-[-0.03em] mt-4" style={{ fontSize: "clamp(2.5rem,5vw,4rem)" }}>
              Sponsorship <span className="text-[#39FF14]">packages</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/55 text-lg mt-4 max-w-xl mx-auto leading-relaxed">
              Four tiers designed to match your brand's goals and budget — each delivering escalating
              visibility, engagement and access to our audience.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.tier} pkg={pkg} index={i} />
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="text-center text-white/40 text-sm mt-8 max-w-2xl mx-auto leading-relaxed">
            Custom partnerships welcome — equipment, prizes, hackathon challenges, venue,
            refreshments & media. Tell us your goals and we'll tailor a package that fits.
          </p>
        </Reveal>
      </div>
    </section>
  );
}