// ─── Core Entity Types ─────────────────────────────────────────────────────────

export type PersonStatus =
  | "under_investigation"
  | "convicted"
  | "acquitted"
  | "absconding"
  | "released"
  | "deceased"
  | "unknown";

export type NodeState =
  | "normal"
  | "selected"
  | "direct"
  | "second_degree"
  | "unrelated";

export type RelationshipType =
  | "communication"
  | "financial"
  | "location"
  | "common_case"
  | "association"
  | "family"
  | "organizational"
  | "temporal"
  | "other";

export type GraphMode = "GLOBAL" | "CLUSTER" | "PERSON" | "FOCUS";

// ─── Graph Types ────────────────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  person_id: string;
  display_name: string;
  cluster_id: string;
  community_id?: string;
  status: PersonStatus | string;
  x: number;
  y: number;
  size: number;
  state: NodeState;
  connection_count: number;
  case_count: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship_type: RelationshipType | string;
  strength: number;
  confidence: number;
  evidence_count: number;
  source_systems: string[];
}

export interface GraphSubgraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  center_person_id: string;
  cluster_id: string;
  focus_hops: number;
}

export interface ClusterSummary {
  cluster_id: string;
  name: string;
  person_count: number;
  relationship_count: number;
  case_count: number;
  x: number;
  y: number;
  radius: number;
  description: string;
  top_keywords: string[];
}

// ─── Search Types ───────────────────────────────────────────────────────────────

export interface SearchResult {
  person_id: string;
  display_name: string;
  confidence: number;
  connection_count: number;
  case_count: number;
  cluster_id: string;
  status: string;
  location?: string;
  query_type: string;
}

export interface SearchResponse {
  query: string;
  query_type: string;
  results: SearchResult[];
  total: number;
  search_id: string;
}

// ─── Person Profile Types ────────────────────────────────────────────────────────

export interface PersonProfile {
  person_id: string;
  display_name: string;
  aliases: string[];
  status: string;
  cluster_id: string;
  community_id?: string;
  connection_count: number;
  case_count: number;
  source_count: number;
  data_confidence: number;
  created_at: string;
  updated_at: string;
  source_summary: Record<string, number>;
  location?: string;
}

export interface PersonConnection {
  relationship_id: string;
  person_id: string;
  display_name: string;
  strength: number;
  relationship_type: string;
  evidence_count: number;
  source_systems: string[];
}

// ─── Evidence & Relationship Types ─────────────────────────────────────────────

export interface EvidenceSignal {
  type: string;
  description: string;
  count: number;
  source_system: string;
  record_ids?: string[];
}

export interface SourceRecord {
  source: string;
  record_id: string;
  record_type: string;
  timestamp?: string;
  summary: string;
  confidence: number;
}

export interface RelationshipEvidence {
  relationship_id: string;
  person_a: string;
  person_a_name: string;
  person_b: string;
  person_b_name: string;
  relationship_type: string;
  strength: number;
  confidence: number;
  start_time?: string;
  end_time?: string;
  evidence_count: number;
  evidence_sources: Array<{
    source: string;
    record_id: string;
    type: string;
    description: string;
  }>;
  signals: EvidenceSignal[];
}

// ─── Case Types ────────────────────────────────────────────────────────────────

export interface CaseRecord {
  case_id: string;
  title: string;
  status: string;
  role: string;
  date: string;
  description: string;
  fir_number?: string;
  police_station?: string;
  source_system: string;
  associated_persons?: string[];
}

// ─── AI Analysis Types ──────────────────────────────────────────────────────────

export interface AISignal {
  type: string;
  description: string;
  confidence: number;
}

export interface AIAnalysis {
  person_id: string;
  summary: string;
  confidence: number;
  signals: AISignal[];
  supporting_evidence: string[];
  reasoning_path: string[];
  disclaimer: string;
  model_info: string;
  timestamp: string;
}

// ─── Data Source Types ──────────────────────────────────────────────────────────

export interface DataSource {
  source_id: string;
  source_name: string;
  category: string;
  is_mock: boolean;
  status: "healthy" | "warning" | "error";
  last_sync?: string;
  records_processed: number;
  error_count: number;
  latency_ms: number;
}

// ─── Auth Types ─────────────────────────────────────────────────────────────────

export interface AuthUser {
  user_id: string;
  username: string;
  role: string;
  display_name: string;
  department?: string;
  permissions: string[];
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  username: string;
  role: string;
  display_name: string;
  permissions: string[];
}

// ─── Focus Context ──────────────────────────────────────────────────────────────

export interface FocusContext {
  person_id: string;
  display_name: string;
  cluster_id: string;
  cluster_name?: string;
  hops: number;
  camera_target: {
    x: number;
    y: number;
    cluster_x: number;
    cluster_y: number;
    cluster_radius: number;
  };
  subgraph: GraphSubgraph;
}
