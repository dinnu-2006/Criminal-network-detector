"use client";
import { useSearchStore } from "@/store";
import type { SearchResult } from "@/types";

const CONFIDENCE_CLASS = (c: number) => c >= 0.9 ? "confidence-high" : c >= 0.7 ? "confidence-medium" : "confidence-low";

const STATUS_LABELS: Record<string, string> = {
  under_investigation: "Under Investigation",
  convicted: "Convicted",
  absconding: "Absconding",
  released: "Released",
};

interface Props {
  query: string;
  onFocus: (result: SearchResult) => void;
  onClose: () => void;
}

export default function SearchResults({ query, onFocus, onClose }: Props) {
  const { results, isSearching, queryType } = useSearchStore();

  return (
    <div
      className="absolute top-full mt-2 glass-panel rounded-lg overflow-hidden animate-slide-up z-50"
      style={{ width: 480, maxHeight: 480 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #1E1E1E" }}>
        <div className="flex items-center gap-2">
          <span className="section-label">SEARCH RESULTS</span>
          {queryType && (
            <span className="text-2xs px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(255,255,255,0.04)", color: "#6B6B6B", border: "1px solid #242424" }}>
              {queryType.toUpperCase()}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-muted hover:text-secondary">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: 400 }}>
        {/* Loading */}
        {isSearching && (
          <div className="flex items-center gap-3 px-4 py-6">
            <div className="w-4 h-4 border border-accent-red border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-secondary searching">Searching across all data sources...</span>
          </div>
        )}

        {/* No results */}
        {!isSearching && results.length === 0 && query && (
          <div className="px-4 py-8 text-center">
            <div className="text-secondary text-sm mb-1">NO PERSON FOUND</div>
            <div className="text-muted text-xs">No authorized matching profile was found for "{query}"</div>
          </div>
        )}

        {/* Results */}
        {!isSearching && results.length > 0 && (
          <div className="p-3 space-y-2">
            {results.length > 1 && (
              <div className="px-1 pb-1">
                <span className="text-2xs text-muted">MULTIPLE POSSIBLE MATCHES — Select the profile to investigate</span>
              </div>
            )}
            {results.map((r, i) => (
              <div key={r.person_id} className="person-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-red flex-shrink-0" />
                      <span className="text-sm font-medium text-primary truncate">{r.display_name}</span>
                      <span className={`confidence-chip ${CONFIDENCE_CLASS(r.confidence)}`}>
                        {Math.round(r.confidence * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3 ml-3.5">
                      <span className="text-2xs font-mono text-muted">{r.person_id}</span>
                      {r.location && <span className="text-2xs text-muted">· {r.location}</span>}
                    </div>
                    <div className="flex items-center gap-4 mt-2 ml-3.5">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                        </svg>
                        <span className="text-2xs text-secondary">{r.connection_count} connections</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-2xs text-secondary">{r.case_count} cases</span>
                      </div>
                      <span className="text-2xs text-muted font-mono">{r.cluster_id}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onFocus(r)}
                    className="flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-all"
                    style={{
                      background: "rgba(220,38,38,0.1)",
                      border: "1px solid rgba(220,38,38,0.3)",
                      color: "#FCA5A5",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(220,38,38,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(220,38,38,0.1)";
                    }}
                  >
                    FOCUS
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2" style={{ borderTop: "1px solid #1E1E1E" }}>
        <span className="text-2xs text-muted">
          Searching across CCTNS · e-Courts · e-Prisons · NAFIS · e-Forensics and {results.length > 0 ? `${results.length} result${results.length !== 1 ? "s" : ""} found` : "all integrated sources"}
        </span>
      </div>
    </div>
  );
}
