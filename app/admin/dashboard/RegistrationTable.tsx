"use client";
import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { TRACK_COLORS, type Registration, type Track } from "@/app/types/registration";

type ResendState = "idle" | "sending" | "sent" | "error";
type RemindState = "idle" | "reminding" | "reminded" | "error";
type PostponeState = "idle" | "sending" | "sent" | "error";

export default function RegistrationsTable() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState<Track | "All">("All");
  const [resendState, setResendState] = useState<Record<string, ResendState>>({});
  const [remindState, setRemindState] = useState<Record<string, RemindState>>({});
  const [postponeState, setPostponeState] = useState<PostponeState>("idle");
  const [postponeProgress, setPostponeProgress] = useState<{ total: number; sent: number; failed: number } | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/registration");
      if (!res.ok) throw new Error("Failed to load registrations");
      const data = await res.json();
      setRegistrations(data.registrations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend(id: string) {
    setResendState((s) => ({ ...s, [id]: "sending" }));
    try {
      const res = await fetch("/api/admin/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      setResendState((s) => ({ ...s, [id]: "sent" }));
      fetchRegistrations();
      setTimeout(() => setResendState((s) => ({ ...s, [id]: "idle" })), 3000);
    } catch {
      setResendState((s) => ({ ...s, [id]: "error" }));
      setTimeout(() => setResendState((s) => ({ ...s, [id]: "idle" })), 3000);
    }
  }

  async function handleRemind(id: string) {
    setRemindState((s) => ({ ...s, [id]: "reminding" }));
    try {
      const res = await fetch("/api/admin/remind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      setRemindState((s) => ({ ...s, [id]: "reminded" }));
      fetchRegistrations();
      setTimeout(() => setRemindState((s) => ({ ...s, [id]: "idle" })), 3000);
    } catch {
      setRemindState((s) => ({ ...s, [id]: "error" }));
      setTimeout(() => setRemindState((s) => ({ ...s, [id]: "idle" })), 3000);
    }
  }

  async function handlePostpone() {
    if (!confirm("Are you sure you want to send postponement notifications to ALL registered attendees?")) {
      return;
    }

    setPostponeState("sending");
    setPostponeProgress(null);
    
    try {
      const res = await fetch("/api/admin/send-postponement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send postponement emails");
      }
      
      const data = await res.json();
      setPostponeProgress({
        total: data.total,
        sent: data.success,
        failed: data.failed || 0,
      });
      
      setPostponeState("sent");
      fetchRegistrations();
      
      setTimeout(() => {
        setPostponeState("idle");
        setPostponeProgress(null);
      }, 5000);
    } catch (error) {
      console.error("Postponement error:", error);
      setPostponeState("error");
      setTimeout(() => {
        setPostponeState("idle");
        setPostponeProgress(null);
      }, 5000);
    }
  }

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const matchesTrack = trackFilter === "All" || r.track === trackFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.institution.toLowerCase().includes(q) ||
        r.accessCode.toLowerCase().includes(q);
      return matchesTrack && matchesSearch;
    });
  }, [registrations, search, trackFilter]);

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", padding: 20, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, institution, code…"
          style={{
            flex: "1 1 260px",
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.03)",
            color: "#fff",
            fontSize: 13,
            outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {(["All", "Build", "Create", "Scale"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTrackFilter(t)}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.12)",
                background: trackFilter === t ? "var(--green)" : "transparent",
                color: trackFilter === t ? "#000" : "rgba(255,255,255,0.6)",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          {filtered.length} of {registrations.length}
        </div>
        
        {/* Postpone All Button */}
        <button
          onClick={handlePostpone}
          disabled={postponeState === "sending"}
          style={{
            marginLeft: "auto",
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: postponeState === "sending" ? "not-allowed" : "pointer",
            border: "1px solid rgba(255,170,0,0.4)",
            background: postponeState === "sent" ? "var(--green)" : postponeState === "error" ? "#ff6b6b" : "rgba(255,170,0,0.1)",
            color: postponeState === "sent" ? "#000" : postponeState === "error" ? "#fff" : "#ffaa00",
            opacity: postponeState === "sending" ? 0.6 : 1,
          }}
        >
          {postponeState === "sending" ? "Sending..." : 
           postponeState === "sent" ? "✓ Sent!" : 
           postponeState === "error" ? "❌ Failed" : 
           "📅 Postpone All"}
        </button>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          style={{
            padding: "8px 14px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "transparent",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Sign out
        </button>
      </div>

      {/* Postpone Progress */}
      {postponeProgress && (
        <div style={{ 
          padding: "12px 20px", 
          background: "rgba(255,170,0,0.08)", 
          borderBottom: "1px solid rgba(255,170,0,0.15)",
          display: "flex",
          gap: 20,
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
            📊 Postponement sent to <strong style={{ color: "#39FF14" }}>{postponeProgress.sent}</strong> attendees
            {postponeProgress.failed > 0 && (
              <span style={{ color: "#ff6b6b", marginLeft: 8 }}>
                ❌ {postponeProgress.failed} failed
              </span>
            )}
          </span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            Total: {postponeProgress.total}
          </span>
        </div>
      )}

      {loading && <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>Loading…</div>}
      {error && <div style={{ padding: 40, textAlign: "center", color: "#ff6b6b" }}>{error}</div>}

      {!loading && !error && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {["Name", "Email", "Phone", "Institution", "Role", "Track", "Code", "Registered", "Email Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const track = TRACK_COLORS[r.track];
                const state = resendState[r._id || ""] || "idle";
                const reminderState = remindState[r._id || ""] || "idle";
                return (
                  <tr key={r._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={cellStyle}>
                      <span style={{ color: "#fff", fontWeight: 600 }}>{r.fullName}</span>
                    </td>
                    <td style={cellStyle}>{r.email}</td>
                    <td style={cellStyle}>{r.phone}</td>
                    <td style={cellStyle}>{r.institution}</td>
                    <td style={cellStyle}>{r.role}</td>
                    <td style={cellStyle}>
                      <span
                        style={{
                          background: track.accent,
                          color: "#000",
                          fontSize: 10,
                          fontWeight: 800,
                          padding: "3px 8px",
                          borderRadius: 4,
                        }}
                      >
                        {r.track}
                      </span>
                    </td>
                    <td style={{ ...cellStyle, fontFamily: "monospace", color: "var(--green)" }}>{r.accessCode}</td>
                    <td style={cellStyle}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td style={cellStyle}>
                      {r.emailSentAt ? (
                        <span style={{ color: "rgba(255,255,255,0.4)" }}>
                          Sent ×{r.emailSentCount}
                          {r.reminderSentAt && <span style={{ marginLeft: 6 }}>🔔</span>}
                        </span>
                      ) : (
                        <span style={{ color: "#ff6b6b" }}>Not sent</span>
                      )}
                    </td>
                    <td style={{ ...cellStyle, display: "flex", gap: 6, padding: "8px 16px" }}>
                      <button
                        onClick={() => r._id && handleResend(r._id)}
                        disabled={state === "sending"}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          border: "1px solid rgba(57,255,20,0.3)",
                          background: state === "sent" ? "var(--green)" : "transparent",
                          color: state === "sent" ? "#000" : "var(--green)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {state === "sending" ? "Sending…" : state === "sent" ? "✓" : state === "error" ? "Retry" : "Card"}
                      </button>
                      <button
                        onClick={() => r._id && handleRemind(r._id)}
                        disabled={reminderState === "reminding"}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          border: "1px solid rgba(57,255,20,0.3)",
                          background: reminderState === "reminded" ? "var(--green)" : "transparent",
                          color: reminderState === "reminded" ? "#000" : "var(--green)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {reminderState === "reminding" ? "…" : reminderState === "reminded" ? "✓" : reminderState === "error" ? "Retry" : "Remind"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                    No registrations match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const cellStyle: React.CSSProperties = {
  padding: "12px 16px",
  color: "rgba(255,255,255,0.65)",
  whiteSpace: "nowrap",
};