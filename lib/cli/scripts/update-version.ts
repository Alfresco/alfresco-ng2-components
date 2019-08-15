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

import { logging } from '@angular-devkit/core';
import { spawnSync } from 'child_process';

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

function _exec(command: string, args: string[], opts: { cwd?: string, input?: string }, logger: logging.Logger) {
    if (process.platform.startsWith('win')) {
        args.unshift('/c', command);
        command = 'cmd.exe';
    }

    const { status, error, stderr, stdout } = spawnSync(command, args, { ...opts });

    if (status !== 0) {
        logger.error(`Command failed: ${command} ${args.map((x) => JSON.stringify(x)).join(', ')}`);
        if (error) {
            logger.error('Error: ' + (error ? error.message : 'undefined'));
        } else {
            logger.error(`STDERR:\n${stderr}`);
        }
        throw error;
    } else {
        return stdout.toString();
    }
}

function _latestPerform(args: UpdateArgs, logger: logging.Logger) {
    _tagPerform(args, LATEST, logger);
}

function _versionPerform(args: UpdateArgs, logger: logging.Logger) {
    _tagLibPerform(args, args.version, logger);
}

function _versionJsPerform(args: UpdateArgs, logger: logging.Logger) {
    _tagJsPerform(args, args.vjs, logger);
}

function _alphaPerform(args: UpdateArgs, logger: logging.Logger) {
    _tagPerform(args, ALPHA, logger);
}

function _betaPerform(args: UpdateArgs, logger: logging.Logger) {
    _tagPerform(args, BETA, logger);
}

function _findADFLibsDependencies(args: UpdateArgs, logger: logging.Logger) {
    const prjs: any = [];
    const result = _exec('grep', [`${ADF_LIBS_PREFIX}`, `${args.pathPackage}/package.json`], {}, logger).trim();
    const res = result.replace(/,\s*$/, '').split(',');
    res.forEach( (dependecy) => {
        const dep = dependecy.split(':');
        const depName = dep[0].trim();
        prjs.push(depName.replace(/"/g, ''));
    });
    return prjs;
}

function _getLatestVersionFromNpm(tag: string, project: string, logger: logging.Logger): string {
    logger.info(`====== Auto find latest ${tag} version of ${project}`);
    const latestVersion = _exec('npm', ['view', `${project}@${tag}`, `version`], {}, logger).trim();
    logger.info(`====== version lib ${latestVersion} =====`);
    return latestVersion;
}

function _updateLibsVersionPerform(args: UpdateArgs, version: string, logger: logging.Logger) {
    logger.info('Perform libs versioooon...');
    projects.forEach( (project) => {
        logger.info(`apply version ${version} on ${project} ...`);
        project = project.replace('/', '\\/');
        _replaceVersionPerform(args, project, version, logger);
    });
}

function _updateJsAPIVersionPerform(args: UpdateArgs, version: string, logger: logging.Logger) {
    logger.info('Perform js-api version...');
    logger.info(`apply version ${version} on ${JS_API_DEPENDENCY} ...`);
    const project = JS_API_DEPENDENCY.replace('/', '\\/');
    _replaceVersionPerform(args, project, version, logger);
}

function _replaceVersionPerform(args: UpdateArgs, project: string, version: string, logger: logging.Logger) {
    const rule = `s/\"${project}\": \".*\"/\"${project}\": \"${version}\"/g`;
    if (args.skipGnu) {
        _exec('sed', ['-i', '', `${rule}`, `${args.pathPackage}/package.json`], {}, logger).trim();
    } else {
        _exec('sed', ['-i', `${rule}`, `${args.pathPackage}/package.json`], {}, logger).trim();
    }
}

function _tagPerform(args: UpdateArgs, tag: string, logger: logging.Logger) {
    logger.info(`Perform ${tag} update...`);
    _tagLibPerform(args, tag, logger);
    _tagJsPerform(args, tag, logger);
}

function _tagLibPerform(args: UpdateArgs, tag: string, logger: logging.Logger) {
    const libVersion = _getLatestVersionFromNpm(tag, '@alfresco/adf-extensions', logger);
    _updateLibsVersionPerform(args, libVersion, logger);
}

function _tagJsPerform(args: UpdateArgs, tag: string, logger: logging.Logger) {
    const jsApiVersion = _getLatestVersionFromNpm(tag, JS_API_DEPENDENCY, logger);
    _updateJsAPIVersionPerform(args, jsApiVersion, logger);
}

export default async function (args: UpdateArgs, logger: logging.Logger) {

    projects = _findADFLibsDependencies(args, logger);

    if (args.version) {
        _versionPerform(args, logger);
    }

    if (args.vjs) {
        _versionJsPerform(args, logger);
    }

    if (args.latest === true) {
        _latestPerform(args, logger);
    }

    if (args.alpha === true) {
        _alphaPerform(args, logger);
    }

    if (args.beta === true) {
        _betaPerform(args, logger);
    }
}
