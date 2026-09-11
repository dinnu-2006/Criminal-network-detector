"""
Graph API routes — cluster visualization, subgraph retrieval, person neighborhood.
All graph queries return only required subgraphs. Never return full dataset.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from app.services.mock_data_store import (
    get_all_clusters, get_cluster_by_id, get_person_neighbors, DEMO_PERSONS, RELATIONSHIPS
)
from app.schemas.models import ClusterSummary, GraphSubgraph, GraphNode, GraphEdge, NodeState
from app.core.security import get_current_user
from typing import List

router = APIRouter()


@router.get("/clusters", response_model=List[ClusterSummary])
async def get_clusters(user: dict = Depends(get_current_user)):
    """Return all cluster summaries for the global network view."""
    clusters = get_all_clusters()
    return [ClusterSummary(**c, relationship_count=c.get("relationship_count", 0), case_count=c.get("case_count", 0)) for c in clusters]


@router.get("/cluster/{cluster_id}")
async def get_cluster_detail(cluster_id: str, user: dict = Depends(get_current_user)):
    """Return detailed cluster info including person count and metrics."""
    cluster = get_cluster_by_id(cluster_id)
    if not cluster:
        raise HTTPException(status_code=404, detail=f"Cluster {cluster_id} not found")

    # Get persons in this cluster
    cluster_persons = [p for p in DEMO_PERSONS.values() if p["cluster_id"] == cluster_id]
    person_ids = {p["person_id"] for p in cluster_persons}

    # Get edges within cluster
    cluster_edges = [
        r for r in RELATIONSHIPS.values()
        if r["person_a"] in person_ids and r["person_b"] in person_ids
    ]

    return {
        **cluster,
        "relationship_count": len(cluster_edges) + cluster["person_count"] // 3,  # simulated
        "persons_in_demo": len(cluster_persons),
        "demo_persons": [
            {"person_id": p["person_id"], "display_name": p["display_name"], "x": p["x"], "y": p["y"]}
            for p in cluster_persons
        ],
        "demo_edges": [
            {"source": e["person_a"], "target": e["person_b"], "strength": e["strength"]}
            for e in cluster_edges
        ],
    }


@router.get("/person/{person_id}/neighbors")
async def get_person_neighbors_route(
    person_id: str,
    hops: int = Query(default=1, ge=1, le=3),
    user: dict = Depends(get_current_user),
):
    """
    Return person-centric subgraph up to N hops.
    Never returns more than the required neighborhood.
    """
    result = get_person_neighbors(person_id, hops)
    if not result:
        raise HTTPException(status_code=404, detail=f"Person {person_id} not found")
    return result


@router.get("/all-demo-persons")
async def get_all_demo_persons(user: dict = Depends(get_current_user)):
    """Return all demo persons and relationships for full graph display."""
    nodes = []
    for p in DEMO_PERSONS.values():
        nodes.append({
            "id": p["person_id"],
            "person_id": p["person_id"],
            "display_name": p["display_name"],
            "cluster_id": p["cluster_id"],
            "status": p["status"],
            "x": p["x"],
            "y": p["y"],
            "size": 5.0,
            "state": "normal",
            "connection_count": p["connection_count"],
            "case_count": p["case_count"],
        })

    edges = []
    for rid, r in RELATIONSHIPS.items():
        edges.append({
            "id": rid,
            "source": r["person_a"],
            "target": r["person_b"],
            "relationship_type": r["relationship_type"],
            "strength": r["strength"],
            "confidence": r["confidence"],
            "evidence_count": r["evidence_count"],
            "source_systems": list({s["source"] for s in r["evidence_sources"]}),
        })

    return {"nodes": nodes, "edges": edges}
