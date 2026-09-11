"use client";
import { useGraphStore } from "@/store";
import NetworkGraph from "@/components/graph/NetworkGraph";
import BottomDock from "@/components/dock/BottomDock";
import PersonDrawer from "@/components/person/PersonDrawer";

export default function NetworkPage() {
  const { personPanelOpen } = useGraphStore();

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#020502]">
      {/* Primary Network Graph Area + Bottom Dock (Full Width, Filters Unified in Search) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 relative overflow-hidden">
          <NetworkGraph />
        </div>

        {/* Bottom Intelligence Dock */}
        <BottomDock />
      </div>

      {/* Right Person Details Panel */}
      {personPanelOpen && <PersonDrawer />}
    </div>
  );
}

