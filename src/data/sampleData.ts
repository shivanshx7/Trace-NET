import { ThreatActor, InfrastructureItem, ActorLinkage, ContainerStatus, AuditReport, LabSettings } from '../types';

export const INITIAL_CONTAINERS: ContainerStatus[] = [
  {
    id: 'c-onion1',
    name: 'tracenet-onion1',
    image: 'tracenet/onion-lab-apache:v2.4',
    role: 'onion-service',
    status: 'running',
    port: 8081,
    onionAddress: 'darkv5x34a5d89hqlk2j891klz90amc98a.onion',
    clearnetHost: '185.220.101.45 (Frankfurt)',
    uptime: '4h 18m',
    cpu: 1.8,
    memory: 142,
    netIO: '4.2 MB / 18.9 MB',
    logs: [
      '[tor] Bootstrapped 100% (done): Done',
      '[apache2] [mpm_event:notice] [pid 1] AH00489: Apache/2.4.52 (Ubuntu) configured -- resuming normal operations',
      '[apache2] [core:notice] [pid 1] AH00094: Command line: \'/usr/sbin/apache2 -D FOREGROUND\'',
      '[tor] Hidden service darkv5x34a5d89hqlk2j891klz90amc98a.onion registered with 3 intro points',
      '[apache2] 127.0.0.1 - - [28/Aug/2026:14:40:12 +0000] "GET /api/v1/market/listings HTTP/1.1" 200 4820',
      '[apache2] 185.220.101.45 - - [28/Aug/2026:14:42:19 +0000] "GET /server-status HTTP/1.1" 200 12891',
      '[tor] Published descriptor version 3 to HSDir FreedomNode01'
    ]
  },
  {
    id: 'c-onion2',
    name: 'tracenet-onion2',
    image: 'tracenet/onion-lab-c2:v1.2',
    role: 'onion-secondary',
    status: 'running',
    port: 8082,
    onionAddress: 'shdwc299xka0912ms88alqo10zxm8291.onion',
    clearnetHost: '91.240.118.82 (St. Petersburg)',
    uptime: '4h 18m',
    cpu: 2.4,
    memory: 198,
    netIO: '1.8 MB / 8.4 MB',
    logs: [
      '[tor] Hidden service shdwc299xka0912ms88alqo10zxm8291.onion loaded keys',
      '[c2-server] Listening on 127.0.0.1:8082 (Unix Socket forward active)',
      '[c2-server] Agent check-in from beacon_win11_x64_0x4291',
      '[c2-server] Received encrypted payload (RSA-2048)',
      '[tor] Introduction point rotation completed: TorGatewayDE active'
    ]
  },
  {
    id: 'c-clearnet',
    name: 'tracenet-clearnet-spoof',
    image: 'nginx:alpine-security-lab',
    role: 'clearnet-spoof',
    status: 'running',
    port: 8080,
    clearnetHost: 'http://localhost:8080 (Simulated CDN & Analytics)',
    uptime: '4h 18m',
    cpu: 0.8,
    memory: 64,
    netIO: '12.4 MB / 45.1 MB',
    logs: [
      '[nginx] Configuration loaded /etc/nginx/conf.d/clearnet_spoof.conf',
      '[nginx] Serving /tracker.js for ID RG_PROD_442',
      '[nginx] Access from 127.0.0.1: "GET /cdn/bootstrap.min.css HTTP/1.1" 200 48190',
      '[nginx] Request logged: Origin http://ransomfeed4k891290amcxzq10291480129.onion referer detected!'
    ]
  }
];

export const INITIAL_ACTORS: ThreatActor[] = [
  {
    id: 'act-001',
    handle: 'DarkVendor',
    realNameCandidate: 'Dmitry V. / "pepsi_cola"',
    category: 'Darknet Market',
    pgpKey: {
      fingerprint: '8491 0294 1A92 8401 2948 1029 4810 2948 1029 481A',
      keyId: '0x1029481A',
      created: '2024-03-15',
      email: 'darkvendor_ops@proton.me'
    },
    wallets: [
      { currency: 'BTC', address: 'bc1q9x428aklsd0912kamz99012lasd9012kma8', totalBalance: '48.92 BTC', txCount: 1420 },
      { currency: 'XMR', address: '888tNk42Ka9012Lasd9012Kmsd9012Kamsd0912Kam9012Lasd80192', totalBalance: '1,280.00 XMR', txCount: 3890 }
    ],
    confidenceScore: 94,
    confidenceBreakdown: {
      serverStatus: 98,
      sslCertLeak: 99,
      bannerHash: 92,
      keyReuse: 99,
      clearnetDeps: 85,
      descriptorOverlap: 91,
      timingCorrelation: 89
    },
    lastSeen: '2026-08-28 14:42:19 UTC',
    status: 'ACTIVE',
    locationCandidate: 'Frankfurt / Offenbach, Germany',
    timezoneEstimate: 'UTC+2 (CEST)',
    notes: 'Major darknet vendor operating counterfeit pharmaceutical and carding listings. Severely deanonymized via Apache /server-status leak and multi-domain Let\'s Encrypt SAN cert containing darkvendor-shop.is and vps42.frankfurt-hosting.net.',
    infrastructureIds: ['inf-001', 'inf-002'],
    identifiers: [
      { type: 'EMAIL', value: 'darkvendor_ops@proton.me', source: 'PGP Key Header', isClearnet: true },
      { type: 'DOMAIN', value: 'darkvendor-shop.is', source: 'SSL SAN Field', isClearnet: true },
      { type: 'IP', value: '185.220.101.45', source: 'Apache mod_status VHost Table', isClearnet: true },
      { type: 'SSH_KEY', value: 'SHA256:7uK89eM31zQPaO819Lka901ZlqMza81920Lka901248', source: 'SSH Host Key Probe', isClearnet: true }
    ],
    mitreAttacks: ['T1584.004', 'T1592.002', 'T1588.004', 'T1588.003', 'T1592.003']
  },
  {
    id: 'act-002',
    handle: 'CryptoKing',
    realNameCandidate: 'Alexey K. / "crypt0_wizard"',
    category: 'Financial Crime',
    pgpKey: {
      fingerprint: '3901 8421 90AB CDEF 1234 5678 9ABC DEF0 1234 5678',
      keyId: '0x9ABCDEF0',
      created: '2023-11-20',
      email: 'alex_cryptoking@tutanota.com'
    },
    wallets: [
      { currency: 'BTC', address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', totalBalance: '210.45 BTC', txCount: 8490 },
      { currency: 'ETH', address: '0x71C8366420A092679b547183f436622414777ab3', totalBalance: '480.00 ETH', txCount: 3120 }
    ],
    confidenceScore: 88,
    confidenceBreakdown: {
      serverStatus: 72,
      sslCertLeak: 85,
      bannerHash: 94,
      keyReuse: 91,
      clearnetDeps: 88,
      descriptorOverlap: 82,
      timingCorrelation: 86
    },
    lastSeen: '2026-08-28 12:15:00 UTC',
    status: 'ACTIVE',
    locationCandidate: 'Reykjavik, Iceland / FlokiNET Hosting',
    timezoneEstimate: 'UTC+0 (GMT)',
    notes: 'Operates illicit tumbling and escrow services. Identified via custom HTTP error template hash (MurmurHash favicon) and matching WSGI server banner on Icelandic bulletproof host.',
    infrastructureIds: ['inf-003'],
    identifiers: [
      { type: 'DOMAIN', value: 'cryptoking-clearnet-escrow.net', source: 'Censys Favicon Correlation', isClearnet: true },
      { type: 'IP', value: '193.106.191.22', source: 'Shodan HTML Hash Lookup', isClearnet: true },
      { type: 'EMAIL', value: 'alex_cryptoking@tutanota.com', source: 'Escrow Dispute Notice', isClearnet: true }
    ],
    mitreAttacks: ['T1590.002', 'T1588.004', 'T1592.004']
  },
  {
    id: 'act-003',
    handle: 'ShadowAdmin',
    realNameCandidate: 'Nikolai B. / "black_shadow"',
    category: 'Ransomware',
    pgpKey: {
      fingerprint: 'DE90 1248 1029 4810 2948 1029 4810 2948 1029 DEAD',
      keyId: '0x1029DEAD',
      created: '2024-01-10',
      email: 'shadow_support@jabber.ru'
    },
    wallets: [
      { currency: 'BTC', address: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT', totalBalance: '95.20 BTC', txCount: 420 },
      { currency: 'XMR', address: '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otRft3XjRPDtQGZnEFZ9SC1EacJzpFLHKhYDfdpSTfgWu7Su479', totalBalance: '2,940.00 XMR', txCount: 1820 }
    ],
    confidenceScore: 96,
    confidenceBreakdown: {
      serverStatus: 96,
      sslCertLeak: 94,
      bannerHash: 88,
      keyReuse: 99,
      clearnetDeps: 92,
      descriptorOverlap: 95,
      timingCorrelation: 94
    },
    lastSeen: '2026-08-28 15:42:19 UTC',
    status: 'ACTIVE',
    locationCandidate: 'St. Petersburg, Russia',
    timezoneEstimate: 'UTC+3 (MSK)',
    notes: 'Ransomware infrastructure administrator and affiliate builder. Linked directly to DarkVendor through shared SSH host key (ED25519) and Apache mod_status worker pool.',
    infrastructureIds: ['inf-004'],
    identifiers: [
      { type: 'IP', value: '91.240.118.82', source: 'SSH Host Key Match & Apache Status', isClearnet: true },
      { type: 'DOMAIN', value: 'admin-backdoor-gateway.ru', source: 'Apache mod_status VHost Table', isClearnet: true },
      { type: 'SSH_KEY', value: 'SHA256:7uK89eM31zQPaO819Lka901ZlqMza81920Lka901248', source: 'Censys SSH Key Correlation', isClearnet: true }
    ],
    mitreAttacks: ['T1584.004', 'T1592.002', 'T1588.003', 'T1592.003']
  },
  {
    id: 'act-004',
    handle: 'PhishMaster',
    realNameCandidate: 'Stefan R. / "phish_king_99"',
    category: 'Phishing / Initial Access',
    pgpKey: {
      fingerprint: 'FE10 9284 1029 4810 2948 1029 4810 2948 1029 BEBE',
      keyId: '0x1029BEBE',
      created: '2025-02-14',
      email: 'phishmaster_dev@mail.ch'
    },
    wallets: [
      { currency: 'BTC', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', totalBalance: '12.80 BTC', txCount: 380 }
    ],
    confidenceScore: 84,
    confidenceBreakdown: {
      serverStatus: 80,
      sslCertLeak: 78,
      bannerHash: 84,
      keyReuse: 80,
      clearnetDeps: 90,
      descriptorOverlap: 91,
      timingCorrelation: 82
    },
    lastSeen: '2026-08-28 11:20:03 UTC',
    status: 'MONITORED',
    locationCandidate: 'Bucharest, Romania',
    timezoneEstimate: 'UTC+3 (EEST)',
    notes: 'Reverse proxy evilginx darknet operator. Identified through Tor hidden service descriptor introduction point overlap with DarkVendor instances.',
    infrastructureIds: ['inf-005'],
    identifiers: [
      { type: 'DOMAIN', value: 'login-secure-auth-gateway.org', source: 'Descriptor Cross-Correlation', isClearnet: true },
      { type: 'EMAIL', value: 'phishmaster_dev@mail.ch', source: 'Phishing Kit Readme Leak', isClearnet: true }
    ],
    mitreAttacks: ['T1590.005', 'T1592.004', 'T1588.004']
  },
  {
    id: 'act-005',
    handle: 'RansomGroup',
    realNameCandidate: 'Collective "SilverLock Affiliate Core"',
    category: 'Ransomware',
    pgpKey: {
      fingerprint: 'AA10 9284 1029 4810 2948 1029 4810 2948 1029 F00D',
      keyId: '0x1029F00D',
      created: '2024-08-01',
      email: 'negotiations@ransomgroup-leak.su'
    },
    wallets: [
      { currency: 'BTC', address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', totalBalance: '340.50 BTC', txCount: 920 }
    ],
    confidenceScore: 94,
    confidenceBreakdown: {
      serverStatus: 85,
      sslCertLeak: 90,
      bannerHash: 92,
      keyReuse: 96,
      clearnetDeps: 98,
      descriptorOverlap: 90,
      timingCorrelation: 92
    },
    lastSeen: '2026-08-28 14:10:00 UTC',
    status: 'ACTIVE',
    locationCandidate: 'Samara / Moscow, Russia',
    timezoneEstimate: 'UTC+3 (MSK)',
    notes: 'Double extortion ransomware leak site operator. Deanonymized through clearnet stat-counter tracking script loading with unique campaign token RG_PROD_442.',
    infrastructureIds: ['inf-006'],
    identifiers: [
      { type: 'DOMAIN', value: 'stat-counter-analytics.ru', source: 'HTML DOM Clearnet Asset Leak', isClearnet: true },
      { type: 'DOMAIN', value: 'ransom-negotiate.com', source: 'Tracker ID Shared Infrastructure', isClearnet: true },
      { type: 'IP', value: '194.67.210.15', source: 'Analytics Server IP', isClearnet: true }
    ],
    mitreAttacks: ['T1592.004', 'T1584.004', 'T1588.003']
  }
];

export const INITIAL_INFRASTRUCTURE: InfrastructureItem[] = [
  {
    id: 'inf-001',
    actorId: 'act-001',
    actorHandle: 'DarkVendor',
    onionAddress: 'darkv5x34a5d89hqlk2j891klz90amc98a.onion',
    clearnetDomain: 'darkvendor-shop.is',
    ipAddress: '185.220.101.45',
    hostingProvider: 'Pecan Hosting Ltd (Frankfurt)',
    country: 'Germany',
    ports: [80, 443, 22],
    tlsFingerprint: '8f7a91c0b3419e9124dd7881c1a90ee49b819f71629841d62058e72bf8015ac2',
    sshFingerprint: 'SHA256:7uK89eM31zQPaO819Lka901ZlqMza81920Lka901248',
    httpBanner: 'Apache/2.4.52 (Ubuntu) OpenSSL/3.0.2',
    discoveredVia: 'Apache /server-status & SSL SAN Leak',
    status: 'ONLINE'
  },
  {
    id: 'inf-002',
    actorId: 'act-001',
    actorHandle: 'DarkVendor',
    onionAddress: 'darkv5x34a5d89hqlk2j891klz90amc98a.onion',
    clearnetDomain: 'vps42.frankfurt-hosting.net',
    ipAddress: '194.26.29.114',
    hostingProvider: 'Pecan Hosting Ltd (Frankfurt)',
    country: 'Germany',
    ports: [80, 22],
    tlsFingerprint: '8f7a91c0b3419e9124dd7881c1a90ee49b819f71629841d62058e72bf8015ac2',
    sshFingerprint: 'SHA256:7uK89eM31zQPaO819Lka901ZlqMza81920Lka901248',
    httpBanner: 'Apache/2.4.52 (Ubuntu)',
    discoveredVia: 'Apache /server-status VHost Enumeration',
    status: 'ONLINE'
  },
  {
    id: 'inf-003',
    actorId: 'act-002',
    actorHandle: 'CryptoKing',
    onionAddress: 'cryptokng992ka0192laos99120amx1921.onion',
    clearnetDomain: 'cryptoking-clearnet-escrow.net',
    ipAddress: '193.106.191.22',
    hostingProvider: 'FlokiNET (Reykjavik Datacenter)',
    country: 'Iceland',
    ports: [80, 443],
    tlsFingerprint: '14b9812984012948102948102948102948102948102948102948102948102948',
    sshFingerprint: 'SHA256:4910294810294810294810294810294810294810294',
    httpBanner: 'nginx/1.18.0 (Ubuntu) mod_wsgi/4.7.1 Python/3.8',
    discoveredVia: 'Favicon MurmurHash & WSGI Banner Correlation',
    status: 'ONLINE'
  },
  {
    id: 'inf-004',
    actorId: 'act-003',
    actorHandle: 'ShadowAdmin',
    onionAddress: 'shdwc299xka0912ms88alqo10zxm8291.onion',
    clearnetDomain: 'admin-backdoor-gateway.ru',
    ipAddress: '91.240.118.82',
    hostingProvider: 'Selectel Network (St. Petersburg)',
    country: 'Russia',
    ports: [80, 2222],
    tlsFingerprint: 'e291048102948102948102948102948102948102948102948102948102948102',
    sshFingerprint: 'SHA256:7uK89eM31zQPaO819Lka901ZlqMza81920Lka901248',
    httpBanner: 'Apache/2.4.41 (Debian) mod_perl/2.0.11',
    discoveredVia: 'SSH Host Key Reuse & Apache Server Status',
    status: 'ONLINE'
  },
  {
    id: 'inf-005',
    actorId: 'act-004',
    actorHandle: 'PhishMaster',
    onionAddress: 'phishm899120aklsd912kmasd9102mzk.onion',
    clearnetDomain: 'login-secure-auth-gateway.org',
    ipAddress: '185.107.56.21',
    hostingProvider: 'Voxility Datacenter (Bucharest)',
    country: 'Romania',
    ports: [80, 443],
    tlsFingerprint: '3819024810294810294810294810294810294810294810294810294810294810',
    sshFingerprint: 'SHA256:1948102948102948102948102948102948102948102',
    httpBanner: 'nginx/1.22.0',
    discoveredVia: 'Tor Hidden Service Descriptor Introduction Point Overlap',
    status: 'ONLINE'
  },
  {
    id: 'inf-006',
    actorId: 'act-005',
    actorHandle: 'RansomGroup',
    onionAddress: 'ransomfeed4k891290amcxzq10291480129.onion',
    clearnetDomain: 'ransom-negotiate.com',
    ipAddress: '194.67.210.15',
    hostingProvider: 'TimeWeb Hosting (Moscow)',
    country: 'Russia',
    ports: [80, 443],
    tlsFingerprint: '9481029481029481029481029481029481029481029481029481029481029481',
    sshFingerprint: 'SHA256:8819204810294810294810294810294810294810294',
    httpBanner: 'nginx/1.20.1',
    discoveredVia: 'Clearnet stat-counter Analytics Script Leak',
    status: 'ONLINE'
  }
];

export const INITIAL_LINKAGES: ActorLinkage[] = [
  {
    id: 'lnk-001',
    sourceActorId: 'act-001',
    sourceActorHandle: 'DarkVendor',
    targetActorId: 'act-003',
    targetActorHandle: 'ShadowAdmin',
    linkageType: 'KEY_REUSE',
    evidence: 'Exact identical OpenSSH ED25519 host key (SHA256:7uK89eM31zQPaO819Lka901ZlqMza81920Lka901248) detected on DarkVendor (185.220.101.45) and ShadowAdmin (91.240.118.82).',
    confidence: 99.4,
    discoveredDate: '2026-08-20'
  },
  {
    id: 'lnk-002',
    sourceActorId: 'act-001',
    sourceActorHandle: 'DarkVendor',
    targetActorId: 'act-004',
    targetActorHandle: 'PhishMaster',
    linkageType: 'DESCRIPTOR_OVERLAP',
    evidence: '66.7% Introduction Point overlap and concurrent 3-second delta descriptor update timestamp between darkv5x...onion and phishm899...onion.',
    confidence: 91.2,
    discoveredDate: '2026-08-22'
  },
  {
    id: 'lnk-003',
    sourceActorId: 'act-003',
    sourceActorHandle: 'ShadowAdmin',
    targetActorId: 'act-005',
    targetActorHandle: 'RansomGroup',
    linkageType: 'SHARED_INFRASTRUCTURE',
    evidence: 'Cross-linking of backup admin portal DNS records and shared ASN routing through Selectel network St. Petersburg.',
    confidence: 94.0,
    discoveredDate: '2026-08-25'
  },
  {
    id: 'lnk-004',
    sourceActorId: 'act-002',
    sourceActorHandle: 'CryptoKing',
    targetActorId: 'act-001',
    targetActorHandle: 'DarkVendor',
    linkageType: 'CRYPTO_CLUSTERING',
    evidence: 'Direct automated sweep transactions from DarkVendor hot wallet to CryptoKing Tumbler deposit contract address.',
    confidence: 88.5,
    discoveredDate: '2026-08-15'
  }
];

export const INITIAL_REPORTS: AuditReport[] = [
  {
    id: 'rep-001',
    title: 'Full Deanonymization Dossier: DarkVendor Infrastructure Cluster',
    generatedAt: '2026-08-28 14:45:00 UTC',
    targetService: 'darkv5x34a5d89hqlk2j891klz90amc98a.onion',
    investigator: 'TraceNet Automated OPSEC Engine v2.4',
    findingsCount: 6,
    overallConfidence: 97.8,
    leakedClearnetIps: ['185.220.101.45', '194.26.29.114'],
    leakedDomains: ['darkvendor-shop.is', 'vps42.frankfurt-hosting.net'],
    actorMatches: ['DarkVendor', 'ShadowAdmin'],
    modulesEvaluated: [
      { name: 'Exposed Server-Status', severity: 'CRITICAL', status: 'EXPLOITABLE', summary: 'Leaked live worker table disclosing clearnet vhosts and upstream IPs.' },
      { name: 'SSL Certificate Leakage', severity: 'CRITICAL', status: 'EXPLOITABLE', summary: 'X.509 cert SAN field explicitly lists darkvendor-shop.is registered via Let\'s Encrypt.' },
      { name: 'Service Banner Fingerprinting', severity: 'HIGH', status: 'EXPLOITABLE', summary: 'Exact Apache/2.4.52 (Ubuntu) module chain matched Shodan fingerprint.' },
      { name: 'Cryptographic Key Reuse', severity: 'CRITICAL', status: 'EXPLOITABLE', summary: 'Identical SSH ED25519 key found on physical server in Frankfurt.' },
      { name: 'Descriptor Analysis', severity: 'MEDIUM', status: 'EXPLOITABLE', summary: 'Introduction points shared with PhishMaster onion service.' },
      { name: 'Timing Analysis', severity: 'HIGH', status: 'EXPLOITABLE', summary: 'Diurnal sleep window indicates UTC+2 CEST operational hours.' }
    ],
    executiveSummary: 'Target hidden service darkv5x34a5d89hqlk2j891klz90amc98a.onion is conclusively deanonymized with 97.8% confidence. The physical server is located at 185.220.101.45 hosted under Pecan Hosting Ltd in Frankfurt, Germany. Operator exhibits operational ties to threat actor "ShadowAdmin" via cryptographic SSH key reuse.',
    mitigationPlan: [
      'Immediately restrict /server-status with "Require local" and disable ExtendedStatus.',
      'Revoke the current TLS certificate and deploy a self-signed cert containing strictly CN=*.onion.',
      'Regenerate all SSH host keys using `ssh-keygen -A`.',
      'Migrate Tor instances into isolated virtual machine environments with distinct torrc configurations.'
    ]
  }
];

export const DEFAULT_SETTINGS: LabSettings = {
  dockerHost: 'unix:///var/run/docker.sock',
  composeFilePath: './docker/docker-compose.yml',
  databasePath: './data/tracenet.sqlite3',
  shodanApiKey: 'SIMULATED_SHODAN_KEY_ACTIVE',
  censysApiKey: 'SIMULATED_CENSYS_KEY_ACTIVE',
  onionooApiEndpoint: 'https://onionoo.torproject.org/details',
  theme: 'dark',
  autoCleanupOnExit: true,
  warningDialogs: true,
  telemetryLogging: true
};
