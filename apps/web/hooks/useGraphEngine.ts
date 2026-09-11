"use client";
import { useEffect, useRef, useCallback } from "react";
import Sigma from "sigma";
import Graph from "graphology";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import type { GraphNode, GraphEdge, ClusterSummary } from "@/types";
import { useGraphStore } from "@/store";

// ─── Node color by state ────────────────────────────────────────────────────

function nodeColor(state: string, status?: string): string {
  switch (state) {
    case "selected": return "#DC2626";
    case "direct": return "#8B8BA7";
    case "second_degree": return "#4A4A5A";
    case "unrelated": return "#1A1A22";
    default:
      if (status === "convicted") return "#6B2020";
      if (status === "absconding") return "#7C5A1A";
      return "#4A4A5A";
  }
}

function nodeSize(state: string, connectionCount: number): number {
  if (state === "selected") return 14;
  if (state === "direct") return 7 + Math.min(connectionCount * 0.5, 5);
  if (state === "second_degree") return 5;
  return 4;
}

function edgeColor(state: string, strength: number): string {
  if (state === "unrelated") return "#1A1A22";
  const alpha = Math.max(0.1, Math.min(strength, 1.0));
  return `rgba(74, 74, 90, ${alpha})`;
}

// ─── Build Sigma graph from data ─────────────────────────────────────────────

export function buildGraphFromSubgraph(
  graph: Graph,
  nodes: GraphNode[],
  edges: GraphEdge[],
  selectedId: string | null
) {
  graph.clear();

  nodes.forEach((n) => {
    const state = selectedId
      ? n.person_id === selectedId
        ? "selected"
        : n.state
      : n.state;
    graph.addNode(n.person_id, {
      label: state === "selected" || state === "direct" ? n.display_name : "",
      x: n.x || Math.random() * 1000 - 500,
      y: n.y || Math.random() * 1000 - 500,
      size: nodeSize(state, n.connection_count),
      color: nodeColor(state, n.status),
      borderColor: state === "selected" ? "#FF6B6B" : "transparent",
      // Store metadata for interaction
      _personId: n.person_id,
      _displayName: n.display_name,
      _state: state,
      _connectionCount: n.connection_count,
      _caseCount: n.case_count,
      _status: n.status,
    });
  });

  edges.forEach((e) => {
    const sourceExists = graph.hasNode(e.source);
    const targetExists = graph.hasNode(e.target);
    if (!sourceExists || !targetExists) return;
    const srcState = graph.getNodeAttribute(e.source, "_state");
    const tgtState = graph.getNodeAttribute(e.target, "_state");
    const isUnrelated = srcState === "unrelated" && tgtState === "unrelated";
    try {
      graph.addEdge(e.source, e.target, {
        size: isUnrelated ? 0.5 : Math.max(1, e.strength * 3),
        color: isUnrelated ? "#111116" : `rgba(74,74,90,${Math.max(0.15, e.strength * 0.8)})`,
        _relationshipId: e.id,
        _strength: e.strength,
        _type: e.relationship_type,
        _sources: e.source_systems,
      });
    } catch {
      // Skip duplicate edges
    }
  });
}

// ─── Build cluster overview graph ─────────────────────────────────────────────

export function buildClusterGraph(graph: Graph, clusters: ClusterSummary[]) {
  graph.clear();
  clusters.forEach((c, i) => {
    graph.addNode(c.cluster_id, {
      label: c.name,
      x: c.x,
      y: c.y,
      size: Math.sqrt(c.person_count / 50),
      color: "#2A2A3A",
      borderColor: "#3A3A5A",
      _clusterId: c.cluster_id,
      _personCount: c.person_count,
      _name: c.name,
      _isCluster: true,
    });
  });

  // Add some cluster interconnection edges for visual richness
  const clusterIds = clusters.map((c) => c.cluster_id);
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [0, 5], [1, 6],
  ];
  connections.forEach(([a, b]) => {
    if (clusterIds[a] && clusterIds[b]) {
      try {
        graph.addEdge(clusterIds[a], clusterIds[b], {
          size: 1,
          color: "#1A1A28",
        });
      } catch {}
    }
  });
}

// ─── Main graph engine hook ───────────────────────────────────────────────────

export function useGraphEngine(containerRef: React.RefObject<HTMLDivElement | null>) {
  const sigmaRef = useRef<Sigma | null>(null);
  const graphRef = useRef<Graph>(new Graph({ multi: false, allowSelfLoops: false }));
  const fa2Ref = useRef<FA2Layout | null>(null);

  const {
    mode, nodes, edges, clusters,
    setSelectedPerson, setSelectedRelationship,
    setHoveredPerson, setTooltipPos,
    setPersonPanelOpen, setRelationshipPanelOpen,
    focusContext, selectedPersonId,
  } = useGraphStore();

  // Initialize Sigma
  useEffect(() => {
    if (!containerRef.current || sigmaRef.current) return;

    const sigma = new Sigma(graphRef.current, containerRef.current, {
      renderEdgeLabels: false,
      defaultEdgeColor: "#1E1E2E",
      defaultNodeColor: "#4A4A5A",
      labelColor: { color: "#6B6B6B" },
      labelSize: 11,
      labelWeight: "500",
      labelFont: "Inter, sans-serif",
      minCameraRatio: 0.01,
      maxCameraRatio: 10,
      allowInvalidContainer: true,
    });

    sigmaRef.current = sigma;

    return () => {
      if (fa2Ref.current) {
        fa2Ref.current.stop();
        fa2Ref.current.kill();
        fa2Ref.current = null;
      }
      sigma.kill();
      sigmaRef.current = null;
    };
  }, [containerRef]);

  // Handle click on node
  useEffect(() => {
    const sigma = sigmaRef.current;
    if (!sigma) return;

    const onNodeClick = (e: { node: string }) => {
      const isCluster = graphRef.current.getNodeAttribute(e.node, "_isCluster");
      if (isCluster) return;
      setSelectedPerson(e.node);
      setSelectedRelationship(null);
      setPersonPanelOpen(true);
      setRelationshipPanelOpen(false);
    };

    const onEdgeClick = (e: { edge: string }) => {
      const relId = graphRef.current.getEdgeAttribute(e.edge, "_relationshipId");
      if (relId) {
        setSelectedRelationship(relId);
        setSelectedPerson(null);
        setRelationshipPanelOpen(true);
        setPersonPanelOpen(false);
      }
    };

    const onNodeHover = (e: { node: string; event: { x: number; y: number } }) => {
      const name = graphRef.current.getNodeAttribute(e.node, "_displayName");
      const isCluster = graphRef.current.getNodeAttribute(e.node, "_isCluster");
      if (isCluster) return;
      setHoveredPerson(e.node);
      setTooltipPos({ x: e.event.x + 12, y: e.event.y - 10 });
      containerRef.current && (containerRef.current.style.cursor = "pointer");
    };

    const onNodeOut = () => {
      setHoveredPerson(null);
      setTooltipPos(null);
      containerRef.current && (containerRef.current.style.cursor = "default");
    };

    sigma.on("clickNode", onNodeClick);
    sigma.on("clickEdge", onEdgeClick);
    sigma.on("enterNode", onNodeHover);
    sigma.on("leaveNode", onNodeOut);

    return () => {
      sigma.off("clickNode", onNodeClick);
      sigma.off("clickEdge", onEdgeClick);
      sigma.off("enterNode", onNodeHover);
      sigma.off("leaveNode", onNodeOut);
    };
  }, [sigmaRef.current]);

  // Rebuild graph when data changes
  useEffect(() => {
    const sigma = sigmaRef.current;
    if (!sigma) return;

    if (mode === "GLOBAL") {
      buildClusterGraph(graphRef.current, clusters);
    } else if (nodes.length > 0) {
      buildGraphFromSubgraph(graphRef.current, nodes, edges, selectedPersonId);
    }

    sigma.refresh();
  }, [mode, nodes, edges, clusters, selectedPersonId]);

  // Camera animation to focus person
  const zoomToPerson = useCallback((x: number, y: number, zoom = 0.4) => {
    const sigma = sigmaRef.current;
    if (!sigma) return;
    sigma.getCamera().animate(
      { x: x / 1000, y: -y / 1000, ratio: zoom },
      { duration: 800, easing: "cubicInOut" }
    );
  }, []);

  const resetCamera = useCallback(() => {
    const sigma = sigmaRef.current;
    if (!sigma) return;
    sigma.getCamera().animate({ x: 0.5, y: 0.5, ratio: 1 }, { duration: 600 });
  }, []);

  const zoomToClusterThenPerson = useCallback(
    (clusterX: number, clusterY: number, personX: number, personY: number) => {
      const sigma = sigmaRef.current;
      if (!sigma) return;

      // Step 1: zoom to cluster
      sigma.getCamera().animate(
        { x: clusterX / 1000 + 0.5, y: -clusterY / 1000 + 0.5, ratio: 0.6 },
        { duration: 600, easing: "cubicInOut" }
      );

      // Step 2: after cluster zoom, zoom to person
      setTimeout(() => {
        sigma.getCamera().animate(
          { x: personX / 1000 + 0.5, y: -personY / 1000 + 0.5, ratio: 0.2 },
          { duration: 700, easing: "cubicInOut" }
        );
      }, 700);
    },
    []
  );

  return {
    sigma: sigmaRef.current,
    graph: graphRef.current,
    zoomToPerson,
    resetCamera,
    zoomToClusterThenPerson,
  };
}
