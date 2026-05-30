"use client";
import { useState } from "react";
// import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MapPin, Globe, Award, BookmarkPlus, BookmarkCheck, GitCompare, Star, ChevronRight, CheckCircle, XCircle, TrendingUp, Users, IndianRupee, Calendar, ArrowRight } from "lucide-react";
import { CollegeWithRelations, College } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";
import { CollegeCard } from "./CollegeCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props { college: CollegeWithRelations; related: College[]; }
const TABS = ["Overview", "Courses", "Placements", "Reviews", "Facilities", "Admissions"] as const;
type Tab = typeof TABS[number];

export function CollegeDetailClient({ college, related }: Props) {
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>("Overview");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const latestP = college.placements?.[0];
  const chartData = college.placements?.slice(0,3).reverse().map(p => ({
    year: p.year.toString(),
    "Avg (L)": +(p.avgPackage/100000).toFixed(1),
    "Max (L)": +(p.maxPackage/100000).toFixed(1),
  }));

  const handleSave = async () => {
    if (!session) { toast.error("Sign in to save"); return; }
    setSaving(true);
    try {
      if (saved) { await fetch(`/api/saved?collegeId=${college.id}`, { method: "DELETE" }); setSaved(false); toast.success("Removed"); }
      else { await fetch("/api/saved", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ collegeId: college.id }) }); setSaved(true); toast.success("Saved!"); }
    } catch { toast.error("Something went wrong"); } finally { setSaving(false); }
  };

  // const S: React.CSSProperties = { color: "#9ca3af" };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
      {/* Breadcrumb */}
      <nav style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
        {[["Home", "/"], ["Colleges", "/colleges"], [college.name, ""]].map(([label, href], i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && <ChevronRight size={12} color="#4b5563" />}
            {href ? <Link href={href} style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>{label}</Link>
              : <span style={{ fontSize: 13, color: "#9ca3af", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>}
          </span>
        ))}
      </nav>

      {/* Hero */}
      <div style={{ borderRadius: 16, overflow: "hidden", border: "0.8px solid rgba(255,255,255,0.08)", marginBottom: 24 }}>
        {/* Cover */}
        <div style={{ position: "relative", height: 240, background: "rgb(22,22,28)" }}>
          {college.image && <img src={college.image} alt={college.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(16,16,20,0.95) 0%, rgba(0,0,0,0.2) 100%)" }} />
          <div style={{ position: "absolute", bottom: 20, left: 24, right: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 600, background: "rgba(249,115,22,0.15)", border: "0.8px solid rgba(249,115,22,0.35)", color: "#f97316" }}>{college.category}</span>
                <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 11, background: "rgba(255,255,255,0.1)", border: "0.8px solid rgba(255,255,255,0.15)", color: "#d1d5db" }}>{college.type}</span>
                {college.accreditation && <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 11, background: "rgba(16,185,129,0.12)", border: "0.8px solid rgba(16,185,129,0.25)", color: "#4ade80" }}>{college.accreditation}</span>}
              </div>
              <h1 style={{ fontFamily: "Manrope", fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>{college.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#9ca3af" }}><MapPin size={13} />{college.location}</span>
                {college.established && <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#9ca3af" }}><Calendar size={13} />Est. {college.established}</span>}
                {college.nirfRank && <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#f59e0b" }}><Award size={13} />NIRF #{college.nirfRank}</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleSave} disabled={saving}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "0.8px solid rgba(255,255,255,0.12)", background: saved ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.06)", color: saved ? "#f97316" : "#d1d5db", cursor: "pointer", fontSize: 13, fontWeight: 500, backdropFilter: "blur(8px)" }}>
                {saved ? <BookmarkCheck size={14} /> : <BookmarkPlus size={14} />}{saved ? "Saved" : "Save"}
              </button>
              <Link href={`/compare?ids=${college.id}`}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "0.8px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "#d1d5db", textDecoration: "none", fontSize: 13, fontWeight: 500, backdropFilter: "blur(8px)" }}>
                <GitCompare size={14} />Compare
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ background: "rgb(22,22,28)", padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, borderTop: "0.8px solid rgba(255,255,255,0.06)" }}>
          {[
            { icon: Star, label: "Rating", value: `${college.rating.toFixed(1)} / 5`, sub: `${college.totalRatings} reviews`, c: "#f59e0b" },
            { icon: IndianRupee, label: "Fee Range", value: `${formatCurrency(college.minFee)} – ${formatCurrency(college.maxFee)}`, sub: "per year", c: "#10b981" },
            { icon: TrendingUp, label: "Avg Package", value: latestP ? formatCurrency(latestP.avgPackage) : "N/A", sub: latestP ? `${latestP.year} batch` : "–", c: "#f97316" },
            { icon: Users, label: "Placement", value: latestP ? `${latestP.placementRate}%` : "N/A", sub: "students placed", c: "#818cf8" },
          ].map(({ icon: Icon, label, value, sub, c }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `${c}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} color={c} />
              </div>
              <div>
                <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{value}</p>
                <p style={{ fontSize: 11, color: "#4b5563" }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.03)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 4, marginBottom: 24, overflowX: "auto" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "8px 18px", borderRadius: 9, fontSize: 13, fontWeight: tab === t ? 600 : 400, whiteSpace: "nowrap", border: "none", cursor: "pointer", transition: "all 150ms ease", background: tab === t ? "rgb(28,28,36)" : "transparent", color: tab === t ? "#fff" : "#6b7280", boxShadow: tab === t ? "0 1px 6px rgba(0,0,0,0.3)" : "none" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {/* Overview */}
        {tab === "Overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 12 }}>About {college.name}</h2>
                <p style={{ fontSize: 14, lineHeight: "1.7", color: "#9ca3af" }}>{college.description}</p>
              </div>
              {chartData && chartData.length > 0 && (
                <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 24 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Placement Trends (₹ Lakhs)</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} unit="L" />
                      <Tooltip contentStyle={{ background: "rgb(28,28,36)", border: "0.8px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 12 }} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                      <Bar dataKey="Avg (L)" fill="#f97316" radius={[4,4,0,0]} />
                      <Bar dataKey="Max (L)" fill="#ea580c" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {college.website && (
                <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Links</h3>
                  <a href={college.website} target="_blank" rel="noopener" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#f97316", textDecoration: "none" }}>
                    <Globe size={13} /> Official Website
                  </a>
                </div>
              )}
              <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 14 }}>Rating</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[["Overall", college.rating], ["Infrastructure", 4.0], ["Faculty", 4.1], ["Placements", latestP?.placementRate ? Math.min(5, latestP.placementRate / 20) : 3.5]].map(([label, val]) => (
                    <div key={label as string}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#6b7280" }}>{label}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{(val as number).toFixed(1)}</span>
                      </div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 9999, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${((val as number) / 5) * 100}%`, background: "linear-gradient(90deg, #f97316, #ea580c)", borderRadius: 9999 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses */}
        {tab === "Courses" && (
          <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  {["Course", "Degree", "Duration", "Seats", "Fee/yr", "Eligibility"].map((h) => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "0.8px solid rgba(255,255,255,0.06)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {college.courses.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: i < college.courses.length - 1 ? "0.8px solid rgba(255,255,255,0.04)" : "none" }}>
                    <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 500, color: "#fff" }}>{c.name}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#9ca3af" }}>{c.degree}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#9ca3af" }}>{c.duration}yr</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#9ca3af" }}>{c.totalSeats}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "#10b981" }}>{formatCurrency(c.fee)}</td>
                    <td style={{ padding: "14px 20px", fontSize: 12, color: "#6b7280" }}>{c.eligibility ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Placements */}
        {tab === "Placements" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {college.placements.map((p) => (
              <div key={p.id} style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{p.year} Placements</h3>
                  <span style={{ padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 600, background: "rgba(16,185,129,0.12)", border: "0.8px solid rgba(16,185,129,0.25)", color: "#4ade80" }}>{p.placementRate}% Placed</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                  {[["Avg Package", formatCurrency(p.avgPackage), "#f97316"], ["Max Package", formatCurrency(p.maxPackage), "#10b981"], ["Min Package", formatCurrency(p.minPackage), "#6b7280"], ["Placement %", `${p.placementRate}%`, "#818cf8"]].map(([label, value, color]) => (
                    <div key={label as string} style={{ background: "rgba(255,255,255,0.03)", border: "0.8px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px", textAlign: "center" }}>
                      <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>{label}</p>
                      <p style={{ fontSize: 20, fontWeight: 700, color: color as string }}>{value}</p>
                    </div>
                  ))}
                </div>
                {p.topRecruiters?.length > 0 && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "0.8px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 10 }}>TOP RECRUITERS</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {p.topRecruiters.map((r) => (
                        <span key={r} style={{ padding: "4px 12px", borderRadius: 9999, fontSize: 12, background: "rgba(255,255,255,0.05)", border: "0.8px solid rgba(255,255,255,0.09)", color: "#d1d5db" }}>{r}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        {tab === "Reviews" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 24, display: "flex", gap: 40, alignItems: "center" }}>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <p style={{ fontFamily: "Manrope", fontSize: 56, fontWeight: 700, color: "#f97316", letterSpacing: "-0.03em", lineHeight: 1 }}>{college.rating.toFixed(1)}</p>
                <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 8 }}>
                  {[1,2,3,4,5].map((s) => <Star key={s} size={14} color="#f59e0b" fill={s <= Math.round(college.rating) ? "#f59e0b" : "transparent"} />)}
                </div>
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{college.totalRatings} reviews</p>
              </div>
              <div style={{ flex: 1 }}>
                {["5","4","3","2","1"].map((star) => {
                  const count = college.reviews.filter(r => Math.round(r.rating) === parseInt(star)).length;
                  const pct = college.reviews.length ? (count / college.reviews.length) * 100 : 0;
                  return (
                    <div key={star} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "#6b7280", width: 8 }}>{star}</span>
                      <Star size={11} color="#f59e0b" fill="#f59e0b" />
                      <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 9999, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "#f59e0b", borderRadius: 9999 }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#4b5563", width: 16 }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {college.reviews.map((r) => (
              <div key={r.id} style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#f97316" }}>
                      {r.user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{r.user?.name ?? "Anonymous"}</p>
                      <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                        {[1,2,3,4,5].map((s) => <Star key={s} size={10} color="#f59e0b" fill={s <= Math.round(r.rating) ? "#f59e0b" : "transparent"} />)}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: "#4b5563" }}>{new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 6 }}>{r.title}</h4>
                <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: "1.6" }}>{r.content}</p>
              </div>
            ))}
            {college.reviews.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>No reviews yet. Be the first to review!</div>}
          </div>
        )}

        {/* Facilities */}
        {tab === "Facilities" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {college.facilities.map((f) => (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: 10, background: f.available ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)", border: `0.8px solid ${f.available ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.05)"}`, opacity: f.available ? 1 : 0.5 }}>
                {f.available ? <CheckCircle size={14} color="#10b981" /> : <XCircle size={14} color="#4b5563" />}
                <span style={{ fontSize: 13, fontWeight: 500, color: f.available ? "#d1d5db" : "#6b7280" }}>{f.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Admissions */}
        {tab === "Admissions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {college.admissions.map((a) => (
              <div key={a.id} style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{a.exam}</h3>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>{a.year} Admission Cycle</p>
                  </div>
                  <span style={{ padding: "4px 12px", borderRadius: 9999, fontSize: 11, fontWeight: 600, background: "rgba(249,115,22,0.12)", border: "0.8px solid rgba(249,115,22,0.25)", color: "#f97316" }}>{a.year}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                  {[["Opening Rank", a.minRank?.toLocaleString()], ["Closing Rank", a.maxRank?.toLocaleString()], ["Cutoff %", a.cutoff ? `${a.cutoff}%` : null]].filter(([,v]) => v).map(([label, value]) => (
                    <div key={label as string} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 9, padding: "12px", textAlign: "center" }}>
                      <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>{label}</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Colleges */}
      {related.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>Similar Colleges</h2>
            <Link href={`/colleges?category=${college.category}`} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#f97316", textDecoration: "none", fontWeight: 600 }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {related.map(c => <CollegeCard key={c.id} college={c} />)}
          </div>
        </div>
      )}
    </div>
  );
}
