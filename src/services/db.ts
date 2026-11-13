import { ThreatActor, InfrastructureItem, ActorLinkage, AuditReport, LabSettings } from '../types';
import { INITIAL_ACTORS, INITIAL_INFRASTRUCTURE, INITIAL_LINKAGES, INITIAL_REPORTS, DEFAULT_SETTINGS } from '../data/sampleData';

const STORAGE_KEYS = {
  ACTORS: 'tracenet_actors_v2',
  INFRASTRUCTURE: 'tracenet_infrastructure_v2',
  LINKAGES: 'tracenet_linkages_v2',
  REPORTS: 'tracenet_reports_v2',
  SETTINGS: 'tracenet_settings_v2'
};

class LocalDBService {
  private load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage error', e);
    }
  }

  // Threat Actors
  getActors(): ThreatActor[] {
    return this.load<ThreatActor[]>(STORAGE_KEYS.ACTORS, INITIAL_ACTORS);
  }

  getActorById(id: string): ThreatActor | undefined {
    return this.getActors().find(a => a.id === id);
  }

  saveActor(actor: ThreatActor): void {
    const actors = this.getActors();
    const index = actors.findIndex(a => a.id === actor.id);
    if (index >= 0) {
      actors[index] = actor;
    } else {
      actors.unshift(actor);
    }
    this.save(STORAGE_KEYS.ACTORS, actors);
  }

  deleteActor(id: string): void {
    const actors = this.getActors().filter(a => a.id !== id);
    this.save(STORAGE_KEYS.ACTORS, actors);
  }

  // Infrastructure
  getInfrastructure(): InfrastructureItem[] {
    return this.load<InfrastructureItem[]>(STORAGE_KEYS.INFRASTRUCTURE, INITIAL_INFRASTRUCTURE);
  }

  saveInfrastructure(item: InfrastructureItem): void {
    const list = this.getInfrastructure();
    const index = list.findIndex(i => i.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }
    this.save(STORAGE_KEYS.INFRASTRUCTURE, list);
  }

  deleteInfrastructure(id: string): void {
    const list = this.getInfrastructure().filter(i => i.id !== id);
    this.save(STORAGE_KEYS.INFRASTRUCTURE, list);
  }

  // Linkages
  getLinkages(): ActorLinkage[] {
    return this.load<ActorLinkage[]>(STORAGE_KEYS.LINKAGES, INITIAL_LINKAGES);
  }

  saveLinkage(link: ActorLinkage): void {
    const list = this.getLinkages();
    const index = list.findIndex(l => l.id === link.id);
    if (index >= 0) {
      list[index] = link;
    } else {
      list.unshift(link);
    }
    this.save(STORAGE_KEYS.LINKAGES, list);
  }

  deleteLinkage(id: string): void {
    const list = this.getLinkages().filter(l => l.id !== id);
    this.save(STORAGE_KEYS.LINKAGES, list);
  }

  // Reports
  getReports(): AuditReport[] {
    return this.load<AuditReport[]>(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  }

  saveReport(report: AuditReport): void {
    const list = this.getReports();
    const index = list.findIndex(r => r.id === report.id);
    if (index >= 0) {
      list[index] = report;
    } else {
      list.unshift(report);
    }
    this.save(STORAGE_KEYS.REPORTS, list);
  }

  deleteReport(id: string): void {
    const list = this.getReports().filter(r => r.id !== id);
    this.save(STORAGE_KEYS.REPORTS, list);
  }

  // Settings
  getSettings(): LabSettings {
    return this.load<LabSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  saveSettings(settings: LabSettings): void {
    this.save(STORAGE_KEYS.SETTINGS, settings);
  }

  // Export / Import / Reset
  exportDatabaseDump(): string {
    const dump = {
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      threat_actors: this.getActors(),
      infrastructure: this.getInfrastructure(),
      linkages: this.getLinkages(),
      reports: this.getReports(),
      settings: this.getSettings()
    };
    return JSON.stringify(dump, null, 2);
  }

  importDatabaseDump(jsonString: string): boolean {
    try {
      const dump = JSON.parse(jsonString);
      if (dump.threat_actors) this.save(STORAGE_KEYS.ACTORS, dump.threat_actors);
      if (dump.infrastructure) this.save(STORAGE_KEYS.INFRASTRUCTURE, dump.infrastructure);
      if (dump.linkages) this.save(STORAGE_KEYS.LINKAGES, dump.linkages);
      if (dump.reports) this.save(STORAGE_KEYS.REPORTS, dump.reports);
      if (dump.settings) this.save(STORAGE_KEYS.SETTINGS, dump.settings);
      return true;
    } catch (e) {
      console.error('Import error', e);
      return false;
    }
  }

  resetToDefaults(): void {
    this.save(STORAGE_KEYS.ACTORS, INITIAL_ACTORS);
    this.save(STORAGE_KEYS.INFRASTRUCTURE, INITIAL_INFRASTRUCTURE);
    this.save(STORAGE_KEYS.LINKAGES, INITIAL_LINKAGES);
    this.save(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
    this.save(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }
}

export const dbService = new LocalDBService();
