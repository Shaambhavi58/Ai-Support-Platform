import { useState, useEffect, useRef } from "react";

const BASE_URL = "https://ai-support-platform-production.up.railway.app";

// ─── ANIMATED BACKGROUND ─────────────────────────────────────────────────────
function AnimatedBG() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", background: "#000408" }}>
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Glow orbs */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,120,255,0.12) 0%, transparent 70%)",
        top: "-100px", left: "-100px", animation: "float1 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,220,180,0.08) 0%, transparent 70%)",
        bottom: "-50px", right: "10%", animation: "float2 10s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(120,80,255,0.08) 0%, transparent 70%)",
        top: "40%", right: "20%", animation: "float3 7s ease-in-out infinite",
      }} />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: Math.random() * 3 + 1 + "px",
          height: Math.random() * 3 + 1 + "px",
          borderRadius: "50%",
          background: `rgba(0,${150 + Math.floor(Math.random()*100)},255,${0.2 + Math.random()*0.4})`,
          left: Math.random() * 100 + "%",
          top: Math.random() * 100 + "%",
          animation: `particle ${4 + Math.random() * 6}s ease-in-out infinite`,
          animationDelay: Math.random() * 4 + "s",
        }} />
      ))}

      <style>{`
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,40px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,-30px)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }
        @keyframes particle { 0%,100%{transform:translateY(0);opacity:0.3} 50%{transform:translateY(-20px);opacity:1} }
      `}</style>
    </div>
  );
}

// ─── FEATURE PANEL ────────────────────────────────────────────────────────────
function FeaturePanel() {
  const features = [
    { icon: "⬟", title: "AI-Powered Responses", desc: "Claude generates context-aware replies in seconds" },
    { icon: "◈", title: "Smart Ticket Routing", desc: "Automatic prioritization and assignment" },
    { icon: "◎", title: "Real-time Analytics", desc: "Live dashboards with actionable insights" },
    { icon: "▣", title: "Knowledge Base AI", desc: "Instant article generation and search" },
  ];

  const stats = [
    { val: "94%", label: "CSAT Score" },
    { val: "4.2m", label: "Avg Response" },
    { val: "312", label: "AI Assists" },
  ];

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "60px 64px", position: "relative",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(0,220,255,0.5)", letterSpacing: "0.3em", marginBottom: 8 }}>SUPPORT_OS · ENTERPRISE</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg, rgba(0,120,255,0.8), rgba(0,220,180,0.6))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 0 20px rgba(0,120,255,0.4)",
          }}>⬟</div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>
              AI<span style={{ color: "#00dcff" }}>INTEL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Headline */}
      <div style={{ marginBottom: 48 }}>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif", fontSize: 42, fontWeight: 400,
          color: "#fff", lineHeight: 1.15, marginBottom: 16,
          letterSpacing: "-0.02em",
        }}>
          Support intelligence<br />
          <span style={{
            background: "linear-gradient(90deg, #00dcff, #0078ff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>built for scale.</span>
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 380 }}>
          The AI-native customer support platform used by engineering teams at the world's fastest-growing companies.
        </p>
      </div>

      {/* Features */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 48 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, animation: `fadeUp 0.5s ease both`, animationDelay: `${i * 0.1}s` }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: "rgba(0,120,255,0.1)", border: "1px solid rgba(0,120,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, color: "#00dcff",
            }}>{f.icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 2 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{
        display: "flex", gap: 0,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12, overflow: "hidden",
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            flex: 1, padding: "16px 20px", textAlign: "center",
            borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
          }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700, color: "#00dcff" }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 0 }}>
          {["G","M","A","S","T"].map((l, i) => (
            <div key={i} style={{
              width: 24, height: 24, borderRadius: "50%", marginLeft: i > 0 ? -8 : 0,
              background: `hsl(${i * 50 + 180}, 60%, 40%)`,
              border: "2px solid #000408", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff",
            }}>{l}</div>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Trusted by 500+ support teams</span>
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  );
}

// ─── AUTH FORM ────────────────────────────────────────────────────────────────
export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "agent" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    setError(""); setSuccess("");

    // Validation
    if (!form.email || !form.password) return setError("Please fill in all required fields.");
    if (mode === "register") {
      if (!form.name) return setError("Please enter your full name.");
      if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
      if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, role: form.role };

      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong");

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess(mode === "login" ? "Welcome back! Redirecting..." : "Account created! Redirecting...");
      setTimeout(() => onLogin(data.user), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: "100%", padding: "13px 16px", paddingLeft: "44px",
    background: focusedField === name ? "rgba(0,120,255,0.06)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${focusedField === name ? "rgba(0,120,255,0.5)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 10, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
    outline: "none", transition: "all 0.2s", boxShadow: focusedField === name ? "0 0 0 3px rgba(0,120,255,0.1)" : "none",
  });

  const iconStyle = {
    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
    fontSize: 15, color: "rgba(255,255,255,0.3)", pointerEvents: "none",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; background: #000408; font-family: 'DM Sans', sans-serif; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px #0a1020 inset !important; -webkit-text-fill-color: #fff !important; }
        select option { background: #0a1020; }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:none} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes checkmark { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
      `}</style>

      <AnimatedBG />

      <div style={{
        position: "relative", zIndex: 1, display: "flex", minHeight: "100vh",
      }}>
        {/* Left panel - only on large screens */}
        <div style={{
          flex: 1, display: "flex", borderRight: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.3)", backdropFilter: "blur(20px)",
        }}>
          <FeaturePanel />
        </div>

        {/* Right panel - Auth form */}
        <div style={{
          width: 480, display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "48px 48px", background: "rgba(0,4,12,0.7)", backdropFilter: "blur(30px)",
          animation: "slideIn 0.4s ease",
        }}>
          {/* Top */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(0,220,255,0.5)", letterSpacing: "0.2em", marginBottom: 8 }}>
              {mode === "login" ? "WELCOME BACK" : "GET STARTED"}
            </div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, fontWeight: 400, color: "#fff", letterSpacing: "-0.02em", marginBottom: 8 }}>
              {mode === "login" ? "Sign in to your workspace" : "Create your account"}
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
              {mode === "login"
                ? "Access your AI support command center"
                : "Join thousands of support teams using AI"}
            </p>
          </div>

          {/* SSO Buttons */}
          <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            {[
              { icon: "G", label: "Google", color: "#ea4335" },
              { icon: "M", label: "Microsoft", color: "#00a4ef" },
            ].map((p) => (
              <div key={p.label} style={{ flex: 1, position: "relative" }}
                onMouseEnter={e => e.currentTarget.querySelector(".sso-tooltip").style.opacity = "1"}
                onMouseLeave={e => e.currentTarget.querySelector(".sso-tooltip").style.opacity = "0"}
              >
                <button style={{
                  width: "100%", padding: "11px 16px", background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
                  color: "rgba(255,255,255,0.4)", cursor: "not-allowed", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: 8,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, transition: "all 0.2s",
                  opacity: 0.6,
                }} disabled>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", background: p.color, display: "inline-block", fontSize: 9, lineHeight: "16px", textAlign: "center", color: "#fff", fontWeight: 700, opacity: 0.7 }}>{p.icon}</span>
                  {p.label}
                  <span style={{
                    fontSize: 9, fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em",
                    background: "rgba(255,179,0,0.15)", color: "#ffb300",
                    border: "1px solid rgba(255,179,0,0.3)", padding: "2px 5px", borderRadius: 3,
                  }}>SOON</span>
                </button>
                {/* Tooltip */}
                <div className="sso-tooltip" style={{
                  position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
                  transform: "translateX(-50%)", background: "#0a1428",
                  border: "1px solid rgba(255,179,0,0.3)", borderRadius: 8,
                  padding: "8px 12px", fontSize: 11, color: "rgba(255,255,255,0.7)",
                  whiteSpace: "nowrap", opacity: 0, transition: "opacity 0.2s",
                  pointerEvents: "none", zIndex: 10,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}>
                  🚧 {p.label} SSO — Coming Soon
                  <div style={{
                    position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                    width: 0, height: 0, borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent", borderTop: "5px solid rgba(255,179,0,0.3)",
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>OR CONTINUE WITH EMAIL</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: error ? "shake 0.4s ease" : "none" }}>

            {/* Name - register only */}
            {mode === "register" && (
              <div>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500, display: "block", marginBottom: 6 }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <span style={iconStyle}>👤</span>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Shaambhavi Sharma"
                    onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                    style={inputStyle("name")} />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500, display: "block", marginBottom: 6 }}>Work Email</label>
              <div style={{ position: "relative" }}>
                <span style={iconStyle}>✉</span>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com"
                  onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  style={inputStyle("email")} />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Password</label>
                {mode === "login" && <span style={{ fontSize: 12, color: "#00dcff", cursor: "pointer" }}>Forgot password?</span>}
              </div>
              <div style={{ position: "relative" }}>
                <span style={iconStyle}>🔒</span>
                <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange}
                  placeholder={mode === "login" ? "Enter your password" : "Min. 6 characters"}
                  onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  style={{ ...inputStyle("password"), paddingRight: 44 }} />
                <button onClick={() => setShowPass(!showPass)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)",
                  fontSize: 14, padding: 4,
                }}>{showPass ? "🙈" : "👁"}</button>
              </div>
            </div>

            {/* Confirm Password */}
            {mode === "register" && (
              <div>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500, display: "block", marginBottom: 6 }}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <span style={iconStyle}>🔒</span>
                  <input name="confirmPassword" type={showPass ? "text" : "password"} value={form.confirmPassword} onChange={handleChange}
                    placeholder="Re-enter password"
                    onFocus={() => setFocusedField("confirmPassword")} onBlur={() => setFocusedField(null)}
                    style={inputStyle("confirmPassword")} />
                </div>
              </div>
            )}

            {/* Role - register only */}
            {mode === "register" && (
              <div>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500, display: "block", marginBottom: 6 }}>Role</label>
                <div style={{ position: "relative" }}>
                  <span style={iconStyle}>⬡</span>
                  <select name="role" value={form.role} onChange={handleChange}
                    onFocus={() => setFocusedField("role")} onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle("role"), appearance: "none", paddingRight: 40 }}>
                    <option value="admin">Admin</option>
                    <option value="agent">Support Agent</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }}>▾</span>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 16, padding: "12px 16px", background: "rgba(255,60,60,0.08)",
              border: "1px solid rgba(255,60,60,0.2)", borderRadius: 8,
              fontSize: 13, color: "#ff6b6b", display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              marginTop: 16, padding: "12px 16px", background: "rgba(0,229,160,0.08)",
              border: "1px solid rgba(0,229,160,0.2)", borderRadius: 8,
              fontSize: 13, color: "#00e5a0", display: "flex", alignItems: "center", gap: 8,
              animation: "checkmark 0.3s ease",
            }}>
              <span>✓</span> {success}
            </div>
          )}

          {/* Submit Button */}
          <button onClick={handleSubmit} disabled={loading} style={{
            marginTop: 20, width: "100%", padding: "14px",
            background: loading ? "rgba(0,120,255,0.3)" : "linear-gradient(135deg, #0078ff, #00dcff)",
            border: "none", borderRadius: 10, color: "#fff",
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s",
            boxShadow: loading ? "none" : "0 4px 24px rgba(0,120,255,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-1px)", e.currentTarget.style.boxShadow = "0 6px 30px rgba(0,120,255,0.5)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "none", e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,120,255,0.35)")}
          >
            {loading ? (
              <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Processing...</>
            ) : (
              mode === "login" ? "Sign in to workspace →" : "Create account →"
            )}
          </button>

          {/* Toggle mode */}
          <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setForm({ name: "", email: "", password: "", confirmPassword: "", role: "agent" }); }}
              style={{ color: "#00dcff", cursor: "pointer", fontWeight: 500 }}>
              {mode === "login" ? "Sign up free" : "Sign in"}
            </span>
          </div>

          {/* Terms */}
          {mode === "register" && (
            <p style={{ marginTop: 16, fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.6 }}>
              By creating an account you agree to our{" "}
              <span style={{ color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>Terms of Service</span> and{" "}
              <span style={{ color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>Privacy Policy</span>
            </p>
          )}

          {/* Security badge */}
          <div style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span style={{ fontSize: 12 }}>🔐</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>256-bit SSL encryption · SOC 2 Type II</span>
          </div>
        </div>
      </div>
    </>
  );
}
