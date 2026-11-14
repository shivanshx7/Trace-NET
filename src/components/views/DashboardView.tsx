import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  RotateCcw, 
  ShieldAlert, 
  Server, 
  Database, 
  FileText, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Sparkles,
  ExternalLink,
  Terminal,
  ChevronRight,
  ShieldCheck,
  Radio,
  Eye,
  Activity,
  Globe,
  Lock,
  Cpu
} from 'lucide-react';
import { ThreatActor, ContainerStatus, ActorLinkage, NavSection, InfrastructureItem } from '../../types';
import { MISCONFIG_MODULES } from '../../data/misconfigModules';
import { GraphVisualization } from '../ui/GraphVisualization';

interface DashboardViewProps {
  containers: ContainerStatus[];
  actors: ThreatActor[];
  infrastructure?: InfrastructureItem[];
  linkages: ActorLinkage[];
  onStartLab: () => void;
  onStopLab: () => void;
  onResetLab: () => void;
  isLabOperating: boolean;
  onNavigateSection: (section: NavSection) => void;
  onSelectModule: (moduleId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  containers,
  actors,
  infrastructure = [],
  linkages,
  onStartLab,
  onStopLab,
  onResetLab,
  isLabOperating,
  onNavigateSection,
  onSelectModule
}) => {
  const isRunning = containers.some(c => c.status === 'running');
  const activeContainersCount = containers.filter(c => c.status === 'running').length;
  const averageMatchStrength = Math.round(actors.reduce((acc, a) => acc + a.confidenceScore, 0) / (actors.length || 1));
  const [activePillModal, setActivePillModal] = useState<'hacker' | 'laptop' | null>(null);

  return (
    <div className="p-6 md:p-12 space-y-16 max-w-7xl mx-auto bg-[#090A0D] text-[#EDEDED] font-sans">
      {/* Editorial Hero Section (Inspired by Reference Screenshot) */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex flex-col justify-between pt-6 pb-4 select-none">
        {/* Top Space / Ambient Gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF3E11]/[0.03] blur-[120px] pointer-events-none" />

        {/* Massive Editorial Headline with Inline Media Capsules */}
        <div className="space-y-2 lg:space-y-4 max-w-6xl">
          {/* Line 1: I DESIGN [PILL 1] or WE UNMASK [PILL 1] */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-4xl sm:text-6xl md:text-7xl lg:text-[86px] font-black uppercase tracking-tight leading-[0.95] text-white">
            <span>WE UNMASK</span>
            {/* Inline Pill Capsule 1: Darknet Cyber Portrait / Radar Visual */}
            <div 
              onClick={() => setActivePillModal('hacker')}
              className="inline-flex items-center justify-center w-28 sm:w-36 md:w-44 lg:w-52 h-10 sm:h-14 md:h-16 lg:h-20 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-900 border border-white/25 overflow-hidden shadow-2xl relative cursor-pointer group hover:border-[#FF3E11] transition-all hover:scale-105"
              title="Click to view Darknet Operator Intelligence Dossier"
            >
              {/* Grayscale Cyber Operator Visual */}
              <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                {/* SVG Cyber Stylized Face / Goggles Silhouette */}
                <svg viewBox="0 0 160 60" className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity">
                  <defs>
                    <linearGradient id="grad-pill1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2c2d30" />
                      <stop offset="100%" stopColor="#121316" />
                    </linearGradient>
                  </defs>
                  <rect width="160" height="60" fill="url(#grad-pill1)" />
                  {/* Cyber Goggles / Lens Reflection */}
                  <ellipse cx="65" cy="30" rx="14" ry="11" fill="#000000" stroke="#EDEDED" strokeWidth="2" />
                  <ellipse cx="95" cy="30" rx="14" ry="11" fill="#000000" stroke="#EDEDED" strokeWidth="2" />
                  <line x1="79" y1="30" x2="81" y2="30" stroke="#EDEDED" strokeWidth="2.5" />
                  {/* Goggle Lens Reflection Highlights */}
                  <ellipse cx="62" cy="27" rx="5" ry="3" fill="#ffffff" opacity="0.9" />
                  <ellipse cx="92" cy="27" rx="5" ry="3" fill="#ffffff" opacity="0.9" />
                  {/* Beanie silhouette */}
                  <path d="M 45 30 Q 80 8 115 30 Z" fill="#18191c" />
                  {/* Wireframe Grid */}
                  <line x1="0" y1="15" x2="160" y2="15" stroke="rgba(255,255,255,0.06)" />
                  <line x1="0" y1="45" x2="160" y2="45" stroke="rgba(255,255,255,0.06)" />
                </svg>
              </div>

              {/* Pulsing Scan Indicator */}
              <div className="absolute bottom-1 right-2.5 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded-full text-[8px] font-mono text-[#00E676] backdrop-blur-sm border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-ping" />
                <span className="hidden sm:inline font-bold">ACTOR</span>
              </div>
            </div>
          </div>

          {/* Line 2: DARKNET TARGETS / HIDDEN SERVICES */}
          <div className="text-4xl sm:text-6xl md:text-7xl lg:text-[86px] font-black uppercase tracking-tight leading-[0.95] text-white">
            HIDDEN SERVICES
          </div>

          {/* Line 3: THAT MOVE [PILL 2] PEOPLE / ONLINE */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-4xl sm:text-6xl md:text-7xl lg:text-[86px] font-black uppercase tracking-tight leading-[0.95] text-white">
            <span>THAT</span>
            {/* The Vibrant Electric Orange Accent word "MOVE" */}
            <span className="text-[#FF3E11] tracking-tight font-black">MOVE</span>
            
            {/* Inline Pill Capsule 2: Live Laptop Mockup with Darknet Forensics Canvas */}
            <div 
              onClick={() => setActivePillModal('laptop')}
              className="inline-flex items-center justify-center w-36 sm:w-44 md:w-56 lg:w-64 h-10 sm:h-14 md:h-16 lg:h-20 rounded-full bg-gradient-to-r from-zinc-800 via-neutral-900 to-stone-900 border border-white/25 overflow-hidden shadow-2xl relative cursor-pointer group hover:border-[#FF3E11] transition-all hover:scale-105"
              title="Click to view Live Deanonymization Terminal Preview"
            >
              <div className="absolute inset-0 bg-[#0e1014] flex items-center justify-center">
                {/* SVG Laptop with glowing radar / cybergraph on screen */}
                <svg viewBox="0 0 180 60" className="w-full h-full object-cover">
                  {/* Laptop Base */}
                  <rect x="25" y="10" width="130" height="42" rx="4" fill="#181a1f" stroke="#333842" strokeWidth="1.5" />
                  {/* Laptop Screen Area */}
                  <rect x="30" y="14" width="120" height="34" rx="2" fill="#090b0e" />
                  {/* Screen Content: Radar grid & wave */}
                  <circle cx="90" cy="31" r="12" fill="none" stroke="#FF3E11" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx="90" cy="31" r="6" fill="#FF3E11" fillOpacity="0.3" />
                  <line x1="40" y1="31" x2="140" y2="31" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                  <line x1="90" y1="16" x2="90" y2="46" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                  {/* Leaked IP nodes on laptop screen */}
                  <circle cx="110" cy="24" r="2" fill="#00E676" />
                  <circle cx="72" cy="38" r="2" fill="#00E5FF" />
                  {/* Laptop keyboard lip */}
                  <path d="M 20 52 L 160 52 L 150 56 L 30 56 Z" fill="#252830" stroke="#333842" strokeWidth="1" />
                </svg>
              </div>

              {/* Pill Overlay Label */}
              <div className="absolute bottom-1 right-2.5 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded-full text-[8px] font-mono text-[#FF3E11] backdrop-blur-sm border border-white/10">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                <span className="hidden sm:inline font-bold">RADAR</span>
              </div>
            </div>

            <span className="text-white">ONLINE</span>
          </div>
        </div>

        {/* Hero Bottom Meta Row: Editorial Description + Scroll Cue */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-12 items-end">
          {/* Left: Refined Editorial Paragraph */}
          <div className="md:col-span-8 space-y-4">
            <p className="text-sm sm:text-base text-[#8A8F99] leading-relaxed max-w-2xl font-sans">
              TraceNet is a multi-layered forensic intelligence suite for Tor hidden services. We detect server misconfigurations, correlate cryptographic artifacts across clearnet infrastructure, and de-anonymize dark web operators in real-time.
            </p>
            {/* Quick Action Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onNavigateSection('demos');
                  onSelectModule('server-status');
                }}
                className="px-6 py-2.5 bg-white text-black font-bold text-xs rounded-full hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10"
              >
                <span>Launch Interactive Demos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {!isRunning ? (
                <button
                  onClick={onStartLab}
                  disabled={isLabOperating}
                  className="px-5 py-2.5 bg-[#FF3E11] hover:bg-[#FF552B] text-white font-bold text-xs rounded-full transition-all flex items-center gap-2 shadow-lg shadow-[#FF3E11]/20 disabled:opacity-50"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start 3-Node Docker Lab</span>
                </button>
              ) : (
                <button
                  onClick={onStopLab}
                  disabled={isLabOperating}
                  className="px-5 py-2.5 bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs rounded-full transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop Active Lab</span>
                </button>
              )}

              <button
                onClick={() => onNavigateSection('actors')}
                className="px-4 py-2.5 text-xs text-white/80 hover:text-white font-semibold rounded-full border border-white/15 hover:border-white/30 transition-all"
              >
                <span>Explore 4 Actor Dossiers</span>
              </button>
            </div>
          </div>

          {/* Right: Minimalist Status & Scroll Indicator */}
          <div className="md:col-span-4 flex md:justify-end items-center gap-3 text-xs font-mono tracking-wider text-[#8A8F99]">
            <span className="w-2 h-2 rounded-full bg-[#FF3E11] animate-pulse" />
            <span className="uppercase text-white/80 font-bold">LIVE TELEMETRY ACTIVE</span>
          </div>
        </div>
      </section>

      {/* 4 Minimalist Dark Metric Tiles */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Lab Status */}
        <div className="p-6 rounded-2xl bg-[#111317] border border-white/[0.08] flex flex-col justify-between space-y-4 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8A8F99] font-mono uppercase tracking-wider">
            <span>CONTAINER LAB</span>
            <Server className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">
              {activeContainersCount} <span className="text-sm font-normal text-[#8A8F99]">/ 3</span>
            </div>
            <div className="text-xs text-white/60 mt-1 font-mono">
              onion1, onion2, clearnet-spoof
            </div>
          </div>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-[#8A8F99]">Network State</span>
            <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
              isRunning ? 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30' : 'bg-white/5 text-white/60'
            }`}>
              {isRunning ? 'ISOLATED & ACTIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* 7 Vulnerability Techniques */}
        <div className="p-6 rounded-2xl bg-[#111317] border border-white/[0.08] flex flex-col justify-between space-y-4 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8A8F99] font-mono uppercase tracking-wider">
            <span>VULNERABILITY DEMOS</span>
            <Flame className="w-4 h-4 text-[#FF3E11]" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">7 <span className="text-sm font-normal text-[#8A8F99]">/ 7</span></div>
            <div className="text-xs text-white/60 mt-1">
              Live automated probe tests
            </div>
          </div>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-[#8A8F99]">Exploitation Suite</span>
            <span className="font-bold px-2.5 py-0.5 rounded-full text-[10px] bg-[#FF3E11]/15 text-[#FF3E11] border border-[#FF3E11]/30">
              INTERACTIVE
            </span>
          </div>
        </div>

        {/* Profiled Actors */}
        <div className="p-6 rounded-2xl bg-[#111317] border border-white/[0.08] flex flex-col justify-between space-y-4 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8A8F99] font-mono uppercase tracking-wider">
            <span>THREAT DOSSIERS</span>
            <Database className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{actors.length}</div>
            <div className="text-xs text-white/60 mt-1">
              SQLite indexed actor entities
            </div>
          </div>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-[#8A8F99]">Cryptographic Keys</span>
            <span className="font-bold px-2.5 py-0.5 rounded-full text-[10px] bg-white/10 text-white">
              VERIFIED
            </span>
          </div>
        </div>

        {/* Match Strength */}
        <div className="p-6 rounded-2xl bg-[#111317] border border-white/[0.08] flex flex-col justify-between space-y-4 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8A8F99] font-mono uppercase tracking-wider">
            <span>FORENSIC CONFIDENCE</span>
            <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{averageMatchStrength}%</div>
            <div className="text-xs text-white/60 mt-1">
              Cross-network linkage score
            </div>
          </div>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-[#8A8F99]">Attribution Rating</span>
            <span className="font-bold px-2.5 py-0.5 rounded-full text-[10px] bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
              HIGH ACCURACY
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Deanonymization Co-Location Graph */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
              Deanonymization Graph &amp; Infrastructure Linkage
            </h2>
            <p className="text-xs text-[#8A8F99] mt-0.5">
              Live visualization of Tor onion nodes, leaked clearnet IP addresses, TLS certificates, and real-world operator aliases.
            </p>
          </div>
          <button
            onClick={() => onNavigateSection('actors')}
            className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold rounded-full border border-white/[0.1] transition-all self-start sm:self-auto"
          >
            Manage Graph Entities &rarr;
          </button>
        </div>

        <div className="h-[460px] w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#111317]">
          <GraphVisualization
            actors={actors}
            infrastructure={infrastructure}
            linkages={linkages}
            onSelectActor={() => onNavigateSection('actors')}
          />
        </div>
      </section>

      {/* 7 Deanonymization Techniques Grid + Dossier Intelligence Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: 7 Misconfiguration Modules */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h3 className="text-lg font-bold uppercase tracking-tight text-white">
              7 Deanonymization Misconfigurations
            </h3>
            <button
              onClick={() => onNavigateSection('demos')}
              className="text-xs text-[#FF3E11] hover:text-[#FF552B] font-bold tracking-wide"
            >
              RUN FULL AUDIT SUITE &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MISCONFIG_MODULES.map(mod => (
              <div
                key={mod.id}
                onClick={() => {
                  onNavigateSection('demos');
                  onSelectModule(mod.id);
                }}
                className="p-5 rounded-2xl bg-[#111317] hover:bg-[#161920] border border-white/[0.08] hover:border-[#FF3E11]/50 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs font-bold font-mono">
                      {mod.number}
                    </span>
                    <span className="font-bold text-sm text-white group-hover:text-[#FF3E11] transition-colors">
                      {mod.title}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                    mod.severity === 'CRITICAL' ? 'bg-[#FF3E11]/20 text-[#FF3E11] border border-[#FF3E11]/40' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}>
                    {mod.severity}
                  </span>
                </div>

                <p className="text-xs text-[#8A8F99] leading-relaxed line-clamp-2">
                  {mod.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-[#8A8F99] border-t border-white/[0.06] font-mono">
                  <span>{mod.mitreId}</span>
                  <span className="text-white font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Test Exploit</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#FF3E11]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Actor Intelligence Dossiers */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h3 className="text-lg font-bold uppercase tracking-tight text-white">
              Target Dossiers
            </h3>
            <button
              onClick={() => onNavigateSection('actors')}
              className="text-xs text-white/60 hover:text-white font-mono"
            >
              ALL ({actors.length}) &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {actors.slice(0, 3).map(actor => (
              <div
                key={actor.id}
                onClick={() => onNavigateSection('actors')}
                className="p-4 rounded-2xl bg-[#111317] hover:bg-[#161920] border border-white/[0.08] hover:border-white/20 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-xs">
                      {actor.handle.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-[#FF3E11] transition-colors">
                        {actor.handle}
                      </div>
                      <div className="text-[11px] text-[#8A8F99]">
                        {actor.category}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30 font-mono">
                    {actor.confidenceScore}%
                  </span>
                </div>

                <div className="text-xs text-white/90 pt-1">
                  Unmasked Alias: <strong className="text-white font-mono">{actor.realNameCandidate || 'In Progress'}</strong>
                </div>

                <div className="text-[11px] text-[#8A8F99] font-mono flex items-center justify-between pt-1 border-t border-white/[0.06]">
                  <span>{actor.locationCandidate}</span>
                  <span className="text-[#00E5FF]">{(actor.infrastructureIds?.length || infrastructure.filter(i => i.actorId === actor.id).length || 0)} Onion Services</span>
                </div>
              </div>
            ))}
          </div>

          {/* Evidence Linkages Card */}
          <div className="p-5 rounded-2xl bg-[#111317] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                Evidence Linkages
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF3E11]/15 text-[#FF3E11]">
                {linkages.length} CORRELATED
              </span>
            </div>

            <div className="space-y-2">
              {linkages.map(lnk => (
                <div key={lnk.id} className="p-3 rounded-xl bg-black/40 border border-white/[0.04] space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono font-bold text-white">
                    <span>{lnk.sourceActorHandle}</span>
                    <span className="text-[#FF3E11]">&harr;</span>
                    <span>{lnk.targetActorHandle}</span>
                  </div>
                  <p className="text-[11px] text-[#8A8F99] line-clamp-2 leading-relaxed">
                    {lnk.evidence}
                  </p>
                  <div className="text-[10px] text-white/60 pt-1 flex items-center justify-between font-mono">
                    <span>{lnk.linkageType.replace(/_/g, ' ')}</span>
                    <span className="text-[#00E676] font-bold">{lnk.confidence}% Match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal When Clicking Pill 1 (Cyber Operator Dossier Preview) */}
      {activePillModal === 'hacker' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#111317] border border-white/20 rounded-2xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3E11] animate-ping" />
                <h3 className="font-bold text-base text-white uppercase tracking-wider">
                  Threat Actor Signature Breakdown
                </h3>
              </div>
              <button 
                onClick={() => setActivePillModal(null)}
                className="text-white/60 hover:text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-[#8A8F99] leading-relaxed">
                TraceNet matches darknet aliases to real-world identities by extracting cryptographic SSH public keys, PGP key signatures, Bitcoin wallet reuse patterns, and server timezone metadata.
              </p>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 font-mono space-y-1.5">
                <div className="text-[#00E5FF] font-bold">Primary Target: ShadowBroker_X</div>
                <div className="text-white/80">Identified Real Name: Alexei Voronov</div>
                <div className="text-white/80">Physical Location: Sofia, Bulgaria (EET UTC+2)</div>
                <div className="text-[#FF3E11]">Fingerprint: ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...</div>
                <div className="text-[#00E676] font-bold">Match Strength: 94%</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setActivePillModal(null);
                  onNavigateSection('actors');
                }}
                className="px-5 py-2 bg-white text-black font-bold text-xs rounded-full hover:bg-neutral-200 transition-all"
              >
                View Full Actor Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal When Clicking Pill 2 (Live Radar Terminal Preview) */}
      {activePillModal === 'laptop' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#111317] border border-white/20 rounded-2xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#FF3E11] animate-pulse" />
                <h3 className="font-bold text-base text-white uppercase tracking-wider">
                  Live Deanonymization Radar Engine
                </h3>
              </div>
              <button 
                onClick={() => setActivePillModal(null)}
                className="text-white/60 hover:text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <p className="text-[#8A8F99] leading-relaxed font-sans">
                Real-time correlation pipeline scanning for misconfigured Tor hidden services leaking Apache server-status pages, SSL certificates, and custom error pages.
              </p>

              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1 text-white/90">
                <div className="text-[#00E676]">&gt; Probing onion1 (4v89q3...onion:80)</div>
                <div className="text-white/70">&gt; GET /server-status -&gt; 200 OK (UNPROTECTED)</div>
                <div className="text-[#FF3E11] font-bold">&gt; Leaked Server IP: 185.220.101.45 (AS48219)</div>
                <div className="text-[#00E5FF]">&gt; Discovered Linked Clearnet Host: silk-backup.net</div>
                <div className="text-white/80">&gt; Attribution Confidence: 96% (CRITICAL)</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setActivePillModal(null);
                  onNavigateSection('demos');
                }}
                className="px-5 py-2 bg-[#FF3E11] hover:bg-[#FF552B] text-white font-bold text-xs rounded-full transition-all"
              >
                Launch Live Exploit Probes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


