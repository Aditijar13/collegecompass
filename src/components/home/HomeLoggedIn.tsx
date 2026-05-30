"use client";
import Link from "next/link";
import { BookmarkCheck, Search, GitCompare, User, Star, MapPin, ArrowRight, TrendingUp, Zap, IndianRupee } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface RecentCollege {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  rating: number;
  category: string;
  minFee: number;
  image: string | null;
  nirfRank: number | null;
}

interface Props {
  userName: string;
  savedCount: number;
  recentSaved: RecentCollege[];
}

const CAT_COLORS: Record<string, string> = {
  ENGINEERING: "#3b82f6", MEDICAL: "#10b981", MANAGEMENT: "#f97316",
  LAW: "#a855f7", ARTS: "#f59e0b", SCIENCE: "#06b6d4", COMMERCE: "#ec4899", DESIGN: "#8b5cf6",
};

const QUICK_ACTIONS = [
  { icon: Search, label: "Explore Colleges", sub: "Browse 500+ institutions", href: "/colleges", color: "#10b981" },
  { icon: GitCompare, label: "Compare Colleges", sub: "Side-by-side comparison", href: "/compare", color: "#818cf8" },
  { icon: BookmarkCheck, label: "Saved Colleges", sub: "Your shortlist", href: "/dashboard/saved", color: "#f97316" },
  { icon: User, label: "My Profile", sub: "Edit your information", href: "/dashboard/profile", color: "#f59e0b" },
];

export function HomeLoggedIn({ userName, savedCount, recentSaved }: Props) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
      {/* Welcome header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 9999, background: "rgba(249,115,22,0.1)", border: "0.8px solid rgba(249,115,22,0.2)", marginBottom: 16 }}>
          <Zap size={13} color="#f97316" />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#f97316" }}>Your Dashboard</span>
        </div>
        <h1 style={{ fontFamily: "Manrope", fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 8, lineHeight: 1.1 }}>
          {greeting}, <span style={{ color: "#f97316" }}>{userName}</span> 
        </h1>
        <p style={{ color: "#6b7280", fontSize: 16 }}>
          You have <span style={{ color: "#fff", fontWeight: 600 }}>{savedCount}</span> saved college{savedCount !== 1 ? "s" : ""}. Keep exploring to find your perfect match.
        </p>
      </div>

      {/* Quick stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }} className="grid-cols-1 sm:grid-cols-3">
        {[
          { label: "Saved Colleges", value: savedCount, icon: BookmarkCheck, color: "#f97316", href: "/dashboard/saved" },
          { label: "Explore Colleges", value: "500+", icon: Search, color: "#10b981", href: "/colleges" },
          { label: "Compare Mode", value: "Ready", icon: GitCompare, color: "#818cf8", href: "/compare" },
        ].map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} style={{ textDecoration: "none" }}>
            <div className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 3 }}>{label}</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#fff", fontFamily: "Manrope", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main content grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }} className="grid-cols-1 lg:grid-cols-[1fr_300px]">
        {/* Recent saved colleges */}
        <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={14} color="#f97316" /> Recently Saved
            </h2>
            <Link href="/dashboard/saved" style={{ fontSize: 12, color: "#f97316", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>

          {recentSaved.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <BookmarkCheck size={32} color="#374151" style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 14, color: "#4b5563", marginBottom: 16 }}>No saved colleges yet</p>
              <Link href="/colleges" className="btn-accent" style={{ fontSize: 12, padding: "8px 18px" }}>Start Exploring</Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }} className="grid-cols-1 sm:grid-cols-2">
              {recentSaved.map((college) => {
                const catColor = CAT_COLORS[college.category] ?? "#6b7280";
                return (
                  <Link key={college.id} href={`/colleges/${college.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ borderRadius: 10, border: "0.8px solid rgba(255,255,255,0.07)", overflow: "hidden", transition: "border-color 200ms", background: "rgb(28,28,36)", cursor: "pointer" }}>
                      {/* Mini image / placeholder */}
                      <div style={{ height: 80, background: college.image ? undefined : `linear-gradient(135deg, ${catColor}22, ${catColor}11)`, position: "relative", overflow: "hidden" }}>
                        {college.image ? (
                          <img src={college.image} alt={college.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: `${catColor}50`, fontFamily: "Manrope" }}>
                            {college.name[0]}
                          </div>
                        )}
                        {college.nirfRank && (
                          <span style={{ position: "absolute", top: 6, left: 6, padding: "2px 7px", borderRadius: 9999, background: "rgba(0,0,0,0.7)", fontSize: 10, fontWeight: 600, color: "#fff" }}>
                            NIRF #{college.nirfRank}
                          </span>
                        )}
                      </div>
                      <div style={{ padding: "10px 12px" }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{college.name}</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#6b7280" }}>
                            <MapPin size={9} />{college.city}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, color: "#f59e0b", fontWeight: 600 }}>
                            <Star size={9} fill="#f59e0b" /> {college.rating.toFixed(1)}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 5, fontSize: 10, color: "#9ca3af" }}>
                          <IndianRupee size={9} />{formatCurrency(college.minFee)}/yr
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Quick Actions</h2>
          {QUICK_ACTIONS.map(({ icon: Icon, label, sub, href, color }) => (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={17} color={color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 1 }}>{label}</p>
                  <p style={{ fontSize: 11, color: "#6b7280" }}>{sub}</p>
                </div>
                <ArrowRight size={13} color="#4b5563" />
              </div>
            </Link>
          ))}

          {/* Mini profile link */}
          <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px", marginTop: 4 }}>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>Continue where you left off</p>
            <Link href="/colleges" className="btn-accent" style={{ fontSize: 12, padding: "9px 16px", width: "100%", justifyContent: "center" }}>
              <Search size={13} /> Explore Colleges
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
