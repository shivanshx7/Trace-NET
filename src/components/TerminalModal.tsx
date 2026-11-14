import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TermIcon, X, CornerDownLeft } from 'lucide-react';
import { dbService } from '../services/db';
import { dockerSimulator } from '../services/dockerSimulator';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection?: (section: any) => void;
}

interface CommandHistoryItem {
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'init',
      output: (
        <div className="text-[#C9D1D9] space-y-1">
          <div className="text-[#58A6FF] font-semibold">TraceNet Shell v1.2</div>
          <div className="text-[#8B949E] text-xs">Type <span className="text-[#D29922] font-mono">help</span> to view available commands or <span className="text-[#3FB950] font-mono">scan darkv5x...onion</span>.</div>
        </div>
      ),
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [pastCommands, setPastCommands] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setPastCommands(prev => [...prev, trimmed]);
    setCmdIndex(-1);

    const parts = trimmed.split(' ');
    const root = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: React.ReactNode = null;

    switch (root) {
      case 'help':
      case '?':
        output = (
          <div className="text-[#C9D1D9] space-y-1.5 text-xs font-mono">
            <div className="text-[#58A6FF] font-semibold">TraceNet Command Reference:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
              <div><span className="text-[#D29922]">help</span> - Display help manual</div>
              <div><span className="text-[#D29922]">status</span> - Check lab containers &amp; database stats</div>
              <div><span className="text-[#D29922]">scan &lt;onion_addr&gt;</span> - Scan service for all 7 misconfigurations</div>
              <div><span className="text-[#D29922]">actor &lt;handle&gt;</span> - Lookup actor profile &amp; clues</div>
              <div><span className="text-[#D29922]">docker &lt;start|stop|reset&gt;</span> - Control lab Docker environment</div>
              <div><span className="text-[#D29922]">logs [container]</span> - Stream recent container logs</div>
              <div><span className="text-[#D29922]">mitre</span> - Show framework technique mapping</div>
              <div><span className="text-[#D29922]">clear</span> - Clear terminal window</div>
              <div><span className="text-[#D29922]">exit</span> - Close terminal</div>
            </div>
          </div>
        );
        break;

      case 'status':
        const containers = dockerSimulator.getContainers();
        const actors = dbService.getActors();
        const infra = dbService.getInfrastructure();
        output = (
          <div className="text-xs font-mono space-y-1 text-[#C9D1D9]">
            <div className="text-[#58A6FF] font-semibold">[+] TraceNet System Diagnostics:</div>
            <div>Database Records: <span className="text-[#3FB950]">{actors.length} Actor Profiles</span>, <span className="text-[#58A6FF]">{infra.length} Server Clues</span></div>
            <div>Docker Status:</div>
            {containers.map(c => (
              <div key={c.id} className="pl-3 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${c.status === 'running' ? 'bg-[#3FB950]' : 'bg-[#F85149]'}`} />
                <span className="text-white">{c.name}</span> ({c.role}): <span className={c.status === 'running' ? 'text-[#3FB950]' : 'text-[#F85149]'}>{c.status.toUpperCase()}</span> [Port {c.port}]
              </div>
            ))}
          </div>
        );
        break;

      case 'scan':
        const target = args[0] || 'darkv5x34a5d89hqlk2j891klz90amc98a.onion';
        output = (
          <div className="text-xs font-mono space-y-1 text-[#C9D1D9]">
            <div className="text-[#58A6FF] font-semibold">[!] Running Investigation Scan on: {target}</div>
            <div className="text-[#8B949E]">[1/7] Testing Apache /server-status... <span className="text-[#F85149] font-semibold">VULNERABLE (Leaked 185.220.101.45, darkvendor-shop.is)</span></div>
            <div className="text-[#8B949E]">[2/7] Probing SSL Certificate... <span className="text-[#F85149] font-semibold">VULNERABLE (Contains vps42.frankfurt-hosting.net)</span></div>
            <div className="text-[#8B949E]">[3/7] Banner &amp; ETag Fingerprinting... <span className="text-[#D29922] font-semibold">MATCH (Apache/2.4.52 Ubuntu AS48219)</span></div>
            <div className="text-[#8B949E]">[4/7] Tor Descriptor Overlap... <span className="text-[#58A6FF] font-semibold">66.7% Shared Relays</span></div>
            <div className="text-[#8B949E]">[5/7] Checking Clearnet Assets... <span className="text-[#D29922] font-semibold">2 Clearnet CDNs Detected</span></div>
            <div className="text-[#8B949E]">[6/7] SSH Host Key Correlation... <span className="text-[#F85149] font-semibold">MATCH (SHA256:7uK89e... on Frankfurt node)</span></div>
            <div className="text-[#8B949E]">[7/7] Activity Timing Model... <span className="text-[#3FB950] font-semibold">Timezone Inferred: UTC+2 CEST</span></div>
            <div className="p-2 mt-1 rounded-lg bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] font-semibold">
              Match Strength: 98.4% | Actor Link: DarkVendor (Dmitry V.)
            </div>
          </div>
        );
        break;

      case 'actor':
        const handle = args[0] ? args[0].toLowerCase() : 'darkvendor';
        const actor = dbService.getActors().find(a => a.handle.toLowerCase().includes(handle));
        if (actor) {
          output = (
            <div className="text-xs font-mono space-y-1 text-[#C9D1D9]">
              <div className="text-[#58A6FF] font-semibold">[+] Actor Profile: {actor.handle} ({actor.realNameCandidate})</div>
              <div>Category: <span className="text-[#D29922]">{actor.category}</span> | Status: <span className="text-[#3FB950]">{actor.status}</span></div>
              <div>Match Strength: <span className="text-[#58A6FF] font-semibold">{actor.confidenceScore}%</span></div>
              <div>Estimated Location: <span className="text-white">{actor.locationCandidate} ({actor.timezoneEstimate})</span></div>
              <div>PGP Fingerprint: <span className="text-[#58A6FF]">{actor.pgpKey.fingerprint}</span></div>
              <div>Wallets: {actor.wallets.map(w => `${w.currency}: ${w.address} (${w.totalBalance})`).join(', ')}</div>
            </div>
          );
        } else {
          output = <div className="text-[#F85149] text-xs font-mono">[-] Actor matching '{args[0]}' not found.</div>;
        }
        break;

      case 'docker':
        const sub = (args[0] || '').toLowerCase();
        if (sub === 'start') {
          dockerSimulator.startLab();
          output = <div className="text-[#3FB950] text-xs font-mono">[+] Starting lab containers...</div>;
        } else if (sub === 'stop') {
          dockerSimulator.stopLab();
          output = <div className="text-[#D29922] text-xs font-mono">[+] Stopping lab containers...</div>;
        } else if (sub === 'reset') {
          dockerSimulator.resetLab();
          output = <div className="text-[#58A6FF] text-xs font-mono">[+] Resetting lab containers...</div>;
        } else {
          output = <div className="text-[#8B949E] text-xs font-mono">Usage: docker &lt;start|stop|reset&gt;</div>;
        }
        break;

      case 'mitre':
        output = (
          <div className="text-xs font-mono space-y-1 text-[#C9D1D9]">
            <div className="text-[#58A6FF] font-semibold">[+] Security Framework Reference:</div>
            <div>• <span className="text-[#D29922]">T1584.004</span> - Compromise Infrastructure: Hidden Services</div>
            <div>• <span className="text-[#D29922]">T1592.002</span> - Reconnaissance: Host Info via Admin Status Pages</div>
            <div>• <span className="text-[#D29922]">T1588.004</span> - Resource Development: Certificates &amp; SAN Exposure</div>
            <div>• <span className="text-[#D29922]">T1590.002</span> - Reconnaissance: Network Info via Headers &amp; Hashes</div>
            <div>• <span className="text-[#D29922]">T1590.005</span> - Reconnaissance: Descriptor Overlap &amp; Introduction Points</div>
            <div>• <span className="text-[#D29922]">T1588.003</span> - Resource Development: Key Reuse (SSH/TLS)</div>
            <div>• <span className="text-[#D29922]">T1592.003</span> - Reconnaissance: Timing Analysis &amp; Activity Profiling</div>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
      case 'quit':
        onClose();
        return;

      default:
        output = (
          <div className="text-[#F85149] text-xs font-mono">
            [-] Command '{root}' not recognized. Type <span className="text-[#D29922]">help</span> for command list.
          </div>
        );
    }

    setHistory(prev => [
      ...prev,
      {
        command: trimmed,
        output,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (pastCommands.length > 0) {
        const nextIdx = cmdIndex === -1 ? pastCommands.length - 1 : Math.max(0, cmdIndex - 1);
        setCmdIndex(nextIdx);
        setInput(pastCommands[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdIndex !== -1) {
        const nextIdx = cmdIndex + 1;
        if (nextIdx >= pastCommands.length) {
          setCmdIndex(-1);
          setInput('');
        } else {
          setCmdIndex(nextIdx);
          setInput(pastCommands[nextIdx]);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[600px] bg-[#1E262C] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Terminal Header */}
        <div className="h-12 bg-black/30 border-b border-white/10 px-5 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-2.5">
            <TermIcon className="w-4 h-4 text-white" />
            <span className="font-mono text-xs font-bold text-white tracking-wide">tracenet-terminal (zsh)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCommand('scan')}
              className="text-xs px-3.5 py-1 rounded-full bg-white text-slate-900 font-bold font-mono hover:bg-slate-100 transition-all shadow-sm"
            >
              Run Scan
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3 font-mono text-xs custom-scrollbar bg-black/20 text-white/90">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-white/60">
                <span className="text-white font-bold">tracenet&gt;</span>
                <span className="text-white font-semibold">{item.command}</span>
                <span className="text-[10px] text-white/40 ml-auto">{item.timestamp}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Input Bar */}
        <div className="p-3 bg-black/30 border-t border-white/10 flex items-center gap-2 shrink-0">
          <span className="text-white font-mono text-xs font-bold pl-3">tracenet&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type command ('help', 'scan', 'status', 'actor', 'mitre')..."
            className="flex-1 bg-transparent border-none text-white font-mono text-xs focus:outline-none placeholder:text-white/40"
          />
          <button
            onClick={() => handleCommand(input)}
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all mr-1"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

