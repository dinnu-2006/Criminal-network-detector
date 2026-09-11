"use client";

const MOCK_CASES = [
  { case_id: "CASE-847", title: "Financial Fraud Investigation 2025", status: "active", date: "2025-03-15", fir: "FIR-2025-1842", persons: 3, ps: "Anna Nagar PS, Chennai" },
  { case_id: "CASE-102", title: "Money Laundering - 2024", status: "closed", date: "2024-08-20", fir: "FIR-2024-0391", persons: 2, ps: "T. Nagar PS, Chennai" },
  { case_id: "CASE-182", title: "Digital Financial Crime", status: "under_investigation", date: "2026-02-10", fir: "FIR-2026-0182", persons: 1, ps: "Cyber Crime Cell, Chennai" },
  { case_id: "CASE-291", title: "Cross-Border Smuggling Network", status: "active", date: "2025-09-01", fir: "FIR-2025-2291", persons: 7, ps: "Border Crime Cell, Delhi" },
  { case_id: "CASE-401", title: "Organized Extortion - Northern Region", status: "active", date: "2025-11-15", fir: "FIR-2025-3401", persons: 12, ps: "Special Investigation Unit" },
  { case_id: "CASE-551", title: "Cyber Fraud Operation", status: "closed", date: "2024-05-12", fir: "FIR-2024-0551", persons: 4, ps: "Cyber Crime Cell, Hyderabad" },
];

const STATUS_COLORS: Record<string, string> = {
  active: "#F59E0B", closed: "#22C55E", under_investigation: "#3B82F6",
};

export default function CasesPage() {
  return (
    <div className="h-full overflow-y-auto p-6" style={{ background: "#050505" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-primary">Cases</h1>
            <p className="text-xs text-secondary mt-1">Associated criminal cases across all ICJS source systems</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xs text-muted">SOURCE: CCTNS + e-Courts</span>
          </div>
        </div>

        <div className="grid gap-3">
          {MOCK_CASES.map((c) => (
            <div key={c.case_id} className="rounded-lg p-4" style={{ background: "#0D0D0D", border: "1px solid #1E1E1E" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-primary">{c.case_id}</span>
                    <span className="text-2xs px-1.5 py-0.5 rounded" style={{ color: STATUS_COLORS[c.status], background: `${STATUS_COLORS[c.status]}18`, border: `1px solid ${STATUS_COLORS[c.status]}30` }}>
                      {c.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-primary mb-2">{c.title}</div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1">
                    <div className="flex gap-1.5"><span className="text-2xs text-muted">FIR:</span><span className="text-2xs font-mono text-secondary">{c.fir}</span></div>
                    <div className="flex gap-1.5"><span className="text-2xs text-muted">Date:</span><span className="text-2xs text-secondary">{c.date}</span></div>
                    <div className="flex gap-1.5"><span className="text-2xs text-muted">Persons:</span><span className="text-2xs text-secondary">{c.persons}</span></div>
                    <div className="flex gap-1.5"><span className="text-2xs text-muted">PS:</span><span className="text-2xs text-secondary">{c.ps}</span></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
