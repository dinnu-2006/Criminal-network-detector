"use client";
import { useState } from "react";
import { useFilterStore } from "@/store";
import {
  Filter,
  ChevronDown,
  ChevronRight,
  X,
  MapPin,
  User,
  FolderLock,
  Database,
  Share2,
  GitFork,
  Calendar,
} from "lucide-react";

export default function FilterSidebar() {
  const {
    country,
    state,
    district,
    taluk,
    policeStation,
    pincode,
    locality,
    ageRange,
    gender,
    identityConfidence,
    setIdentityConfidence,
    caseType,
    caseStatus,
    yearRange,
    setYearRange,
    dataSources,
    setDataSource,
    hops,
    setHops,
    dateFrom,
    dateTo,
    clearAllTags,
    activeTags,
    removeTag,
  } = useFilterStore();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    geography: true,
    person: true,
    case: true,
    dataSources: true,
    network: true,
    relationship: true,
    time: true,
  });

  const [showAllSources, setShowAllSources] = useState(false);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allDataSources = [
    "CCTNS",
    "ICJS",
    "e-Courts",
    "e-Prisons",
    "e-Forensics",
    "e-Prosecution",
    "NAFIS",
    "e-Sakshya",
    "ITSSO",
    "NCRB CCIS",
    "Cri-MAC",
  ];

  const displayedSources = showAllSources ? allDataSources : allDataSources.slice(0, 9);

  return (
    <aside
      className="w-72 flex-shrink-0 h-full flex flex-col z-20 select-none overflow-hidden"
      style={{
        background: "#080B14",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-slate-200">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold tracking-wide">Filters</span>
        </div>
        <button
          onClick={clearAllTags}
          className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Accordion List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 divide-y divide-slate-800/50">
        {/* 1. Geography Section */}
        <div className="pt-2 pb-1">
          <button
            onClick={() => toggleSection("geography")}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Geography</span>
            </div>
            {openSections.geography ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {openSections.geography && (
            <div className="mt-2 space-y-1.5 pl-1 pr-1 text-xs">
              <div className="text-slate-400 py-0.5 px-2 bg-slate-900/60 rounded border border-slate-800">
                {country}
              </div>

              {/* Tag for State */}
              <div className="flex items-center justify-between py-1 px-2 bg-slate-800/60 rounded border border-slate-700/60 text-slate-200">
                <span>{state}</span>
                <button
                  onClick={() => removeTag("Tamil Nadu")}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Tag for District */}
              <div className="flex items-center justify-between py-1 px-2 bg-slate-800/60 rounded border border-slate-700/60 text-slate-200">
                <span>{district}</span>
                <button
                  onClick={() => removeTag("Tirunelveli")}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Tag for Taluk/Area */}
              <div className="flex items-center justify-between py-1 px-2 bg-slate-800/60 rounded border border-slate-700/60 text-slate-200">
                <span>{taluk}</span>
                <button
                  onClick={() => removeTag("Palayamkottai")}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Dropdowns for Sub-levels */}
              <div className="relative">
                <select className="w-full bg-[#0E1322] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-400 appearance-none focus:outline-none focus:border-cyan-500">
                  <option>Police Station</option>
                  <option>{policeStation}</option>
                  <option>Melapalayam PS</option>
                  <option>Thachanallur PS</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              <div className="relative">
                <select className="w-full bg-[#0E1322] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-400 appearance-none focus:outline-none focus:border-cyan-500">
                  <option>Pincode</option>
                  <option>627002 (Palayamkottai)</option>
                  <option>627007 (NGO Colony)</option>
                  <option>627005 (Melapalayam)</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              <div className="relative">
                <select className="w-full bg-[#0E1322] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-400 appearance-none focus:outline-none focus:border-cyan-500">
                  <option>Locality</option>
                  <option>{locality}</option>
                  <option>Vannarpettai</option>
                  <option>Samathanapuram</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* 2. Person Section */}
        <div className="pt-2 pb-1">
          <button
            onClick={() => toggleSection("person")}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Person</span>
            </div>
            {openSections.person ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {openSections.person && (
            <div className="mt-2 space-y-2 pl-1 pr-1 text-xs">
              <div className="relative">
                <select className="w-full bg-[#0E1322] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 appearance-none focus:outline-none">
                  <option>Age Range</option>
                  <option>18 - 30</option>
                  <option>30 - 45 (Selected)</option>
                  <option>45 - 60</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              <div className="relative">
                <select className="w-full bg-[#0E1322] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 appearance-none focus:outline-none">
                  <option>Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>All</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              <div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
                  <span>Identity Confidence</span>
                  <span className="text-cyan-400 font-mono font-medium">
                    {identityConfidence}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">0%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={identityConfidence}
                    onChange={(e) => setIdentityConfidence(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-[10px] text-slate-500">100%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Case Section */}
        <div className="pt-2 pb-1">
          <button
            onClick={() => toggleSection("case")}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <FolderLock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Case</span>
            </div>
            {openSections.case ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {openSections.case && (
            <div className="mt-2 space-y-2 pl-1 pr-1 text-xs">
              <div className="flex items-center justify-between py-1 px-2 bg-slate-800/60 rounded border border-slate-700/60 text-slate-200">
                <span>Case Type</span>
                <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
                  <span>{caseType}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-white" />
                </div>
              </div>

              <div className="relative">
                <select className="w-full bg-[#0E1322] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 appearance-none focus:outline-none">
                  <option>Case Status</option>
                  <option>Active Investigation</option>
                  <option>Chargesheeted</option>
                  <option>Under Trial</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              <div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
                  <span>Year Range</span>
                  <span className="text-cyan-400 font-mono font-medium">
                    {yearRange[0]} - {yearRange[1]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">2024</span>
                  <input
                    type="range"
                    min="2020"
                    max="2026"
                    value={yearRange[1]}
                    onChange={(e) => setYearRange([2024, Number(e.target.value)])}
                    className="w-full"
                  />
                  <span className="text-[10px] text-slate-500">2026</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Data Source Section */}
        <div className="pt-2 pb-1">
          <button
            onClick={() => toggleSection("dataSources")}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Data Source</span>
            </div>
            {openSections.dataSources ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {openSections.dataSources && (
            <div className="mt-2 pl-1 pr-1">
              <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs">
                {displayedSources.map((source) => {
                  const isChecked = dataSources.includes(source);
                  return (
                    <label
                      key={source}
                      className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setDataSource(source, e.target.checked)}
                        className="nexus-checkbox"
                      />
                      <span className="text-xs">{source}</span>
                    </label>
                  );
                })}
              </div>

              <button
                onClick={() => setShowAllSources(!showAllSources)}
                className="mt-2 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                {showAllSources ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </div>

        {/* 5. Network Section */}
        <div className="pt-2 pb-1">
          <button
            onClick={() => toggleSection("network")}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Network</span>
            </div>
            {openSections.network ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {openSections.network && (
            <div className="mt-2 pl-1 pr-1">
              <div className="relative">
                <select
                  value={hops}
                  onChange={(e) => setHops(Number(e.target.value))}
                  className="w-full bg-[#0E1322] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 appearance-none focus:outline-none"
                >
                  <option value={1}>1 Hop</option>
                  <option value={2}>2 Hops</option>
                  <option value={3}>3 Hops</option>
                  <option value={4}>4 Hops</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* 6. Relationship Section */}
        <div className="pt-2 pb-1">
          <button
            onClick={() => toggleSection("relationship")}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <GitFork className="w-3.5 h-3.5 text-cyan-400" />
              <span>Relationship</span>
            </div>
            {openSections.relationship ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {openSections.relationship && (
            <div className="mt-2 space-y-1.5 pl-1 pr-1 text-xs">
              {["Common Case", "Investigation Association", "Court Association"].map((rel) => (
                <label
                  key={rel}
                  className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white"
                >
                  <input
                    type="radio"
                    name="relationship_filter"
                    defaultChecked={rel === "Common Case"}
                    className="accent-cyan-500 w-3.5 h-3.5"
                  />
                  <span>{rel}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 7. Time Section */}
        <div className="pt-2 pb-2">
          <button
            onClick={() => toggleSection("time")}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Time</span>
            </div>
            {openSections.time ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {openSections.time && (
            <div className="mt-2 grid grid-cols-2 gap-2 pl-1 pr-1 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">From Date</label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="2024-01-01"
                    className="w-full bg-[#0E1322] border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none"
                  />
                  <Calendar className="w-3 h-3 text-slate-500 absolute right-2 top-2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">To Date</label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="2026-09-11"
                    className="w-full bg-[#0E1322] border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none"
                  />
                  <Calendar className="w-3 h-3 text-slate-500 absolute right-2 top-2 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
