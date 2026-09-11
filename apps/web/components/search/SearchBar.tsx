"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchStore, useGraphStore, useInvestigationStore } from "@/store";
import { searchPersons, investigationFocus } from "@/lib/api";
import type { SearchResult, FocusContext } from "@/types";
import SearchResults from "./SearchResults";

const QUERY_TYPE_LABELS: Record<string, string> = {
  name: "PERSON NAME",
  mobile: "MOBILE",
  email: "EMAIL",
  vehicle: "VEHICLE",
  fir: "FIR",
  case_id: "CASE ID",
  person_id: "PERSON ID",
  aadhaar: "AADHAAR",
};

const PHASE_LABELS = {
  searching: "Searching...",
  resolving: "Resolving person...",
  locating: "Locating network...",
  navigating: "Navigating...",
  done: "",
};

function detectQueryTypeFrontend(q: string): string {
  if (/^[6-9]\d{9}$/.test(q)) return "mobile";
  if (/^[A-Z]{2}\d{2}[A-Za-z]{1,2}\d{4}$/i.test(q)) return "vehicle";
  if (/^FIR-/i.test(q)) return "fir";
  if (/^CASE-/i.test(q)) return "case_id";
  if (/^P-/i.test(q)) return "person_id";
  if (/\d{12}/.test(q)) return "aadhaar";
  return "name";
}

export default function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { query, setQuery, setResults, isSearching, setIsSearching, searchOpen, setSearchOpen, queryType, setQueryType, searchPhase, setSearchPhase, clearSearch } = useSearchStore();
  const { setFocusContext, setMode, setSubgraph, focusContext } = useGraphStore();

  const handleInput = useCallback((val: string) => {
    setInputVal(val);
    const detected = detectQueryTypeFrontend(val);
    setQueryType(detected);

    if (!val.trim()) {
      clearSearch();
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      setSearchPhase("searching");
      setSearchOpen(true);
      try {
        const res: any = await searchPersons(val);
        setResults(res.results || []);
        setQueryType(res.query_type || detected);
        setSearchPhase("done");
      } catch {
        // Offline fallback — demo result for "Ravi Kumar"
        if (val.toLowerCase().includes("ravi")) {
          setResults([
            { person_id: "P-928371", display_name: "Ravi Kumar", confidence: 0.96, connection_count: 17, case_count: 3, cluster_id: "CLUSTER-002", status: "under_investigation", location: "Chennai, Tamil Nadu", query_type: "name" },
            { person_id: "P-291882", display_name: "Ravi Kumar", confidence: 0.61, connection_count: 4, case_count: 1, cluster_id: "CLUSTER-006", status: "released", location: "Madurai, Tamil Nadu", query_type: "name" },
          ]);
        } else {
          setResults([]);
        }
        setSearchPhase("done");
      } finally {
        setIsSearching(false);
      }
    }, 250);
  }, []);

  const handleFocus = useCallback(async (result: SearchResult) => {
    setSearchOpen(false);
    setInputVal(result.display_name);
    setSearchPhase("resolving");

    try {
      setSearchPhase("locating");
      const focus: any = await investigationFocus(result.person_id, 1);
      setSearchPhase("navigating");
      setFocusContext(focus as FocusContext);
    } catch {
      // Offline fallback focus context
      setSearchPhase("navigating");
      const offlineFocus: FocusContext = {
        person_id: result.person_id,
        display_name: result.display_name,
        cluster_id: result.cluster_id,
        cluster_name: "Financial Fraud Ring",
        hops: 1,
        camera_target: { x: 50, y: -20, cluster_x: 200, cluster_y: -250, cluster_radius: 100 },
        subgraph: {
          center_person_id: result.person_id,
          cluster_id: result.cluster_id,
          focus_hops: 1,
          nodes: [
            { id: "P-928371", person_id: "P-928371", display_name: "Ravi Kumar", cluster_id: "CLUSTER-002", status: "under_investigation", x: 50, y: -20, size: 14, state: "selected", connection_count: 17, case_count: 3 },
            { id: "P-928881", person_id: "P-928881", display_name: "Sameer Khan", cluster_id: "CLUSTER-002", status: "under_investigation", x: 150, y: -80, size: 7, state: "direct", connection_count: 11, case_count: 2 },
            { id: "P-928991", person_id: "P-928991", display_name: "Arjun Mehta", cluster_id: "CLUSTER-002", status: "convicted", x: 80, y: 60, size: 7, state: "direct", connection_count: 8, case_count: 4 },
            { id: "P-929002", person_id: "P-929002", display_name: "Deepak Verma", cluster_id: "CLUSTER-002", status: "absconding", x: 160, y: 40, size: 7, state: "direct", connection_count: 14, case_count: 5 },
            { id: "P-929001", person_id: "P-929001", display_name: "Priya Sharma", cluster_id: "CLUSTER-002", status: "under_investigation", x: -60, y: -90, size: 5, state: "direct", connection_count: 6, case_count: 1 },
            { id: "P-929003", person_id: "P-929003", display_name: "Anita Rao", cluster_id: "CLUSTER-002", status: "under_investigation", x: -20, y: 80, size: 5, state: "direct", connection_count: 5, case_count: 1 },
            { id: "P-929004", person_id: "P-929004", display_name: "Vijay Nair", cluster_id: "CLUSTER-002", status: "released", x: 220, y: -40, size: 5, state: "direct", connection_count: 9, case_count: 2 },
            { id: "P-101001", person_id: "P-101001", display_name: "Mohammed Salim", cluster_id: "CLUSTER-001", status: "under_investigation", x: -350, y: -280, size: 3, state: "second_degree", connection_count: 22, case_count: 4 },
          ],
          edges: [
            { id: "R-001", source: "P-928371", target: "P-928881", relationship_type: "communication", strength: 0.82, confidence: 0.91, evidence_count: 14, source_systems: ["CCTNS", "e-Courts"] },
            { id: "R-002", source: "P-928371", target: "P-928991", relationship_type: "financial", strength: 0.71, confidence: 0.84, evidence_count: 8, source_systems: ["CCTNS", "e-Forensics"] },
            { id: "R-004", source: "P-928371", target: "P-929002", relationship_type: "communication", strength: 0.89, confidence: 0.94, evidence_count: 21, source_systems: ["CCTNS", "e-Courts", "e-Prisons"] },
            { id: "R-003", source: "P-928371", target: "P-929001", relationship_type: "association", strength: 0.54, confidence: 0.72, evidence_count: 3, source_systems: ["CCTNS"] },
            { id: "R-005", source: "P-928371", target: "P-929003", relationship_type: "location", strength: 0.43, confidence: 0.61, evidence_count: 2, source_systems: ["e-Forensics"] },
            { id: "R-006", source: "P-928881", target: "P-929002", relationship_type: "common_case", strength: 0.67, confidence: 0.78, evidence_count: 5, source_systems: ["CCTNS"] },
            { id: "R-009", source: "P-928371", target: "P-101001", relationship_type: "association", strength: 0.38, confidence: 0.55, evidence_count: 2, source_systems: ["CCTNS"] },
          ],
        },
      };
      setFocusContext(offlineFocus);
    }
  }, []);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative">
      {/* Search input */}
      <div className="relative flex items-center" style={{ width: 480 }}>
        <svg className="absolute left-3 w-4 h-4 text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          ref={inputRef}
          value={inputVal}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => inputVal && setSearchOpen(true)}
          placeholder="Search person, mobile, address, case, FIR, vehicle..."
          className="w-full pl-9 pr-20 py-2 text-sm text-primary rounded-md outline-none transition-all"
          style={{
            background: "#0D0D0D",
            border: "1px solid #1E1E1E",
            caretColor: "#DC2626",
          }}
          onFocusCapture={() => {
            inputRef.current?.style.setProperty("border-color", "#2A2A2A");
          }}
          onBlurCapture={() => {
            setTimeout(() => setSearchOpen(false), 200);
          }}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Query type badge */}
        {inputVal && queryType && (
          <div className="absolute right-8 flex items-center">
            <span className="text-2xs font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(220,38,38,0.1)", color: "#FCA5A5", border: "1px solid rgba(220,38,38,0.2)" }}>
              {QUERY_TYPE_LABELS[queryType] || queryType.toUpperCase()}
            </span>
          </div>
        )}

        {/* Clear button */}
        {inputVal && (
          <button
            className="absolute right-2 text-muted hover:text-secondary"
            onClick={() => { setInputVal(""); clearSearch(); }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search phase indicator */}
      {searchPhase && searchPhase !== "done" && (
        <div className="absolute top-full left-0 mt-1">
          <span className="text-2xs text-secondary searching font-mono">{PHASE_LABELS[searchPhase]}</span>
        </div>
      )}

      {/* Results dropdown */}
      {searchOpen && (
        <SearchResults
          query={inputVal}
          onFocus={handleFocus}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </div>
  );
}
