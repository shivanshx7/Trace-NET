import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Copy, 
  Check, 
  Server, 
  Terminal, 
  Network, 
  FileCode, 
  Pause, 
  PlayCircle,
  ExternalLink,
} from 'lucide-react';
import { ContainerStatus } from '../../types';
import { useToast } from '../ui/Toast';

interface LabControlViewProps {
  containers: ContainerStatus[];
  onStartLab: () => void;
  onStopLab: () => void;
  onResetLab: () => void;
  isLabOperating: boolean;
}

export const LabControlView: React.FC<LabControlViewProps> = ({
  containers,
  onStartLab,
  onStopLab,
  onResetLab,
  isLabOperating
}) => {
  const { showToast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedContainerLog, setSelectedContainerLog] = useState<string>('all');
  const [logFilter, setLogFilter] = useState<string>('');
  const [isLogPaused, setIsLogPaused] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'topology' | 'logs' | 'compose'>('topology');
  const logEndRef = useRef<HTMLDivElement>(null);

  const isRunning = containers.some(c => c.status === 'running');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('info', 'Copied to Clipboard', text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Combine logs or filter by selected container
  const displayedLogs = React.useMemo(() => {
    let list: { source: string; text: string }[] = [];
    if (selectedContainerLog === 'all') {
      containers.forEach(c => {
        c.logs.forEach(l => list.push({ source: c.name, text: l }));
      });
    } else {
      const c = containers.find(x => x.id === selectedContainerLog);
      if (c) {
        c.logs.forEach(l => list.push({ source: c.name, text: l }));
      }
    }

    if (logFilter) {
      list = list.filter(item => item.text.toLowerCase().includes(logFilter.toLowerCase()) || item.source.toLowerCase().includes(logFilter.toLowerCase()));
    }
    return list;
  }, [containers, selectedContainerLog, logFilter]);

  useEffect(() => {
    if (!isLogPaused && activeTab === 'logs') {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedLogs, isLogPaused, activeTab]);

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="p-6 rounded-xl bg-[#161B22] border border-[#30363D] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#58A6FF]" />
            <h1 className="text-base font-semibold text-white">
              Lab Control &amp; Network Diagram
            </h1>
          </div>
          <p className="text-xs text-[#8B949E] mt-1 max-w-2xl leading-relaxed">
            Manage test containers with configured Tor services, simulated web servers, and sample leak indicators.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-3 shrink-0">
          {!isRunning ? (
            <button
              onClick={onStartLab}
              disabled={isLabOperating}
              className="flex items-center gap-2 px-4 py-2 bg-[#238636] hover:bg-[#2EA043] text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Lab</span>
            </button>
          ) : (
            <button
              onClick={onStopLab}
              disabled={isLabOperating}
              className="flex items-center gap-2 px-4 py-2 bg-[#DA3633] hover:bg-[#F85149] text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Lab</span>
            </button>
          )}

          <button
            onClick={onResetLab}
            disabled={isLabOperating}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0D1117] hover:bg-[#21262D] text-[#C9D1D9] border border-[#30363D] rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            title="Reset Containers & Logs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLabOperating ? 'animate-spin' : ''}`} />
            <span>Reset Lab</span>
          </button>
        </div>
      </div>

      {/* 3 Container Status Cards with Onion Addresses & Copy Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {containers.map(c => {
          const isContainerRunning = c.status === 'running';
          return (
            <div key={c.id} className="p-5 rounded-xl bg-[#161B22] border border-[#30363D] space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isContainerRunning ? 'bg-[#3FB950]' : 'bg-[#484F58]'}`} />
                    <span className="font-semibold text-xs text-white">{c.name}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isContainerRunning ? 'bg-[#3FB950]/15 text-[#3FB950] border border-[#3FB950]/30' : 'bg-[#30363D] text-[#8B949E]'
                  }`}>
                    {c.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-[#8B949E] mt-2.5">
                  Role: <span className="text-[#58A6FF]">{c.role}</span>
                </div>
                <div className="text-[11px] text-[#8B949E] font-mono mt-0.5 truncate">
                  Image: {c.image}
                </div>

                {/* Onion / Clearnet Address Display */}
                {c.onionAddress && (
                  <div className="mt-3 p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-1">
                    <div className="text-[10px] text-[#8B949E] font-medium flex items-center justify-between">
                      <span>Dark Web (.onion) Address:</span>
                      <button
                        onClick={() => copyToClipboard(c.onionAddress!, `onion-${c.id}`)}
                        className="text-[#58A6FF] hover:underline flex items-center gap-1 text-[10px]"
                      >
                        {copiedId === `onion-${c.id}` ? <Check className="w-3 h-3 text-[#3FB950]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === `onion-${c.id}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-xs text-[#58A6FF] font-mono break-all select-all">
                      {c.onionAddress}
                    </div>
                  </div>
                )}

                {c.clearnetHost && (
                  <div className="mt-2 text-xs text-[#8B949E]">
                    Clearnet Address: <span className="text-[#F85149] font-mono">{c.clearnetHost}</span>
                  </div>
                )}
              </div>

              {/* Resource Metrics & Ports */}
              <div className="pt-3 border-t border-[#30363D] grid grid-cols-3 gap-2 text-center text-xs text-[#8B949E]">
                <div className="p-1.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <div className="text-[10px] text-[#8B949E]">CPU</div>
                  <div className="text-[#C9D1D9] font-mono font-medium">{c.cpu}%</div>
                </div>
                <div className="p-1.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <div className="text-[10px] text-[#8B949E]">Memory</div>
                  <div className="text-[#C9D1D9] font-mono font-medium">{c.memory}MB</div>
                </div>
                <div className="p-1.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <div className="text-[10px] text-[#8B949E]">Port</div>
                  <div className="text-[#C9D1D9] font-mono font-medium">{c.port}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Tabs: Network Diagram vs Live Logs vs Docker Compose */}
      <div className="rounded-xl bg-[#161B22] border border-[#30363D] overflow-hidden">
        {/* Tab Navigation */}
        <div className="h-12 bg-[#161B22] border-b border-[#30363D] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('topology')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'topology' ? 'bg-[#58A6FF]/15 text-[#58A6FF] border border-[#58A6FF]/30' : 'text-[#8B949E] hover:text-[#C9D1D9]'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Network Diagram</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'logs' ? 'bg-[#58A6FF]/15 text-[#58A6FF] border border-[#58A6FF]/30' : 'text-[#8B949E] hover:text-[#C9D1D9]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Live Logs ({displayedLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('compose')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'compose' ? 'bg-[#58A6FF]/15 text-[#58A6FF] border border-[#58A6FF]/30' : 'text-[#8B949E] hover:text-[#C9D1D9]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>docker-compose.yml</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Network Topology Visualizer */}
        {activeTab === 'topology' && (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] text-xs text-[#C9D1D9]">
              <div className="text-[#58A6FF] font-semibold mb-1 text-xs">
                Test Network &amp; Trace Flow:
              </div>
              <p className="text-[#8B949E] leading-relaxed">
                Queries are routed to the onion addresses through a local proxy. Server misconfigurations leak real IP addresses and linked domain clues back to the client.
              </p>
            </div>

            {/* Interactive SVG / Diagram */}
            <div className="p-6 rounded-lg bg-[#0D1117] border border-[#30363D] flex flex-col md:flex-row items-center justify-between gap-4 text-xs overflow-x-auto">
              {/* Tor Client */}
              <div className="p-4 rounded-lg bg-[#161B22] border border-[#58A6FF]/40 text-center space-y-1 w-44 shrink-0">
                <div className="w-8 h-8 mx-auto rounded-full bg-[#58A6FF]/15 flex items-center justify-center text-[#58A6FF]">
                  <Terminal className="w-4 h-4" />
                </div>
                <div className="font-semibold text-white">Client App</div>
                <div className="text-[11px] text-[#58A6FF]">TraceNet Suite</div>
              </div>

              <div className="text-[#58A6FF] font-medium hidden md:block">&rarr; Proxy &rarr;</div>

              {/* Tor Cloud / Relays */}
              <div className="p-4 rounded-lg bg-[#161B22] border border-[#A371F7]/40 text-center space-y-1 w-52 shrink-0">
                <div className="w-8 h-8 mx-auto rounded-full bg-[#A371F7]/15 flex items-center justify-center text-[#A371F7]">
                  <Network className="w-4 h-4" />
                </div>
                <div className="font-semibold text-[#A371F7]">Tor Circuit</div>
                <div className="text-[10px] text-[#8B949E]">Guard &bull; Middle &bull; Intro Pt</div>
              </div>

              <div className="text-[#A371F7] font-medium hidden md:block">&rarr; Connect &rarr;</div>

              {/* Hidden Service Containers */}
              <div className="space-y-3 w-56 shrink-0">
                <div className="p-3 rounded-lg bg-[#161B22] border border-[#3FB950]/40 text-center space-y-1">
                  <div className="font-semibold text-[#3FB950]">onion1: Apache Server</div>
                  <div className="text-[10px] text-[#8B949E]">Exposes /server-status</div>
                  <div className="text-[10px] text-[#F85149] font-mono">Leaked IP: 185.220.101.45</div>
                </div>

                <div className="p-3 rounded-lg bg-[#161B22] border border-[#A371F7]/40 text-center space-y-1">
                  <div className="font-semibold text-[#A371F7]">onion2: Gateway</div>
                  <div className="text-[10px] text-[#8B949E]">Shared Key Reuse</div>
                  <div className="text-[10px] text-[#F85149] font-mono">Leaked IP: 91.240.118.82</div>
                </div>
              </div>

              <div className="text-[#F85149] font-medium hidden md:block">&harr; Leak &harr;</div>

              {/* Clearnet Spoof Server */}
              <div className="p-4 rounded-lg bg-[#161B22] border border-[#F85149]/40 text-center space-y-1 w-48 shrink-0">
                <div className="w-8 h-8 mx-auto rounded-full bg-[#F85149]/15 flex items-center justify-center text-[#F85149]">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div className="font-semibold text-[#F85149]">clearnet-spoof</div>
                <div className="text-[10px] text-[#8B949E]">CDN &amp; Analytics Sink</div>
                <div className="text-[10px] text-[#D29922] font-mono">Port 8080 (Localhost)</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Real-Time Docker Log Viewer */}
        {activeTab === 'logs' && (
          <div className="p-5 space-y-3">
            {/* Log Viewer Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#8B949E] font-medium">Filter Container:</span>
                <select
                  value={selectedContainerLog}
                  onChange={e => setSelectedContainerLog(e.target.value)}
                  className="bg-[#0D1117] border border-[#30363D] text-[#58A6FF] rounded-lg px-2.5 py-1 focus:outline-none text-xs"
                >
                  <option value="all">All Containers (Combined)</option>
                  {containers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <input
                  type="text"
                  value={logFilter}
                  onChange={e => setLogFilter(e.target.value)}
                  placeholder="Filter logs..."
                  className="bg-[#0D1117] border border-[#30363D] text-[#C9D1D9] placeholder:text-[#8B949E] rounded-lg px-2.5 py-1 focus:outline-none w-44 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLogPaused(!isLogPaused)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-colors text-xs font-medium ${
                    isLogPaused ? 'bg-[#D29922]/15 text-[#D29922] border-[#D29922]/30' : 'bg-[#0D1117] text-[#8B949E] border-[#30363D] hover:text-[#C9D1D9]'
                  }`}
                >
                  {isLogPaused ? <PlayCircle className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{isLogPaused ? 'Resume Scroll' : 'Pause Stream'}</span>
                </button>
              </div>
            </div>

            {/* Terminal Window */}
            <div className="h-96 rounded-lg bg-[#0D1117] border border-[#30363D] p-4 overflow-y-auto font-mono text-xs space-y-1 custom-scrollbar">
              {displayedLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed hover:bg-[#161B22] px-1.5 py-0.5 rounded transition-colors flex items-start gap-2">
                  <span className="text-[#58A6FF] font-semibold shrink-0">[{log.source}]</span>
                  <span className={`text-[#C9D1D9] break-all ${
                    log.text.includes('VULNERABLE') || log.text.includes('LEAK') || log.text.includes('185.220') ? 'text-[#F85149] font-medium' : ''
                  }`}>
                    {log.text}
                  </span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        )}

        {/* Tab 3: Docker Compose File Viewer */}
        {activeTab === 'compose' && (
          <div className="p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between text-[#8B949E]">
              <span className="font-mono text-[11px]">Path: /TraceNet/docker/docker-compose.yml</span>
              <button
                onClick={() => copyToClipboard(`version: '3.8'\nservices:\n  onion1-market:\n    image: httpd:2.4.52-alpine\n    ports:\n      - "8081:80"`, 'compose-copy')}
                className="text-[#58A6FF] hover:underline flex items-center gap-1 text-xs font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy YAML</span>
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] text-[#3FB950] font-mono text-xs overflow-x-auto leading-relaxed">
{`version: '3.8'

services:
  # Tor Hidden Service 1 - Apache mod_status Vulnerability
  onion1-market:
    image: httpd:2.4.52-alpine
    container_name: tracenet-onion1
    restart: unless-stopped
    ports:
      - "8081:80"
    volumes:
      - ./configs/apache-status.conf:/usr/local/apache2/conf/extra/httpd-status.conf
      - ./www/market:/usr/local/apache2/htdocs
    networks:
      - tracenet-lab-net

  # Tor Hidden Service 2 - Secondary Node (C2 & SSH Key Reuse)
  onion2-c2:
    image: nginx:alpine
    container_name: tracenet-onion2
    restart: unless-stopped
    ports:
      - "8082:80"
    volumes:
      - ./www/c2:/usr/share/nginx/html
    networks:
      - tracenet-lab-net

  # Clearnet Server - Third-Party Asset & Tracker Sink
  clearnet-spoof:
    image: nginx:alpine
    container_name: tracenet-clearnet-spoof
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./configs/clearnet-nginx.conf:/etc/nginx/conf.d/default.conf
      - ./www/clearnet:/usr/share/nginx/html
    networks:
      - tracenet-lab-net

networks:
  tracenet-lab-net:
    driver: bridge`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

