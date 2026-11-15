# Problem and Target Users

## Problem

Security learners and defenders need a safe way to understand how operational mistakes can expose information about a service. In real investigations, clues such as verbose status endpoints, reused TLS certificates, distinctive HTTP responses, shared external assets, reused keys, and activity timing may be correlated. Learning these ideas against live systems can be unsafe, legally restricted, or difficult to reproduce.

TraceNet addresses this learning and demonstration problem with a browser-based forensic lab. It presents illustrative evidence and lets users explore how separate clues are represented, related, and summarized. The current project is a front-end prototype: its lab controls and findings use local sample data and a Docker simulator, rather than performing live Tor, internet, or container operations.

## Target users

- **Cybersecurity students and instructors** who need repeatable demonstrations of service configuration risks and evidence correlation.
- **Defensive security teams** who want to explain operational exposure patterns and remediation concepts in a controlled environment.
- **Authorized research and tabletop exercise teams** who need sample actor, infrastructure, linkage, and report records to support a discussion.

## User needs

- Explore realistic-looking evidence without probing real services.
- Understand what each finding claims, what evidence supports it, and how to remediate the underlying configuration issue.
- Organize sample indicators and relationships in a searchable, visual workspace.
- Export a report or structured dataset for review and teaching.

## Scope and limits

All bundled actors, domains, addresses, fingerprints, and findings should be treated as synthetic demonstration data unless independently verified. The interface's confidence values are sample fields, not validated attribution. The current app does not establish real-world identity or provide an operational investigation service.
