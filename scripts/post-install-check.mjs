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
 * Post-install security check.
 *
 * Runs after pnpm install via the prepare hook.
 * Warns if any installed packages are known malware.
 */

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readAllPackagesFromLockfile } from './security/lockfile-parser.mjs';
import { checkPackagesForMalware } from './security/malware-checker.mjs';
import { printMalwareWarning } from './security/report-printer.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const LOCKFILE_PATH = join(ROOT_DIR, 'pnpm-lock.yaml');

async function main() {
    const installedPackages = readAllPackagesFromLockfile(LOCKFILE_PATH);

    if (!installedPackages.length) {
        return;
    }

    const malwareFindings = await checkPackagesForMalware(installedPackages);

    if (malwareFindings.length > 0) {
        printMalwareWarning(malwareFindings);
        process.exit(1);
    }
}

main().catch(() => {});
