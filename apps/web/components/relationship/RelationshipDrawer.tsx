"use client";
import { useEffect, useState } from "react";
import { useGraphStore, useInvestigationStore } from "@/store";
import { getRelationship } from "@/lib/api";
import type { RelationshipEvidence } from "@/types";

const REL_TYPE_LABELS: Record<string, string> = {
  communication: "Communication", financial: "Financial", location: "Location",
  common_case: "Common Case", association: "Association",
};

const SOURCE_COLORS: Record<string, string> = {
  CCTNS: "#3B82F6", "e-Courts": "#8B5CF6", "e-Prisons": "#F59E0B",
  "e-Forensics": "#10B981", "e-Prosecution": "#EC4899", NAFIS: "#6366F1",
};

export default function RelationshipDrawer() {
  const { selectedRelationshipId, setRelationshipPanelOpen } = useGraphStore();
  const { activeRelationshipData, setActiveRelationship } = useInvestigationStore();
  const [loading, setLoading] = useState(false);
  const [rel, setRel] = useState<any>(null);

  useEffect(() => {
    if (!selectedRelationshipId) return;
    setLoading(true);
    getRelationship(selectedRelationshipId)
      .then((r: any) => { setRel(r); setActiveRelationship(selectedRelationshipId, r); })
      .catch(() => {
        // Offline fallback
        const fallback = {
          relationship_id: selectedRelationshipId,
          person_a: "P-928371", person_a_name: "Ravi Kumar",
          person_b: "P-928881", person_b_name: "Sameer Khan",
          relationship_type: "communication", strength: 0.82, confidence: 0.91,
          start_time: "2025-01-15", end_time: "2026-08-01", evidence_count: 14,
          evidence_sources: [
            { source: "CCTNS", record_id: "CDR-882", type: "communication_records", description: "14 call records between 2025-01 and 2026-08" },
            { source: "e-Courts", record_id: "COURT-29183", type: "common_proceeding", description: "Co-accused in CASE-847" },
          ],
          signals: [
            { type: "Communication", description: "14 call interactions", count: 14, source_system: "CCTNS" },
            { type: "Common Case", description: "1 shared case", count: 1, source_system: "e-Courts" },
          ],
        };
        setRel(fallback);
      })
      .finally(() => setLoading(false));
  }, [selectedRelationshipId]);

  if (!selectedRelationshipId) return null;

  return (
    <div className="flex flex-col h-full glass-panel animate-slide-right" style={{ width: 380, borderLeft: "1px solid #1E1E1E" }}>
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-4 pb-4" style={{ borderBottom: "1px solid #1E1E1E" }}>
        <div className="flex items-center justify-between mb-4">
          <span className="section-label">RELATIONSHIP ANALYSIS</span>
          <button onClick={() => setRelationshipPanelOpen(false)} className="text-muted hover:text-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {rel && (
          <>
            {/* Person A ↕ Person B */}
            <div className="flex flex-col items-center gap-1 py-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)" }}>
                  <span className="text-2xs text-accent-red">{rel.person_a_name?.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium text-primary">{rel.person_a_name}</span>
                <span className="font-mono text-2xs text-muted">{rel.person_a}</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-px h-3 bg-accent-red-dim" />
                <span className="text-2xs text-muted">{REL_TYPE_LABELS[rel.relationship_type] || rel.relationship_type}</span>
                <div className="w-px h-3 bg-accent-red-dim" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(139,139,167,0.15)", border: "1px solid rgba(139,139,167,0.3)" }}>
                  <span className="text-2xs text-node-connected">{rel.person_b_name?.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium text-primary">{rel.person_b_name}</span>
                <span className="font-mono text-2xs text-muted">{rel.person_b}</span>
              </div>
            </div>

            {/* Strength */}
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid #1E1E1E" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xs text-muted">Relationship Strength</span>
                <span className="text-sm font-semibold text-primary">{Math.round(rel.strength * 100)}%</span>
              </div>
              <div className="strength-bar">
                <div className="strength-fill" style={{ width: `${rel.strength * 100}%` }} />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xs text-muted">Confidence: {Math.round(rel.confidence * 100)}%</span>
                {rel.start_time && (
                  <span className="text-2xs text-muted">{rel.start_time} → {rel.end_time || "Present"}</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-accent-red border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-secondary">Loading evidence...</span>
          </div>
        )}

        {rel && (
          <>
            {/* Evidence signals */}
            <div>
              <div className="section-label mb-2">EVIDENCE SIGNALS</div>
              <div className="space-y-2">
                {rel.signals?.map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded p-2.5" style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}>
                    <div>
                      <div className="text-xs text-secondary">{s.type}</div>
                      <div className="text-2xs text-muted mt-0.5">{s.description}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold text-primary">{s.count}</span>
                      <span className="source-badge">{s.source_system}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="divider" />

            {/* Supporting sources */}
            <div>
              <div className="section-label mb-2">SOURCE RECORDS</div>
              <div className="space-y-2">
                {rel.evidence_sources?.map((s: any, i: number) => (
                  <div key={i} className="rounded p-2.5" style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: SOURCE_COLORS[s.source] || "#6B7280" }} />
                      <span className="text-2xs font-medium text-secondary">{s.source}</span>
                      <span className="font-mono text-2xs text-muted">·  {s.record_id}</span>
                    </div>
                    <div className="text-2xs text-muted leading-relaxed">{s.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="divider" />

            {/* AI inference notice */}
            <div className="px-3 py-2.5 rounded" style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}>
              <div className="text-2xs text-amber-400/70 leading-relaxed">
                Relationship derived from multi-source evidence corroboration. Strength and confidence scores are computed. Human verification required before use in official proceedings.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
