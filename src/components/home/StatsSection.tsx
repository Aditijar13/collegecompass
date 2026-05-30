"use client";
export function StatsSection() {
  const stats = [
    { value: "500+", label: "Colleges Listed" },
    { value: "50K+", label: "Student Reviews" },
    { value: "95%", label: "Accurate Placement Data" },
    { value: "18", label: "Categories Covered" },
  ];
  return (
    <section style={{ borderTop: "0.8px solid rgba(255,255,255,0.06)", borderBottom: "0.8px solid rgba(255,255,255,0.06)", padding: "32px 24px", background: "rgba(255,255,255,0.015)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }} className="grid-cols-2 md:grid-cols-4">
        {stats.map(({ value, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "Manrope", fontSize: 32, fontWeight: 700, color: "#f97316", letterSpacing: "-0.02em", marginBottom: 4 }}>{value}</p>
            <p style={{ fontSize: 13, color: "#6b7280" }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
