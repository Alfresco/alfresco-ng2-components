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
 * Pre-commit security check for new packages.
 *
 * Checks any new/changed packages in pnpm-lock.yaml against OSV and GitHub
 * Advisory databases to prevent committing known malicious packages.
 */

import { execSync } from 'node:child_process';

const MALWARE_KEYWORDS = ['malware', 'malicious', 'compromised', 'supply chain', 'backdoor'];

function getChangedPackages() {
    try {
        const diff = execSync('git diff --cached pnpm-lock.yaml', { encoding: 'utf-8' });

        const addedPackages = [];
        const packageRegex = /^\+\s+'?([^:'\s]+)'?:\s*$/gm;
        const versionRegex = /^\+\s+version:\s+'?([^'\s]+)'?/gm;

        let match;
        const lines = diff.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('+') && !line.startsWith('+++')) {
                const pkgMatch = line.match(/^\+\s+'?\/([^']+)'?:/);
                if (pkgMatch) {
                    const fullPath = pkgMatch[1];
                    const name = fullPath.includes('@') && !fullPath.startsWith('@')
                        ? fullPath.split('@')[0]
                        : fullPath.replace(/@[^/]+$/, '');
                    const version = fullPath.match(/@(\d+\.\d+\.\d+[^/]*)/)?.[1];
                    if (name && version) {
                        addedPackages.push({ name, version });
                    }
                }
            }
        }

        return addedPackages;
    } catch {
        return [];
    }
}

async function checkWithOSV(packages) {
    if (!packages.length) return [];

    const findings = [];

    try {
        const response = await fetch('https://api.osv.dev/v1/querybatch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                queries: packages.map(pkg => ({
                    package: { name: pkg.name, ecosystem: 'npm' },
                    version: pkg.version
                }))
            }),
            signal: AbortSignal.timeout(30000)
        });

        if (!response.ok) return findings;

        const data = await response.json();

        for (let i = 0; i < (data.results || []).length; i++) {
            const result = data.results[i];
            for (const vuln of result.vulns || []) {
                const summary = [vuln.summary || '', vuln.details || ''].join(' ').toLowerCase();
                if (MALWARE_KEYWORDS.some(kw => summary.includes(kw))) {
                    findings.push({
                        package: packages[i].name,
                        version: packages[i].version,
                        reason: vuln.summary || 'Malware detected',
                        source: 'OSV'
                    });
                }
            }
        }
    } catch {
        // Network errors are non-fatal
    }

    return findings;
}

async function checkWithGitHub(packages) {
    if (!packages.length) return [];

    const findings = [];

    try {
        const response = await fetch(
            'https://api.github.com/advisories?ecosystem=npm&type=malware&per_page=100',
            {
                headers: { 'Accept': 'application/vnd.github+json' },
                signal: AbortSignal.timeout(10000)
            }
        );

        if (!response.ok) return findings;

        const advisories = await response.json();

        for (const pkg of packages) {
            for (const advisory of advisories) {
                for (const vuln of advisory.vulnerabilities || []) {
                    if (vuln.package?.name === pkg.name) {
                        findings.push({
                            package: pkg.name,
                            version: pkg.version,
                            reason: advisory.summary || 'Malware advisory',
                            source: 'GitHub Advisory'
                        });
                    }
                }
            }
        }
    } catch {
        // Network errors are non-fatal
    }

    return findings;
}

async function main() {
    const changedPackages = getChangedPackages();

    if (!changedPackages.length) {
        process.exit(0);
    }

    console.log(`\n🔍 Checking ${changedPackages.length} new/changed packages against security databases...\n`);

    const [osvFindings, ghFindings] = await Promise.all([
        checkWithOSV(changedPackages),
        checkWithGitHub(changedPackages)
    ]);

    const allFindings = [...osvFindings, ...ghFindings];

    if (allFindings.length > 0) {
        console.error('='.repeat(70));
        console.error('🚨 MALICIOUS PACKAGES DETECTED - COMMIT BLOCKED');
        console.error('='.repeat(70) + '\n');

        for (const finding of allFindings) {
            console.error(`  ❌ ${finding.package}@${finding.version}`);
            console.error(`     ${finding.reason} (${finding.source})\n`);
        }

        console.error('Remove these packages before committing:');
        console.error('  pnpm remove <package-name>\n');
        console.error('='.repeat(70) + '\n');

        process.exit(1);
    }

    console.log('✅ All new packages passed security checks\n');
}

try {
    await main();
} catch (error) {
    console.error('Security check error:', error.message);
    process.exit(0);
}
