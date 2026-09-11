"use client";
interface Props { personId: string }

// Placeholder evidence - in production this loads from e-Sakshya, e-Forensics
const EVIDENCE_ITEMS = [
  { id: "EVID-001", type: "Digital Evidence", source: "e-Sakshya", summary: "Mobile phone seized. Hash recorded.", timestamp: "2025-06-20", status: "verified", confidence: 0.98 },
  { id: "EVID-002", type: "Digital Evidence", source: "e-Sakshya", summary: "Laptop seized. Chain of custody maintained.", timestamp: "2025-06-21", status: "verified", confidence: 0.98 },
  { id: "FSL-92831", type: "Forensic Report", source: "e-Forensics", summary: "Digital device analysis. 3 devices examined.", timestamp: "2025-06-20", status: "verified", confidence: 0.92 },
  { id: "FSL-92832", type: "Financial Analysis", source: "e-Forensics", summary: "Transaction trace analysis complete. 4 suspicious transfers identified.", timestamp: "2025-06-25", status: "verified", confidence: 0.88 },
  { id: "CDR-882", type: "Call Record", source: "CCTNS", summary: "14 communication records between persons P-928371 and P-928881.", timestamp: "2025-07-01", status: "verified", confidence: 0.94 },
  { id: "SUM-82931", type: "Summons", source: "e-Summons", summary: "Summons issued for hearing 2025-10-01. Status: Served.", timestamp: "2025-09-10", status: "served", confidence: 1.0 },
];

const STATUS_COLORS: Record<string, string> = {
  verified: "#22C55E", pending: "#F59E0B", rejected: "#DC2626", served: "#3B82F6",
};

export default function EvidenceTab({ personId }: Props) {
  return (
    <div className="p-4 space-y-3">
      <div className="section-label mb-1">EVIDENCE RECORDS ({EVIDENCE_ITEMS.length})</div>
      <div className="text-2xs text-muted mb-3">Evidence associated with this person from ICJS systems. Each item is traceable to its source system.</div>

      {EVIDENCE_ITEMS.map((e) => (
        <div key={e.id} className="rounded-md p-3" style={{ background: "#0D0D0D", border: "1px solid #1E1E1E" }}>
          <div className="flex items-start justify-between mb-1">
            <div>
              <span className="font-mono text-xs text-primary">{e.id}</span>
              <span className="ml-2 text-2xs text-muted">{e.type}</span>
            </div>
            <span className="text-2xs px-1.5 py-0.5 rounded" style={{ color: STATUS_COLORS[e.status] || "#6B7280", background: `${STATUS_COLORS[e.status] || "#6B7280"}18` }}>
              {e.status.toUpperCase()}
            </span>
          </div>
          <div className="text-2xs text-secondary leading-relaxed mb-2">{e.summary}</div>
          <div className="flex items-center justify-between">
            <span className="source-badge">{e.source}</span>
            <div className="flex items-center gap-3">
              <span className="text-2xs text-muted">{e.timestamp}</span>
              <span className={`confidence-chip ${e.confidence >= 0.9 ? "confidence-high" : e.confidence >= 0.7 ? "confidence-medium" : "confidence-low"}`}>
                {Math.round(e.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-3 px-3 py-2 rounded" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
        <div className="text-2xs text-blue-400/70">Evidence sourced from e-Sakshya, e-Forensics, CCTNS, e-Summons. All items retain original source provenance and chain of custody records.</div>
      </div>
    </div>
  );
}
