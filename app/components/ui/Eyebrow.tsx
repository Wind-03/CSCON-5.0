export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block font-[var(--font-mono)] text-[0.65rem] tracking-[0.25em] uppercase text-[#39FF14] px-3 py-1.5 border border-[#39FF14]/30 rounded mb-6">
      {children}
    </span>
  );
}