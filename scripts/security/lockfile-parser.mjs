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
    const lastAtIndex = fullPath.lastIndexOf('@');
    const packageName = isScoped
        ? fullPath.substring(0, lastAtIndex)
        : fullPath.split('@')[0];

    return { name: packageName, version: versionMatch[1] };
}

// ============================================================================
// LOCKFILE READING
// ============================================================================

function extractPackagePathFromLine(line) {
    const trimmed = line.trim();

    if (!trimmed.startsWith("'/") && !trimmed.startsWith('/')) {
        return null;
    }

    const startIndex = trimmed.indexOf('/') + 1;
    const endQuoteIndex = trimmed.indexOf("'", startIndex);
    const endParenIndex = trimmed.indexOf('(', startIndex);

    let endIndex = trimmed.length;
    if (endQuoteIndex > 0) endIndex = Math.min(endIndex, endQuoteIndex);
    if (endParenIndex > 0) endIndex = Math.min(endIndex, endParenIndex);

    return trimmed.substring(startIndex, endIndex);
}

export function readAllPackagesFromLockfile(lockfilePath) {
    try {
        const lockfileContent = readFileSync(lockfilePath, 'utf-8');
        const packages = [];
        const lines = lockfileContent.split('\n');

        for (const line of lines) {
            const packagePath = extractPackagePathFromLine(line);

            if (packagePath) {
                const parsedPackage = parsePackagePathEntry(packagePath);

                if (parsedPackage) {
                    packages.push(parsedPackage);
                }
            }
        }

        return packages;
    } catch {
        return [];
    }
}

export function readChangedPackagesFromGitDiff() {
    try {
        const diffOutput = execSync('/usr/bin/git diff --cached pnpm-lock.yaml', { encoding: 'utf-8' });
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
