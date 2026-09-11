"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { login } from "@/lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("investigator");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res: any = await login(username, password);
      setAuth(
        { user_id: res.user_id, username: res.username, role: res.role, display_name: res.display_name, permissions: res.permissions },
        res.access_token
      );
      router.replace("/network");
    } catch {
      // Demo fallback — allow demo login without API
      if (username === "investigator" && password === "demo123") {
        setAuth(
          { user_id: "USR-001", username: "investigator", role: "investigator", display_name: "Demo Investigator", department: "CID", permissions: ["search", "view_person", "view_cases", "view_evidence", "view_relationships", "run_ai"] },
          "demo-token-" + Date.now()
        );
        localStorage.setItem("crimnet_token", "demo-token");
        router.replace("/network");
      } else if (username === "admin" && password === "admin123") {
        setAuth(
          { user_id: "USR-003", username: "admin", role: "administrator", display_name: "System Admin", permissions: ["*"] },
          "demo-admin-token-" + Date.now()
        );
        localStorage.setItem("crimnet_token", "demo-admin-token");
        router.replace("/network");
      } else {
        setError("Invalid credentials. Demo: investigator / demo123");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex" style={{ background: "#050505" }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 flex-1" style={{ background: "#070707", borderRight: "1px solid #141414" }}>
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-8 h-8 flex items-center justify-center rounded" style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)" }}>
              <svg className="w-4 h-4 text-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div className="text-base font-semibold tracking-widest text-primary">CRIMENET AI</div>
              <div className="text-2xs text-muted tracking-wider">AI-POWERED NETWORK INTELLIGENCE</div>
            </div>
          </div>

          {/* Network visualization placeholder */}
          <div className="relative" style={{ height: 320 }}>
            <svg width="100%" height="100%" viewBox="0 0 500 320">
              {/* Edges */}
              {[[120,160,250,100],[250,100,380,160],[120,160,250,240],[250,240,380,160],[250,100,250,240],[120,160,80,80],[380,160,420,80],[250,240,200,300],[250,240,300,300]].map(([x1,y1,x2,y2],i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1A1A28" strokeWidth="1" />
              ))}
              {/* Nodes */}
              {[[250,100,10,"#DC2626"],[120,160,7,"#4A4A5A"],[380,160,7,"#4A4A5A"],[250,240,7,"#4A4A5A"],[80,80,5,"#2A2A3A"],[420,80,5,"#2A2A3A"],[200,300,5,"#2A2A3A"],[300,300,5,"#2A2A3A"]].map(([cx,cy,r,fill],i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill={fill as string} />
              ))}
              {/* Selected ring */}
              <circle cx={250} cy={100} r={16} fill="none" stroke="#DC2626" strokeWidth="1" strokeOpacity="0.4" />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 text-center">
              <span className="text-2xs text-muted font-mono tracking-widest">58,000,000 PROFILE ARCHITECTURE</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {["PERSON → PERSON → PERSON graph traversal", "Multi-source ICJS data integration", "AI-assisted investigative analysis", "Automatic cluster navigation"].map((feat) => (
            <div key={feat} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-accent-red" />
              <span className="text-xs text-secondary">{feat}</span>
            </div>
          ))}
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid #141414" }}>
            <span className="text-2xs text-muted">SIH 2026 · Problem Statement ID: 26189 · Prototype v1.0</span>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-primary mb-1">Authorized Access</h1>
            <p className="text-xs text-secondary">Law-enforcement personnel only. All actions are audited.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="section-label block mb-1.5">INVESTIGATOR ID / USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2.5 rounded text-sm text-primary outline-none"
                style={{ background: "#0D0D0D", border: "1px solid #242424", caretColor: "#DC2626" }}
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="section-label block mb-1.5">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded text-sm text-primary outline-none"
                style={{ background: "#0D0D0D", border: "1px solid #242424", caretColor: "#DC2626" }}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="px-3 py-2 rounded text-xs text-red-400" style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded text-sm font-medium transition-all"
              style={{ background: loading ? "#1A0A0A" : "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: loading ? "#6B2020" : "#FCA5A5" }}
            >
              {loading ? "Authenticating..." : "ACCESS SYSTEM"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-3 rounded" style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}>
            <div className="text-2xs font-medium text-muted mb-2 tracking-wider">DEMO CREDENTIALS</div>
            {[
              { u: "investigator", p: "demo123", r: "Investigator" },
              { u: "admin", p: "admin123", r: "Administrator" },
            ].map((cred) => (
              <button
                key={cred.u}
                onClick={() => { setUsername(cred.u); setPassword(cred.p); }}
                className="flex items-center justify-between w-full text-left px-2 py-1.5 rounded hover:bg-elevated transition-colors mb-1"
              >
                <span className="font-mono text-xs text-secondary">{cred.u} / {cred.p}</span>
                <span className="text-2xs text-muted">{cred.r}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 text-center text-2xs text-muted leading-relaxed">
            Unauthorized access is prohibited and subject to legal action.<br />
            All sessions are monitored and audited.
          </div>
        </div>
      </div>
    </div>
  );
}
