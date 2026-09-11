"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, User, ShieldCheck, ArrowRight, Filter, Database, Briefcase } from "lucide-react";
import { DINESH_KUMAR_PROFILE, CORE_ASSOCIATES } from "@/lib/mockGraphData";

export default function SearchPage() {
  const [query, setQuery] = useState("Dinesh Kumar");
  const p = DINESH_KUMAR_PROFILE;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#080B13] overflow-y-auto p-6 text-slate-200">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Search Bar */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-wide text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            Universal Intelligence Search
          </h1>
          <p className="text-xs text-slate-400">
            Search across 58 Million records: Name, Phone (+91), Aadhaar, PAN, Vehicle Number, FIR ID, or Biometric UID.
          </p>
          <div className="relative flex items-center mt-3">
            <Search className="absolute left-3.5 w-4 h-4 text-cyan-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter name, phone, Aadhaar, vehicle, FIR ID..."
              className="w-full bg-[#0E1322] border border-slate-700/80 rounded-lg pl-10 pr-28 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner"
            />
            <button className="absolute right-1.5 px-5 py-1.5 bg-[#0284C7] hover:bg-sky-500 text-white rounded text-xs font-semibold shadow-[0_0_8px_rgba(2,132,199,0.5)] transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Primary Match */}
        <div className="nexus-card rounded-xl p-5 border border-cyan-500/30 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#0B0F1E] to-[#080B14]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 border-2 border-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                DK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{p.display_name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    94% Match Confidence
                  </span>
                </div>
                <div className="text-xs font-mono text-cyan-400 mt-0.5">{p.person_id}</div>
                <div className="text-xs text-slate-400 mt-1">
                  Aliases: {p.other_names.join(", ")} | Age {p.age} | {p.gender} | Indian
                </div>
              </div>
            </div>

            <Link
              href="/network"
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all"
            >
              <span>Explore Network</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800">
            <div className="bg-[#060810] p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Linked Cases</span>
              <div className="text-base font-bold text-white font-mono mt-0.5">12 Cases</div>
              <span className="text-[10px] text-emerald-400">Primary in 5 FIRs</span>
            </div>
            <div className="bg-[#060810] p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Network Associates</span>
              <div className="text-base font-bold text-white font-mono mt-0.5">18 Persons</div>
              <span className="text-[10px] text-cyan-400">Across 2 Hops</span>
            </div>
            <div className="bg-[#060810] p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Data Sources Synced</span>
              <div className="text-base font-bold text-white font-mono mt-0.5">6 Systems</div>
              <span className="text-[10px] text-slate-300">CCTNS, ICJS, NAFIS</span>
            </div>
          </div>
        </div>

        {/* Secondary Results */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">
            Connected Network Profiles ({CORE_ASSOCIATES.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CORE_ASSOCIATES.map((assoc) => (
              <div
                key={assoc.code}
                className="nexus-card p-3 rounded-lg flex items-center justify-between border border-slate-800 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400 border border-slate-700">
                    {assoc.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{assoc.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{assoc.code}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                    {assoc.type}
                  </span>
                  <div className="text-[9px] text-slate-500 mt-1">1st-hop associate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
