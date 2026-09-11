"use client";

const SOURCE_COLORS: Record<string, string> = {
  CCTNS: "#3B82F6", "e-Courts": "#8B5CF6", "e-Prisons": "#F59E0B",
  "e-Forensics": "#10B981", "e-Prosecution": "#EC4899", NAFIS: "#6366F1",
  "e-Sakshya": "#F97316", ITSSO: "#EF4444", MedLEaPR: "#14B8A6",
  "e-Summons": "#84CC16", "Nyaya Shruti": "#A78BFA", ICJS: "#60A5FA",
};

const SOURCE_CATEGORIES: Record<string, string> = {
  CCTNS: "Police", ICJS: "National Interoperability", "e-Courts": "Judiciary",
  "e-Prisons": "Corrections", "e-Forensics": "Forensics", "e-Prosecution": "Prosecution",
  NAFIS: "Biometric", "e-Sakshya": "Digital Evidence", ITSSO: "Special Cases",
  MedLEaPR: "Medical-Legal", "e-Summons": "Court Process", "Nyaya Shruti": "Judicial Video",
};

interface Props {
  sources: Record<string, any[]>;
  sourceSummary: Record<string, number>;
}

export default function DataSourcesTab({ sources, sourceSummary }: Props) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="section-label mb-2">DATA SOURCE SUMMARY</div>
        <div className="space-y-2">
          {Object.entries(sourceSummary).map(([src, count]) => (
            <div key={src} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: SOURCE_COLORS[src] || "#6B7280" }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-secondary">{src}</span>
                  <span className="text-2xs text-muted">{count} records</span>
                </div>
                <div className="text-2xs text-muted">{SOURCE_CATEGORIES[src] || "External"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* Source records */}
      {Object.entries(sources).map(([src, records]) => (
        <div key={src}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ background: SOURCE_COLORS[src] || "#6B7280" }} />
            <span className="text-xs font-medium text-secondary">{src}</span>
            <span className="text-2xs text-muted">— {SOURCE_CATEGORIES[src]}</span>
            <span className="ml-auto text-2xs px-1.5 py-0.5 rounded" style={{ background: "rgba(59,130,246,0.08)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.2)" }}>MOCK</span>
          </div>
          <div className="space-y-2 ml-4">
            {records.map((r: any) => (
              <div key={r.record_id} className="rounded p-2.5" style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-2xs text-primary">{r.record_id}</span>
                  <span className="text-2xs text-muted">{r.record_type}</span>
                </div>
                <div className="text-2xs text-secondary leading-relaxed">{r.summary}</div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-2xs text-muted">{r.timestamp ? new Date(r.timestamp).toLocaleDateString() : ""}</span>
                  <span className={`confidence-chip ${r.confidence >= 0.9 ? "confidence-high" : r.confidence >= 0.7 ? "confidence-medium" : "confidence-low"}`}>
                    {Math.round(r.confidence * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="divider" />
        </div>
      ))}

      <div className="px-3 py-2.5 rounded" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
        <div className="text-2xs text-blue-400/70 font-medium mb-1">DEMO MODE</div>
        <div className="text-2xs text-blue-400/50 leading-relaxed">
          All data source integrations are mock/simulated. Real production integration requires authorized API access, MoU agreements, and government approval for each source system.
        </div>
      </div>
    </div>
  );
}
