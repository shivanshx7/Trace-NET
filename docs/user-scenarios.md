# User Scenarios

## 1. Instructor demonstrates an exposed status endpoint

As an instructor, I want to open the server-status module and walk through its sample response so that learners can identify why administrative endpoints should be restricted.

**Flow:** Open Demos → select **Exposed Server-Status** → inspect the example response and impact → review remediation steps.

**Expected result:** The learner can explain which fields are illustrative clues and identify at least one relevant hardening step. No live target is contacted.

## 2. Student compares evidence modules

As a student, I want to compare several misconfiguration examples so that I can see how different evidence types may be correlated and where each technique has limits.

**Flow:** Open Demos → review certificate leakage, HTTP fingerprints, external dependencies, key reuse, descriptor patterns, and timing examples → note the evidence and remediation for each.

**Expected result:** The student can distinguish evidence categories and understands that the bundled examples and confidence scores are synthetic, not validated conclusions.

## 3. Defender explores the simulated lab

As a defensive analyst, I want to start, stop, or reset the lab simulation and inspect its sample topology and logs so that I can use a consistent scenario in a tabletop exercise.

**Flow:** Open Lab Control → start or reset the simulation → filter the displayed logs → review the three example nodes.

**Expected result:** Simulated node status and sample log activity update in the interface. No Docker daemon or network target is accessed.

## 4. Researcher organizes a sample dossier

As an authorized researcher, I want to search actor records, inspect their infrastructure and graph relationships, and add a profile so that I can organize exercise data in one place.

**Flow:** Open Actor Dossiers → search or filter profiles → inspect a profile or graph → add/edit a profile.

**Expected result:** The interface displays the selected records and saves supported edits in browser-local storage. Refreshing in the same browser retains the saved records.

## 5. Analyst shares a report snapshot

As an analyst, I want to print the sample report or export records so that I can discuss the exercise results outside the app.

**Flow:** Open Reports → review the selected report → print/save as PDF, export actor/server CSV, or download the JSON backup.

**Expected result:** The browser produces the selected output from the current sample/local data, and the analyst can label it as an exercise artifact.
