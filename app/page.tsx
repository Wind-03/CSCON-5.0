"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import RegistrationModal from "./components/ui/RegistrationModal";
import Navbar from "./components/ui/Navbar";
import FadeIn from "./components/ui/FadeIn";

const HeroScene = dynamic(() => import("./components/scenes/HeroScene"), {
  ssr: false,
});
const ReachScene = dynamic(() => import("./components/scenes/ReachScene"), {
  ssr: false,
});
const BackgroundScene = dynamic(
  () => import("@/app/components/scenes/BackgroundScene"),
  { ssr: false },
);

const speakers = [
  {
    initials: "IB",
    name: "Ismail Bala",
    role: "Videographer & Digital Creator",
    track: "Create",
    color: "#C580FF",
    bg: "#1a0a2a",
    note: "An OAU creative with a desire to push boundaries.",
  },
  {
    initials: "FA",
    name: "Faith Adeyinka",
    role: "Storyteller, Designer & Creator",
    track: "Create",
    color: "#C580FF",
    bg: "#1a0a2a",
    note: "An OAU student combining career and content-creation",
  },
  {
    initials: "BB",
    name: "Olatunbosun BodeBosun",
    role: "Brand Designer",
    track: "Create",
    color: "#C580FF",
    bg: "#1a0a2a",
    note: "",
  },
  {
    initials: "CO",
    name: "Clinton Oyelami",
    role: "CEO, Swerv",
    track: "Build",
    color: "#6BB5FF",
    bg: "#0a1020",
    note: "Fintech & lifestyle products",
  },
  {
    initials: "TO",
    name: "Taslim Oseni",
    role: "Senior Developer @ Cowrywise",
    track: "Build",
    color: "#6BB5FF",
    bg: "#0a1020",
    note: "Respected tech leader",
  },
  {
    initials: "IF",
    name: "Iyanu Falaye",
    role: "Senior Software Engineer @ Moniepoint",
    track: "Build",
    color: "#F0C550",
    bg: "#1a1200",
    note: "Scaling wealth & investing for a generation",
  },
  {
    initials: "PA",
    name: "Prof. Aina",
    role: "Current Jamb Registrar",
    track: "Scale",
    color: "#F0C550",
    bg: "#1a1200",
    note: "Professor of COmputing @ OAu and the current JAMB registrar",
  },
];

const packages = [
  {
    name: "Bronze",
    price: "50K – 100K",
    featured: false,
    features: [
      "Logo on sponsor list & publicity channels",
      "Access to 1,000+ leads via event & publicity content",
    ],
  },
  {
    name: "Silver",
    price: "100K – 500K",
    featured: false,
    features: [
      "All Bronze benefits",
      "300+ registrations driven to your platform",
      "Enhanced logo placement",
    ],
  },
  {
    name: "Gold",
    price: "500K – 1M",
    featured: false,
    features: [
      "All Silver benefits",
      "A speaking slot at the panel session",
      "A booth at the venue to engage leads",
      "10 minutes to present your product on stage",
    ],
  },
  {
    name: "Platinum",
    price: "1M & Above",
    featured: true,
    features: [
      "All Gold benefits",
      "A keynote speaking slot at the event",
      "Exclusive co-branding / naming rights on a signature segment",
      "Premium, headline-level brand placement",
    ],
  },
];

const schedule = [
  {
    time: "8:30 – 9:30 AM",
    title: "Registration & Networking",
    desc: "Check-in and connect with fellow creators, founders and tech enthusiasts.",
  },
  {
    time: "9:30 – 11:00 AM",
    title: "Opening & Keynote",
    desc: 'Welcome session and headline keynote: "Building a Digital Career in 2026."',
  },
  {
    time: "11:00 AM – 2:00 PM",
    title: "Parallel Tracks & Break",
    desc: "Create & Scale tracks run simultaneously, with a networking break and refreshments.",
  },
  {
    time: "2:00 – 4:00 PM",
    title: "Build Track, Panels & Close",
    desc: "Tech sessions, the headline panel debate, hands-on workshops and a closing fireside chat.",
  },
];

function trackPillStyle(track: string) {
  if (track === "Create") return "pill pill-purple";
  if (track === "Build") return "pill pill-blue";
  if (track === "Scale") return "pill pill-gold";
  return "pill pill-green";
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else setCount(Math.floor(current));
          }, 2000 / steps);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);
  return (
    <div ref={ref} className="stat-number">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

function ReachCounter() {
  const [count, setCount] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const stages = [
            1, 10, 100, 500, 1000, 5000, 10000, 100000, 500000, 1000000,
          ];
          let i = 0;
          const run = () => {
            if (i < stages.length) {
              setCount(stages[i]);
              i++;
              setTimeout(run, 350);
            }
          };
          run();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="particle-count">
      {count >= 1000000 ? "1M+" : count.toLocaleString()}
    </div>
  );
}

export default function Home() {
  const scrollProgress = useRef(0);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      scrollProgress.current =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <BackgroundScene scrollProgress={scrollProgress} />
      <Navbar />

      {/* HERO */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 40px",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <HeroScene />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(5,5,5,0.25) 0%, rgba(5,5,5,0.8) 70%)",
            zIndex: 1,
          }}
        />
        <div className="max-container content-layer" style={{ zIndex: 2 }}>
          <div style={{ maxWidth: 720 }}>
            <div className="eyebrow">
              NACOS OAU · 5th Edition · July 21, 2026
            </div>
            <h1
              className="display-heading"
              style={{
                marginBottom: 20,
                marginTop: 12,
                fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
              }}
            >
              CS<span className="accent-green">CON</span> 5.0
            </h1>
            <div
              style={{
                display: "inline-block",
                background: "var(--green)",
                color: "#000",
                padding: "10px 24px",
                borderRadius: 8,
                fontWeight: 900,
                fontSize: "clamp(1rem, 3vw, 1.6rem)",
                letterSpacing: "-0.01em",
                marginBottom: 28,
              }}
            >
              Create. Build. Scale.
            </div>
            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.6,
                maxWidth: 560,
                marginBottom: 40,
              }}
            >
              The flagship gathering where OAU's creators, builders and founders
              converge to turn raw talent into income, products and scalable
              ventures.
            </p>
            <div
              style={{
                display: "flex",
                gap: 48,
                flexWrap: "wrap",
                marginBottom: 48,
              }}
            >
              {[
                { label: "Date", value: "July 21, 2026" },
                { label: "Venue", value: "Trust Hall, OAU" },
                { label: "Expected", value: "500+ Attendees" },
              ].map((item) => (
                <div key={item.label}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--green)",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#packages" className="cta-button">
                Become a Sponsor →
              </a>
              <a href="#about" className="cta-button cta-button-outline">
                Learn More
              </a>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </div>
          <div
            style={{
              width: 1,
              height: 48,
              background:
                "linear-gradient(to bottom, rgba(57,255,20,0.6), transparent)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section">
        <div className="max-container content-layer">
          <FadeIn>
            <div className="eyebrow">What is CSCON</div>
            <h2
              className="display-heading"
              style={{ maxWidth: 800, marginBottom: 24 }}
            >
              One stage. <span className="accent-green">Three tracks.</span>
              <br />
              The whole tech journey.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.7,
                maxWidth: 600,
                marginBottom: 56,
              }}
            >
              CSCON — the Computing Students Conference — is the annual flagship
              summit of NACOS, OAU. Now in its fifth edition, it has grown from
              a departmental event into a highly anticipated tech summit that
              attracts techies even beyond OAU, across Southwest Nigeria.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="card" style={{ marginBottom: 48, maxWidth: 800 }}>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--green)",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                The opportunity we're solving
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                Obafemi Awolowo University holds{" "}
                <strong style={{ color: "#fff" }}>30,000+ students</strong> and
                one of the densest concentrations of young tech talent in
                Nigeria. Yet that talent is fragmented — three groups who should
                be building together rarely meet:
              </p>
              <div className="grid-3">
                {[
                  {
                    label: "Creators",
                    desc: "Build audiences but don't know how to monetize them.",
                    color: "var(--purple)",
                  },
                  {
                    label: "Techies",
                    desc: "Can code, but struggle to find jobs or ship real products.",
                    color: "var(--blue)",
                  },
                  {
                    label: "Founders",
                    desc: "Start ventures but lack the knowledge to scale them.",
                    color: "var(--gold)",
                  },
                ].map((g) => (
                  <div
                    key={g.label}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${g.color}30`,
                      borderRadius: 10,
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        color: g.color,
                        fontWeight: 800,
                        marginBottom: 8,
                        fontSize: 15,
                      }}
                    >
                      {g.label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.6)",
                        lineHeight: 1.6,
                      }}
                    >
                      {g.desc}
                    </div>
                  </div>
                ))}
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  marginTop: 20,
                  fontWeight: 600,
                }}
              >
                They're siloed. They need a bridge — and that's what CSCON is
                built to be.
              </p>
            </div>
          </FadeIn>
          <div className="grid-4">
            {[
              { label: "Editions & Counting", target: 5, suffix: "" },
              { label: "Expected for 5.0", target: 1500, suffix: "+" },
              { label: "Student Catchment", target: 30000, suffix: "+" },
              { label: "Industry Speakers", target: 15, suffix: "+" },
            ].map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.08}>
                <div className="card" style={{ textAlign: "center" }}>
                  <Counter target={stat.target} suffix={stat.suffix} />
                  <div className="stat-label">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section
        id="tracks"
        className="section"
        style={{ background: "rgba(255,255,255,0.01)" }}
      >
        <div className="max-container content-layer">
          <FadeIn>
            <div className="eyebrow">Goals & Tracks</div>
            <h2 className="display-heading" style={{ marginBottom: 16 }}>
              1 day · <span className="accent-green">3 tracks</span> · 1
              unforgettable experience
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 16,
                marginBottom: 56,
              }}
            >
              Every track is engineered to move a student one full step forward
              in their journey.
            </p>
          </FadeIn>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              {
                pill: "CREATE",
                num: "01",
                title: "The Creator Track",
                tagline: "From 0 to Influence: growing an audience that pays.",
                items: [
                  "Content strategy & storytelling",
                  "Monetization & brand deals",
                  "Building a personal brand",
                ],
                accent: "#C580FF",
                bg: "rgba(123,47,190,0.05)",
                border: "rgba(123,47,190,0.2)",
              },
              {
                pill: "BUILD",
                num: "02",
                title: "The Builder Track",
                tagline: "Breaking into tech & building real products.",
                items: [
                  "Engineering & product skills",
                  "Landing jobs & internships",
                  "Shipping real-world projects",
                ],
                accent: "#6BB5FF",
                bg: "rgba(26,110,191,0.05)",
                border: "rgba(26,110,191,0.2)",
              },
              {
                pill: "SCALE",
                num: "03",
                title: "The Scale Track",
                tagline: "Start & scale a business as a student.",
                items: [
                  "Fundraising & growth",
                  "Building a startup team",
                  "Scaling Careers beyond campus",
                ],
                accent: "#F0C550",
                bg: "rgba(240,165,0,0.05)",
                border: "rgba(240,165,0,0.2)",
              },
            ].map((track, i) => (
              <FadeIn key={track.pill} delay={i * 0.1}>
                <div
                  style={{
                    background: track.bg,
                    border: `1px solid ${track.border}`,
                    borderRadius: 16,
                    padding: "40px",
                    display: "flex",
                    gap: 48,
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: "0 0 auto", minWidth: 220 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          background: track.accent,
                          color: "#000",
                          padding: "4px 10px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                        }}
                      >
                        {track.pill}
                      </span>
                      <span
                        style={{
                          fontSize: "3rem",
                          fontWeight: 900,
                          color: `${track.accent}30`,
                          lineHeight: 1,
                        }}
                      >
                        {track.num}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        marginBottom: 8,
                        color: track.accent,
                      }}
                    >
                      {track.title}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.6)",
                        lineHeight: 1.6,
                      }}
                    >
                      {track.tagline}
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      paddingTop: 4,
                    }}
                  >
                    {track.items.map((item) => (
                      <div
                        key={item}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "14px 18px",
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: 8,
                          border: "1px solid rgba(255,255,255,0.05)",
                          fontSize: 14,
                          color: "rgba(255,255,255,0.75)",
                        }}
                      >
                        <span style={{ color: track.accent, fontSize: 8 }}>
                          ●
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <div style={{ marginTop: 64 }}>
            <FadeIn>
              <div className="eyebrow">What we aim to achieve</div>
              <h3
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  marginBottom: 32,
                }}
              >
                Goals of <span className="accent-green">CSCON 5.0</span>
              </h3>
            </FadeIn>
            <div className="grid-4">
              {[
                {
                  num: "01",
                  title: "Foster Innovation",
                  desc: "Spark creativity and problem-solving through technology.",
                },
                {
                  num: "02",
                  title: "Connect Talent",
                  desc: "Link attendees to industry leaders, mentors and opportunities.",
                },
                {
                  num: "03",
                  title: "Equip to Build",
                  desc: "Deliver practical knowledge for shipping scalable solutions.",
                },
                {
                  num: "04",
                  title: "Bridge the Gap",
                  desc: "Close the distance between campus talent and industry.",
                },
              ].map((g, i) => (
                <FadeIn key={g.num} delay={i * 0.08}>
                  <div className="card">
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--green)",
                        fontWeight: 700,
                        marginBottom: 8,
                      }}
                    >
                      {g.num}
                    </div>
                    <div
                      style={{ fontWeight: 800, marginBottom: 8, fontSize: 15 }}
                    >
                      {g.title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.6,
                      }}
                    >
                      {g.desc}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRATION */}
      <section id="register" className="section bg-[rgba(57,255,20,0.01)]">
        <div className="max-container content-layer">
          <FadeIn>
            <div className="eyebrow">Secure Your Spot</div>
            <h2 className="display-heading my-4">
              Register for <span className="accent-green">CSCON 5.0</span>
            </h2>
            <p className="text-white/55 text-base max-w-[600px] mb-12 leading-relaxed">
              Join 1,500+ attendees at OAU's biggest tech gathering. Fill in the
              form below to secure your spot.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setRegistrationOpen(true)}
                className="cta-button"
                style={{ margin: "0 auto" }}
              >
                Open Registration Form →
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-8 text-center text-white/40 text-sm">
              <p>
                Spaces are limited. Register early to secure your spot at CSCON
                5.0.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* REACH */}
      <section
        id="reach"
        className="section"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "rgba(0, 245, 255, 0.01)",
        }}
      >
        <div
          style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.4 }}
        >
          <ReachScene targetCount={2000} />
        </div>
        <div className="max-container content-layer" style={{ zIndex: 2 }}>
          <FadeIn>
            <div className="eyebrow">The Reach</div>
            <h2
              className="display-heading"
              style={{ marginBottom: 24, maxWidth: 800 }}
            >
              Every person in the network.{" "}
              <span className="accent-cyan">Every signal matters.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ marginBottom: 60 }}>
              <ReachCounter />
              <div
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.5)",
                  marginTop: 8,
                }}
              >
                online reach across our marketing campaign
              </div>
            </div>
          </FadeIn>
          <div className="grid-3">
            {[
              {
                val: "1,500+",
                label: "In-room attendees",
                sub: "at Oduduwa Hall, OAU on July 8",
              },
              {
                val: "1M+",
                label: "Online reach",
                sub: "across all marketing phases",
              },
              {
                val: "30k+",
                label: "Student catchment",
                sub: "at Obafemi Awolowo University",
              },
            ].map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.1}>
                <div
                  className="card"
                  style={{
                    borderColor: "rgba(0,245,255,0.15)",
                    background: "rgba(0,245,255,0.03)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2.2rem",
                      fontWeight: 900,
                      color: "var(--cyan)",
                      letterSpacing: "-0.03em",
                      marginBottom: 6,
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    style={{ fontWeight: 700, marginBottom: 4, fontSize: 15 }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}
                  >
                    {s.sub}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SPEAKERS */}
      <section id="speakers" className="section">
        <div className="max-container content-layer">
          <FadeIn>
            <div className="eyebrow">The Calibre on Stage</div>
            <h2 className="display-heading" style={{ marginBottom: 16 }}>
              Proposed <span className="accent-green">speakers & voices</span>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 12,
                marginBottom: 48,
                fontStyle: "italic",
              }}
            >
              *Speaker line-up is targeted / proposed and subject to
              confirmation.
            </p>
          </FadeIn>
          {/* Keynote */}
          <FadeIn delay={0.05}>
            <div
              style={{
                background: "rgba(57,255,20,0.04)",
                border: "1px solid rgba(57,255,20,0.2)",
                borderRadius: 16,
                padding: "36px",
                display: "flex",
                gap: 28,
                alignItems: "flex-start",
                marginBottom: 48,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  background: "var(--green)",
                  color: "#000",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                AO
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--green)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  ★ Keynote Speaker
                </div>
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    marginBottom: 4,
                  }}
                >
                  Prof A.I Oluwaranti
                </div>
                <div
                  style={{
                    color: "var(--green)",
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  Professor Computing Engineering OAU
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.7,
                    maxWidth: 560,
                  }}
                >
                  His research spans wireless networks, cybersecurity, IoT and 
                  engineering education, and he currently serves as Director of 
                  OAU's Linkages and Partnership Office — bridging the university 
                  with industry and global partners.
                  <em>
                    "The Code of Ambition: From OAU Lecture Halls to Global Impact"
                  </em>{" "}
                  anchors CSCON 5.0.
                </p>
              </div>
            </div>
          </FadeIn>
          <div className="grid-3" style={{ gap: 16 }}>
            {speakers.map((s, i) => (
              <FadeIn key={s.name} delay={i * 0.06}>
                <div className="card" style={{ borderColor: `${s.color}20` }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      className="speaker-avatar"
                      style={{
                        background: s.bg,
                        color: s.color,
                        border: `1px solid ${s.color}30`,
                      }}
                    >
                      {s.initials}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 14,
                          marginBottom: 2,
                        }}
                      >
                        {s.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.5)",
                          lineHeight: 1.4,
                        }}
                      >
                        {s.role}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.4)",
                        lineHeight: 1.4,
                      }}
                    >
                      {s.note}
                    </div>
                    <span
                      className={trackPillStyle(s.track)}
                      style={{ flexShrink: 0, marginLeft: 8 }}
                    >
                      {s.track}
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section
        id="schedule"
        className="section"
        style={{ background: "rgba(255,255,255,0.01)" }}
      >
        <div className="max-container content-layer">
          <FadeIn>
            <div className="eyebrow">The Day</div>
            <h2 className="display-heading" style={{ marginBottom: 12 }}>
              A full-day <span className="accent-green">experience</span>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 14,
                marginBottom: 48,
              }}
            >
              July 8, 2026 · Oduduwa Hall, OAU · Ile-Ife, Nigeria
            </p>
          </FadeIn>
          <div style={{ maxWidth: 720 }}>
            {schedule.map((item, i) => (
              <FadeIn key={item.time} delay={i * 0.1}>
                <div className="timeline-item">
                  <div className="timeline-time">{item.time}</div>
                  <div>
                    <div
                      style={{ fontWeight: 700, marginBottom: 4, fontSize: 15 }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          {/* <FadeIn delay={0.3}>
            <div style={{ marginTop: 48 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                Signature Moments
              </div>
              <div className="grid-2">
                {[
                  {
                    tag: "Keynote",
                    text: '"Building a Digital Career in 2026"',
                  },
                  {
                    tag: "Create",
                    text: '"From 0 to Influence — Growing an Audience That Pays"',
                  },
                  {
                    tag: "Scale",
                    text: '"How to Start & Scale a Business as a Student"',
                  },
                  {
                    tag: "Build",
                    text: '"Breaking Into Tech & Building Real Products"',
                  },
                  {
                    tag: "Panel",
                    text: '"Creator vs Tech vs Business — Which Path Wins?"',
                  },
                  {
                    tag: "Workshop",
                    text: "Content strategy, product building & sales",
                  },
                ].map((m) => (
                  <div
                    key={m.text}
                    style={{
                      padding: "14px 18px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 8,
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      className="pill pill-green"
                      style={{ flexShrink: 0, fontSize: 9 }}
                    >
                      {m.tag}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.65)",
                        lineHeight: 1.5,
                      }}
                    >
                      {m.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn> */}
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="section">
        <div className="max-container content-layer">
          <FadeIn>
            <div className="eyebrow">Choose Your Level</div>
            <h2 className="display-heading" style={{ marginBottom: 16 }}>
              Sponsorship <span className="accent-green">packages</span>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 15,
                maxWidth: 580,
                marginBottom: 48,
                lineHeight: 1.7,
              }}
            >
              Four tiers designed to match your brand's goals and budget — each
              delivering escalating visibility, engagement and access.
            </p>
          </FadeIn>
          <div className="grid-4">
            {packages.map((pkg, i) => (
              <FadeIn key={pkg.name} delay={i * 0.1}>
                <div className={`pkg-card ${pkg.featured ? "featured" : ""}`}>
                  {pkg.featured && (
                    <div
                      style={{
                        background: "var(--green)",
                        color: "#000",
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        borderRadius: 4,
                        display: "inline-block",
                        marginBottom: -4,
                      }}
                    >
                      Most Impactful
                    </div>
                  )}
                  <div>
                    <div className="pkg-name">{pkg.name}</div>
                    <div className="pkg-price">₦{pkg.price}</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      flex: 1,
                    }}
                  >
                    {pkg.features.map((f) => (
                      <div key={f} className="pkg-feature">
                        {f}
                      </div>
                    ))}
                  </div>
                  <a
                    href="#contact"
                    className={`cta-button ${!pkg.featured ? "cta-button-outline" : ""}`}
                    style={{ textAlign: "center", justifyContent: "center" }}
                  >
                    Get Started
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.4}>
            <div
              style={{
                marginTop: 32,
                padding: "24px 28px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
              }}
            >
              <span style={{ color: "var(--green)", fontWeight: 800 }}>
                Custom partnerships welcome.
              </span>{" "}
              <span
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                Beyond cash sponsorship, we partner on equipment, prizes,
                hackathon challenges, venue, refreshments and media. Tell us
                your goals and we'll tailor a package that fits.
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* TRACK RECORD */}
      <section
        id="trackrecord"
        className="section"
        style={{ background: "rgba(57,255,20,0.01)" }}
      >
        <div className="max-container content-layer">
          <FadeIn>
            <div className="eyebrow">Five Editions of Impact</div>
            <h2 className="display-heading" style={{ marginBottom: 16 }}>
              CSCON <span className="accent-green">through the years</span>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 15,
                maxWidth: 580,
                marginBottom: 48,
                lineHeight: 1.7,
              }}
            >
              CSCON isn't a first attempt — it's a proven, repeatable event with
              a five-year track record of packing Oduduwa Hall and putting
              industry leaders in front of OAU's most ambitious students.
            </p>
          </FadeIn>
          <div className="grid-2">
            {[
              {
                edition: "CSCON 3.0 — 2023",
                theme: '"Untapped Tech"',
                desc: "Revolutionizing under-maximized technologies in Nigeria. A full Oduduwa Hall, a keynote from Prof. Aderounmu (Centre of Excellence), and a panel of fintech, blockchain, AI and product leaders.",
                sponsors: "Dimension 11 · Swyft · Afarahub · GoWagr · Edurex",
              },
              {
                edition: "CSCON 4.0 / CSFEST '25",
                theme: '"Sync or Sink"',
                desc: "CSCON headlined the week-long Computing Students' Festival — keynotes by alumni & tech leaders, industry panels, a hackathon, startup demos and the 'Who Wants To Be A Millionaire: Tech Edition' game show.",
                sponsors: "Main sponsor: Quickteller",
              },
            ].map((e, i) => (
              <FadeIn key={e.edition} delay={i * 0.1}>
                <div className="card">
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--green)",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {e.edition}
                  </div>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      marginBottom: 12,
                    }}
                  >
                    {e.theme}
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                      lineHeight: 1.7,
                      marginBottom: 16,
                    }}
                  >
                    {e.desc}
                  </p>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--green)",
                      fontWeight: 600,
                    }}
                  >
                    {e.sponsors}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PARTNER */}
      <section id="why" className="section">
        <div className="max-container content-layer">
          <FadeIn>
            <div className="eyebrow">The Value for Your Brand</div>
            <h2 className="display-heading" style={{ marginBottom: 48 }}>
              Why sponsor <span className="accent-green">CSCON 5.0?</span>
            </h2>
          </FadeIn>
          <div className="grid-3">
            {[
              {
                title: "Audience Access",
                desc: "Connect directly with 1,500+ young, engaged students and professionals — future customers, talent and brand advocates across OAU and Southwest Nigeria.",
                icon: "◉",
              },
              {
                title: "Sector Visibility",
                desc: "Gain visibility across three high-growth sectors — Tech, Business & Content — and associate your brand with innovation, youth and the creator economy.",
                icon: "◈",
              },
              {
                title: "Market Penetration",
                desc: "Amplify your brand through campus activations, influencer partnerships and post-event media exposure built into our 1M+ reach campaign.",
                icon: "◆",
              },
            ].map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.1}>
                <div
                  className="card"
                  style={{ borderColor: "rgba(57,255,20,0.12)" }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      color: "var(--green)",
                      marginBottom: 12,
                    }}
                  >
                    {v.icon}
                  </div>
                  <div
                    style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}
                  >
                    {v.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                      lineHeight: 1.7,
                    }}
                  >
                    {v.desc}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <div
              style={{
                marginTop: 48,
                padding: "32px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                Who's in the room
              </div>
              <div className="grid-3">
                {[
                  {
                    label: "Content Creators",
                    desc: "TikTok creators, YouTubers, influencers, writers and digital storytellers building & monetizing audiences.",
                  },
                  {
                    label: "Student Founders",
                    desc: "Startup founders, campus entrepreneurs and business owners scaling ventures while at OAU.",
                  },
                  {
                    label: "Tech Enthusiasts",
                    desc: "Developers, designers, product managers and AI enthusiasts breaking into the industry.",
                  },
                ].map((w) => (
                  <div key={w.label}>
                    <div
                      style={{
                        color: "var(--green)",
                        fontWeight: 700,
                        fontSize: 14,
                        marginBottom: 8,
                      }}
                    >
                      {w.label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.6,
                      }}
                    >
                      {w.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="section"
        style={{ background: "rgba(57,255,20,0.02)" }}
      >
        <div className="max-container content-layer">
          <FadeIn>
            <div className="eyebrow">Partner With Us</div>
            <h2 className="display-heading" style={{ marginBottom: 16 }}>
              Let's build it <span className="accent-green">together</span>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 15,
                maxWidth: 540,
                lineHeight: 1.7,
                marginBottom: 48,
              }}
            >
              Join us as a partner and help empower the next generation of
              creators, builders and innovators. We'd love to find the
              partnership that puts your brand at the centre of OAU's biggest
              tech moment.
            </p>
          </FadeIn>
          <div className="grid-2" style={{ maxWidth: 680, marginBottom: 40 }}>
            {[
              { label: "Contact", val: "Sunmade · Vee · Faisal" },
              { label: "Email", val: "nacosoau@gmail.com" },
              {
                label: "Phone",
                val: "+234 705 317 1777 · +234 705 877 0993 · +234 901 740 1460",
              },
              {
                label: "Socials",
                val: "X @Nacosoau · IG @nacosoauife · LinkedIn: Nacos OAU",
              },
            ].map((c) => (
              <FadeIn key={c.label} delay={0.05}>
                <div className="card">
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.35)",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    {c.val}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <div
              style={{
                background: "var(--green)",
                color: "#000",
                borderRadius: 14,
                padding: "32px 36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 20,
                maxWidth: 680,
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: "1.4rem",
                    marginBottom: 4,
                  }}
                >
                  Ready to sponsor CSCON 5.0?
                </div>
                <div style={{ fontSize: 14, opacity: 0.75 }}>
                  Reach out today — let's tailor a package around your brand's
                  goals.
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>
                  July 8, 2026
                </div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>
                  Oduduwa Hall · OAU
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "40px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="logo-cs">CS</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14 }}>
              CS<span style={{ color: "var(--green)" }}>CON</span> 5.0
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
              Create. Build. Scale.
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
          Nigerian Association of Computing Students · OAU Chapter · July 8,
          2026
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {["@Nacosoau", "@nacosoauife"].map((h) => (
            <span
              key={h}
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                fontWeight: 600,
              }}
            >
              {h}
            </span>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @media (max-width: 768px) { .nav-bar nav { display: none; } }
      `}</style>
      <RegistrationModal open={registrationOpen} onClose={() => setRegistrationOpen(false)} />
    </>
  );
}
