"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Reveal from "@/app/components/ui/Reveal";
import Eyebrow from "@/app/components/ui/Eyebrow";

const tracks = [
  {
    id: "create",
    num: "01",
    tag: "Create",
    title: "The Creator Track",
    sub: "From 0 to Influence: growing an audience that pays.",
    items: ["Content strategy & storytelling", "Monetization & brand deals", "Building a personal brand"],
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.25)",
    border: "rgba(139,92,246,0.25)",
    bg: "rgba(139,92,246,0.08)",
    tagBg: "rgba(139,92,246,0.15)",
  },
  {
    id: "build",
    num: "02",
    tag: "Build",
    title: "The Builder Track",
    sub: "Breaking into tech & building real products.",
    items: ["Engineering & product skills", "Landing jobs & internships", "Shipping real-world projects"],
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.25)",
    border: "rgba(59,130,246,0.25)",
    bg: "rgba(59,130,246,0.08)",
    tagBg: "rgba(59,130,246,0.15)",
  },
  {
    id: "scale",
    num: "03",
    tag: "Scale",
    title: "The Scale Track",
    sub: "Start & scale a business as a student.",
    items: ["Fundraising & growth", "Building a startup team", "Scaling beyond campus"],
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.25)",
    border: "rgba(245,158,11,0.25)",
    bg: "rgba(245,158,11,0.08)",
    tagBg: "rgba(245,158,11,0.15)",
  },
];

function TrackCard({ track, index }: { track: typeof tracks[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current!.style.background = `radial-gradient(circle at ${x}% ${y}%, ${track.bg}, rgba(255,255,255,0.01))`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.background = "";
  };

  return (
    <Reveal delay={0.1 * (index + 1)}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -10, boxShadow: `0 24px 60px ${track.glow}` }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative rounded-2xl p-10 cursor-default overflow-hidden h-full"
        style={{ border: `1px solid ${track.border}`, background: track.bg }}
      >
        {/* Big number bg */}
        <span
          className="absolute top-6 right-6 font-[var(--font-mono)] font-bold leading-none pointer-events-none select-none"
          style={{ fontSize: "5rem", color: track.color, opacity: 0.07 }}
        >
          {track.num}
        </span>

        <span
          className="inline-block font-[var(--font-mono)] text-[0.65rem] tracking-[0.2em] uppercase px-2.5 py-1 rounded mb-6"
          style={{ background: track.tagBg, color: track.color }}
        >
          {track.tag}
        </span>

        <h3 className="text-3xl font-bold mb-2">{track.title}</h3>
        <p className="text-sm mb-6" style={{ color: `${track.color}99` }}>{track.sub}</p>

        <ul className="flex flex-col gap-2.5">
          {track.items.map((item) => (
            <li key={item} className="text-sm text-white/65 pl-4 relative">
              <span className="absolute left-0 text-xs" style={{ color: track.color }}>→</span>
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </Reveal>
  );
}

export default function Tracks() {
  return (
    <section id="tracks" className="relative z-10 min-h-screen flex flex-col items-center justify-center py-32 px-6 md:px-16">
      <div className="text-center max-w-2xl mb-20">
        <Reveal>
          <Eyebrow>1 day · 3 tracks · 1 unforgettable experience</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-bold tracking-[-0.03em] mt-4" style={{ fontSize: "clamp(2.5rem,5vw,4rem)" }}>
            Goals of <span className="text-[#39FF14]">CSCON 5.0</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-white/55 text-lg mt-4 leading-relaxed">
            Every track is engineered to move a student one full step forward in their journey.
          </p>
        </Reveal>
      </div>

      <div className="grid md:grid-cols-3 gap-5 max-w-6xl w-full">
        {tracks.map((t, i) => (
          <TrackCard key={t.id} track={t} index={i} />
        ))}
      </div>
    </section>
  );
}