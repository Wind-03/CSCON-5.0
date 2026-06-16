"use client";

import { motion } from "framer-motion";
import Reveal from "@/app/components/ui/Reveal";
import Eyebrow from "@/app/components/ui/Eyebrow";

const speakers = [
  { initials: "LW", name: "Layi Wasabi", role: "Comedian & content creator", track: "Create", color: "#8B5CF6", trackBg: "rgba(139,92,246,0.15)" },
  { initials: "KE", name: "Korty EO", role: "Storyteller, creator & host", track: "Create", color: "#8B5CF6", trackBg: "rgba(139,92,246,0.15)" },
  { initials: "SK", name: "Salem King", role: "Skit maker & content creator", track: "Create", color: "#8B5CF6", trackBg: "rgba(139,92,246,0.15)" },
  { initials: "PO", name: "Prosper Otemuyiwa", role: "Developer advocate & tech leader", track: "Build", color: "#3B82F6", trackBg: "rgba(59,130,246,0.15)" },
  { initials: "CO", name: "Clinton Oyelami", role: "CEO, Swerv", track: "Build", color: "#3B82F6", trackBg: "rgba(59,130,246,0.15)" },
  { initials: "RA", name: "Razaq Ahmed, CFA", role: "Co-founder & CEO, Cowrywise", track: "Scale", color: "#F59E0B", trackBg: "rgba(245,158,11,0.15)" },
  { initials: "TG", name: "Temie Giwa-Tubosun", role: "Founder, LifeBank", track: "Scale", color: "#F59E0B", trackBg: "rgba(245,158,11,0.15)" },
];

export default function SpeakersSection() {
  return (
    <section id="speakers" className="relative z-10 py-32 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Reveal><Eyebrow>The Calibre on Stage</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-bold tracking-[-0.03em] mt-4" style={{ fontSize: "clamp(2.5rem,5vw,4rem)" }}>
              Proposed <span className="text-[#39FF14]">speakers & voices</span>
            </h2>
          </Reveal>
        </div>

        {/* Keynote */}
        <Reveal delay={0.1}>
          <motion.div
            whileHover={{ scale: 1.015, boxShadow: "0 0 80px rgba(57,255,20,0.12)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex gap-8 items-center p-10 rounded-2xl mb-8 border border-[#39FF14]/20 bg-[#39FF14]/[0.05] max-w-3xl mx-auto"
          >
            <div className="w-24 h-24 rounded-full bg-[#39FF14] flex items-center justify-center font-[var(--font-mono)] font-bold text-2xl text-black flex-shrink-0">
              TE
            </div>
            <div>
              <span className="inline-block font-[var(--font-mono)] text-[0.6rem] tracking-[0.2em] uppercase bg-[#39FF14]/15 text-[#39FF14] px-2.5 py-1 rounded mb-3">
                ★ Keynote Speaker
              </span>
              <h3 className="text-3xl font-bold mb-1">Tosin Eniolorunda</h3>
              <p className="text-[#39FF14] font-medium mb-3 text-sm">Founder & CEO, Moniepoint Inc.</p>
              <p className="text-white/55 text-sm leading-relaxed">
                Founder of Moniepoint — one of Africa's largest fintech companies and a global unicorn.
                Keynote: "Architecting the Future of the Creator & Tech Economy."
              </p>
            </div>
          </motion.div>
        </Reveal>

        {/* Speaker grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {speakers.map((s, i) => (
            <Reveal key={s.name} delay={0.05 * (i + 1)}>
              <motion.div
                whileHover={{ y: -4, background: "rgba(255,255,255,0.05)" }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex items-center gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-[var(--font-mono)] font-bold text-sm flex-shrink-0"
                  style={{ background: `${s.color}30`, color: s.color, border: `1.5px solid ${s.color}` }}
                >
                  {s.initials}
                </div>
                <div>
                  <span
                    className="inline-block font-[var(--font-mono)] text-[0.5rem] tracking-[0.15em] uppercase px-1.5 py-0.5 rounded mb-1"
                    style={{ background: s.trackBg, color: s.color }}
                  >
                    {s.track}
                  </span>
                  <h4 className="font-semibold text-sm">{s.name}</h4>
                  <p className="text-white/45 text-xs leading-snug mt-0.5">{s.role}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="text-center text-white/35 text-xs italic mt-8 font-[var(--font-mono)]">
            * Speaker lineup is targeted/proposed and subject to confirmation.
          </p>
        </Reveal>
      </div>
    </section>
  );
}