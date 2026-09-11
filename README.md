# CrimNet Intel — Criminal Network Detector

AI-Powered Criminal Network Analysis System (SIH 2026 — Problem Statement ID: 26189)

An intelligence and law enforcement network visualization and investigation platform that synthesizes multi-source records (CCTNS, Telecom/CDR, Prison/Correctional, Banking/Financial, and Court records) into an interactive cosmic graph canvas with real-time entity resolution, risk scoring, and intelligence dossier generation.

---

## Architecture Overview

```
crim_ran/
├── apps/
│   ├── api/             # FastAPI backend with graph routing, entity fusion, and security
│   │   ├── app/
│   │   │   ├── api/routes/   # Auth, Graph, Person, Search, Relationships, Data Sources
│   │   │   ├── core/         # Config, security, audit logging
│   │   │   ├── integrations/ # Adapters, fusion pipelines
│   │   │   ├── schemas/      # Pydantic models
│   │   │   └── services/     # Mock data store and graph analytics
│   │   ├── requirements.txt
│   │   └── .env.example
│   └── web/             # Next.js frontend with Cosmic 3D/2D canvas and dossier views
│       ├── app/         # App router pages
│       ├── components/  # Cosmic graph canvas, dossier tabs, filters, search
│       ├── store/       # State management
│       └── package.json
├── data/
│   └── seed/            # Seed data configurations
└── infrastructure/
    └── docker/          # Containerization & deployment specifications
```

---

## Features

- **Cosmic Network Graph**: Interactive canvas displaying suspects, associates, shell entities, and transactions with link strength and centrality analysis.
- **Deep Search & Entity Resolution**: Unified search across Names, Mobile numbers, Aadhaar, Vehicle IDs, and Case IDs.
- **Entity Dossiers**: Profiles with risk breakdown, linked FIRs, call records, financial trails, and biometric cross-references.
- **Multi-Source Data Fusion**: Connectors for CCTNS, Telecom CDR, Prison records, and Banking transactions with audit logging.
- **Role-Based Access Control**: Secure token-based access with audit logging for law enforcement workflows.

---

## Quick Start

### 1. Backend (FastAPI)

```bash
cd apps/api
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive API documentation will be available at `http://localhost:8000/docs`.

### 2. Frontend (Next.js)

```bash
cd apps/web
npm install
npm run dev
```

The web interface will be accessible at `http://localhost:3000`.

---

## License

Confidential & Proprietary — Developed for SIH 2026.
