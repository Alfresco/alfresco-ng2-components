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

import { argv, exit } from 'node:process';
import { parseArgs } from 'node:util';
import * as path from 'path';
import * as fs from 'fs';
import * as licenseList from 'spdx-license-list';
import * as ejs from 'ejs';

const { collectProductionLicenses } = require('../resources/license-collector.cjs');

interface LicensesCommandArgs {
    package?: string;
    outDir?: string;
}

interface PackageInfo {
    name: string;
    description: string;
    version: string;
    dependencies?: Record<string, string>;
}

interface PackageInfoWithMetadata {
    name: string;
    version: string;
    licenseExp: string;
    repository?: string;
}

const nonStandardLicenses = {
    'public domain': 'PDDL-1.0',
    apache: 'Apache-2.0',
    bsd: 'BSD-2-Clause'
};

const missingRepositories = {
    '@webassemblyjs/helper-api-error': 'https://github.com/xtuc/webassemblyjs',
    '@webassemblyjs/helper-fsm': 'https://github.com/xtuc/webassemblyjs',
    '@webassemblyjs/ieee754': 'https://github.com/xtuc/webassemblyjs',
    '@webassemblyjs/leb128': 'https://github.com/xtuc/webassemblyjs',
    indexof: 'https://github.com/component/indexof',
    'rxjs-compat': 'https://github.com/ReactiveX/rxjs/tree/master/compat'
};

/**
 * Get a license with MD link
 *
 * @param licenseExp license expression
 * @returns license
 */
function licenseWithMDLinks(licenseExp: string): string {
    let licenseUrl = '';

    if (licenseList[licenseExp]?.['url']) {
        licenseUrl = licenseList[licenseExp]['url'];
    } else {
        const substituteLicString = nonStandardLicenses[licenseExp.toLowerCase()];

        if (licenseList[substituteLicString]?.['url']) {
            licenseUrl = licenseList[substituteLicString]['url'];
        }
    }

    if (licenseUrl) {
        return `[${licenseExp}](${licenseUrl})`;
    } else {
        return licenseExp;
    }
}

/**
 * Get package file
 *
 * @param packagePath package.json path
 * @returns package model
 */
function getPackageFile(packagePath: string): PackageInfo {
    try {
        return JSON.parse(fs.readFileSync(packagePath).toString());
    } catch {
        console.error('Error parsing package.json file');
        exit(1);
    }
}

function toLinkedLicenseExpression(rawExpression: string): string {
    return rawExpression.replace(/\*/g, '').replace(/[a-zA-Z0-9\-.]+/g, (match: string) => {
        const lowerMatch = match.toLowerCase();
        if (lowerMatch !== 'and' && lowerMatch !== 'or' && lowerMatch !== 'with') {
            return licenseWithMDLinks(match);
        }

        return match;
    });
}

/**
 * Licenses command
 *
 * @param _args (not used)
 * @param workingDir working directory
 * @returns void function
 */
export default function main(_args: string[], workingDir: string) {
    if (argv.includes('-h') || argv.includes('--help')) {
        console.log(`
Usage: licenses [options]

Generate a licenses report

Options:
  -p, --package <path>  Path to package file (default: package.json in working directory)
  -d, --outDir <dir>    Output directory (default: working directory)
  -h, --help            Display help for command
`);
        exit(0);
    }

    const { values } = parseArgs({
        args: argv.slice(2),
        options: {
            package: {
                type: 'string',
                short: 'p'
            },
            outDir: {
                type: 'string',
                short: 'd'
            }
        },
        allowPositionals: true
    });

    const options: LicensesCommandArgs = {
        package: values.package as string | undefined,
        outDir: values.outDir as string | undefined
    };

    let packagePath = path.resolve(workingDir, 'package.json');

    if (options.package) {
        packagePath = path.resolve(options.package);
    }

    if (!fs.existsSync(packagePath)) {
        console.error('The package.json file was not found');
        exit(1);
    }

    const templatePath = path.resolve(__dirname, '../templates/licensePage.ejs');
    if (!fs.existsSync(templatePath)) {
        console.error(`Cannot find the report template: ${templatePath}`);
        exit(1);
    }

    return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-console
        console.info(`Checking ${packagePath}`);
        const licenseScan = collectProductionLicenses(packagePath, {
            denyList: ['GPL'],
            missingRepositories
        });

        const filteredPackages: Record<string, PackageInfoWithMetadata> = {};
        for (const pack of licenseScan.packages) {
            filteredPackages[pack.key] = {
                name: pack.name,
                version: pack.version,
                licenseExp: toLinkedLicenseExpression(pack.rawLicenseExpression),
                repository: pack.repository
            };
        }

        if (licenseScan.deniedPackages.length > 0) {
            const deniedError = new Error(`Denied licenses found:\n${licenseScan.deniedPackages.join('\n')}`);
            console.error(deniedError.message);
            reject(deniedError);
            return;
        }

        const packageJson: PackageInfo = getPackageFile(packagePath);

        ejs.renderFile(
            templatePath,
            {
                filteredPackages,
                projVersion: packageJson.version,
                projName: packageJson.name
            },
            {},
            (ejsError: unknown, mdText: string) => {
                if (ejsError) {
                    console.error(ejsError);
                    reject(ejsError);
                } else {
                    const outputPath = path.resolve(options.outDir || workingDir);
                    const outputFile = path.join(outputPath, `license-info-${packageJson.version}.md`);

                    fs.writeFileSync(outputFile, mdText);
                    // eslint-disable-next-line no-console
                    console.log(`Report saved as ${outputFile}`);
                    resolve(0);
                }
            }
        );
    });
}
