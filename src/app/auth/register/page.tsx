"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/Toaster";
import { SessionProvider } from "@/components/shared/SessionProvider";

function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false); const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
      if (!res.ok) { const d = await res.json(); toast.error(d.error ?? "Registration failed"); setLoading(false); return; }
      await signIn("credentials", { email, password, redirect: false });
      toast.success("Account created!"); router.push("/");
    } catch { toast.error("Something went wrong"); setLoading(false); }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center" }}><GraduationCap size={20} color="#fff" /></div>
            <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 20, color: "#fff" }}>College<span style={{ color: "#f97316" }}>Compass</span></span>
          </Link>
          <h1 style={{ fontFamily: "Manrope", fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>Create your account</h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>Start discovering your perfect college</p>
        </div>
        <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Full Name", icon: <User size={15}/>, type: "text", val: name, set: setName, ph: "Your name", min: 2 },
              { label: "Email", icon: <Mail size={15}/>, type: "email", val: email, set: setEmail, ph: "you@example.com" },
            ].map(({ label, icon, type, val, set, ph, min }) => (
              <div key={label}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", display: "block", marginBottom: 8 }}>{label}</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }}>{icon}</div>
                  <input type={type} value={val} onChange={e => set(e.target.value)} required minLength={min} placeholder={ph} className="input-nexora" style={{ paddingLeft: 40 }} />
                </div>
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", display: "block", marginBottom: 8 }}>Password</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }}><Lock size={15}/></div>
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" className="input-nexora" style={{ paddingLeft: 40, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>{showPw ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-accent" style={{ width: "100%", justifyContent: "center", marginTop: 4, opacity: loading ? 0.7 : 1 }}>
              {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Creating…</> : "Create Account"}
            </button>
          </form>
          <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 20 }}>
            Already have an account? <Link href="/auth/login" style={{ color: "#f97316", textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() { return <SessionProvider><RegisterForm /></SessionProvider>; }
