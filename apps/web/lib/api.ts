// API client for CrimNet Intel backend
// All requests include JWT auth token from localStorage

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("crimnet_token");
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API Error ${res.status}`);
  }
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(username: string, password: string) {
  const form = new URLSearchParams({ username, password });
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    body: form,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export async function getMe() {
  return apiFetch("/api/auth/me");
}

// ─── Search ──────────────────────────────────────────────────────────────────

export async function searchPersons(query: string, limit = 10) {
  return apiFetch("/api/search", {
    method: "POST",
    body: JSON.stringify({ query, limit }),
  });
}

// ─── Graph ───────────────────────────────────────────────────────────────────

export async function getClusters() {
  return apiFetch("/api/graph/clusters");
}

export async function getClusterDetail(clusterId: string) {
  return apiFetch(`/api/graph/cluster/${clusterId}`);
}

export async function getPersonNeighbors(personId: string, hops = 1) {
  return apiFetch(`/api/graph/person/${personId}/neighbors?hops=${hops}`);
}

export async function getAllDemoPersons() {
  return apiFetch("/api/graph/all-demo-persons");
}

// ─── Investigation Focus ─────────────────────────────────────────────────────

export async function investigationFocus(personId: string, hops = 1) {
  return apiFetch("/api/relationship/focus", {
    method: "POST",
    body: JSON.stringify({ person_id: personId, hops }),
  });
}

// ─── Person ──────────────────────────────────────────────────────────────────

export async function getPersonProfile(personId: string) {
  return apiFetch(`/api/person/${personId}`);
}

export async function getPersonCases(personId: string) {
  return apiFetch(`/api/person/${personId}/cases`);
}

export async function getPersonConnections(personId: string) {
  return apiFetch(`/api/person/${personId}/connections`);
}

export async function getPersonSources(personId: string, source?: string) {
  const q = source ? `?source=${source}` : "";
  return apiFetch(`/api/person/${personId}/sources${q}`);
}

export async function getPersonAIAnalysis(personId: string) {
  return apiFetch(`/api/person/${personId}/ai-analysis`);
}

// ─── Relationship ─────────────────────────────────────────────────────────────

export async function getRelationship(relationshipId: string) {
  return apiFetch(`/api/relationship/${relationshipId}`);
}

// ─── Data Sources ─────────────────────────────────────────────────────────────

export async function getDataSources() {
  return apiFetch("/api/data/sources");
}

export async function getIntegrationSummary() {
  return apiFetch("/api/data/integration-summary");
}
