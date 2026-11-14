import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Database, 
  Key, 
  RotateCcw, 
  Save, 
  Server, 
} from 'lucide-react';
import { dbService } from '../../services/db';
import { useToast } from '../ui/Toast';

export const SettingsView: React.FC = () => {
  const { showToast } = useToast();
  const [torSocksHost, setTorSocksHost] = useState<string>('127.0.0.1');
  const [torSocksPort, setTorSocksPort] = useState<number>(9050);
  const [torControlPort, setTorControlPort] = useState<number>(9051);
  const [dockerSocket, setDockerSocket] = useState<string>('/var/run/docker.sock');
  const [shodanApiKey, setShodanApiKey] = useState<string>('sim_shodan_key_88492019482');
  const [censysApiId, setCensysApiId] = useState<string>('sim_censys_id_99281');
  const [censysSecret, setCensysSecret] = useState<string>('••••••••••••••••••••••••');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Settings Saved', 'Proxy and API configurations updated.');
  };

  const handleResetDb = () => {
    if (confirm('Reset entire TraceNet database to default pre-seeded state?')) {
      dbService.resetToDefaults();
      showToast('info', 'Database Reset', 'Pre-seeded sample data restored.');
      setTimeout(() => window.location.reload(), 800);
    }
  };

  const mitreTactics = [
    {
      tactic: 'Reconnaissance',
      techniqueId: 'T1592.002',
      name: 'Gather Host Info: Software',
      relevance: 'Fingerprinting HTTP Server headers, ETag hashes, and engine versions on hidden service ports.'
    },
    {
      tactic: 'Reconnaissance',
      techniqueId: 'T1590.002',
      name: 'Gather Network Info: DNS',
      relevance: 'Querying Certificate Transparency logs to resolve TLS certificate names back to clearnet domain records.'
    },
    {
      tactic: 'Resource Development',
      techniqueId: 'T1584.004',
      name: 'Compromise Infrastructure: Server',
      relevance: 'Checking server status pages (/server-status) to inspect client requests and active host connections.'
    },
    {
      tactic: 'Resource Development',
      techniqueId: 'T1588.004',
      name: 'Obtain Capabilities: Certificates',
      relevance: 'Analyzing shared certificate reuse across clearnet and darknet endpoints.'
    },
    {
      tactic: 'Command & Control',
      techniqueId: 'T1071.001',
      name: 'Application Layer Protocol: Web Protocols',
      relevance: 'Tracking clearnet third-party script includes, CDN fonts, and analytics pixels on onion sites.'
    },
    {
      tactic: 'Resource Development',
      techniqueId: 'T1583.003',
      name: 'Acquire Infrastructure: Virtual Private Server',
      relevance: 'Correlating daily activity patterns to geographical timezone clusters.'
    }
  ];

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-black/15 border border-white/20 backdrop-blur-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#19232B]" />
            <h1 className="text-xl font-bold text-[#19232B]">
              System Settings &amp; Framework Reference
            </h1>
          </div>
          <p className="text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">
            Configure local Tor SOCKS proxy connections, Docker socket paths, lookup API keys, and review security framework mappings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Network & API Configurations */}
        <div className="space-y-6">
          {/* Proxy & Docker Configuration Form */}
          <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-black/15 border border-white/20 backdrop-blur-md space-y-4 text-xs shadow-lg">
            <div className="flex items-center gap-2 text-white font-bold pb-2 border-b border-white/15 uppercase tracking-wider">
              <Server className="w-4 h-4 text-white" />
              <span>Proxy &amp; Docker Endpoints</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/80 mb-1 font-semibold">Tor SOCKS5 Host</label>
                <input
                  type="text"
                  value={torSocksHost}
                  onChange={e => setTorSocksHost(e.target.value)}
                  className="w-full bg-black/20 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-white/40 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-semibold">Tor SOCKS5 Port</label>
                <input
                  type="number"
                  value={torSocksPort}
                  onChange={e => setTorSocksPort(parseInt(e.target.value))}
                  className="w-full bg-black/20 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-white/40 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-semibold">Tor Control Port</label>
                <input
                  type="number"
                  value={torControlPort}
                  onChange={e => setTorControlPort(parseInt(e.target.value))}
                  className="w-full bg-black/20 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-white/40 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-semibold">Docker Engine Socket</label>
                <input
                  type="text"
                  value={dockerSocket}
                  onChange={e => setDockerSocket(e.target.value)}
                  className="w-full bg-black/20 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-white/40 font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-white font-bold pt-3 border-t border-white/15 uppercase tracking-wider">
              <Key className="w-4 h-4 text-white" />
              <span>Search &amp; Lookup API Keys</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-white/80 mb-1 font-semibold">Shodan API Key</label>
                <input
                  type="text"
                  value={shodanApiKey}
                  onChange={e => setShodanApiKey(e.target.value)}
                  className="w-full bg-black/20 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-white/40 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 mb-1 font-semibold">Censys API ID</label>
                  <input
                    type="text"
                    value={censysApiId}
                    onChange={e => setCensysApiId(e.target.value)}
                    className="w-full bg-black/20 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-white/40 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-1 font-semibold">Censys Secret</label>
                  <input
                    type="password"
                    value={censysSecret}
                    onChange={e => setCensysSecret(e.target.value)}
                    className="w-full bg-black/20 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-white/40 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-white/15">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1E262C] hover:bg-[#2B353D] text-white font-bold rounded-full text-xs transition-all shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>

          {/* Database Reset */}
          <div className="p-6 rounded-2xl bg-black/15 border border-white/20 space-y-3 text-xs shadow-lg">
            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
              <Database className="w-4 h-4 text-[#E76F51]" />
              <span>Database Reset</span>
            </div>
            <p className="text-white/80 text-xs leading-relaxed">
              Resets all actor profiles, server clues, and evidence logs back to default pre-seeded state.
            </p>
            <button
              onClick={handleResetDb}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#E76F51]/20 hover:bg-[#E76F51]/30 text-white border border-[#E76F51]/40 rounded-full font-bold text-xs transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset &amp; Restore Sample Data</span>
            </button>
          </div>
        </div>

        {/* Right Column: Framework Reference */}
        <div className="p-6 rounded-2xl bg-black/15 border border-white/20 backdrop-blur-md space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-white font-bold text-xs pb-2 border-b border-white/15 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Security Framework Reference</span>
          </div>

          <div className="space-y-3">
            {mitreTactics.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-black/20 border border-white/15 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{m.techniqueId} - {m.name}</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#1E262C] text-white font-bold">
                    {m.tactic}
                  </span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">
                  {m.relevance}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

