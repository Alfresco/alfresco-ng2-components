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
 * Safe add - checks packages against security databases before installing.
 *
 * Usage: pnpm run add <package>[@version] [-- -D]
 */

import { execSync } from 'node:child_process';

const MALWARE_KEYWORDS = ['malware', 'malicious', 'compromised', 'supply chain', 'backdoor'];

function parsePackageArg(arg) {
    const match = arg.match(/^(@?[^@]+)(?:@(.+))?$/);
    return match ? { name: match[1], version: match[2] || 'latest' } : null;
}

async function resolveVersion(name, version) {
    if (version !== 'latest') return version;

    try {
        const response = await fetch(`https://registry.npmjs.org/${name}/latest`, {
            signal: AbortSignal.timeout(5000)
        });
        if (response.ok) {
            const data = await response.json();
            return data.version;
        }
    } catch {}
    return null;
}

async function checkOSV(name, version) {
    try {
        const response = await fetch('https://api.osv.dev/v1/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ package: { name, ecosystem: 'npm' }, version }),
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) return null;

        const data = await response.json();
        for (const vuln of data.vulns || []) {
            const summary = [vuln.summary || '', vuln.details || ''].join(' ').toLowerCase();
            if (MALWARE_KEYWORDS.some(kw => summary.includes(kw))) {
                return vuln.summary || 'Malware detected';
            }
        }
    } catch {}
    return null;
}

async function checkGitHub(name) {
    try {
        const response = await fetch(
            'https://api.github.com/advisories?ecosystem=npm&type=malware&per_page=100',
            {
                headers: { 'Accept': 'application/vnd.github+json' },
                signal: AbortSignal.timeout(10000)
            }
        );

        if (!response.ok) return null;

        const advisories = await response.json();
        for (const advisory of advisories) {
            for (const vuln of advisory.vulnerabilities || []) {
                if (vuln.package?.name === name) {
                    return advisory.summary || 'Malware advisory';
                }
            }
        }
    } catch {}
    return null;
}

async function main() {
    const args = process.argv.slice(2);
    const packages = args.filter(arg => !arg.startsWith('-'));
    const flags = args.filter(arg => arg.startsWith('-')).join(' ');

    if (!packages.length) {
        console.log('Usage: pnpm run add <package>[@version] [-- -D]');
        process.exit(1);
    }

    console.log('\n🔒 Checking packages against security databases...\n');

    for (const arg of packages) {
        const pkg = parsePackageArg(arg);
        if (!pkg) {
            console.error(`Invalid package: ${arg}`);
            process.exit(1);
        }

        const version = await resolveVersion(pkg.name, pkg.version);
        if (!version) {
            console.error(`Could not resolve version for ${pkg.name}`);
            process.exit(1);
        }

        console.log(`  📦 ${pkg.name}@${version}`);

        const [osvResult, ghResult] = await Promise.all([
            checkOSV(pkg.name, version),
            checkGitHub(pkg.name)
        ]);

        if (osvResult || ghResult) {
            console.error(`\n❌ BLOCKED: ${pkg.name}@${version}`);
            console.error(`   ${osvResult || ghResult}\n`);
            process.exit(1);
        }

        console.log(`     ✅ Clean\n`);
    }

    console.log('Installing...\n');
    execSync(`pnpm add ${packages.join(' ')} ${flags}`, { stdio: 'inherit' });
}

try {
    await main();
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
