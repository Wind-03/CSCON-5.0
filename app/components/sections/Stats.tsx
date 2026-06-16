"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { gsap } from "gsap";
import Reveal from "@/app/components/ui/Reveal";
import Eyebrow from "@/app/components/ui/Eyebrow";

const stats = [
  { value: 5, suffix: "", label: "Editions & Counting" },
  { value: 1500, suffix: "+", label: "Expected for 5.0" },
  { value: 30, suffix: "k+", label: "Student Catchment" },
  { value: 15, suffix: "+", label: "Industry Speakers" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const animated = useRef(false);

  useEffect(() => {
    if (isInView && !animated.current && ref.current) {
      animated.current = true;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          if (ref.current) ref.current.textContent = Math.round(obj.val) + suffix;
        },
      });
    }
  }, [isInView, value, suffix]);

  return (
    <div ref={containerRef}>
      <span
        ref={ref}
        className="font-[var(--font-mono)] font-bold text-[#39FF14] block leading-none mb-3"
        style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}
      >
        0{suffix}
      </span>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section id="stats" className="relative z-10 py-32 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Reveal><Eyebrow>Five Editions of Impact</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-bold tracking-[-0.03em] mt-4" style={{ fontSize: "clamp(2.5rem,5vw,4rem)" }}>
              CSCON <span className="text-[#39FF14]">through the years</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/55 text-lg mt-4 max-w-xl mx-auto leading-relaxed">
              A proven, repeatable event with a five-year track record of packing Oduduwa Hall
              and putting industry leaders in front of OAU's most ambitious students.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.1 * (i + 1)}>
              <div className="text-center p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#39FF14]/20 hover:bg-[#39FF14]/[0.03] transition-all duration-500">
                <Counter value={s.value} suffix={s.suffix} />
                <p className="text-white/50 text-sm tracking-wide">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}