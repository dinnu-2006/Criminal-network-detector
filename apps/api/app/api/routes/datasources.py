"""Data source integration routes — ICJS health, source registry, source records."""
from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from datetime import datetime

router = APIRouter()

SOURCES = [
    {"source_id": "CCTNS", "source_name": "CCTNS — Crime & Criminal Tracking Network", "category": "Police", "is_mock": True, "records_processed": 3821442, "error_count": 0, "latency_ms": 42.3},
    {"source_id": "ICJS", "source_name": "ICJS — Interoperable Criminal Justice System", "category": "National Interoperability", "is_mock": True, "records_processed": 12400000, "error_count": 2, "latency_ms": 67.1},
    {"source_id": "e-Courts", "source_name": "e-Courts / CIS — Court Information System", "category": "Judiciary", "is_mock": True, "records_processed": 5623801, "error_count": 0, "latency_ms": 55.2},
    {"source_id": "e-Prisons", "source_name": "e-Prisons — Prison & Custody Management", "category": "Corrections", "is_mock": True, "records_processed": 892341, "error_count": 1, "latency_ms": 38.9},
    {"source_id": "e-Forensics", "source_name": "e-Forensics — Forensic Laboratory System", "category": "Forensics", "is_mock": True, "records_processed": 428103, "error_count": 0, "latency_ms": 91.4},
    {"source_id": "e-Prosecution", "source_name": "e-Prosecution — Prosecution Management", "category": "Prosecution", "is_mock": True, "records_processed": 1102883, "error_count": 0, "latency_ms": 44.8},
    {"source_id": "NAFIS", "source_name": "NAFIS — National Automated Fingerprint ID", "category": "Biometric", "is_mock": True, "records_processed": 1839210, "error_count": 0, "latency_ms": 120.5},
    {"source_id": "e-Sakshya", "source_name": "e-Sakshya — Digital Evidence Management", "category": "Digital Evidence", "is_mock": True, "records_processed": 342109, "error_count": 0, "latency_ms": 33.2},
    {"source_id": "ITSSO", "source_name": "ITSSO — Investigation Tracking for Sexual Offences", "category": "Special Cases", "is_mock": True, "records_processed": 129011, "error_count": 0, "latency_ms": 28.9},
    {"source_id": "MedLEaPR", "source_name": "MedLEaPR — Medico-Legal Examination & PM", "category": "Medical-Legal", "is_mock": True, "records_processed": 88203, "error_count": 3, "latency_ms": 72.1},
    {"source_id": "e-Summons", "source_name": "e-Summons — Electronic Summons Workflow", "category": "Court Process", "is_mock": True, "records_processed": 2183041, "error_count": 0, "latency_ms": 22.4},
    {"source_id": "Nyaya Shruti", "source_name": "Nyaya Shruti — Judicial Video Proceedings", "category": "Judicial Video", "is_mock": True, "records_processed": 412800, "error_count": 1, "latency_ms": 58.7},
]

SOURCE_MAP = {s["source_id"]: s for s in SOURCES}


def get_source_status(source: dict) -> str:
    if source["error_count"] > 2:
        return "warning"
    return "healthy"


@router.get("/sources")
async def list_data_sources(user: dict = Depends(get_current_user)):
    """Return all registered data sources with health status."""
    result = []
    for s in SOURCES:
        result.append({
            **s,
            "status": get_source_status(s),
            "last_sync": "2026-09-11T10:00:00Z",
        })
    return result


@router.get("/sources/{source_id}/health")
async def get_source_health(source_id: str, user: dict = Depends(get_current_user)):
    """Return health metrics for a specific data source."""
    source = SOURCE_MAP.get(source_id)
    if not source:
        return {"error": f"Source {source_id} not found"}
    return {
        **source,
        "status": get_source_status(source),
        "last_sync": "2026-09-11T10:00:00Z",
        "uptime_percent": 99.8 if source["error_count"] == 0 else 98.2,
        "avg_response_time_ms": source["latency_ms"],
        "demo_notice": "MOCK INTEGRATION — This is a demonstration. Real integration requires authorized API access.",
    }


@router.get("/integration-summary")
async def get_integration_summary(user: dict = Depends(get_current_user)):
    """Return high-level integration summary for all sources."""
    healthy = sum(1 for s in SOURCES if get_source_status(s) == "healthy")
    warning = len(SOURCES) - healthy
    total_records = sum(s["records_processed"] for s in SOURCES)
    return {
        "total_sources": len(SOURCES),
        "healthy": healthy,
        "warning": warning,
        "error": 0,
        "total_records_processed": total_records,
        "last_full_sync": "2026-09-11T10:00:00Z",
        "demo_mode": True,
        "demo_notice": "All integrations are mock/simulated for SIH demonstration purposes.",
    }
