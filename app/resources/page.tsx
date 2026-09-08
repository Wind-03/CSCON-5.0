"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/app/components/ui/Navbar";
import FadeIn from "@/app/components/ui/FadeIn";
import Eyebrow from "@/app/components/ui/Eyebrow";

const BackgroundScene = dynamic(
  () => import("@/app/components/scenes/BackgroundScene"),
  { ssr: false }
);

interface ResourceItem {
  id: string;
  title: string;
  speaker: string;
  role: string;
  session: string;
  pillClass: string;
  fileName: string;
  filePath: string;
  fileType: "PDF" | "PPTX";
  fileSize: string;
  accentColor: string;
  description: string;
}

const resources: ResourceItem[] = [
  {
    id: "kendrick-reverse-startup",
    title: "Reverse Startup Playbook",
    speaker: "Boluwatife Kendrick Olaniyan",
    role: "Founder, IFÁ Labs · Tech Entrepreneur",
    session: "Build Panel",
    pillClass: "pill pill-blue",
    fileName: "Reverse_Startup_Playbook.pdf",
    filePath: "/docs/Reverse_Startup_Playbook.pdf",
    fileType: "PDF",
    fileSize: "793 KB",
    accentColor: "#6BB5FF",
    description:
      "Strategic playbook on building stablecoin and DeFi payment infrastructure for emerging markets, multi-chain price oracles, and navigating web3 ventures.",
  },
  {
    id: "charles-build-create-scale",
    title: "Build, Create, Scale",
    speaker: "Sir Charles Omiyale",
    role: "Founder, COHMZ Consulting · IT Consultant & Serial Entrepreneur",
    session: "Keynote Speaker",
    pillClass: "pill pill-green",
    fileName: "Build_Create_Scale_Sir_Charles_Omiyale_Foundation v2.pptx",
    filePath: "/docs/Build_Create_Scale_Sir_Charles_Omiyale_Foundation v2.pptx",
    fileType: "PPTX",
    fileSize: "76 KB",
    accentColor: "#39FF14",
    description:
      "Enterprise framework for software engineering, global technology consulting, multi-venture creation, and scaling high-impact tech businesses.",
  },
  {
    id: "aina-keynote-ai-for-africa",
    title: "Keynote Speech 2026: AI for Africa",
    speaker: "Prof. Adeniran Isola Oluwaranti (Prof. Aina)",
    role: "Director of Linkages & Partnerships · Prof. of CS & Engineering, OAU",
    session: "Keynote Speaker",
    pillClass: "pill pill-purple",
    fileName: "NACOS_Keynote_Speech_2026_AI_for_Africa.pdf",
    filePath: "/docs/NACOS_Keynote_Speech_2026_AI_for_Africa.pdf",
    fileType: "PDF",
    fileSize: "3.6 MB",
    accentColor: "#C580FF",
    description:
      "Visionary keynote address on Artificial Intelligence development in Africa, academic-industry partnerships, and pervasive computing research.",
  },
];

export default function ResourcesPage() {
  const scrollProgress = useRef(0);

  return (
    <main
      className="min-h-screen text-white overflow-x-hidden font-[var(--font-header)]"
      style={{ background: "#151514" }}
    >
      {/* ── 3D canvas sits at z-0 behind everything ── */}
      <BackgroundScene scrollProgress={scrollProgress} />

      {/* ── Full-page dark overlay — same approach as landing page ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.75) 60%, rgba(5,5,5,0.92) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Navbar sits at z-50 by its own classes ── */}
      <Navbar />

      {/* ── HEADER: transparent bg, text readable via the overlay above ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          paddingTop: "9rem",
          paddingBottom: "4rem",
          paddingLeft: "clamp(1.5rem, 5vw, 5rem)",
          paddingRight: "clamp(1.5rem, 5vw, 5rem)",
        }}
      >
        <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <Eyebrow>CSCON 5.0 PROGRAM RESOURCES</Eyebrow>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#ffffff",
                margin: "1.25rem 0 1.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Program{" "}
              <span style={{ color: "var(--green)" }}>Resources</span>
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                lineHeight: 1.75,
                maxWidth: "36rem",
                margin: "0 auto",
              }}
            >
              Access and download official presentation decks, playbooks, and
              keynotes delivered by our speakers at CSCON 5.0.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* ── CARDS SECTION: relative, z-10, canvas ambient shows through ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3.5rem clamp(1.5rem, 5vw, 5rem) 6rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {resources.map((item, idx) => (
            <FadeIn key={item.id} delay={idx * 0.12}>
              <div
                className="group"
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  background: "rgba(28,28,26,0.92)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "1.25rem",
                  padding: "2.25rem",
                  transition: "border-color 0.3s, transform 0.3s",
                }}
              >
                {/* Top accent bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "1.5rem",
                    right: "1.5rem",
                    height: "2px",
                    borderRadius: "999px",
                    background: `linear-gradient(90deg, transparent, ${item.accentColor}, transparent)`,
                    opacity: 0.7,
                  }}
                />

                {/* Top section */}
                <div>
                  {/* Session pill + file badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <span className={item.pillClass}>{item.session}</span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.5)",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "6px",
                        padding: "3px 10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.fileType} · {item.fileSize}
                    </span>
                  </div>

                  {/* Resource title */}
                  <h2
                    style={{
                      fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                      fontWeight: 700,
                      color: "#ffffff",
                      marginBottom: "0.875rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </h2>

                  {/* Description */}
                  <p
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.825rem",
                      lineHeight: 1.75,
                      marginBottom: "1.75rem",
                      fontFamily: "var(--font-text)",
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Bottom section */}
                <div
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    paddingTop: "1.25rem",
                    marginTop: "auto",
                  }}
                >
                  {/* Speaker */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.875rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: item.accentColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "12px",
                        color: "#000",
                        flexShrink: 0,
                      }}
                    >
                      {item.speaker
                        .split(" ")
                        .filter((n) => !n.startsWith("(") && !n.endsWith(")"))
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p
                        style={{
                          fontSize: "10px",
                          color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          fontFamily: "monospace",
                          marginBottom: "2px",
                        }}
                      >
                        Speaker / Owner
                      </p>
                      <h3
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#fff",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.speaker}
                      </h3>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.5)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.role}
                      </p>
                    </div>
                  </div>

                  {/* Download button */}
                  <a
                    href={item.filePath}
                    download={item.fileName}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.625rem",
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.625rem",
                      background: item.accentColor,
                      color: "#000",
                      fontWeight: 800,
                      fontSize: "0.8rem",
                      letterSpacing: "0.04em",
                      textDecoration: "none",
                      transition: "opacity 0.2s, transform 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = "0.88";
                      (e.currentTarget as HTMLElement).style.transform = "scale(1.01)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = "1";
                      (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      style={{ width: "16px", height: "16px" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Download ({item.fileType})
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Footer */}
        <footer
          style={{
            marginTop: "5rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "2rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            fontSize: "12px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <p>© 2026 CSCON 5.0 · NACOS OAU. All rights reserved.</p>
          <a
            href="/"
            style={{
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--green)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")
            }
          >
            ← Back to Main Event Page
          </a>
        </footer>
      </div>
    </main>
  );
}
