from datetime import datetime, timedelta
from typing import Optional, Any
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import get_settings

settings = get_settings()
security = HTTPBearer()

# Demo users — plaintext passwords for prototype only
# In production: use Keycloak + hashed passwords from database
DEMO_USERS = {
    "investigator": {
        "user_id": "USR-001",
        "username": "investigator",
        "_password": "demo123",
        "role": "investigator",
        "display_name": "Demo Investigator",
        "department": "CID",
        "permissions": ["search", "view_person", "view_cases", "view_evidence", "view_relationships", "run_ai"],
    },
    "analyst": {
        "user_id": "USR-002",
        "username": "analyst",
        "_password": "demo123",
        "role": "analyst",
        "display_name": "Demo Analyst",
        "department": "Analytics",
        "permissions": ["search", "view_person", "view_cases", "view_evidence", "run_ai"],
    },
    "admin": {
        "user_id": "USR-003",
        "username": "admin",
        "_password": "admin123",
        "role": "administrator",
        "display_name": "System Admin",
        "department": "Admin",
        "permissions": ["*"],
    },
}


def verify_password(plain_password: str, stored_password: str) -> bool:
    return plain_password == stored_password


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.jwt_access_token_expire_minutes))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def authenticate_user(username: str, password: str) -> Optional[dict]:
    user = DEMO_USERS.get(username)
    if not user:
        return None
    if not verify_password(password, user["_password"]):
        return None
    return user


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        payload = jwt.decode(credentials.credentials, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        user = DEMO_USERS.get(username)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")


def has_permission(user: dict, permission: str) -> bool:
    perms = user.get("permissions", [])
    return "*" in perms or permission in perms

