import structlog
import json
from datetime import datetime
from typing import Optional

logger = structlog.get_logger()


async def log_audit_event(
    action: str,
    user_id: str,
    resource_type: str,
    resource_id: str,
    result: str = "AUTHORIZED",
    metadata: Optional[dict] = None,
    ip_address: Optional[str] = None,
):
    """
    Create a structured audit log entry for every investigator action
    on sensitive data. In production this would write to a tamper-resistant
    audit log store.
    """
    event = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "event_type": "AUDIT",
        "action": action,
        "user_id": user_id,
        "resource_type": resource_type,
        "resource_id": resource_id,
        "result": result,
        "ip_address": ip_address or "unknown",
        "metadata": metadata or {},
    }
    logger.info("audit_event", **event)
    return event


# Audit action constants
class AuditAction:
    SEARCH_PERSON = "SEARCH_PERSON"
    VIEW_PERSON = "VIEW_PERSON"
    VIEW_CASE = "VIEW_CASE"
    VIEW_EVIDENCE = "VIEW_EVIDENCE"
    VIEW_RELATIONSHIP = "VIEW_RELATIONSHIP"
    RUN_AI_ANALYSIS = "RUN_AI_ANALYSIS"
    VIEW_DATA_SOURCE = "VIEW_DATA_SOURCE"
    FOCUS_PERSON = "FOCUS_PERSON"
    EXPORT_DATA = "EXPORT_DATA"
    VIEW_SENSITIVE_RECORD = "VIEW_SENSITIVE_RECORD"
    LOGIN = "LOGIN"
    LOGOUT = "LOGOUT"
