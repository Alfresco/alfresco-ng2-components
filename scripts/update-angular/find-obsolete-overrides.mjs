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
import { readDependencyEdges, readResolvedVersions } from './lib/lockfile.mjs';
import { parseSelector, readOverrides } from './lib/overrides.mjs';
import { compareVersions, satisfiesRange } from './lib/versions.mjs';

/**
 * Tells whether a version is what an override asks for: at least the target when it is a version, inside it when it is a range.
 * @param version resolved version
 * @param target override target
 * @returns true when the version needs no override
 */
function meetsTarget(version, target) {
    return /^\d+\.\d+\.\d+$/.test(target) ? compareVersions(version, target) >= 0 : satisfiesRange(version, target);
}

/**
 * Lists the versions of a package that the override would apply to, without any override.
 * For a parent selector, only the versions used directly by the matching versions of the parent count.
 * @param selector parsed override key
 * @param resolved versions resolved without overrides, by package name
 * @param edges direct dependencies of every resolved package, or undefined when the lockfile has none
 * @returns the versions, or a reason when they cannot be told
 */
function versionsInScope(selector, resolved, edges) {
    const { name, range, parent, parentRange } = selector;
    if (parent && !edges) {
        return { unknown: `the dependencies of ${parent} cannot be read from the lockfile` };
    }
    const versions = parent
        ? edges
              .filter((edge) => edge.parent === parent && edge.name === name && (!parentRange || satisfiesRange(edge.parentVersion, parentRange)))
              .map((edge) => edge.version)
        : (resolved.get(name) ?? []);

    return { versions: versions.filter((version) => !range || satisfiesRange(version, range)) };
}

/**
 * Decides whether an override is still needed, based on what the dependencies resolve to without any override.
 * @param override override with its key and target
 * @param resolved versions resolved without overrides, by package name
 * @param edges direct dependencies of every resolved package, or undefined when the lockfile has none
 * @returns the override with `obsolete` and the reason of the decision
 */
function judgeOverride(override, resolved, edges) {
    const selector = parseSelector(override.key);
    const { name, range, parent } = selector;
    const decision = (obsolete, reason) => ({ ...override, obsolete, reason });

    if (!/^[<>=~^\d]/.test(override.target)) {
        return decision(false, `target ${override.target} cannot be checked`);
    }
    if (parent && !resolved.has(parent)) {
        return decision(true, `${parent} is no longer in the dependency tree`);
    }
    if (!resolved.has(name)) {
        return decision(true, `${name} is no longer in the dependency tree`);
    }

    const { versions: inScope, unknown } = versionsInScope(selector, resolved, edges);
    if (unknown) {
        return decision(false, unknown);
    }
    if (!inScope.length) {
        const wanted = `${name}${range ? `@${range}` : ''}`;
        return decision(true, parent ? `${override.key.split('>').at(-2)} no longer depends on ${wanted}` : `no ${wanted} is resolved anymore`);
    }

    const tooLow = inScope.filter((version) => !meetsTarget(version, override.target));
    return tooLow.length
        ? decision(false, `still resolves to ${[...new Set(tooLow)].join(', ')} without it`)
        : decision(true, `resolves to ${[...new Set(inScope)].join(', ')} without it`);
}

/**
 * Judges every override of pnpm-workspace.yaml against a lockfile resolved without overrides.
 * @param workspaceFile path of the real pnpm-workspace.yaml
 * @param freshLockfile lockfile resolved from scratch without overrides
 * @param decisionsFile JSON file to write, with one decision per override
 */
function findObsoleteOverrides(workspaceFile, freshLockfile, decisionsFile) {
    const resolved = readResolvedVersions(freshLockfile);
    const edges = readDependencyEdges(freshLockfile);
    const decisions = readOverrides(workspaceFile).map((override) => judgeOverride(override, resolved, edges));

    fs.writeFileSync(decisionsFile, `${JSON.stringify(decisions, null, 2)}\n`);
}

main(findObsoleteOverrides);
