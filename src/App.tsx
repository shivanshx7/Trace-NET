import React, { useState, useEffect } from 'react';
import { NavSection, ThreatActor, InfrastructureItem, ActorLinkage, AuditReport, ContainerStatus } from './types';
import { dbService } from './services/db';
import { dockerSimulator } from './services/dockerSimulator';
import { Header } from './components/Header';
import { TerminalModal } from './components/TerminalModal';
import { ToastProvider, useToast } from './components/ui/Toast';
import { DashboardView } from './components/views/DashboardView';
import { LabControlView } from './components/views/LabControlView';
import { MisconfigDemosView } from './components/views/MisconfigDemosView';
import { ActorDbView } from './components/views/ActorDbView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { CodebaseExportModal } from './components/views/CodebaseExportModal';

function MainApp() {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('server-status');
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // State loaded from SQLite-backed DB service
  const [actors, setActors] = useState<ThreatActor[]>([]);
  const [infrastructure, setInfrastructure] = useState<InfrastructureItem[]>([]);
  const [linkages, setLinkages] = useState<ActorLinkage[]>([]);
  const [reports, setReports] = useState<AuditReport[]>([]);

  // State loaded from Docker Simulator
  const [containers, setContainers] = useState<ContainerStatus[]>([]);
  const [isLabOperating, setIsLabOperating] = useState<boolean>(false);

  // Initial load & subscription
  useEffect(() => {
    setActors(dbService.getActors());
    setInfrastructure(dbService.getInfrastructure());
    setLinkages(dbService.getLinkages());
    setReports(dbService.getReports());

    // Subscribe to Docker Lab status changes
    const unsubDocker = dockerSimulator.subscribe((newStatus) => {
      setContainers(newStatus);
    });

    return () => {
      unsubDocker();
    };
  }, []);

  // Quick Action Handlers
  const handleStartLab = async () => {
    setIsLabOperating(true);
    showToast('info', 'Deploying Containers', 'Starting onion1, onion2, and clearnet-spoof via Docker...');
    await dockerSimulator.startLab();
    setIsLabOperating(false);
    showToast('success', 'Lab Online', 'All 3 isolated containers are healthy and listening.');
  };

  const handleStopLab = async () => {
    setIsLabOperating(true);
    await dockerSimulator.stopLab();
    setIsLabOperating(false);
    showToast('info', 'Lab Offline', 'Docker containers terminated.');
  };

  const handleResetLab = async () => {
    setIsLabOperating(true);
    await dockerSimulator.resetLab();
    setIsLabOperating(false);
    showToast('success', 'Lab Reset', 'Containers restarted and logs flushed.');
  };

  // Actor DB Handlers
  const handleSaveActor = (actor: ThreatActor) => {
    dbService.saveActor(actor);
    setActors(dbService.getActors());
  };

  const handleDeleteActor = (id: string) => {
    dbService.deleteActor(id);
    setActors(dbService.getActors());
  };

  const handleSaveInfrastructure = (item: InfrastructureItem) => {
    dbService.saveInfrastructure(item);
    setInfrastructure(dbService.getInfrastructure());
  };

  const handleSaveLinkage = (linkage: ActorLinkage) => {
    dbService.saveLinkage(linkage);
    setLinkages(dbService.getLinkages());
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#090A0D] text-[#EDEDED] overflow-hidden font-sans selection:bg-[#FF3E11] selection:text-white">
      {/* Global Application Header with Navigation */}
      <Header
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        containers={containers}
        onStartLab={handleStartLab}
        onStopLab={handleStopLab}
        onResetLab={handleResetLab}
        isOperating={isLabOperating}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#090A0D] custom-scrollbar">
        {(activeSection === 'home' || activeSection === 'dashboard') && (
          <DashboardView
            containers={containers}
            actors={actors}
            infrastructure={infrastructure}
            linkages={linkages}
            onStartLab={handleStartLab}
            onStopLab={handleStopLab}
            onResetLab={handleResetLab}
            isLabOperating={isLabOperating}
            onNavigateSection={setActiveSection}
            onSelectModule={moduleId => {
              setSelectedModuleId(moduleId);
              setActiveSection('demos');
            }}
          />
        )}

        {activeSection === 'lab-control' && (
          <LabControlView
            containers={containers}
            onStartLab={handleStartLab}
            onStopLab={handleStopLab}
            onResetLab={handleResetLab}
            isLabOperating={isLabOperating}
          />
        )}

        {(activeSection === 'demos' || activeSection === 'misconfigs') && (
          <MisconfigDemosView
            selectedModuleId={selectedModuleId}
            onSelectModule={setSelectedModuleId}
          />
        )}

        {(activeSection === 'actors' || activeSection === 'actor-db') && (
          <ActorDbView
            actors={actors}
            infrastructure={infrastructure}
            linkages={linkages}
            onSaveActor={handleSaveActor}
            onDeleteActor={handleDeleteActor}
            onSaveInfrastructure={handleSaveInfrastructure}
            onSaveLinkage={handleSaveLinkage}
          />
        )}

        {activeSection === 'reports' && (
          <ReportsView
            reports={reports}
            actors={actors}
            infrastructure={infrastructure}
          />
        )}

        {activeSection === 'settings' && (
          <SettingsView />
        )}
      </main>

      {/* Interactive macOS CLI Terminal Modal */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      {/* Standalone macOS Python Desktop Application Source Code Modal */}
      <CodebaseExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}

