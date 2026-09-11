"use client";
import { useEffect, useState } from "react";
import { getDataSources, getIntegrationSummary } from "@/lib/api";

const CATEGORY_COLORS: Record<string, string> = {
  Police: "#3B82F6", Judiciary: "#8B5CF6", Corrections: "#F59E0B",
  Forensics: "#10B981", Prosecution: "#EC4899", Biometric: "#6366F1",
  "Digital Evidence": "#F97316", "Special Cases": "#EF4444",
  "Medical-Legal": "#14B8A6", "Court Process": "#84CC16",
  "Judicial Video": "#A78BFA", "National Interoperability": "#60A5FA",
};

export default function DataSourcesPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDataSources(), getIntegrationSummary()])
      .then(([s, sum]: [any, any]) => { setSources(s); setSummary(sum); })
      .catch(() => {
        // Offline fallback
        setSources([
          { source_id: "CCTNS", source_name: "CCTNS — Crime & Criminal Tracking Network", category: "Police", is_mock: true, status: "healthy", records_processed: 3821442, error_count: 0, latency_ms: 42.3, last_sync: "2026-09-11T10:00:00Z" },
          { source_id: "ICJS", source_name: "ICJS — Interoperable Criminal Justice System", category: "National Interoperability", is_mock: true, status: "healthy", records_processed: 12400000, error_count: 2, latency_ms: 67.1, last_sync: "2026-09-11T10:00:00Z" },
          { source_id: "e-Courts", source_name: "e-Courts / CIS — Court Information System", category: "Judiciary", is_mock: true, status: "healthy", records_processed: 5623801, error_count: 0, latency_ms: 55.2, last_sync: "2026-09-11T10:00:00Z" },
          { source_id: "e-Prisons", source_name: "e-Prisons — Prison & Custody Management", category: "Corrections", is_mock: true, status: "healthy", records_processed: 892341, error_count: 1, latency_ms: 38.9, last_sync: "2026-09-11T10:00:00Z" },
          { source_id: "e-Forensics", source_name: "e-Forensics — Forensic Laboratory System", category: "Forensics", is_mock: true, status: "healthy", records_processed: 428103, error_count: 0, latency_ms: 91.4, last_sync: "2026-09-11T10:00:00Z" },
          { source_id: "e-Prosecution", source_name: "e-Prosecution — Prosecution Management", category: "Prosecution", is_mock: true, status: "healthy", records_processed: 1102883, error_count: 0, latency_ms: 44.8, last_sync: "2026-09-11T10:00:00Z" },
          { source_id: "NAFIS", source_name: "NAFIS — National Automated Fingerprint ID", category: "Biometric", is_mock: true, status: "healthy", records_processed: 1839210, error_count: 0, latency_ms: 120.5, last_sync: "2026-09-11T10:00:00Z" },
          { source_id: "e-Sakshya", source_name: "e-Sakshya — Digital Evidence Management", category: "Digital Evidence", is_mock: true, status: "healthy", records_processed: 342109, error_count: 0, latency_ms: 33.2, last_sync: "2026-09-11T10:00:00Z" },
          { source_id: "ITSSO", source_name: "ITSSO — Investigation Tracking for Sexual Offences", category: "Special Cases", is_mock: true, status: "healthy", records_processed: 129011, error_count: 0, latency_ms: 28.9, last_sync: "2026-09-11T10:00:00Z" },
          { source_id: "MedLEaPR", source_name: "MedLEaPR — Medico-Legal Examination & PM", category: "Medical-Legal", is_mock: true, status: "warning", records_processed: 88203, error_count: 3, latency_ms: 72.1, last_sync: "2026-09-11T10:00:00Z" },
          { source_id: "e-Summons", source_name: "e-Summons — Electronic Summons Workflow", category: "Court Process", is_mock: true, status: "healthy", records_processed: 2183041, error_count: 0, latency_ms: 22.4, last_sync: "2026-09-11T10:00:00Z" },
          { source_id: "Nyaya Shruti", source_name: "Nyaya Shruti — Judicial Video Proceedings", category: "Judicial Video", is_mock: true, status: "healthy", records_processed: 412800, error_count: 1, latency_ms: 58.7, last_sync: "2026-09-11T10:00:00Z" },
        ]);
        setSummary({ total_sources: 12, healthy: 11, warning: 1, error: 0, total_records_processed: 26863144, last_full_sync: "2026-09-11T10:00:00Z", demo_mode: true });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6" style={{ background: "#050505" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-primary">Data Sources</h1>
          <p className="text-xs text-secondary mt-1">12 ICJS integrated source systems — mock adapters for prototype demonstration</p>
        </div>

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Sources", val: summary.total_sources, color: "#E8E8E8" },
              { label: "Healthy", val: summary.healthy, color: "#22C55E" },
              { label: "Warning", val: summary.warning, color: "#F59E0B" },
              { label: "Records Processed", val: (summary.total_records_processed / 1e6).toFixed(1) + "M", color: "#3B82F6" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg p-4" style={{ background: "#0D0D0D", border: "1px solid #1E1E1E" }}>
                <div className="text-xl font-semibold mb-1" style={{ color: s.color }}>{s.val}</div>
                <div className="text-2xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Demo notice */}
        <div className="px-4 py-3 rounded-lg mb-5" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
          <div className="flex items-center gap-2">
            <div className="status-dot mock" />
            <span className="text-xs text-blue-400/80 font-medium">DEMO MODE — All integrations are mock/simulated</span>
          </div>
          <p className="text-2xs text-blue-400/50 mt-1 ml-4 leading-relaxed">
            Real production integration requires authorized API access, MoU agreements, and government approval for each source system (MHA/NIC/State Police).
          </p>
        </div>

        {/* Sources grid */}
        {loading ? (
          <div className="flex items-center gap-2"><div className="w-4 h-4 border border-accent-red border-t-transparent rounded-full animate-spin" /><span className="text-xs text-secondary">Loading...</span></div>
        ) : (
          <div className="grid gap-3">
            {sources.map((s) => (
              <div key={s.source_id} className="rounded-lg p-4 flex items-center gap-4" style={{ background: "#0D0D0D", border: "1px solid #1E1E1E" }}>
                <div className="flex-shrink-0">
                  <div className={`status-dot ${s.status}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs text-primary">{s.source_id}</span>
                    <div className="text-2xs px-1.5 py-0.5 rounded" style={{ background: `${CATEGORY_COLORS[s.category] || "#6B7280"}18`, color: CATEGORY_COLORS[s.category] || "#6B7280", border: `1px solid ${CATEGORY_COLORS[s.category] || "#6B7280"}30` }}>
                      {s.category}
                    </div>
                    <span className="ml-auto text-2xs px-1.5 py-0.5 rounded" style={{ background: "rgba(59,130,246,0.08)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.2)" }}>MOCK</span>
                  </div>
                  <div className="text-xs text-secondary">{s.source_name}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 flex-shrink-0 text-right">
                  <div><div className="text-sm font-semibold text-primary">{(s.records_processed / 1e6).toFixed(2)}M</div><div className="text-2xs text-muted">Records</div></div>
                  <div><div className="text-sm font-semibold text-primary">{s.latency_ms}ms</div><div className="text-2xs text-muted">Latency</div></div>
                  <div><div className="text-sm font-semibold" style={{ color: s.status === "healthy" ? "#22C55E" : "#F59E0B" }}>{s.status.toUpperCase()}</div><div className="text-2xs text-muted">{s.error_count} errors</div></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
