"use client";
import { FileText, Download, Shield, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { DINESH_KUMAR_PROFILE } from "@/lib/mockGraphData";

export default function ReportsPage() {
  const p = DINESH_KUMAR_PROFILE;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#080B13] overflow-y-auto p-6 text-slate-200">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Intelligence Dossiers & Court Reports
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Export court-admissible forensic dossiers compliant with Indian Evidence Act (Sec 65B) & Bharatiya Sakshya Adhiniyam (BSA).
            </p>
          </div>
          <button className="px-4 py-2 bg-[#0284C7] hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-[0_0_12px_rgba(2,132,199,0.4)]">
            <Download className="w-4 h-4" />
            <span>Generate Full Dossier</span>
          </button>
        </div>

        {/* Primary Report Card */}
        <div className="nexus-card rounded-xl p-5 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-cyan-400">CRIMNET-DOSSIER-2026-DK01</span>
              <h2 className="text-base font-bold text-white mt-0.5">
                Comprehensive Syndicate Intelligence: {p.display_name} ({p.person_id})
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Court Ready (BSA Sec 63)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#060810] p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Investigation Officer</span>
              <span className="text-white font-semibold">Arun Prakash (Investigator)</span>
            </div>
            <div className="bg-[#060810] p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Jurisdiction</span>
              <span className="text-white font-semibold">Tirunelveli Cyber Crime Unit</span>
            </div>
            <div className="bg-[#060810] p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Network Scope</span>
              <span className="text-white font-semibold">1,885 Nodes / 14 Direct Associates</span>
            </div>
            <div className="bg-[#060810] p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Audit Hash</span>
              <span className="font-mono text-cyan-400 text-[11px]">SHA256: 8f4b..91a2</span>
            </div>
          </div>

          {/* Dossier sections */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Included Evidence Packages
            </div>
            {[
              { name: "CCTNS FIR Transcripts & Charge Sheets", items: "12 Cases linked across Tamil Nadu" },
              { name: "CDAC Digital Forensics & NVMe Extracted Storage", items: "3 TB Encrypted Phone & Server Dumps" },
              { name: "Telecom IPDR / CDR Location Co-presence Matrix", items: "Tower dumps at Palayamkottai Junction" },
              { name: "Cross-Border Cryptocurrency & Mule Flow Graph", items: "Tirunelveli -> Chennai -> Hawala Hubs" },
            ].map((pkg, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-[#060810] rounded border border-slate-800 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{pkg.name}</div>
                  <div className="text-[11px] text-slate-400">{pkg.items}</div>
                </div>
                <button className="text-cyan-400 hover:text-white text-xs font-mono flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  PDF / XML
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
