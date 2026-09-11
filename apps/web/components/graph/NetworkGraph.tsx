"use client";
import { useState } from "react";
import CosmicGraphCanvas from "./CosmicGraphCanvas";
import { useGraphStore, useFilterStore } from "@/store";
import UnifiedSearchFilterBar from "@/components/search/UnifiedSearchFilterBar";
import {
  Plus,
  Minus,
  RotateCcw,
  Target,
} from "lucide-react";

export default function NetworkGraph() {
  const { focusHops, setFocusHops, setSelectedPerson } = useGraphStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleSearchSubmit = () => {
    // If search submitted, canvas reacts via searchQuery prop
  };

  const handleZoomIn = () => {
    if ((window as any).__nexusGraphZoom) (window as any).__nexusGraphZoom(1.25);
  };

  const handleZoomOut = () => {
    if ((window as any).__nexusGraphZoom) (window as any).__nexusGraphZoom(0.8);
  };

  const handleReset = () => {
    if ((window as any).__nexusGraphReset) (window as any).__nexusGraphReset();
  };

  const handleCenter = () => {
    if ((window as any).__nexusGraphCenter) (window as any).__nexusGraphCenter();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col overflow-hidden select-none ${
        isFullscreen ? "fixed inset-0 z-50 bg-[#020502]" : ""
      }`}
    >
      {/* Unified Search & Integrated Filter Header with All States & Districts */}
      <UnifiedSearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Main Canvas Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[#020502]">
        <CosmicGraphCanvas
          searchQuery={searchQuery}
          activeHops={focusHops}
        />

        {/* Floating Relationship Type Legend (Top-Right of canvas) */}
        <div className="absolute top-3 right-3 z-20 nexus-panel rounded-lg p-2.5 border border-green-900/60 shadow-xl pointer-events-auto">
          <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 mb-2 border-b border-green-900/50 pb-1 font-semibold">
            Relationship Types
          </div>
          <div className="space-y-1.5 text-[11px] font-mono">
            <div className="flex items-center gap-2 text-green-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFB000] shadow-[0_0_6px_#FFB000]" />
              <span>Common Case</span>
            </div>
            <div className="flex items-center gap-2 text-green-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E]" />
              <span>Investigation Association</span>
            </div>
            <div className="flex items-center gap-2 text-green-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66]" />
              <span>Court Association</span>
            </div>
            <div className="flex items-center gap-2 text-green-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308] shadow-[0_0_6px_#EAB308]" />
              <span>Prison Association</span>
            </div>
            <div className="flex items-center gap-2 text-green-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
              <span>Forensic Association</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-500">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4A7C55]" />
              <span>Other Relationship</span>
            </div>
          </div>
        </div>

        {/* Floating Camera / Zoom Controls (Bottom-Left of canvas) */}
        <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1 nexus-panel p-1 rounded-lg border border-green-900/60 shadow-xl">
          <button
            onClick={handleZoomIn}
            className="w-7 h-7 bg-[#07170B] hover:bg-[#0E2C15] text-green-300 rounded flex items-center justify-center transition-colors border border-green-900/50"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-7 h-7 bg-[#07170B] hover:bg-[#0E2C15] text-green-300 rounded flex items-center justify-center transition-colors border border-green-900/50"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="w-7 h-7 bg-[#07170B] hover:bg-[#0E2C15] text-green-300 rounded flex items-center justify-center transition-colors border border-green-900/50"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCenter}
            className="w-7 h-7 bg-[#07170B] hover:bg-[#0E2C15] text-green-400 rounded flex items-center justify-center transition-colors border border-green-900/50 shadow-[0_0_8px_rgba(34,197,94,0.3)]"
            title="Center Target"
          >
            <Target className="w-4 h-4" />
          </button>
        </div>

        {/* Cosmic Network Statistics Badge (Bottom-Right, matching graph.jpeg) */}
        <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
          <span className="text-[11px] font-mono text-green-400/90 bg-[#040E06]/90 px-2.5 py-1 rounded border border-green-900/60 shadow-[0_0_10px_rgba(34,197,94,0.15)]">
            1885 nodes · 3616 edges · 92 communities
          </span>
        </div>
      </div>
    </div>
  );
}
