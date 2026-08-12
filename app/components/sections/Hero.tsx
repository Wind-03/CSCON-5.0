"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";

export default function HeroSection() {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(eyebrowRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.3)
      .fromTo(titleRef.current, { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, 0.6)
      .fromTo(
        taglineRef.current!.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
        1.0
      )
      .fromTo(metaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 1.5)
      .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 2.0);
  }, []);

  const metaItems = [
    { label: "Date", value: "September 3rd, 2026" },
    { label: "Venue", value: "Oduduwa Hall, OAU" },
    { label: "Expected Reach", value: "1,500+ Attendees" },
  ];

  const tagWords = [
    { text: "Create.", color: "#8B5CF6" },
    { text: "Build.", color: "#3B82F6" },
    { text: "Scale.", color: "#F59E0B" },
  ];

  return (
    <section
      id="hero"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6"
    >
      <p
        ref={eyebrowRef}
        className="font-[var(--font-mono)] text-xs tracking-[0.25em] uppercase text-[#39FF14] mb-8 opacity-0"
      >
        Nigerian Association of Computing Students · OAU · 5th Edition
      </p>

      <h1
        ref={titleRef}
        className="opacity-0 font-bold leading-none tracking-[-0.04em] mb-6"
        style={{ fontSize: "clamp(5rem,14vw,12rem)" }}
      >
        <span className="text-white">CS</span>
        <span className="text-[#39FF14]">CON</span>{" "}
        <span className="text-white">5.0</span>
      </h1>

      <div ref={taglineRef} className="flex gap-4 flex-wrap justify-center mb-16">
        {tagWords.map(({ text, color }) => (
          <span
            key={text}
            className="opacity-0 font-bold tracking-[0.12em] uppercase"
            style={{
              color,
              fontSize: "clamp(1.2rem,3vw,2.2rem)",
            }}
          >
            {text}
          </span>
        ))}
      </div>

      <div ref={metaRef} className="flex gap-12 flex-wrap justify-center opacity-0">
        {metaItems.map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="font-[var(--font-mono)] text-[0.6rem] tracking-[0.2em] uppercase text-white/40 mb-1">
              {label}
            </p>
            <p className="text-lg font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0">
        <motion.div
          className="w-px bg-gradient-to-b from-[#39FF14] to-transparent"
          style={{ height: 60 }}
          animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="font-[var(--font-mono)] text-[0.55rem] tracking-[0.2em] uppercase text-white/30">
          Scroll to explore
        </span>
      </div>
    </section>
  );
}