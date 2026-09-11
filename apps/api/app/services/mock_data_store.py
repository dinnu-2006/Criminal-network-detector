"""
In-memory mock data store for the SIH prototype.
This replaces Neo4j/PostgreSQL/OpenSearch for rapid prototyping.
In production, these functions would delegate to real database services.
"""
import math
import random
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta

# ─── SYNTHETIC DATA CONSTANTS ─────────────────────────────────────────────────

CLUSTERS = [
    {"cluster_id": "CLUSTER-001", "name": "North Region Network", "person_count": 812, "x": -400, "y": -300, "radius": 120, "description": "Organized network operating in northern districts", "top_keywords": ["trafficking", "extortion", "north"]},
    {"cluster_id": "CLUSTER-002", "name": "Financial Fraud Ring", "person_count": 654, "x": 200, "y": -250, "radius": 100, "description": "Coordinated financial fraud and money laundering", "top_keywords": ["fraud", "hawala", "banking"]},
    {"cluster_id": "CLUSTER-003", "name": "Eastern Syndicate", "person_count": 723, "x": 500, "y": 100, "radius": 110, "description": "Cross-district organized network, eastern sector", "top_keywords": ["drugs", "weapons", "border"]},
    {"cluster_id": "CLUSTER-004", "name": "Cross-border Network", "person_count": 589, "x": -100, "y": 350, "radius": 95, "description": "Network with documented cross-border activity", "top_keywords": ["smuggling", "border", "international"]},
    {"cluster_id": "CLUSTER-005", "name": "Urban Cell Alpha", "person_count": 498, "x": -500, "y": 150, "radius": 88, "description": "Urban criminal cell, metro region", "top_keywords": ["cyber", "forgery", "urban"]},
    {"cluster_id": "CLUSTER-006", "name": "Southern Cluster", "person_count": 921, "x": 100, "y": 450, "radius": 130, "description": "Largest southern network cluster", "top_keywords": ["extortion", "gambling", "southern"]},
    {"cluster_id": "CLUSTER-007", "name": "Isolated Cells", "person_count": 342, "x": -350, "y": -100, "radius": 72, "description": "Small isolated criminal cells", "top_keywords": ["petty crime", "isolated"]},
    {"cluster_id": "CLUSTER-008", "name": "Mixed Network", "person_count": 503, "x": 350, "y": -100, "radius": 90, "description": "Mixed-activity network with diverse connections", "top_keywords": ["mixed", "diverse", "multi-district"]},
]

CLUSTER_MAP = {c["cluster_id"]: c for c in CLUSTERS}

# ─── CORE DEMO PERSONS ────────────────────────────────────────────────────────

DEMO_PERSONS = {
    "P-928371": {
        "person_id": "P-928371", "display_name": "Ravi Kumar", "aliases": ["R. Kumar", "Ravi K."],
        "status": "under_investigation", "cluster_id": "CLUSTER-002", "community_id": "COM-44",
        "connection_count": 17, "case_count": 3, "source_count": 4, "data_confidence": 0.96,
        "location": "Chennai, Tamil Nadu",
        "created_at": "2024-01-15T10:00:00Z", "updated_at": "2026-08-20T14:32:00Z",
        "source_summary": {"CCTNS": 3, "e-Courts": 2, "e-Prisons": 1, "e-Forensics": 4, "e-Prosecution": 2, "NAFIS": 1},
        "x": 50.0, "y": -20.0,
    },
    "P-928881": {
        "person_id": "P-928881", "display_name": "Sameer Khan", "aliases": ["S. Khan"],
        "status": "under_investigation", "cluster_id": "CLUSTER-002", "community_id": "COM-44",
        "connection_count": 11, "case_count": 2, "source_count": 3, "data_confidence": 0.88,
        "location": "Chennai, Tamil Nadu", "created_at": "2024-02-01T10:00:00Z", "updated_at": "2026-07-10T09:00:00Z",
        "source_summary": {"CCTNS": 2, "e-Courts": 1, "e-Forensics": 2},
        "x": 150.0, "y": -80.0,
    },
    "P-928991": {
        "person_id": "P-928991", "display_name": "Arjun Mehta", "aliases": ["Arjun M."],
        "status": "convicted", "cluster_id": "CLUSTER-002", "community_id": "COM-44",
        "connection_count": 8, "case_count": 4, "source_count": 3, "data_confidence": 0.91,
        "location": "Coimbatore, Tamil Nadu", "created_at": "2023-11-20T10:00:00Z", "updated_at": "2026-06-05T11:00:00Z",
        "source_summary": {"CCTNS": 4, "e-Courts": 3, "e-Prisons": 2},
        "x": 80.0, "y": 60.0,
    },
    "P-929001": {
        "person_id": "P-929001", "display_name": "Priya Sharma", "aliases": [],
        "status": "under_investigation", "cluster_id": "CLUSTER-002", "community_id": "COM-45",
        "connection_count": 6, "case_count": 1, "source_count": 2, "data_confidence": 0.79,
        "location": "Mumbai, Maharashtra", "created_at": "2025-03-10T10:00:00Z", "updated_at": "2026-09-01T08:00:00Z",
        "source_summary": {"CCTNS": 1, "e-Courts": 1},
        "x": -60.0, "y": -90.0,
    },
    "P-929002": {
        "person_id": "P-929002", "display_name": "Deepak Verma", "aliases": ["D. Verma", "Deepu"],
        "status": "absconding", "cluster_id": "CLUSTER-002", "community_id": "COM-44",
        "connection_count": 14, "case_count": 5, "source_count": 4, "data_confidence": 0.93,
        "location": "Delhi", "created_at": "2023-08-01T10:00:00Z", "updated_at": "2026-08-30T16:00:00Z",
        "source_summary": {"CCTNS": 5, "e-Courts": 2, "e-Prisons": 1, "NAFIS": 1},
        "x": 160.0, "y": 40.0,
    },
    "P-929003": {
        "person_id": "P-929003", "display_name": "Anita Rao", "aliases": [],
        "status": "under_investigation", "cluster_id": "CLUSTER-002", "community_id": "COM-45",
        "connection_count": 5, "case_count": 1, "source_count": 2, "data_confidence": 0.74,
        "location": "Hyderabad, Telangana", "created_at": "2025-05-15T10:00:00Z", "updated_at": "2026-07-20T12:00:00Z",
        "source_summary": {"CCTNS": 1, "e-Forensics": 1},
        "x": -20.0, "y": 80.0,
    },
    "P-929004": {
        "person_id": "P-929004", "display_name": "Vijay Nair", "aliases": ["VJ"],
        "status": "released", "cluster_id": "CLUSTER-002", "community_id": "COM-46",
        "connection_count": 9, "case_count": 2, "source_count": 3, "data_confidence": 0.85,
        "location": "Kochi, Kerala", "created_at": "2024-04-22T10:00:00Z", "updated_at": "2026-05-11T10:00:00Z",
        "source_summary": {"CCTNS": 2, "e-Courts": 1, "e-Prisons": 1},
        "x": 220.0, "y": -40.0,
    },
    # Cross-cluster connectors
    "P-101001": {
        "person_id": "P-101001", "display_name": "Mohammed Salim", "aliases": ["M. Salim"],
        "status": "under_investigation", "cluster_id": "CLUSTER-001", "community_id": "COM-11",
        "connection_count": 22, "case_count": 4, "source_count": 3, "data_confidence": 0.89,
        "location": "Delhi", "created_at": "2023-06-10T10:00:00Z", "updated_at": "2026-08-15T10:00:00Z",
        "source_summary": {"CCTNS": 4, "e-Courts": 2, "NAFIS": 1},
        "x": -350.0, "y": -280.0,
    },
    "P-601001": {
        "person_id": "P-601001", "display_name": "Kavitha Krishnan", "aliases": ["K. Krishnan"],
        "status": "convicted", "cluster_id": "CLUSTER-006", "community_id": "COM-61",
        "connection_count": 18, "case_count": 6, "source_count": 4, "data_confidence": 0.94,
        "location": "Madurai, Tamil Nadu", "created_at": "2023-01-05T10:00:00Z", "updated_at": "2026-09-01T10:00:00Z",
        "source_summary": {"CCTNS": 6, "e-Courts": 4, "e-Prisons": 2, "NAFIS": 1},
        "x": 120.0, "y": 430.0,
    },
}

# ─── RELATIONSHIPS ─────────────────────────────────────────────────────────────

RELATIONSHIPS = {
    "R-001": {
        "relationship_id": "R-001", "person_a": "P-928371", "person_b": "P-928881",
        "relationship_type": "communication", "strength": 0.82, "confidence": 0.91,
        "evidence_count": 14, "start_time": "2025-01-15", "end_time": "2026-08-01",
        "evidence_sources": [
            {"source": "CCTNS", "record_id": "CDR-882", "type": "communication_records", "description": "14 call records between 2025-01 and 2026-08"},
            {"source": "e-Courts", "record_id": "COURT-29183", "type": "common_proceeding", "description": "Co-accused in CASE-847"},
            {"source": "CCTNS", "record_id": "CASE-847", "type": "common_case", "description": "Both associated with financial fraud case"},
        ],
        "signals": [
            {"type": "Communication", "description": "14 call interactions", "count": 14, "source_system": "CCTNS"},
            {"type": "Common Case", "description": "1 shared case", "count": 1, "source_system": "e-Courts"},
        ]
    },
    "R-002": {
        "relationship_id": "R-002", "person_a": "P-928371", "person_b": "P-928991",
        "relationship_type": "financial", "strength": 0.71, "confidence": 0.84,
        "evidence_count": 8, "start_time": "2024-06-01", "end_time": "2025-12-31",
        "evidence_sources": [
            {"source": "CCTNS", "record_id": "TRANSACTION-201", "type": "financial_records", "description": "Financial transactions traced to common accounts"},
            {"source": "e-Forensics", "record_id": "FSL-9231", "type": "forensic_evidence", "description": "Digital forensics links both persons"},
        ],
        "signals": [
            {"type": "Financial Association", "description": "2 traced transactions", "count": 2, "source_system": "CCTNS"},
            {"type": "Forensic Link", "description": "Common digital footprint", "count": 1, "source_system": "e-Forensics"},
        ]
    },
    "R-003": {
        "relationship_id": "R-003", "person_a": "P-928371", "person_b": "P-929001",
        "relationship_type": "association", "strength": 0.54, "confidence": 0.72,
        "evidence_count": 3, "start_time": "2025-09-01", "end_time": None,
        "evidence_sources": [
            {"source": "CCTNS", "record_id": "CASE-102", "type": "common_case", "description": "Peripheral association via CASE-102"},
        ],
        "signals": [
            {"type": "Common Case", "description": "Peripheral association", "count": 1, "source_system": "CCTNS"},
        ]
    },
    "R-004": {
        "relationship_id": "R-004", "person_a": "P-928371", "person_b": "P-929002",
        "relationship_type": "communication", "strength": 0.89, "confidence": 0.94,
        "evidence_count": 21, "start_time": "2024-03-01", "end_time": "2026-09-01",
        "evidence_sources": [
            {"source": "CCTNS", "record_id": "CDR-991", "type": "communication_records", "description": "21 call records, multiple locations"},
            {"source": "e-Courts", "record_id": "COURT-29200", "type": "common_proceeding", "description": "Common hearing record"},
            {"source": "e-Prisons", "record_id": "PRISON-441", "type": "custody_overlap", "description": "Overlapping custody period 2024-Q3"},
        ],
        "signals": [
            {"type": "Communication", "description": "21 call interactions", "count": 21, "source_system": "CCTNS"},
            {"type": "Shared Location", "description": "3 location co-occurrences", "count": 3, "source_system": "e-Forensics"},
            {"type": "Custody Overlap", "description": "Concurrent detention 2024-Q3", "count": 1, "source_system": "e-Prisons"},
        ]
    },
    "R-005": {
        "relationship_id": "R-005", "person_a": "P-928371", "person_b": "P-929003",
        "relationship_type": "location", "strength": 0.43, "confidence": 0.61,
        "evidence_count": 2, "start_time": "2026-01-01", "end_time": None,
        "evidence_sources": [
            {"source": "e-Forensics", "record_id": "LOC-201", "type": "location_records", "description": "3 location co-occurrences in Hyderabad"},
        ],
        "signals": [
            {"type": "Shared Location", "description": "3 location matches", "count": 3, "source_system": "e-Forensics"},
        ]
    },
    "R-006": {
        "relationship_id": "R-006", "person_a": "P-928881", "person_b": "P-929002",
        "relationship_type": "common_case", "strength": 0.67, "confidence": 0.78,
        "evidence_count": 5, "start_time": "2024-05-01", "end_time": "2025-06-01",
        "evidence_sources": [
            {"source": "CCTNS", "record_id": "CASE-847", "type": "common_case", "description": "Co-accused in financial fraud case"},
        ],
        "signals": [
            {"type": "Common Case", "description": "Co-accused", "count": 2, "source_system": "CCTNS"},
        ]
    },
    "R-007": {
        "relationship_id": "R-007", "person_a": "P-928991", "person_b": "P-929004",
        "relationship_type": "financial", "strength": 0.58, "confidence": 0.69,
        "evidence_count": 4, "start_time": "2024-01-01", "end_time": "2024-12-31",
        "evidence_sources": [
            {"source": "CCTNS", "record_id": "TRANSACTION-305", "type": "financial_records", "description": "Money transfer records"},
        ],
        "signals": [
            {"type": "Financial Association", "description": "Transfer records", "count": 4, "source_system": "CCTNS"},
        ]
    },
    "R-008": {
        "relationship_id": "R-008", "person_a": "P-929002", "person_b": "P-929004",
        "relationship_type": "association", "strength": 0.76, "confidence": 0.82,
        "evidence_count": 9, "start_time": "2023-11-01", "end_time": None,
        "evidence_sources": [
            {"source": "CCTNS", "record_id": "CDR-1001", "type": "communication_records", "description": "9 communication records"},
            {"source": "e-Courts", "record_id": "COURT-30001", "type": "common_proceeding", "description": "Common court appearance"},
        ],
        "signals": [
            {"type": "Communication", "description": "9 call records", "count": 9, "source_system": "CCTNS"},
            {"type": "Common Proceeding", "description": "Court co-appearance", "count": 1, "source_system": "e-Courts"},
        ]
    },
    # Cross-cluster edges
    "R-009": {
        "relationship_id": "R-009", "person_a": "P-928371", "person_b": "P-101001",
        "relationship_type": "association", "strength": 0.38, "confidence": 0.55,
        "evidence_count": 2, "start_time": "2025-06-01", "end_time": None,
        "evidence_sources": [
            {"source": "CCTNS", "record_id": "CASE-999", "type": "cross_cluster_link", "description": "Cross-cluster association via case-999"},
        ],
        "signals": [
            {"type": "Common Case", "description": "Cross-cluster case link", "count": 1, "source_system": "CCTNS"},
        ]
    },
}

CASES = {
    "CASE-847": {
        "case_id": "CASE-847", "title": "Financial Fraud Investigation 2025",
        "status": "active", "role": "Primary Accused", "date": "2025-03-15",
        "description": "Large-scale financial fraud involving hawala transactions across Chennai and Mumbai",
        "fir_number": "FIR-2025-1842", "police_station": "Anna Nagar Police Station",
        "source_system": "CCTNS", "associated_persons": ["P-928371", "P-928881", "P-929002"],
    },
    "CASE-102": {
        "case_id": "CASE-102", "title": "Money Laundering - 2024",
        "status": "closed", "role": "Associated Person", "date": "2024-08-20",
        "description": "Money laundering via shell companies. Case closed with conviction.",
        "fir_number": "FIR-2024-0391", "police_station": "T. Nagar Police Station",
        "source_system": "CCTNS", "associated_persons": ["P-928371", "P-928991"],
    },
    "CASE-182": {
        "case_id": "CASE-182", "title": "Digital Financial Crime",
        "status": "under_investigation", "role": "Suspect", "date": "2026-02-10",
        "description": "Ongoing investigation into digital payment fraud network",
        "fir_number": "FIR-2026-0182", "police_station": "Cyber Crime Cell Chennai",
        "source_system": "CCTNS", "associated_persons": ["P-928371"],
    },
}

# ─── ICJS SOURCE RECORDS ───────────────────────────────────────────────────────

SOURCE_RECORDS = {
    "P-928371": {
        "CCTNS": [
            {"source": "CCTNS", "record_id": "CCTNS-882731", "record_type": "FIR", "timestamp": "2025-03-15T09:00:00Z", "summary": "FIR-2025-1842: Financial Fraud. Accused named in complaint.", "confidence": 0.97},
            {"source": "CCTNS", "record_id": "CCTNS-882732", "record_type": "Arrest Record", "timestamp": "2025-04-02T14:00:00Z", "summary": "Arrested under IPC 420. Bail granted 2025-04-10.", "confidence": 0.99},
            {"source": "CCTNS", "record_id": "CCTNS-882733", "record_type": "Charge Sheet", "timestamp": "2025-07-15T10:00:00Z", "summary": "Charge sheet filed. Trial pending.", "confidence": 0.98},
        ],
        "e-Courts": [
            {"source": "e-Courts", "record_id": "COURT-29183", "record_type": "Case Record", "timestamp": "2025-08-01T10:00:00Z", "summary": "Case CASE-847 listed. Next hearing scheduled.", "confidence": 0.95},
            {"source": "e-Courts", "record_id": "COURT-29184", "record_type": "Bail Order", "timestamp": "2025-04-10T16:00:00Z", "summary": "Bail granted with conditions. Surety of Rs.2L.", "confidence": 0.95},
        ],
        "e-Prisons": [
            {"source": "e-Prisons", "record_id": "PRISON-9283", "record_type": "Custody Record", "timestamp": "2025-04-02T14:00:00Z", "summary": "Held at Central Prison Chennai 2025-04-02 to 2025-04-10. Released on bail.", "confidence": 0.99},
        ],
        "e-Forensics": [
            {"source": "e-Forensics", "record_id": "FSL-92831", "record_type": "Digital Forensics Report", "timestamp": "2025-06-20T10:00:00Z", "summary": "Digital device analysis. 3 devices examined.", "confidence": 0.92},
            {"source": "e-Forensics", "record_id": "FSL-92832", "record_type": "Financial Analysis", "timestamp": "2025-06-25T10:00:00Z", "summary": "Transaction trace analysis complete.", "confidence": 0.88},
            {"source": "e-Forensics", "record_id": "FSL-92833", "record_type": "Call Record Analysis", "timestamp": "2025-07-01T10:00:00Z", "summary": "CDR analysis. 14 contacts with P-928881 identified.", "confidence": 0.94},
            {"source": "e-Forensics", "record_id": "FSL-92834", "record_type": "Location Analysis", "timestamp": "2025-07-10T10:00:00Z", "summary": "Location co-occurrence analysis complete.", "confidence": 0.87},
        ],
        "e-Prosecution": [
            {"source": "e-Prosecution", "record_id": "PROS-1291", "record_type": "Prosecution Note", "timestamp": "2025-08-05T10:00:00Z", "summary": "Prosecution review completed. Strong evidence noted.", "confidence": 0.95},
            {"source": "e-Prosecution", "record_id": "PROS-1292", "record_type": "Witness List", "timestamp": "2025-09-01T10:00:00Z", "summary": "5 witnesses listed for trial.", "confidence": 0.90},
        ],
        "NAFIS": [
            {"source": "NAFIS", "record_id": "NAFIS-928371", "record_type": "Biometric Identity", "timestamp": "2025-04-02T15:00:00Z", "summary": "Fingerprint match confirmed. Identity verified.", "confidence": 0.99},
        ],
        "e-Sakshya": [
            {"source": "e-Sakshya", "record_id": "EVID-001", "record_type": "Digital Evidence", "timestamp": "2025-06-20T10:00:00Z", "summary": "Mobile phone seized. Hash recorded.", "confidence": 0.98},
            {"source": "e-Sakshya", "record_id": "EVID-002", "record_type": "Digital Evidence", "timestamp": "2025-06-21T10:00:00Z", "summary": "Laptop seized. Chain of custody maintained.", "confidence": 0.98},
        ],
        "e-Summons": [
            {"source": "e-Summons", "record_id": "SUM-82931", "record_type": "Summons", "timestamp": "2025-09-10T10:00:00Z", "summary": "Summons issued for hearing on 2025-10-01. Status: Served.", "confidence": 1.0},
        ],
    }
}

AI_ANALYSES = {
    "P-928371": {
        "person_id": "P-928371",
        "summary": "Potential network significance detected. High centrality within CLUSTER-002. Cross-cluster connections observed. Multiple source corroboration.",
        "confidence": 0.87,
        "signals": [
            {"type": "network_centrality", "description": "High betweenness centrality in CLUSTER-002. Positioned between multiple sub-communities.", "confidence": 0.89},
            {"type": "cross_cluster", "description": "Connection to CLUSTER-001 (P-101001) detected. Potential cross-cluster coordination.", "confidence": 0.72},
            {"type": "temporal_pattern", "description": "Communication activity increased significantly between Jan 2025 and Aug 2026, overlapping with CASE-847.", "confidence": 0.84},
            {"type": "multi_source", "description": "Corroborated across 4+ independent data sources (CCTNS, e-Courts, e-Forensics, NAFIS).", "confidence": 0.96},
        ],
        "supporting_evidence": ["CDR-882", "CASE-847", "FSL-92831", "COURT-29183", "NAFIS-928371", "LOC-201"],
        "reasoning_path": ["P-928371 (Ravi Kumar)", "→ P-928881 (Sameer Khan)", "→ CASE-847 (Financial Fraud)", "→ CDR-882 (14 communications)", "→ FSL-92831 (Digital Forensics)"],
        "disclaimer": "AI-generated analysis. Human verification required. This analysis does not constitute a determination of guilt or criminality.",
        "model_info": "CrimNet Graph Analytics v1.0 — SIH Demo",
        "timestamp": "2026-09-11T10:40:00Z",
    }
}


def get_all_clusters():
    return CLUSTERS


def get_cluster_by_id(cluster_id: str):
    return CLUSTER_MAP.get(cluster_id)


def get_person_by_id(person_id: str):
    return DEMO_PERSONS.get(person_id)


def search_persons(query: str, limit: int = 10):
    query_lower = query.lower().strip()
    results = []
    for pid, p in DEMO_PERSONS.items():
        score = 0.0
        name_lower = p["display_name"].lower()
        aliases_lower = [a.lower() for a in p["aliases"]]
        if query_lower == name_lower:
            score = 0.99
        elif query_lower in name_lower:
            score = 0.85
        elif any(query_lower in a for a in aliases_lower):
            score = 0.80
        elif any(part.startswith(query_lower) for part in name_lower.split()):
            score = 0.70
        if score > 0:
            results.append({**p, "confidence": score})
    results.sort(key=lambda x: x["confidence"], reverse=True)
    return results[:limit]


def get_person_neighbors(person_id: str, hops: int = 1):
    """Return subgraph around a person up to N hops."""
    if person_id not in DEMO_PERSONS:
        return None

    # Find all relationships involving person
    direct_neighbors = set()
    relevant_edges = {}

    for rid, rel in RELATIONSHIPS.items():
        if rel["person_a"] == person_id or rel["person_b"] == person_id:
            other = rel["person_b"] if rel["person_a"] == person_id else rel["person_a"]
            direct_neighbors.add(other)
            relevant_edges[rid] = rel

    second_degree = set()
    if hops >= 2:
        for n in direct_neighbors:
            for rid, rel in RELATIONSHIPS.items():
                if rel["person_a"] == n or rel["person_b"] == n:
                    other = rel["person_b"] if rel["person_a"] == n else rel["person_a"]
                    if other != person_id and other not in direct_neighbors:
                        second_degree.add(other)
                        relevant_edges[rid] = rel

    third_degree = set()
    if hops >= 3:
        for n in second_degree:
            for rid, rel in RELATIONSHIPS.items():
                if rel["person_a"] == n or rel["person_b"] == n:
                    other = rel["person_b"] if rel["person_a"] == n else rel["person_a"]
                    if other != person_id and other not in direct_neighbors and other not in second_degree:
                        third_degree.add(other)
                        relevant_edges[rid] = rel

    all_persons = {person_id} | direct_neighbors | second_degree | third_degree

    nodes = []
    for pid in all_persons:
        p = DEMO_PERSONS.get(pid)
        if not p:
            continue
        if pid == person_id:
            state = "selected"
        elif pid in direct_neighbors:
            state = "direct"
        elif pid in second_degree:
            state = "second_degree"
        else:
            state = "normal"
        nodes.append({**p, "state": state})

    edges = []
    for rid, rel in relevant_edges.items():
        if rel["person_a"] in all_persons and rel["person_b"] in all_persons:
            edges.append({
                "id": rid,
                "source": rel["person_a"],
                "target": rel["person_b"],
                "relationship_type": rel["relationship_type"],
                "strength": rel["strength"],
                "confidence": rel["confidence"],
                "evidence_count": rel["evidence_count"],
                "source_systems": list({s["source"] for s in rel["evidence_sources"]}),
            })

    return {
        "nodes": nodes,
        "edges": edges,
        "center_person_id": person_id,
        "cluster_id": DEMO_PERSONS[person_id]["cluster_id"],
        "focus_hops": hops,
    }


def get_relationship_by_id(rel_id: str):
    rel = RELATIONSHIPS.get(rel_id)
    if not rel:
        return None
    pa = DEMO_PERSONS.get(rel["person_a"], {})
    pb = DEMO_PERSONS.get(rel["person_b"], {})
    return {
        **rel,
        "person_a_name": pa.get("display_name", rel["person_a"]),
        "person_b_name": pb.get("display_name", rel["person_b"]),
    }


def get_person_cases(person_id: str):
    return [c for c in CASES.values() if person_id in c.get("associated_persons", [])]


def get_source_records(person_id: str, source: str = None):
    records = SOURCE_RECORDS.get(person_id, {})
    if source:
        return records.get(source, [])
    return records


def get_ai_analysis(person_id: str):
    return AI_ANALYSES.get(person_id)


def detect_query_type(query: str) -> str:
    import re
    q = query.strip()
    if re.match(r'^[6-9]\d{9}$', q):
        return "mobile"
    if re.match(r'^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$', q.upper()):
        return "vehicle"
    if re.match(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$', q):
        return "email"
    if re.match(r'^(FIR|CASE|P)-', q.upper()):
        if q.upper().startswith("FIR-"):
            return "fir"
        elif q.upper().startswith("CASE-"):
            return "case_id"
        elif q.upper().startswith("P-"):
            return "person_id"
    if re.match(r'^\d{12}$', q):
        return "aadhaar"
    return "name"
