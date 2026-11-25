# Update Angular failure triage

The `triage` job of `.github/workflows/update-angular-nx.yml` classifies every failure of the update run as **auto-fixable**, **escalate** or **blocked**. The classification is deterministic: agents never decide it.

## Pipeline

1. **Parse** (`parse.mjs`): the full logs of the failed steps are parsed into records with `file`, `line`, `symbol`, `code`, `message`, `errorClass` and `category`. Supported shapes: tsc/ngc/ng-packagr, esbuild, Karma, ESLint (stylish), builder schema errors and infrastructure errors. Anything else becomes an `unparsed` record. Each record has a fingerprint built from its error class, code, file, symbol and normalised message.
2. **Classify** (`classify.mjs`): the ordered `RULES` are applied to each record, and the first match wins. Each record gets the rule id and a rationale.
    - Positional signal first: if a check passed after the migration schematics ran, it counts as auto-fixed. A failed update stage is **blocked**, while errors parsed from its log receive their own cause classification. Later validation failures are blocked until the schematics run cleanly.
    - Error class second: renamed APIs and moved imports are mechanical. Removed APIs, changed defaults and behavioural changes are architectural.
    - Ambiguous and unparsed shapes are **escalated**.
3. **Budget**: escalations are grouped into decisions by error class, symbol and file. When there are more decisions than `maxEscalationsPerRun` (or than the `escalation-budget` workflow input, which overrides it), the triage aborts: the run fails with the full report and no agent is dispatched.
4. **Batch** (`batch.mjs`): records are grouped by escalation, file, category and error class into batches. Each batch is sized to fit `agentTimeoutMinutes`. If a coherent batch needs longer, its timeout is raised up to `maxAgentTimeoutMinutes`; beyond that, the batch is split.
5. **Report** (`report.mjs`): `triage-report.md` is added to the pull request body and the job summary. Each escalation gives what broke, why it is architectural, the options with their trade-offs, and a recommendation.
6. **Agents**: one gh-aw run is dispatched per batch and posts one comment on the pull request.
    - `update-angular-triage.md` uses the balanced tier and explains the breaking changes and fixes.
    - `update-angular-parse-assist.md` uses the economy tier and extracts unparsed output.
    - Their output is advisory only.

## Taxonomy

| Category            | Default      |
| ------------------- | ------------ |
| typescript-type     | auto-fixable |
| renamed-removed-api | escalate     |
| schematic-default   | escalate     |
| template            | auto-fixable |
| test-only           | auto-fixable |
| lint                | auto-fixable |
| behavioural-runtime | escalate     |
| infrastructure      | blocked      |
| unclassified        | escalate     |

## Configuration (`scripts/update-angular/triage-config.json`)

- `maxEscalationsPerRun`: escalation budget.
- `agentTimeoutMinutes`, `maxAgentTimeoutMinutes`, `timeoutUtilisation`, `batchOverheadMinutes`, `minutesPerRecord`, `maxRecordsPerBatch`, `maxAgentInvocations`: batch sizing.
- `knownRenames` (`{ "module": "@a/b", "from": "Old", "to": "New" }`, `module` optional) and `knownModuleMoves` (`{ "from": "Symbol", "to": "@a/c" }`): confirmed mechanical changes. Add the ones the agents propose so the next runs classify them as auto-fixable deterministically.
- `localSelectorPrefixes`: selector prefixes treated as local components in template errors.

## Tests and local run

```sh
node --test scripts/update-angular/test/
node scripts/update-angular/triage-failures.mjs <validationDir> <fullLogsDir> <outDir> [budget]
```

The gh-aw sources must be compiled after each change: `gh aw compile update-angular-triage update-angular-parse-assist`.
