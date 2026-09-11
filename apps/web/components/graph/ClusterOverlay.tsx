"use client";
import { useGraphStore } from "@/store";
import type { ClusterSummary } from "@/types";
import { investigationFocus } from "@/lib/api";
import { useSearchStore, useInvestigationStore } from "@/store";

export default function ClusterOverlay() {
  const { clusters, setMode, setSubgraph, setFocusContext, setActiveClusterId } = useGraphStore();

  if (clusters.length === 0) return null;

  // Position clusters in viewport space (not sigma space)
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1920;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 1080;
  const cx = viewportW / 2;
  const cy = viewportH / 2;
  const scale = 0.9; // scale factor for viewport mapping

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Global view label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <span className="text-2xs text-muted font-mono tracking-[0.2em]">GLOBAL CRIMINAL NETWORK — 58M PROFILE ARCHITECTURE</span>
      </div>

      {clusters.map((c) => {
        const px = cx + c.x * scale * 0.4;
        const py = cy + c.y * scale * 0.4;
        const r = Math.max(60, c.radius * 0.7);

        return (
          <div
            key={c.cluster_id}
            className="absolute pointer-events-auto cluster-bubble"
            style={{
              left: px - r,
              top: py - r,
              width: r * 2,
              height: r * 2,
            }}
            title={c.description}
          >
            <div className="flex flex-col items-center gap-1 select-none">
              <span className="font-mono text-2xs text-muted tracking-wider">{c.cluster_id}</span>
              <span className="text-xs text-primary font-medium text-center leading-tight px-2">{c.name}</span>
              <span className="text-2xs text-secondary font-mono">{c.person_count.toLocaleString()} profiles</span>
              <div className="flex gap-1 mt-1 flex-wrap justify-center px-2">
                {c.top_keywords?.slice(0, 2).map((kw) => (
                  <span key={kw} className="text-2xs text-muted px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1E1E1E" }}>{kw}</span>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Connection lines between clusters (SVG overlay) */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
        {[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[1,7]].map(([a,b], i) => {
          const ca = clusters[a], cb = clusters[b];
          if (!ca || !cb) return null;
          const ax = cx + ca.x * scale * 0.4;
          const ay = cy + ca.y * scale * 0.4;
          const bx = cx + cb.x * scale * 0.4;
          const by = cy + cb.y * scale * 0.4;
          return (
            <line key={i} x1={ax} y1={ay} x2={bx} y2={by}
              stroke="#1A1A28" strokeWidth="1" strokeDasharray="4 8" />
          );
        })}
      </svg>
    </div>
  );
}
