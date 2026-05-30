"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/Toaster";
import { SessionProvider } from "@/components/shared/SessionProvider";

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) { toast.success("Welcome back!"); router.push("/"); }
    else { toast.error("Invalid email or password"); setLoading(false); }
  };

  const field = (icon: React.ReactNode, input: React.ReactNode) => (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6b7280", display: "flex" }}>{icon}</div>
      {input}
    </div>
  );

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center" }}><GraduationCap size={20} color="#fff" /></div>
            <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 20, color: "#fff" }}>College<span style={{ color: "#f97316" }}>Compass</span></span>
          </Link>
          <h1 style={{ fontFamily: "Manrope", fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>Welcome back</h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>Sign in to access your saved colleges</p>
        </div>

        <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", display: "block", marginBottom: 8 }}>Email</label>
              {field(<Mail size={15} />, <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="input-nexora" style={{ paddingLeft: 40 }} />)}
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", display: "block", marginBottom: 8 }}>Password</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }}><Lock size={15} /></div>
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="input-nexora" style={{ paddingLeft: 40, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-accent" style={{ width: "100%", justifyContent: "center", marginTop: 4, opacity: loading ? 0.7 : 1 }}>
              {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Signing in…</> : "Sign In"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: "0.8px", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: 12, color: "#4b5563" }}>or</span>
            <div style={{ flex: 1, height: "0.8px", background: "rgba(255,255,255,0.07)" }} />
          </div>

          <button onClick={() => signIn("google", { callbackUrl: "/" })} className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 20 }}>
            No account? <Link href="/auth/register" style={{ color: "#f97316", textDecoration: "none", fontWeight: 600 }}>Sign up</Link>
          </p>
          <p style={{ textAlign: "center", fontSize: 11, color: "#4b5563", marginTop: 8 }}>
            Demo: <span style={{ fontFamily: "monospace" }}>demo@collegecompass.in</span> / <span style={{ fontFamily: "monospace" }}>demo1234</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() { return <SessionProvider><LoginForm /></SessionProvider>; }
