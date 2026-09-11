"use client";
import { ShieldCheck } from "lucide-react";

export default function AppFooter() {
  return (
    <footer
      className="h-7 flex-shrink-0 flex items-center justify-between px-4 text-[11px] font-mono z-30 select-none"
      style={{
        background: "#030704",
        borderTop: "1px solid rgba(34, 197, 94, 0.2)",
        color: "#4A7C55",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-green-400 font-semibold">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_#00FF66]" />
          <span>CRIMENET AI</span>
        </div>
        <span>v1.0.0</span>
        <span>|</span>
        <span className="text-emerald-400 font-bold">SECURE [SYS_OK]</span>
        <span>|</span>
        <span>FOR AUTHORIZED LAW ENFORCEMENT ONLY</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 text-emerald-500/80">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-mono text-[11px] tracking-wide">TOGETHER FOR A SAFER SOCIETY</span>
      </div>
    </footer>
  );
}
