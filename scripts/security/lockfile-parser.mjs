/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/**
 * Lockfile parser - extracts package information from pnpm-lock.yaml.
 */

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// ============================================================================
// PACKAGE NAME PARSING
// ============================================================================

function parsePackagePathEntry(fullPath) {
    const lastAtIndex = fullPath.lastIndexOf('@');

    if (lastAtIndex <= 0) {
        return null;
    }

    const packageName = fullPath.substring(0, lastAtIndex);
    const packageVersion = fullPath.substring(lastAtIndex + 1);

    return { name: packageName, version: packageVersion };
}

function parsePackageFromDiffLine(line) {
    const packagePathMatch = line.match(/^\+\s+'?\/([^']+)'?:/);

    if (!packagePathMatch) {
        return null;
    }

    const fullPath = packagePathMatch[1];
    const versionMatch = fullPath.match(/@(\d+\.\d+\.\d+[^/]*)/);

    if (!versionMatch) {
        return null;
    }

    const isScoped = fullPath.startsWith('@');
    const packageName = isScoped
        ? fullPath.replace(/@[^/]+$/, '')
        : fullPath.split('@')[0];

    return { name: packageName, version: versionMatch[1] };
}

// ============================================================================
// LOCKFILE READING
// ============================================================================

export function readAllPackagesFromLockfile(lockfilePath) {
    try {
        const lockfileContent = readFileSync(lockfilePath, 'utf-8');
        const packages = [];
        const packagePathRegex = /^\s+'?\/([^'(]+)'/gm;

        let match;
        while ((match = packagePathRegex.exec(lockfileContent)) !== null) {
            const parsedPackage = parsePackagePathEntry(match[1]);

            if (parsedPackage) {
                packages.push(parsedPackage);
            }
        }

        return packages;
    } catch {
        return [];
    }
}

export function readChangedPackagesFromGitDiff() {
    try {
        const diffOutput = execSync('git diff --cached pnpm-lock.yaml', { encoding: 'utf-8' });
        const changedPackages = [];
        const diffLines = diffOutput.split('\n');

        for (const line of diffLines) {
            const isAddedLine = line.startsWith('+') && !line.startsWith('+++');

            if (isAddedLine) {
                const parsedPackage = parsePackageFromDiffLine(line);

                if (parsedPackage) {
                    changedPackages.push(parsedPackage);
                }
            }
        }

        return changedPackages;
    } catch {
        return [];
    }
}
