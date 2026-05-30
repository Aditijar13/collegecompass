"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { STATES, CATEGORIES, COLLEGE_TYPES } from "@/lib/utils";

export function CollegeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [state, setState] = useState(searchParams.get("state") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") ?? "rating");
  const [minPlacement, setMinPlacement] = useState(searchParams.get("minPlacement") ?? "");
  const [expanded, setExpanded] = useState(true);

  const buildParams = (overrides: Record<string, string> = {}) => {
    const p = new URLSearchParams();
    const vals: Record<string, string> = { search, state, category, type, sortBy, minPlacement, page: "1", ...overrides };
    Object.entries(vals).forEach(([k, v]) => { if (v) p.set(k, v); });
    return p.toString();
  };

  const apply = (overrides: Record<string, string> = {}) => router.push(`/colleges?${buildParams(overrides)}`);

  const clear = () => {
    setSearch(""); setState(""); setCategory(""); setType(""); setSortBy("rating"); setMinPlacement("");
    router.push("/colleges");
  };

  useEffect(() => {
    const t = setTimeout(() => apply(), 450);
    return () => clearTimeout(t);
  }, [search]);

  const hasFilters = search || state || category || type || minPlacement;

  const pill = (label: string, active: boolean, onClick: () => void) => (
    <button key={label} onClick={onClick} style={{
      fontSize: 11, padding: "5px 11px", borderRadius: 9999,
      background: active ? "rgba(249,115,22,0.15)" : "transparent",
      border: `0.8px solid ${active ? "rgba(249,115,22,0.45)" : "rgba(255,255,255,0.08)"}`,
      color: active ? "#f97316" : "#9ca3af",
      cursor: "pointer", transition: "all 150ms ease", fontWeight: active ? 600 : 400,
    }}>{label}</button>
  );

  return (
    <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "0.8px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SlidersHorizontal size={14} color="#f97316" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Filters</span>
          {hasFilters && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 9999, background: "rgba(249,115,22,0.15)", color: "#f97316", fontWeight: 600 }}>Active</span>}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {hasFilters && <button onClick={clear} style={{ fontSize: 11, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>Clear all</button>}
          <button onClick={() => setExpanded(!expanded)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Search */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Search</label>
            <div style={{ position: "relative" }}>
              <Search size={13} color="#6b7280" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="College, city, state..."
                className="input-nexora" style={{ paddingLeft: 34, paddingRight: search ? 34 : 14 }} />
              {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}><X size={13} /></button>}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Sort By</label>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); apply({ sortBy: e.target.value }); }} className="input-nexora" style={{ paddingTop: 10, paddingBottom: 10 }}>
              <option value="rating">Top Rated</option>
              <option value="ranking">NIRF Ranking</option>
              <option value="placement">Placement %</option>
              <option value="fee_asc">Fee: Low → High</option>
              <option value="fee_desc">Fee: High → Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATEGORIES.map((cat) => pill(cat, category === cat, () => { const val = category === cat ? "" : cat; setCategory(val); apply({ category: val }); }))}
            </div>
          </div>

          {/* Type */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>College Type</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {COLLEGE_TYPES.map((t) => pill(t, type === t, () => { const val = type === t ? "" : t; setType(val); apply({ type: val }); }))}
            </div>
          </div>

          {/* State */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>State</label>
            <select value={state} onChange={(e) => { setState(e.target.value); apply({ state: e.target.value }); }} className="input-nexora" style={{ paddingTop: 10, paddingBottom: 10 }}>
              <option value="">All States</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Min placement */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Min Placement %</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["0", "70", "80", "90", "95"].map((v) => pill(v === "0" ? "Any" : `${v}%+`, minPlacement === v || (v === "0" && !minPlacement), () => { const val = v === "0" ? "" : v; setMinPlacement(val); apply({ minPlacement: val }); }))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
