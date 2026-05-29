#!/usr/bin/env node

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
 * Pre-install Security Check
 *
 * Runs BEFORE packages install. Checks both package.json AND package-lock.json
 * against OSV + GitHub Advisory databases to block malicious packages
 * BEFORE their postinstall scripts can execute.
 *
 * Checking package.json catches new dependencies added during upgrades
 * (e.g., nx migrate) before the lockfile is updated.
 */

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const CACHE_DIR = join(ROOT_DIR, 'node_modules', '.cache', 'security-check');
const CACHE_TTL = 24 * 60 * 60 * 1000;

const KNOWN_MALICIOUS = new Set([
    'event-stream@3.3.6',
    'flatmap-stream@0.1.1',
    'ua-parser-js@0.7.29',
    'coa@2.0.3', 'coa@2.0.4', 'coa@2.1.1', 'coa@2.1.3', 'coa@3.0.1', 'coa@3.1.3',
    'rc@1.2.9', 'rc@1.3.9', 'rc@2.3.9',
    'colors@1.4.1', 'colors@1.4.2',
    'faker@5.5.3', 'faker@6.6.6',
    'node-ipc@10.1.1', 'node-ipc@10.1.2', 'node-ipc@10.1.3',
    'peacenotwar@9.1.3', 'peacenotwar@9.1.4', 'peacenotwar@9.1.5', 'peacenotwar@9.1.6',
    'es5-ext@0.10.53', 'es5-ext@0.10.54', 'es5-ext@0.10.55', 'es5-ext@0.10.56',
    '@primevue/themes@4.3.0', '@nicolo-ribaudo/chokidar-2@2.1.8-no-fsevents.3'
]);

// ============================================================================
// FILE UTILITIES
// ============================================================================

function readJsonFile(filePath) {
    try {
        return JSON.parse(readFileSync(filePath, 'utf8'));
    } catch {
        return null;
    }
}

function writeJsonFile(filePath, data) {
    try {
        writeFileSync(filePath, JSON.stringify(data));
        return true;
    } catch {
        return false;
    }
}

function ensureDirectory(path) {
    try {
        mkdirSync(path, { recursive: true });
        return true;
    } catch {
        return false;
    }
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

function readCache() {
    const data = readJsonFile(join(CACHE_DIR, 'threats.json'));

    if (!data || Date.now() - data.timestamp >= CACHE_TTL) {
        return null;
    }

    return {
        threats: new Set(data.threats),
        ranges: data.ranges || []
    };
}

function writeCache(threats, ranges) {
    ensureDirectory(CACHE_DIR);
    writeJsonFile(join(CACHE_DIR, 'threats.json'), {
        timestamp: Date.now(),
        threats: [...threats],
        ranges
    });
}

// ============================================================================
// SECURITY PROVIDERS
// ============================================================================

function splitIntoBatches(items, batchSize) {
    const batches = [];
    for (let index = 0; index < items.length; index += batchSize) {
        batches.push(items.slice(index, index + batchSize));
    }
    return batches;
}

async function fetchOSV(projectDependencies) {
    if (!projectDependencies?.length) {
        return new Set();
    }

    const malicious = new Set();

    try {
        const batches = splitIntoBatches(projectDependencies, 1000);

        for (const batch of batches) {
            const response = await fetch('https://api.osv.dev/v1/querybatch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    queries: batch.map(dep => ({
                        package: { name: dep.name, ecosystem: 'npm' },
                        version: dep.version
                    }))
                }),
                signal: AbortSignal.timeout(30000)
            });

            if (!response.ok) continue;

            const data = await response.json();
            for (const result of data.results || []) {
                for (const vuln of result.vulns || []) {
                    const summary = [vuln.summary || '', vuln.details || ''].join(' ').toLowerCase();
                    const isMalware = ['malware', 'malicious', 'compromised', 'supply chain', 'backdoor']
                        .some(keyword => summary.includes(keyword));

                    if (isMalware && vuln.affected) {
                        for (const affected of vuln.affected) {
                            if (affected.package?.ecosystem === 'npm' && affected.package?.name) {
                                for (const version of affected.versions || []) {
                                    malicious.add(`${affected.package.name}@${version}`);
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch {
        // Ignore errors
    }

    return malicious;
}

async function fetchGitHubAdvisory() {
    try {
        const response = await fetch('https://api.github.com/advisories?ecosystem=npm&type=malware&per_page=100', {
            headers: { 'Accept': 'application/vnd.github+json' },
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            return new Set();
        }

        const advisories = await response.json();
        const malicious = new Set();

        for (const advisory of advisories) {
            for (const vuln of advisory.vulnerabilities || []) {
                if (vuln.package?.ecosystem === 'npm' && vuln.package?.name && vuln.vulnerable_version_range) {
                    malicious.add(`${vuln.package.name}:${vuln.vulnerable_version_range}`);
                }
            }
        }

        return malicious;
    } catch {
        return new Set();
    }
}

// ============================================================================
// VERSION COMPARISON
// ============================================================================

function compareVersions(versionA, versionB) {
    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);
    const maxLength = Math.max(partsA.length, partsB.length);

    let result = 0;

    for (let index = 0; index < maxLength && result === 0; index++) {
        const numA = partsA[index] || 0;
        const numB = partsB[index] || 0;
        result = Math.sign(numA - numB);
    }

    return result;
}

function parseVersionRange(range, version) {
    if (!range || !version) return false;

    const parts = range.split(',').map(part => part.trim());

    for (const part of parts) {
        const match = part.match(/^([<>=]+)\s*(\S+)$/);

        if (!match) {
            if (part === version) return true;
            continue;
        }

        const [, operator, rangeVersion] = match;
        const comparison = compareVersions(version, rangeVersion);

        const checks = {
            '=': comparison === 0,
            '<': comparison < 0,
            '<=': comparison <= 0,
            '>': comparison > 0,
            '>=': comparison >= 0
        };

        if (!checks[operator]) return false;
    }

    return true;
}

// ============================================================================
// PACKAGE EXTRACTION
// ============================================================================

function extractVersionNumber(versionSpec) {
    if (!versionSpec) return null;

    const match = versionSpec.match(/(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*))?/);
    return match ? match[0] : null;
}

function getPackagesFromPackageJson() {
    const packageJson = readJsonFile(join(ROOT_DIR, 'package.json'));

    if (!packageJson) {
        return [];
    }

    const depTypes = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];

    return depTypes
        .flatMap(depType => Object.entries(packageJson[depType] || {}))
        .filter(([, versionSpec]) =>
            typeof versionSpec === 'string' &&
            !versionSpec.startsWith('file:') &&
            !versionSpec.startsWith('link:')
        )
        .map(([name, versionSpec]) => ({
            name,
            version: extractVersionNumber(versionSpec),
            source: 'package.json'
        }))
        .filter(pkg => pkg.version);
}

function getPackagesFromLockfile() {
    const lockfile = readJsonFile(join(ROOT_DIR, 'package-lock.json'));

    if (!lockfile) {
        return [];
    }

    const packages = [];

    if (lockfile.packages) {
        for (const [path, info] of Object.entries(lockfile.packages)) {
            if (!path || path === '' || !info.version) continue;

            packages.push({
                name: path.replace(/^node_modules\//, '').replace(/\/node_modules\//g, '/'),
                version: info.version,
                source: 'lockfile'
            });
        }
    }

    if (lockfile.dependencies) {
        const extractDeps = (deps, prefix = '') => {
            for (const [name, info] of Object.entries(deps)) {
                const fullName = prefix ? `${prefix}/${name}` : name;

                if (info.version) {
                    packages.push({ name: fullName, version: info.version, source: 'lockfile' });
                }

                if (info.dependencies) {
                    extractDeps(info.dependencies, fullName);
                }
            }
        };
        extractDeps(lockfile.dependencies);
    }

    return packages;
}

function getAllPackages() {
    const packageJsonPkgs = getPackagesFromPackageJson();
    const lockfilePkgs = getPackagesFromLockfile();

    const seen = new Map();

    for (const pkg of lockfilePkgs) {
        seen.set(`${pkg.name}@${pkg.version}`, pkg);
    }

    for (const pkg of packageJsonPkgs) {
        const key = `${pkg.name}@${pkg.version}`;
        if (!seen.has(key)) {
            seen.set(key, pkg);
        }
    }

    return [...seen.values()];
}

// ============================================================================
// VIOLATION DETECTION
// ============================================================================

function findViolations(packages, threats, ghRanges) {
    const violations = [];

    for (const pkg of packages) {
        const exactKey = `${pkg.name}@${pkg.version}`;

        if (threats.has(exactKey)) {
            violations.push({ ...pkg, detectionSource: 'exact match' });
            continue;
        }

        for (const entry of ghRanges) {
            const [name, range] = entry.split(':');
            if (pkg.name === name && parseVersionRange(range, pkg.version)) {
                violations.push({ ...pkg, detectionSource: 'GitHub Advisory' });
                break;
            }
        }
    }

    return violations;
}

// ============================================================================
// REPORTING
// ============================================================================

function reportViolations(violations) {
    console.log('\n' + '!'.repeat(70));
    console.log('🚨 MALICIOUS PACKAGES DETECTED - BLOCKING INSTALLATION');
    console.log('!'.repeat(70) + '\n');

    for (const pkg of violations) {
        console.log(`  ❌ ${pkg.name}@${pkg.version} (${pkg.detectionSource})`);
    }

    console.log('\nThese packages are known to contain malware or malicious code.');
    console.log('Installation has been blocked to protect your system.\n');
    console.log('Actions:');
    console.log('  1. Remove these packages from package.json');
    console.log('  2. Find safe alternatives');
    console.log('  3. Run npm install again\n');
    console.log('='.repeat(70) + '\n');
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
    console.log('\n🔒 ADF SECURITY CHECK');
    console.log('='.repeat(70));
    console.log('Scanning for known supply chain attacks and compromised packages...\n');

    const packages = getAllPackages();

    if (!packages.length) {
        console.log('  ⚠️  No packages found to check');
        console.log('='.repeat(70) + '\n');
        process.exit(0);
    }

    const fromPackageJson = packages.filter(pkg => pkg.source === 'package.json').length;
    const fromLockfile = packages.filter(pkg => pkg.source === 'lockfile').length;
    console.log(`  Checking ${packages.length} packages (${fromPackageJson} from package.json, ${fromLockfile} from lockfile)\n`);

    const cache = readCache();
    let threats;
    let ghRanges;

    if (cache) {
        threats = cache.threats;
        ghRanges = cache.ranges;
        console.log(`  Using cached security database (${threats.size} exact + ${ghRanges.length} ranges)\n`);
    } else {
        console.log('  Fetching latest security databases...\n');

        const [osvThreats, ghThreats] = await Promise.all([
            fetchOSV(packages).then(result => { console.log(`  📡 OSV: ${result.size} malware entries`); return result; }),
            fetchGitHubAdvisory().then(result => { console.log(`  📡 GitHub Advisory: ${result.size} malware entries`); return result; })
        ]);

        threats = new Set([...KNOWN_MALICIOUS, ...osvThreats]);
        ghRanges = [...ghThreats];

        writeCache(threats, ghRanges);
    }

    const violations = findViolations(packages, threats, ghRanges);

    if (violations.length) {
        reportViolations(violations);
        process.exit(1);
    }

    console.log(`\n✅ Security check passed (${threats.size} exact + ${ghRanges.length} ranges checked)`);
    console.log('='.repeat(70) + '\n');
}

main().catch(error => {
    console.error('Security check error:', error.message);
    process.exit(0);
});
