import { Suspense } from "react";
import { CollegeFilters } from "@/components/college/CollegeFilters";
import { CollegeGrid } from "@/components/college/CollegeGrid";
import { SessionProvider } from "@/components/shared/SessionProvider";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Browse Colleges" };

export default function CollegesPage() {
  return (
    <SessionProvider>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "Manrope", fontSize: 36, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 8 }}>Explore Colleges</h1>
          <p style={{ color: "#6b7280", fontSize: 15 }}>Discover the perfect institution from 500+ colleges across India</p>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <aside style={{ width: 280, flexShrink: 0, position: "sticky", top: 80 }}>
            <Suspense><CollegeFilters /></Suspense>
          </aside>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Suspense fallback={<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>{Array.from({length:9}).map((_,i)=><div key={i} className="skeleton" style={{height:340,borderRadius:12}}/>)}</div>}>
              <CollegeGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
