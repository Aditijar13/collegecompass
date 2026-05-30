export function Skeleton({ style }: { style?: React.CSSProperties }) {
  return <div className="skeleton" style={{ borderRadius: 8, ...style }} />;
}

export function CollegeCardSkeleton() {
  return (
    <div style={{ background: "rgb(22,22,28)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
      <div className="skeleton" style={{ height: 168, borderRadius: 0 }} />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="skeleton" style={{ height: 16, width: "70%" }} />
        <div className="skeleton" style={{ height: 12, width: "45%" }} />
        <div className="skeleton" style={{ height: 10, width: "30%", borderRadius: 9999 }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <div className="skeleton" style={{ height: 14, width: "35%" }} />
          <div className="skeleton" style={{ height: 14, width: "25%" }} />
        </div>
      </div>
    </div>
  );
}
