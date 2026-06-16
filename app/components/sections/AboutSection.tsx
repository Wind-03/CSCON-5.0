"use client";

import Reveal from "@/app/components/ui/Reveal";
import Eyebrow from "@/app/components/ui/Eyebrow";
import { motion } from "framer-motion";

const audiences = [
  {
    id: "create",
    label: "Creators",
    desc: "Build audiences but don't know how to monetize them.",
    color: "#8B5CF6",
    border: "border-purple-500/30",
    bg: "hover:bg-purple-500/10",
  },
  {
    id: "build",
    label: "Techies",
    desc: "Can code, but struggle to find jobs or ship real products.",
    color: "#3B82F6",
    border: "border-blue-500/30",
    bg: "hover:bg-blue-500/10",
  },
  {
    id: "scale",
    label: "Founders",
    desc: "Start ventures but lack the knowledge to scale them.",
    color: "#F59E0B",
    border: "border-amber-500/30",
    bg: "hover:bg-amber-500/10",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative z-10 min-h-screen flex items-center py-32 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-24 items-center w-full">
        {/* Left */}
        <div>
          <Reveal>
            <Eyebrow>What is CSCON</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="font-bold leading-[1.05] tracking-[-0.03em] mb-6"
              style={{ fontSize: "clamp(2.8rem,5vw,4.5rem)" }}
            >
              One stage.{" "}
              <span className="text-[#39FF14]">Three tracks.</span>
              <br />
              The whole tech journey.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/60 text-lg leading-relaxed mb-6">
              CSCON — the Computing Students Conference — is the annual flagship summit of
              NACOS, OAU. Now in its fifth edition, it has grown from a departmental event into
              a highly anticipated tech summit attracting talent across Southwest Nigeria.
            </p>
            <p className="text-white/60 text-lg leading-relaxed">
              OAU holds 30,000+ students and one of the densest concentrations of young tech
              talent in Nigeria. Yet that talent is fragmented. CSCON is built to be the bridge.
            </p>
          </Reveal>
        </div>

        {/* Right — audience cards */}
        <div className="flex flex-col gap-4">
          {audiences.map((a, i) => (
            <Reveal key={a.id} delay={0.1 * (i + 1)} direction="right">
              <motion.div
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`relative border ${a.border} ${a.bg} bg-white/[0.02] rounded-xl px-8 py-6 cursor-default transition-colors duration-300 overflow-hidden`}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r"
                  style={{ background: a.color }}
                />
                <h3
                  className="text-sm font-bold tracking-[0.15em] uppercase mb-1.5"
                  style={{ color: a.color }}
                >
                  {a.label}
                </h3>
                <p className="text-white/55 text-base">{a.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}