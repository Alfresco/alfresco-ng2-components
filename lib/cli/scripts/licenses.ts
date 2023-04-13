#!/usr/bin/env node

/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import * as path from 'path';
import * as fs from 'fs';
import * as checker from 'license-checker';
import * as licenseList from 'spdx-license-list';
import * as ejs from 'ejs';
import program from 'commander';

interface PackageInfo {
    name: string;
    description: string;
    version: string;
}

const nonStandardLicenses = {
    'public domain': 'PDDL-1.0',
    apache: 'Apache-2.0',
    bsd: 'BSD-2-Clause'
};

const missingRepositories = {
    '@alfresco/adf-testing': 'https://github.com/Alfresco/alfresco-ng2-components',
    '@webassemblyjs/helper-api-error': 'https://github.com/xtuc/webassemblyjs',
    '@webassemblyjs/helper-fsm': 'https://github.com/xtuc/webassemblyjs',
    '@webassemblyjs/ieee754': 'https://github.com/xtuc/webassemblyjs',
    '@webassemblyjs/leb128': 'https://github.com/xtuc/webassemblyjs',
    'adf-tslint-rules': 'https://github.com/Alfresco/alfresco-ng2-components',
    'adf-monaco-extension': 'https://github.com/eromano/aca-monaco-extension',
    indexof: 'https://github.com/component/indexof',
    'rxjs-compat': 'https://github.com/ReactiveX/rxjs/tree/master/compat'
};

function licenseWithMDLinks(licenseExp: string): string {
    let licenseUrl = '';

    if (licenseList[licenseExp] && licenseList[licenseExp]['url']) {
        licenseUrl = licenseList[licenseExp]['url'];
    } else {
        const substituteLicString = nonStandardLicenses[licenseExp.toLowerCase()];

        if (licenseList[substituteLicString] && licenseList[substituteLicString]['url']) {
            licenseUrl = licenseList[substituteLicString]['url'];
        }
    }

    if (licenseUrl) {
        return `[${licenseExp}](${licenseUrl})`;
    } else {
        return licenseExp;
    }
}

function getPackageFile(packagePath: string): PackageInfo {
    try {
        return JSON.parse(fs.readFileSync(packagePath).toString());
    } catch {
        console.error('Error parsing package.json file');
        process.exit(1);
    }
}

export default function main(_args: string[], workingDir: string) {
    program
        .description('Generate a licences report')
        .usage('licenses [options]')
        .option('-p, --package <path>', 'Path to package file (default: package.json in working directory)')
        .option('-d, --outDir <dir>', 'Ouput directory (default: working directory)')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
        return;
    }

    let packagePath = path.resolve(workingDir, 'package.json');

    if (program.package) {
        packagePath = path.resolve(program.package);
    }

    if (!fs.existsSync(packagePath)) {
        console.error('The package.json file was not found');
        process.exit(1);
    }

    const templatePath = path.resolve(__dirname, '../templates/licensePage.ejs');
    if (!fs.existsSync(templatePath)) {
        console.error(`Cannot find the report template: ${templatePath}`);
        process.exit(1);
    }

    return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-console
        console.info(`Checking ${packagePath}`);

        checker.init({
            start: workingDir,
            production: true,
            failOn: 'GPL'
        }, function(err: any, packages: any[]) {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                // eslint-disable-next-line guard-for-in
                for (const packageName in packages) {
                    const pack = packages[packageName];
                    pack['licenseExp'] = pack['licenses'].toString()
                        .replace(/\*/, '')
                        .replace(/[a-zA-Z0-9\-\.]+/g, (match: string) => {
                            const lowerMatch = match.toLowerCase();

                            if ((lowerMatch !== 'and') && (lowerMatch !== 'or') && (lowerMatch !== 'with')) {
                                return licenseWithMDLinks(match);
                            } else {
                                return match;
                            }
                        });

                    if (!pack['repository']) {
                        const lastAtSignPos = packageName.lastIndexOf('@');
                        const mainName = packageName.substring(0, lastAtSignPos);

                        if (missingRepositories[mainName]) {
                            pack['repository'] = missingRepositories[mainName];
                        }
                    }
                }

                const packageJson: PackageInfo = getPackageFile(packagePath);

                ejs.renderFile(templatePath, {
                    packages,
                    projVersion: packageJson.version,
                    projName: packageJson.name
                }, {}, (ejsError: any, mdText: string) => {
                    if (ejsError) {
                        console.error(ejsError);
                        reject(ejsError);
                    } else {
                        const outputPath = path.resolve(program.outDir || workingDir);
                        const outputFile = path.join(outputPath, `license-info-${packageJson.version}.md`);

                        fs.writeFileSync(outputFile, mdText);
                        // eslint-disable-next-line no-console
                        console.log(`Report saved as ${outputFile}`);
                        resolve(0);
                    }
                });
            }
        });
    });
}
