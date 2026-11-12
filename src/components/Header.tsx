import React from 'react';
import { 
  Home,
  PlayCircle,
  Users,
  FileText,
  Settings,
  Terminal,
  Code2,
  Play,
  Square,
  RotateCcw,
  ArrowRight,
  Menu
} from 'lucide-react';
import { ContainerStatus, NavSection } from '../types';

interface HeaderProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  containers: ContainerStatus[];
  onStartLab: () => void;
  onStopLab: () => void;
  onResetLab: () => void;
  isOperating: boolean;
  onOpenTerminal: () => void;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  containers,
  onStartLab,
  onStopLab,
  onResetLab,
  isOperating,
  onOpenTerminal,
  onOpenExportModal
}) => {
  const isRunning = containers.some(c => c.status === 'running');
  const runningCount = containers.filter(c => c.status === 'running').length;

  const currentTab = 
    activeSection === 'dashboard' || activeSection === 'home' ? 'home' :
    activeSection === 'misconfigs' || activeSection === 'demos' ? 'demos' :
    activeSection === 'actor-db' || activeSection === 'actors' ? 'actors' :
    activeSection === 'lab-control' ? 'lab-control' :
    activeSection === 'reports' ? 'reports' :
    activeSection === 'settings' ? 'settings' : 'home';

  const tabs: { id: NavSection; label: string }[] = [
    { id: 'home', label: 'Overview' },
    { id: 'demos', label: 'Vulnerability Demos' },
    { id: 'actors', label: 'Actor Dossiers' },
    { id: 'lab-control', label: 'Docker Lab' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <header className="bg-[#090A0D]/95 backdrop-blur-xl border-b border-white/[0.08] px-6 sm:px-10 select-none shrink-0 sticky top-0 z-40">
      {/* Top Meta Line: Like Catalin Vintila — Senior UI/UX Designer / Portfolio — 2026 */}
      <div className="flex items-center justify-between pt-4 pb-2 border-b border-white/[0.04] text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-[#8A8F99]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-none bg-[#FF3E11]" />
          <span className="text-white/90 font-medium">TRACENET — TOR DEANONYMIZATION SUITE</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-white/60">FORENSICS LAB &bull; 2026</span>
          <span className="flex items-center gap-1.5 text-white/80">
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#00E676] animate-pulse' : 'bg-white/40'}`} />
            <span>{isRunning ? `ONLINE (${runningCount}/3)` : 'STANDBY'}</span>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto gap-4">
        {/* Brand Monogram (Inspired by the 'CV' monogram in reference image) */}
        <div 
          onClick={() => onSelectSection('home')}
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Minimalist Monogram 'TN' with high-contrast curvature */}
            <span className="font-serif italic font-black text-2xl tracking-tighter text-white group-hover:text-[#FF3E11] transition-colors select-none">
              TN
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white font-sans group-hover:text-white/90 transition-colors">
              TraceNet
            </span>
          </div>
        </div>

        {/* Minimalist Pill Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.06]">
          {tabs.map(tab => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectSection(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!isRunning ? (
            <button
              onClick={onStartLab}
              disabled={isOperating}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FF3E11] hover:bg-[#FF552B] text-white rounded-full text-xs font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(255,62,17,0.3)] disabled:opacity-50"
            >
              <span>DEPLOY LAB</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onStopLab}
              disabled={isOperating}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-full text-xs font-bold tracking-wide transition-all shadow-md disabled:opacity-50"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>STOP LAB</span>
            </button>
          )}

          {/* Terminal Pill */}
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.08] rounded-full text-xs font-mono font-medium transition-all"
            title="Open CLI Terminal"
          >
            <Terminal className="w-3.5 h-3.5 text-[#FF3E11]" />
            <span className="hidden sm:inline">CLI</span>
          </button>

          {/* Standalone Code Exporter */}
          <button
            onClick={onOpenExportModal}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.08] rounded-full text-xs font-medium transition-all"
            title="Download Standalone Python / PyQt6 Source Code"
          >
            <Code2 className="w-3.5 h-3.5 text-white/70" />
            <span>Python Source</span>
          </button>
        </div>
      </div>
    </header>
  );
};


