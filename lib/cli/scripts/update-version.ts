#!/usr/bin/env node

/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { exec } from './exec';
import * as program from 'commander';
import { logger } from './logger';

export interface UpdateArgs {
    pathPackage: string;
    latest?: boolean;
    alpha?: boolean;
    beta?: boolean;
    version: string;
    vjs: string;
    skipGnu: boolean;
}

const ALPHA = 'alpha';
const BETA = 'beta';
const LATEST = 'latest';
const ADF_LIBS_PREFIX = '\"@alfresco/adf-[^"]*\":';
const JS_API_DEPENDENCY = '@alfresco/js-api';

let projects = [''];

function latestPerform(args: UpdateArgs) {
    tagPerform(args, LATEST);
}

function versionPerform(args: UpdateArgs) {
    updateLibsVersionPerform(args.pathPackage, args.version, args.skipGnu);
}

function versionJsPerform(args: UpdateArgs) {
    updateJsAPIVersionPerform(args.pathPackage, args.vjs, args.skipGnu);
}

function alphaPerform(args: UpdateArgs) {
    tagPerform(args, ALPHA);
}

function betaPerform(args: UpdateArgs) {
    tagPerform(args, BETA);
}

function findADFLibsDependencies(args: UpdateArgs) {
    const prjs: any = [];
    const result = exec('grep', [`${ADF_LIBS_PREFIX}`, `${args.pathPackage}/package.json`], {}).trim();
    const res = result.replace(/,\s*$/, '').split(',');
    res.forEach( (dependecy) => {
        const dep = dependecy.split(':');
        const depName = dep[0].trim();
        prjs.push(depName.replace(/"/g, ''));
    });
    return prjs;
}

function getLatestVersionFromNpm(tag: string, project: string): string {
    logger.info(`====== Auto find latest ${tag} version of ${project}`);
    const latestVersion = exec('npm', ['view', `${project}@${tag}`, `version`], {}).trim();
    logger.info(`====== version lib ${latestVersion} =====`);
    return latestVersion;
}

function updateLibsVersionPerform(path: string, version: string, skipGnu = false) {
    logger.info('Perform libs version...');
    projects.forEach( (project) => {
        logger.info(`apply version ${version} on ${project} ...`);
        project = project.replace('/', '\\/');
        replaceVersionPerform(project, version, path, skipGnu);
    });
}

function updateJsAPIVersionPerform(path: string, version: string, skipGnu = false) {
    logger.info('Perform js-api version...');
    logger.info(`apply version ${version} on ${JS_API_DEPENDENCY} ...`);
    const project = JS_API_DEPENDENCY.replace('/', '\\/');
    replaceVersionPerform(project, version, path, skipGnu);
}

function replaceVersionPerform(project: string, version: string, path: string, skipGnu = false) {
    const rule = `s/\"${project}\": \".*\"/\"${project}\": \"${version}\"/g`;
    if (skipGnu) {
        exec('sed', ['-i', '', `${rule}`, `${path}/package.json`], {}).trim();
    } else {
        exec('sed', ['-i', `${rule}`, `${path}/package.json`], {}).trim();
    }
}

function tagPerform(args: UpdateArgs, tag: string) {
    logger.info(`Perform ${tag} update...`);
    tagLibPerform(args, tag);
    tagJsPerform(args, tag);
}

function tagLibPerform(args: UpdateArgs, tag: string) {
    const libVersion = getLatestVersionFromNpm(tag, '@alfresco/adf-extensions');
    updateLibsVersionPerform(args.pathPackage, libVersion, args.skipGnu);
}

function tagJsPerform(args: UpdateArgs, tag: string) {
    const jsApiVersion = getLatestVersionFromNpm(tag, JS_API_DEPENDENCY);
    updateJsAPIVersionPerform(args.pathPackage, jsApiVersion, args.skipGnu);
}

export default function (args: UpdateArgs) {
    main(args);
}

function main(args) {

    program
        .version('This command allows you to update the adf dependencies and js-api with different versions\n\n' +
            'Update adf libs and js-api with latest alpha\n\n' +
            'adf-cli update-version --alpha --pathPackage "$(pwd)"')
        .description('')
        .option('--pathPackage [type]', 'pathPackage')
        .option('--alpha [type]', 'use alpha')
        .option('--beta [type]', 'use beta')
        .option('--version [type]', 'use version')
        .option('--vjs [type]', 'vjs use version js api')
        .option('--skipGnu [type]', 'skipGnu')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
    }

    projects = findADFLibsDependencies(args);

    if (args.version) {
        versionPerform(args);
    }

    if (args.vjs) {
        versionJsPerform(args);
    }

    if (args.latest === true) {
        latestPerform(args);
    }

    if (args.alpha === true) {
        alphaPerform(args);
    }

    if (args.beta === true) {
        betaPerform(args);
    }

}
