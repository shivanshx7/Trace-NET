# Key Features

## Current prototype

- **Overview dashboard:** summarizes lab status, actor records, infrastructure, and linkages, with shortcuts into the main views.
- **Misconfiguration demonstrations:** seven guided modules cover exposed server-status information, TLS certificate reuse, HTTP fingerprints, Tor descriptor patterns, third-party website dependencies, key reuse, and activity timing. Each module includes an explanation, illustrative evidence, impact, and remediation guidance.
- **Lab control simulator:** shows three example nodes, topology, sample logs, resource-like metrics, and start, stop, and reset controls. State and log activity are simulated in the browser; these controls do not start Docker containers.
- **Actor and infrastructure workspace:** browse and search sample actor dossiers, inspect infrastructure and relationship visualizations, and add or edit actor profiles.
- **Reports and exports:** view a sample investigation summary, print it to PDF through the browser, and download actor or server-clue CSV files or a JSON database backup.
- **Settings and terminal experiences:** provide supporting prototype views for configuration and a simulated CLI.
- **Browser-local data:** actor, infrastructure, linkage, report, and settings records are stored with `localStorage` and are scoped to the browser profile.

## Product principles

- Keep exercises reproducible and safe by using synthetic data and simulated operations.
- Show the evidence behind a finding and pair it with defensive remediation.
- Make uncertainty visible; sample match scores are not proof of identity or attribution.
- Make the prototype's boundaries clear so users do not mistake simulated output for a live scan.

## Not currently implemented

Live Tor or clearnet scanning, real Docker orchestration, external intelligence API queries, a server-backed database, authentication, and verified attribution are not implemented in the current project.
