"use client";
import { useState } from "react";
import { useGraphStore } from "@/store";
import { DINESH_KUMAR_PROFILE } from "@/lib/mockGraphData";
import {
  X,
  User,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Edit2,
  MapPin,
  Phone,
  Briefcase,
  Scale,
  Building,
  FileCheck,
  Users,
  Compass,
  Database,
  Sparkles,
  History,
} from "lucide-react";

export default function PersonDrawer() {
  const { selectedPersonId, setPersonPanelOpen } = useGraphStore();
  const [activeTab, setActiveTab] = useState<"profile" | "cases" | "network" | "sources">("profile");

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    addresses: false,
    contact: false,
    cases: false,
    court: false,
    prison: false,
    forensic: false,
    prosecution: false,
    associates: false,
    locations: false,
    sources: false,
    ai: true,
    audit: false,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const p = DINESH_KUMAR_PROFILE;

  return (
    <aside
      className="w-84 md:w-96 flex-shrink-0 h-full flex flex-col z-30 select-none overflow-hidden font-mono"
      style={{
        background: "#030704",
        borderLeft: "1px solid rgba(34, 197, 94, 0.25)",
      }}
    >
      {/* Header with Close */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-green-900/50">
        <div className="flex items-center gap-2 text-[#D1FAD7]">
          <User className="w-4 h-4 text-green-400" />
          <span className="text-sm font-semibold tracking-wide">PERSON DOSSIER</span>
        </div>
        <button
          onClick={() => setPersonPanelOpen(false)}
          className="text-emerald-500 hover:text-white p-1 rounded hover:bg-[#07180B] transition-colors"
          title="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Target Profile Hero */}
      <div className="p-4 border-b border-green-900/50 flex items-center gap-4 bg-[#051107]/80">
        {/* Large Avatar */}
        <div className="relative w-14 h-14 rounded bg-gradient-to-br from-emerald-950 to-green-950 border-2 border-green-500/60 flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(34,197,94,0.4)]">
          <User className="w-8 h-8 text-green-300" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded border-2 border-[#030704] flex items-center justify-center">
            <ShieldCheck className="w-3 h-3 text-black" />
          </div>
        </div>

        {/* Name, ID & Badge */}
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-[#D1FAD7] truncate tracking-wide text-glow-green">
            {p.display_name}
          </div>
          <div className="text-xs font-mono text-green-400 mt-0.5">
            {p.person_id}
          </div>
          <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-green-500/15 border border-green-500/40 text-green-400 shadow-[0_0_6px_rgba(34,197,94,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span>{p.verification_status}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-green-900/50 bg-[#030704] px-3">
        {[
          { id: "profile", label: "Profile" },
          { id: "cases", label: "Cases" },
          { id: "network", label: "Network" },
          { id: "sources", label: "Sources" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2.5 text-xs font-semibold tracking-wider text-center transition-all ${
              activeTab === tab.id
                ? "text-green-300 border-b-2 border-green-400 bg-green-950/30"
                : "text-emerald-600 hover:text-emerald-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {activeTab === "profile" && (
          <>
            {/* Basic Information Section */}
            <div className="nexus-card rounded p-3">
              <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-green-900/50">
                <span className="text-xs font-mono font-semibold text-[#D1FAD7]">BASIC INFORMATION</span>
                <button className="text-[11px] font-mono text-green-400 hover:text-green-300 flex items-center gap-1 font-medium">
                  <Edit2 className="w-3 h-3" />
                  <span>[EDIT]</span>
                </button>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-emerald-600">Name (Primary):</span>
                  <span className="text-[#D1FAD7] font-medium">{p.display_name}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-emerald-600">Other Names:</span>
                  <div className="text-right text-emerald-300 text-[11px]">
                    {p.other_names.map((alias) => (
                      <div key={alias}>{alias}</div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-600">Date of Birth:</span>
                  <span className="text-[#D1FAD7] font-mono">
                    {p.dob} (Age {p.age})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-600">Gender:</span>
                  <span className="text-emerald-300">{p.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-600">Nationality:</span>
                  <span className="text-emerald-300">{p.nationality}</span>
                </div>
              </div>
            </div>

            {/* Expandable Record Accordions */}
            {[
              {
                id: "addresses",
                title: `Addresses (${p.addresses.length})`,
                icon: MapPin,
                content: (
                  <div className="space-y-2 text-xs font-mono">
                    {p.addresses.map((a, i) => (
                      <div key={i} className="p-2 bg-[#030904] rounded border border-green-900/50">
                        <div className="text-[10px] text-green-400 font-semibold">{a.title}</div>
                        <div className="text-emerald-200 mt-0.5">{a.text}</div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: "contact",
                title: `Contact Information (${p.contact_info.length})`,
                icon: Phone,
                content: (
                  <div className="space-y-1.5 text-xs font-mono">
                    {p.contact_info.map((c, i) => (
                      <div key={i} className="flex justify-between p-1.5 bg-[#030904] rounded border border-green-900/50">
                        <span className="text-emerald-600">{c.type}:</span>
                        <span className="text-[#D1FAD7] font-mono text-[11px]">{c.value}</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: "cases",
                title: `Cases (${p.cases.length})`,
                icon: Briefcase,
                content: (
                  <div className="space-y-1.5 text-xs font-mono">
                    {p.cases.map((c) => (
                      <div key={c.id} className="p-2 bg-[#030904] rounded border border-green-900/50">
                        <div className="flex justify-between text-green-300 font-mono font-bold text-[11px]">
                          <span>{c.id}</span>
                          <span className="text-[#FFB000] font-normal">{c.role}</span>
                        </div>
                        <div className="text-[#D1FAD7] mt-0.5">{c.title}</div>
                        <div className="text-[10px] text-emerald-600 mt-1 flex justify-between">
                          <span>{c.date}</span>
                          <span>{c.count} associates</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: "court",
                title: `Court Records (${p.court_records.length})`,
                icon: Scale,
                content: (
                  <div className="space-y-1.5 text-xs font-mono">
                    {p.court_records.map((r) => (
                      <div key={r.id} className="p-2 bg-[#030904] rounded border border-green-900/50">
                        <div className="font-mono text-green-400 font-semibold">{r.id}</div>
                        <div className="text-emerald-200 mt-0.5">{r.court}</div>
                        <div className="text-[10px] text-[#FFB000] mt-1">{r.status}</div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: "prison",
                title: `Prison Records (${p.prison_records.length})`,
                icon: Building,
                content: (
                  <div className="space-y-1.5 text-xs font-mono">
                    {p.prison_records.map((pr, i) => (
                      <div key={i} className="p-2 bg-[#030904] rounded border border-green-900/50">
                        <div className="text-[#D1FAD7] font-semibold">{pr.prison}</div>
                        <div className="text-[11px] font-mono text-green-400">ID: {pr.remand_id}</div>
                        <div className="text-[10px] text-emerald-600 mt-1">{pr.period}</div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: "forensic",
                title: `Forensic Records (${p.forensic_records.length})`,
                icon: FileCheck,
                content: (
                  <div className="space-y-1.5 text-xs font-mono">
                    {p.forensic_records.map((fr) => (
                      <div key={fr.id} className="p-2 bg-[#030904] rounded border border-green-900/50">
                        <div className="font-mono text-green-400 font-semibold">{fr.id}</div>
                        <div className="text-emerald-200 text-[11px]">{fr.item}</div>
                        <div className="text-[10px] text-emerald-600 mt-0.5">{fr.lab}</div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: "associates",
                title: `Known Associates (${p.known_associates.length})`,
                icon: Users,
                content: (
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                    {p.known_associates.map((assoc) => (
                      <div key={assoc.code} className="p-1.5 bg-[#030904] rounded border border-green-900/50">
                        <div className="text-[#D1FAD7] font-medium">{assoc.name}</div>
                        <div className="text-[10px] font-mono text-emerald-600">{assoc.code}</div>
                        <div className="text-[9px] text-green-400 capitalize mt-0.5">{assoc.type.replace("_", " ")}</div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: "locations",
                title: `Locations (${p.locations.length})`,
                icon: Compass,
                content: (
                  <div className="space-y-1 text-xs font-mono">
                    {p.locations.map((loc, i) => (
                      <div key={i} className="flex items-center gap-2 p-1.5 bg-[#030904] rounded border border-green-900/50 text-emerald-200">
                        <MapPin className="w-3 h-3 text-green-400" />
                        <span>{loc}</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: "sources",
                title: `Data Sources (${p.data_sources.length})`,
                icon: Database,
                content: (
                  <div className="space-y-1.5 text-xs font-mono">
                    {p.data_sources.map((src) => (
                      <div key={src.name} className="p-1.5 bg-[#030904] rounded border border-green-900/50">
                        <div className="text-green-300 font-semibold">{src.name}</div>
                        <div className="text-[11px] text-emerald-600">{src.status}</div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: "ai",
                title: "AI Insights",
                badge: "AI",
                icon: Sparkles,
                content: (
                  <div className="p-2.5 bg-green-950/30 border border-green-500/40 rounded text-xs font-mono text-[#D1FAD7] leading-relaxed">
                    <div className="flex items-center gap-1.5 text-green-400 font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>INTELLIGENCE SYNTHESIS</span>
                    </div>
                    {p.ai_insights}
                  </div>
                ),
              },
              {
                id: "audit",
                title: "Audit History",
                icon: History,
                content: (
                  <div className="space-y-1.5 text-[11px] font-mono text-emerald-600">
                    {p.audit_history.map((ah, i) => (
                      <div key={i} className="p-1.5 bg-[#030904] rounded border border-green-900/50">
                        {ah}
                      </div>
                    ))}
                  </div>
                ),
              },
            ].map((section) => {
              const Icon = section.icon;
              const isOpen = openSections[section.id];
              return (
                <div key={section.id} className="nexus-card rounded overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center justify-between w-full p-2.5 text-xs font-mono font-semibold text-emerald-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-green-400" />
                      <span>{section.title}</span>
                      {section.badge && (
                        <span className="px-1.5 py-0.2 bg-green-800 text-white text-[9px] rounded font-mono">
                          {section.badge}
                        </span>
                      )}
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </button>

                  {isOpen && <div className="p-2.5 pt-0">{section.content}</div>}
                </div>
              );
            })}
          </>
        )}

        {activeTab === "cases" && (
          <div className="space-y-2 font-mono">
            {p.cases.map((c) => (
              <div key={c.id} className="nexus-card rounded p-3">
                <div className="flex justify-between text-green-300 font-mono font-bold text-xs">
                  <span>{c.id}</span>
                  <span className="text-[#FFB000] font-normal">{c.role}</span>
                </div>
                <div className="text-sm font-semibold text-[#D1FAD7] mt-1">{c.title}</div>
                <div className="text-xs text-emerald-600 mt-1">Registration Date: {c.date}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "network" && (
          <div className="nexus-card rounded p-3 font-mono">
            <div className="text-xs font-semibold text-[#D1FAD7] mb-2">NETWORK TOPOLOGY METRICS</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-emerald-600">1st Degree Associates:</span>
                <span className="text-green-400 font-mono font-bold">{p.known_associates.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-600">2nd Degree Network:</span>
                <span className="text-emerald-300 font-mono">148 entities</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-600">Eigenvector Centrality:</span>
                <span className="text-green-400 font-mono font-bold">0.892 (CRITICAL HUB)</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sources" && (
          <div className="space-y-2 font-mono">
            {p.data_sources.map((src) => (
              <div key={src.name} className="nexus-card rounded p-2.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#D1FAD7]">{src.name}</div>
                  <div className="text-[11px] text-emerald-600">{src.status}</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#00FF66]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
