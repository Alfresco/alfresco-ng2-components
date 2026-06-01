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
 *    - Meterian CLI (optional) - additional vulnerability coverage
 * 2. Checks both package.json and package-lock.json
 * 3. Blocks installation if a compromised package is found
 *
 * Cache: Results are cached locally for 24 hours to avoid slowing down installs.
 *
 * Set ADF_SKIP_SECURITY_CHECK=1 to disable (useful for CI environments).
 */

if (process.env.ADF_SKIP_SECURITY_CHECK === '1' || process.env.ADF_SKIP_SECURITY_CHECK === 'true') {
    console.log('🔒 ADF Security Check: Skipped (ADF_SKIP_SECURITY_CHECK=1)\n');
    process.exit(0);
}

import { readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fetchMalwareData as fetchFromOSV } from './security-providers/osv-provider.mjs';
import { fetchMalwareData as fetchFromGitHub } from './security-providers/github-provider.mjs';
import { checkVulnerabilities as checkWithMeterian } from './security-providers/meterian-provider.mjs';
import { FALLBACK_BLOCKED_PACKAGES } from './security-providers/fallback-list.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const CACHE_DIR = join(ROOT_DIR, 'node_modules', '.cache', 'security-check');
const CACHE_FILE = join(CACHE_DIR, 'blocked-packages.json');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

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
        writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch {
        return false;
    }
}

function directoryExists(path) {
    try {
        return statSync(path).isDirectory();
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

function removeDirectory(path) {
    try {
        rmSync(path, { recursive: true, force: true });
        return true;
    } catch {
        return false;
    }
}

// ============================================================================
// DEPENDENCY EXTRACTION
// ============================================================================

function extractDependenciesFromLockfile(lockfilePath) {
    const lockfile = readJsonFile(lockfilePath);

    if (!lockfile?.packages) {
        return [];
    }

    return Object.entries(lockfile.packages)
        .filter(([path, info]) => path && path !== '' && info.version)
        .map(([path, info]) => ({
            name: path.replace(/^node_modules\//, '').replace(/^.*node_modules\//, ''),
            version: info.version
        }));
}

function extractDependenciesFromPackageJson(packageJsonPath, existingDependencies) {
    const packageJson = readJsonFile(packageJsonPath);

    if (!packageJson) {
        return [];
    }

    const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
    };

    return Object.entries(allDeps)
        .filter(([, versionSpec]) => typeof versionSpec === 'string' && !versionSpec.startsWith('file:'))
        .map(([name, versionSpec]) => ({
            name,
            version: versionSpec.replace(/^[\^~>=<]*/, '').split(' ')[0]
        }))
        .filter(dep => dep.version && !existingDependencies.some(
            existing => existing.name === dep.name && existing.version === dep.version
        ));
}

function getProjectDependencies() {
    const lockfileDeps = extractDependenciesFromLockfile(join(ROOT_DIR, 'package-lock.json'));
    const packageJsonDeps = extractDependenciesFromPackageJson(join(ROOT_DIR, 'package.json'), lockfileDeps);

    return [...lockfileDeps, ...packageJsonDeps];
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

function readCache() {
    const cache = readJsonFile(CACHE_FILE);

    if (!cache) {
        return null;
    }

    const isExpired = Date.now() - cache.timestamp >= CACHE_TTL_MS;
    return isExpired ? null : cache;
}

function writeCache(packages, sources) {
    ensureDirectory(CACHE_DIR);

    writeJsonFile(CACHE_FILE, {
        timestamp: Date.now(),
        sources,
        packages
    });
}

// ============================================================================
// MALWARE DATABASE AGGREGATION
// ============================================================================

function mergeResults(target, source) {
    for (const [name, data] of Object.entries(source)) {
        if (target[name]) {
            target[name].versions = [...new Set([...target[name].versions, ...(data.versions || [])])];
            target[name].versionRanges = [...new Set([
                ...(target[name].versionRanges || []),
                ...(data.versionRanges || [])
            ])];
        } else {
            target[name] = data;
        }
    }
}

async function fetchMalwareDatabase(projectDependencies) {
    const cache = readCache();

    if (cache) {
        console.log('  Using cached security database...');
        console.log(`  (${cache.sources?.join(', ') || 'fallback'} - cached ${Math.round((Date.now() - cache.timestamp) / 60000)} min ago)`);
        return { packages: cache.packages, sources: cache.sources || ['fallback'] };
    }

    console.log('  Fetching latest security databases...\n');

    const packages = { ...FALLBACK_BLOCKED_PACKAGES };
    const sources = ['fallback'];

    const osvResults = await fetchFromOSV(projectDependencies);
    if (Object.keys(osvResults).length > 0) {
        sources.push('OSV');
        mergeResults(packages, osvResults);
    }

    const githubResults = await fetchFromGitHub();
    if (Object.keys(githubResults).length > 0) {
        sources.push('GitHub');
        mergeResults(packages, githubResults);
    }

    writeCache(packages, sources);

    return { packages, sources };
}

// ============================================================================
// VERSION CHECKING
// ============================================================================

function compareVersions(versionA, versionB) {
    const partsA = versionA.replace(/^v/, '').split('.').map(part => parseInt(part, 10) || 0);
    const partsB = versionB.replace(/^v/, '').split('.').map(part => parseInt(part, 10) || 0);
    const maxLength = Math.max(partsA.length, partsB.length);

    let result = 0;

    for (let index = 0; index < maxLength && result === 0; index++) {
        const numA = partsA[index] || 0;
        const numB = partsB[index] || 0;
        result = Math.sign(numA - numB);
    }

    return result;
}

function matchesVersionRange(version, range) {
    const conditions = range.split(',').map(condition => condition.trim());

    for (const condition of conditions) {
        const match = condition.match(/^(>=|<=|>|<|=)?\s*(\S+)$/);
        if (!match) continue;

        const [, operator = '=', targetVersion] = match;
        const comparison = compareVersions(version, targetVersion.trim());

        const operatorChecks = {
            '=': comparison === 0,
            '>': comparison > 0,
            '>=': comparison >= 0,
            '<': comparison < 0,
            '<=': comparison <= 0
        };

        if (!operatorChecks[operator]) {
            return false;
        }
    }

    return true;
}

function isVersionBlocked(version, blockedEntry) {
    if (blockedEntry.versions?.some(blocked => blocked === version)) {
        return true;
    }

    if (blockedEntry.versionRanges?.some(range => matchesVersionRange(version, range))) {
        return true;
    }

    return false;
}

// ============================================================================
// VIOLATION DETECTION
// ============================================================================

function checkDependenciesForViolations(dependencies, blockedPackages, source) {
    if (!dependencies) return [];

    return Object.entries(dependencies)
        .filter(([name]) => blockedPackages[name])
        .map(([name, versionSpec]) => ({
            name,
            version: versionSpec.replace(/^[\^~>=<]*/, '').split(' ')[0],
            blockedEntry: blockedPackages[name]
        }))
        .filter(({ version, blockedEntry }) => isVersionBlocked(version, blockedEntry))
        .map(({ name, version, blockedEntry }) => ({
            package: name,
            version,
            reason: blockedEntry.reason,
            source
        }));
}

function checkLockfileForViolations(packages, blockedPackages) {
    if (!packages) return [];

    return Object.entries(packages)
        .filter(([path]) => path && path !== '')
        .map(([path, info]) => ({
            name: path.replace(/^node_modules\//, '').replace(/^.*node_modules\//, ''),
            version: info.version
        }))
        .filter(({ name, version }) => blockedPackages[name] && version && isVersionBlocked(version, blockedPackages[name]))
        .map(({ name, version }) => ({
            package: name,
            version,
            reason: blockedPackages[name].reason,
            source: 'package-lock.json (transitive)'
        }));
}

function deduplicateViolations(violations) {
    return violations.filter((violation, index, array) =>
        array.findIndex(other =>
            other.package === violation.package && other.version === violation.version
        ) === index
    );
}

// ============================================================================
// METERIAN INTEGRATION
// ============================================================================

function prepareDependenciesForMeterian(lockfilePackages) {
    return Object.entries(lockfilePackages)
        .filter(([path, info]) => path && info.version)
        .map(([path, info]) => ({
            name: path.replace(/^node_modules\//, '').replace(/^.*node_modules\//, ''),
            version: info.version
        }))
        .slice(0, 500);
}

function formatMeterianFindings(meterianResult) {
    return (meterianResult.vulnerable || []).map(vulnerability => ({
        package: vulnerability.name,
        version: vulnerability.version,
        reason: `${vulnerability.severity}: ${vulnerability.id}${vulnerability.safeVersions?.length ? ` (safe: ${vulnerability.safeVersions[0]})` : ''}`,
        source: 'Meterian'
    }));
}

function handleMeterianFindings(findings, shouldBlock) {
    if (shouldBlock) {
        return findings;
    }

    if (findings.length > 0) {
        console.log('\n⚠️  Meterian found vulnerabilities (informational, not blocking):');
        for (const finding of findings) {
            console.log(`   ${finding.package}@${finding.version} - ${finding.reason}`);
        }
        console.log('   Set ADF_METERIAN_BLOCK=1 to block on these findings.\n');
    }

    return [];
}

// ============================================================================
// REPORTING
// ============================================================================

function reportViolations(violations) {
    console.error('\n' + '='.repeat(70));
    console.error('🚨 SECURITY ALERT: MALICIOUS PACKAGES DETECTED 🚨');
    console.error('='.repeat(70) + '\n');

    console.error('The following packages are known to be COMPROMISED:\n');

    for (const violation of violations) {
        console.error(`  📦 ${violation.package}@${violation.version}`);
        console.error(`     ⚠️  ${violation.reason}`);
        console.error(`     📍 Found in: ${violation.source}\n`);
    }

    console.error('='.repeat(70));
    console.error('⛔ INSTALLATION BLOCKED FOR YOUR SECURITY');
    console.error('='.repeat(70) + '\n');

    console.error('These packages contain malicious code that may:');
    console.error('  • Steal credentials and environment variables');
    console.error('  • Install cryptominers or backdoors');
    console.error('  • Exfiltrate sensitive data\n');
}

function handleNodeModulesDeletion() {
    const skipDeletion = process.env.ADF_SECURITY_KEEP_NODE_MODULES === '1' ||
                         process.env.ADF_SECURITY_KEEP_NODE_MODULES === 'true';
    const nodeModulesPath = join(ROOT_DIR, 'node_modules');

    if (!directoryExists(nodeModulesPath)) {
        return;
    }

    if (skipDeletion) {
        console.error('⚠️  Skipping node_modules deletion (ADF_SECURITY_KEEP_NODE_MODULES=1)\n');
        return;
    }

    console.error('🗑️  Removing node_modules to prevent use of compromised packages...');
    console.error('   (Set ADF_SECURITY_KEEP_NODE_MODULES=1 to skip deletion)\n');

    if (removeDirectory(nodeModulesPath)) {
        console.error('✅ node_modules deleted successfully.\n');
    } else {
        console.error('⚠️  Could not delete node_modules. Please delete it manually.\n');
    }
}

function reportRequiredActions() {
    console.error('📋 REQUIRED ACTIONS:');
    console.error('   1. Review your package.json for the affected packages');
    console.error('   2. Update to safe versions or remove the packages');
    console.error('   3. Delete package-lock.json and regenerate it');
    console.error('   4. Run npm install again\n');

    console.error('📚 More information:');
    console.error('   • https://osv.dev');
    console.error('   • https://socket.dev/npm/advisories');
    console.error('   • https://github.com/advisories\n');
}

function reportSuccess(sources, packageCount) {
    const sourceList = sources.join(' + ');
    console.log(`✅ Security check passed (checked against ${sourceList}, ${packageCount} blocked packages)`);
    console.log('='.repeat(70) + '\n');
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
    console.log('\n' + '='.repeat(70));
    console.log('🔒 ADF SECURITY CHECK');
    console.log('='.repeat(70));
    console.log('Scanning for known supply chain attacks and compromised packages...\n');

    const projectDependencies = getProjectDependencies();
    const { packages: blockedPackages, sources } = await fetchMalwareDatabase(projectDependencies);

    const violations = [];

    const packageJson = readJsonFile(join(ROOT_DIR, 'package.json'));
    if (packageJson) {
        violations.push(...checkDependenciesForViolations(packageJson.dependencies, blockedPackages, 'package.json (dependencies)'));
        violations.push(...checkDependenciesForViolations(packageJson.devDependencies, blockedPackages, 'package.json (devDependencies)'));
    }

    const lockfile = readJsonFile(join(ROOT_DIR, 'package-lock.json'));
    if (lockfile?.packages) {
        violations.push(...checkLockfileForViolations(lockfile.packages, blockedPackages));
    }

    if (lockfile?.packages) {
        const meterianDeps = prepareDependenciesForMeterian(lockfile.packages);
        const meterianResult = await checkWithMeterian(meterianDeps, ROOT_DIR);
        const meterianFindings = formatMeterianFindings(meterianResult);

        const shouldBlockOnMeterian = process.env.ADF_METERIAN_BLOCK === '1' ||
                                      process.env.ADF_METERIAN_BLOCK === 'true';
        violations.push(...handleMeterianFindings(meterianFindings, shouldBlockOnMeterian));
    }

    const uniqueViolations = deduplicateViolations(violations);

    if (uniqueViolations.length > 0) {
        reportViolations(uniqueViolations);
        handleNodeModulesDeletion();
        reportRequiredActions();
        process.exit(1);
    }

    reportSuccess(sources, Object.keys(blockedPackages).length);
    process.exit(0);
}

try {
    await main();
} catch (error) {
    console.error('\n❌ Security check crashed unexpectedly:', error.message);
    console.error('   Blocking installation as a precaution.');
    console.error('   Set ADF_SKIP_SECURITY_CHECK=1 to bypass.\n');
    process.exit(1);
}
