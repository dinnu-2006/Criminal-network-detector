"""
Search API route — universal search across all identifier types.
Resolves any query to a person candidate list.
"""
from fastapi import APIRouter, Depends, Request
import uuid
from app.schemas.models import SearchRequest, SearchResponse, SearchResult
from app.services.mock_data_store import search_persons, detect_query_type, CASES, DEMO_PERSONS
from app.core.security import get_current_user
from app.core.audit import log_audit_event, AuditAction

router = APIRouter()


@router.post("", response_model=SearchResponse)
async def universal_search(request: Request, body: SearchRequest, user: dict = Depends(get_current_user)):
    """
    Universal search endpoint. Accepts any identifier type and resolves to person candidates.
    Query types: name, mobile, email, vehicle, case_id, fir, person_id, aadhaar
    """
    query = body.query.strip()
    query_type = detect_query_type(query)
    search_id = str(uuid.uuid4())[:8]

    results = []

    if query_type == "person_id":
        p = DEMO_PERSONS.get(query.upper())
        if p:
            results = [{**p, "confidence": 1.0}]
    elif query_type == "case_id":
        case = CASES.get(query.upper())
        if case:
            for pid in case.get("associated_persons", []):
                p = DEMO_PERSONS.get(pid)
                if p:
                    results.append({**p, "confidence": 0.90})
    else:
        results = search_persons(query, body.limit)

    # Audit every search action
    await log_audit_event(
        action=AuditAction.SEARCH_PERSON,
        user_id=user["user_id"],
        resource_type="search",
        resource_id=query,
        metadata={"query_type": query_type, "result_count": len(results), "search_id": search_id},
        ip_address=request.client.host if request.client else None,
    )

    return SearchResponse(
        query=query,
        query_type=query_type,
        results=[
            SearchResult(
                person_id=r["person_id"],
                display_name=r["display_name"],
                confidence=r.get("confidence", 0.8),
                connection_count=r.get("connection_count", 0),
                case_count=r.get("case_count", 0),
                cluster_id=r.get("cluster_id", ""),
                status=r.get("status", "unknown"),
                location=r.get("location"),
                query_type=query_type,
            )
            for r in results
        ],
        total=len(results),
        search_id=search_id,
    )
