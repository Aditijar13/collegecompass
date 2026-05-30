"use client";
import Link from "next/link";
import { MapPin, Star, IndianRupee, BookmarkPlus, BookmarkCheck, Award, TrendingUp } from "lucide-react";
import { College } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/Toaster";
import styles from "./CollegeCard.module.css";

interface Props {
  college: College;
  isSaved?: boolean;
  onSaveToggle?: (id: string) => void;
  compareIds?: string[];
  onCompareToggle?: (id: string) => void;
}

const CAT_COLORS: Record<string, string> = {
  ENGINEERING: "#3b82f6", MEDICAL: "#10b981", MANAGEMENT: "#f97316",
  LAW: "#a855f7", ARTS: "#f59e0b", SCIENCE: "#06b6d4", COMMERCE: "#ec4899", DESIGN: "#8b5cf6",
};

export function CollegeCard({ college, isSaved = false, onSaveToggle, compareIds = [], onCompareToggle }: Props) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);
  const isCompare = compareIds.includes(college.id);
  const catColor = CAT_COLORS[college.category] ?? "#6b7280";

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) { toast.error("Sign in to save colleges"); return; }
    if (saving) return;
    setSaving(true);
    try {
      let res: Response;
      if (saved) {
        res = await fetch(`/api/saved?collegeId=${college.id}`, { method: "DELETE" });
      } else {
        res = await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId: college.id }),
        });
      }
      if (!res.ok && res.status !== 409) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error ?? "Something went wrong");
        return;
      }
      setSaved(prev => !prev);
      toast.success(saved ? "Removed from saved" : "College saved!");
      onSaveToggle?.(college.id);
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Link href={`/colleges/${college.slug}`} className={styles.cardLink}>
      <div className={`card ${styles.cardInner}`}>
        {/* Image */}
        <div className={styles.imageWrap}>
          {college.image ? (
            <img src={college.image} alt={college.name} className={styles.collegeImage} />
          ) : (
            <div
              className={styles.imagePlaceholder}
              style={{ background: `linear-gradient(135deg, ${catColor}22, ${catColor}11)` }}
            >
              <span className={styles.imagePlaceholderLetter} style={{ color: `${catColor}40` }}>
                {college.name[0]}
              </span>
            </div>
          )}
          <div className={styles.imageOverlay} />

          {/* Badges */}
          <div className={styles.badges}>
            {college.featured && (
              <span className={styles.featuredBadge}><Award size={10} /> Featured</span>
            )}
            {college.nirfRank && (
              <span className={styles.nirfBadge}>NIRF #{college.nirfRank}</span>
            )}
          </div>

          {/* Save button */}
          <button onClick={handleSave} disabled={saving} className={styles.saveBtn} aria-label={saved ? "Unsave college" : "Save college"}>
            {saved ? <BookmarkCheck size={13} /> : <BookmarkPlus size={13} />}
          </button>

          {/* Category pill */}
          <div className={styles.categoryPill}>
            <span style={{
              padding: "3px 9px", borderRadius: 9999, fontSize: 10, fontWeight: 600,
              background: `${catColor}22`, border: `0.8px solid ${catColor}55`, color: catColor,
            }}>
              {college.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.nameWrap}>
            <h3 className={styles.collegeName}>{college.name}</h3>
            <div className={styles.location}>
              <MapPin size={11} />
              <span className={styles.locationText}>{college.city}, {college.state}</span>
            </div>
          </div>

          {college.accreditation && (
            <span className={styles.accreditation}>{college.accreditation}</span>
          )}

          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <p className={styles.statLabel}>Annual Fee</p>
              <p className={styles.statValue}><IndianRupee size={11} />{formatCurrency(college.minFee)}</p>
            </div>
            <div className={styles.statItemRight}>
              <p className={styles.statLabel}>Rating</p>
              <p className={styles.statValueRight}><Star size={11} color="#f59e0b" fill="#f59e0b" /> {college.rating.toFixed(1)}</p>
            </div>
          </div>

          {college.placementRate && (
  <div className={styles.placement}>
    <TrendingUp size={11} color="#10b981" />
    <span className={styles.placementRate}>
      {college.placementRate}% Placement
    </span>

    {college.avgPackage && (
      <span className={styles.placementPkg}>
        Avg: {formatCurrency(college.avgPackage)}
      </span>
    )}
  </div>
)}

          {onCompareToggle && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCompareToggle(college.id); }}
              className={`${styles.compareBtn} ${isCompare ? styles.compareBtnActive : styles.compareBtnDefault}`}
            >
              {isCompare ? "✓ Added to Compare" : "+ Add to Compare"}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
