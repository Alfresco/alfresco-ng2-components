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

const OSV_BATCH_API = 'https://api.osv.dev/v1/querybatch';
const REQUEST_TIMEOUT_MS = 30000;
const BATCH_SIZE = 1000;

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

function isMalwareRelated(text) {
    const lowerText = text.toLowerCase();
    return MALWARE_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

function extractVersionsFromVulnerability(vulnerability) {
    const affectedEntries = vulnerability.affected || [];

    const introducedVersions = affectedEntries
        .flatMap(entry => entry.ranges || [])
        .flatMap(range => range.events || [])
        .filter(event => event.introduced && event.introduced !== '0')
        .map(event => event.introduced);

    const explicitVersions = affectedEntries.flatMap(entry => entry.versions || []);

    return [...new Set([...introducedVersions, ...explicitVersions])];
}

function splitIntoBatches(items, batchSize) {
    const batches = [];
    for (let index = 0; index < items.length; index += batchSize) {
        batches.push(items.slice(index, index + batchSize));
    }
    return batches;
}

function buildQueryPayload(dependencies) {
    return {
        queries: dependencies.map(dependency => ({
            package: { name: dependency.name, ecosystem: 'npm' },
            version: dependency.version
        }))
    };
}

async function queryBatch(dependencies) {
    const response = await fetch(OSV_BATCH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildQueryPayload(dependencies)),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });

    if (!response.ok) {
        return [];
    }

    const data = await response.json();
    return data.results || [];
}

function extractMalwareInfo(vulnerability) {
    const summary = [vulnerability.summary || '', vulnerability.details || ''].join(' ');

    if (!isMalwareRelated(summary)) {
        return null;
    }

    const packageName = vulnerability.affected?.[0]?.package?.name;
    if (!packageName) {
        return null;
    }

    const versions = extractVersionsFromVulnerability(vulnerability);
    if (versions.length === 0) {
        return null;
    }

    return {
        packageName,
        versions,
        reason: vulnerability.summary || 'Malware detected by OSV'
    };
}

function processBatchResults(batchResults, malwareRegistry) {
    for (const result of batchResults) {
        const vulnerabilities = result.vulns || [];

        for (const vulnerability of vulnerabilities) {
            const malwareInfo = extractMalwareInfo(vulnerability);

            if (malwareInfo) {
                if (!malwareRegistry[malwareInfo.packageName]) {
                    malwareRegistry[malwareInfo.packageName] = { versions: [], reason: '', source: 'OSV' };
                }
                malwareRegistry[malwareInfo.packageName].versions.push(...malwareInfo.versions);
                malwareRegistry[malwareInfo.packageName].reason = malwareInfo.reason;
            }
        }
    }
}

export async function fetchMalwareData(projectDependencies) {
    console.log('  📡 Fetching from OSV (Google)...');
    const malwareRegistry = {};

    if (!projectDependencies || projectDependencies.length === 0) {
        console.log('     ⚠ OSV: No dependencies to check');
        return malwareRegistry;
    }

    try {
        const dependencyBatches = splitIntoBatches(projectDependencies, BATCH_SIZE);

        for (const batch of dependencyBatches) {
            const batchResults = await queryBatch(batch);
            processBatchResults(batchResults, malwareRegistry);
        }

        console.log(`     ✓ OSV: Found ${Object.keys(malwareRegistry).length} malware entries`);
    } catch (error) {
        console.log(`     ⚠ OSV: Could not fetch (${error.message})`);
    }

    return malwareRegistry;
}
