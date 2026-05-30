"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CollegeCard } from "./CollegeCard";
import { CollegeCardSkeleton } from "@/components/ui/Skeleton";
import { College } from "@/types";
import { ChevronLeft, ChevronRight, GitCompare } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/Toaster";

interface Pagination { page: number; limit: number; total: number; pages: number; }

export function CollegeGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/colleges?${searchParams.toString()}`);
      const data = await res.json();
      setColleges(data.colleges ?? []);
      setPagination(data.pagination);
    } catch { toast.error("Failed to load colleges"); }
    finally { setLoading(false); }
  }, [searchParams.toString()]);

  useEffect(() => { fetchColleges(); }, [fetchColleges]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) { toast.error("Max 3 colleges"); return prev; }
      return [...prev, id];
    });
  };

  const goToPage = (page: number) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("page", page.toString());
    router.push(`/colleges?${p.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => <CollegeCardSkeleton key={i} />)}
    </div>
  );

  if (!colleges.length) return (
    <div style={{ textAlign: "center", padding: "80px 24px", background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.08)", borderRadius: 14 }}>
      <p style={{ fontSize: 48, marginBottom: 16 }}>🎓</p>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 8 }}>No colleges found</h3>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>Try adjusting your search or filters</p>
      <button onClick={() => router.push("/colleges")} className="btn-accent" style={{ fontSize: 13 }}>Clear Filters</button>
    </div>
  );

  return (
    <div>
      {/* Results header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: "#6b7280" }}>
          Showing <span style={{ color: "#fff", fontWeight: 600 }}>{colleges.length}</span> of <span style={{ color: "#fff", fontWeight: 600 }}>{pagination?.total}</span> colleges
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {colleges.map((c) => <CollegeCard key={c.id} college={c} compareIds={compareIds} onCompareToggle={toggleCompare} />)}
      </div>

      {/* Compare bar */}
      {compareIds.length >= 2 && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 24px", borderRadius: 14, background: "rgba(22,22,28,0.95)", border: "0.8px solid rgba(249,115,22,0.35)", backdropFilter: "blur(16px)", boxShadow: "0 24px 48px rgba(0,0,0,0.5)" }}>
            <GitCompare size={16} color="#f97316" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{compareIds.length} colleges selected</span>
            <Link href={`/compare?ids=${compareIds.join(",")}`} className="btn-accent" style={{ fontSize: 12, padding: "8px 16px" }}>Compare Now</Link>
            <button onClick={() => setCompareIds([])} style={{ fontSize: 12, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>Clear</button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 40 }}>
          <button onClick={() => goToPage(pagination.page - 1)} disabled={pagination.page <= 1}
            style={{ width: 36, height: 36, borderRadius: 9, border: "0.8px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", opacity: pagination.page <= 1 ? 0.4 : 1 }}>
            <ChevronLeft size={15} />
          </button>
          {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => goToPage(page)}
              style={{ width: 36, height: 36, borderRadius: 9, border: `0.8px solid ${page === pagination.page ? "#f97316" : "rgba(255,255,255,0.1)"}`, background: page === pagination.page ? "rgba(249,115,22,0.15)" : "transparent", cursor: "pointer", color: page === pagination.page ? "#f97316" : "#9ca3af", fontSize: 13, fontWeight: page === pagination.page ? 600 : 400 }}>
              {page}
            </button>
          ))}
          <button onClick={() => goToPage(pagination.page + 1)} disabled={pagination.page >= pagination.pages}
            style={{ width: 36, height: 36, borderRadius: 9, border: "0.8px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", opacity: pagination.page >= pagination.pages ? 0.4 : 1 }}>
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
