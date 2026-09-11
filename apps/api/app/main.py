"""
FastAPI main application entry point.
CrimNet Intel — AI-Powered Criminal Network Analysis System
SIH 2026, Problem Statement ID: 26189
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import structlog

from app.api.routes import search, graph, person, relationship, auth, datasources
from app.core.config import get_settings

settings = get_settings()
logger = structlog.get_logger()

app = FastAPI(
    title="CrimNet Intel API",
    description="AI-Powered Criminal Network Analysis System — SIH 2026 (PS-26189)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(search.router, prefix="/api/search", tags=["Search"])
app.include_router(graph.router, prefix="/api/graph", tags=["Graph"])
app.include_router(person.router, prefix="/api/person", tags=["Person"])
app.include_router(relationship.router, prefix="/api/relationship", tags=["Relationship"])
app.include_router(datasources.router, prefix="/api/data", tags=["Data Sources"])


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": "1.0.0",
        "demo_mode": settings.demo_mode,
        "environment": settings.app_env,
    }


@app.get("/")
async def root():
    return {
        "message": "CrimNet Intel API",
        "version": "1.0.0",
        "description": "AI-Powered Criminal Network Analysis System",
        "docs": "/docs",
        "notice": "SIH 2026 Prototype — Demo Mode",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
