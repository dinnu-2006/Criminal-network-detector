"use client";
import { useState } from "react";
import type { AIAnalysis } from "@/types";

const SIGNAL_ICONS: Record<string, string> = {
  network_centrality: "◉", cross_cluster: "↔", temporal_pattern: "⏱", multi_source: "⊕",
};

interface Props { analysis: AIAnalysis | null }

export default function AIAnalysisTab({ analysis }: Props) {
  const [showPath, setShowPath] = useState(false);

  if (!analysis) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border border-accent-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <div className="text-xs text-secondary">Running AI analysis...</div>
        <div className="text-2xs text-muted mt-1">Analyzing network patterns and evidence signals</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* AI badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)" }}>
        <div className="w-1.5 h-1.5 rounded-full bg-accent-red" />
        <span className="text-2xs text-accent-red/80 font-medium">AI INVESTIGATIVE ANALYSIS</span>
        <div className="flex-1" />
        <span className="text-2xs text-muted">{analysis.model_info}</span>
      </div>

      {/* Summary */}
      <div>
        <div className="section-label mb-2">SUMMARY</div>
        <div className="text-xs text-secondary leading-relaxed">{analysis.summary}</div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-2xs text-muted">Analysis Confidence:</span>
          <span className={`confidence-chip ${analysis.confidence >= 0.9 ? "confidence-high" : analysis.confidence >= 0.7 ? "confidence-medium" : "confidence-low"}`}>
            {Math.round(analysis.confidence * 100)}%
          </span>
        </div>
      </div>

      <div className="divider" />

      {/* Signals */}
      <div>
        <div className="section-label mb-2">OBSERVED SIGNALS</div>
        <div className="space-y-2">
          {analysis.signals.map((s, i) => (
            <div key={i} className="rounded p-3" style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}>
              <div className="flex items-start gap-2">
                <span className="text-sm text-secondary flex-shrink-0 mt-0.5">{SIGNAL_ICONS[s.type] || "·"}</span>
                <div className="flex-1">
                  <div className="text-xs text-secondary leading-relaxed">{s.description}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="strength-bar w-20">
                      <div className="strength-fill" style={{ width: `${s.confidence * 100}%` }} />
                    </div>
                    <span className="text-2xs text-muted">{Math.round(s.confidence * 100)}% confidence</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* Supporting evidence */}
      <div>
        <div className="section-label mb-2">SUPPORTING EVIDENCE</div>
        <div className="flex flex-wrap gap-1.5">
          {analysis.supporting_evidence.map((e) => (
            <span key={e} className="font-mono text-2xs px-2 py-1 rounded" style={{ background: "#0D0D0D", border: "1px solid #2A2A2A", color: "#8B8BA7" }}>
              {e}
            </span>
          ))}
        </div>
      </div>

      {/* Reasoning path */}
      <div>
        <button
          onClick={() => setShowPath(!showPath)}
          className="flex items-center gap-2 text-xs text-secondary hover:text-primary transition-colors"
        >
          <span>{showPath ? "▼" : "▶"}</span>
          REASONING PATH
        </button>
        {showPath && (
          <div className="mt-2 pl-4 space-y-1 animate-fade">
            {analysis.reasoning_path.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && <div className="w-px h-3 bg-border-subtle ml-1 -mt-1 absolute" />}
                <span className="text-2xs text-secondary">{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="divider" />

      {/* Disclaimer */}
      <div className="rounded px-3 py-3" style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)" }}>
        <div className="flex items-start gap-2">
          <span className="text-amber-400 text-sm flex-shrink-0">⚠</span>
          <div>
            <div className="text-2xs text-amber-400/80 font-medium mb-1">HUMAN VERIFICATION REQUIRED</div>
            <div className="text-2xs text-amber-400/60 leading-relaxed">{analysis.disclaimer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
