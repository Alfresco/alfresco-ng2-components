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
 * Security check script - blocks npm install if compromised packages are detected.
 *
 * This script:
 * 1. Fetches known malicious packages from multiple sources:
 *    - OSV (Open Source Vulnerabilities) - Google's aggregated database
 *    - GitHub Advisory Database - GitHub's security advisories
 * 2. Checks both package.json and package-lock.json
 * 3. Blocks installation if a compromised package is found
 *
 * Cache: Results are cached locally for 24 hours to avoid slowing down installs.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const CACHE_DIR = join(ROOT_DIR, 'node_modules', '.cache', 'security-check');
const CACHE_FILE = join(CACHE_DIR, 'blocked-packages.json');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// API endpoints
const OSV_API = 'https://api.osv.dev/v1/query';
const OSV_BATCH_API = 'https://api.osv.dev/v1/querybatch';
const GITHUB_ADVISORY_API = 'https://api.github.com/advisories';

// Filter for supply chain attacks (malware, compromised packages)
// These are the most dangerous - not just vulnerabilities but intentionally malicious
const MALWARE_KEYWORDS = [
    'malware',
    'malicious',
    'compromised',
    'supply chain',
    'backdoor',
    'cryptominer',
    'credential stealing',
    'data exfiltration',
    'typosquat'
];

// ============================================================================
// FALLBACK LIST - Used when OSV is unreachable
// These are confirmed supply chain attacks (not regular CVEs)
// ============================================================================
const FALLBACK_BLOCKED_PACKAGES = {
    '@solana/web3.js': {
        versions: ['1.95.6', '1.95.7'],
        reason: 'Compromised - steals private keys (Dec 2024)'
    },
    '@lottiefiles/lottie-player': {
        versions: ['2.0.5', '2.0.6', '2.0.7'],
        reason: 'Compromised - crypto wallet drainer (Oct 2024)'
    },
    'node-ipc': {
        versions: ['9.2.2', '10.1.1', '10.1.2', '10.1.3', '11.0.0', '11.1.0'],
        reason: 'Protestware - overwrites files (Mar 2022)'
    },
    'ua-parser-js': {
        versions: ['0.7.29', '0.8.0', '1.0.0'],
        reason: 'Compromised - cryptominer and password stealer (Oct 2021)'
    },
    'coa': {
        versions: ['2.0.3', '2.0.4', '2.1.1', '2.1.3', '3.0.1', '3.1.3'],
        reason: 'Compromised - password stealer (Nov 2021)'
    },
    'rc': {
        versions: ['1.2.9', '1.3.9', '2.3.9'],
        reason: 'Compromised - exfiltrates environment variables (Nov 2021)'
    },
    'colors': {
        versions: ['1.4.1', '1.4.44-liberty-2'],
        reason: 'Sabotage - infinite loop (Jan 2022)'
    },
    'faker': {
        versions: ['6.6.6'],
        reason: 'Sabotage - no functionality (Jan 2022)'
    },
    'event-stream': {
        versions: ['3.3.6'],
        reason: 'Compromised - bitcoin wallet theft (Nov 2018)'
    }
};

// ============================================================================
// DATABASE FETCHING
// ============================================================================

function isMalwareRelated(text) {
    const lowerText = text.toLowerCase();
    return MALWARE_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

function extractVersionsFromOSV(vuln) {
    const versions = [];
    for (const affected of vuln.affected || []) {
        for (const range of affected.ranges || []) {
            for (const event of range.events || []) {
                if (event.introduced && event.introduced !== '0') {
                    versions.push(event.introduced);
                }
            }
        }
        if (affected.versions) {
            versions.push(...affected.versions);
        }
    }
    return [...new Set(versions)];
}

async function fetchFromOSV(packages) {
    console.log('  📡 Fetching from OSV (Google)...');
    const results = {};

    try {
        const response = await fetch(OSV_BATCH_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                queries: Object.keys(packages).map(name => ({
                    package: { name, ecosystem: 'npm' }
                }))
            })
        });

        if (response.ok) {
            const data = await response.json();
            for (const result of data.results || []) {
                for (const vuln of result.vulns || []) {
                    const summary = [vuln.summary || '', vuln.details || ''].join(' ');
                    if (isMalwareRelated(summary)) {
                        const pkgName = vuln.affected?.[0]?.package?.name;
                        if (pkgName) {
                            const versions = extractVersionsFromOSV(vuln);
                            if (versions.length > 0) {
                                if (!results[pkgName]) {
                                    results[pkgName] = { versions: [], reason: '' };
                                }
                                results[pkgName].versions.push(...versions);
                                results[pkgName].reason = vuln.summary || 'Malware detected by OSV';
                                results[pkgName].source = 'OSV';
                            }
                        }
                    }
                }
            }
            console.log(`     ✓ OSV: Found ${Object.keys(results).length} malware entries`);
        }
    } catch (e) {
        console.log(`     ⚠ OSV: Could not fetch (${e.message})`);
    }

    return results;
}

async function fetchFromGitHubAdvisory(packages) {
    console.log('  📡 Fetching from GitHub Advisory...');
    const results = {};

    try {
        // GitHub Advisory API - query for npm malware
        // We search for advisories with malware-related keywords
        const response = await fetch(
            `${GITHUB_ADVISORY_API}?ecosystem=npm&type=malware&per_page=100`,
            {
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            }
        );

        if (response.ok) {
            const advisories = await response.json();
            for (const advisory of advisories) {
                const summary = [advisory.summary || '', advisory.description || ''].join(' ');

                // Check each vulnerable package in this advisory
                for (const vuln of advisory.vulnerabilities || []) {
                    const pkgName = vuln.package?.name;
                    if (pkgName && vuln.package?.ecosystem === 'npm') {
                        // Extract affected versions
                        const versions = [];
                        if (vuln.vulnerable_version_range) {
                            // Parse version range like "= 1.95.6" or ">= 1.0.0, < 1.0.1"
                            const exactMatch = vuln.vulnerable_version_range.match(/^= (.+)$/);
                            if (exactMatch) {
                                versions.push(exactMatch[1]);
                            }
                        }
                        if (vuln.first_patched_version?.identifier) {
                            // This tells us the fixed version, not the bad ones
                            // We'd need to know the introduced version too
                        }

                        if (versions.length > 0 || isMalwareRelated(summary)) {
                            if (!results[pkgName]) {
                                results[pkgName] = { versions: [], reason: '' };
                            }
                            results[pkgName].versions.push(...versions);
                            results[pkgName].reason = advisory.summary || 'Malware detected by GitHub Advisory';
                            results[pkgName].source = 'GitHub';
                        }
                    }
                }
            }
            console.log(`     ✓ GitHub: Found ${Object.keys(results).length} malware entries`);
        } else if (response.status === 403) {
            console.log('     ⚠ GitHub: Rate limited (will use cached/fallback data)');
        }
    } catch (e) {
        console.log(`     ⚠ GitHub: Could not fetch (${e.message})`);
    }

    return results;
}

async function fetchMalwareList() {
    // Check cache first
    if (existsSync(CACHE_FILE)) {
        try {
            const cache = JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
            if (Date.now() - cache.timestamp < CACHE_TTL_MS) {
                console.log('  Using cached security database...');
                console.log(`  (${cache.sources?.join(', ') || 'fallback'} - cached ${Math.round((Date.now() - cache.timestamp) / 60000)} min ago)`);
                return cache.packages;
            }
        } catch {
            // Cache corrupted, will refetch
        }
    }

    console.log('  Fetching latest security databases...\n');

    // Start with fallback list
    const packages = { ...FALLBACK_BLOCKED_PACKAGES };
    const sources = ['fallback'];

    // Fetch from OSV
    const osvResults = await fetchFromOSV(packages);
    if (Object.keys(osvResults).length > 0) {
        sources.push('OSV');
        for (const [name, data] of Object.entries(osvResults)) {
            if (packages[name]) {
                // Merge versions
                packages[name].versions = [...new Set([...packages[name].versions, ...data.versions])];
            } else {
                packages[name] = data;
            }
        }
    }

    // Fetch from GitHub Advisory
    const ghResults = await fetchFromGitHubAdvisory(packages);
    if (Object.keys(ghResults).length > 0) {
        sources.push('GitHub');
        for (const [name, data] of Object.entries(ghResults)) {
            if (packages[name]) {
                // Merge versions
                packages[name].versions = [...new Set([...packages[name].versions, ...data.versions])];
            } else {
                packages[name] = data;
            }
        }
    }

    console.log('');

    // Cache results
    try {
        if (!existsSync(CACHE_DIR)) {
            mkdirSync(CACHE_DIR, { recursive: true });
        }
        writeFileSync(CACHE_FILE, JSON.stringify({
            timestamp: Date.now(),
            sources,
            packages
        }, null, 2));
    } catch {
        // Cache write failed, continue anyway
    }

    return packages;
}

// ============================================================================
// PACKAGE CHECKING
// ============================================================================

function readJsonFile(filePath) {
    if (!existsSync(filePath)) {
        return null;
    }
    try {
        return JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.error(`  Failed to parse ${filePath}: ${e.message}`);
        return null;
    }
}

function checkVersion(version, blockedVersions) {
    return blockedVersions.some(blocked => blocked === version);
}

function checkDependencies(deps, blockedPackages, source) {
    const violations = [];
    if (!deps) return violations;

    for (const [name, versionSpec] of Object.entries(deps)) {
        if (blockedPackages[name]) {
            const version = versionSpec.replace(/^[\^~>=<]*/, '').split(' ')[0];
            if (checkVersion(version, blockedPackages[name].versions)) {
                violations.push({
                    package: name,
                    version,
                    reason: blockedPackages[name].reason,
                    source
                });
            }
        }
    }
    return violations;
}

function checkLockfileDependencies(packages, blockedPackages) {
    const violations = [];
    if (!packages) return violations;

    for (const [path, info] of Object.entries(packages)) {
        if (!path || path === '') continue;
        const name = path.replace(/^node_modules\//, '').replace(/^.*node_modules\//, '');

        if (blockedPackages[name] && info.version) {
            if (checkVersion(info.version, blockedPackages[name].versions)) {
                violations.push({
                    package: name,
                    version: info.version,
                    reason: blockedPackages[name].reason,
                    source: 'package-lock.json (transitive)'
                });
            }
        }
    }
    return violations;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
    console.log('\n' + '='.repeat(70));
    console.log('🔒 ADF SECURITY CHECK');
    console.log('='.repeat(70));
    console.log('Scanning for known supply chain attacks and compromised packages...\n');

    // Fetch blocked packages list
    const blockedPackages = await fetchMalwareList();
    const threatCount = Object.keys(blockedPackages).length;

    const violations = [];

    // Check package.json
    const packageJson = readJsonFile(join(ROOT_DIR, 'package.json'));
    if (packageJson) {
        violations.push(...checkDependencies(packageJson.dependencies, blockedPackages, 'package.json (dependencies)'));
        violations.push(...checkDependencies(packageJson.devDependencies, blockedPackages, 'package.json (devDependencies)'));
    }

    // Check package-lock.json
    const lockfile = readJsonFile(join(ROOT_DIR, 'package-lock.json'));
    if (lockfile?.packages) {
        violations.push(...checkLockfileDependencies(lockfile.packages, blockedPackages));
    }

    // Deduplicate
    const uniqueViolations = violations.filter((v, i, arr) =>
        arr.findIndex(x => x.package === v.package && x.version === v.version) === i
    );

    if (uniqueViolations.length > 0) {
        console.error('\n' + '='.repeat(70));
        console.error('🚨 SECURITY ALERT: MALICIOUS PACKAGES DETECTED 🚨');
        console.error('='.repeat(70) + '\n');

        console.error('The following packages are known to be COMPROMISED:\n');

        for (const v of uniqueViolations) {
            console.error(`  📦 ${v.package}@${v.version}`);
            console.error(`     ⚠️  ${v.reason}`);
            console.error(`     📍 Found in: ${v.source}\n`);
        }

        console.error('='.repeat(70));
        console.error('⛔ INSTALLATION BLOCKED FOR YOUR SECURITY');
        console.error('='.repeat(70) + '\n');

        console.error('These packages contain malicious code that may:');
        console.error('  • Steal credentials and environment variables');
        console.error('  • Install cryptominers or backdoors');
        console.error('  • Exfiltrate sensitive data\n');

        // Delete node_modules to prevent using compromised packages
        const nodeModulesPath = join(ROOT_DIR, 'node_modules');
        if (existsSync(nodeModulesPath)) {
            console.error('🗑️  Removing node_modules to prevent use of compromised packages...\n');
            try {
                rmSync(nodeModulesPath, { recursive: true, force: true });
                console.error('✅ node_modules deleted successfully.\n');
            } catch (e) {
                console.error(`⚠️  Could not delete node_modules: ${e.message}`);
                console.error('   Please delete it manually before proceeding.\n');
            }
        }

        console.error('📋 REQUIRED ACTIONS:');
        console.error('   1. Review your package.json for the affected packages');
        console.error('   2. Update to safe versions or remove the packages');
        console.error('   3. Delete package-lock.json and regenerate it');
        console.error('   4. Run npm install again\n');

        console.error('📚 More information:');
        console.error('   • https://osv.dev');
        console.error('   • https://socket.dev/npm/advisories');
        console.error('   • https://github.com/advisories\n');

        process.exit(1);
    }

    console.log(`✅ Security check passed (${threatCount} known threats checked)`);
    console.log('='.repeat(70) + '\n');
    process.exit(0);
}

main().catch(err => {
    console.error('Security check failed:', err.message);
    // Don't block install if script itself fails
    process.exit(0);
});
