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

import { execSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

const NPM_PATH = process.env.npm_execpath || 'npm';
const NPX_CMD = NPM_PATH.endsWith('npm-cli.js')
    ? `"${process.execPath}" "${NPM_PATH.replace('npm-cli.js', 'npx-cli.js')}"`
    : 'npx';

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

function directoryExists(path) {
    try {
        return statSync(path).isDirectory();
    } catch {
        return false;
    }
}

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

    if (!directoryExists(nodeModulesPath)) {
        return [];
    }

    const nonScopedInstalled = TRUSTED_PACKAGES
        .filter(pkg => directoryExists(join(nodeModulesPath, pkg)));

    const scopedInstalled = TRUSTED_SCOPED_PACKAGES
        .filter(pkg => {
            const [scope, name] = pkg.split('/');
            return directoryExists(join(nodeModulesPath, scope, name));
        });

    return [...new Set([...nonScopedInstalled, ...scopedInstalled])];
}

function runSecurityCheck() {
    console.log('Step 1/3: Running security check...\n');
    const securityCheckPath = join(__dirname, 'check-security.mjs');
    const securityPassed = run(`"${process.execPath}" "${securityCheckPath}"`);

    if (!securityPassed) {
        console.error('\n❌ Security check failed - installation aborted\n');
        process.exit(1);
    }
}

function rebuildTrustedPackages() {
    console.log('\nStep 2/3: Rebuilding trusted packages...\n');
    const trustedInstalled = getInstalledTrustedPackages();

    if (!trustedInstalled.length) {
        console.log('No trusted packages require rebuilding.\n');
        return;
    }

    console.log('Trusted packages to rebuild:');
    for (const pkg of trustedInstalled) {
        console.log(`  ✓ ${pkg}`);
    }

    const npmCmd = NPM_PATH === 'npm' ? 'npm' : `"${process.execPath}" "${NPM_PATH}"`;
    run(`${npmCmd} rebuild --ignore-scripts=false ${trustedInstalled.join(' ')}`);
}

function setupHusky() {
    console.log('\nStep 3/3: Setting up husky...\n');
    const huskyPath = join(ROOT_DIR, 'node_modules', 'husky');

    if (directoryExists(huskyPath)) {
        run(`${NPX_CMD} husky`);
    }
}

async function main() {
    console.log('\n' + '='.repeat(70));
    console.log('🔒 ADF POST-INSTALL SECURITY');
    console.log('='.repeat(70) + '\n');

    runSecurityCheck();
    rebuildTrustedPackages();
    setupHusky();

    console.log('='.repeat(70));
    console.log('✅ Post-install security complete');
    console.log('='.repeat(70) + '\n');
}

main().catch(error => {
    console.error('Post-install failed:', error.message);
    process.exit(1);
});
