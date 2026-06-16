"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleNavClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-16 py-3 sm:py-4 md:py-5 nav-bar"
        style={{
          background: scrolled
            ? "rgba(5,5,5,0.95)"
            : "linear-gradient(to bottom, rgba(5,5,5,0.8) 0%, transparent 100%)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
          backdropFilter: scrolled ? "none" : "blur(14px)",
          transition: "all 0.3s ease",
        }}
      >
        <a
          onClick={() => handleNavClick("hero")}
          className="flex items-center gap-1.5 sm:gap-2 md:gap-3 font-[var(--font-mono)] text-xs sm:text-sm font-bold tracking-wide cursor-pointer"
          style={{ textDecoration: "none" }}
        >
          <div
            className="logo-cs"
            style={{
              background: "var(--green)",
              color: "black",
              padding: "2px 5px sm:3px 6px md:4px 8px",
              borderRadius: "4px",
              fontSize: "9px sm:10px md:12px",
              fontWeight: "bold",
            }}
          >
            CS
          </div>
          <span className="logo-text hidden xs:inline">
            CS<span style={{ color: "var(--green)" }}>CON</span> 5.0
          </span>
          <span className="logo-text xs:hidden">
            CS<span style={{ color: "var(--green)" }}>CON</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 desktop-nav">
          <nav className="flex gap-4 lg:gap-6">
            {[
              { label: "About", id: "about" },
              { label: "Tracks", id: "tracks" },
              { label: "Speakers", id: "speakers" },
              { label: "Packages", id: "packages" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-white/60 hover:text-[var(--green)] text-xs lg:text-sm font-medium transition-colors duration-200 tracking-wide"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => handleNavClick("contact")}
            className="cta-button text-xs px-4 py-2 lg:px-5 lg:py-2.5 bg-[var(--green)] text-black font-bold rounded transition-all duration-200 hover:bg-white hover:text-black"
          >
            Sponsor Us
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-1.5 sm:p-2 mobile-nav"
          aria-label="Toggle menu"
        >
          <span
            className="block w-5 sm:w-6 h-0.5 bg-white transition-all duration-300"
            style={{
              transform: mobileMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }}
          />
          <span
            className="block w-5 sm:w-6 h-0.5 bg-white transition-all duration-300"
            style={{
              opacity: mobileMenuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-5 sm:w-6 h-0.5 bg-white transition-all duration-300"
            style={{
              transform: mobileMenuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }}
          />
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          y: mobileMenuOpen ? 0 : -20,
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-[56px] sm:top-[64px] left-0 right-0 bg-black/98 backdrop-blur-xl border-b border-white/5 p-4 sm:p-6 z-40 mobile-menu"
        style={{
          display: mobileMenuOpen ? "block" : "none",
          pointerEvents: mobileMenuOpen ? "auto" : "none",
        }}
      >
        <div className="flex flex-col gap-4 sm:gap-5 items-center">
          {[
            { label: "About", id: "about" },
            { label: "Tracks", id: "tracks" },
            { label: "Speakers", id: "speakers" },
            { label: "Packages", id: "packages" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full text-center text-white/80 hover:text-[var(--green)] text-base sm:text-lg font-medium transition-colors duration-200 py-2 sm:py-2.5"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("contact")}
            className="cta-button-mobile w-full text-center text-base sm:text-lg py-3 sm:py-3.5 bg-[var(--green)] text-black font-bold rounded transition-all duration-200 hover:bg-white hover:text-black mt-1 sm:mt-2"
          >
            Sponsor Us
          </button>
        </div>
      </motion.div>
    </>
  );
}