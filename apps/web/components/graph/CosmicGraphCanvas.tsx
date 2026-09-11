"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  generateCosmicGraphData,
  CosmicNode,
  CosmicEdge,
  RELATIONSHIP_COLORS,
} from "@/lib/mockGraphData";
import { useGraphStore, useFilterStore } from "@/store";

interface CosmicGraphCanvasProps {
  onNodeSelect?: (node: CosmicNode) => void;
  searchQuery?: string;
  activeHops?: number;
}

export default function CosmicGraphCanvas({
  onNodeSelect,
  searchQuery = "",
  activeHops = 2,
}: CosmicGraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    selectedPersonId,
    setSelectedPerson,
    setPersonPanelOpen,
    hoveredPersonId,
    setHoveredPerson,
  } = useGraphStore();

  const { activeTags } = useFilterStore();

  // Generate the full cosmic graph (1,885 nodes, 3,616 edges)
  const graphData = useMemo(() => generateCosmicGraphData(), []);

  // Spatial index & lookup map
  const nodesMap = useMemo(() => {
    const map = new Map<string, CosmicNode>();
    graphData.nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [graphData]);

  // Adjacency map for fast multi-hop neighborhood lookups
  const adjacencyMap = useMemo(() => {
    const adj = new Map<string, Set<string>>();
    graphData.edges.forEach((e) => {
      if (!adj.has(e.source)) adj.set(e.source, new Set());
      if (!adj.has(e.target)) adj.set(e.target, new Set());
      adj.get(e.source)!.add(e.target);
      adj.get(e.target)!.add(e.source);
    });
    return adj;
  }, [graphData]);

  // Compute active 1-hop and 2-hop neighbor sets for the selected/hovered node
  const { directNeighbors, secondHopNeighbors } = useMemo(() => {
    const targetId = hoveredPersonId || selectedPersonId;
    if (!targetId) return { directNeighbors: new Set<string>(), secondHopNeighbors: new Set<string>() };

    const dSet = adjacencyMap.get(targetId) || new Set<string>();
    const sSet = new Set<string>();

    if (activeHops >= 2) {
      dSet.forEach((neighborId) => {
        const nextNeighbors = adjacencyMap.get(neighborId);
        if (nextNeighbors) {
          nextNeighbors.forEach((nnId) => {
            if (nnId !== targetId && !dSet.has(nnId)) {
              sSet.add(nnId);
            }
          });
        }
      });
    }

    return { directNeighbors: dSet, secondHopNeighbors: sSet };
  }, [selectedPersonId, hoveredPersonId, activeHops, adjacencyMap]);

  // Camera state: default zoom 0.82 to display the entire 1,885-node cosmos like graph.jpeg
  const cameraRef = useRef({
    x: 0,
    y: 0,
    zoom: 0.82,
  });

  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const hoveredNodeRef = useRef<CosmicNode | null>(null);

  // Tooltip state
  const [tooltipData, setTooltipData] = useState<{
    node: CosmicNode;
    screenX: number;
    screenY: number;
  } | null>(null);

  // Camera helpers
  const centerOnNode = useCallback((nodeId: string) => {
    const target = nodesMap.get(nodeId);
    if (!target) return;
    cameraRef.current = {
      x: -target.x * 1.15,
      y: -target.y * 1.15,
      zoom: 1.15,
    };
  }, [nodesMap]);

  const handleZoom = useCallback((delta: number) => {
    cameraRef.current.zoom = Math.max(0.2, Math.min(6.0, cameraRef.current.zoom * delta));
  }, []);

  const resetView = useCallback(() => {
    cameraRef.current = { x: 0, y: 0, zoom: 0.82 };
  }, []);

  // Expose camera methods to window
  useEffect(() => {
    (window as any).__nexusGraphZoom = handleZoom;
    (window as any).__nexusGraphReset = resetView;
    (window as any).__nexusGraphCenter = () => centerOnNode("P-001928371");

    return () => {
      delete (window as any).__nexusGraphZoom;
      delete (window as any).__nexusGraphReset;
      delete (window as any).__nexusGraphCenter;
    };
  }, [handleZoom, resetView, centerOnNode]);

  // Search effect: if search query matches a node, center and select
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return;
    const q = searchQuery.toLowerCase().trim();
    const match = graphData.nodes.find(
      (n) => n.name.toLowerCase().includes(q) || n.code.toLowerCase().includes(q) || n.id.toLowerCase().includes(q)
    );
    if (match) {
      setSelectedPerson(match.id);
      centerOnNode(match.id);
    }
  }, [searchQuery, graphData, setSelectedPerson, centerOnNode]);

  // Primary Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const rect = container.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }

      // Reset transform and clear buffer
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Logical dimensions
      const logicalW = rect.width;
      const logicalH = rect.height;
      const cx = logicalW / 2 + cameraRef.current.x;
      const cy = logicalH / 2 + cameraRef.current.y;
      const zoom = cameraRef.current.zoom;

      // Set DPR scale, then translate to center and apply camera zoom
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(zoom, zoom);

      const activeId = hoveredNodeRef.current?.id || selectedPersonId;

      // 1. Draw Background Translucent Edges (Fine constellation mesh replicating graph.jpeg)
      ctx.lineWidth = 0.65;
      for (let i = 0; i < graphData.edges.length; i++) {
        const e = graphData.edges[i];
        const s = nodesMap.get(e.source);
        const t = nodesMap.get(e.target);
        if (!s || !t) continue;

        const isDirect = activeId && (e.source === activeId || e.target === activeId);
        const isSecondHop =
          activeHops >= 2 &&
          activeId &&
          !isDirect &&
          (directNeighbors.has(e.source) || directNeighbors.has(e.target)) &&
          (secondHopNeighbors.has(e.source) || secondHopNeighbors.has(e.target) || directNeighbors.has(e.source));

        if (isDirect || isSecondHop) {
          // Defer to pass 2
          continue;
        }

        const baseColor = e.color.startsWith("#") ? `${e.color}28` : "rgba(100, 116, 139, 0.16)";
        ctx.strokeStyle = activeId ? "rgba(255, 255, 255, 0.035)" : baseColor;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
      }

      // 2. Draw 2nd-Hop Active Edges
      if (activeId && activeHops >= 2) {
        ctx.lineWidth = 1.0;
        for (let i = 0; i < graphData.edges.length; i++) {
          const e = graphData.edges[i];
          const isDirect = e.source === activeId || e.target === activeId;
          if (isDirect) continue;

          const isSecondHop =
            (directNeighbors.has(e.source) && secondHopNeighbors.has(e.target)) ||
            (directNeighbors.has(e.target) && secondHopNeighbors.has(e.source)) ||
            (directNeighbors.has(e.source) && directNeighbors.has(e.target));

          if (isSecondHop) {
            const s = nodesMap.get(e.source);
            const t = nodesMap.get(e.target);
            if (!s || !t) continue;

            ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(t.x, t.y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw 1st-Hop Direct Active Edges (High-intensity glowing lines)
      if (activeId) {
        for (let i = 0; i < graphData.edges.length; i++) {
          const e = graphData.edges[i];
          if (e.source === activeId || e.target === activeId) {
            const s = nodesMap.get(e.source);
            const t = nodesMap.get(e.target);
            if (!s || !t) continue;

            const edgeColor =
              e.type && RELATIONSHIP_COLORS[e.type]
                ? RELATIONSHIP_COLORS[e.type]
                : "#38BDF8";

            // Glowing line
            ctx.save();
            ctx.shadowColor = edgeColor;
            ctx.shadowBlur = 10;
            ctx.strokeStyle = edgeColor;
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(t.x, t.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 4. Draw Nodes (1,885 Nodes across 92 Communities)
      for (let i = 0; i < graphData.nodes.length; i++) {
        const n = graphData.nodes[i];
        const isSelected = n.id === selectedPersonId;
        const isHovered = n.id === hoveredNodeRef.current?.id;
        const isDirect = directNeighbors.has(n.id);
        const isSecond = secondHopNeighbors.has(n.id);

        let opacity = 1.0;
        if (activeId && !isSelected && !isHovered && !isDirect && !isSecond) {
          opacity = 0.28; // Preserves gorgeous cosmos backdrop like graph.jpeg
        } else if (activeId && isSecond && !isDirect && !isSelected && !isHovered) {
          opacity = 0.75;
        }

        ctx.globalAlpha = opacity;

        // Base node circle
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fill();

        // Highlights for Active Nodes
        if (isSelected || isHovered) {
          // Selected / Hovered Node Glow Ring (Retro Terminal Green Phosphor)
          ctx.save();
          ctx.shadowColor = isSelected ? "#00FF66" : "#86EFAC";
          ctx.shadowBlur = 18;
          ctx.strokeStyle = isSelected ? "#00FF66" : "#86EFAC";
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.size + 3.5, 0, Math.PI * 2);
          ctx.stroke();

          // Subtle pulse ring for Dinesh Kumar (CRT Terminal Phosphor Aura)
          if (n.id === "P-001928371") {
            const pulse = (Math.sin(Date.now() / 250) + 1) * 2;
            ctx.strokeStyle = "rgba(0, 255, 102, 0.5)";
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.size + 7 + pulse, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        } else if (isDirect) {
          // Direct 1st-hop neighbor aura
          ctx.save();
          ctx.shadowColor = n.color;
          ctx.shadowBlur = 8;
          ctx.strokeStyle = "rgba(134, 239, 172, 0.85)";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.size + 2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Draw Labels: Show only for Selected node, Hovered node, or named 1st-hop associates when zoomed in enough
        const isNamedAssociate = n.type === "Associate" && isDirect;
        const shouldShowLabel =
          isSelected ||
          isHovered ||
          (isNamedAssociate && zoom > 0.75);

        if (shouldShowLabel && opacity > 0.3) {
          ctx.font = isSelected
            ? "bold 11px 'JetBrains Mono', monospace"
            : "600 9px 'JetBrains Mono', monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = "#D1FAD7";
          ctx.shadowColor = "rgba(0,0,0,0.95)";
          ctx.shadowBlur = 6;

          const labelY = n.y + n.size + 11;
          ctx.fillText(n.name, n.x, labelY);

          if (isSelected || isHovered || isNamedAssociate) {
            ctx.font = "400 8px 'JetBrains Mono', monospace";
            ctx.fillStyle = isSelected ? "#00FF66" : "#86EFAC";
            ctx.fillText(n.code, n.x, labelY + 10);
          }
          ctx.shadowBlur = 0;
        }
      }

      ctx.globalAlpha = 1.0;
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [graphData, nodesMap, directNeighbors, secondHopNeighbors, selectedPersonId, activeHops]);

  // Coordinate Conversion (using exact CSS client coordinates)
  const getGraphCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { graphX: 0, graphY: 0, mouseX: 0, mouseY: 0 };
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const cx = rect.width / 2 + cameraRef.current.x;
    const cy = rect.height / 2 + cameraRef.current.y;
    const zoom = cameraRef.current.zoom;

    const graphX = (mouseX - cx) / zoom;
    const graphY = (mouseY - cy) / zoom;

    return { graphX, graphY, mouseX, mouseY };
  };

  const findNodeAt = (graphX: number, graphY: number): CosmicNode | null => {
    for (let i = graphData.nodes.length - 1; i >= 0; i--) {
      const n = graphData.nodes[i];
      const hitRadius = Math.max(n.size + 4, 9);
      const dx = n.x - graphX;
      const dy = n.y - graphY;
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        return n;
      }
    }
    return null;
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      cameraRef.current.x += dx;
      cameraRef.current.y += dy;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      setTooltipData(null);
      return;
    }

    const { graphX, graphY, mouseX, mouseY } = getGraphCoordinates(
      e.clientX,
      e.clientY
    );
    const node = findNodeAt(graphX, graphY);

    if (node) {
      hoveredNodeRef.current = node;
      setHoveredPerson(node.id);
      setTooltipData({
        node,
        screenX: mouseX + 16,
        screenY: mouseY - 20,
      });
    } else {
      if (hoveredNodeRef.current) {
        hoveredNodeRef.current = null;
        setHoveredPerson(null);
        setTooltipData(null);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // Detect click vs drag
    const dx = Math.abs(e.clientX - lastMousePosRef.current.x);
    const dy = Math.abs(e.clientY - lastMousePosRef.current.y);

    if (dx < 4 && dy < 4) {
      const { graphX, graphY } = getGraphCoordinates(e.clientX, e.clientY);
      const clicked = findNodeAt(graphX, graphY);
      if (clicked) {
        setSelectedPerson(clicked.id);
        setPersonPanelOpen(true);
        if (onNodeSelect) onNodeSelect(clicked);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    handleZoom(zoomFactor);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-[#020502] cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Sleek Tooltip in Retro CRT Terminal Style */}
      {tooltipData && (
        <div
          className="absolute z-30 pointer-events-none nexus-panel p-3 rounded border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.25)] text-xs backdrop-blur-md min-w-[210px] bg-[#040E06]/98 font-mono"
          style={{
            left: `${Math.min(window.innerWidth - 300, tooltipData.screenX)}px`,
            top: `${Math.min(window.innerHeight - 200, tooltipData.screenY)}px`,
          }}
        >
          <div className="text-[10px] uppercase font-mono tracking-wider text-green-400 font-semibold mb-1 pb-1 border-b border-green-900/50">
            NODE INFO [RECORD]
          </div>
          <div className="font-bold text-[#D1FAD7] text-sm">
            {tooltipData.node.name}
          </div>
          <div className="font-mono text-[11px] text-green-400 mt-0.5">
            {tooltipData.node.code}
          </div>
          <div className="mt-2 space-y-1 text-emerald-300 text-[11px]">
            <div className="flex justify-between">
              <span className="text-emerald-600">Type:</span>
              <span>{tooltipData.node.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-600">Community:</span>
              <span className="font-mono text-green-400">{tooltipData.node.communityName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-600">Connections:</span>
              <span className="font-mono font-semibold text-[#D1FAD7]">{tooltipData.node.degree}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-600">Cases:</span>
              <span className="font-mono text-[#FFB000]">{tooltipData.node.cases}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-600">Source:</span>
              <span className="text-green-300">{tooltipData.node.source}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
