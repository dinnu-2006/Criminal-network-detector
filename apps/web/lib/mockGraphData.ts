export interface CosmicNode {
  id: string;
  name: string;
  code: string;
  type: string;
  community: number;
  communityName: string;
  degree: number;
  cases: number;
  source: string;
  color: string;
  x: number;
  y: number;
  size: number;
  isFocal?: boolean;
  relationshipType?: 'common_case' | 'investigation' | 'court' | 'prison' | 'forensic' | 'other';
  avatar?: string;
}

export interface CosmicEdge {
  id: string;
  source: string;
  target: string;
  type: 'common_case' | 'investigation' | 'court' | 'prison' | 'forensic' | 'other';
  strength: number;
  color: string;
}

// 92 community color palette replicating graph.jpeg
export const COMMUNITY_COLORS = [
  "#E06C75", "#38BDF8", "#FBBF24", "#34D399", "#A78BFA", "#F472B6",
  "#F97316", "#06B6D4", "#10B981", "#8B5CF6", "#EC4899", "#EAB308",
  "#3B82F6", "#14B8A6", "#EF4444", "#84CC16", "#F43F5E", "#6366F1",
  "#D946EF", "#FB923C", "#60A5FA", "#2DD4BF", "#F87171", "#A3E635",
  "#FB7185", "#818CF8", "#E879F9", "#FDBA74", "#7DD3FC", "#6EE7B7",
  "#C084FC", "#F9A8D4", "#FDE047", "#93C5FD", "#5EEAD4", "#FCA5A5",
  "#BEF264", "#FDA4AF", "#A5B4FC", "#F0ABFC", "#FED7AA", "#BAE6FD",
  "#A7F3D0", "#DDD6FE", "#FBCFE8", "#FEF08A", "#BFDBFE", "#99F6E4",
  "#FECACA", "#D9F99D", "#FECDD3", "#C7D2FE", "#F5D0FE", "#FFEDD5",
  "#E0F2FE", "#D1FAE5", "#EDE9FE", "#FCE7F3", "#FEF9C3", "#DBEAFE",
  "#CCFBF1", "#FEE2E2", "#ECFCCB", "#FFE4E6", "#E0E7FF", "#FAE8FF",
  "#FFF7ED", "#F0F9FF", "#F0FDF4", "#FAF5FF", "#FDF2F8", "#FEFCE8",
  "#EFF6FF", "#F0FDFA", "#FEF2F2", "#F7FEE7", "#FFF1F2", "#EEF2FF",
  "#FAF5FF", "#EA580C", "#0891B2", "#059669", "#7C3AED", "#DB2777",
  "#CA8A04", "#2563EB", "#0D9488", "#DC2626", "#65A30D", "#E11D48",
  "#4F46E5", "#C026D3"
];

export const RELATIONSHIP_COLORS: Record<string, string> = {
  common_case: "#FFB000",        // Amber Phosphor
  investigation: "#22C55E",      // Phosphor Green
  court: "#00FF66",              // Bright Phosphor Green
  prison: "#EAB308",             // Yellow Phosphor
  forensic: "#10B981",           // Emerald Phosphor
  other: "#4A7C55",              // Dim Phosphor Green
};

// Core associates with authentic Tamil Nadu context
export const CORE_ASSOCIATES = [
  { name: "Suresh V", code: "P-001734982", type: "investigation", comm: 1, ox: 28, oy: -55 },
  { name: "Vijay A", code: "P-001982344", type: "court", comm: 2, ox: 68, oy: -42 },
  { name: "Manikandan R", code: "P-003421876", type: "investigation", comm: 1, ox: 82, oy: 12 },
  { name: "Karthik S", code: "P-001672341", type: "common_case", comm: 3, ox: 95, oy: 48 },
  { name: "Praveen K", code: "P-002918347", type: "investigation", comm: 1, ox: 62, oy: 85 },
  { name: "Hariharan T", code: "P-002832198", type: "investigation", comm: 4, ox: 22, oy: 96 },
  { name: "Ajay Bhu P", code: "P-002938274", type: "prison", comm: 5, ox: -25, oy: 88 },
  { name: "Ramesh K", code: "P-003128761", type: "court", comm: 2, ox: -64, oy: 72 },
  { name: "Saravanan R", code: "P-002912386", type: "court", comm: 2, ox: -86, oy: 38 },
  { name: "Naveen P", code: "P-002912984", type: "common_case", comm: 3, ox: -78, oy: -15 },
  { name: "Ajitha G", code: "P-002712987", type: "court", comm: 2, ox: -72, oy: -52 },
  { name: "Naveen S", code: "P-002918374", type: "common_case", comm: 3, ox: -46, oy: -82 },
  { name: "Aakash K", code: "P-003133741", type: "court", comm: 2, ox: -12, oy: -95 },
  { name: "Anesh X", code: "P-001733334", type: "common_case", comm: 3, ox: 15, oy: -88 },
];

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Cache generated graph so positions remain consistent across re-renders
let cachedGraphData: { nodes: CosmicNode[]; edges: CosmicEdge[] } | null = null;

export function generateCosmicGraphData(): { nodes: CosmicNode[]; edges: CosmicEdge[] } {
  if (cachedGraphData) return cachedGraphData;

  const totalNodes = 1885;
  const targetTotalEdges = 3616;
  const numCommunities = 92;
  const nodes: CosmicNode[] = [];
  const edges: CosmicEdge[] = [];
  let edgeIdCounter = 1;

  // 1. Generate 92 Community Centroids arranged in organic force-directed cosmos
  // Centroids mimic graph.jpeg's dense core and organic surrounding nebula
  interface CommCenter {
    id: number;
    name: string;
    cx: number;
    cy: number;
    radius: number;
    color: string;
    nodeCount: number;
  }

  const communityCenters: CommCenter[] = [];
  
  // Community 1 is the primary core cluster (Cyber Syndicate, Dinesh Kumar)
  communityCenters.push({
    id: 1,
    name: "Cyber Syndicate Core",
    cx: 0,
    cy: 0,
    radius: 120,
    color: "#38BDF8", // Cyan
    nodeCount: 110,
  });

  // Major outer cluster regions from graph.jpeg
  const majorClusters = [
    { id: 2, name: "Mule Account Network", angle: 0.4, dist: 180, radius: 95, color: "#E06C75", count: 95 }, // Coral
    { id: 3, name: "SIM Swapping Cell", angle: 1.2, dist: 220, radius: 100, color: "#FBBF24", count: 88 }, // Gold
    { id: 4, name: "Crypto Layering Ring", angle: 2.1, dist: 190, radius: 90, color: "#34D399", count: 82 }, // Emerald
    { id: 5, name: "Hawala Transmission", angle: 2.9, dist: 240, radius: 105, color: "#A78BFA", count: 92 }, // Purple
    { id: 6, name: "Phishing Infrastructure", angle: 3.8, dist: 210, radius: 85, color: "#F472B6", count: 76 }, // Pink
    { id: 7, name: "Counterfeit Gateways", angle: 4.6, dist: 230, radius: 95, color: "#F97316", count: 80 }, // Orange
    { id: 8, name: "State Transit Nodes", angle: 5.4, dist: 200, radius: 90, color: "#60A5FA", count: 74 }, // Blue
  ];

  majorClusters.forEach((mc) => {
    communityCenters.push({
      id: mc.id,
      name: mc.name,
      cx: Math.cos(mc.angle) * mc.dist,
      cy: Math.sin(mc.angle) * mc.dist,
      radius: mc.radius,
      color: mc.color,
      nodeCount: mc.count,
    });
  });

  // Generate remaining communities (9 to 92) organically distributed
  let currentAssigned = communityCenters.reduce((sum, c) => sum + c.nodeCount, 0);
  const remainingNodesToDistribute = totalNodes - currentAssigned;
  const remCommCount = numCommunities - communityCenters.length;
  const avgPerRem = Math.floor(remainingNodesToDistribute / remCommCount);

  for (let c = 9; c <= numCommunities; c++) {
    const seed = c * 73.19;
    const color = COMMUNITY_COLORS[(c - 1) % COMMUNITY_COLORS.length];
    // Organic spiral and cluster dispersion replicating graph.jpeg
    const angle = c * 2.39996 + pseudoRandom(seed) * 0.4;
    const dist = 140 + Math.sqrt(c) * 44 + pseudoRandom(seed + 1) * 70;
    const cx = Math.cos(angle) * dist;
    const cy = Math.sin(angle) * dist;
    const radius = 35 + pseudoRandom(seed + 2) * 45;
    const count = Math.max(4, Math.floor(avgPerRem * (0.5 + pseudoRandom(seed + 3))));

    communityCenters.push({
      id: c,
      name: `Community ${c}`,
      cx,
      cy,
      radius,
      color,
      nodeCount: count,
    });
  }

  // 2. Primary Focal Node: Dinesh Kumar (P-001928371)
  const focalNode: CosmicNode = {
    id: "P-001928371",
    name: "Dinesh Kumar",
    code: "P-001928371",
    type: "Primary Target",
    community: 1,
    communityName: "Community 1 (Cyber Syndicate Core)",
    degree: 46,
    cases: 12,
    source: "CCTNS / ICJS / NAFIS",
    color: "#38BDF8", // Cyan glow
    x: 0,
    y: 0,
    size: 6.5,
    isFocal: true,
  };
  nodes.push(focalNode);

  // 3. Core Associates organically placed around Dinesh Kumar (organic force spacing)
  CORE_ASSOCIATES.forEach((assoc, i) => {
    const comm = communityCenters.find((c) => c.id === assoc.comm) || communityCenters[0];
    const relColor = RELATIONSHIP_COLORS[assoc.type] || "#0EA5E9";

    const node: CosmicNode = {
      id: assoc.code,
      name: assoc.name,
      code: assoc.code,
      type: "Associate",
      community: assoc.comm,
      communityName: comm.name,
      degree: 12 + (i % 6),
      cases: 3 + (i % 4),
      source: i % 2 === 0 ? "CCTNS" : "ICJS",
      color: comm.color,
      x: assoc.ox * 1.35,
      y: assoc.oy * 1.35,
      size: 4.8,
      relationshipType: assoc.type as any,
    };
    nodes.push(node);

    // Direct edge to Dinesh Kumar with relationship type
    edges.push({
      id: `edge-focal-${assoc.code}`,
      source: "P-001928371",
      target: assoc.code,
      type: assoc.type as any,
      strength: 0.9 - i * 0.02,
      color: relColor,
    });
  });

  // Cross-link associates to one another to create dense local cluster
  const associateCrossLinks: [number, number, string][] = [
    [0, 1, "investigation"],
    [1, 2, "court"],
    [2, 3, "common_case"],
    [3, 4, "investigation"],
    [4, 5, "investigation"],
    [5, 6, "prison"],
    [6, 7, "court"],
    [7, 8, "court"],
    [8, 9, "common_case"],
    [9, 10, "court"],
    [10, 11, "common_case"],
    [11, 12, "court"],
    [12, 13, "common_case"],
    [13, 0, "investigation"],
    [0, 6, "investigation"],
    [2, 8, "court"],
    [3, 11, "common_case"],
  ];
  associateCrossLinks.forEach(([a, b, type], idx) => {
    edges.push({
      id: `edge-assoc-cross-${idx}`,
      source: CORE_ASSOCIATES[a].code,
      target: CORE_ASSOCIATES[b].code,
      type: type as any,
      strength: 0.65,
      color: RELATIONSHIP_COLORS[type] || "#64748B",
    });
  });

  // 4. Generate all remaining nodes distributed organically within communities
  const nodeIndexByComm: Record<number, CosmicNode[]> = {};
  nodes.forEach((n) => {
    if (!nodeIndexByComm[n.community]) nodeIndexByComm[n.community] = [];
    nodeIndexByComm[n.community].push(n);
  });

  let globalIdCounter = 1;
  communityCenters.forEach((comm) => {
    const existingInComm = nodeIndexByComm[comm.id]?.length || 0;
    const toCreate = Math.max(0, comm.nodeCount - existingInComm);

    for (let j = 0; j < toCreate && nodes.length < totalNodes; j++) {
      const seed = comm.id * 1000 + j * 17.3;
      // Multi-gaussian organic distribution (avoiding circular concentric bands)
      const u1 = pseudoRandom(seed);
      const u2 = pseudoRandom(seed + 1);
      const radiusFalloff = Math.sqrt(-2.0 * Math.log(Math.max(0.001, u1))) * 0.42;
      const angle = u2 * Math.PI * 2;

      // Add sub-cluster clump offsets for natural filament look
      const subClumpAngle = ((comm.id * 3 + (j % 3)) * Math.PI) / 1.5;
      const subClumpDist = comm.radius * 0.35;
      const subCx = Math.cos(subClumpAngle) * subClumpDist;
      const subCy = Math.sin(subClumpAngle) * subClumpDist;

      const x = comm.cx + subCx + Math.cos(angle) * (comm.radius * radiusFalloff);
      const y = comm.cy + subCy + Math.sin(angle) * (comm.radius * radiusFalloff);

      const degree = 1 + Math.floor(Math.pow(pseudoRandom(seed + 3), 2.8) * 14);
      const id = `NODE-${1000 + globalIdCounter++}`;
      const size = 1.8 + Math.min(degree * 0.35, 3.8);

      const newNode: CosmicNode = {
        id,
        name: `Node ${id}`,
        code: `ID-${10000 + globalIdCounter}`,
        type: j % 5 === 0 ? "Bank Account" : j % 4 === 0 ? "Device/IMEI" : "Person",
        community: comm.id,
        communityName: comm.name,
        degree,
        cases: Math.max(1, Math.floor(degree / 3)),
        source: j % 3 === 0 ? "ICJS" : "CCTNS",
        color: comm.color,
        x,
        y,
        size,
      };

      nodes.push(newNode);
      if (!nodeIndexByComm[comm.id]) nodeIndexByComm[comm.id] = [];
      nodeIndexByComm[comm.id].push(newNode);
    }
  });

  // Ensure exact total of 1,885 nodes
  while (nodes.length < totalNodes) {
    const cIdx = 1 + Math.floor(pseudoRandom(nodes.length * 23.7) * (numCommunities - 1));
    const comm = communityCenters[cIdx];
    const angle = pseudoRandom(nodes.length * 13) * Math.PI * 2;
    const r = pseudoRandom(nodes.length * 19) * comm.radius;
    const id = `NODE-${1000 + globalIdCounter++}`;

    const newNode: CosmicNode = {
      id,
      name: `Node ${id}`,
      code: `ID-${10000 + globalIdCounter}`,
      type: "Person",
      community: comm.id,
      communityName: comm.name,
      degree: 2,
      cases: 1,
      source: "CCTNS",
      color: comm.color,
      x: comm.cx + Math.cos(angle) * r,
      y: comm.cy + Math.sin(angle) * r,
      size: 2.2,
    };
    nodes.push(newNode);
    if (!nodeIndexByComm[comm.id]) nodeIndexByComm[comm.id] = [];
    nodeIndexByComm[comm.id].push(newNode);
  }

  // 5. Build 3,616 Edges: High intra-community density + realistic inter-community filaments
  // A. Intra-community edges (creates dense glowing web clusters)
  for (let c = 1; c <= numCommunities; c++) {
    const cNodes = nodeIndexByComm[c] || [];
    if (cNodes.length < 2) continue;

    for (let i = 0; i < cNodes.length; i++) {
      if (edges.length >= targetTotalEdges) break;
      const n1 = cNodes[i];
      // Connect to 1-3 nearest nodes in same community
      const connCount = 1 + Math.floor(pseudoRandom(i * 47 + c) * 2.2);
      for (let k = 1; k <= connCount; k++) {
        if (edges.length >= targetTotalEdges) break;
        const targetIdx = (i + k * 2) % cNodes.length;
        const n2 = cNodes[targetIdx];
        if (n1.id === n2.id) continue;

        edges.push({
          id: `edge-intra-${edgeIdCounter++}`,
          source: n1.id,
          target: n2.id,
          type: "other",
          strength: 0.4,
          color: n1.color,
        });
      }
    }
  }

  // B. Connect Dinesh Kumar & Associates to background cluster nodes to show 2nd-hop depth
  CORE_ASSOCIATES.forEach((assoc, i) => {
    const commNodes = nodeIndexByComm[assoc.comm] || [];
    for (let k = 0; k < 6 && k < commNodes.length; k++) {
      if (edges.length >= targetTotalEdges) break;
      const targetNode = commNodes[k];
      if (targetNode.id !== assoc.code && targetNode.id !== "P-001928371") {
        edges.push({
          id: `edge-hop2-${assoc.code}-${k}`,
          source: assoc.code,
          target: targetNode.id,
          type: assoc.type as any,
          strength: 0.5,
          color: RELATIONSHIP_COLORS[assoc.type] || "#38BDF8",
        });
      }
    }
  });

  // C. Inter-community bridging filaments (mimicking graph.jpeg's interconnected cosmos)
  let bridgeAttempt = 0;
  while (edges.length < targetTotalEdges && bridgeAttempt < 10000) {
    bridgeAttempt++;
    const idxA = Math.floor(pseudoRandom(bridgeAttempt * 31.7) * nodes.length);
    const idxB = Math.floor(pseudoRandom(bridgeAttempt * 97.3) * nodes.length);
    if (idxA === idxB) continue;

    const nA = nodes[idxA];
    const nB = nodes[idxB];
    const dx = nA.x - nB.x;
    const dy = nA.y - nB.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Bridge nodes that are within natural proximity (creates spiderweb filaments)
    if (dist > 30 && dist < 220) {
      edges.push({
        id: `edge-bridge-${edgeIdCounter++}`,
        source: nA.id,
        target: nB.id,
        type: "other",
        strength: 0.25,
        color: nA.color,
      });
    }
  }

  cachedGraphData = { nodes, edges };
  return cachedGraphData;
}

// Full profile details for Dinesh Kumar matching structure.png
export const DINESH_KUMAR_PROFILE = {
  person_id: "P-001928371",
  display_name: "Dinesh Kumar",
  other_names: ["Dinesh K.", "D. Kumar", "Dinesh S", "Dhinesh P", "Dinesh P"],
  dob: "12-05-1991",
  age: 34,
  gender: "Male",
  nationality: "Indian",
  verification_status: "Verified Identity",
  confidence_score: 0.94,
  addresses: [
    { title: "Residential (Permanent)", text: "Plot 42, NGO Colony, Palayamkottai, Tirunelveli - 627007" },
    { title: "Secondary Residence", text: "Flat 3B, Sri Krishna Apartments, Vannarpettai, Tirunelveli - 627003" },
    { title: "Safehouse / Operational Hub", text: "Old Post Office Road, Melapalayam, Tirunelveli - 627005" },
  ],
  contact_info: [
    { type: "Phone", value: "+91 98421 78219 (Airtel, Primary SIM - Tirunelveli Tower)" },
    { type: "Email", value: "dinesh.k.cyberops@protonmail.com" },
  ],
  cases: [
    { id: "TN-CYB-2024-18291", title: "Inter-state Phishing & Mule Syndicate", role: "Primary Accused", date: "15-Mar-2024", count: 12 },
    { id: "TN-CYB-2025-09123", title: "Hawala Cryptocurrency Layering Ring", role: "Organizer", date: "02-Jan-2025", count: 9 },
    { id: "TN-CYB-2024-77344", title: "Telecom OTP Interception Gateway", role: "Accused #2", date: "19-Oct-2024", count: 7 },
    { id: "TN-CYB-2025-66218", title: "Fake Govt Portal Investment Fraud", role: "Mastermind", date: "14-Feb-2025", count: 6 },
    { id: "TN-CYB-2024-11872", title: "Cross-District Bank Account Laundering", role: "Key Operator", date: "28-May-2024", count: 5 },
  ],
  court_records: [
    { id: "C.C. 142/2024", court: "District & Sessions Court, Tirunelveli", status: "Trial Scheduled (Witness Exam)" },
    { id: "Bail App 882/2025", court: "Madras High Court (Madurai Bench)", status: "Bail Rejected with Conditions" },
    { id: "Crl.O.P. 1092/2024", court: "Principal Sessions Court, Chennai", status: "Anticipatory Bail Dismissed" },
    { id: "M.C. 49/2023", court: "Judicial Magistrate I, Palayamkottai", status: "Summons Issued" },
  ],
  prison_records: [
    { prison: "Central Prison, Palayamkottai", remand_id: "UTP-4819", period: "18-Apr-2024 to 02-Jun-2024 (45 Days Remand)" },
  ],
  forensic_records: [
    { id: "CF-2024-098", lab: "C-DAC Cyber Forensics Lab Chennai", item: "3 TB Encrypted NVMe SSD (Mule database extracted)" },
    { id: "CF-2024-112", lab: "State Cyber Crime Wing Forensic Cell", item: "2x iPhone 15 Pro Max (Signal chats recovered)" },
    { id: "TEL-2024-8841", lab: "Telecom Intelligence Unit", item: "CDR/IPDR Tower Dumps (Palayamkottai Junction)" },
  ],
  prosecution: [
    { stage: "Chargesheet Filed", act: "IPC 420, 120B, 468, 471 r/w IT Act 66D, 66C" },
    { stage: "Sanction Obtained", act: "State Home Dept Sanction for Inter-state Cyber Syndicate" },
  ],
  known_associates: CORE_ASSOCIATES,
  locations: [
    "Palayamkottai, Tirunelveli",
    "Vannarpettai, Tirunelveli",
    "Melapalayam, Tirunelveli",
    "Tenkasi Town",
    "Tuticorin Port Sub-division"
  ],
  data_sources: [
    { name: "CCTNS", status: "Synced (FIRs & Crime Dairies)" },
    { name: "ICJS", status: "Matched across 4 State Portals" },
    { name: "e-Courts", status: "Active Case Dockets verified" },
    { name: "e-Prisons", status: "Remand & Visitor Logs retrieved" },
    { name: "e-Forensics", status: "Digital Evidence reports linked" },
    { name: "NAFIS", status: "Biometric Fingerprint Match Score 98.4%" },
  ],
  ai_insights: "Central high-degree orchestrator for southern Tamil Nadu cyber syndicates. Direct links to 14 financial and communications nodes across Palayamkottai and Chennai. High flight risk with cross-border crypto traces.",
  audit_history: [
    "11-Sep-2026 12:04 IST: Inspected by Arun Prakash (Investigator) under TN-CYB-2024-18291",
    "09-Sep-2026 17:22 IST: Automated ICJS biometric sync triggered by NAFIS unit",
    "04-Sep-2026 09:15 IST: CDR analysis graph generated by Cyber Crime Cell Tirunelveli",
  ]
};
