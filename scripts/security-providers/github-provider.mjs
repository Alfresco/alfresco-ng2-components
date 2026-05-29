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

const GITHUB_ADVISORY_API = 'https://api.github.com/advisories';
const REQUEST_TIMEOUT_MS = 15000;

function extractExactVersion(versionRange) {
    const exactMatch = versionRange.match(/^=\s*(.+)$/);
    return exactMatch ? exactMatch[1].trim() : null;
}

function processAdvisoryVulnerability(vulnerability, advisory, registry) {
    const packageName = vulnerability.package?.name;

    if (!packageName || vulnerability.package?.ecosystem !== 'npm') {
        return;
    }

    if (!registry[packageName]) {
        registry[packageName] = { versions: [], versionRanges: [], reason: '', source: 'GitHub' };
    }

    if (vulnerability.vulnerable_version_range) {
        registry[packageName].versionRanges.push(vulnerability.vulnerable_version_range);

        const exactVersion = extractExactVersion(vulnerability.vulnerable_version_range);
        if (exactVersion) {
            registry[packageName].versions.push(exactVersion);
        }
    }

    registry[packageName].reason = advisory.summary || 'Malware detected by GitHub Advisory';
}

function processAdvisory(advisory, registry) {
    const vulnerabilities = advisory.vulnerabilities || [];

    for (const vulnerability of vulnerabilities) {
        processAdvisoryVulnerability(vulnerability, advisory, registry);
    }
}

export async function fetchMalwareData() {
    console.log('  📡 Fetching from GitHub Advisory...');
    const malwareRegistry = {};

    try {
        const response = await fetch(
            `${GITHUB_ADVISORY_API}?ecosystem=npm&type=malware&per_page=100`,
            {
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                },
                signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
            }
        );

        if (response.ok) {
            const advisories = await response.json();

            for (const advisory of advisories) {
                processAdvisory(advisory, malwareRegistry);
            }

            console.log(`     ✓ GitHub: Found ${Object.keys(malwareRegistry).length} malware entries`);
        } else if (response.status === 403) {
            console.log('     ⚠ GitHub: Rate limited (will use cached/fallback data)');
        } else {
            console.log(`     ⚠ GitHub: Unexpected status ${response.status}`);
        }
    } catch (error) {
        console.log(`     ⚠ GitHub: Could not fetch (${error.message})`);
    }

    return malwareRegistry;
}
