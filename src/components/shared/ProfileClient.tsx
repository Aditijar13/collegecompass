"use client";
import { useState } from "react";
import { toast } from "@/components/ui/Toaster";
import { User, Mail, Phone, BookOpen, GraduationCap, Github, Linkedin, Briefcase, Edit3, Save, X, Calendar, Shield } from "lucide-react";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  mobile: string | null;
  bio: string | null;
  linkedin: string | null;
  github: string | null;
  skills: string[];
  collegeName: string | null;
  graduationYear: number | null;
  role: string;
  createdAt: string;
}

export function ProfileClient({ initialUser }: { initialUser: UserProfile }) {
  const [user, setUser] = useState(initialUser);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [form, setForm] = useState({
    name: initialUser.name ?? "",
    mobile: initialUser.mobile ?? "",
    bio: initialUser.bio ?? "",
    linkedin: initialUser.linkedin ?? "",
    github: initialUser.github ?? "",
    skills: initialUser.skills ?? [],
    collegeName: initialUser.collegeName ?? "",
    graduationYear: initialUser.graduationYear ? String(initialUser.graduationYear) : "",
  });

  const handleEdit = () => {
    setForm({
      name: user.name ?? "",
      mobile: user.mobile ?? "",
      bio: user.bio ?? "",
      linkedin: user.linkedin ?? "",
      github: user.github ?? "",
      skills: user.skills ?? [],
      collegeName: user.collegeName ?? "",
      graduationYear: user.graduationYear ? String(user.graduationYear) : "",
    });
    setEditing(true);
  };

  const handleCancel = () => { setEditing(false); setSkillInput(""); };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || form.skills.includes(s) || form.skills.length >= 20) return;
    setForm(f => ({ ...f, skills: [...f.skills, s] }));
    setSkillInput("");
  };

  const removeSkill = (sk: string) => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== sk) }));

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
     const payload: Record<string, string | number | string[] | null> = {
  name: form.name.trim(),
  mobile: form.mobile.trim(),
  bio: form.bio.trim(),
  skills: form.skills,
  collegeName: form.collegeName.trim(),
  graduationYear: form.graduationYear
    ? parseInt(form.graduationYear)
    : null,
};
      if (form.linkedin.trim()) {
        const li = form.linkedin.trim();
        if (!/^https?:\/\//i.test(li)) { toast.error("LinkedIn URL must start with https://"); setSaving(false); return; }
        payload.linkedin = li;
      } else { payload.linkedin = ""; }
      if (form.github.trim()) {
        const gh = form.github.trim();
        if (!/^https?:\/\//i.test(gh)) { toast.error("GitHub URL must start with https://"); setSaving(false); return; }
        payload.github = gh;
      } else { payload.github = ""; }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Failed to save"); return; }
      setUser(data.user);
      setEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const avatarLetter = (user.name ?? user.email ?? "U")[0].toUpperCase();
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "Manrope", fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>My Profile</h1>
        <p style={{ color: "#6b7280", fontSize: 15 }}>Manage your personal information and preferences</p>
      </div>

      {/* Profile Card */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" }}>
        {/* Left — Avatar + quick info */}
        <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 28, textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32, fontWeight: 800, color: "#fff", fontFamily: "Manrope" }}>
            {avatarLetter}
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "Manrope", marginBottom: 4 }}>{user.name ?? "—"}</p>
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>{user.email}</p>
          <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: 9999, fontSize: 11, fontWeight: 600, background: "rgba(249,115,22,0.12)", border: "0.8px solid rgba(249,115,22,0.3)", color: "#f97316", marginBottom: 20 }}>
            {user.role}
          </span>

          <div style={{ borderTop: "0.8px solid rgba(255,255,255,0.06)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
            {user.collegeName && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <GraduationCap size={13} color="#6b7280" style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#9ca3af" }}>{user.collegeName}</span>
              </div>
            )}
            {user.graduationYear && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Calendar size={13} color="#6b7280" />
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Class of {user.graduationYear}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Shield size={13} color="#6b7280" />
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Member since {memberSince}</span>
            </div>
          </div>

          {/* Social links */}
          {(user.linkedin || user.github) && (
            <div style={{ borderTop: "0.8px solid rgba(255,255,255,0.06)", paddingTop: 16, marginTop: 4, display: "flex", justifyContent: "center", gap: 12 }}>
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "0.8px solid rgba(255,255,255,0.1)", color: "#9ca3af", textDecoration: "none", transition: "all 150ms" }}>
                  <Linkedin size={15} />
                </a>
              )}
              {user.github && (
                <a href={user.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "0.8px solid rgba(255,255,255,0.1)", color: "#9ca3af", textDecoration: "none", transition: "all 150ms" }}>
                  <Github size={15} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right — Details / Edit form */}
        <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
              {editing ? "Edit Profile" : "Profile Details"}
            </h2>
            {!editing ? (
              <button onClick={handleEdit} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, background: "rgba(249,115,22,0.1)", border: "0.8px solid rgba(249,115,22,0.3)", color: "#f97316", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                <Edit3 size={12} /> Edit Profile
              </button>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleCancel} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 9, background: "transparent", border: "0.8px solid rgba(255,255,255,0.1)", color: "#9ca3af", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  <X size={12} /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 16px", borderRadius: 9, background: "#f97316", border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                  <Save size={12} /> {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {editing ? (
            /* ── EDIT FORM ── */
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field icon={<User size={13} />} label="Full Name" required>
                <input className="input-nexora" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" />
              </Field>
              <Field icon={<Mail size={13} />} label="Email">
                <input className="input-nexora" value={user.email} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
                <p style={{ fontSize: 11, color: "#4b5563", marginTop: 4 }}>Email cannot be changed</p>
              </Field>
              <Field icon={<Phone size={13} />} label="Mobile Number">
                <input className="input-nexora" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} placeholder="+91 98765 43210" maxLength={15} />
              </Field>
              <Field icon={<BookOpen size={13} />} label="Bio">
                <textarea className="input-nexora" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell others about yourself…" rows={3} maxLength={500} style={{ resize: "vertical", lineHeight: "1.5" }} />
                <p style={{ fontSize: 11, color: "#4b5563", marginTop: 4 }}>{form.bio.length}/500</p>
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field icon={<GraduationCap size={13} />} label="College / Institution">
                  <input className="input-nexora" value={form.collegeName} onChange={e => setForm(f => ({ ...f, collegeName: e.target.value }))} placeholder="e.g. IIT Delhi" />
                </Field>
                <Field icon={<Calendar size={13} />} label="Graduation Year">
                  <input className="input-nexora" type="number" value={form.graduationYear} onChange={e => setForm(f => ({ ...f, graduationYear: e.target.value }))} placeholder="e.g. 2025" min={1990} max={2040} />
                </Field>
              </div>
              <Field icon={<Linkedin size={13} />} label="LinkedIn URL">
                <input className="input-nexora" value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/yourname" />
              </Field>
              <Field icon={<Github size={13} />} label="GitHub URL">
                <input className="input-nexora" value={form.github} onChange={e => setForm(f => ({ ...f, github: e.target.value }))} placeholder="https://github.com/yourname" />
              </Field>
              <Field icon={<Briefcase size={13} />} label="Skills">
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input className="input-nexora" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Add a skill and press Enter" style={{ flex: 1 }} />
                  <button type="button" onClick={addSkill} style={{ padding: "0 14px", borderRadius: 9, background: "rgba(249,115,22,0.15)", border: "0.8px solid rgba(249,115,22,0.3)", color: "#f97316", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Add</button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {form.skills.map(sk => (
                    <span key={sk} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 9999, background: "rgba(249,115,22,0.1)", border: "0.8px solid rgba(249,115,22,0.25)", color: "#f97316", fontSize: 12, fontWeight: 500 }}>
                      {sk}
                      <button onClick={() => removeSkill(sk)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f97316", display: "flex", padding: 0, lineHeight: 1 }}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </Field>
            </div>
          ) : (
            /* ── VIEW MODE ── */
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <ViewRow icon={<User size={13} />} label="Full Name" value={user.name} />
              <ViewRow icon={<Mail size={13} />} label="Email" value={user.email} />
              <ViewRow icon={<Phone size={13} />} label="Mobile" value={user.mobile} />
              <ViewRow icon={<BookOpen size={13} />} label="Bio" value={user.bio} multiline />
              <ViewRow icon={<GraduationCap size={13} />} label="College" value={user.collegeName} />
              <ViewRow icon={<Calendar size={13} />} label="Graduation Year" value={user.graduationYear ? String(user.graduationYear) : null} />
              <ViewRow icon={<Linkedin size={13} />} label="LinkedIn" value={user.linkedin} link />
              <ViewRow icon={<Github size={13} />} label="GitHub" value={user.github} link />
              {/* Skills */}
              <div style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "0.8px solid rgba(255,255,255,0.04)", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 140, color: "#6b7280" }}>
                  <Briefcase size={13} />
                  <span style={{ fontSize: 13 }}>Skills</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1 }}>
                  {user.skills && user.skills.length > 0 ? user.skills.map(sk => (
                    <span key={sk} style={{ padding: "3px 10px", borderRadius: 9999, background: "rgba(249,115,22,0.08)", border: "0.8px solid rgba(249,115,22,0.2)", color: "#f97316", fontSize: 12, fontWeight: 500 }}>{sk}</span>
                  )) : <span style={{ fontSize: 13, color: "#4b5563" }}>—</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, required, children }: { icon: React.ReactNode; label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#9ca3af", marginBottom: 6 }}>
        <span style={{ color: "#6b7280" }}>{icon}</span>
        {label}{required && <span style={{ color: "#f97316" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function ViewRow({ icon, label, value, link, multiline }: { icon: React.ReactNode; label: string; value?: string | null; link?: boolean; multiline?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "0.8px solid rgba(255,255,255,0.04)", alignItems: multiline ? "flex-start" : "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 140, color: "#6b7280" }}>
        {icon}
        <span style={{ fontSize: 13 }}>{label}</span>
      </div>
      <div style={{ flex: 1 }}>
        {value ? (
          link ? (
            <a href={value} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#f97316", textDecoration: "none", fontWeight: 500 }}>{value}</a>
          ) : (
            <span style={{ fontSize: 13, color: "#d1d5db", fontWeight: 500, whiteSpace: multiline ? "pre-wrap" : undefined }}>{value}</span>
          )
        ) : (
          <span style={{ fontSize: 13, color: "#4b5563" }}>—</span>
        )}
      </div>
    </div>
  );
}
