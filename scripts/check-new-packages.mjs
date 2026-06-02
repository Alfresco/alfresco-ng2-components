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
 * Pre-commit security check.
 *
 * Runs via husky pre-commit hook.
 * Blocks commits containing known malicious packages.
 */

import { readChangedPackagesFromGitDiff } from './security/lockfile-parser.mjs';
import { checkPackagesForMalware } from './security/malware-checker.mjs';
import {
    printCheckingMessage,
    printCommitBlockedWarning,
    printAllPackagesClean
} from './security/report-printer.mjs';

async function main() {
    const changedPackages = readChangedPackagesFromGitDiff();

    if (!changedPackages.length) {
        process.exit(0);
    }

    printCheckingMessage(changedPackages.length);

    const malwareFindings = await checkPackagesForMalware(changedPackages);

    if (malwareFindings.length > 0) {
        printCommitBlockedWarning(malwareFindings);
        process.exit(1);
    }

    printAllPackagesClean();
}

try {
    await main();
} catch (error) {
    console.error('Security check error:', error.message);
    process.exit(0);
}
