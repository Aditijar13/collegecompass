"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { College } from "@/types";
import { CollegeCard } from "@/components/college/CollegeCard";
import { CollegeCardSkeleton } from "@/components/ui/Skeleton";

export function FeaturedColleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/colleges?limit=6&sortBy=rating").then(r => r.json()).then(d => { setColleges(d.colleges ?? []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: "Manrope", fontSize: 32, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>Top Ranked Colleges</h2>
          <p style={{ color: "#6b7280", fontSize: 15 }}>Institutions with the best rankings, placements and reviews</p>
        </div>
        <Link href="/colleges" style={{ display: "flex", alignItems: "center", gap: 6, color: "#f97316", textDecoration: "none", fontSize: 14, fontWeight: 600, transition: "gap 200ms" }}>
          View all <ArrowRight size={15} />
        </Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? Array.from({ length: 6 }).map((_, i) => <CollegeCardSkeleton key={i} />) : colleges.map(c => <CollegeCard key={c.id} college={c} />)}
      </div>
    </section>
  );
}
