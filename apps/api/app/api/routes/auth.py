"""Authentication routes — login, token, user info."""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import authenticate_user, create_access_token, get_current_user
from app.schemas.models import TokenResponse
from app.core.audit import log_audit_event, AuditAction

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        await log_audit_event(
            action=AuditAction.LOGIN, user_id="UNKNOWN",
            resource_type="auth", resource_id=form_data.username,
            result="FAILED",
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    token = create_access_token({"sub": user["username"]})
    await log_audit_event(
        action=AuditAction.LOGIN, user_id=user["user_id"],
        resource_type="auth", resource_id=user["username"],
        result="SUCCESS",
    )
    return TokenResponse(
        access_token=token,
        user_id=user["user_id"],
        username=user["username"],
        role=user["role"],
        display_name=user["display_name"],
        permissions=user["permissions"],
    )


@router.get("/me")
async def get_current_user_info(user: dict = Depends(get_current_user)):
    return {
        "user_id": user["user_id"],
        "username": user["username"],
        "role": user["role"],
        "display_name": user["display_name"],
        "department": user.get("department"),
        "permissions": user["permissions"],
    }
