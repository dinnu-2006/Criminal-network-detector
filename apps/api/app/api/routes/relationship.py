"""Relationship evidence and investigation focus API routes."""
from fastapi import APIRouter, Depends, HTTPException, Request
from app.services.mock_data_store import get_relationship_by_id, get_person_neighbors, get_person_by_id, get_cluster_by_id
from app.core.security import get_current_user
from app.core.audit import log_audit_event, AuditAction

router = APIRouter()


@router.get("/{relationship_id}")
async def get_relationship(relationship_id: str, request: Request, user: dict = Depends(get_current_user)):
    """Return full relationship evidence including multi-source signals."""
    rel = get_relationship_by_id(relationship_id)
    if not rel:
        raise HTTPException(status_code=404, detail=f"Relationship {relationship_id} not found")
    await log_audit_event(
        action=AuditAction.VIEW_RELATIONSHIP, user_id=user["user_id"],
        resource_type="relationship", resource_id=relationship_id,
    )
    return rel


@router.post("/focus")
async def investigation_focus(body: dict, request: Request, user: dict = Depends(get_current_user)):
    """
    Investigation focus endpoint: given a person_id, returns the
    cluster context, camera target, and initial 1-hop subgraph for
    the graph navigation animation.
    """
    person_id = body.get("person_id")
    hops = body.get("hops", 1)

    if not person_id:
        raise HTTPException(status_code=400, detail="person_id required")

    person = get_person_by_id(person_id)
    if not person:
        raise HTTPException(status_code=404, detail=f"Person {person_id} not found")

    cluster = get_cluster_by_id(person["cluster_id"])
    subgraph = get_person_neighbors(person_id, hops)

    await log_audit_event(
        action=AuditAction.FOCUS_PERSON, user_id=user["user_id"],
        resource_type="person", resource_id=person_id,
        metadata={"hops": hops, "cluster_id": person["cluster_id"]},
    )

    return {
        "person_id": person_id,
        "display_name": person["display_name"],
        "cluster_id": person["cluster_id"],
        "cluster_name": cluster["name"] if cluster else None,
        "camera_target": {
            "x": person["x"],
            "y": person["y"],
            "cluster_x": cluster["x"] if cluster else 0,
            "cluster_y": cluster["y"] if cluster else 0,
            "cluster_radius": cluster["radius"] if cluster else 100,
        },
        "subgraph": subgraph,
    }
