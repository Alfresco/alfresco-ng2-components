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
 * Post-install Security Script
 *
 * Runs after `npm install` / `npm ci` via the prepare hook.
 * The preinstall hook already checked package.json and lockfile - this is
 * a defense-in-depth check against installed packages.
 *
 * This script:
 * 1. Runs security check against OSV + GitHub Advisory (defense in depth)
 * 2. Rebuilds trusted packages that need native bindings
 * 3. Sets up husky
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// Packages that are trusted to run postinstall/install scripts
// These typically need to compile native bindings or setup tooling
const TRUSTED_PACKAGES = [
    'esbuild',
    'sharp',
    'node-sass',
    'sass',
    'pdfjs-dist',
    'canvas',
    'bcrypt',
    'sqlite3',
    'better-sqlite3',
    'puppeteer',
    'playwright',
    'fsevents',
    'nx',
    'husky',
    'core-js',
    'core-js-pure'
];

// Scoped packages that need rebuild (full package names)
const TRUSTED_SCOPED_PACKAGES = [
    '@esbuild/darwin-arm64',
    '@esbuild/darwin-x64',
    '@esbuild/linux-x64',
    '@esbuild/win32-x64',
    '@parcel/watcher',
    '@nx/nx-darwin-arm64',
    '@nx/nx-darwin-x64',
    '@nx/nx-linux-x64-gnu',
    '@nx/nx-linux-x64-musl',
    '@nx/nx-win32-x64-msvc',
    '@swc/core'
];

function run(command, options = {}) {
    try {
        execSync(command, {
            stdio: 'inherit',
            cwd: ROOT_DIR,
            ...options
        });
        return true;
    } catch {
        return false;
    }
}

function getInstalledTrustedPackages() {
    const nodeModulesPath = join(ROOT_DIR, 'node_modules');
    if (!existsSync(nodeModulesPath)) return [];

    const installed = [];

    // Check non-scoped packages
    for (const pkg of TRUSTED_PACKAGES) {
        const pkgPath = join(nodeModulesPath, pkg);
        if (existsSync(pkgPath)) {
            installed.push(pkg);
        }
    }

    // Check scoped packages
    for (const pkg of TRUSTED_SCOPED_PACKAGES) {
        const [scope, name] = pkg.split('/');
        const pkgPath = join(nodeModulesPath, scope, name);
        if (existsSync(pkgPath)) {
            installed.push(pkg);
        }
    }

    return [...new Set(installed)];
}

async function main() {
    console.log('\n' + '='.repeat(70));
    console.log('🔒 ADF POST-INSTALL SECURITY');
    console.log('='.repeat(70) + '\n');

    // Step 1: Run security check
    console.log('Step 1/3: Running security check...\n');
    const securityCheckPath = join(__dirname, 'check-security.mjs');

    // Run security check as subprocess (it calls process.exit)
    const securityPassed = run(`node "${securityCheckPath}"`);
    if (!securityPassed) {
        console.error('\n❌ Security check failed - installation aborted\n');
        process.exit(1);
    }

    // Step 2: Rebuild trusted packages
    console.log('\nStep 2/3: Rebuilding trusted packages...\n');
    const trustedInstalled = getInstalledTrustedPackages();

    if (trustedInstalled.length > 0) {
        console.log('Trusted packages to rebuild:');
        trustedInstalled.forEach(pkg => console.log(`  ✓ ${pkg}`));
        console.log('');

        run(`npm rebuild --ignore-scripts=false ${trustedInstalled.join(' ')}`);
    } else {
        console.log('No trusted packages require rebuilding.\n');
    }

    // Step 3: Setup husky
    console.log('Step 3/3: Setting up husky...\n');
    const huskyPath = join(ROOT_DIR, 'node_modules', 'husky');
    if (existsSync(huskyPath)) {
        run('npx husky');
    }

    console.log('='.repeat(70));
    console.log('✅ Post-install security complete');
    console.log('='.repeat(70) + '\n');
}

main().catch(err => {
    console.error('Post-install failed:', err.message);
    process.exit(1);
});
