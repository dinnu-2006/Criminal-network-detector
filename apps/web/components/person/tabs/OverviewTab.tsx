"use client";
import type { PersonProfile } from "@/types";

const SOURCE_COLORS: Record<string, string> = {
  CCTNS: "#3B82F6", "e-Courts": "#8B5CF6", "e-Prisons": "#F59E0B",
  "e-Forensics": "#10B981", "e-Prosecution": "#EC4899", NAFIS: "#6366F1",
  "e-Sakshya": "#F97316", ITSSO: "#EF4444", MedLEaPR: "#14B8A6",
};

interface Props { profile: PersonProfile }

export default function OverviewTab({ profile }: Props) {
  return (
    <div className="p-4 space-y-5">
      {/* Identity */}
      <div>
        <div className="section-label mb-2">IDENTITY</div>
        <div className="space-y-1.5">
          <Row label="Person ID" value={profile.person_id} mono />
          <Row label="Cluster" value={profile.cluster_id} mono />
          {profile.community_id && <Row label="Community" value={profile.community_id} mono />}
          {profile.location && <Row label="Location" value={profile.location} />}
        </div>
      </div>

      <div className="divider" />

      {/* Cross-System Summary */}
      <div>
        <div className="section-label mb-2">CROSS-SYSTEM SUMMARY</div>
        <div className="space-y-2">
          {Object.entries(profile.source_summary || {}).map(([src, count]) => (
            <div key={src} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: SOURCE_COLORS[src] || "#6B7280" }} />
                <span className="text-xs text-secondary">{src}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="strength-bar w-16">
                  <div className="strength-fill" style={{ width: `${Math.min(100, (count as number) * 20)}%` }} />
                </div>
                <span className="text-xs text-muted w-8 text-right">{count as number} rec.</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* Record info */}
      <div>
        <div className="section-label mb-2">RECORD INFORMATION</div>
        <div className="space-y-1.5">
          <Row label="First Recorded" value={new Date(profile.created_at).toLocaleDateString()} />
          <Row label="Last Updated" value={new Date(profile.updated_at).toLocaleDateString()} />
          <Row label="Data Sources" value={`${profile.source_count} systems`} />
        </div>
      </div>

      <div className="divider" />

      {/* Notice */}
      <div className="rounded px-3 py-2.5" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
        <div className="text-2xs text-amber-400/70 leading-relaxed">
          Profile compiled from {profile.source_count} authorized source systems. Data subject to ongoing verification. Access and use governed by applicable authorization policies.
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-2xs text-muted flex-shrink-0">{label}</span>
      <span className={`text-xs text-secondary text-right ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
