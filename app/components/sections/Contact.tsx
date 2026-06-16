"use client";

import { motion } from "framer-motion";
import Reveal from "@/app/components/ui/Reveal";

const contacts = [
  { label: "Email", value: "nacosoau@gmail.com" },
  { label: "Contact", value: "Sunmade · Vee · Faisal" },
  { label: "Phone", value: "+234 705 317 1777" },
  { label: "Socials", value: "@Nacosoau · @nacosoauife" },
];

export default function CTASection() {
  return (
    <section id="cta" className="relative z-10 py-32 px-6 md:px-16 text-center">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <h2
            className="font-bold tracking-[-0.04em] leading-none mb-6"
            style={{ fontSize: "clamp(3rem,8vw,7rem)" }}
          >
            Let's build it{" "}
            <span className="text-[#39FF14]">together.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-white/55 text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            Join us as a partner and help empower the next generation of creators, builders and
            innovators. We'd love to find the partnership that puts your brand at the centre of
            OAU's biggest tech moment.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <motion.a
              href="mailto:nacosoau@gmail.com"
              whileHover={{ y: -3, boxShadow: "0 16px 48px rgba(57,255,20,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#39FF14] text-black px-8 py-4 rounded-lg font-bold text-base tracking-wide hover:bg-white transition-colors duration-300"
            >
              Become a Sponsor →
            </motion.a>
            <motion.a
              href="tel:+2347053171777"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="border border-white/20 text-white px-8 py-4 rounded-lg font-medium text-base hover:border-[#39FF14] hover:text-[#39FF14] transition-all duration-300"
            >
              Call Us
            </motion.a>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {contacts.map((c) => (
              <div
                key={c.label}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 text-left"
              >
                <p className="font-[var(--font-mono)] text-[0.6rem] tracking-[0.2em] uppercase text-[#39FF14] mb-2">
                  {c.label}
                </p>
                <p className="text-white text-sm">{c.value}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}