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

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const CACHE_DIR = join(ROOT_DIR, 'node_modules', '.cache', 'security-check');
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Known supply chain attack packages (fallback if APIs fail)
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

function readCache() {
    const cachePath = join(CACHE_DIR, 'threats.json');
    if (!existsSync(cachePath)) return null;
    try {
        const data = JSON.parse(readFileSync(cachePath, 'utf8'));
        if (Date.now() - data.timestamp < CACHE_TTL) {
            return {
                threats: new Set(data.threats),
                ranges: data.ranges || []
            };
        }
    } catch { /* ignore */ }
    return null;
}

function writeCache(threats, ranges) {
    try {
        if (!existsSync(CACHE_DIR)) {
            mkdirSync(CACHE_DIR, { recursive: true });
        }
        writeFileSync(join(CACHE_DIR, 'threats.json'), JSON.stringify({
            timestamp: Date.now(),
            threats: [...threats],
            ranges: ranges
        }));
    } catch { /* ignore */ }
}

async function fetchOSV(projectDependencies) {
    // Query OSV batch API for the project's actual dependencies
    if (!projectDependencies || projectDependencies.length === 0) {
        return new Set();
    }

    const malicious = new Set();

    try {
        // Process in batches of 1000
        const batchSize = 1000;
        for (let i = 0; i < projectDependencies.length; i += batchSize) {
            const batch = projectDependencies.slice(i, i + batchSize);
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
                    const isMalware = summary.includes('malware') ||
                        summary.includes('malicious') ||
                        summary.includes('compromised') ||
                        summary.includes('supply chain') ||
                        summary.includes('backdoor');

                    if (isMalware && vuln.affected) {
                        for (const affected of vuln.affected) {
                            if (affected.package?.ecosystem === 'npm' && affected.package?.name) {
                                const versions = affected.versions || [];
                                for (const v of versions) {
                                    malicious.add(`${affected.package.name}@${v}`);
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch {
        // Ignore errors, return what we have
    }

    return malicious;
}

async function fetchGitHubAdvisory() {
    try {
        const response = await fetch('https://api.github.com/advisories?ecosystem=npm&type=malware&per_page=100', {
            headers: { 'Accept': 'application/vnd.github+json' },
            signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) return new Set();

        const advisories = await response.json();
        const malicious = new Set();

        for (const advisory of advisories) {
            if (advisory.vulnerabilities) {
                for (const vuln of advisory.vulnerabilities) {
                    if (vuln.package?.ecosystem === 'npm' && vuln.package?.name) {
                        // GitHub uses version ranges, we'll mark the package name
                        // and check ranges in the scan
                        if (vuln.vulnerable_version_range) {
                            malicious.add(`${vuln.package.name}:${vuln.vulnerable_version_range}`);
                        }
                    }
                }
            }
        }
        return malicious;
    } catch {
        return new Set();
    }
}

function parseVersionRange(range, version) {
    // Simple version range parser for GitHub advisory format
    // Handles: "= 1.0.0", "< 1.0.0", "<= 1.0.0", "> 1.0.0", ">= 1.0.0"
    if (!range || !version) return false;

    const parts = range.split(',').map(p => p.trim());
    for (const part of parts) {
        const match = part.match(/^([<>=]+)\s*(\S+)$/);
        if (!match) {
            if (part === version) return true;
            continue;
        }
        const [, op, rangeVer] = match;
        const cmp = compareVersions(version, rangeVer);

        if (op === '=' && cmp !== 0) return false;
        if (op === '<' && cmp >= 0) return false;
        if (op === '<=' && cmp > 0) return false;
        if (op === '>' && cmp <= 0) return false;
        if (op === '>=' && cmp < 0) return false;
    }
    return true;
}

function compareVersions(a, b) {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const na = pa[i] || 0;
        const nb = pb[i] || 0;
        if (na > nb) return 1;
        if (na < nb) return -1;
    }
    return 0;
}

function extractVersionNumber(versionSpec) {
    if (!versionSpec) return null;
    // Remove ^, ~, >=, <=, >, <, = prefixes
    // Use atomic pattern to prevent backtracking: match version then optional prerelease
    const match = versionSpec.match(/(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*))?/);
    return match ? match[0] : null;
}

function getPackagesFromPackageJson() {
    const packageJsonPath = join(ROOT_DIR, 'package.json');
    if (!existsSync(packageJsonPath)) return [];

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const packages = [];

    const depTypes = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
    for (const depType of depTypes) {
        const deps = packageJson[depType] || {};
        for (const [name, versionSpec] of Object.entries(deps)) {
            // Skip file: and link: dependencies
            if (typeof versionSpec === 'string' && !versionSpec.startsWith('file:') && !versionSpec.startsWith('link:')) {
                const version = extractVersionNumber(versionSpec);
                if (version) {
                    packages.push({ name, version, source: 'package.json' });
                }
            }
        }
    }

    return packages;
}

function getPackagesFromLockfile() {
    const lockfilePath = join(ROOT_DIR, 'package-lock.json');
    if (!existsSync(lockfilePath)) {
        return [];
    }

    const lockfile = JSON.parse(readFileSync(lockfilePath, 'utf8'));
    const packages = [];

    // npm v2+ lockfile format
    if (lockfile.packages) {
        for (const [path, info] of Object.entries(lockfile.packages)) {
            if (!path || path === '') continue; // skip root
            const name = path.replace(/^node_modules\//, '').replace(/\/node_modules\//g, '/');
            if (info.version) {
                packages.push({ name, version: info.version, source: 'lockfile' });
            }
        }
    }

    // npm v1 lockfile format
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

    // Combine and dedupe (lockfile takes precedence for same name)
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

async function main() {
    console.log('\n🔒 ADF SECURITY CHECK');
    console.log('='.repeat(70));
    console.log('Scanning for known supply chain attacks and compromised packages...\n');

    // Get all packages from both package.json and lockfile
    const packages = getAllPackages();
    if (packages.length === 0) {
        console.log('  ⚠️  No packages found to check');
        console.log('='.repeat(70) + '\n');
        process.exit(0);
    }

    const fromPackageJson = packages.filter(p => p.source === 'package.json').length;
    const fromLockfile = packages.filter(p => p.source === 'lockfile').length;
    console.log(`  Checking ${packages.length} packages (${fromPackageJson} from package.json, ${fromLockfile} from lockfile)\n`);

    // Try to use cache first
    const cache = readCache();
    let threats;
    let ghRanges;

    if (!cache) {
        console.log('  Fetching latest security databases...\n');

        const [osvThreats, ghThreats] = await Promise.all([
            fetchOSV(packages).then(r => { console.log(`  📡 OSV: ${r.size} malware entries`); return r; }),
            fetchGitHubAdvisory().then(r => { console.log(`  📡 GitHub Advisory: ${r.size} malware entries`); return r; })
        ]);

        threats = new Set([...KNOWN_MALICIOUS, ...osvThreats]);
        ghRanges = [...ghThreats];

        // Cache the results including ranges
        writeCache(threats, ghRanges);
    } else {
        threats = cache.threats;
        ghRanges = cache.ranges;
        console.log(`  Using cached security database (${threats.size} exact + ${ghRanges.length} ranges)\n`);
    }

    // Check packages against exact matches and ranges
    const found = [];

    for (const pkg of packages) {
        const exact = `${pkg.name}@${pkg.version}`;

        // Check exact match
        if (threats.has(exact)) {
            found.push({ ...pkg, source: 'exact match' });
            continue;
        }

        // Check GitHub Advisory ranges
        for (const entry of ghRanges) {
            const [name, range] = entry.split(':');
            if (pkg.name === name && parseVersionRange(range, pkg.version)) {
                found.push({ ...pkg, source: 'GitHub Advisory' });
                break;
            }
        }
    }

    if (found.length > 0) {
        console.log('\n' + '!'.repeat(70));
        console.log('🚨 MALICIOUS PACKAGES DETECTED - BLOCKING INSTALLATION');
        console.log('!'.repeat(70) + '\n');

        for (const pkg of found) {
            console.log(`  ❌ ${pkg.name}@${pkg.version} (${pkg.source})`);
        }

        console.log('\nThese packages are known to contain malware or malicious code.');
        console.log('Installation has been blocked to protect your system.\n');
        console.log('Actions:');
        console.log('  1. Remove these packages from package.json');
        console.log('  2. Find safe alternatives');
        console.log('  3. Run npm install again\n');
        console.log('='.repeat(70) + '\n');

        process.exit(1);
    }

    console.log(`\n✅ Security check passed (${threats.size} exact + ${ghRanges.length} ranges checked)`)

    console.log('='.repeat(70) + '\n');
}

main().catch(err => {
    console.error('Security check error:', err.message);
    // Don't block on errors - allow install to proceed
    process.exit(0);
});
