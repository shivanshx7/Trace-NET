export type NavSection = 'home' | 'demos' | 'actors' | 'reports' | 'settings' | 'dashboard' | 'misconfigs' | 'actor-db' | 'lab-control';

export interface ContainerStatus {
  id: string;
  name: string;
  image: string;
  role: 'onion-service' | 'onion-secondary' | 'clearnet-spoof';
  status: 'running' | 'stopped' | 'restarting' | 'error';
  port: number;
  onionAddress?: string;
  clearnetHost?: string;
  uptime: string;
  cpu: number;
  memory: number;
  netIO: string;
  logs: string[];
}

export interface MisconfigModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: 'Infrastructure' | 'Cryptography' | 'Traffic & Routing' | 'Application Layer';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  mitreId: string;
  mitreTactic: string;
  description: string;
  vulnerabilityOverview: string;
  attackVector: string;
  impact: string;
  remediationCode: string;
  remediationSteps: string[];
  sampleTargets: {
    name: string;
    onion: string;
    associatedActor: string;
    simulatedData: any;
  }[];
}

export interface ThreatActor {
  id: string;
  handle: string;
  realNameCandidate?: string;
  category: 'Darknet Market' | 'Ransomware' | 'Financial Crime' | 'Phishing / Initial Access' | 'State-Sponsored';
  pgpKey: {
    fingerprint: string;
    keyId: string;
    created: string;
    email: string;
  };
  wallets: {
    currency: 'BTC' | 'XMR' | 'ETH';
    address: string;
    totalBalance: string;
    txCount: number;
  }[];
  confidenceScore: number;
  confidenceBreakdown: {
    serverStatus: number;
    sslCertLeak: number;
    bannerHash: number;
    keyReuse: number;
    clearnetDeps: number;
    descriptorOverlap: number;
    timingCorrelation: number;
  };
  lastSeen: string;
  status: 'ACTIVE' | 'MONITORED' | 'IDENTIFIED' | 'ARRESTED';
  locationCandidate: string;
  timezoneEstimate: string;
  notes: string;
  infrastructureIds: string[];
  identifiers: {
    type: 'EMAIL' | 'USERNAME' | 'PHONE' | 'SSH_KEY' | 'DOMAIN' | 'IP';
    value: string;
    source: string;
    isClearnet: boolean;
  }[];
  mitreAttacks: string[];
}

export interface InfrastructureItem {
  id: string;
  actorId: string;
  actorHandle: string;
  onionAddress: string;
  clearnetDomain: string;
  ipAddress: string;
  hostingProvider: string;
  country: string;
  ports: number[];
  tlsFingerprint: string;
  sshFingerprint: string;
  httpBanner: string;
  discoveredVia: string;
  status: 'ONLINE' | 'OFFLINE' | 'SEIZED';
}

export interface ActorLinkage {
  id: string;
  sourceActorId: string;
  sourceActorHandle: string;
  targetActorId: string;
  targetActorHandle: string;
  linkageType: 'SHARED_INFRASTRUCTURE' | 'KEY_REUSE' | 'CRYPTO_CLUSTERING' | 'DESCRIPTOR_OVERLAP' | 'IDENTITY_REUSE';
  evidence: string;
  confidence: number; // 0 - 100
  discoveredDate: string;
}

export interface LabSettings {
  dockerHost: string;
  composeFilePath: string;
  databasePath: string;
  shodanApiKey: string;
  censysApiKey: string;
  onionooApiEndpoint: string;
  theme: 'dark' | 'cyber';
  autoCleanupOnExit: boolean;
  warningDialogs: boolean;
  telemetryLogging: boolean;
}

export interface AuditReport {
  id: string;
  title: string;
  generatedAt: string;
  targetService: string;
  investigator: string;
  findingsCount: number;
  overallConfidence: number;
  leakedClearnetIps: string[];
  leakedDomains: string[];
  actorMatches: string[];
  modulesEvaluated: {
    name: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
    status: 'EXPLOITABLE' | 'VULNERABLE' | 'SECURED';
    summary: string;
  }[];
  executiveSummary: string;
  mitigationPlan: string[];
}
