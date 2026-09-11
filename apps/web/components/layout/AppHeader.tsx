"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store";
import {
  Share2,
  Search,
  FolderLock,
  FileCheck2,
  BarChart3,
  Database,
  FileText,
  Bell,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/network", label: "Network", icon: Share2 },
  { href: "/search", label: "Search", icon: Search },
  { href: "/cases", label: "Cases", icon: FolderLock },
  { href: "/investigations", label: "Investigations", icon: FileCheck2 },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/datasources", label: "Data Sources", icon: Database },
  { href: "/reports", label: "Reports", icon: FileText },
];

export default function AppHeader() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <header
      className="flex-shrink-0 flex items-center justify-between px-4 h-14 z-40 relative select-none"
      style={{
        background: "#030804",
        borderBottom: "1px solid rgba(34, 197, 94, 0.25)",
      }}
    >
      {/* Brand & Logo */}
      <Link href="/network" className="flex items-center gap-3 flex-shrink-0 group">
        <div className="relative w-8 h-8 flex items-center justify-center">
          {/* Phosphor green polygonal logo icon */}
          <svg
            className="w-8 h-8 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.9)]"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
          >
            <polygon
              points="16,3 28,10 28,24 16,31 4,24 4,10"
              stroke="#22C55E"
              strokeWidth="2.2"
              fill="rgba(34, 197, 94, 0.12)"
            />
            <polygon
              points="16,9 23,13 23,21 16,25 9,21 9,13"
              stroke="#4ADE80"
              strokeWidth="1.8"
              fill="rgba(74, 222, 128, 0.25)"
            />
            <circle cx="16" cy="17" r="3" fill="#00FF66" />
          </svg>
        </div>

        <div className="flex flex-col">
          <span
            className="text-base font-extrabold tracking-widest text-[#D1FAD7] uppercase font-mono leading-none text-glow-cyan"
            style={{ letterSpacing: "0.18em" }}
          >
            CRIMENET AI
          </span>
          <span
            className="text-[9px] tracking-wider text-green-400/90 font-mono uppercase mt-0.5 leading-none"
            style={{ letterSpacing: "0.08em" }}
          >
            CRIMINAL JUSTICE INTELLIGENCE NETWORK
          </span>
        </div>
      </Link>

      {/* Center Navigation Tabs */}
      <nav className="flex items-center gap-1.5 h-full">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/network" && (pathname === "/" || pathname?.startsWith("/network")));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                isActive
                  ? "text-[#D1FAD7] bg-[#16A34A]/25 border border-[#22C55E]/60 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                  : "text-emerald-500/70 hover:text-emerald-300 hover:bg-[#07180B] border border-transparent"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-green-300" : "text-emerald-600"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right User & Notifications */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Notification Bell */}
        <button
          className="relative p-2 text-emerald-500/80 hover:text-green-300 hover:bg-[#07180B] rounded transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_#00FF66]" />
        </button>

        {/* User Badge: Arun Prakash (Investigator) */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-green-950">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-800 to-green-950 border border-green-500/50 flex items-center justify-center text-xs font-mono font-bold text-green-300 shadow-[0_0_8px_rgba(34,197,94,0.35)]">
            AP
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-mono font-semibold text-[#D1FAD7] leading-tight">
              Arun Prakash
            </span>
            <span className="text-[10px] font-mono text-emerald-500 leading-tight">
              Investigator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
