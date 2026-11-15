# Success Criteria

Success is measured against the current educational prototype, with all tests performed using bundled or user-entered authorized sample data.

## Core acceptance criteria

- A first-time user can identify the app as a simulated forensic learning lab and find its seven demonstration modules from the main navigation.
- Each demonstration module presents a description, illustrative evidence or attack concept, impact, and at least one remediation step.
- Starting, stopping, and resetting the lab updates the displayed node states and logs without invoking a Docker daemon or contacting external targets.
- Users can search/filter actor records, open the graph view, and add or edit an actor profile; changes persist in browser-local storage after refresh.
- Reports can be printed, and actor CSV, infrastructure CSV, and JSON backup downloads can be initiated from the Reports view.
- Sample data and confidence scores are clearly understood as synthetic examples, not verified real-world identities or attribution.

## Suggested usability measures

- At least 4 of 5 representative learners can find a requested demo and explain its defensive remediation without assistance.
- At least 4 of 5 representative learners correctly identify the lab as simulated and understand that it does not scan live services.
- A user can complete each core scenario in `user-scenarios.md` without a blocking error.

## Out of scope for prototype success

Live service discovery, real container health, external API accuracy, investigative attribution accuracy, and multi-user or server-side persistence are not success claims for this version.
