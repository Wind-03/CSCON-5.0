"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/app/components/ui/Reveal";
import Eyebrow from "@/app/components/ui/Eyebrow";

gsap.registerPlugin(ScrollTrigger);

const schedule = [
  {
    time: "8:30 AM",
    title: "Registration & Networking",
    desc: "Check-in and connect with fellow creators, founders and tech enthusiasts.",
  },
  {
    time: "9:30 AM",
    title: "Opening & Keynote",
    desc: 'Welcome session and headline keynote: "Building a Digital Career in 2026."',
  },
  {
    time: "11:00 AM",
    title: "Parallel Tracks & Break",
    desc: "Create & Scale tracks run simultaneously, with networking break and refreshments.",
  },
  {
    time: "2:00 PM",
    title: "Build Track, Panels & Close",
    desc: "Tech sessions, headline panel debate, hands-on workshops and closing fireside chat.",
  },
];

export default function ScheduleSection() {
  const lineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current || !sectionRef.current) return;

    gsap.fromTo(
      lineRef.current,
      { scaleY: 0, transformOrigin: "top" },
      {
        scaleY: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 40%",
          scrub: 1,
        },
      }
    );

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <section id="schedule" ref={sectionRef} className="relative z-10 py-32 px-6 md:px-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <Reveal><Eyebrow>A Full-Day Experience</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-bold tracking-[-0.03em] mt-4" style={{ fontSize: "clamp(2.5rem,5vw,4rem)" }}>
              What the day <span className="text-[#39FF14]">looks like</span>
            </h2>
          </Reveal>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated vertical line */}
          <div
            ref={lineRef}
            className="absolute bg-gradient-to-b from-[#39FF14] to-transparent"
            style={{ left: "5.5rem", top: 0, bottom: 0, width: 1 }}
          />

          <div className="flex flex-col gap-8">
            {schedule.map((item, i) => (
              <Reveal key={item.time} delay={0.1 * (i + 1)}>
                <div className="flex gap-8 relative pl-28 group">
                  {/* Time */}
                  <span className="absolute left-0 font-[var(--font-mono)] text-[0.65rem] text-[#39FF14] tracking-tight top-5 w-16 text-right">
                    {item.time}
                  </span>

                  {/* Dot */}
                  <div
                    className="absolute top-5 w-3 h-3 rounded-full bg-[#39FF14] shadow-[0_0_12px_#39FF14] z-10"
                    style={{ left: "5rem", transform: "translateX(-50%)" }}
                  />

                  {/* Card */}
                  <div className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-xl px-6 py-5 group-hover:bg-[#39FF14]/[0.03] group-hover:border-[#39FF14]/20 transition-all duration-400">
                    <h4 className="font-semibold text-base mb-1.5">{item.title}</h4>
                    <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}