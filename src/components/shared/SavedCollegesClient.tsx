"use client";
import { useState } from "react";
import { College } from "@/types";
import { CollegeCard } from "@/components/college/CollegeCard";
import Link from "next/link";
import { BookmarkCheck, Search } from "lucide-react";

export function SavedCollegesClient({ initialSaved }: { initialSaved: College[] }) {
  const [saved, setSaved] = useState<College[]>(initialSaved);

  const handleUnsave = (id: string) => {
    setSaved(prev => prev.filter(x => x.id !== id));
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "Manrope", fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
            <BookmarkCheck size={28} color="#f97316" /> Saved Colleges
          </h1>
          <p style={{ color: "#6b7280", fontSize: 15 }}>
            {saved.length} college{saved.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <Link href="/colleges" className="btn-secondary" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 7 }}>
          <Search size={14} /> Browse More
        </Link>
      </div>

      {saved.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
          <BookmarkCheck size={40} color="#374151" style={{ margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 8 }}>No saved colleges yet</h3>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>Start exploring and save colleges you&apos;re interested in</p>
          <Link href="/colleges" className="btn-accent" style={{ fontSize: 13 }}>Explore Colleges</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map(c => (
            <CollegeCard
              key={c.id}
              college={c}
              isSaved
              onSaveToggle={handleUnsave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
