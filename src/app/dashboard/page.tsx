import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SessionProvider } from "@/components/shared/SessionProvider";
import Link from "next/link";
import { BookmarkCheck, Search, GitCompare, User, TrendingUp, Edit3 } from "lucide-react";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const [savedCount, user, recentColleges] = await Promise.all([
    prisma.savedCollege.count({ where: { userId: session.user.id } }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, role: true, createdAt: true, bio: true, collegeName: true, graduationYear: true, skills: true },
    }),
    prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { college: { select: { name: true, slug: true, city: true, rating: true } } },
    }),
  ]);

  const cards = [
    { icon: BookmarkCheck, label: "Saved Colleges", value: savedCount, href: "/dashboard/saved", color: "#f97316" },
    { icon: Search, label: "Explore", value: "Browse", href: "/colleges", color: "#10b981" },
    { icon: GitCompare, label: "Compare", value: "Start", href: "/compare", color: "#818cf8" },
  ];

  return (
    <SessionProvider>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "Manrope", fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>Dashboard</h1>
          <p style={{ color: "#6b7280", fontSize: 15 }}>Welcome back, {user?.name ?? "Explorer"}</p>
        </div>

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
          {cards.map(({ icon: Icon, label, value, href, color }) => (
            <Link key={label} href={href} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 3 }}>{label}</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: "Manrope", letterSpacing: "-0.02em" }}>{value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Profile card */}
          <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                <User size={14} color="#6b7280" /> Profile
              </h2>
              <Link href="/dashboard/profile" style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, background: "rgba(249,115,22,0.08)", border: "0.8px solid rgba(249,115,22,0.2)", color: "#f97316", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>
                <Edit3 size={10} /> Edit
              </Link>
            </div>
            {[
              ["Name", user?.name ?? "—"],
              ["Email", user?.email ?? "—"],
              ["Role", user?.role ?? "STUDENT"],
              ["Member Since", new Date(user?.createdAt ?? "").toLocaleDateString("en-IN", { month: "long", year: "numeric" })],
              ...(user?.collegeName ? [["College", user.collegeName]] : []),
              ...(user?.graduationYear ? [["Grad Year", String(user.graduationYear)]] : []),
            ].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "0.8px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 13, color: "#6b7280" }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#d1d5db", maxWidth: "60%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
              </div>
            ))}
            {user?.skills && user.skills.length > 0 && (
              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 5 }}>
                {user.skills.slice(0, 5).map(sk => (
                  <span key={sk} style={{ padding: "2px 8px", borderRadius: 9999, background: "rgba(249,115,22,0.08)", border: "0.8px solid rgba(249,115,22,0.2)", color: "#f97316", fontSize: 10, fontWeight: 500 }}>{sk}</span>
                ))}
              </div>
            )}
          </div>

          {/* Recently saved */}
          <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={14} color="#6b7280" /> Recently Saved
            </h2>
            {recentColleges.length === 0 ? (
              <p style={{ fontSize: 13, color: "#4b5563" }}>No saved colleges yet.</p>
            ) : recentColleges.map(({ college }) => (
              <Link key={college.slug} href={`/colleges/${college.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.8px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#d1d5db" }}>{college.name}</p>
                    <p style={{ fontSize: 11, color: "#4b5563" }}>{college.city}</p>
                  </div>
                  <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600 }}>★ {college.rating.toFixed(1)}</span>
                </div>
              </Link>
            ))}
            <Link href="/dashboard/saved" style={{ display: "block", textAlign: "center", marginTop: 12, fontSize: 12, color: "#f97316", textDecoration: "none", fontWeight: 600 }}>
              View all saved →
            </Link>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
