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
 * Safe add package.
 *
 * Checks packages against security databases before installing.
 * Usage: pnpm run add <package>[@version] [-- -D]
 */

import { execSync } from 'node:child_process';

import { checkSinglePackageForMalware } from './security/malware-checker.mjs';
import {
    printSecurityCheckHeader,
    printPackageClean,
    printInstallBlockedWarning
} from './security/report-printer.mjs';

const NPM_REGISTRY_URL = 'https://registry.npmjs.org';
const REQUEST_TIMEOUT_MS = 5000;

// ============================================================================
// ARGUMENT PARSING
// ============================================================================

function parsePackageArgument(argument) {
    const packageMatch = argument.match(/^(@?[^@]+)(?:@(.+))?$/);

    if (!packageMatch) {
        return null;
    }

    return {
        name: packageMatch[1],
        version: packageMatch[2] || 'latest'
    };
}

function separatePackagesAndFlags(args) {
    const packageArguments = args.filter(arg => !arg.startsWith('-'));
    const flagArguments = args.filter(arg => arg.startsWith('-'));

    return {
        packages: packageArguments,
        flags: flagArguments.join(' ')
    };
}

// ============================================================================
// VERSION RESOLUTION
// ============================================================================

async function fetchLatestVersion(packageName) {
    try {
        const response = await fetch(`${NPM_REGISTRY_URL}/${packageName}/latest`, {
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
        });

        if (!response.ok) {
            return null;
        }

        const packageData = await response.json();
        return packageData.version;
    } catch {
        return null;
    }
}

async function resolvePackageVersion(packageName, requestedVersion) {
    if (requestedVersion !== 'latest') {
        return requestedVersion;
    }

    return fetchLatestVersion(packageName);
}

// ============================================================================
// PACKAGE INSTALLATION
// ============================================================================

function installPackages(packageNames, flags) {
    const packageList = packageNames.join(' ');
    const installCommand = `pnpm add ${packageList} ${flags}`.trim();

    execSync(installCommand, { stdio: 'inherit' });
}

// ============================================================================
// MAIN
// ============================================================================

async function validateAndCheckPackage(packageArgument) {
    const parsedPackage = parsePackageArgument(packageArgument);

    if (!parsedPackage) {
        console.error(`Invalid package argument: ${packageArgument}`);
        process.exit(1);
    }

    const resolvedVersion = await resolvePackageVersion(parsedPackage.name, parsedPackage.version);

    if (!resolvedVersion) {
        console.error(`Could not resolve version for ${parsedPackage.name}`);
        process.exit(1);
    }

    const malwareReason = await checkSinglePackageForMalware(parsedPackage.name, resolvedVersion);

    if (malwareReason) {
        printInstallBlockedWarning(parsedPackage.name, resolvedVersion, malwareReason);
        process.exit(1);
    }

    printPackageClean(parsedPackage.name, resolvedVersion);
}

async function main() {
    const commandLineArgs = process.argv.slice(2);
    const { packages, flags } = separatePackagesAndFlags(commandLineArgs);

    if (!packages.length) {
        console.log('Usage: pnpm run add <package>[@version] [-- -D]');
        process.exit(1);
    }

    printSecurityCheckHeader();

    for (const packageArgument of packages) {
        await validateAndCheckPackage(packageArgument);
    }

    console.log('Installing...\n');
    installPackages(packages, flags);
}

try {
    await main();
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
