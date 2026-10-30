/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'node:fs';
import { main } from './lib/cli.mjs';
import { removeOverrides } from './lib/overrides.mjs';

/**
 * Builds a markdown table of override decisions.
 * @param decisions decisions with the override key, target and reason
 * @returns markdown lines
 */
function decisionsTable(decisions) {
    return [
        '| Override | Target | Reason |',
        '| --- | --- | --- |',
        ...decisions.map((decision) => `| \`${decision.key}\` | \`${decision.target}\` | ${decision.reason} |`)
    ];
}

/**
 * Builds the markdown section about the removed and the kept overrides.
 * @param removed obsolete overrides
 * @param kept overrides that are still needed
 * @returns markdown
 */
function buildSection(removed, kept) {
    const removedText = removed.length
        ? `Removed ${removed.length} obsolete override(s) from \`pnpm-workspace.yaml\`:\n\n${decisionsTable(removed).join('\n')}`
        : 'No override was obsolete.';
    const keptText = kept.length
        ? `<details><summary>Overrides still needed (${kept.length})</summary>\n\n${decisionsTable(kept).join('\n')}\n\n</details>\n`
        : '';

    return `### Overrides\n\n${removedText}\n\n${keptText}`;
}

/**
 * Removes the obsolete overrides from pnpm-workspace.yaml and writes the markdown section for the report.
 * @param workspaceFile path of pnpm-workspace.yaml
 * @param decisionsFile JSON file written by find-obsolete-overrides
 * @param reportFile markdown file to write
 */
function removeObsoleteOverrides(workspaceFile, decisionsFile, reportFile) {
    const decisions = JSON.parse(fs.readFileSync(decisionsFile, 'utf8'));
    const removed = decisions.filter((decision) => decision.obsolete);
    const kept = decisions.filter((decision) => !decision.obsolete);

    removeOverrides(
        workspaceFile,
        removed.map((decision) => decision.key)
    );
    fs.writeFileSync(reportFile, buildSection(removed, kept));
}

main(removeObsoleteOverrides);
