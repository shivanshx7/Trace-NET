import { MisconfigModule } from '../types';

export const MISCONFIG_MODULES: MisconfigModule[] = [
  {
    id: 'server-status',
    number: 1,
    title: 'Exposed Server-Status',
    subtitle: 'Apache mod_status & Nginx stub_status Information Disclosure',
    category: 'Infrastructure',
    severity: 'CRITICAL',
    mitreId: 'T1592.002',
    mitreTactic: 'Reconnaissance: Gather Victim Host Info',
    description: 'Apache HTTP Server includes a module called mod_status that generates a web page displaying server statistics, active worker threads, website names, and client IP addresses. If left accessible over the Tor hidden service interface without strict access controls, investigators can extract the real clearnet IP and website names.',
    vulnerabilityOverview: 'By default or through misconfigured `<Location /server-status>` directives, Apache exposes internal process tables, the real machine hostname, client request URIs, and loopback/internal IP addresses. In a Tor hidden service setting, requests to `http://<onion>/server-status` reveal the actual web server state and frequently disclose clearnet website names hosted on the same daemon.',
    attackVector: '1. Scanner sends GET request to http://<onion>/server-status\n2. Server responds with 200 OK containing worker scoreboard and active connections\n3. Analyst extracts the "Server Version", "Server Built", "Current Time", and active Website Names\n4. Cross-referencing the leaked website names and timestamps directly identifies the physical clearnet server IP.',
    impact: 'Direct discovery of the physical server location, server company, and IP address with 95%+ match strength within seconds.',
    remediationCode: `# /etc/apache2/mods-available/status.conf
<IfModule mod_status.c>
    # Restrict server-status exclusively to localhost via unix socket / loopback
    <Location /server-status>
        SetHandler server-status
        Require local
        # Deny all external or proxied hidden service requests
        Require ip 127.0.0.1 ::1
    </Location>
    ExtendedStatus Off
</IfModule>`,
    remediationSteps: [
      'Disable ExtendedStatus in Apache configuration unless strictly debugging locally.',
      'Enforce "Require local" and explicitly bind administrative endpoints to unix sockets.',
      'Configure Tor HiddenServicePort to forward strictly to a dedicated unprivileged website name with custom error documents.',
      'Use a reverse proxy (e.g. Nginx or HAProxy) in front of Apache to strip administrative URI paths.'
    ],
    sampleTargets: [
      {
        name: 'DarkVendor Marketplace (onion1)',
        onion: 'darkv5x34a5d89hqlk2j891klz90amc98a.onion',
        associatedActor: 'DarkVendor',
        simulatedData: {
          serverVersion: 'Apache/2.4.52 (Ubuntu) OpenSSL/3.0.2',
          serverBuilt: 'Jan 15 2024 18:22:01',
          currentLocalTime: 'Friday, 28-Aug-2026 14:42:19 CEST',
          restartTimestamp: 'Friday, 28-Aug-2026 06:10:04 CEST',
          parentServerConfigGen: 2,
          serverUptime: '8 hours 32 minutes 15 seconds',
          totalAccesses: 48921,
          totalTraffic: '142.8 MB',
          cpuLoad: '0.42 0.38 0.40',
          activeWorkers: [
            { srv: '0-0', pid: 14820, acc: '0/142/142', mode: 'W', cpu: 0.12, ss: 2, req: 18, conn: 0.0, child: 0.0, slot: 0.42, client: '127.0.0.1', vhost: 'darkv5x34a5d89hqlk2j891klz90amc98a.onion', request: 'GET /api/v1/market/listings HTTP/1.1' },
            { srv: '0-1', pid: 14821, acc: '1/89/89', mode: 'K', cpu: 0.08, ss: 4, req: 12, conn: 0.0, child: 0.0, slot: 0.28, client: '127.0.0.1', vhost: 'darkv5x34a5d89hqlk2j891klz90amc98a.onion', request: 'POST /user/login HTTP/1.1' },
            { srv: '0-2', pid: 14822, acc: '0/34/34', mode: 'R', cpu: 0.02, ss: 1, req: 2, conn: 0.0, child: 0.0, slot: 0.15, client: '194.26.29.114', vhost: 'darkvendor-shop.is', request: 'GET /status.php HTTP/1.1' },
            { srv: '0-3', pid: 14823, acc: '0/12/12', mode: 'W', cpu: 0.04, ss: 0, req: 1, conn: 0.0, child: 0.0, slot: 0.08, client: '185.220.101.45', vhost: 'vps42.frankfurt-hosting.net', request: 'GET /server-status HTTP/1.1' },
          ],
          leakedVhosts: ['darkv5x34a5d89hqlk2j891klz90amc98a.onion', 'darkvendor-shop.is', 'vps42.frankfurt-hosting.net'],
          leakedIpAddresses: ['185.220.101.45', '194.26.29.114'],
          hostingProvider: 'Pecan Hosting Ltd / Frankfurt Datacenter ASN 48219',
          correlationConfidence: 98
        }
      },
      {
        name: 'ShadowAdmin C2 Panel (onion2)',
        onion: 'shdwc299xka0912ms88alqo10zxm8291.onion',
        associatedActor: 'ShadowAdmin',
        simulatedData: {
          serverVersion: 'Apache/2.4.41 (Debian) mod_perl/2.0.11',
          serverBuilt: 'Nov 12 2023 10:14:02',
          currentLocalTime: 'Friday, 28-Aug-2026 15:42:19 MSK',
          restartTimestamp: 'Thursday, 27-Aug-2026 23:00:12 MSK',
          parentServerConfigGen: 1,
          serverUptime: '16 hours 42 minutes 07 seconds',
          totalAccesses: 12040,
          totalTraffic: '38.4 MB',
          cpuLoad: '0.18 0.22 0.25',
          activeWorkers: [
            { srv: '0-0', pid: 8812, acc: '0/41/41', mode: 'W', cpu: 0.05, ss: 1, req: 8, conn: 0.0, child: 0.0, slot: 0.12, client: '127.0.0.1', vhost: 'shdwc299xka0912ms88alqo10zxm8291.onion', request: 'GET /c2/beacon HTTP/1.1' },
            { srv: '0-1', pid: 8813, acc: '0/15/15', mode: 'W', cpu: 0.03, ss: 0, req: 2, conn: 0.0, child: 0.0, slot: 0.05, client: '91.240.118.82', vhost: 'admin-backdoor-gateway.ru', request: 'POST /api/auth HTTP/1.1' }
          ],
          leakedVhosts: ['shdwc299xka0912ms88alqo10zxm8291.onion', 'admin-backdoor-gateway.ru'],
          leakedIpAddresses: ['91.240.118.82'],
          hostingProvider: 'Selectel ASN 49505 / St. Petersburg',
          correlationConfidence: 96
        }
      }
    ]
  },
  {
    id: 'ssl-certs',
    number: 2,
    title: 'SSL Certificate Leakage',
    subtitle: 'Certificate Names & Certificate Transparency Logs',
    category: 'Cryptography',
    severity: 'CRITICAL',
    mitreId: 'T1588.004',
    mitreTactic: 'Resource Development: Digital Certificates',
    description: 'When operators configure TLS/HTTPS for a Tor hidden service using standard certificates (e.g. Let\'s Encrypt or Wildcard certs), the X.509 certificate frequently contains Certificate Names that enumerate their clearnet domains or shared hostnames.',
    vulnerabilityOverview: 'Tor hidden services (.onion) do not inherently require TLS because the Tor protocol already provides end-to-end encryption. However, administrators often enable HTTPS using existing multi-domain certificates or default website certificates. Scanning the TLS handshake extracts the public certificate, serial number, and Certificate Names list, which can be looked up in public Certificate Transparency (crt.sh) logs to identify all related domains and issuing IP addresses.',
    attackVector: '1. Connect to Tor Hidden Service HTTPS port (443)\n2. Perform TLS handshake and dump leaf X.509 certificate\n3. Parse X509v3 Certificate Names extensions\n4. Query crt.sh and Censys Certificate databases for matches with the Certificate Fingerprint (SHA-256)\n5. Find matching clearnet domains registered with public DNS records.',
    impact: 'Exposes cleartext domain names, registrar details, wildcard hostnames, and IP history.',
    remediationCode: `# Hardened Nginx configuration for .onion hidden service
server {
    listen 127.0.0.1:80;
    server_name darkv5x34a5d89hqlk2j891klz90amc98a.onion;

    # Do not serve clearnet SSL certs on the onion interface.
    # If TLS is strictly required, generate a self-signed cert containing ONLY the .onion name:
    # openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout onion.key -out onion.crt -subj "/CN=*.onion"
    
    # Disable Server header and SSL SNI leakage
    server_tokens off;
    add_header X-Content-Type-Options nosniff;
}`,
    remediationSteps: [
      'Do not reuse clearnet SSL certificates on Tor hidden services.',
      'If using HTTPS over Tor, generate a dedicated self-signed certificate with CN=*.onion and no Certificate Names entries.',
      'Separate Tor web daemons physically or in distinct Docker networks from clearnet web servers.',
      'Ensure web server SNI default fallback does not return a clearnet website certificate.'
    ],
    sampleTargets: [
      {
        name: 'DarkVendor TLS Certificate Inspection',
        onion: 'darkv5x34a5d89hqlk2j891klz90amc98a.onion',
        associatedActor: 'DarkVendor',
        simulatedData: {
          issuer: 'CN=R3, O=Let\'s Encrypt, C=US',
          subject: 'CN=darkvendor-shop.is',
          validFrom: '2026-06-10T12:00:00Z',
          validUntil: '2026-09-08T12:00:00Z',
          serialNumber: '04:8b:2e:91:fa:71:03:d4:ee:90:21',
          sha256Fingerprint: '8f7a91c0b3419e9124dd7881c1a90ee49b819f71629841d62058e72bf8015ac2',
          subjectAltNames: [
            'darkvendor-shop.is',
            'www.darkvendor-shop.is',
            'api.darkvendor-shop.is',
            'mail.darkvendor-portal.net',
            'vps42.frankfurt-hosting.net'
          ],
          crtShLogEntries: [
            { id: 981240182, loggedAt: '2026-06-10 12:04:18 UTC', issuerCaId: 16418, matchedDomain: 'darkvendor-shop.is' },
            { id: 981240195, loggedAt: '2026-06-10 12:04:22 UTC', issuerCaId: 16418, matchedDomain: 'vps42.frankfurt-hosting.net' }
          ],
          resolvedDnsIps: [
            { domain: 'darkvendor-shop.is', ip: '185.220.101.45', country: 'Germany', asn: 'AS48219 Pecan Hosting' },
            { domain: 'api.darkvendor-shop.is', ip: '185.220.101.45', country: 'Germany', asn: 'AS48219 Pecan Hosting' }
          ],
          leakageSeverity: 'CRITICAL',
          confidence: 99
        }
      }
    ]
  },
  {
    id: 'banners',
    number: 3,
    title: 'Server ID Check',
    subtitle: 'HTTP Server Headers, ETags, HTML Hashes & Search Engine Matching',
    category: 'Application Layer',
    severity: 'HIGH',
    mitreId: 'T1590.002',
    mitreTactic: 'Reconnaissance: Gather Victim Network Info',
    description: 'Distinctive HTTP headers, unusual module configurations, custom error pages (404/500), unique ETag calculations, and favicons produce distinct hashes that can be matched against internet-wide port scans on Shodan or Censys.',
    vulnerabilityOverview: 'Standard web servers return verbose `Server`, `X-Powered-By`, and `ETag` headers. For instance, Apache calculates default ETags from inode number, file size, and timestamp (`[inode]-[size]-[mtime]`). Since the inode and file modification time are static across interfaces, querying Shodan with the exact header or ETag string reveals the matching clearnet server IP.',
    attackVector: '1. Send customized HTTP requests (GET, HEAD, OPTIONS) to the hidden service\n2. Extract Server string, exact casing, ETag format, and SHA-256 hash of the 404 error page\n3. Execute Shodan query: http.html_hash:"-19401928" or http.etag:"2a14-5d9c2"\n4. Filter results to locate identical clearnet hosts with matching HTTP response fingerprints.',
    impact: 'Correlates hidden services to clearnet IP addresses without needing administrative vulnerability exploits.',
    remediationCode: `# Nginx hardening
server_tokens off;
more_clear_headers Server;
more_clear_headers X-Powered-By;
etag off;

# Custom generic error pages
error_page 404 /404.html;
error_page 500 502 503 504 /50x.html;`,
    remediationSteps: [
      'Disable Server tokens and remove X-Powered-By headers completely.',
      'Disable ETag generation (`etag off;` in Nginx or `FileETag None` in Apache).',
      'Replace all default web framework error templates with generic minimal static pages.',
      'Ensure favicons and static asset hashes are not shared between onion and clearnet sites.'
    ],
    sampleTargets: [
      {
        name: 'CryptoKing Escrow Service (onion3)',
        onion: 'cryptokng992ka0192laos99120amx1921.onion',
        associatedActor: 'CryptoKing',
        simulatedData: {
          rawHeaders: {
            'Server': 'nginx/1.18.0 (Ubuntu) OpenSSL/1.1.1f mod_wsgi/4.7.1 Python/3.8',
            'X-Powered-By': 'PHP/7.4.3-4ubuntu2.19 / Flask-Custom-Engine',
            'ETag': '"5f9a2b8e-1c44-5d8f99a012"',
            'Content-Type': 'text/html; charset=UTF-8',
            'X-Frame-Options': 'SAMEORIGIN',
            'Favicon-MurmurHash': '-129481920'
          },
          faviconHash: '-129481920',
          httpBodySha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          shodanQuery: 'http.favicon.hash:-129481920 http.header:"mod_wsgi/4.7.1"',
          censysMatches: [
            { ip: '193.106.191.22', port: 443, asn: 'AS200000 / FlokiNET Iceland', domain: 'cryptoking-clearnet-escrow.net', matchScore: 97 },
            { ip: '193.106.191.23', port: 80, asn: 'AS200000 / FlokiNET Iceland', domain: 'backup.cryptoking.is', matchScore: 92 }
          ],
          confidence: 94
        }
      }
    ]
  },
  {
    id: 'descriptors',
    number: 4,
    title: 'Tor Network Patterns',
    subtitle: 'Tor Hidden Service Relays & Connection Relays Overlap',
    category: 'Traffic & Routing',
    severity: 'MEDIUM',
    mitreId: 'T1590.005',
    mitreTactic: 'Reconnaissance: Gather Victim Network Info',
    description: 'Tor v3 hidden services publish encrypted descriptors to Hidden Service Directories (HSDirs). These descriptors contain public keys and a list of Connection Relays. Hidden services operated by the same actor or hosted on the same server instance often select identical sets of connection relays or rotate them on matching schedules.',
    vulnerabilityOverview: 'When an operator runs multiple onion services on the same Tor daemon process, the Tor daemon shares internal consensus state, circuit build schedules, and connection relay selection pools. By querying the Onionoo API and HSDir network for published descriptors of different .onion addresses, investigators detect overlapping connection relays, identical descriptor publish timestamps, and shared circuit lifetime patterns.',
    attackVector: '1. Query Tor HSDir for target Onion A descriptor\n2. Query Tor HSDir for target Onion B descriptor\n3. Extract listed Connection Relays fingerprints and authentication keys\n4. Compute similarity index across relay sets\n5. Analyze timestamp delta of descriptor upload cycles to determine co-location.',
    impact: 'Proves mathematical co-location and joint administration of multiple distinct .onion addresses with high confidence.',
    remediationCode: `# /etc/tor/torrc - Isolate services on independent Tor instances
# Instance 1: /etc/tor/torrc-service1
DataDirectory /var/lib/tor-service1
HiddenServiceDir /var/lib/tor-service1/hidden_service/
HiddenServicePort 80 127.0.0.1:8081

# Instance 2: /etc/tor/torrc-service2
DataDirectory /var/lib/tor-service2
HiddenServiceDir /var/lib/tor-service2/hidden_service/
HiddenServicePort 80 127.0.0.1:8082`,
    remediationSteps: [
      'Run completely separate Tor daemon instances for each onion service.',
      'Ensure distinct DataDirectory paths and independent onion service keys.',
      'Randomize startup times and service reloading schedules to prevent synchronized descriptor updates.',
      'Deploy on separate virtual machines or network namespaces.'
    ],
    sampleTargets: [
      {
        name: 'Tor Network Patterns Co-location',
        onion: 'darkv5x34a5d89hqlk2j891klz90amc98a.onion vs phishm899120aklsd912kmasd9102mzk.onion',
        associatedActor: 'DarkVendor & PhishMaster Co-location',
        simulatedData: {
          onionA: {
            address: 'darkv5x34a5d89hqlk2j891klz90amc98a.onion',
            descriptorId: 'e2910fa89b124890cde198421890acfe9120',
            publishedTime: '2026-08-28 11:20:00 UTC',
            introPoints: [
              { relayFingerprint: 'A8B914E019824AA19820F4910291480129841CDE', nickname: 'FreedomNode01', ip: '185.107.56.21', country: 'Netherlands' },
              { relayFingerprint: '491CDE8910248AA198204910291480129841B914', nickname: 'TorGatewayDE', ip: '194.36.144.8', country: 'Germany' },
              { relayFingerprint: 'F4910291480129841CDEA8B914E019824AA19820', nickname: 'CyberShieldSE', ip: '193.180.118.4', country: 'Sweden' }
            ]
          },
          onionB: {
            address: 'phishm899120aklsd912kmasd9102mzk.onion',
            descriptorId: 'f90184cba1902849102840912401824091824012',
            publishedTime: '2026-08-28 11:20:03 UTC',
            introPoints: [
              { relayFingerprint: 'A8B914E019824AA19820F4910291480129841CDE', nickname: 'FreedomNode01', ip: '185.107.56.21', country: 'Netherlands' },
              { relayFingerprint: '491CDE8910248AA198204910291480129841B914', nickname: 'TorGatewayDE', ip: '194.36.144.8', country: 'Germany' },
              { relayFingerprint: '7721849102984102984102984102984102984120', nickname: 'NordicTorRelay', ip: '185.195.236.10', country: 'Norway' }
            ]
          },
          overlapCount: 2,
          totalIntroPoints: 3,
          overlapPercentage: 66.7,
          timestampDeltaSeconds: 3,
          conclusion: 'High probability (91%) that onion1 and onion2 share the exact same Tor daemon configuration file and parent host process.',
          confidence: 91
        }
      }
    ]
  },
  {
    id: 'clearnet-deps',
    number: 5,
    title: 'External Website Links',
    subtitle: 'Third-Party CDNs, Fonts, Tracking Pixels & External Calls',
    category: 'Application Layer',
    severity: 'CRITICAL',
    mitreId: 'T1592.004',
    mitreTactic: 'Reconnaissance: Gather Victim Host Info',
    description: 'When darknet web applications embed external website links and assets (JavaScript libraries, Google Fonts, Bootstrap CSS, captcha scripts, or crypto ticker websockets) hosted on clearnet CDNs, visiting the site forces user browsers or automated crawlers to make requests to clearnet servers.',
    vulnerabilityOverview: 'Furthermore, if an administrator tests their own site without Tor, or if the server itself fetches remote API endpoints (e.g. BTC rate feeds or webhooks), the administrator\'s direct clearnet IP is logged on the remote CDN server. An investigator with access to CDN logs or by analyzing the DOM can track these external website links.',
    attackVector: '1. Crawl hidden service web pages and extract all `<link>`, `<script>`, `<img>`, and `fetch()` URLs\n2. Identify all non-.onion clearnet FQDNs\n3. Analyze unique API keys, Google Analytics IDs (UA-XXXXX / G-XXXXX), or custom CDN buckets\n4. Correlate CDN account identifiers across clearnet websites.',
    impact: 'Exposes administrative accounts on Cloudflare, Google, FontAwesome, or private AWS S3 buckets.',
    remediationCode: `# Content-Security-Policy header in Nginx to block all clearnet external calls
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self';" always;

# Self-host all fonts, javascript files, and crypto icons locally:
# /assets/fonts/inter.woff2
# /assets/js/bundle.min.js`,
    remediationSteps: [
      'Self-host 100% of all static assets (fonts, icons, JS frameworks, CSS).',
      'Deploy strict Content-Security-Policy (CSP) disallowing all external clearnet origins.',
      'Disable all third-party analytics, captchas, and remote websockets.',
      'Configure egress firewall rules on the web server container to block all outbound WAN traffic except Tor SOCKS proxy.'
    ],
    sampleTargets: [
      {
        name: 'RansomGroup Data Leak Portal (onion4)',
        onion: 'ransomfeed4k891290amcxzq10291480129.onion',
        associatedActor: 'RansomGroup',
        simulatedData: {
          inspectedUrl: 'http://ransomfeed4k891290amcxzq10291480129.onion/victim/financecorp',
          clearnetAssetsFound: [
            { type: 'Stylesheet', url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css', domain: 'cdn.jsdelivr.net', ip: '104.16.89.20', risk: 'MEDIUM' },
            { type: 'Font', url: 'https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap', domain: 'fonts.googleapis.com', ip: '142.250.180.170', risk: 'MEDIUM' },
            { type: 'Tracker/Analytics', url: 'https://stat-counter-analytics.ru/tracker.js?id=RG_PROD_442', domain: 'stat-counter-analytics.ru', ip: '194.67.210.15', risk: 'CRITICAL', evidence: 'Custom tracker ID RG_PROD_442 also present on clearnet ransom-negotiate.com' },
            { type: 'API / WebSocket', url: 'wss://api.crypto-rates-live.io/v1/btc', domain: 'api.crypto-rates-live.io', ip: '172.67.140.21', risk: 'HIGH' }
          ],
          trackerId: 'RG_PROD_442',
          leakedDomains: ['stat-counter-analytics.ru', 'ransom-negotiate.com'],
          clearnetIpCorrelation: '194.67.210.15',
          confidence: 96
        }
      }
    ]
  },
  {
    id: 'key-reuse',
    number: 6,
    title: 'Shared Keys',
    subtitle: 'SSH Host Keys, TLS Public Keys, PGP Keys & Bitcoin Address Clustering',
    category: 'Cryptography',
    severity: 'CRITICAL',
    mitreId: 'T1588.003',
    mitreTactic: 'Resource Development: Code Signing & Cryptographic Material',
    description: 'Threat actors frequently deploy pre-baked VM templates or Docker images that already contain generated SSH host keys, TLS private keys, or PGP public signing keys. These identical cryptographic fingerprints reappear across both dark web and clearnet servers.',
    vulnerabilityOverview: 'SSH servers generate host public keys (`ssh-rsa`, `ecdsa-sha2-nistp256`, `ssh-ed25519`). When an administrator clones a server or misconfigures port forwarding, the Tor hidden service or clearnet interface serves the exact same SSH host key fingerprint. Comparing SSH key fingerprints with search databases reveals every IP address on the internet hosting the identical key.',
    attackVector: '1. Connect to SSH on hidden service port 22 or probe TLS on port 443\n2. Extract SSH public key fingerprint: SHA256:7uK89e... (ED25519)\n3. Query Censys / Shodan: `services.ssh.server_host_key.fingerprint_sha256: 7uK89e...`\n4. Obtain full list of matching IPv4 addresses and server companies.',
    impact: 'Irrefutable mathematical linkage (100% cryptographic certainty) between a hidden service and one or more clearnet IP addresses.',
    remediationCode: `# Generate fresh unique SSH host keys for every single deployment
rm -f /etc/ssh/ssh_host_*
dpkg-reconfigure openssh-server
# Or manually:
ssh-keygen -t ed25519 -f /etc/ssh/ssh_host_ed25519_key -N ""
ssh-keygen -t rsa -b 4096 -f /etc/ssh/ssh_host_rsa_key -N ""

# NEVER expose SSH over the public Tor hidden service interface without onion-client-auth
# torrc:
# HiddenServicePort 22 127.0.0.1:22
# HiddenServiceAuthorizeClient stealth admin_key`,
    remediationSteps: [
      'Regenerate all SSH host keys upon creating a new container or server instance.',
      'Never expose SSH ports directly through standard Tor hidden services without stealth/client authorization.',
      'Never reuse PGP key email identities across public developer forums (e.g. GitHub/GitLab) and darknet forums.',
      'Use wallet mixing and avoid direct address reuse across distinct personas.'
    ],
    sampleTargets: [
      {
        name: 'DarkVendor & ShadowAdmin Shared Key Investigation',
        onion: 'darkv5x34a5d89hqlk2j891klz90amc98a.onion',
        associatedActor: 'DarkVendor / ShadowAdmin',
        simulatedData: {
          sshHostKeyFingerprint: 'SHA256:7uK89eM31zQPaO819Lka901ZlqMza81920Lka901248',
          sshKeyType: 'ssh-ed25519 (256-bit)',
          pgpKeyFingerprint: '8491 0294 1A92 8401 2948  1029 4810 2948 1029 481A',
          matchingHostsFound: [
            { ip: '185.220.101.45', port: 22, hostname: 'vps42.frankfurt-hosting.net', service: 'OpenSSH 8.9p1 Ubuntu-3ubuntu0.1', isClearnet: true },
            { ip: '91.240.118.82', port: 2222, hostname: 'bulletproof-node-03.ru', service: 'OpenSSH 8.9p1 Ubuntu-3ubuntu0.1', isClearnet: true },
            { ip: 'darkv5x34a5d89hqlk2j891klz90amc98a.onion', port: 22, hostname: 'localhost', service: 'OpenSSH 8.9p1', isClearnet: false }
          ],
          crossActorLinkage: 'The SSH key SHA256:7uK89e... was discovered on both DarkVendor infrastructure (Frankfurt) and ShadowAdmin backup proxy (St. Petersburg), proving operational collaboration or shared server provisioning.',
          linkageConfidence: 99.4
        }
      }
    ]
  },
  {
    id: 'timing',
    number: 7,
    title: 'Activity Patterns',
    subtitle: 'Publishing Schedules, Forum Activity & Timezone Inference',
    category: 'Traffic & Routing',
    severity: 'HIGH',
    mitreId: 'T1592.003',
    mitreTactic: 'Reconnaissance: Gather Victim Host Info',
    description: 'Human administrators and automated background jobs operate according to regular daily cycles. By collecting timestamps of Tor hidden service descriptor updates, forum announcements, git commits, and server reboots over weeks or months, statistical models infer the operator\'s working hours and likely geographic timezone.',
    vulnerabilityOverview: 'Even without direct IP leaks, every online action produces a timestamp. Tor v3 descriptors are refreshed every few hours or upon service reboot. Aggregating 1,000+ timestamps into 24-hour activity distribution histograms reveals clear sleep-wake cycles (typically 7-8 hours of zero activity) and peak operational velocity.',
    attackVector: '1. Collect descriptor publication history from Onionoo over 90 days\n2. Scrape timestamped messages from actor darknet forum profiles\n3. Plot hour-of-day (0-23 UTC) activity histogram\n4. Identify the 6-8 hour sleep trough\n5. Shift trough to typical local sleep window (01:00 - 08:00 local) to calculate UTC offset (e.g. UTC+3 MSK or UTC+8 CST).',
    impact: 'Narrows operator location down to specific time zones, operational working shifts, and country candidates.',
    remediationCode: `# Mitigation: Automated random jitter and continuous daemon background tasks
# Avoid restarting onion services manually during working hours
# Use cron with randomized sleeping jitter:
0 4 * * * sleep $((RANDOM % 7200)) && systemctl reload tor`,
    remediationSteps: [
      'Automate all maintenance tasks with randomized jitter to prevent diurnal pattern leaks.',
      'Schedule announcements and forum posts with random delayed queues.',
      'Never perform administrative maintenance exclusively during personal local daytime.',
      'Use multiple administrative personas operating on scheduled shifted timelines.'
    ],
    sampleTargets: [
      {
        name: 'DarkVendor Activity Pattern Analysis (90-Day Sample)',
        onion: 'darkv5x34a5d89hqlk2j891klz90amc98a.onion',
        associatedActor: 'DarkVendor',
        simulatedData: {
          totalDataPoints: 1240,
          samplePeriod: 'May 2026 - Aug 2026',
          activityByUtcHour: [
            { hour: 0, events: 14, activeScore: 0.15 },
            { hour: 1, events: 8, activeScore: 0.08 },
            { hour: 2, events: 3, activeScore: 0.03 },
            { hour: 3, events: 1, activeScore: 0.01 },
            { hour: 4, events: 2, activeScore: 0.02 },
            { hour: 5, events: 0, activeScore: 0.00 },
            { hour: 6, events: 4, activeScore: 0.04 },
            { hour: 7, events: 12, activeScore: 0.12 },
            { hour: 8, events: 48, activeScore: 0.52 },
            { hour: 9, events: 82, activeScore: 0.88 },
            { hour: 10, events: 110, activeScore: 1.00 },
            { hour: 11, events: 98, activeScore: 0.92 },
            { hour: 12, events: 65, activeScore: 0.68 },
            { hour: 13, events: 88, activeScore: 0.86 },
            { hour: 14, events: 94, activeScore: 0.91 },
            { hour: 15, events: 89, activeScore: 0.87 },
            { hour: 16, events: 72, activeScore: 0.74 },
            { hour: 17, events: 61, activeScore: 0.63 },
            { hour: 18, events: 45, activeScore: 0.46 },
            { hour: 19, events: 38, activeScore: 0.39 },
            { hour: 20, events: 31, activeScore: 0.32 },
            { hour: 21, events: 24, activeScore: 0.25 },
            { hour: 22, events: 19, activeScore: 0.20 },
            { hour: 23, events: 16, activeScore: 0.17 }
          ],
          inferredSleepWindowUtc: '02:00 - 07:00 UTC',
          estimatedTimezoneOffset: 'UTC+2 or UTC+3 (Eastern Europe / Moscow / East Africa)',
          confidenceScore: 89,
          regionalCandidates: ['Germany / Poland (CEST: UTC+2)', 'Russia (MSK: UTC+3)', 'Romania / Ukraine (EEST: UTC+3)']
        }
      }
    ]
  }
];
