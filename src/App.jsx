import { useState, useEffect, useRef } from "react";
import { api } from "./api.js";

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #050a0f; --bg2: #0b1218; --bg3: #111820; --bg4: #182030;
      --border: rgba(0,220,255,0.12); --border-bright: rgba(0,220,255,0.35);
      --cyan: #00dcff; --cyan-dim: rgba(0,220,255,0.6); --cyan-glow: rgba(0,220,255,0.15);
      --amber: #ffb300; --green: #00e5a0; --red: #ff4757;
      --text: #e2eaf2; --text-dim: #7a90a4; --text-bright: #ffffff;
      --mono: 'Space Mono', monospace; --sans: 'DM Sans', sans-serif;
      --radius: 8px; --sidebar: 220px;
    }
    html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--sans); }
    #root { height: 100%; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg2); }
    ::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 2px; }
    @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(0,220,255,0.4)} 70%{box-shadow:0 0 0 10px rgba(0,220,255,0)} 100%{box-shadow:0 0 0 0 rgba(0,220,255,0)} }
    @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes floatDot { 0%,100%{transform:translateY(0);opacity:0.6} 50%{transform:translateY(-4px);opacity:1} }
    .fade-in { animation: fadeIn 0.3s ease both; }
    .btn { font-family:var(--mono);font-size:11px;letter-spacing:0.08em;border:1px solid var(--border);background:var(--bg3);color:var(--text);padding:8px 16px;border-radius:var(--radius);cursor:pointer;transition:all 0.2s;text-transform:uppercase; }
    .btn:hover { border-color:var(--cyan);color:var(--cyan);background:var(--cyan-glow); }
    .btn-primary { background:linear-gradient(135deg,rgba(0,220,255,0.15),rgba(0,220,255,0.05));border-color:var(--cyan);color:var(--cyan); }
    .btn-primary:hover { background:rgba(0,220,255,0.25); }
    .btn-sm { padding:5px 10px;font-size:10px; }
    .btn-danger { border-color:var(--red);color:var(--red); }
    .btn-danger:hover { background:rgba(255,71,87,0.1); }
    .tag { font-family:var(--mono);font-size:10px;letter-spacing:0.05em;padding:3px 8px;border-radius:3px;display:inline-flex;align-items:center;gap:4px; }
    .tag-open { background:rgba(0,220,255,0.12);color:var(--cyan);border:1px solid rgba(0,220,255,0.3); }
    .tag-closed { background:rgba(0,229,160,0.1);color:var(--green);border:1px solid rgba(0,229,160,0.3); }
    .tag-pending { background:rgba(255,179,0,0.1);color:var(--amber);border:1px solid rgba(255,179,0,0.3); }
    .tag-urgent { background:rgba(255,71,87,0.1);color:var(--red);border:1px solid rgba(255,71,87,0.3); }
    .tag-low { background:rgba(122,144,164,0.1);color:var(--text-dim);border:1px solid rgba(122,144,164,0.2); }
    input, textarea { background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:10px 14px;border-radius:var(--radius);font-family:var(--sans);font-size:14px;outline:none;width:100%;transition:border-color 0.2s; }
    input:focus, textarea:focus { border-color:var(--cyan); }
    textarea { resize:vertical;min-height:80px; }
    .card { background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:20px; }
    .card:hover { border-color:var(--border-bright); }
    .metric-val { font-family:var(--mono);font-size:28px;font-weight:700;color:var(--text-bright);line-height:1; }
    .metric-lbl { font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.1em;margin-top:4px; }
    .metric-delta { font-size:12px;margin-top:6px; }
    .delta-up { color:var(--green); } .delta-down { color:var(--red); }
    .spinner { width:16px;height:16px;border:2px solid var(--border);border-top-color:var(--cyan);border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block; }
    .thinking-dots span { display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--cyan);margin:0 2px;animation:floatDot 1s ease-in-out infinite; }
    .thinking-dots span:nth-child(2){animation-delay:0.15s} .thinking-dots span:nth-child(3){animation-delay:0.3s}
    .toast { position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:8px;font-size:13px;z-index:999;animation:fadeIn 0.3s ease; }
    .toast-success { background:rgba(0,229,160,0.15);border:1px solid rgba(0,229,160,0.3);color:var(--green); }
    .toast-error { background:rgba(255,71,87,0.15);border:1px solid rgba(255,71,87,0.3);color:var(--red); }
  `}</style>
);

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return <div className={`toast toast-${type}`}>{type === "success" ? "✓ " : "⚠ "}{message}</div>;
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "tickets", icon: "◈", label: "Tickets" },
  { id: "chat", icon: "◎", label: "Live Chat" },
  { id: "kb", icon: "▣", label: "Knowledge" },
  { id: "ai", icon: "⬟", label: "AI Studio" },
];

function Sidebar({ active, setActive, onLogout, user }) {
  return (
    <div style={{ width:"var(--sidebar)",minHeight:"100vh",background:"var(--bg2)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",padding:0,position:"fixed",top:0,left:0,zIndex:100 }}>
      <div style={{ padding:"24px 20px 20px",borderBottom:"1px solid var(--border)" }}>
        <div style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--text-dim)",letterSpacing:"0.2em",marginBottom:4 }}>SUPPORT_OS</div>
        <div style={{ fontFamily:"var(--mono)",fontSize:17,fontWeight:700,color:"var(--cyan)",letterSpacing:"0.05em" }}>AI<span style={{color:"var(--amber)"}}>INTEL</span></div>
      </div>
      <nav style={{ padding:"12px 0",flex:1 }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setActive(n.id)} style={{ display:"flex",alignItems:"center",gap:12,width:"100%",padding:"11px 20px",background:active===n.id?"rgba(0,220,255,0.08)":"none",border:"none",borderLeft:`2px solid ${active===n.id?"var(--cyan)":"transparent"}`,color:active===n.id?"var(--cyan)":"var(--text-dim)",cursor:"pointer",fontFamily:"var(--sans)",fontSize:13,fontWeight:active===n.id?600:400,transition:"all 0.15s",textAlign:"left" }}>
            <span style={{fontSize:16}}>{n.icon}</span>{n.label}
          </button>
        ))}
      </nav>
      <div style={{ padding:"16px 20px",borderTop:"1px solid var(--border)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
          <div style={{ width:7,height:7,borderRadius:"50%",background:"var(--green)",animation:"pulse-ring 2s infinite" }}></div>
          <span style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--green)",letterSpacing:"0.1em" }}>AI ONLINE</span>
        </div>
        {user && <div style={{ fontSize:11,color:"var(--text-dim)",marginBottom:8 }}>{user.name} · {user.role}</div>}
        <button className="btn btn-sm btn-danger" onClick={onLogout} style={{ width:"100%" }}>LOGOUT</button>
      </div>
    </div>
  );
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:16,width:480,maxHeight:"80vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.6)",animation:"fadeIn 0.2s ease" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px",borderBottom:"1px solid var(--border)" }}>
          <div style={{ fontFamily:"var(--mono)",fontSize:12,color:"var(--cyan)",letterSpacing:"0.1em" }}>{title}</div>
          <button className="btn btn-sm" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding:24 }}>{children}</div>
      </div>
    </div>
  );
}

function ProfileModal({ user, onClose, showToast }) {
  const [form, setForm] = useState({ name: user?.name||"", email: user?.email||"", currentPassword:"", newPassword:"" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    setTimeout(() => {
      showToast("Profile updated successfully!", "success");
      setSaving(false);
      onClose();
    }, 800);
  };

  return (
    <Modal title="MY PROFILE" onClose={onClose}>
      <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:24,padding:16,background:"var(--bg3)",borderRadius:10 }}>
        <div style={{ width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,var(--cyan),var(--amber))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:"#000",flexShrink:0 }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize:16,fontWeight:600,color:"var(--text-bright)" }}>{user?.name}</div>
          <div style={{ fontSize:12,color:"var(--text-dim)",marginTop:2 }}>{user?.email}</div>
          <div style={{ marginTop:6,display:"inline-flex",background:"rgba(0,220,255,0.1)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:4,padding:"2px 8px" }}>
            <span style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--cyan)" }}>{user?.role?.toUpperCase()}</span>
          </div>
        </div>
      </div>
      {[["Full Name","name","text"],["Email Address","email","email"]].map(([lbl,key,type]) => (
        <div key={key} style={{ marginBottom:14 }}>
          <div style={{ fontSize:12,color:"var(--text-dim)",marginBottom:6 }}>{lbl}</div>
          <input type={type} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} />
        </div>
      ))}
      <div style={{ borderTop:"1px solid var(--border)",margin:"20px 0",paddingTop:20 }}>
        <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text-dim)",letterSpacing:"0.1em",marginBottom:14 }}>CHANGE PASSWORD</div>
        {[["Current Password","currentPassword"],["New Password","newPassword"]].map(([lbl,key]) => (
          <div key={key} style={{ marginBottom:14 }}>
            <div style={{ fontSize:12,color:"var(--text-dim)",marginBottom:6 }}>{lbl}</div>
            <input type="password" value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} placeholder="••••••••" />
          </div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={save} disabled={saving} style={{ width:"100%" }}>
        {saving ? "SAVING..." : "SAVE CHANGES"}
      </button>
    </Modal>
  );
}

function SettingsModal({ onClose, showToast }) {
  const [settings, setSettings] = useState({ emailNotifs:true, aiAutoSuggest:true, darkMode:true, language:"English", timezone:"Asia/Kolkata", ticketsPerPage:"25" });

  const toggle = (key) => setSettings(s => ({...s,[key]:!s[key]}));

  const ToggleSwitch = ({ on, onClick }) => (
    <div onClick={onClick} style={{ width:40,height:22,borderRadius:11,background:on?"var(--cyan)":"var(--bg4)",border:`1px solid ${on?"var(--cyan)":"var(--border)"}`,cursor:"pointer",position:"relative",transition:"all 0.2s",flexShrink:0 }}>
      <div style={{ position:"absolute",top:2,left:on?20:2,width:16,height:16,borderRadius:"50%",background:on?"#000":"var(--text-dim)",transition:"left 0.2s" }}></div>
    </div>
  );

  return (
    <Modal title="ACCOUNT SETTINGS" onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
        {[
          { label:"Email Notifications", desc:"Get notified about new tickets via email", key:"emailNotifs", type:"toggle" },
          { label:"AI Auto-Suggest", desc:"Automatically suggest replies for tickets", key:"aiAutoSuggest", type:"toggle" },
          { label:"Dark Mode", desc:"Use dark theme across the app", key:"darkMode", type:"toggle" },
        ].map(s => (
          <div key={s.key} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid var(--border)" }}>
            <div>
              <div style={{ fontSize:13,color:"var(--text-bright)",marginBottom:2 }}>{s.label}</div>
              <div style={{ fontSize:11,color:"var(--text-dim)" }}>{s.desc}</div>
            </div>
            <ToggleSwitch on={settings[s.key]} onClick={() => toggle(s.key)} />
          </div>
        ))}
        <div style={{ padding:"14px 0",borderBottom:"1px solid var(--border)" }}>
          <div style={{ fontSize:13,color:"var(--text-bright)",marginBottom:8 }}>Language</div>
          <select value={settings.language} onChange={e => setSettings(s=>({...s,language:e.target.value}))} style={{ background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",padding:"8px 12px",borderRadius:"var(--radius)",width:"100%" }}>
            {["English","Hindi","Spanish","French","German"].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div style={{ padding:"14px 0",borderBottom:"1px solid var(--border)" }}>
          <div style={{ fontSize:13,color:"var(--text-bright)",marginBottom:8 }}>Timezone</div>
          <select value={settings.timezone} onChange={e => setSettings(s=>({...s,timezone:e.target.value}))} style={{ background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",padding:"8px 12px",borderRadius:"var(--radius)",width:"100%" }}>
            {["Asia/Kolkata","UTC","America/New_York","America/Los_Angeles","Europe/London"].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ padding:"14px 0" }}>
          <div style={{ fontSize:13,color:"var(--text-bright)",marginBottom:8 }}>Tickets per page</div>
          <select value={settings.ticketsPerPage} onChange={e => setSettings(s=>({...s,ticketsPerPage:e.target.value}))} style={{ background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",padding:"8px 12px",borderRadius:"var(--radius)",width:"100%" }}>
            {["10","25","50","100"].map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <button className="btn btn-primary" style={{ width:"100%",marginTop:8 }} onClick={() => { showToast("Settings saved!", "success"); onClose(); }}>SAVE SETTINGS</button>
    </Modal>
  );
}

function NotificationsModal({ onClose }) {
  const notifs = [
    { icon:"◈", color:"var(--cyan)", title:"New ticket created", desc:"TKT-012: Login issue reported by customer", time:"2 min ago", unread:true },
    { icon:"⬟", color:"var(--green)", title:"AI suggestion generated", desc:"Auto-reply created for TKT-011", time:"15 min ago", unread:true },
    { icon:"◎", color:"var(--amber)", title:"Ticket escalated", desc:"TKT-009 marked as urgent by Bob Smith", time:"1 hour ago", unread:true },
    { icon:"▣", color:"var(--cyan)", title:"Knowledge article viewed", desc:"Password Reset guide — 45 views today", time:"2 hours ago", unread:false },
    { icon:"◈", color:"var(--green)", title:"Ticket resolved", desc:"TKT-008: Billing issue closed successfully", time:"3 hours ago", unread:false },
    { icon:"⬟", color:"var(--text-dim)", title:"System update", desc:"Backend updated to latest version", time:"1 day ago", unread:false },
  ];

  return (
    <Modal title="NOTIFICATIONS" onClose={onClose}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
        <span style={{ fontSize:12,color:"var(--text-dim)" }}>{notifs.filter(n=>n.unread).length} unread</span>
        <button className="btn btn-sm">MARK ALL READ</button>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:2 }}>
        {notifs.map((n,i) => (
          <div key={i} style={{ display:"flex",gap:12,padding:"12px",borderRadius:8,background:n.unread?"rgba(0,220,255,0.04)":"none",border:n.unread?"1px solid rgba(0,220,255,0.08)":"1px solid transparent",cursor:"pointer",transition:"all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(0,220,255,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background=n.unread?"rgba(0,220,255,0.04)":"none"}>
            <div style={{ width:32,height:32,borderRadius:8,background:`rgba(0,0,0,0.3)`,border:`1px solid ${n.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:n.color,flexShrink:0 }}>{n.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                <div style={{ fontSize:13,fontWeight:n.unread?600:400,color:"var(--text-bright)" }}>{n.title}</div>
                {n.unread && <div style={{ width:6,height:6,borderRadius:"50%",background:"var(--cyan)",flexShrink:0,marginTop:4 }}></div>}
              </div>
              <div style={{ fontSize:12,color:"var(--text-dim)",marginTop:2,lineHeight:1.4 }}>{n.desc}</div>
              <div style={{ fontSize:11,color:"var(--text-dim)",marginTop:4,opacity:0.6 }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function APIKeysModal({ onClose }) {
  const [showKey, setShowKey] = useState(false);
  const groqKey = "gsk_••••••••••••••••••••••••••••••••";
  const maskedKey = groqKey.slice(0,12) + "••••••••••••••••••••••••••••••••••••" + groqKey.slice(-6);

  return (
    <Modal title="API KEYS" onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
        {/* Groq Key */}
        <div style={{ background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:10,padding:16 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
            <div>
              <div style={{ fontSize:13,fontWeight:600,color:"var(--text-bright)" }}>Groq API Key</div>
              <div style={{ fontSize:11,color:"var(--text-dim)",marginTop:2 }}>Powers all AI features · Llama 3.3 70B</div>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:4,background:"rgba(0,229,160,0.1)",border:"1px solid rgba(0,229,160,0.3)",borderRadius:4,padding:"3px 8px" }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:"var(--green)" }}></div>
              <span style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--green)" }}>ACTIVE</span>
            </div>
          </div>
          <div style={{ background:"var(--bg2)",borderRadius:6,padding:"10px 12px",fontFamily:"var(--mono)",fontSize:11,color:"var(--text-dim)",letterSpacing:"0.05em",marginBottom:10,wordBreak:"break-all" }}>
            {showKey ? groqKey : maskedKey}
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <button className="btn btn-sm" onClick={() => setShowKey(!showKey)}>{showKey?"🙈 Hide":"👁 Show"}</button>
            <button className="btn btn-sm" onClick={() => navigator.clipboard.writeText(groqKey)}>📋 Copy</button>
          </div>
        </div>

        {/* Usage Stats */}
        <div style={{ background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:10,padding:16 }}>
          <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text-dim)",letterSpacing:"0.1em",marginBottom:12 }}>USAGE THIS MONTH</div>
          {[["API Calls","1,247","of unlimited"],["Tokens Used","2.4M","of unlimited"],["Rate Limit","30 req/min","current plan"]].map(([lbl,val,sub]) => (
            <div key={lbl} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize:12,color:"var(--text-dim)" }}>{lbl}</span>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"var(--mono)",fontSize:12,color:"var(--cyan)" }}>{val}</div>
                <div style={{ fontSize:10,color:"var(--text-dim)" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding:12,background:"rgba(0,229,160,0.05)",border:"1px solid rgba(0,229,160,0.2)",borderRadius:8,fontSize:12,color:"var(--text-dim)" }}>
          🔒 API keys are stored securely in your .env file and never exposed to the browser.
        </div>
      </div>
    </Modal>
  );
}

function Topbar({ view, user, onLogout, showToast }) {
  const titles = { dashboard:"Command Center",tickets:"Ticket Management",chat:"Live Chat",kb:"Knowledge Base",ai:"AI Studio" };
  const [showProfile, setShowProfile] = useState(false);
  const [modal, setModal] = useState(null); // "profile"|"settings"|"notifications"|"apikeys"

  const openModal = (name) => { setShowProfile(false); setModal(name); };

  return (
    <>
      {modal === "profile" && <ProfileModal user={user} onClose={() => setModal(null)} showToast={showToast} />}
      {modal === "settings" && <SettingsModal onClose={() => setModal(null)} showToast={showToast} />}
      {modal === "notifications" && <NotificationsModal onClose={() => setModal(null)} />}
      {modal === "apikeys" && <APIKeysModal onClose={() => setModal(null)} />}

    <div style={{ height:56,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",borderBottom:"1px solid var(--border)",background:"rgba(5,10,15,0.8)",backdropFilter:"blur(10px)",position:"sticky",top:0,zIndex:50 }}>
      <div>
        <div style={{ fontFamily:"var(--mono)",fontSize:13,color:"var(--text-bright)",fontWeight:700 }}>{titles[view]}</div>
        <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text-dim)",letterSpacing:"0.1em" }}>{new Date().toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
      </div>
      <div style={{ display:"flex",gap:10,alignItems:"center",position:"relative" }}>
        <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--green)",background:"rgba(0,229,160,0.08)",border:"1px solid rgba(0,229,160,0.25)",padding:"4px 10px",borderRadius:4 }}>⬟ GROQ · LLAMA 3.3</div>

        {/* Profile Button */}
        <div style={{ position:"relative" }}>
          <div onClick={() => setShowProfile(!showProfile)}
            style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,var(--cyan),var(--amber))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#000",cursor:"pointer",border:showProfile?"2px solid var(--cyan)":"2px solid transparent",transition:"all 0.2s",boxShadow:showProfile?"0 0 12px rgba(0,220,255,0.4)":"none" }}>
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>

          {/* Dropdown */}
          {showProfile && (
            <>
              <div style={{ position:"fixed",inset:0,zIndex:98 }} onClick={() => setShowProfile(false)} />
              <div style={{ position:"absolute",top:"calc(100% + 10px)",right:0,width:240,background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:12,zIndex:99,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.5)",animation:"fadeIn 0.15s ease" }}>
                <div style={{ padding:"16px 16px 12px",borderBottom:"1px solid var(--border)",background:"rgba(0,220,255,0.03)" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <div style={{ width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,var(--cyan),var(--amber))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#000",flexShrink:0 }}>
                      {user?.name?.[0]?.toUpperCase() || "A"}
                    </div>
                    <div>
                      <div style={{ fontSize:13,fontWeight:600,color:"var(--text-bright)" }}>{user?.name || "User"}</div>
                      <div style={{ fontSize:11,color:"var(--text-dim)" }}>{user?.email || ""}</div>
                    </div>
                  </div>
                  <div style={{ marginTop:8,display:"inline-flex",alignItems:"center",gap:4,background:"rgba(0,220,255,0.1)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:4,padding:"2px 8px" }}>
                    <span style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--cyan)" }}>{user?.role?.toUpperCase() || "ADMIN"}</span>
                  </div>
                </div>

                {[
                  { icon:"◎", label:"My Profile", modal:"profile" },
                  { icon:"⬡", label:"Account Settings", modal:"settings" },
                  { icon:"▣", label:"Notifications", modal:"notifications" },
                  { icon:"◈", label:"API Keys", modal:"apikeys" },
                ].map(item => (
                  <div key={item.label} onClick={() => openModal(item.modal)}
                    style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 16px",cursor:"pointer",transition:"background 0.15s",fontSize:13,color:"var(--text)" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(0,220,255,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background="none"}>
                    <span style={{ color:"var(--text-dim)",fontSize:14 }}>{item.icon}</span>
                    {item.label}
                  </div>
                ))}

                <div style={{ borderTop:"1px solid var(--border)",margin:"4px 0" }} />
                <div onClick={() => { setShowProfile(false); onLogout(); }}
                  style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 16px",cursor:"pointer",fontSize:13,color:"var(--red)",transition:"background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(255,71,87,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.background="none"}>
                  <span style={{ fontSize:14 }}>⏻</span> Sign Out
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ showToast, setView, setTicketFilter }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch(console.error).finally(() => setLoading(false));
  }, []);

  const a = analytics;
  const handleCardClick = (lbl) => {
    if (lbl === "Total Tickets") { setTicketFilter("all"); setView("tickets"); }
    else if (lbl === "Open Now") { setTicketFilter("open"); setView("tickets"); }
    else if (lbl === "Resolved Today") { setTicketFilter("closed"); setView("tickets"); }
    else if (lbl === "AI Assists") { setView("ai"); }
    else if (lbl === "CSAT Score") setPopup("csat");
    else if (lbl === "Avg Response") setPopup("response");
  };

  const metrics = a ? [
    { val: a.total_tickets.toLocaleString(), lbl:"Total Tickets", delta:"+12% this month", up:true, icon:"◈", hint:"View all tickets →" },
    { val: a.open_tickets, lbl:"Open Now", delta:`${a.pending_tickets} pending`, up:false, icon:"◎", hint:"View open tickets →" },
    { val: a.avg_response_time, lbl:"Avg Response", delta:"↓ 38% vs last week", up:true, icon:"◷", hint:"Click for stats →" },
    { val: "94%", lbl:"CSAT Score", delta:"+2pts this week", up:true, icon:"⬡", hint:"View breakdown →" },
    { val: a.resolved_today, lbl:"Resolved Today", delta:"+8 vs avg", up:true, icon:"✓", hint:"View resolved →" },
    { val: a.ai_suggestions_used, lbl:"AI Assists", delta:"this month", up:true, icon:"⬟", hint:"Open AI Studio →" },
  ] : [];

  if (loading) return <div style={{ padding:40,display:"flex",justifyContent:"center" }}><div className="spinner"></div></div>;

  return (
    <div className="fade-in" style={{ padding:24 }}>

      {/* CSAT Popup */}
      {popup === "csat" && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={() => setPopup(null)}>
          <div className="card" style={{ width:400,padding:28 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <div style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--cyan)",letterSpacing:"0.1em" }}>CSAT BREAKDOWN</div>
              <button className="btn btn-sm" onClick={() => setPopup(null)}>✕ CLOSE</button>
            </div>
            {[["😊 Satisfied","78%","var(--green)"],["😐 Neutral","16%","var(--amber)"],["😞 Unsatisfied","6%","var(--red)"]].map(([lbl,pct,color]) => (
              <div key={lbl} style={{ marginBottom:16 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                  <span style={{ fontSize:13 }}>{lbl}</span>
                  <span style={{ fontFamily:"var(--mono)",fontSize:13,fontWeight:700,color }}>{pct}</span>
                </div>
                <div style={{ height:6,background:"var(--bg4)",borderRadius:3 }}>
                  <div style={{ height:"100%",width:pct,background:color,borderRadius:3 }}></div>
                </div>
              </div>
            ))}
            <div style={{ marginTop:16,padding:12,background:"var(--bg3)",borderRadius:8,fontSize:12,color:"var(--text-dim)" }}>
              Based on {a?.total_tickets || 0} total tickets this month
            </div>
          </div>
        </div>
      )}

      {/* Response Time Popup */}
      {popup === "response" && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={() => setPopup(null)}>
          <div className="card" style={{ width:400,padding:28 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <div style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--cyan)",letterSpacing:"0.1em" }}>RESPONSE TIME STATS</div>
              <button className="btn btn-sm" onClick={() => setPopup(null)}>✕ CLOSE</button>
            </div>
            {[["First Response","4.2m"],["Resolution Time","2.4h"],["AI Response","0.8s"],["Human Handoff","12m"]].map(([lbl,val]) => (
              <div key={lbl} style={{ display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--border)" }}>
                <span style={{ fontSize:13,color:"var(--text-dim)" }}>{lbl}</span>
                <span style={{ fontFamily:"var(--mono)",fontSize:16,fontWeight:700,color:"var(--cyan)" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24 }}>
        {metrics.map((m,i) => (
          <div key={i} className="card" onClick={() => handleCardClick(m.lbl)}
            style={{ position:"relative",overflow:"hidden",cursor:"pointer",transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(0,220,255,0.5)"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(0,220,255,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=""; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
            <div style={{ position:"absolute",top:0,right:0,width:80,height:80,background:`radial-gradient(circle,${i%2===0?"rgba(0,220,255,0.06)":"rgba(255,179,0,0.06)"} 0%,transparent 70%)` }}></div>
            <div style={{ position:"absolute",top:12,right:12,fontSize:18,opacity:0.15 }}>{m.icon}</div>
            <div className="metric-val">{m.val}</div>
            <div className="metric-lbl">{m.lbl}</div>
            <div className={`metric-delta ${m.up?"delta-up":"delta-down"}`}>{m.delta}</div>
            <div style={{ fontSize:10,color:"var(--cyan)",marginTop:6,fontFamily:"var(--mono)",opacity:0.5 }}>{m.hint}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr",gap:16 }}>
        <div className="card">
          <div style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--text-dim)",letterSpacing:"0.1em",marginBottom:16 }}>WEEKLY TICKET VOLUME</div>
          <div style={{ display:"flex",alignItems:"flex-end",gap:8,height:80 }}>
            {(a?.weekly_trend||[]).map((v,i) => {
              const max = Math.max(...(a?.weekly_trend||[1]));
              const days = ["M","T","W","T","F","S","S"];
              return (
                <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
                  <div style={{ width:"100%",height:`${(v/max)*65}px`,background:i===6?"var(--cyan)":"rgba(0,220,255,0.2)",borderRadius:"3px 3px 0 0",border:i===6?"1px solid var(--cyan)":"none",boxShadow:i===6?"0 0 10px rgba(0,220,255,0.4)":"none" }}></div>
                  <span style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text-dim)" }}>{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <div style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--text-dim)",letterSpacing:"0.1em",marginBottom:16 }}>BY CATEGORY</div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {(a?.category_breakdown||[]).slice(0,4).map((c,i) => {
              const colors = ["var(--cyan)","var(--amber)","var(--green)","var(--red)"];
              return (
                <div key={i}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                    <span style={{ fontSize:12,color:"var(--text)" }}>{c.label}</span>
                    <span style={{ fontFamily:"var(--mono)",fontSize:11,color:colors[i] }}>{c.count}</span>
                  </div>
                  <div style={{ height:4,background:"var(--bg4)",borderRadius:2 }}>
                    <div style={{ height:"100%",width:`${c.pct}%`,background:colors[i],borderRadius:2 }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TICKETS ─────────────────────────────────────────────────────────────────
function Tickets({ showToast, initialFilter }) {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [filter, setFilter] = useState(initialFilter || "all");
  const [creating, setCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject:"",description:"",customer_name:"",customer_email:"",priority:"normal",category:"General" });

  useEffect(() => { loadTickets(); }, [filter]);

  const loadTickets = async () => {
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const data = await api.getTickets(params);
      setTickets(data);
    } catch (e) { showToast("Failed to load tickets", "error"); }
  };

  const loadTicketDetail = async (t) => {
    try {
      const detail = await api.getTicket(t.id);
      setSelected(detail);
      setAiSuggestion(""); setReply("");
    } catch (e) { showToast("Failed to load ticket", "error"); }
  };

  const generateSuggestion = async () => {
    setAiSuggestion(""); setLoading(true);
    try {
      const res = await api.suggestReply(selected.id);
      setAiSuggestion(res.result);
      setReply(res.result);
      showToast("AI suggestion generated!", "success");
    } catch (e) { showToast("AI generation failed", "error"); }
    setLoading(false);
  };

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSendingReply(true);
    try {
      await api.addMessage(selected.id, reply, false);
      setReply("");
      await loadTicketDetail(selected);
      showToast("Reply sent!", "success");
    } catch (e) { showToast("Failed to send reply", "error"); }
    setSendingReply(false);
  };

  const closeTicket = async () => {
    try {
      await api.updateTicket(selected.id, { status: "closed" });
      showToast("Ticket closed!", "success");
      loadTickets();
      setSelected(null);
    } catch (e) { showToast("Failed to close ticket", "error"); }
  };

  const escalateTicket = async () => {
    try {
      await api.updateTicket(selected.id, { priority: "urgent" });
      showToast("Ticket escalated to urgent!", "success");
      await loadTicketDetail(selected);
    } catch (e) { showToast("Failed to escalate", "error"); }
  };

  const createTicket = async () => {
    if (!newTicket.subject || !newTicket.customer_name || !newTicket.customer_email) {
      showToast("Please fill in all required fields", "error"); return;
    }
    try {
      await api.createTicket(newTicket);
      showToast("Ticket created!", "success");
      setCreating(false);
      setNewTicket({ subject:"",description:"",customer_name:"",customer_email:"",priority:"normal",category:"General" });
      loadTickets();
    } catch (e) { showToast("Failed to create ticket", "error"); }
  };

  const filtered = tickets;

  return (
    <div className="fade-in" style={{ display:"flex",height:"calc(100vh - 56px)",overflow:"hidden" }}>
      {/* List */}
      <div style={{ width:380,borderRight:"1px solid var(--border)",overflow:"auto",flexShrink:0,display:"flex",flexDirection:"column" }}>
        <div style={{ padding:"14px 16px",borderBottom:"1px solid var(--border)",display:"flex",gap:6,flexWrap:"wrap" }}>
          {["all","open","pending","closed"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter===f?"btn-primary":""}`}>{f}</button>
          ))}
          <button onClick={() => setCreating(true)} className="btn btn-sm" style={{ marginLeft:"auto",borderColor:"var(--green)",color:"var(--green)" }}>+ NEW</button>
        </div>

        {/* Create form */}
        {creating && (
          <div style={{ padding:16,borderBottom:"1px solid var(--border)",background:"rgba(0,229,160,0.03)" }}>
            <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--green)",marginBottom:12 }}>NEW TICKET</div>
            {[
              ["Subject *", "subject", "text"],
              ["Customer Name *", "customer_name", "text"],
              ["Customer Email *", "customer_email", "email"],
            ].map(([lbl, key, type]) => (
              <div key={key} style={{ marginBottom:8 }}>
                <div style={{ fontSize:11,color:"var(--text-dim)",marginBottom:4 }}>{lbl}</div>
                <input type={type} value={newTicket[key]} onChange={e => setNewTicket({...newTicket,[key]:e.target.value})} />
              </div>
            ))}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8 }}>
              <div>
                <div style={{ fontSize:11,color:"var(--text-dim)",marginBottom:4 }}>Priority</div>
                <select value={newTicket.priority} onChange={e => setNewTicket({...newTicket,priority:e.target.value})} style={{ background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",padding:"8px",borderRadius:"var(--radius)",width:"100%" }}>
                  {["low","normal","high","urgent"].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize:11,color:"var(--text-dim)",marginBottom:4 }}>Category</div>
                <select value={newTicket.category} onChange={e => setNewTicket({...newTicket,category:e.target.value})} style={{ background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",padding:"8px",borderRadius:"var(--radius)",width:"100%" }}>
                  {["General","Auth","Billing","API","Bug","UX","Product"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <button className="btn btn-primary btn-sm" onClick={createTicket}>CREATE</button>
              <button className="btn btn-sm" onClick={() => setCreating(false)}>CANCEL</button>
            </div>
          </div>
        )}

        {/* Ticket list */}
        <div style={{ flex:1,overflow:"auto" }}>
          {filtered.length === 0 && (
            <div style={{ padding:32,textAlign:"center",color:"var(--text-dim)",fontSize:13 }}>No tickets found</div>
          )}
          {filtered.map(t => (
            <div key={t.id} onClick={() => loadTicketDetail(t)}
              style={{ padding:"14px 16px",cursor:"pointer",borderBottom:"1px solid var(--border)",background:selected?.id===t.id?"rgba(0,220,255,0.05)":"none",borderLeft:`2px solid ${selected?.id===t.id?"var(--cyan)":"transparent"}`,transition:"all 0.15s" }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                <span style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--text-dim)" }}>{t.ticket_number}</span>
                <span style={{ fontSize:11,color:"var(--text-dim)" }}>{new Date(t.created_at).toLocaleDateString()}</span>
              </div>
              <div style={{ fontSize:13,fontWeight:500,color:"var(--text-bright)",marginBottom:6 }}>{t.subject}</div>
              <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                <span className={`tag ${t.status==="open"?"tag-open":t.status==="pending"?"tag-pending":"tag-closed"}`}>{t.status}</span>
                <span className={`tag ${t.priority==="urgent"?"tag-urgent":t.priority==="high"?"tag-pending":"tag-low"}`}>{t.priority}</span>
                <span style={{ fontSize:11,color:"var(--text-dim)",marginLeft:"auto" }}>{t.customer_name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      {selected ? (
        <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
          <div style={{ padding:"20px 24px",borderBottom:"1px solid var(--border)",flexShrink:0 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
              <div>
                <div style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--text-dim)",marginBottom:4 }}>{selected.ticket_number} · {selected.category}</div>
                <div style={{ fontSize:18,fontWeight:600,color:"var(--text-bright)" }}>{selected.subject}</div>
                <div style={{ fontSize:13,color:"var(--text-dim)",marginTop:4 }}>{selected.customer_name} · {selected.customer_email}</div>
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <span className={`tag ${selected.status==="open"?"tag-open":selected.status==="pending"?"tag-pending":"tag-closed"}`}>{selected.status}</span>
                <span className={`tag ${selected.priority==="urgent"?"tag-urgent":"tag-pending"}`}>{selected.priority}</span>
              </div>
            </div>
          </div>

          <div style={{ flex:1,overflow:"auto",padding:"20px 24px" }}>
            {/* Messages */}
            <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:20 }}>
              {selected.messages?.length === 0 && (
                <div style={{ padding:16,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:10,maxWidth:"70%" }}>
                  <div style={{ fontSize:11,color:"var(--text-dim)",marginBottom:6 }}>{selected.customer_name} · Customer</div>
                  <div style={{ fontSize:14 }}>{selected.description || `Hello, I need help with: ${selected.subject}`}</div>
                </div>
              )}
              {selected.messages?.map((m, i) => (
                <div key={i} style={{ display:"flex",justifyContent:m.is_customer?"flex-start":"flex-end" }}>
                  <div style={{ maxWidth:"70%",background:m.is_customer?"var(--bg3)":m.is_ai_generated?"rgba(0,220,255,0.07)":"rgba(255,179,0,0.07)",border:`1px solid ${m.is_customer?"var(--border)":m.is_ai_generated?"rgba(0,220,255,0.2)":"rgba(255,179,0,0.2)"}`,borderRadius:10,padding:"12px 16px" }}>
                    <div style={{ fontSize:11,color:"var(--text-dim)",marginBottom:6 }}>
                      {m.is_customer ? selected.customer_name : m.is_ai_generated ? "⬟ AI · Agent" : "Agent"}
                      {" · "}{new Date(m.created_at).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                    </div>
                    <div style={{ fontSize:14,lineHeight:1.6 }}>{m.content}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Suggestion */}
            <div style={{ background:"rgba(0,220,255,0.04)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:10,padding:16,marginBottom:16 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
                <span style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--cyan)",letterSpacing:"0.1em" }}>⬟ AI SUGGESTION</span>
                <button className="btn btn-sm btn-primary" onClick={generateSuggestion} disabled={loading}>
                  {loading ? <span className="spinner"></span> : "GENERATE"}
                </button>
              </div>
              {loading && <div className="thinking-dots" style={{padding:"8px 0"}}><span></span><span></span><span></span></div>}
              {aiSuggestion && !loading && <div style={{ fontSize:13,color:"var(--text)",lineHeight:1.6 }}>{aiSuggestion}</div>}
              {!aiSuggestion && !loading && <div style={{ fontSize:12,color:"var(--text-dim)" }}>Click GENERATE to get an AI-powered response suggestion</div>}
            </div>

            {/* Reply Box */}
            <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." style={{ marginBottom:10,minHeight:100 }} />
            <div style={{ display:"flex",gap:8 }}>
              <button className="btn btn-primary" onClick={sendReply} disabled={sendingReply}>
                {sendingReply ? <span className="spinner"></span> : "SEND REPLY"}
              </button>
              <button className="btn" onClick={closeTicket}>CLOSE TICKET</button>
              <button className="btn" onClick={escalateTicket}>ESCALATE</button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <div style={{ textAlign:"center",color:"var(--text-dim)" }}>
            <div style={{ fontSize:40,marginBottom:12 }}>◈</div>
            <div style={{ fontFamily:"var(--mono)",fontSize:12 }}>SELECT A TICKET</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LIVE CHAT ────────────────────────────────────────────────────────────────
function LiveChat({ showToast }) {
  const [messages, setMessages] = useState([
    { role:"assistant", text:"Hi! I'm your AI support assistant. How can I help you today?", ts:"Just now" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentiment, setSentiment] = useState("neutral");
  const [sessionId, setSessionId] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [transferred, setTransferred] = useState(false);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [ticketForm, setTicketForm] = useState({ name:"", email:"", subject:"" });
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading || sessionEnded) return;
    const userMsg = input.trim();
    setInput("");
    const now = new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    const newMessages = [...messages, { role:"user",text:userMsg,ts:now }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const history = newMessages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      const res = await api.chat(history, sessionId);
      setSessionId(res.session_id);
      setMessages(prev => [...prev, { role:"assistant",text:res.result,ts:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}) }]);
      const lower = userMsg.toLowerCase();
      if (lower.includes("angry")||lower.includes("frustrated")||lower.includes("worst")||lower.includes("broken")) setSentiment("negative");
      else if (lower.includes("thank")||lower.includes("great")||lower.includes("perfect")) setSentiment("positive");
      else setSentiment("neutral");
    } catch (e) { showToast("Chat error, try again", "error"); }
    setLoading(false);
  };

  const handleCreateTicket = async () => {
    if (!ticketForm.name || !ticketForm.email || !ticketForm.subject) {
      showToast("Please fill in all fields", "error"); return;
    }
    try {
      // Build description from chat history
      const chatLog = messages.map(m => `${m.role === "user" ? "Customer" : "AI"}: ${m.text}`).join("\n");
      await api.createTicket({
        subject: ticketForm.subject,
        description: `Created from live chat.\n\nChat transcript:\n${chatLog}`,
        customer_name: ticketForm.name,
        customer_email: ticketForm.email,
        priority: sentiment === "negative" ? "urgent" : "normal",
        category: "General",
      });
      showToast("Ticket created from chat!", "success");
      setShowCreateTicket(false);
      setTicketForm({ name:"", email:"", subject:"" });
      // Add system message
      setMessages(prev => [...prev, { role:"assistant", text:"✓ A support ticket has been created for you. Our team will follow up via email shortly.", ts:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}) }]);
    } catch (e) { showToast("Failed to create ticket", "error"); }
  };

  const handleTransfer = () => {
    setTransferred(true);
    setMessages(prev => [...prev, {
      role:"assistant",
      text:"I'm transferring you to a human support agent now. Please hold on — an agent will join this conversation shortly. Your wait time is approximately 2-3 minutes.",
      ts:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})
    }]);
    showToast("Transferred to human agent!", "success");
  };

  const handleEndSession = () => {
    setSessionEnded(true);
    setMessages(prev => [...prev, {
      role:"assistant",
      text:"This chat session has ended. Thank you for contacting support! If you need further assistance, feel free to start a new chat. Have a great day! 👋",
      ts:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})
    }]);
    showToast("Session ended", "success");
  };

  const sentimentColor = { positive:"var(--green)",neutral:"var(--cyan)",negative:"var(--red)" };

  return (
    <div className="fade-in" style={{ display:"flex",height:"calc(100vh - 56px)" }}>
      <div style={{ flex:1,display:"flex",flexDirection:"column" }}>
        <div style={{ flex:1,overflow:"auto",padding:24,display:"flex",flexDirection:"column",gap:16 }}>
          {messages.map((m,i) => (
            <div key={i} className="fade-in" style={{ display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:10 }}>
              {m.role==="assistant" && (
                <div style={{ width:30,height:30,borderRadius:"50%",background:transferred?"rgba(255,179,0,0.15)":"rgba(0,220,255,0.15)",border:`1px solid ${transferred?"var(--amber)":"var(--cyan)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:transferred?"var(--amber)":"var(--cyan)",flexShrink:0,marginTop:4 }}>{transferred?"👤":"⬟"}</div>
              )}
              <div style={{ maxWidth:"60%" }}>
                <div style={{ background:m.role==="user"?"rgba(0,220,255,0.1)":"var(--bg3)",border:`1px solid ${m.role==="user"?"rgba(0,220,255,0.3)":"var(--border)"}`,borderRadius:m.role==="user"?"16px 4px 16px 16px":"4px 16px 16px 16px",padding:"12px 16px",fontSize:14,lineHeight:1.6 }}>
                  {m.text}
                </div>
                <div style={{ fontSize:11,color:"var(--text-dim)",marginTop:4,textAlign:m.role==="user"?"right":"left" }}>{m.ts}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
              <div style={{ width:30,height:30,borderRadius:"50%",background:"rgba(0,220,255,0.15)",border:"1px solid var(--cyan)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"var(--cyan)" }}>⬟</div>
              <div style={{ background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"4px 16px 16px 16px",padding:"14px 18px" }}>
                <div className="thinking-dots"><span></span><span></span><span></span></div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Create Ticket Form */}
        {showCreateTicket && (
          <div style={{ padding:16,borderTop:"1px solid var(--border)",background:"rgba(0,229,160,0.03)",borderBottom:"1px solid rgba(0,229,160,0.2)" }}>
            <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--green)",marginBottom:12 }}>CREATE TICKET FROM CHAT</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8 }}>
              <input placeholder="Your name *" value={ticketForm.name} onChange={e => setTicketForm({...ticketForm,name:e.target.value})} />
              <input placeholder="Your email *" value={ticketForm.email} onChange={e => setTicketForm({...ticketForm,email:e.target.value})} />
            </div>
            <input placeholder="Issue subject *" value={ticketForm.subject} onChange={e => setTicketForm({...ticketForm,subject:e.target.value})} style={{ marginBottom:8 }} />
            <div style={{ display:"flex",gap:8 }}>
              <button className="btn btn-sm btn-primary" onClick={handleCreateTicket}>CREATE TICKET</button>
              <button className="btn btn-sm" onClick={() => setShowCreateTicket(false)}>CANCEL</button>
            </div>
          </div>
        )}

        <div style={{ padding:16,borderTop:"1px solid var(--border)",display:"flex",gap:10 }}>
          {sessionEnded ? (
            <div style={{ flex:1,padding:"10px 14px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"var(--radius)",fontSize:13,color:"var(--text-dim)" }}>
              Session ended — refresh to start a new chat
            </div>
          ) : (
            <>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send()} placeholder="Type a message..." style={{ flex:1 }} />
              <button className="btn btn-primary" onClick={send} disabled={loading}>SEND</button>
            </>
          )}
        </div>
      </div>

      <div style={{ width:260,borderLeft:"1px solid var(--border)",padding:20,display:"flex",flexDirection:"column",gap:20 }}>
        <div>
          <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text-dim)",letterSpacing:"0.1em",marginBottom:12 }}>SESSION INFO</div>
          {[
            ["Messages", messages.length],
            ["Session", sessionId?sessionId.slice(0,8)+"...":"New"],
            ["Status", sessionEnded?"Ended":transferred?"With Human":"Active"],
          ].map(([k,v]) => (
            <div key={k} style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
              <span style={{ fontSize:12,color:"var(--text-dim)" }}>{k}</span>
              <span style={{ fontFamily:"var(--mono)",fontSize:12,color:sessionEnded?"var(--red)":transferred?"var(--amber)":"var(--green)" }}>{v}</span>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text-dim)",letterSpacing:"0.1em",marginBottom:12 }}>SENTIMENT</div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:10,height:10,borderRadius:"50%",background:sentimentColor[sentiment],boxShadow:`0 0 8px ${sentimentColor[sentiment]}` }}></div>
            <span style={{ fontFamily:"var(--mono)",fontSize:12,color:sentimentColor[sentiment] }}>{sentiment.toUpperCase()}</span>
          </div>
        </div>

        <div>
          <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text-dim)",letterSpacing:"0.1em",marginBottom:12 }}>QUICK ACTIONS</div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>

            {/* Create Ticket */}
            <button className="btn btn-sm" onClick={() => setShowCreateTicket(!showCreateTicket)}
              style={{ textAlign:"left",borderColor:"var(--green)",color:"var(--green)",display:"flex",alignItems:"center",gap:8 }}
              disabled={sessionEnded}>
              🎫 Create Ticket
            </button>

            {/* Transfer to Human */}
            <button className="btn btn-sm" onClick={handleTransfer}
              style={{ textAlign:"left",borderColor:transferred?"var(--text-dim)":"var(--amber)",color:transferred?"var(--text-dim)":"var(--amber)",display:"flex",alignItems:"center",gap:8 }}
              disabled={transferred||sessionEnded}>
              👤 {transferred ? "Transferred ✓" : "Transfer to Human"}
            </button>

            {/* End Session */}
            <button className="btn btn-sm" onClick={handleEndSession}
              style={{ textAlign:"left",borderColor:sessionEnded?"var(--text-dim)":"var(--red)",color:sessionEnded?"var(--text-dim)":"var(--red)",display:"flex",alignItems:"center",gap:8 }}
              disabled={sessionEnded}>
              ✕ {sessionEnded ? "Session Ended ✓" : "End Session"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KNOWLEDGE BASE ───────────────────────────────────────────────────────────
function KnowledgeBase({ showToast }) {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [aiTip, setAiTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [articleContent, setArticleContent] = useState("");
  const [loadingArticle, setLoadingArticle] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newArticle, setNewArticle] = useState({ title:"", category:"General" });
  const [generatingArticle, setGeneratingArticle] = useState(false);

  useEffect(() => { loadArticles(); }, []);

  const loadArticles = async (q = "") => {
    try {
      const params = q ? { search: q } : {};
      const data = await api.getArticles(params);
      setArticles(data);
    } catch (e) { console.error(e); }
  };

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setAiTip("");
    try {
      await loadArticles(query);
      const tip = await api.kbSearch(query);
      setAiTip(tip.result);
    } catch (e) { showToast("Search failed", "error"); }
    setLoading(false);
  };

  const openArticle = async (article) => {
    setSelected(article); setArticleContent(""); setLoadingArticle(true);
    try {
      if (article.content && article.content.length > 50) {
        setArticleContent(article.content);
      } else {
        const res = await api.generateArticle(article.title);
        setArticleContent(res.result);
      }
    } catch (e) { showToast("Failed to load article", "error"); }
    setLoadingArticle(false);
  };

  const createArticle = async () => {
    if (!newArticle.title.trim()) { showToast("Please enter a title", "error"); return; }
    setGeneratingArticle(true);
    try {
      // Generate content with AI first
      const res = await api.generateArticle(newArticle.title);
      // Save to database
      const saved = await api.createArticle({
        title: newArticle.title,
        content: res.result,
        category: newArticle.category,
        is_published: true,
      });
      showToast("Article created with AI!", "success");
      setCreating(false);
      setNewArticle({ title:"", category:"General" });
      await loadArticles();
      // Open the newly created article
      if (saved) openArticle({ ...saved, content: res.result });
    } catch (e) { showToast("Failed to create article", "error"); }
    setGeneratingArticle(false);
  };

  return (
    <div className="fade-in" style={{ display:"flex",height:"calc(100vh - 56px)" }}>
      <div style={{ width:380,borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column" }}>
        <div style={{ padding:20,borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex",gap:8,marginBottom:10 }}>
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key==="Enter" && search()} placeholder="Search knowledge base..." />
            <button className="btn btn-primary" onClick={search} style={{ flexShrink:0 }}>{loading ? <span className="spinner"></span> : "SEARCH"}</button>
          </div>
          <button onClick={() => setCreating(!creating)} className="btn btn-sm" style={{ width:"100%",borderColor:"var(--green)",color:"var(--green)" }}>
            {creating ? "✕ CANCEL" : "+ NEW ARTICLE"}
          </button>
          {aiTip && <div style={{ marginTop:12,padding:12,background:"rgba(0,220,255,0.05)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:8,fontSize:13,color:"var(--text-dim)" }}>
            <span style={{ color:"var(--cyan)",fontFamily:"var(--mono)",fontSize:10 }}>⬟ AI TIP: </span>{aiTip}
          </div>}
        </div>

        {/* Create Article Form */}
        {creating && (
          <div style={{ padding:16,borderBottom:"1px solid var(--border)",background:"rgba(0,229,160,0.03)" }}>
            <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--green)",marginBottom:12,letterSpacing:"0.1em" }}>NEW ARTICLE</div>
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:11,color:"var(--text-dim)",marginBottom:5 }}>Article Title *</div>
              <input
                value={newArticle.title}
                onChange={e => setNewArticle({...newArticle,title:e.target.value})}
                placeholder="e.g. How to reset your password"
                onKeyDown={e => e.key==="Enter" && createArticle()}
              />
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:11,color:"var(--text-dim)",marginBottom:5 }}>Category</div>
              <select value={newArticle.category} onChange={e => setNewArticle({...newArticle,category:e.target.value})}
                style={{ background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",padding:"8px 12px",borderRadius:"var(--radius)",width:"100%",fontSize:13 }}>
                {["General","Auth","Billing","API","Bug","UX","Product","Onboarding","Security"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button className="btn btn-primary btn-sm" onClick={createArticle} disabled={generatingArticle} style={{ width:"100%" }}>
              {generatingArticle ? <span style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><span className="spinner"></span> AI GENERATING...</span> : "⬟ GENERATE WITH AI"}
            </button>
            <div style={{ fontSize:11,color:"var(--text-dim)",marginTop:8,textAlign:"center" }}>
              AI will write the full article content automatically
            </div>
          </div>
        )}

        <div style={{ flex:1,overflow:"auto" }}>
          {articles.length === 0 && !loading && !creating && (
            <div style={{ padding:32,textAlign:"center",color:"var(--text-dim)" }}>
              <div style={{ fontSize:32,marginBottom:12,opacity:0.3 }}>▣</div>
              <div style={{ fontSize:13,marginBottom:8 }}>No articles yet</div>
              <div style={{ fontSize:11 }}>Click <span style={{color:"var(--green)"}}>+ NEW ARTICLE</span> above to create one with AI</div>
            </div>
          )}
          {articles.map(a => (
            <div key={a.id} onClick={() => openArticle(a)}
              style={{ padding:"14px 20px",cursor:"pointer",borderBottom:"1px solid var(--border)",background:selected?.id===a.id?"rgba(0,220,255,0.05)":"none",borderLeft:`2px solid ${selected?.id===a.id?"var(--cyan)":"transparent"}`,transition:"all 0.15s" }}
              onMouseEnter={e => { if(selected?.id!==a.id) e.currentTarget.style.background="rgba(255,255,255,0.02)"; }}
              onMouseLeave={e => { if(selected?.id!==a.id) e.currentTarget.style.background="none"; }}>
              <div style={{ fontSize:13,fontWeight:500,color:"var(--text-bright)",marginBottom:5 }}>{a.title}</div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <span className="tag tag-open">{a.category}</span>
                <span style={{ fontSize:11,color:"var(--text-dim)" }}>{a.views} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex:1,overflow:"auto",padding:32 }}>
        {selected ? (
          <div className="fade-in">
            <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text-dim)",marginBottom:8,letterSpacing:"0.1em" }}>KNOWLEDGE BASE · {selected.category}</div>
            <h1 style={{ fontSize:22,fontWeight:700,color:"var(--text-bright)",marginBottom:20,lineHeight:1.3 }}>{selected.title}</h1>
            {loadingArticle ? (
              <div style={{ display:"flex",alignItems:"center",gap:12,color:"var(--text-dim)" }}>
                <div className="thinking-dots"><span></span><span></span><span></span></div>
                <span style={{ fontFamily:"var(--mono)",fontSize:12 }}>LOADING ARTICLE</span>
              </div>
            ) : (
              <div style={{ fontSize:14,lineHeight:1.9,color:"var(--text)",whiteSpace:"pre-wrap" }}>{articleContent}</div>
            )}
          </div>
        ) : (
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"100%",flexDirection:"column",color:"var(--text-dim)",gap:12 }}>
            <div style={{ fontSize:48,opacity:0.3 }}>▣</div>
            <div style={{ fontFamily:"var(--mono)",fontSize:12 }}>SELECT AN ARTICLE</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI STUDIO ────────────────────────────────────────────────────────────────
function AIStudio({ showToast }) {
  const templates = [
    { id:"reply",label:"Response Generator",desc:"Generate a reply for any ticket",placeholder:"Describe the customer issue..." },
    { id:"summary",label:"Ticket Summarizer",desc:"Summarize a conversation thread",placeholder:"Paste the conversation here..." },
    { id:"macro",label:"Macro Creator",desc:"Create a reusable response template",placeholder:"Describe the common issue type..." },
    { id:"escalation",label:"Escalation Analyzer",desc:"Analyze if a ticket needs escalation",placeholder:"Describe the situation..." },
  ];

  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("professional");

  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true); setOutput("");
    try {
      const res = await api.generateAI(input, tone, activeTemplate.id);
      setOutput(res.result);
      showToast("Generated successfully!", "success");
    } catch (e) { showToast("AI generation failed", "error"); }
    setLoading(false);
  };

  return (
    <div className="fade-in" style={{ padding:24 }}>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24 }}>
        <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
          <div className="card">
            <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text-dim)",letterSpacing:"0.1em",marginBottom:12 }}>TEMPLATE</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              {templates.map(t => (
                <div key={t.id} onClick={() => { setActiveTemplate(t); setOutput(""); setInput(""); }}
                  style={{ padding:"12px 14px",border:`1px solid ${activeTemplate.id===t.id?"var(--cyan)":"var(--border)"}`,borderRadius:8,cursor:"pointer",background:activeTemplate.id===t.id?"rgba(0,220,255,0.07)":"var(--bg3)",transition:"all 0.15s" }}>
                  <div style={{ fontSize:12,fontWeight:600,color:activeTemplate.id===t.id?"var(--cyan)":"var(--text-bright)",marginBottom:3 }}>{t.label}</div>
                  <div style={{ fontSize:11,color:"var(--text-dim)" }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text-dim)",letterSpacing:"0.1em",marginBottom:12 }}>TONE</div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              {["professional","friendly","empathetic","concise"].map(t => (
                <button key={t} onClick={() => setTone(t)} className={`btn btn-sm ${tone===t?"btn-primary":""}`} style={{ textTransform:"capitalize" }}>{t}</button>
              ))}
            </div>
          </div>
          <div className="card">
            <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text-dim)",letterSpacing:"0.1em",marginBottom:12 }}>INPUT</div>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={activeTemplate.placeholder} style={{ minHeight:120,marginBottom:12 }} />
            <button className="btn btn-primary" onClick={generate} disabled={loading} style={{ width:"100%" }}>
              {loading ? <span style={{ display:"flex",alignItems:"center",gap:8,justifyContent:"center" }}><span className="spinner"></span> GENERATING...</span> : "⬟ GENERATE WITH AI"}
            </button>
          </div>
        </div>

        <div className="card">
          <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text-dim)",letterSpacing:"0.1em",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <span>OUTPUT</span>
            {output && <button className="btn btn-sm" onClick={() => { navigator.clipboard.writeText(output); showToast("Copied!", "success"); }}>COPY</button>}
          </div>
          {loading && <div style={{ display:"flex",flexDirection:"column",gap:12,alignItems:"center",justifyContent:"center",height:200 }}><div className="thinking-dots"><span></span><span></span><span></span></div><div style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--cyan)" }}>AI IS WRITING...</div></div>}
          {output && !loading && <div className="fade-in" style={{ fontSize:14,lineHeight:1.8,color:"var(--text)",whiteSpace:"pre-wrap" }}>{output}</div>}
          {!output && !loading && <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:200,flexDirection:"column",gap:12,color:"var(--text-dim)" }}><div style={{ fontSize:36,opacity:0.3 }}>⬟</div><div style={{ fontFamily:"var(--mono)",fontSize:11 }}>AWAITING INPUT</div></div>}
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App({ user, onLogout }) {
  const [view, setView] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [ticketFilter, setTicketFilter] = useState("all");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const renderView = () => {
    switch(view) {
      case "dashboard": return <Dashboard showToast={showToast} setView={setView} setTicketFilter={setTicketFilter} />;
      case "tickets": return <Tickets showToast={showToast} initialFilter={ticketFilter} />;
      case "chat": return <LiveChat showToast={showToast} />;
      case "kb": return <KnowledgeBase showToast={showToast} />;
      case "ai": return <AIStudio showToast={showToast} />;
      default: return <Dashboard showToast={showToast} setView={setView} setTicketFilter={setTicketFilter} />;
    }
  };

  return (
    <>
      <GlobalStyles />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div style={{ display:"flex",minHeight:"100vh" }}>
        <Sidebar active={view} setActive={setView} onLogout={onLogout} user={user} />
        <div style={{ marginLeft:"var(--sidebar)",flex:1,display:"flex",flexDirection:"column" }}>
          <Topbar view={view} user={user} onLogout={onLogout} showToast={showToast} />
          <div style={{ flex:1,overflow:"auto" }}>
            {renderView()}
          </div>
        </div>
      </div>
    </>
  );
}
