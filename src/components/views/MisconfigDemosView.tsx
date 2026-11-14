import React, { useState } from 'react';
import { 
  Flame, 
  Play, 
  ShieldAlert, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  AlertTriangle, 
  Server, 
  Radio, 
  Network, 
  ExternalLink, 
  KeyRound, 
  Clock, 
  Code2, 
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MISCONFIG_MODULES } from '../../data/misconfigModules';
import { useToast } from '../ui/Toast';

interface MisconfigDemosViewProps {
  selectedModuleId: string;
  onSelectModule: (id: string) => void;
}

export const MisconfigDemosView: React.FC<MisconfigDemosViewProps> = ({
  selectedModuleId,
  onSelectModule
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'live-demo' | 'overview' | 'exploit' | 'mitigation'>('live-demo');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const currentModule = MISCONFIG_MODULES.find(m => m.id === selectedModuleId) || MISCONFIG_MODULES[0];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult(currentModule.sampleTargets[0]?.simulatedData || {});
      setIsAnalyzing(false);
      showToast('success', 'Test Completed', `Gathered findings for ${currentModule.title}`);
    }, 700);
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('info', 'Code Copied', 'Fix snippet copied to clipboard');
  };

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Module Selector Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {MISCONFIG_MODULES.map(m => {
          const isSelected = m.id === currentModule.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                onSelectModule(m.id);
                setAnalysisResult(null);
              }}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
                isSelected
                  ? 'bg-white text-black shadow-lg shadow-white/5'
                  : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                isSelected ? 'bg-black text-white font-bold' : 'bg-white/10 text-white/80'
              }`}>
                {m.number}
              </span>
              <span>{m.title}</span>
            </button>
          );
        })}
      </div>

      {/* Module Main Card */}
      <div className="rounded-2xl bg-[#111317] border border-white/[0.08] backdrop-blur-md overflow-hidden shadow-2xl">
        {/* Module Header */}
        <div className="p-6 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.1] text-white font-mono uppercase tracking-wider">
                Module 0{currentModule.number}
              </span>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {currentModule.title}
              </h1>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                currentModule.severity === 'CRITICAL' ? 'bg-[#FF3E11]/15 text-[#FF3E11] border border-[#FF3E11]/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}>
                {currentModule.severity}
              </span>
            </div>
            <p className="text-xs text-white/50">
              {currentModule.subtitle} &bull; <span className="text-white/80 font-mono font-medium">MITRE: {currentModule.mitreId}</span> ({currentModule.mitreTactic})
            </p>
          </div>

          {/* Sub-Tab Navigation Pills */}
          <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-full p-1 text-xs">
            <button
              onClick={() => setActiveTab('live-demo')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                activeTab === 'live-demo' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              Interactive Test
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                activeTab === 'overview' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => setActiveTab('exploit')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                activeTab === 'exploit' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              Deanonymization Flow
            </button>
            <button
              onClick={() => setActiveTab('mitigation')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                activeTab === 'mitigation' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              How to Fix
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Test */}
        {activeTab === 'live-demo' && (
          <div className="p-6 space-y-5">
            {/* Target Selector & Run Trigger */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Target Hidden Service:</div>
                <div className="text-sm font-mono font-bold text-white select-all">
                  {currentModule.sampleTargets[0]?.onion || 'http://darkv5x34a5d89hqlk2j891klz90amc98a.onion'}
                </div>
                <div className="text-[11px] text-white/50">
                  Sample Target: <span className="text-white/80">{currentModule.sampleTargets[0]?.name}</span>
                </div>
              </div>

              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#FF3E11] hover:bg-[#FF3E11]/90 text-white rounded-full font-bold transition-all text-xs shadow-lg shadow-[#FF3E11]/20 disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Testing Target...' : 'Run Test'}</span>
              </button>
            </div>

            {/* Results Container */}
            {analysisResult ? (
              <div className="space-y-4">
                {/* 1. Exposed Server-Status */}
                {currentModule.id === 'server-status' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#F85149]" />
                        <span className="font-semibold">Exposed Apache /server-status page detected</span>
                      </div>
                      <span className="text-xs font-semibold text-[#58A6FF]">
                        Match Strength: {analysisResult.correlationConfidence}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Leaked Server Details */}
                      <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-2">
                        <div className="text-[#58A6FF] font-semibold text-xs">[+] Discovered Server Clues:</div>
                        <div>Leaked Server IP: <strong className="text-[#F85149] font-mono">{analysisResult.leakedIpAddresses?.join(', ')}</strong></div>
                        <div>Server Company: <span className="text-[#C9D1D9]">{analysisResult.hostingProvider}</span></div>
                        <div>Server Version: <span className="text-[#C9D1D9] font-mono">{analysisResult.serverVersion}</span></div>
                        <div>Server Built: <span className="text-[#8B949E]">{analysisResult.serverBuilt}</span></div>
                        <div>Local Server Time: <span className="text-[#D29922] font-mono">{analysisResult.currentLocalTime}</span></div>
                      </div>

                      {/* Leaked Website Names */}
                      <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-2">
                        <div className="text-[#58A6FF] font-semibold text-xs">[+] Discovered Website Names (VHosts):</div>
                        <ul className="space-y-1.5 pl-1">
                          {analysisResult.leakedVhosts?.map((vh: string, i: number) => (
                            <li key={i} className="text-[#C9D1D9] flex items-center gap-2">
                              <span className="text-[#58A6FF]">&bull;</span>
                              <span className={vh.includes('.onion') ? 'text-[#8B949E] font-mono' : 'text-[#F85149] font-semibold font-mono'}>{vh}</span>
                              {!vh.includes('.onion') && <span className="text-[10px] px-1.5 py-0.2 bg-[#F85149]/15 text-[#F85149] rounded font-medium border border-[#F85149]/30">Clearnet Domain</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Active Worker Table */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-[#8B949E]">Active Web Server Requests:</div>
                      <div className="overflow-x-auto rounded-lg border border-[#30363D]">
                        <table className="w-full text-left text-xs bg-[#0D1117]">
                          <thead className="bg-[#161B22] text-[#8B949E] border-b border-[#30363D]">
                            <tr>
                              <th className="p-2.5">PID</th>
                              <th className="p-2.5">Mode</th>
                              <th className="p-2.5">Client IP</th>
                              <th className="p-2.5">Website Name</th>
                              <th className="p-2.5">Request URI</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#30363D] text-[#C9D1D9]">
                            {analysisResult.activeWorkers?.map((w: any, idx: number) => (
                              <tr key={idx} className="hover:bg-[#161B22]/50">
                                <td className="p-2.5 text-[#58A6FF] font-mono">{w.pid}</td>
                                <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-[#30363D] text-[11px] font-mono">{w.mode}</span></td>
                                <td className={`p-2.5 font-mono ${w.client !== '127.0.0.1' ? 'text-[#F85149] font-bold' : 'text-[#8B949E]'}`}>{w.client}</td>
                                <td className="p-2.5 text-[#D29922] font-mono">{w.vhost}</td>
                                <td className="p-2.5 text-[#8B949E] truncate max-w-xs font-mono">{w.request}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SSL Certificate Leakage */}
                {currentModule.id === 'ssl-certs' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-[#F85149]" />
                        <span className="font-semibold">SSL Certificate Names expose clearnet domain names</span>
                      </div>
                      <span className="text-[#58A6FF] font-semibold">Match Strength: {analysisResult.confidence}%</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Leaf Cert Details */}
                      <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-2">
                        <div className="text-[#58A6FF] font-semibold text-xs">[+] TLS Certificate Details:</div>
                        <div>Subject: <strong className="text-[#F85149] font-mono">{analysisResult.subject}</strong></div>
                        <div>Issuer: <span className="text-[#C9D1D9]">{analysisResult.issuer}</span></div>
                        <div>SHA-256 Fingerprint: <span className="text-[10px] text-[#8B949E] break-all font-mono">{analysisResult.sha256Fingerprint}</span></div>
                        <div>Validity: <span className="text-[#8B949E]">{analysisResult.validFrom} &rarr; {analysisResult.validUntil}</span></div>
                      </div>

                      {/* Certificate Names */}
                      <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-2">
                        <div className="text-[#58A6FF] font-semibold text-xs">[+] Certificate Names (SAN Field):</div>
                        <ul className="space-y-1.5">
                          {analysisResult.subjectAltNames?.map((san: string, idx: number) => (
                            <li key={idx} className="text-[#C9D1D9] flex items-center justify-between p-2 rounded bg-[#161B22] border border-[#30363D]">
                              <span className="text-[#F85149] font-mono font-medium">{san}</span>
                              <span className="text-[10px] text-[#3FB950] font-medium">Resolved via DNS</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Certificate Transparency Resolution */}
                    <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-2">
                      <div className="text-xs font-semibold text-[#8B949E]">Certificate Transparency (crt.sh) & DNS Resolution:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {analysisResult.resolvedDnsIps?.map((dns: any, i: number) => (
                          <div key={i} className="p-2.5 rounded bg-[#161B22] border border-[#30363D] space-y-1">
                            <div className="text-[#F85149] font-mono font-medium">{dns.domain} &rarr; {dns.ip}</div>
                            <div className="text-[11px] text-[#8B949E]">{dns.asn} ({dns.country})</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Server ID Check (Banners) */}
                {currentModule.id === 'banners' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-[#D29922]/10 border border-[#D29922]/30 text-[#D29922] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-[#D29922]" />
                        <span className="font-semibold">Server ID Check & Favicon Signature Matched Clearnet Host</span>
                      </div>
                      <span className="text-[#58A6FF] font-semibold">Match Strength: {analysisResult.confidence}%</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Headers */}
                      <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-2">
                        <div className="text-[#58A6FF] font-semibold text-xs">[+] Server Headers:</div>
                        <div className="space-y-1 font-mono text-[11px]">
                          {Object.entries(analysisResult.rawHeaders || {}).map(([k, v]) => (
                            <div key={k} className="text-[#C9D1D9]">
                              <span className="text-[#58A6FF]">{k}:</span> {String(v)}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Matching Scans */}
                      <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-2">
                        <div className="text-[#58A6FF] font-semibold text-xs">[+] Matching Internet Port Scan Records:</div>
                        <div className="space-y-2 pt-1">
                          {analysisResult.censysMatches?.map((match: any, idx: number) => (
                            <div key={idx} className="p-2.5 rounded bg-[#161B22] border border-[#30363D] space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[#F85149] font-mono font-medium">{match.ip}:{match.port}</span>
                                <span className="text-[#3FB950] font-medium">{match.matchScore}% Match</span>
                              </div>
                              <div className="text-[11px] text-[#8B949E]">{match.asn}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Tor Network Patterns */}
                {currentModule.id === 'descriptors' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-[#58A6FF]/10 border border-[#58A6FF]/30 text-[#58A6FF] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-[#58A6FF]" />
                        <span className="font-semibold">Tor Network Patterns: {analysisResult.overlapPercentage}% Shared Connection Relays!</span>
                      </div>
                      <span className="text-[#58A6FF] font-semibold">Match Strength: {analysisResult.confidence}%</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Onion A */}
                      <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-2">
                        <div className="text-[#58A6FF] font-semibold text-xs">[+] Onion A ({analysisResult.onionA?.address.slice(0, 16)}...):</div>
                        <div className="text-[11px] text-[#8B949E]">Published: {analysisResult.onionA?.publishedTime}</div>
                        <div className="space-y-1 pt-1">
                          {analysisResult.onionA?.introPoints?.map((ip: any, idx: number) => (
                            <div key={idx} className="p-2 rounded bg-[#161B22] border border-[#30363D] text-[11px] text-[#C9D1D9]">
                              <span className="text-[#D29922] font-semibold">{ip.nickname}</span> ({ip.ip} - {ip.country})
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Onion B */}
                      <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-2">
                        <div className="text-[#58A6FF] font-semibold text-xs">[+] Onion B ({analysisResult.onionB?.address.slice(0, 16)}...):</div>
                        <div className="text-[11px] text-[#8B949E]">Published: {analysisResult.onionB?.publishedTime}</div>
                        <div className="space-y-1 pt-1">
                          {analysisResult.onionB?.introPoints?.map((ip: any, idx: number) => (
                            <div key={idx} className="p-2 rounded bg-[#161B22] border border-[#30363D] text-[11px] text-[#C9D1D9]">
                              <span className="text-[#D29922] font-semibold">{ip.nickname}</span> ({ip.ip} - {ip.country})
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-[#C9D1D9]">
                      <strong className="text-[#58A6FF]">Analysis Finding: </strong> {analysisResult.conclusion}
                    </div>
                  </div>
                )}

                {/* 5. External Website Links */}
                {currentModule.id === 'clearnet-deps' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-[#F85149]" />
                        <span className="font-semibold">External Website Links & Shared Resource IDs Detected</span>
                      </div>
                      <span className="text-[#58A6FF] font-semibold">Match Strength: {analysisResult.confidence}%</span>
                    </div>

                    <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-3">
                      <div className="text-[#58A6FF] font-semibold text-xs">[+] Loaded External Website Resources:</div>
                      <div className="space-y-2">
                        {analysisResult.clearnetAssetsFound?.map((asset: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-lg bg-[#161B22] border border-[#30363D] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[#58A6FF] font-medium">[{asset.type}]</span>
                                <span className="text-[#C9D1D9] truncate font-mono text-[11px]">{asset.url}</span>
                              </div>
                              {asset.evidence && <div className="text-[11px] text-[#F85149]">{asset.evidence}</div>}
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[#F85149] font-mono font-medium">{asset.ip}</span>
                              <div className="text-[11px] text-[#8B949E]">{asset.domain}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Shared Keys */}
                {currentModule.id === 'key-reuse' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-[#F85149]" />
                        <span className="font-semibold">Shared OpenSSH Cryptographic Host Key Identified!</span>
                      </div>
                      <span className="text-[#58A6FF] font-semibold">Match Strength: {analysisResult.linkageConfidence}%</span>
                    </div>

                    <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-3">
                      <div className="text-[#58A6FF] font-semibold text-xs">[+] Shared SSH Key Fingerprint:</div>
                      <div className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] text-[#D29922] font-mono select-all break-all text-[11px]">
                        {analysisResult.sshHostKeyFingerprint} ({analysisResult.sshKeyType})
                      </div>

                      <div className="text-xs font-semibold text-[#8B949E] pt-1">Matching Physical & Darknet Servers:</div>
                      <div className="space-y-2">
                        {analysisResult.matchingHostsFound?.map((host: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-lg bg-[#161B22] border border-[#30363D] flex items-center justify-between">
                            <div>
                              <div className="text-white font-medium font-mono">{host.hostname} ({host.ip}:{host.port})</div>
                              <div className="text-[11px] text-[#8B949E]">{host.service}</div>
                            </div>
                            <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                              host.isClearnet ? 'bg-[#F85149]/15 text-[#F85149] border border-[#F85149]/30' : 'bg-[#58A6FF]/15 text-[#58A6FF] border border-[#58A6FF]/30'
                            }`}>
                              {host.isClearnet ? 'Clearnet Server' : 'Tor Hidden Service'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Activity Patterns */}
                {currentModule.id === 'timing' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-[#A371F7]/10 border border-[#A371F7]/30 text-[#A371F7] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#A371F7]" />
                        <span className="font-semibold">Activity Patterns: Operator Inferred at {analysisResult.estimatedTimezoneOffset}</span>
                      </div>
                      <span className="text-[#58A6FF] font-semibold">Match Strength: {analysisResult.confidenceScore}%</span>
                    </div>

                    {/* Chart */}
                    <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-2">
                      <div className="text-[#58A6FF] font-semibold text-xs">[+] 24-Hour UTC Activity Frequency Histogram:</div>
                      <div className="h-60 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analysisResult.activityByUtcHour}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                            <XAxis dataKey="hour" stroke="#8B949E" tickFormatter={h => `${h}:00`} />
                            <YAxis stroke="#8B949E" />
                            <Tooltip contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D', color: '#C9D1D9' }} />
                            <Bar dataKey="events" fill="#58A6FF" radius={[3, 3, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#8B949E] pt-2 border-t border-[#30363D]">
                        <span>Likely Sleep Window: <strong className="text-[#F85149] font-mono">{analysisResult.inferredSleepWindowUtc}</strong></span>
                        <span>Location Candidates: <strong className="text-[#3FB950]">{analysisResult.regionalCandidates?.join(', ')}</strong></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center rounded-lg bg-[#0D1117] border border-dashed border-[#30363D] space-y-3">
                <Flame className="w-8 h-8 text-[#8B949E] mx-auto" />
                <div className="text-white font-semibold text-sm">Ready to Test Target Hidden Service</div>
                <p className="text-xs text-[#8B949E] max-w-md mx-auto leading-relaxed">
                  Click &ldquo;Run Test&rdquo; above to run the automated scanner against the target instance and inspect the response.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: How It Works */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-4 text-xs text-[#C9D1D9] leading-relaxed">
            <div className="space-y-1.5">
              <h2 className="text-xs font-semibold text-[#58A6FF]">
                What is this misconfiguration?
              </h2>
              <p className="text-xs text-[#C9D1D9] leading-relaxed">
                {currentModule.description}
              </p>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xs font-semibold text-[#D29922]">
                Technical Cause
              </h2>
              <p className="text-xs text-[#8B949E] leading-relaxed">
                {currentModule.vulnerabilityOverview}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-1">
              <div className="text-[11px] font-semibold text-[#8B949E]">Severity & Impact:</div>
              <p className="text-xs text-[#C9D1D9]">{currentModule.impact}</p>
            </div>
          </div>
        )}

        {/* Tab 3: Deanonymization Flow */}
        {activeTab === 'exploit' && (
          <div className="p-6 space-y-4 text-xs">
            <div className="p-3.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-[#C9D1D9]">
              <div className="text-[#58A6FF] font-semibold mb-1 text-xs">[+] Deanonymization Workflow:</div>
              <p className="text-[#8B949E] leading-relaxed text-xs">
                Walkthrough of how security researchers and analysts identify server origins from this leak.
              </p>
            </div>

            <pre className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] text-[#C9D1D9] leading-relaxed overflow-x-auto font-mono text-[11px]">
              {currentModule.attackVector}
            </pre>
          </div>
        )}

        {/* Tab 4: How to Fix */}
        {activeTab === 'mitigation' && (
          <div className="p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#3FB950] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs">Hardened Server Configuration Fix:</span>
              </div>
              <button
                onClick={() => copyCode(currentModule.remediationCode)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D1117] hover:bg-[#21262D] text-[#C9D1D9] hover:text-white border border-[#30363D] rounded-lg text-xs font-medium transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-[#58A6FF]" />
                <span>Copy Config</span>
              </button>
            </div>

            <pre className="p-4 rounded-lg bg-[#0D1117] border border-[#3FB950]/30 text-[#3FB950] overflow-x-auto leading-relaxed font-mono text-[11px]">
              {currentModule.remediationCode}
            </pre>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-[#8B949E]">
                Recommended Remediation Steps:
              </div>
              <ul className="space-y-1.5 text-xs text-[#8B949E]">
                {currentModule.remediationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3FB950] shrink-0 mt-0.5" />
                    <span className="text-[#C9D1D9]">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

