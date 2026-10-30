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
import { readResolvedVersions } from './lib/lockfile.mjs';
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
 * Decides whether an override is still needed, based on what the dependencies resolve to without any override.
 * @param override override with its key and target
 * @param resolved versions resolved without overrides, by package name
 * @returns the override with `obsolete` and the reason of the decision
 */
function judgeOverride(override, resolved) {
    const { name, range, parent } = parseSelector(override.key);
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

    const inScope = resolved.get(name).filter((version) => !range || satisfiesRange(version, range));
    if (!inScope.length) {
        return decision(true, `no version of ${name} matching ${range} is resolved anymore`);
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
    const decisions = readOverrides(workspaceFile).map((override) => judgeOverride(override, resolved));

    fs.writeFileSync(decisionsFile, `${JSON.stringify(decisions, null, 2)}\n`);
}

main(findObsoleteOverrides);
