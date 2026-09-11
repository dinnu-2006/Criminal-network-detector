"use client";
export default function InvestigationsPage() {
  return (
    <div className="h-full overflow-y-auto p-6" style={{ background: "#050505" }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-lg font-semibold text-primary mb-4">Investigations</h1>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Active Investigations", val: 3, color: "#F59E0B" },
            { label: "Persons Under Watch", val: 17, color: "#DC2626" },
            { label: "Cluster Analyses", val: 8, color: "#3B82F6" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg p-4" style={{ background: "#0D0D0D", border: "1px solid #1E1E1E" }}>
              <div className="text-2xl font-semibold mb-1" style={{ color: s.color }}>{s.val}</div>
              <div className="text-xs text-secondary">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-lg p-4" style={{ background: "#0D0D0D", border: "1px solid #1E1E1E" }}>
          <div className="section-label mb-3">ACTIVE INVESTIGATIONS</div>
          <div className="text-xs text-secondary text-center py-8 text-muted">
            Use the Network view to search for a person and click FOCUS to begin an investigation.<br />
            Investigation tracking and collaboration features are planned for v2.0.
          </div>
        </div>
      </div>
    </div>
  );
}
