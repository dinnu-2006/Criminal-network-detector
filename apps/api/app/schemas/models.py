from pydantic import BaseModel, Field
from typing import Optional, List, Any
from enum import Enum


class PersonStatus(str, Enum):
    UNDER_INVESTIGATION = "under_investigation"
    CONVICTED = "convicted"
    ACQUITTED = "acquitted"
    ABSCONDING = "absconding"
    RELEASED = "released"
    DECEASED = "deceased"
    UNKNOWN = "unknown"


class NodeState(str, Enum):
    NORMAL = "normal"
    SELECTED = "selected"
    DIRECT = "direct"
    SECOND_DEGREE = "second_degree"
    UNRELATED = "unrelated"


class RelationshipType(str, Enum):
    COMMUNICATION = "communication"
    FINANCIAL = "financial"
    LOCATION = "location"
    COMMON_CASE = "common_case"
    ASSOCIATION = "association"
    FAMILY = "family"
    ORGANIZATIONAL = "organizational"
    TEMPORAL = "temporal"
    OTHER = "other"


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    limit: int = Field(default=10, ge=1, le=50)


class SearchResult(BaseModel):
    person_id: str
    display_name: str
    confidence: float
    connection_count: int
    case_count: int
    cluster_id: str
    status: str
    location: Optional[str] = None
    query_type: str


class SearchResponse(BaseModel):
    query: str
    query_type: str
    results: List[SearchResult]
    total: int
    search_id: str


class FocusRequest(BaseModel):
    person_id: str
    hops: int = Field(default=1, ge=1, le=3)


class GraphNode(BaseModel):
    id: str
    person_id: str
    display_name: str
    cluster_id: str
    community_id: Optional[str] = None
    status: str
    x: float = 0.0
    y: float = 0.0
    size: float = 5.0
    state: NodeState = NodeState.NORMAL
    connection_count: int = 0
    case_count: int = 0


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    relationship_type: str
    strength: float
    confidence: float
    evidence_count: int
    source_systems: List[str] = []


class GraphSubgraph(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    center_person_id: str
    cluster_id: str
    focus_hops: int


class ClusterSummary(BaseModel):
    cluster_id: str
    name: str
    person_count: int
    relationship_count: int = 0
    case_count: int = 0
    x: float
    y: float
    radius: float
    description: str
    top_keywords: List[str] = []


class PersonIdentifier(BaseModel):
    type: str  # phone, email, address, vehicle, aadhar, etc.
    value: str
    verified: bool = False
    source: str


class DataSourceRecord(BaseModel):
    source: str
    record_id: str
    record_type: str
    timestamp: Optional[str] = None
    summary: str
    confidence: float = 1.0


class PersonProfile(BaseModel):
    person_id: str
    display_name: str
    aliases: List[str] = []
    status: str
    cluster_id: str
    community_id: Optional[str] = None
    connection_count: int
    case_count: int
    source_count: int
    data_confidence: float
    created_at: str
    updated_at: str
    # Source breakdown
    source_summary: dict = {}


class EvidenceSignal(BaseModel):
    type: str
    description: str
    count: int
    source_system: str
    record_ids: List[str] = []


class RelationshipEvidence(BaseModel):
    relationship_id: str
    person_a_id: str
    person_a_name: str
    person_b_id: str
    person_b_name: str
    strength: float
    confidence: float
    relationship_type: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    evidence_signals: List[EvidenceSignal] = []
    source_records: List[DataSourceRecord] = []
    ai_inferred: bool = False
    ai_inference_note: Optional[str] = None


class CaseRecord(BaseModel):
    case_id: str
    title: str
    status: str
    role: str
    date: str
    description: str
    fir_number: Optional[str] = None
    police_station: Optional[str] = None
    source_system: str = "CCTNS"


class AISignal(BaseModel):
    type: str
    description: str
    confidence: float


class AIAnalysis(BaseModel):
    person_id: str
    summary: str
    confidence: float
    signals: List[AISignal]
    supporting_evidence: List[str]
    reasoning_path: List[str]
    disclaimer: str = "AI-generated analysis. Human verification required. Not a determination of guilt."
    model_info: str = "CrimNet Graph Analytics v1.0"
    timestamp: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    username: str
    role: str
    display_name: str
    permissions: List[str]


class DataSourceHealth(BaseModel):
    source_id: str
    source_name: str
    status: str  # healthy, warning, error
    is_mock: bool = True
    last_sync: Optional[str] = None
    records_processed: int = 0
    error_count: int = 0
    latency_ms: Optional[float] = None
