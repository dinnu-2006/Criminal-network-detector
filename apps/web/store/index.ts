"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AuthUser,
  GraphMode,
  GraphNode,
  GraphEdge,
  ClusterSummary,
  SearchResult,
  PersonProfile,
  RelationshipEvidence,
  FocusContext,
} from "@/types";

// ─── Auth Store ───────────────────────────────────────────────────────────────

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        user_id: "AP-001",
        username: "arun_prakash",
        role: "Investigator",
        display_name: "Arun Prakash",
        department: "Cyber Crime Wing, CID",
        permissions: ["*"],
      },
      token: "nexus-token-auth",
      isAuthenticated: true,
      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("crimnet_token", token);
        }
        set({ user, token, isAuthenticated: true });
      },
      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("crimnet_token");
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: "crimnet-auth", partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }) }
  )
);

// ─── Filter State ─────────────────────────────────────────────────────────────

export interface FilterState {
  // Geography
  country: string;
  state: string;
  district: string;
  taluk: string;
  policeStation: string;
  pincode: string;
  locality: string;

  // Person
  ageRange: [number, number];
  gender: string;
  identityConfidence: number;

  // Case
  caseType: string;
  caseStatus: string;
  yearRange: [number, number];

  // Data Sources
  dataSources: string[];

  // Network
  hops: number;

  // Relationship types
  relationships: string[];

  // Time
  dateFrom: string;
  dateTo: string;

  // Active tags shown beneath search bar
  activeTags: string[];

  // Actions
  removeTag: (tag: string) => void;
  clearAllTags: () => void;
  setDataSource: (ds: string, checked: boolean) => void;
  setHops: (hops: number) => void;
  setIdentityConfidence: (v: number) => void;
  setYearRange: (r: [number, number]) => void;
  setGeography: (field: string, val: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  country: "India",
  state: "Tamil Nadu",
  district: "Tirunelveli",
  taluk: "Palayamkottai",
  policeStation: "Palayamkottai PS",
  pincode: "627002",
  locality: "NGO Colony",

  ageRange: [20, 50],
  gender: "All",
  identityConfidence: 85,

  caseType: "Cybercrime",
  caseStatus: "Active Investigation",
  yearRange: [2024, 2026],

  dataSources: ["CCTNS", "ICJS"],
  hops: 2,
  relationships: ["Common Case", "Investigation Association", "Court Association"],

  dateFrom: "2024-01-01",
  dateTo: "2026-09-11",

  activeTags: [
    "Tamil Nadu",
    "Tirunelveli",
    "Palayamkottai",
    "CCTNS",
    "Cybercrime",
    "2024 - 2026",
    "2 Hops",
  ],

  removeTag: (tag) =>
    set((s) => ({ activeTags: s.activeTags.filter((t) => t !== tag) })),

  clearAllTags: () => set({ activeTags: [] }),

  setDataSource: (ds, checked) =>
    set((s) => {
      const next = checked
        ? [...s.dataSources, ds]
        : s.dataSources.filter((d) => d !== ds);
      return { dataSources: next };
    }),

  setHops: (hops) =>
    set((s) => ({
      hops,
      activeTags: s.activeTags.map((t) => (t.includes("Hop") ? `${hops} Hops` : t)),
    })),

  setIdentityConfidence: (v) => set({ identityConfidence: v }),
  setYearRange: (yearRange) => set({ yearRange }),
  setGeography: (field, val) => set((s) => ({ ...s, [field]: val })),
  setState: (state) => set((s) => ({ ...s, state })),
  setDistrict: (district) => set((s) => ({ ...s, district })),
  setCaseType: (caseType) => set((s) => ({ ...s, caseType })),
  setCaseStatus: (caseStatus) => set((s) => ({ ...s, caseStatus })),
  setGender: (gender) => set((s) => ({ ...s, gender })),
  setAgeRange: (ageRange) => set((s) => ({ ...s, ageRange })),
  setRelationshipType: (rel, checked) =>
    set((s) => {
      const next = checked
        ? [...s.relationships, rel]
        : s.relationships.filter((r) => r !== rel);
      return { relationships: next };
    }),
  setDateRange: (dateFrom, dateTo) => set((s) => ({ ...s, dateFrom, dateTo })),
  resetFilters: () =>
    set({
      country: "India",
      state: "Tamil Nadu",
      district: "Tirunelveli",
      taluk: "Palayamkottai",
      policeStation: "Palayamkottai PS",
      pincode: "627002",
      locality: "NGO Colony",
      ageRange: [20, 50],
      gender: "All",
      identityConfidence: 85,
      caseType: "Cybercrime",
      caseStatus: "Active Investigation",
      yearRange: [2024, 2026],
      dataSources: ["CCTNS", "ICJS"],
      hops: 2,
      relationships: ["Common Case", "Investigation Association", "Court Association"],
      activeTags: [
        "Tamil Nadu",
        "Tirunelveli",
        "Palayamkottai",
        "CCTNS",
        "Cybercrime",
        "2024 - 2026",
        "2 Hops",
      ],
    }),
}));

// ─── Graph Store ──────────────────────────────────────────────────────────────

interface GraphState {
  mode: GraphMode;
  setMode: (mode: GraphMode) => void;

  clusters: ClusterSummary[];
  setClusters: (clusters: ClusterSummary[]) => void;

  nodes: GraphNode[];
  edges: GraphEdge[];
  setSubgraph: (nodes: GraphNode[], edges: GraphEdge[]) => void;

  // Default to Dinesh Kumar
  selectedPersonId: string | null;
  selectedRelationshipId: string | null;
  setSelectedPerson: (id: string | null) => void;
  setSelectedRelationship: (id: string | null) => void;

  focusContext: FocusContext | null;
  setFocusContext: (ctx: FocusContext | null) => void;
  focusHops: number;
  setFocusHops: (hops: number) => void;

  hoveredPersonId: string | null;
  setHoveredPerson: (id: string | null) => void;
  tooltipPos: { x: number; y: number } | null;
  setTooltipPos: (pos: { x: number; y: number } | null) => void;

  // Default person drawer open as in sturcture.png
  personPanelOpen: boolean;
  setPersonPanelOpen: (open: boolean) => void;
  relationshipPanelOpen: boolean;
  setRelationshipPanelOpen: (open: boolean) => void;

  activeClusterId: string | null;
  setActiveClusterId: (id: string | null) => void;

  previousMode: GraphMode | null;
  setPreviousMode: (mode: GraphMode | null) => void;

  cameraTarget: { x: number; y: number; zoom: number } | null;
  setCameraTarget: (t: { x: number; y: number; zoom: number } | null) => void;

  // View settings
  isCosmicMode: boolean;
  setIsCosmicMode: (v: boolean) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  mode: "FOCUS",
  setMode: (mode) => set({ mode }),

  clusters: [],
  setClusters: (clusters) => set({ clusters }),

  nodes: [],
  edges: [],
  setSubgraph: (nodes, edges) => set({ nodes, edges }),

  selectedPersonId: "P-001928371", // Dinesh Kumar
  selectedRelationshipId: null,
  setSelectedPerson: (id) => set({ selectedPersonId: id }),
  setSelectedRelationship: (id) => set({ selectedRelationshipId: id }),

  focusContext: null,
  setFocusContext: (ctx) => set({ focusContext: ctx }),
  focusHops: 2,
  setFocusHops: (hops) => set({ focusHops: hops }),

  hoveredPersonId: null,
  setHoveredPerson: (id) => set({ hoveredPersonId: id }),
  tooltipPos: null,
  setTooltipPos: (pos) => set({ tooltipPos: pos }),

  personPanelOpen: true,
  setPersonPanelOpen: (open) => set({ personPanelOpen: open }),
  relationshipPanelOpen: false,
  setRelationshipPanelOpen: (open) => set({ relationshipPanelOpen: open }),

  activeClusterId: null,
  setActiveClusterId: (id) => set({ activeClusterId: id }),

  previousMode: null,
  setPreviousMode: (mode) => set({ previousMode: mode }),

  cameraTarget: null,
  setCameraTarget: (t) => set({ cameraTarget: t }),

  isCosmicMode: true,
  setIsCosmicMode: (v) => set({ isCosmicMode: v }),
}));

// ─── Search Store ─────────────────────────────────────────────────────────────

interface SearchState {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  setResults: (r: SearchResult[]) => void;
  isSearching: boolean;
  setIsSearching: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  queryType: string;
  setQueryType: (t: string) => void;
  searchPhase: "" | "searching" | "resolving" | "locating" | "navigating" | "done";
  setSearchPhase: (p: SearchState["searchPhase"]) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  setQuery: (q) => set({ query: q }),
  results: [],
  setResults: (r) => set({ results: r }),
  isSearching: false,
  setIsSearching: (v) => set({ isSearching: v }),
  searchOpen: false,
  setSearchOpen: (v) => set({ searchOpen: v }),
  queryType: "",
  setQueryType: (t) => set({ queryType: t }),
  searchPhase: "",
  setSearchPhase: (p) => set({ searchPhase: p }),
  clearSearch: () => set({ query: "", results: [], isSearching: false, searchOpen: false, queryType: "", searchPhase: "" }),
}));

// ─── Investigation Store ──────────────────────────────────────────────────────

interface InvestigationState {
  activePersonId: string | null;
  activePersonData: PersonProfile | null;
  setActivePerson: (id: string | null, data: PersonProfile | null) => void;

  activeRelationshipId: string | null;
  activeRelationshipData: RelationshipEvidence | null;
  setActiveRelationship: (id: string | null, data: RelationshipEvidence | null) => void;

  personTab: string;
  setPersonTab: (tab: string) => void;
}

export const useInvestigationStore = create<InvestigationState>((set) => ({
  activePersonId: "P-001928371",
  activePersonData: null,
  setActivePerson: (id, data) => set({ activePersonId: id, activePersonData: data }),

  activeRelationshipId: null,
  activeRelationshipData: null,
  setActiveRelationship: (id, data) => set({ activeRelationshipId: id, activeRelationshipData: data }),

  personTab: "profile",
  setPersonTab: (tab) => set({ personTab: tab }),
}));
