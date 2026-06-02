#!/usr/bin/env node

/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 */

/**
 * Post-install security check - warns if any installed packages are known malware.
 * Runs after pnpm install via the prepare hook.
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const MALWARE_KEYWORDS = ['malware', 'malicious', 'compromised', 'supply chain', 'backdoor'];

function getInstalledPackages() {
    try {
        const lockfile = readFileSync(join(ROOT_DIR, 'pnpm-lock.yaml'), 'utf-8');
        const packages = [];
        const regex = /^\s+'?\/([^'(]+)'/gm;
        let match;

        while ((match = regex.exec(lockfile)) !== null) {
            const fullPath = match[1];
            const lastAt = fullPath.lastIndexOf('@');
            if (lastAt > 0) {
                const name = fullPath.substring(0, lastAt);
                const version = fullPath.substring(lastAt + 1);
                packages.push({ name, version });
            }
        }

        return packages;
    } catch {
        return [];
    }
}

async function checkWithOSV(packages) {
    const findings = [];
    const batches = [];

    for (let i = 0; i < packages.length; i += 1000) {
        batches.push(packages.slice(i, i + 1000));
    }

    for (const batch of batches) {
        try {
            const response = await fetch('https://api.osv.dev/v1/querybatch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    queries: batch.map(pkg => ({
                        package: { name: pkg.name, ecosystem: 'npm' },
                        version: pkg.version
                    }))
                }),
                signal: AbortSignal.timeout(30000)
            });

            if (!response.ok) continue;

            const data = await response.json();
            for (let i = 0; i < (data.results || []).length; i++) {
                for (const vuln of data.results[i].vulns || []) {
                    const summary = [vuln.summary || '', vuln.details || ''].join(' ').toLowerCase();
                    if (MALWARE_KEYWORDS.some(kw => summary.includes(kw))) {
                        findings.push({
                            name: batch[i].name,
                            version: batch[i].version,
                            reason: vuln.summary || 'Malware detected',
                            source: 'OSV'
                        });
                    }
                }
            }
        } catch {}
    }

    return findings;
}

async function checkWithGitHub(packages) {
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
        const malwareNames = new Set();

        for (const advisory of advisories) {
            for (const vuln of advisory.vulnerabilities || []) {
                if (vuln.package?.name) {
                    malwareNames.add(vuln.package.name);
                }
            }
        }

        for (const pkg of packages) {
            if (malwareNames.has(pkg.name)) {
                findings.push({
                    name: pkg.name,
                    version: pkg.version,
                    reason: 'Known malware package',
                    source: 'GitHub Advisory'
                });
            }
        }
    } catch {}

    return findings;
}

async function main() {
    const packages = getInstalledPackages();

    if (!packages.length) {
        return;
    }

    const [osvFindings, ghFindings] = await Promise.all([
        checkWithOSV(packages),
        checkWithGitHub(packages)
    ]);

    const allFindings = [...osvFindings, ...ghFindings];

    // Dedupe
    const unique = allFindings.filter((f, i, arr) =>
        arr.findIndex(x => x.name === f.name && x.version === f.version) === i
    );

    if (unique.length > 0) {
        console.error('\n' + '!'.repeat(70));
        console.error('🚨 WARNING: MALICIOUS PACKAGES DETECTED');
        console.error('!'.repeat(70) + '\n');

        for (const finding of unique) {
            console.error(`  ❌ ${finding.name}@${finding.version}`);
            console.error(`     ${finding.reason} (${finding.source})\n`);
        }

        console.error('Remove these packages immediately:');
        console.error('  pnpm remove <package-name>\n');
        console.error('!'.repeat(70) + '\n');

        process.exit(1);
    }
}

main().catch(() => {});
