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

import { spawnSync } from 'node:child_process';
import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs';
import { argv, exit } from 'node:process';
import { parseArgs } from 'node:util';

interface AuditCommandArgs {
    package?: string;
    outDir?: string;
}

/**
 * Audit report command
 *
 * @param _args (unused)
 * @param workingDir working directory
 * @returns void
 */
export default function main(_args: string[], workingDir: string) {
    if (argv.includes('-h') || argv.includes('--help')) {
        console.log(`
Usage: audit [options]

Generate an audit report

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

    const options: AuditCommandArgs = {
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

    const templatePath = path.resolve(__dirname, '../templates/auditPage.ejs');
    if (!fs.existsSync(templatePath)) {
        console.error(`Cannot find the report template: ${templatePath}`);
        exit(1);
    }

    return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-console
        console.log(`Running audit on ${packagePath}`);

        const packageJson = JSON.parse(fs.readFileSync(packagePath).toString());

        // Run in the directory containing the package.json
        const packageDir = path.dirname(packagePath);

        // Use spawnSync with array arguments for safer command execution (prevents shell injection)
        // Cross-platform: npm is available on PATH on all platforms (Windows, macOS, Linux)
        const result = spawnSync('npm', ['audit', '--json', '--prod'], {
            cwd: packageDir,
            encoding: 'utf-8',
            // shell: false is the default and more secure (no shell interpretation)
            shell: false,
            // Set maxBuffer to handle large audit outputs
            maxBuffer: 10 * 1024 * 1024 // 10MB
        });

        let jsonAudit;

        // npm audit returns non-zero exit code when vulnerabilities are found
        // We still want to parse the JSON output in this case
        if (result.error) {
            console.error('Failed to run npm audit:', result.error.message);
            reject(result.error);
            return;
        }

        const auditOutput = result.stdout;
        if (!auditOutput) {
            console.error('npm audit produced no output');
            reject(new Error('npm audit produced no output'));
            return;
        }

        try {
            jsonAudit = JSON.parse(auditOutput);
        } catch (parseError) {
            console.error('Failed to parse npm audit output');
            reject(parseError);
            return;
        }

        ejs.renderFile(
            templatePath,
            {
                jsonAudit,
                projVersion: packageJson.version,
                projName: packageJson.name
            },
            {},
            (err: any, mdText: string) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    const outputPath = path.resolve(options.outDir || workingDir);
                    const outputFile = path.join(outputPath, `audit-info-${packageJson.version}.md`);

                    fs.writeFileSync(outputFile, mdText);

                    // eslint-disable-next-line no-console
                    console.log(`Report saved as ${outputFile}`);
                    resolve(0);
                }
            }
        );
    });
}
