"""Person profile, cases, connections, and AI analysis API routes."""
from fastapi import APIRouter, Depends, HTTPException, Request
from app.services.mock_data_store import (
    get_person_by_id, get_person_cases, get_person_neighbors,
    get_source_records, get_ai_analysis, RELATIONSHIPS
)
from app.core.security import get_current_user
from app.core.audit import log_audit_event, AuditAction

router = APIRouter()


@router.get("/{person_id}")
async def get_person_profile(person_id: str, request: Request, user: dict = Depends(get_current_user)):
    """Return complete person profile including source summary."""
    p = get_person_by_id(person_id)
    if not p:
        raise HTTPException(status_code=404, detail=f"Person {person_id} not found")
    await log_audit_event(
        action=AuditAction.VIEW_PERSON, user_id=user["user_id"],
        resource_type="person", resource_id=person_id,
        ip_address=request.client.host if request.client else None,
    )
    return p


@router.get("/{person_id}/cases")
async def get_person_cases_route(person_id: str, request: Request, user: dict = Depends(get_current_user)):
    """Return all cases associated with a person."""
    p = get_person_by_id(person_id)
    if not p:
        raise HTTPException(status_code=404, detail=f"Person {person_id} not found")
    await log_audit_event(
        action=AuditAction.VIEW_CASE, user_id=user["user_id"],
        resource_type="person_cases", resource_id=person_id,
    )
    return get_person_cases(person_id)


@router.get("/{person_id}/connections")
async def get_person_connections(person_id: str, user: dict = Depends(get_current_user)):
    """Return direct connections for a person."""
    p = get_person_by_id(person_id)
    if not p:
        raise HTTPException(status_code=404, detail=f"Person {person_id} not found")
    connections = []
    for rid, rel in RELATIONSHIPS.items():
        if rel["person_a"] == person_id or rel["person_b"] == person_id:
            other_id = rel["person_b"] if rel["person_a"] == person_id else rel["person_a"]
            from app.services.mock_data_store import DEMO_PERSONS
            other = DEMO_PERSONS.get(other_id)
            if other:
                connections.append({
                    "relationship_id": rid,
                    "person_id": other_id,
                    "display_name": other["display_name"],
                    "strength": rel["strength"],
                    "relationship_type": rel["relationship_type"],
                    "evidence_count": rel["evidence_count"],
                    "source_systems": list({s["source"] for s in rel["evidence_sources"]}),
                })
    connections.sort(key=lambda x: x["strength"], reverse=True)
    return connections


@router.get("/{person_id}/sources")
async def get_person_sources(person_id: str, source: str = None, user: dict = Depends(get_current_user)):
    """Return ICJS source records for a person, optionally filtered by source system."""
    p = get_person_by_id(person_id)
    if not p:
        raise HTTPException(status_code=404, detail=f"Person {person_id} not found")
    records = get_source_records(person_id, source)
    return {"person_id": person_id, "source": source, "records": records}


@router.get("/{person_id}/ai-analysis")
async def get_ai_analysis_route(person_id: str, request: Request, user: dict = Depends(get_current_user)):
    """Return AI investigative analysis for a person."""
    p = get_person_by_id(person_id)
    if not p:
        raise HTTPException(status_code=404, detail=f"Person {person_id} not found")
    await log_audit_event(
        action=AuditAction.RUN_AI_ANALYSIS, user_id=user["user_id"],
        resource_type="ai_analysis", resource_id=person_id,
    )
    analysis = get_ai_analysis(person_id)
    if not analysis:
        return {
            "person_id": person_id,
            "summary": "Insufficient data for AI analysis.",
            "confidence": 0.0,
            "signals": [],
            "supporting_evidence": [],
            "reasoning_path": [],
            "disclaimer": "AI-generated analysis. Human verification required.",
            "model_info": "CrimNet Graph Analytics v1.0",
        }
    return analysis
