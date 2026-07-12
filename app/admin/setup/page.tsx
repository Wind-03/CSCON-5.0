"use client";
import { useState } from "react";

export default function SetupPage() {
  const [form, setForm] = useState({ email: "", password: "", name: "", secret: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/setup/seed-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }

      setStatus("done");
      setMessage(`✅ Admin ${data.status}: ${data.email}. Now delete this page.`);
    } catch {
      setStatus("error");
      setMessage("Request failed. Check the console/network tab.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#050505",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#0c0c0c",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: 32,
        }}
      >
        <div style={{ fontSize: 11, color: "#ff6b6b", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          ⚠ Temporary — delete after use
        </div>
        <h1 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", marginBottom: 24 }}>
          Seed admin account
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="email"
            required
            placeholder="Admin email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            style={inputStyle}
          />
          <input
            type="password"
            required
            placeholder="Admin password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Admin name (optional)"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            style={inputStyle}
          />
          <input
            type="password"
            required
            placeholder="SEED_SECRET"
            value={form.secret}
            onChange={(e) => setForm((f) => ({ ...f, secret: e.target.value }))}
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              marginTop: 8,
              padding: "12px 16px",
              borderRadius: 8,
              border: "none",
              background: "#39FF14",
              color: "#000",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {status === "loading" ? "Creating…" : "Create admin"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: 18,
              fontSize: 13,
              fontWeight: 600,
              color: status === "error" ? "#ff6b6b" : "#39FF14",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.03)",
  color: "#fff",
  fontSize: 14,
  outline: "none",
};