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

const fs = require('node:fs');
const path = require('node:path');

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function resolvePackageJson(packageName, fromDirectory) {
    try {
        return require.resolve(`${packageName}/package.json`, {
            paths: [fromDirectory]
        });
    } catch {
        return '';
    }
}

function getRepositoryUrl(repository) {
    if (typeof repository === 'string') {
        return repository;
    }

    if (repository && typeof repository === 'object' && typeof repository.url === 'string') {
        return repository.url;
    }

    return '';
}

function getRawLicenseExpression(packageJson) {
    if (typeof packageJson.license === 'string' && packageJson.license.trim()) {
        return packageJson.license.trim();
    }

    if (packageJson.license && typeof packageJson.license === 'object' && typeof packageJson.license.type === 'string') {
        return packageJson.license.type.trim();
    }

    if (Array.isArray(packageJson.licenses)) {
        const values = packageJson.licenses
            .map((entry) => {
                if (typeof entry === 'string') {
                    return entry.trim();
                }

                if (entry && typeof entry === 'object' && typeof entry.type === 'string') {
                    return entry.type.trim();
                }

                return '';
            })
            .filter(Boolean);

        if (values.length > 0) {
            return values.join(' OR ');
        }
    }

    return 'UNKNOWN';
}

function extractLicenseTokens(rawExpression) {
    const tokens = (rawExpression || '').match(/[A-Za-z0-9-.+]+/g) || [];
    const operators = new Set(['AND', 'OR', 'WITH']);

    return tokens
        .map((token) => token.toUpperCase())
        .filter((token) => !operators.has(token));
}

function hasDeniedLicense(rawExpression, denyList) {
    const licenseTokens = extractLicenseTokens(rawExpression);

    return denyList.some((rule) => {
        const normalizedRule = (rule || '').trim().toUpperCase();
        if (!normalizedRule) {
            return false;
        }

        // Treat common copyleft family keywords as SPDX id prefixes.
        if (normalizedRule === 'GPL' || normalizedRule === 'LGPL' || normalizedRule === 'AGPL') {
            return licenseTokens.some((token) => token === normalizedRule || token.startsWith(`${normalizedRule}-`));
        }

        // Support explicit wildcard rules like "GPL-*".
        if (normalizedRule.endsWith('*')) {
            const prefix = normalizedRule.slice(0, -1);
            return prefix.length > 0 && licenseTokens.some((token) => token.startsWith(prefix));
        }

        // Otherwise require exact SPDX token match.
        return licenseTokens.includes(normalizedRule);
    });
}

function collectProductionLicenses(packagePath, options = {}) {
    const packageJsonFile = readJson(packagePath);
    const mainDependencies = Object.keys(packageJsonFile.dependencies || {});
    const packageDirectory = path.dirname(packagePath);
    const missingRepositories = options.missingRepositories || {};
    const denyList = options.denyList || [];

    const queue = mainDependencies.map((name) => ({
        name,
        fromDirectory: packageDirectory
    }));

    const visited = new Set();
    const packages = [];
    const deniedPackages = [];

    while (queue.length > 0) {
        const current = queue.shift();
        const packageJsonPath = resolvePackageJson(current.name, current.fromDirectory);

        if (!packageJsonPath || !fs.existsSync(packageJsonPath)) {
            continue;
        }

        const currentPackage = readJson(packageJsonPath);
        const name = currentPackage.name || current.name;
        const version = currentPackage.version || 'unknown';
        const packageFolder = path.dirname(packageJsonPath);
        const uniqueKey = `${name}@${version}:${packageFolder}`;

        if (visited.has(uniqueKey)) {
            continue;
        }
        visited.add(uniqueKey);

        const rawLicenseExpression = getRawLicenseExpression(currentPackage);
        const packageKey = `${name}@${version}`;
        const repository = getRepositoryUrl(currentPackage.repository) || missingRepositories[name] || '';

        const record = {
            key: packageKey,
            name,
            version,
            repository,
            rawLicenseExpression,
            dependencies: currentPackage.dependencies || {}
        };

        packages.push(record);

        if (hasDeniedLicense(rawLicenseExpression, denyList)) {
            deniedPackages.push(`${packageKey}: ${rawLicenseExpression}`);
        }

        const dependencies = Object.keys(currentPackage.dependencies || {});
        for (const dependencyName of dependencies) {
            queue.push({
                name: dependencyName,
                fromDirectory: packageFolder
            });
        }
    }

    packages.sort((a, b) => {
        const nameCompare = a.name.localeCompare(b.name);
        if (nameCompare !== 0) {
            return nameCompare;
        }

        return a.version.localeCompare(b.version);
    });

    return { packages, deniedPackages };
}

module.exports = {
    collectProductionLicenses
};
