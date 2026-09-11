"use client";
import type { CaseRecord } from "@/types";

const CASE_STATUS_COLORS: Record<string, string> = {
  active: "#F59E0B", closed: "#22C55E", under_investigation: "#3B82F6",
};
const CASE_STATUS_LABELS: Record<string, string> = {
  active: "ACTIVE", closed: "CLOSED", under_investigation: "UNDER INVESTIGATION",
};

interface Props { cases: CaseRecord[] }

export default function CasesTab({ cases }: Props) {
  if (cases.length === 0) {
    return <div className="p-6 text-center text-xs text-muted">No cases associated or loading...</div>;
  }
  return (
    <div className="p-4 space-y-3">
      <div className="section-label mb-1">ASSOCIATED CASES ({cases.length})</div>
      {cases.map((c) => (
        <div key={c.case_id} className="rounded-md p-3" style={{ background: "#0D0D0D", border: "1px solid #1E1E1E" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-primary">{c.case_id}</span>
            <span className="text-2xs px-1.5 py-0.5 rounded font-mono" style={{ color: CASE_STATUS_COLORS[c.status] || "#6B7280", background: `${CASE_STATUS_COLORS[c.status]}18`, border: `1px solid ${CASE_STATUS_COLORS[c.status]}30` }}>
              {CASE_STATUS_LABELS[c.status] || c.status.toUpperCase()}
            </span>
          </div>
          <div className="text-xs text-secondary mb-1.5">{c.title}</div>
          <div className="text-2xs text-muted leading-relaxed mb-2">{c.description}</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <div className="flex gap-1.5">
              <span className="text-2xs text-muted">Role:</span>
              <span className="text-2xs text-secondary">{c.role}</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-2xs text-muted">Date:</span>
              <span className="text-2xs text-secondary">{c.date}</span>
            </div>
            {c.fir_number && (
              <div className="flex gap-1.5">
                <span className="text-2xs text-muted">FIR:</span>
                <span className="text-2xs font-mono text-secondary">{c.fir_number}</span>
              </div>
            )}
            {c.police_station && (
              <div className="flex gap-1.5 w-full">
                <span className="text-2xs text-muted">PS:</span>
                <span className="text-2xs text-secondary">{c.police_station}</span>
              </div>
            )}
          </div>
          <div className="mt-2 pt-2" style={{ borderTop: "1px solid #1E1E1E" }}>
            <span className="source-badge">{c.source_system}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
