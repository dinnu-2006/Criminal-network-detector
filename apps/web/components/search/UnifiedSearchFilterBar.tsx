"use client";
import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  MapPin,
  User,
  Briefcase,
  Database,
  Share2,
  Calendar,
  RotateCcw,
  Check,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
} from "lucide-react";
import { useFilterStore, useGraphStore } from "@/store";
import { ALL_INDIAN_STATES, getDistrictsForState } from "@/lib/indiaGeography";

interface UnifiedSearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export default function UnifiedSearchFilterBar({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  isFullscreen,
  onToggleFullscreen,
}: UnifiedSearchFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"geo" | "person" | "case" | "sources" | "network">("geo");

  const {
    state,
    district,
    policeStation,
    pincode,
    locality,
    ageRange,
    gender,
    identityConfidence,
    caseType,
    caseStatus,
    yearRange,
    dataSources,
    hops,
    relationships,
    dateFrom,
    dateTo,
    activeTags,
    removeTag,
    clearAllTags,
    setDataSource,
    setHops,
    setIdentityConfidence,
    setYearRange,
    setGeography,
    setState,
    setDistrict,
    setCaseType,
    setCaseStatus,
    setGender,
    setAgeRange,
    setRelationshipType,
    resetFilters,
  } = useFilterStore();

  const { focusHops, setFocusHops } = useGraphStore();

  // Dynamic districts for the currently selected state
  const availableDistricts = useMemo(() => {
    return getDistrictsForState(state);
  }, [state]);

  const handleStateChange = (newState: string) => {
    setState(newState);
    const districts = getDistrictsForState(newState);
    if (districts.length > 0) {
      setDistrict(districts[0]);
    }
  };

  const handleHopSelect = (h: number) => {
    setFocusHops(h);
    setHops(h);
  };

  const allDataSources = [
    "CCTNS", "ICJS", "e-Courts", "e-Prisons", "e-Forensics",
    "e-Prosecution", "NAFIS", "e-Sakshya", "ITSSO", "Cri-MAC"
  ];

  const caseTypes = [
    "Cybercrime", "Financial Fraud", "Hawala & Crypto",
    "Narcotics", "Extortion", "Identity Theft", "Phishing & Mule Syndicate"
  ];

  const caseStatuses = [
    "Active Investigation", "Chargesheet Filed", "Trial Ongoing", "Convicted", "Absconding"
  ];

  const relationshipTypes = [
    "Common Case", "Investigation Association", "Court Association",
    "Prison Association", "Forensic Association"
  ];

  // Count active non-default filters
  const activeFilterCount = activeTags.length;

  return (
    <div className="z-30 px-4 py-2.5 bg-[#030804]/95 border-b border-green-900/40 backdrop-blur-md flex flex-col gap-2 relative">
      {/* 1. Main Search & Filter Row */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 relative flex items-center">
          <div className="absolute left-3.5 text-emerald-500 pointer-events-none">
            <Search className="w-4 h-4 text-green-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
            placeholder="Search person, case, phone, Aadhaar, vehicle, FIR ID..."
            className="w-full bg-[#051107] border border-green-900/60 rounded-lg pl-10 pr-28 py-2 text-xs font-mono text-[#D1FAD7] placeholder-emerald-800 focus:outline-none focus:border-green-400 shadow-inner"
          />
          <button
            onClick={onSearchSubmit}
            className="absolute right-1.5 px-4 py-1.5 bg-[#15803D] hover:bg-[#16A34A] text-white rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-[0_0_10px_rgba(34,197,94,0.5)]"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>

        {/* Unified Filter Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold border transition-all ${
            isOpen
              ? "bg-[#15803D] text-white border-green-400 shadow-[0_0_12px_rgba(34,197,94,0.5)]"
              : "bg-[#051107] hover:bg-[#0A200E] border-green-900/60 text-emerald-300"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-green-400" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-green-400/20 text-green-300 font-mono text-[10px] flex items-center justify-center border border-green-400/40">
              {activeFilterCount}
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-emerald-200" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-emerald-500" />
          )}
        </button>
      </div>

      {/* 2. Expandable Advanced Search & Filter Popover Panel */}
      {isOpen && (
        <div className="w-full mt-1 bg-[#040C06]/98 border border-green-500/40 rounded-xl shadow-2xl backdrop-blur-xl p-4 text-xs font-mono text-[#D1FAD7] animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-green-900/40">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Filter className="w-4 h-4 text-green-400" />
              <span className="text-[#D1FAD7]">Unified Intelligence Search Filters</span>
              <span className="text-[11px] font-mono text-green-400/90 font-normal ml-2">
                (Pan-India CCTNS / ICJS / NAFIS Integration)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="px-2.5 py-1 text-[11px] text-emerald-500 hover:text-green-300 flex items-center gap-1 hover:bg-[#0A200E] rounded transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-emerald-500 hover:text-white hover:bg-[#0A200E] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 pt-3 pb-2 border-b border-green-900/40 overflow-x-auto">
            {[
              { id: "geo", label: "Geography & Jurisdiction (All States/Districts)", icon: MapPin },
              { id: "person", label: "Person & Identity Confidence", icon: User },
              { id: "case", label: "Case & Legal Status", icon: Briefcase },
              { id: "sources", label: "Data Sources (10 Systems)", icon: Database },
              { id: "network", label: "Network Hops & Relationships", icon: Share2 },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    isActive
                      ? "bg-[#15803D] text-white shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                      : "text-emerald-500/80 hover:text-emerald-200 hover:bg-[#0A200E]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filter Body */}
          <div className="py-3.5 min-h-[160px]">
            {/* TAB 1: GEOGRAPHY (ALL STATES AND DISTRICTS) */}
            {activeTab === "geo" && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Country */}
                  <div>
                    <label className="block text-[11px] font-medium text-emerald-500 mb-1">
                      Country
                    </label>
                    <div className="px-3 py-1.5 bg-[#030904] border border-green-900/60 rounded text-green-300 font-mono text-xs">
                      India (Bharat)
                    </div>
                  </div>

                  {/* State Selection (ALL 28 States + 8 UTs) */}
                  <div>
                    <label className="block text-[11px] font-medium text-green-400 mb-1 font-semibold">
                      State / Union Territory ({ALL_INDIAN_STATES.length})
                    </label>
                    <select
                      value={state}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full bg-[#030904] border border-green-500/50 rounded px-2.5 py-1.5 text-xs text-[#D1FAD7] font-mono focus:outline-none focus:border-green-400"
                    >
                      {ALL_INDIAN_STATES.map((st) => (
                        <option key={st} value={st} className="bg-[#040C06] text-[#D1FAD7]">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District Selection (Dynamic districts of selected state) */}
                  <div>
                    <label className="block text-[11px] font-medium text-green-400 mb-1 font-semibold">
                      District ({availableDistricts.length} in {state})
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-[#030904] border border-green-500/50 rounded px-2.5 py-1.5 text-xs text-[#D1FAD7] font-mono focus:outline-none focus:border-green-400"
                    >
                      {availableDistricts.map((dst) => (
                        <option key={dst} value={dst} className="bg-[#040C06] text-[#D1FAD7]">
                          {dst}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Police Station */}
                  <div>
                    <label className="block text-[11px] font-medium text-emerald-500 mb-1">
                      Police Station Jurisdiction
                    </label>
                    <input
                      type="text"
                      value={policeStation}
                      onChange={(e) => setGeography("policeStation", e.target.value)}
                      placeholder="e.g. Palayamkottai PS, Cyber PS"
                      className="w-full bg-[#030904] border border-green-900/60 rounded px-2.5 py-1.5 text-xs text-[#D1FAD7] font-mono focus:outline-none focus:border-green-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-emerald-500 mb-1">
                      Taluk / Sub-division
                    </label>
                    <input
                      type="text"
                      value={locality}
                      onChange={(e) => setGeography("locality", e.target.value)}
                      placeholder="e.g. Palayamkottai"
                      className="w-full bg-[#030904] border border-green-900/60 rounded px-2.5 py-1.5 text-xs text-[#D1FAD7] font-mono focus:outline-none focus:border-green-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-emerald-500 mb-1">
                      Postal Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setGeography("pincode", e.target.value)}
                      placeholder="e.g. 627002"
                      className="w-full bg-[#030904] border border-green-900/60 rounded px-2.5 py-1.5 text-xs text-[#D1FAD7] font-mono focus:outline-none focus:border-green-400"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-end pb-0.5">
                    <span className="text-[11px] text-emerald-500">
                      Currently scoped to: <strong className="text-green-300">{state} &gt; {district}</strong> ({availableDistricts.length} active administrative jurisdictions indexed)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PERSON & CONFIDENCE */}
            {activeTab === "person" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-emerald-500 mb-1">
                    Gender Filter
                  </label>
                  <div className="flex gap-1.5">
                    {["All", "Male", "Female", "Other"].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`flex-1 py-1.5 rounded text-xs font-mono transition-colors ${
                          gender === g
                            ? "bg-[#15803D] text-white font-semibold shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                            : "bg-[#030904] text-emerald-500 hover:text-white border border-green-900/50"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-emerald-500 mb-1">
                    Age Range ({ageRange[0]} - {ageRange[1]} years)
                  </label>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={ageRange[1]}
                    onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value)])}
                    className="w-full accent-green-400 mt-2"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-emerald-600 mt-1">
                    <span>18 yrs</span>
                    <span>{ageRange[1]} yrs</span>
                    <span>80 yrs</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-emerald-500 mb-1">
                    Identity Resolution Confidence (≥ {identityConfidence}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={identityConfidence}
                    onChange={(e) => setIdentityConfidence(parseInt(e.target.value))}
                    className="w-full accent-green-400 mt-2"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-emerald-600 mt-1">
                    <span>0% (Raw Signals)</span>
                    <span className="text-green-400 font-bold">{identityConfidence}%</span>
                    <span>100% (Biometric UID)</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CASE INFORMATION */}
            {activeTab === "case" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-emerald-500 mb-1">
                    Case Category / Offence Type
                  </label>
                  <select
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    className="w-full bg-[#030904] border border-green-900/60 rounded px-2.5 py-1.5 text-xs text-[#D1FAD7] font-mono focus:outline-none focus:border-green-400"
                  >
                    {caseTypes.map((c) => (
                      <option key={c} value={c} className="bg-[#040C06] text-[#D1FAD7]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-emerald-500 mb-1">
                    Investigation & Legal Stage
                  </label>
                  <select
                    value={caseStatus}
                    onChange={(e) => setCaseStatus(e.target.value)}
                    className="w-full bg-[#030904] border border-green-900/60 rounded px-2.5 py-1.5 text-xs text-[#D1FAD7] font-mono focus:outline-none focus:border-green-400"
                  >
                    {caseStatuses.map((s) => (
                      <option key={s} value={s} className="bg-[#040C06] text-[#D1FAD7]">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-emerald-500 mb-1">
                    Year Range ({yearRange[0]} - {yearRange[1]})
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      min="2015"
                      max={yearRange[1]}
                      value={yearRange[0]}
                      onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
                      className="w-20 bg-[#030904] border border-green-900/60 rounded px-2 py-1 text-xs text-green-300 font-mono"
                    />
                    <span className="text-emerald-700">to</span>
                    <input
                      type="number"
                      min={yearRange[0]}
                      max="2026"
                      value={yearRange[1]}
                      onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
                      className="w-20 bg-[#030904] border border-green-900/60 rounded px-2 py-1 text-xs text-green-300 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: DATA SOURCES */}
            {activeTab === "sources" && (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {allDataSources.map((ds) => {
                    const isChecked = dataSources.includes(ds);
                    return (
                      <label
                        key={ds}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                          isChecked
                            ? "bg-green-950/40 border-green-500/60 text-[#D1FAD7] shadow-[0_0_8px_rgba(34,197,94,0.25)]"
                            : "bg-[#030904] border-green-900/40 text-emerald-600 hover:text-emerald-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => setDataSource(ds, e.target.checked)}
                          className="accent-green-400 w-3.5 h-3.5"
                        />
                        <span className="text-xs font-mono font-medium">{ds}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: NETWORK & RELATIONSHIPS */}
            {activeTab === "network" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-emerald-500 mb-1.5">
                    Network Neighborhood Radius
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((h) => (
                      <button
                        key={h}
                        onClick={() => handleHopSelect(h)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                          hops === h
                            ? "bg-[#15803D] text-white shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                            : "bg-[#030904] border border-green-900/40 text-emerald-500 hover:text-white"
                        }`}
                      >
                        {h} {h === 1 ? "Hop" : "Hops"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-emerald-500 mb-1.5">
                    Active Association Types
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {relationshipTypes.map((rel) => {
                      const isChecked = relationships.includes(rel);
                      return (
                        <button
                          key={rel}
                          onClick={() => setRelationshipType(rel, !isChecked)}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors border ${
                            isChecked
                              ? "bg-[#15803D]/30 border-green-400 text-green-200"
                              : "bg-[#030904] border-green-900/40 text-emerald-600 hover:text-white"
                          }`}
                        >
                          {rel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-green-900/40">
            <div className="text-[11px] font-mono text-emerald-500">
              Active Scope: <strong className="text-green-300">{state}</strong> / <strong className="text-green-300">{district}</strong> | Case: <strong className="text-emerald-200">{caseType}</strong> | Range: <strong className="font-mono text-emerald-200">{yearRange[0]}-{yearRange[1]}</strong>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="px-5 py-1.5 bg-[#15803D] hover:bg-[#16A34A] text-white font-mono font-semibold rounded-lg text-xs shadow-[0_0_12px_rgba(34,197,94,0.5)] transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Active Filter Chips Bar & Hops Selector */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
        {/* Active filter chips */}
        <div className="flex items-center flex-wrap gap-1.5">
          {activeTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#081C0D] border border-green-500/40 rounded-md text-[11px] font-mono text-green-300 shadow-[0_0_6px_rgba(34,197,94,0.2)]"
            >
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="text-green-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {activeTags.length > 0 && (
            <button
              onClick={clearAllTags}
              className="text-[11px] font-mono text-green-400 hover:text-green-300 font-medium ml-1 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Hop Selector & Fullscreen */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-[#051107] border border-green-900/60 rounded-lg p-0.5">
            {[1, 2, 3, 4].map((h) => (
              <button
                key={h}
                onClick={() => handleHopSelect(h)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-medium transition-all ${
                  focusHops === h
                    ? "bg-[#15803D] text-white shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                    : "text-emerald-500 hover:text-emerald-200"
                }`}
              >
                {h}H
              </button>
            ))}
          </div>

          <button
            onClick={onToggleFullscreen}
            className="p-1.5 bg-[#051107] hover:bg-[#0A200E] border border-green-900/60 rounded-lg text-emerald-500 hover:text-white transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
