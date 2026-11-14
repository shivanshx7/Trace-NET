import React, { useState, useEffect, useRef } from 'react';
import { ThreatActor, InfrastructureItem, ActorLinkage } from '../../types';
import { Shield, Server, Globe, Key, AlertCircle, Link2, Info } from 'lucide-react';

interface GraphVisualizationProps {
  actors?: ThreatActor[];
  infrastructure?: InfrastructureItem[];
  linkages?: ActorLinkage[];
  onSelectActor?: (actor: ThreatActor) => void;
}

interface GraphNode {
  id: string;
  label: string;
  type: 'actor' | 'onion' | 'clearnet' | 'key' | 'tracker';
  category?: string;
  confidence?: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  data: any;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  confidence: number;
  type: string;
}

export const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  actors = [],
  infrastructure = [],
  linkages = [],
  onSelectActor
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  // Generate Graph Model from actors, infrastructure, and linkages
  useEffect(() => {
    const safeActors = actors || [];
    const safeInf = infrastructure || [];
    const safeLinkages = linkages || [];

    const newNodes: GraphNode[] = [];
    const newEdges: GraphEdge[] = [];

    // 1. Add Actors
    const width = 800;
    const height = 520;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 220;

    safeActors.forEach((act, idx) => {
      const angle = (idx / (safeActors.length || 1)) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      newNodes.push({
        id: act.id,
        label: act.handle,
        type: 'actor',
        category: act.category,
        confidence: act.confidenceScore,
        x,
        y,
        vx: 0,
        vy: 0,
        data: act
      });
    });

    // 2. Add Infrastructure (Onion + Clearnet nodes)
    safeInf.forEach((inf, idx) => {
      const parentActor = safeActors.find(a => a.id === inf.actorId);
      const parentX = parentActor ? newNodes.find(n => n.id === parentActor.id)?.x || centerX : centerX;
      const parentY = parentActor ? newNodes.find(n => n.id === parentActor.id)?.y || centerY : centerY;

      // Onion Node
      const onionId = `onion-${inf.id}`;
      const onionOffsetAngle = idx * 1.2;
      newNodes.push({
        id: onionId,
        label: inf.onionAddress.slice(0, 14) + '...',
        type: 'onion',
        confidence: 90,
        x: parentX + Math.cos(onionOffsetAngle) * 70,
        y: parentY + Math.sin(onionOffsetAngle) * 70,
        vx: 0,
        vy: 0,
        data: inf
      });

      // Edge Actor -> Onion
      newEdges.push({
        id: `e-${inf.actorId}-${onionId}`,
        source: inf.actorId,
        target: onionId,
        label: 'HOSTS_ONION',
        confidence: 95,
        type: 'HOSTS'
      });

      // Clearnet Node (if leaked)
      if (inf.clearnetDomain || inf.ipAddress) {
        const clearId = `clear-${inf.id}`;
        newNodes.push({
          id: clearId,
          label: inf.clearnetDomain || inf.ipAddress,
          type: 'clearnet',
          confidence: 98,
          x: parentX + Math.cos(onionOffsetAngle + 0.8) * 110,
          y: parentY + Math.sin(onionOffsetAngle + 0.8) * 110,
          vx: 0,
          vy: 0,
          data: inf
        });

        // Edge Onion -> Clearnet (The Deanonymization Leak Edge!)
        newEdges.push({
          id: `e-leak-${onionId}-${clearId}`,
          source: onionId,
          target: clearId,
          label: 'DEANONYMIZATION_LEAK',
          confidence: 98,
          type: 'DEANONYMIZED_TO'
        });
      }
    });

    // 3. Add Explicit Cross-Actor Linkages
    safeLinkages.forEach((lnk) => {
      newEdges.push({
        id: lnk.id,
        source: lnk.sourceActorId,
        target: lnk.targetActorId,
        label: lnk.linkageType,
        confidence: lnk.confidence,
        type: lnk.linkageType
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [actors, infrastructure, linkages]);

  // Handle Dragging
  const handleMouseDown = (nodeId: string) => {
    setDraggingNodeId(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setSelectedEdge(null);
      if (node.type === 'actor' && onSelectActor) {
        onSelectActor(node.data);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingNodeId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes(prev => prev.map(n => {
      if (n.id === draggingNodeId) {
        return { ...n, x: Math.max(30, Math.min(rect.width - 30, x)), y: Math.max(30, Math.min(rect.height - 30, y)) };
      }
      return n;
    }));
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const filteredNodes = nodes.filter(n => {
    if (filterType === 'ALL') return true;
    if (filterType === 'ACTORS') return n.type === 'actor';
    if (filterType === 'LEAKS') return n.type === 'clearnet' || n.type === 'onion';
    return true;
  });

  const nodeColors: Record<string, { bg: string; border: string; glow: string; text: string }> = {
    actor: { bg: '#8b5cf6', border: '#a78bfa', glow: 'rgba(139, 92, 246, 0.4)', text: '#ffffff' },
    onion: { bg: '#0284c7', border: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)', text: '#ffffff' },
    clearnet: { bg: '#e11d48', border: '#fb7185', glow: 'rgba(244, 63, 94, 0.4)', text: '#ffffff' },
    key: { bg: '#d97706', border: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)', text: '#ffffff' },
    tracker: { bg: '#059669', border: '#34d399', glow: 'rgba(52, 211, 153, 0.4)', text: '#ffffff' }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-black/15 rounded-2xl border border-white/20 backdrop-blur-md overflow-hidden select-none shadow-xl" ref={containerRef}>
      {/* Graph Toolbar */}
      <div className="h-12 bg-black/30 border-b border-white/10 px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-white" />
          <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Deanonymization Relationship &amp; Co-Location Graph
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 text-[11px] font-mono">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-full transition-all text-xs font-bold ${filterType === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              All Nodes ({nodes.length})
            </button>
            <button
              onClick={() => setFilterType('ACTORS')}
              className={`px-3 py-1 rounded-full transition-all text-xs font-bold ${filterType === 'ACTORS' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              Actors ({actors.length})
            </button>
            <button
              onClick={() => setFilterType('LEAKS')}
              className={`px-3 py-1 rounded-full transition-all text-xs font-bold ${filterType === 'LEAKS' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              Deanonymized Pairs
            </button>
          </div>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="flex-1 relative overflow-hidden bg-black/20">
        <svg
          className="w-full h-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Subtle Cyber Grid */}
          <defs>
            <pattern id="graph-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#graph-grid)" />

          {/* Edges */}
          <g>
            {edges.map(edge => {
              const srcNode = nodes.find(n => n.id === edge.source);
              const tgtNode = nodes.find(n => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const isLeak = edge.type === 'DEANONYMIZED_TO' || edge.label === 'DEANONYMIZATION_LEAK';
              const isSelected = selectedEdge?.id === edge.id;

              const strokeColor = isLeak ? '#f43f5e' : edge.type === 'KEY_REUSE' ? '#f59e0b' : '#38bdf8';
              const strokeDash = isLeak ? '4,4' : undefined;

              const midX = (srcNode.x + tgtNode.x) / 2;
              const midY = (srcNode.y + tgtNode.y) / 2;

              return (
                <g key={edge.id} className="cursor-pointer" onClick={() => { setSelectedEdge(edge); setSelectedNode(null); }}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 3 : isLeak ? 2 : 1.5}
                    strokeDasharray={strokeDash}
                    strokeOpacity={0.75}
                    className="hover:stroke-opacity-100 transition-all"
                  />
                  {/* Small link badge */}
                  <rect
                    x={midX - 35}
                    y={midY - 8}
                    width={70}
                    height={16}
                    rx={8}
                    fill="#1E262C"
                    stroke={strokeColor}
                    strokeWidth={1}
                    strokeOpacity={0.8}
                  />
                  <text
                    x={midX}
                    y={midY + 3}
                    textAnchor="middle"
                    fill={strokeColor}
                    fontSize={9}
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {edge.type.replace('_', ' ').slice(0, 11)}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {filteredNodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const style = nodeColors[node.type] || nodeColors.actor;
              const radius = node.type === 'actor' ? 22 : node.type === 'clearnet' ? 18 : 16;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={() => handleMouseDown(node.id)}
                  className="cursor-grab active:cursor-grabbing group"
                >
                  {/* Glow circle */}
                  <circle
                    r={radius + 6}
                    fill={style.glow}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />

                  {/* Main Node Circle */}
                  <circle
                    r={radius}
                    fill={style.bg}
                    stroke={isSelected ? '#ffffff' : style.border}
                    strokeWidth={isSelected ? 3 : 2}
                    className="shadow-lg transition-transform"
                  />

                  {/* Icon or Monogram */}
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    fill="#ffffff"
                    fontSize={node.type === 'actor' ? 11 : 9}
                    fontWeight="bold"
                    fontFamily="monospace"
                    pointerEvents="none"
                  >
                    {node.type === 'actor' ? node.label.slice(0, 2).toUpperCase() : node.type === 'clearnet' ? 'IP' : '.ON'}
                  </text>

                  {/* Node Label Text */}
                  <text
                    y={radius + 14}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={10}
                    fontFamily="monospace"
                    fontWeight="600"
                    pointerEvents="none"
                    className="drop-shadow-md"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Node Details Card */}
        {selectedNode && (
          <div className="absolute top-3 right-3 w-72 bg-[#1E262C] border border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-xs font-mono animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${nodeColors[selectedNode.type]?.bg ? 'bg-cyan-400' : 'bg-slate-400'}`} />
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">{selectedNode.type} Node</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-white/60 hover:text-white font-sans"
              >
                ✕
              </button>
            </div>

            <div className="mt-2.5 space-y-1.5 text-white/90">
              <div>Label: <strong className="text-white">{selectedNode.label}</strong></div>
              {selectedNode.type === 'actor' && (
                <>
                  <div>Category: <span className="text-[#F4A261] font-bold">{selectedNode.data.category}</span></div>
                  <div>Confidence: <span className="text-[#3FB950] font-bold">{selectedNode.data.confidenceScore}%</span></div>
                  <div>Location: <span className="text-white">{selectedNode.data.locationCandidate}</span></div>
                  <div>Real ID: <span className="text-[#E76F51] font-bold">{selectedNode.data.realNameCandidate || 'Unmasked'}</span></div>
                </>
              )}
              {selectedNode.type === 'clearnet' && (
                <>
                  <div>Host / IP: <span className="text-[#E76F51] font-bold">{selectedNode.data.ipAddress || selectedNode.data.clearnetDomain}</span></div>
                  <div>Provider: <span className="text-white">{selectedNode.data.hostingProvider}</span></div>
                  <div>Country: <span className="text-white font-bold">{selectedNode.data.country}</span></div>
                  <div>Discovered: <span className="text-[#F4A261]">{selectedNode.data.discoveredVia}</span></div>
                </>
              )}
              {selectedNode.type === 'onion' && (
                <>
                  <div>Onion Service: <span className="text-white font-mono">{selectedNode.data.onionAddress}</span></div>
                  <div>Discovered Via: <span className="text-white/80">{selectedNode.data.discoveredVia}</span></div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Floating Edge Details Card */}
        {selectedEdge && (
          <div className="absolute top-3 right-3 w-72 bg-[#1E262C] border border-[#E76F51]/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-xs font-mono animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-bold text-[#E76F51] uppercase text-[11px] tracking-wider">Linkage Evidence</span>
              <button onClick={() => setSelectedEdge(null)} className="text-white/60 hover:text-white font-sans">✕</button>
            </div>
            <div className="mt-2 space-y-1.5 text-white/90">
              <div>Type: <strong className="text-[#F4A261]">{selectedEdge.type}</strong></div>
              <div>Confidence: <span className="text-[#3FB950] font-bold">{selectedEdge.confidence}%</span></div>
              <div className="text-[11px] text-white/70 leading-relaxed mt-1">
                Direct evidence cross-matched across Tor hidden service telemetry and clearnet server fingerprinting databases.
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-[#1E262C] border border-white/15 rounded-full px-4 py-2 flex items-center gap-4 text-[10px] font-mono text-white/80 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8b5cf6]" /> Actor</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#0284c7]" /> Onion Service</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#e11d48]" /> Clearnet Leak (IP)</div>
          <div className="flex items-center gap-1.5"><span className="w-4 border-t border-dashed border-rose-500" /> Deanonymization Edge</div>
        </div>
      </div>
    </div>
  );
};
