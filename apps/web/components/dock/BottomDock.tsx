"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  GitFork,
  Briefcase,
  FileCheck,
  Layers,
  Building,
  Scale,
  Shield,
  Fingerprint,
  Plus,
  Minus,
} from "lucide-react";

export default function BottomDock() {
  const [mapZoom, setMapZoom] = useState(1);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="w-full select-none transition-all duration-300">
      {/* Dock Toggle Tab */}
      <div className="flex justify-center -mb-2 relative z-20">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="px-3 py-0.5 bg-[#040E06] border border-green-900/60 rounded-t text-[10px] font-mono text-green-400 hover:text-white flex items-center gap-1 shadow-[0_0_8px_rgba(34,197,94,0.2)]"
        >
          <span>INTELLIGENCE DOCK</span>
          {collapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {!collapsed && (
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-2.5 p-2.5"
          style={{
            background: "rgba(3, 8, 4, 0.97)",
            borderTop: "1px solid rgba(34, 197, 94, 0.25)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Card 1: Geographic View */}
          <div className="nexus-card rounded p-2.5 flex flex-col relative overflow-hidden h-44">
            <div className="flex items-center justify-between mb-1.5 z-10">
              <span className="text-xs font-mono font-semibold text-[#D1FAD7]">GEOGRAPHIC RADAR</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-500 cursor-pointer" />
            </div>

            {/* Interactive District Vector Map */}
            <div className="flex-1 relative rounded bg-[#020502] border border-green-900/60 overflow-hidden flex items-center justify-center">
              <svg
                viewBox="0 0 200 160"
                className="w-full h-full transition-transform duration-200"
                style={{ transform: `scale(${mapZoom})` }}
              >
                {/* Background Grid */}
                <pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse">
                  <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(34,197,94,0.08)" strokeWidth="0.5" />
                </pattern>
                <rect width="200" height="160" fill="url(#grid)" />

                {/* Neighboring district outlines */}
                {/* Tenkasi */}
                <path
                  d="M 25,30 L 60,25 L 75,55 L 45,70 L 20,50 Z"
                  fill="rgba(10, 30, 14, 0.4)"
                  stroke="rgba(34, 197, 94, 0.25)"
                  strokeWidth="1"
                />
                <text x="32" y="45" fill="#3F6E4A" fontSize="7" fontFamily="monospace">Tenkasi</text>

                {/* Thoothukudi */}
                <path
                  d="M 120,40 L 175,35 L 185,110 L 135,115 L 115,70 Z"
                  fill="rgba(10, 30, 14, 0.4)"
                  stroke="rgba(34, 197, 94, 0.25)"
                  strokeWidth="1"
                />
                <text x="135" y="75" fill="#3F6E4A" fontSize="7" fontFamily="monospace">Thoothukudi</text>

                {/* Kanyakumari */}
                <path
                  d="M 40,120 L 95,115 L 90,150 L 50,155 Z"
                  fill="rgba(10, 30, 14, 0.4)"
                  stroke="rgba(34, 197, 94, 0.25)"
                  strokeWidth="1"
                />
                <text x="45" y="135" fill="#3F6E4A" fontSize="7" fontFamily="monospace">Kanyakumari</text>

                {/* Primary District: Tirunelveli (Highlighted Phosphor Green boundary) */}
                <path
                  d="M 60,25 L 115,35 L 125,75 L 135,115 L 95,115 L 85,110 L 70,80 L 45,70 L 75,55 Z"
                  fill="rgba(22, 163, 74, 0.2)"
                  stroke="#22C55E"
                  strokeWidth="1.5"
                  className="filter drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                />
                <text
                  x="72"
                  y="75"
                  fill="#D1FAD7"
                  fontSize="8.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  Tirunelveli
                </text>

                {/* Palayamkottai focal pin */}
                <circle cx="88" cy="84" r="3.5" fill="#00FF66" className="animate-ping" opacity="0.75" />
                <circle cx="88" cy="84" r="2.5" fill="#00FF66" stroke="#FFFFFF" strokeWidth="1" />
                <text x="94" y="86" fill="#00FF66" fontSize="6" fontWeight="bold" fontFamily="monospace">Palayamkottai</text>
              </svg>

              {/* Zoom Controls */}
              <div className="absolute bottom-1.5 left-1.5 flex flex-col gap-1 z-10">
                <button
                  onClick={() => setMapZoom((z) => Math.min(2.5, z + 0.25))}
                  className="w-5 h-5 bg-[#040E06] hover:bg-[#0A200E] text-green-300 rounded flex items-center justify-center border border-green-900/60 text-[10px]"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setMapZoom((z) => Math.max(0.75, z - 0.25))}
                  className="w-5 h-5 bg-[#040E06] hover:bg-[#0A200E] text-green-300 rounded flex items-center justify-center border border-green-900/60 text-[10px]"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Result Summary */}
          <div className="nexus-card rounded p-2.5 flex flex-col justify-between h-44">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-semibold text-[#D1FAD7]">METRICS MONITOR</span>
            </div>

            <div className="grid grid-cols-3 gap-2 my-auto">
              <div className="bg-[#030904] p-2 rounded border border-green-900/50">
                <div className="flex items-center gap-1.5 text-emerald-500 mb-0.5">
                  <Users className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-[10px] font-mono">Persons</span>
                </div>
                <div className="text-base font-bold text-[#D1FAD7] font-mono leading-none text-glow-green">2,831</div>
                <div className="text-[9px] text-emerald-700 font-mono mt-1">Matched</div>
              </div>

              <div className="bg-[#030904] p-2 rounded border border-green-900/50 min-w-0">
                <div className="flex items-center gap-1.5 text-emerald-500 mb-0.5">
                  <GitFork className="w-3.5 h-3.5 text-[#FFB000] flex-shrink-0" />
                  <span className="text-[9.5px] font-mono truncate">Relations</span>
                </div>
                <div className="text-base font-bold text-[#D1FAD7] font-mono leading-none text-glow-green">8,421</div>
                <div className="text-[9px] text-emerald-700 font-mono mt-1">Across 2 hops</div>
              </div>

              <div className="bg-[#030904] p-2 rounded border border-green-900/50 min-w-0">
                <div className="flex items-center gap-1.5 text-emerald-500 mb-0.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-[10px] font-mono">Cases</span>
                </div>
                <div className="text-base font-bold text-[#D1FAD7] font-mono leading-none text-glow-green">1,284</div>
                <div className="text-[9px] text-emerald-700 font-mono mt-1">Relevant</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="flex items-center gap-2 bg-[#030904] p-1.5 rounded border border-green-900/50">
                <FileCheck className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-xs font-bold text-[#D1FAD7] font-mono">3,829</div>
                  <div className="text-[9px] text-emerald-600 font-mono">Evidence Associated</div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#030904] p-1.5 rounded border border-green-900/50">
                <Layers className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-[#D1FAD7] font-mono">14</div>
                  <div className="text-[9px] text-emerald-600 font-mono">Clusters Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Top Associated Cases */}
          <div className="nexus-card rounded p-2.5 flex flex-col h-44">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-[#D1FAD7]">CRITICAL DOSSIERS</span>
              <button className="text-[11px] font-mono text-green-400 hover:text-green-300 font-medium">
                [ALL]
              </button>
            </div>

            <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
              {[
                { rank: 1, id: "TN-CYB-2024-18291", count: 12 },
                { rank: 2, id: "TN-CYB-2025-09123", count: 9 },
                { rank: 3, id: "TN-CYB-2024-77344", count: 7 },
                { rank: 4, id: "TN-CYB-2025-66218", count: 6 },
                { rank: 5, id: "TN-CYB-2024-11872", count: 5 },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-1 px-2 bg-[#030904] hover:bg-[#07170B] rounded border border-green-900/50 text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#07170B] text-[10px] text-green-400 font-mono flex items-center justify-center border border-green-900/60">
                      {item.rank}
                    </span>
                    <span className="font-mono text-[#D1FAD7] text-[11px]">{item.id}</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-500">{item.count} suspects</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Data Source Health */}
          <div className="nexus-card rounded p-2.5 flex flex-col h-44">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-semibold text-[#D1FAD7]">ICJS PILLAR STATUS</span>
              <button className="text-[11px] font-mono text-green-400 hover:text-green-300 font-medium">
                [VERIFY]
              </button>
            </div>

            <div className="flex-1 space-y-0.5 overflow-hidden pr-0.5">
              {[
                { name: "CCTNS", icon: Building, status: "ONLINE", color: "text-green-400" },
                { name: "ICJS", icon: Shield, status: "ONLINE", color: "text-green-400" },
                { name: "e-Courts", icon: Scale, status: "ONLINE", color: "text-green-400" },
                { name: "e-Prisons", icon: Building, status: "ONLINE", color: "text-green-400" },
                { name: "e-Forensics", icon: FileCheck, status: "SYNCING", color: "text-[#FFB000]" },
                { name: "NAFIS", icon: Fingerprint, status: "ONLINE", color: "text-green-400" },
              ].map((src) => {
                const Icon = src.icon;
                return (
                  <div
                    key={src.name}
                    className="flex items-center justify-between py-0.5 px-2 bg-[#030904] hover:bg-[#07170B] rounded border border-green-900/40 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-2.5 h-2.5 text-emerald-600 flex-shrink-0" />
                      <span className="text-[10.5px] text-[#D1FAD7] font-mono font-medium">{src.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          src.status === "ONLINE"
                            ? "bg-green-400 shadow-[0_0_4px_#00FF66]"
                            : "bg-amber-400 shadow-[0_0_4px_#FFB000]"
                        }`}
                      />
                      <span className={`text-[9.5px] font-mono font-semibold ${src.color}`}>{src.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
