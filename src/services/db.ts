import { ThreatActor, InfrastructureItem, ActorLinkage, AuditReport, LabSettings } from '../types';
import { INITIAL_ACTORS, INITIAL_INFRASTRUCTURE, INITIAL_LINKAGES, INITIAL_REPORTS, DEFAULT_SETTINGS } from '../data/sampleData';

type DatabaseState = {
  actors: ThreatActor[];
  infrastructure: InfrastructureItem[];
  linkages: ActorLinkage[];
  reports: AuditReport[];
  settings: LabSettings;
};

const STORAGE_KEY = 'tracenet_postgres_backup_v1';
const initialState = (): DatabaseState => JSON.parse(JSON.stringify({
  actors: INITIAL_ACTORS,
  infrastructure: INITIAL_INFRASTRUCTURE,
  linkages: INITIAL_LINKAGES,
  reports: INITIAL_REPORTS,
  settings: DEFAULT_SETTINGS
}));

class PostgresDBService {
  private state: DatabaseState = initialState();

  private persistBackup() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); } catch (error) { console.warn('Could not update local backup', error); }
  }

  private async saveRemote() {
    const response = await fetch('/api/state', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.state)
    });
    if (!response.ok) throw new Error((await response.json()).error || 'PostgreSQL save failed');
  }

  async initialize(): Promise<DatabaseState> {
    try {
      const response = await fetch('/api/state');
      if (!response.ok) throw new Error('PostgreSQL API unavailable');
      const remote = await response.json() as Partial<DatabaseState>;
      const hasSeedData = Array.isArray(remote.actors) && remote.actors.length > 0;
      this.state = {
        actors: hasSeedData ? remote.actors! : INITIAL_ACTORS,
        infrastructure: hasSeedData ? remote.infrastructure || [] : INITIAL_INFRASTRUCTURE,
        linkages: hasSeedData ? remote.linkages || [] : INITIAL_LINKAGES,
        reports: hasSeedData ? remote.reports || [] : INITIAL_REPORTS,
        settings: remote.settings || DEFAULT_SETTINGS
      };
      if (!hasSeedData) await this.saveRemote();
      this.persistBackup();
    } catch (error) {
      console.warn('Using TraceNet sample data/local backup because PostgreSQL is unavailable.', error);
      try {
        const backup = localStorage.getItem(STORAGE_KEY);
        this.state = backup ? { ...initialState(), ...JSON.parse(backup) } : initialState();
      } catch { this.state = initialState(); }
    }
    return this.state;
  }

  private async commit() {
    this.persistBackup();
    try { await this.saveRemote(); }
    catch (error) { console.warn('Change is saved in the browser backup but could not reach PostgreSQL.', error); }
  }
  getActors() { return this.state.actors; }
  getInfrastructure() { return this.state.infrastructure; }
  getLinkages() { return this.state.linkages; }
  getReports() { return this.state.reports; }
  getSettings() { return this.state.settings; }

  async saveActor(actor: ThreatActor) { const i = this.state.actors.findIndex(x => x.id === actor.id); if (i < 0) this.state.actors.unshift(actor); else this.state.actors[i] = actor; await this.commit(); }
  async deleteActor(id: string) { this.state.actors = this.state.actors.filter(x => x.id !== id); this.state.infrastructure = this.state.infrastructure.filter(x => x.actorId !== id); this.state.linkages = this.state.linkages.filter(x => x.sourceActorId !== id && x.targetActorId !== id); await this.commit(); }
  async saveInfrastructure(item: InfrastructureItem) { const i = this.state.infrastructure.findIndex(x => x.id === item.id); if (i < 0) this.state.infrastructure.unshift(item); else this.state.infrastructure[i] = item; await this.commit(); }
  async deleteInfrastructure(id: string) { this.state.infrastructure = this.state.infrastructure.filter(x => x.id !== id); await this.commit(); }
  async saveLinkage(link: ActorLinkage) { const i = this.state.linkages.findIndex(x => x.id === link.id); if (i < 0) this.state.linkages.unshift(link); else this.state.linkages[i] = link; await this.commit(); }
  async deleteLinkage(id: string) { this.state.linkages = this.state.linkages.filter(x => x.id !== id); await this.commit(); }
  async saveReport(report: AuditReport) { const i = this.state.reports.findIndex(x => x.id === report.id); if (i < 0) this.state.reports.unshift(report); else this.state.reports[i] = report; await this.commit(); }
  async deleteReport(id: string) { this.state.reports = this.state.reports.filter(x => x.id !== id); await this.commit(); }
  async saveSettings(settings: LabSettings) { this.state.settings = settings; await this.commit(); }
  exportDatabaseDump() { return JSON.stringify({ version: '2.4.0', exportedAt: new Date().toISOString(), threat_actors: this.state.actors, infrastructure: this.state.infrastructure, linkages: this.state.linkages, reports: this.state.reports, settings: this.state.settings }, null, 2); }
  async importDatabaseDump(jsonString: string): Promise<boolean> { try { const dump = JSON.parse(jsonString); this.state = { actors: dump.threat_actors || [], infrastructure: dump.infrastructure || [], linkages: dump.linkages || [], reports: dump.reports || [], settings: dump.settings || DEFAULT_SETTINGS }; await this.commit(); return true; } catch (error) { console.error('Import error', error); return false; } }
  async resetToDefaults() { this.state = initialState(); await this.commit(); }
}

export const dbService = new PostgresDBService();
