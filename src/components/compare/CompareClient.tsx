"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, Plus, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { College } from "@/types";
import { toast } from "@/components/ui/Toaster";
import Link from "next/link";
import styles from "./CompareClient.module.css";

interface CC extends College {
  courses: Array<{ name: string; fee: number }>;
  placements: Array<{ year: number; avgPackage: number; maxPackage: number; placementRate: number; topRecruiters: string[] }>;
  facilities: Array<{ name: string; available: boolean }>;
  admissions: Array<{ exam: string; minRank?: number | null; maxRank?: number | null }>;
}

export function CompareClient() {
  const sp = useSearchParams();
  const initIds = sp.get("ids")?.split(",").filter(Boolean).slice(0, 3) ?? [];
  const [ids, setIds] = useState<string[]>(initIds);
  const [data, setData] = useState<CC[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<College[]>([]);

  useEffect(() => { if (ids.length >= 2) fetchCompare(); }, [ids]);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      const r = await fetch(`/api/colleges?search=${encodeURIComponent(q)}&limit=6`);
      const d = await r.json();
      setResults(d.colleges ?? []);
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const fetchCompare = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/compare", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }) });
      const d = await r.json();
      setData(d.colleges ?? []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  const add = (c: College) => {
    if (ids.includes(c.id)) { toast.info("Already added"); return; }
    if (ids.length >= 3) { toast.error("Max 3 colleges"); return; }
    setIds([...ids, c.id]); setQ(""); setResults([]);
  };

  const remove = (id: string) => { setIds(ids.filter(x => x !== id)); setData(data.filter(c => c.id !== id)); };

  const allFac = [...new Set(data.flatMap(c => c.facilities.map(f => f.name)))];

  const colGrid = { gridTemplateColumns: `180px repeat(${data.length}, 1fr)` };

  const ROW = ({ label, vals }: { label: string; vals: (string | number | null | undefined)[] }) => (
    <div className={styles.dataRow} style={colGrid}>
      <span className={styles.dataRowLabel}>{label}</span>
      {vals.map((v, i) => <div key={i} className={styles.dataRowValue}>{v ?? "—"}</div>)}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Compare Colleges</h1>
        <p className={styles.pageSubtitle}>Select up to 3 colleges for a side-by-side comparison</p>
      </div>

      {/* Selector */}
      <div className={styles.selectorPanel}>
        <div className={styles.selectorRow}>
          {ids.map(id => {
            const c = data.find(x => x.id === id);
            return (
              <div key={id} className={styles.selectedTag}>
                {c?.name ?? "Loading…"}
                <button onClick={() => remove(id)} className={styles.removeTagBtn}>
                  <X size={13} />
                </button>
              </div>
            );
          })}
          {ids.length < 3 && (
            <div className={styles.searchWrap}>
              <div className={styles.searchInner}>
                <Search size={13} color="#6b7280" className={styles.searchIcon} />
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Search and add a college…"
                  className="input-nexora"
                  style={{ paddingLeft: 34 }}
                />
              </div>
              {results.length > 0 && (
                <div className={styles.searchDropdown}>
                  {results.filter(r => !ids.includes(r.id)).map(r => (
                    <button
                      key={r.id}
                      onMouseDown={() => add(r)}
                      className={styles.searchResultItem}
                    >
                      <Plus size={12} color="#f97316" />
                      <span className={styles.searchResultName}>{r.name}</span>
                      <span className={styles.searchResultCity}>{r.city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {ids.length < 2 && <p className={styles.minHint}>Add at least 2 colleges to compare</p>}
      </div>

      {/* Loading */}
      {loading && <div className={`skeleton ${styles.skeletonWrap}`} />}

      {/* Compare table */}
      {!loading && data.length >= 2 && (
        <div className={styles.compareTable}>
          {/* College headers */}
          <div className={styles.collegeHeaders} style={colGrid}>
            <div />
            {data.map(c => (
              <div key={c.id} className={styles.collegeHeaderCard}>
                <button onClick={() => remove(c.id)} className={styles.removeCollegeBtn}>
                  <X size={11} />
                </button>
                <div className={styles.collegeThumb}>
                  {c.image
                    ? <img src={c.image} alt={c.name} className={styles.collegeThumbImg} />
                    : <div className={styles.collegeThumbLetter}>{c.name[0]}</div>
                  }
                </div>
                <p className={styles.collegeName}>{c.name}</p>
                <p className={styles.collegeLocation}>{c.city}, {c.state}</p>
                <Link href={`/colleges/${c.slug}`} className={styles.collegeDetailsLink}>
                  Details <ArrowRight size={10} />
                </Link>
              </div>
            ))}
          </div>

          {/* Details section */}
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>Basic Information</h3>
            <ROW label="Category" vals={data.map(c => c.category)} />
            <ROW label="Type" vals={data.map(c => c.type)} />
            <ROW label="Established" vals={data.map(c => c.established ?? "—")} />
            <ROW label="NIRF Rank" vals={data.map(c => c.nirfRank ? `#${c.nirfRank}` : "Not Ranked")} />
            <ROW label="Accreditation" vals={data.map(c => c.accreditation ?? "—")} />
            <ROW label="Rating" vals={data.map(c => `${c.rating.toFixed(1)} / 5`)} />
          </div>

          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>Fees & Placements</h3>
            <ROW label="Min Fee/yr" vals={data.map(c => formatCurrency(c.minFee))} />
            <ROW label="Max Fee/yr" vals={data.map(c => formatCurrency(c.maxFee))} />
            <ROW label="Avg Package" vals={data.map(c => { const p = (c as CC).placements?.[0]; return p ? formatCurrency(p.avgPackage) : "—"; })} />
            <ROW label="Max Package" vals={data.map(c => { const p = (c as CC).placements?.[0]; return p ? formatCurrency(p.maxPackage) : "—"; })} />
            <ROW label="Placement %" vals={data.map(c => { const p = (c as CC).placements?.[0]; return p ? `${p.placementRate}%` : "—"; })} />
          </div>

          {/* Facilities */}
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>Facilities</h3>
            {allFac.map(fac => (
              <div key={fac} className={styles.facilityRow} style={colGrid}>
                <span className={styles.facilityLabel}>{fac}</span>
                {data.map(c => {
                  const f = (c as CC).facilities.find(x => x.name === fac);
                  return (
                    <div key={c.id} className={styles.facilityCell}>
                      {f?.available
                        ? <CheckCircle size={14} color="#10b981" className={styles.facilityIconCenter} />
                        : <XCircle size={14} color="#374151" className={styles.facilityIconCenter} />
                      }
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
