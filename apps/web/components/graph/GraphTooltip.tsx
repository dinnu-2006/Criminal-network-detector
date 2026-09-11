"use client";
import { useGraphStore } from "@/store";

interface Props {
  personId: string;
  pos: { x: number; y: number };
}

const STATUS_LABELS: Record<string, string> = {
  under_investigation: "Under Investigation",
  convicted: "Convicted",
  acquitted: "Acquitted",
  absconding: "Absconding",
  released: "Released",
  deceased: "Deceased",
  unknown: "Unknown",
};

const STATUS_COLORS: Record<string, string> = {
  under_investigation: "#F59E0B",
  convicted: "#DC2626",
  acquitted: "#22C55E",
  absconding: "#EF4444",
  released: "#6B7280",
};

export default function GraphTooltip({ personId, pos }: Props) {
  const { nodes } = useGraphStore();
  const person = nodes.find((n) => n.person_id === personId);
  if (!person) return null;

  const statusColor = STATUS_COLORS[person.status] || "#6B7280";
  const statusLabel = STATUS_LABELS[person.status] || person.status;

  return (
    <div
      className="graph-tooltip animate-fade"
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
        <span className="text-sm font-medium text-primary">{person.display_name}</span>
      </div>
      <div className="space-y-0.5">
        <div className="flex justify-between gap-4">
          <span className="text-2xs text-muted">Person ID</span>
          <span className="text-2xs text-secondary font-mono">{person.person_id}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-2xs text-muted">Connections</span>
          <span className="text-2xs text-secondary">{person.connection_count}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-2xs text-muted">Cases</span>
          <span className="text-2xs text-secondary">{person.case_count}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-2xs text-muted">Status</span>
          <span className="text-2xs" style={{ color: statusColor }}>{statusLabel}</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-border-subtle">
        <span className="text-2xs text-muted">Click to investigate</span>
      </div>
    </div>
  );
}
