"use client";
import type { PersonConnection } from "@/types";
import { useGraphStore, useInvestigationStore } from "@/store";
import { getRelationship } from "@/lib/api";

const REL_TYPE_LABELS: Record<string, string> = {
  communication: "Communication", financial: "Financial", location: "Location",
  common_case: "Common Case", association: "Association", family: "Family",
  organizational: "Organizational", temporal: "Temporal", other: "Other",
};

interface Props { connections: PersonConnection[] }

export default function ConnectionsTab({ connections }: Props) {
  const { setSelectedRelationship, setRelationshipPanelOpen, setPersonPanelOpen } = useGraphStore();
  const { setActiveRelationship } = useInvestigationStore();

  const handleRelClick = async (conn: PersonConnection) => {
    setSelectedRelationship(conn.relationship_id);
    try {
      const rel: any = await getRelationship(conn.relationship_id);
      setActiveRelationship(conn.relationship_id, rel);
    } catch {
      setActiveRelationship(conn.relationship_id, null);
    }
    setRelationshipPanelOpen(true);
    setPersonPanelOpen(false);
  };

  if (connections.length === 0) {
    return <div className="p-6 text-center text-xs text-muted">No connections found or loading...</div>;
  }

  return (
    <div className="p-4 space-y-2">
      <div className="section-label mb-1">{connections.length} CONNECTIONS</div>
      {connections.map((c) => (
        <div key={c.relationship_id} className="person-card" onClick={() => handleRelClick(c)}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#1A1A2A", border: "1px solid #2A2A3A" }}>
                <span className="text-2xs text-secondary">{c.display_name.charAt(0)}</span>
              </div>
              <span className="text-xs text-primary">{c.display_name}</span>
            </div>
            <span className="text-2xs text-accent-red font-mono">{Math.round(c.strength * 100)}%</span>
          </div>
          <div className="strength-bar mb-1.5">
            <div className="strength-fill" style={{ width: `${c.strength * 100}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xs text-muted">{REL_TYPE_LABELS[c.relationship_type] || c.relationship_type}</span>
              <span className="text-2xs text-muted">· {c.evidence_count} evidence</span>
            </div>
            <div className="flex gap-1">
              {c.source_systems.slice(0, 3).map((s) => (
                <span key={s} className="source-badge">{s}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
