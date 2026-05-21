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

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const require = createRequire(import.meta.url);
const { collectProductionLicenses } = require('../lib/cli/resources/license-collector.cjs');

function parseArgs(args) {
    const options = {
        out: 'licenses.txt',
        deny: 'GPL,GPL-2.0'
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === '--out' && args[i + 1]) {
            options.out = args[++i];
        } else if (arg === '--deny' && args[i + 1]) {
            options.deny = args[++i];
        } else if (arg === '-h' || arg === '--help') {
            console.log(`
Usage: node scripts/check-licenses.mjs [options]

Options:
  --out <file>   Output file path (default: licenses.txt)
  --deny <list>  Comma-separated denylist (default: GPL,GPL-2.0)
  -h, --help     Show help
`);
            process.exit(0);
        }
    }

    return options;
}

function checkLicenses() {
    const options = parseArgs(process.argv.slice(2));
    const workspaceRoot = process.cwd();
    const rootPackageJsonPath = path.join(workspaceRoot, 'package.json');

    if (!fs.existsSync(rootPackageJsonPath)) {
        console.error('Cannot find package.json in the current directory');
        process.exit(1);
    }

    const denylist = options.deny.split(',').map((entry) => entry.trim()).filter(Boolean);
    const { packages, deniedPackages } = collectProductionLicenses(rootPackageJsonPath, {
        denyList: denylist
    });

    const outputLines = [
        '# Production dependency licenses',
        '',
        '| Package | Version | License |',
        '| --- | --- | --- |',
        ...packages.map((entry) => `| ${entry.name} | ${entry.version} | ${entry.rawLicenseExpression} |`),
        ''
    ];

    const outputPath = path.resolve(workspaceRoot, options.out);
    fs.writeFileSync(outputPath, `${outputLines.join('\n')}`, 'utf8');

    if (deniedPackages.length > 0) {
        console.error('Denied licenses found:');
        for (const entry of deniedPackages) {
            console.error(`- ${entry}`);
        }
        process.exit(1);
    }

    console.log(`Checked ${packages.length} packages. Output written to ${outputPath}`);
}

checkLicenses();
