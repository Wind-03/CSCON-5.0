"use client";
import { useState } from "react";
import {
  ROLES,
  TRACKS,
  GOALS,
  PROJECT_STATUSES,
  TRACK_COLORS,
  type Role,
  type Track,
  type Goal,
  type ProjectStatus,
  type RegistrationInput,
} from "@/app/types/registration";

type Step = 1 | 2 | 3 | "success";

const EMPTY: RegistrationInput = {
  fullName: "",
  email: "",
  phone: "",
  institution: "",
  role: "" as Role,
  track: "" as Track,
  goal: "" as Goal,
  projectStatus: "" as ProjectStatus,
  source: "",
};

export default function RegistrationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<RegistrationInput>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function update<K extends keyof RegistrationInput>(key: K, value: RegistrationInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function step1Valid() {
    return form.fullName.trim() && form.email.trim() && form.phone.trim() && form.institution.trim() && form.role;
  }
  function step2Valid() {
    return form.track && form.goal && form.projectStatus;
  }
  function step3Valid() {
    return form.source.trim().length > 0;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    onClose();
    // Reset shortly after close animation so the closing view doesn't flash empty.
    setTimeout(() => {
      setStep(1);
      setForm(EMPTY);
      setError(null);
    }, 200);
  }

  const trackAccent = form.track ? TRACK_COLORS[form.track].accent : "var(--green)";

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#0c0c0c",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "32px 28px",
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "rgba(255,255,255,0.06)",
            border: "none",
            borderRadius: 8,
            width: 32,
            height: 32,
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ×
        </button>

        {step !== "success" && (
          <>
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                CSCON 5.0 · Registration
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: "6px 0 0 0" }}>
                {step === 1 && "Who are you?"}
                {step === 2 && "Why are you here?"}
                {step === 3 && "One last thing"}
              </h3>
            </div>

            {/* Step dots */}
            <div style={{ display: "flex", gap: 6, margin: "18px 0 28px 0" }}>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  style={{
                    height: 4,
                    flex: 1,
                    borderRadius: 2,
                    background: n <= (step as number) ? trackAccent : "rgba(255,255,255,0.1)",
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>

            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Field label="Full Name">
                  <input style={inputStyle} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Ada Lovelace" />
                </Field>
                <Field label="Email Address">
                  <input type="email" style={inputStyle} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="ada@example.com" />
                </Field>
                <Field label="Phone Number">
                  <input type="tel" style={inputStyle} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+234 800 000 0000" />
                </Field>
                <Field label="School / Institution">
                  <input style={inputStyle} value={form.institution} onChange={(e) => update("institution", e.target.value)} placeholder="Obafemi Awolowo University" />
                </Field>
                <Field label="What best describes you?">
                  <OptionGrid options={ROLES} value={form.role} onChange={(v) => update("role", v as Role)} accent={trackAccent} />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Field label="Which track excites you most?">
                  <div style={{ display: "flex", gap: 10 }}>
                    {TRACKS.map((t) => {
                      const c = TRACK_COLORS[t];
                      const active = form.track === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => update("track", t)}
                          style={{
                            flex: 1,
                            padding: "14px 8px",
                            borderRadius: 10,
                            border: `1px solid ${active ? c.accent : "rgba(255,255,255,0.1)"}`,
                            background: active ? `${c.accent}20` : "rgba(255,255,255,0.02)",
                            color: active ? c.accent : "rgba(255,255,255,0.6)",
                            fontWeight: 800,
                            fontSize: 13,
                            cursor: "pointer",
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <Field label="What do you want to leave CSCON 5.0 with?">
                  <OptionGrid options={GOALS} value={form.goal} onChange={(v) => update("goal", v as Goal)} accent={trackAccent} />
                </Field>
                <Field label="Are you currently working on anything?">
                  <OptionGrid options={PROJECT_STATUSES} value={form.projectStatus} onChange={(v) => update("projectStatus", v as ProjectStatus)} accent={trackAccent} />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Field label="How did you hear about CSCON 5.0?">
                  <input style={inputStyle} value={form.source} onChange={(e) => update("source", e.target.value)} placeholder="Twitter, a friend, a poster on campus…" />
                </Field>
              </div>
            )}

            {error && <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 16, fontWeight: 600 }}>{error}</div>}

            {/* Nav buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              {step !== 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => ((s as number) - 1) as Step)}
                  className="cta-button cta-button-outline"
                  style={{ flex: "0 0 auto" }}
                >
                  Back
                </button>
              )}
              {step !== 3 && (
                <button
                  type="button"
                  disabled={step === 1 ? !step1Valid() : !step2Valid()}
                  onClick={() => setStep((s) => ((s as number) + 1) as Step)}
                  className="cta-button"
                  style={{ flex: 1, justifyContent: "center", opacity: (step === 1 ? !step1Valid() : !step2Valid()) ? 0.4 : 1 }}
                >
                  Continue →
                </button>
              )}
              {step === 3 && (
                <button
                  type="button"
                  disabled={!step3Valid() || submitting}
                  onClick={handleSubmit}
                  className="cta-button"
                  style={{ flex: 1, justifyContent: "center", opacity: !step3Valid() || submitting ? 0.4 : 1 }}
                >
                  {submitting ? "Submitting…" : "Submit Registration"}
                </button>
              )}
            </div>
          </>
        )}

        {step === "success" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📩</div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
              Check your inbox, {form.fullName.split(" ")[0]}.
            </h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, maxWidth: 400, margin: "0 auto" }}>
              Your CSCON 5.0 access card is on its way to <strong style={{ color: "#fff" }}>{form.email}</strong>. Bring it with you on September 3rdth.
            </p>
            <button onClick={handleClose} className="cta-button" style={{ marginTop: 28, justifyContent: "center" }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function OptionGrid({
  options,
  value,
  onChange,
  accent,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  accent: string;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              padding: "9px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              border: `1px solid ${active ? accent : "rgba(255,255,255,0.1)"}`,
              background: active ? `${accent}20` : "rgba(255,255,255,0.02)",
              color: active ? accent : "rgba(255,255,255,0.7)",
            }}
          >
            {opt}
          </button>
        );
      })}
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