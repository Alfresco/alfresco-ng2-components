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

import program from 'commander';
import fetch from 'node-fetch';
import * as fs from 'fs';
import { logger } from './logger';
import { AlfrescoApi, AlfrescoApiConfig } from '@alfresco/js-api';
import { argv, exit } from 'node:process';
const ACTIVITI_CLOUD_APPS = require('./resources').ACTIVITI_CLOUD_APPS;

let alfrescoJsApiModeler: AlfrescoApi;
let alfrescoJsApiDevops: AlfrescoApi;
let args: ConfigArgs;
let isValid = true;
export interface ConfigArgs {
    modelerUsername: string;
    modelerPassword: string;
    devopsUsername: string;
    devopsPassword: string;
    oauth: string;
    tokenEndpoint: string;
    clientId: string;
    secret: string;
    scope: string;
    host: string;
    tag: string;
    envs: string[];
}

export const AAE_MICROSERVICES = ['deployment-service', 'modeling-service', 'dmn-service'];

/**
 * Perform a health check
 *
 * @param nameService service name
 */
async function healthCheck(nameService: string) {
    const url = `${args.host}/${nameService}/actuator/health`;

    const pathParams = {};
    const queryParams = {};
    const headerParams = {};
    const formParams = {};
    const bodyParam = {};
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];

    try {
        const health = await alfrescoJsApiModeler.oauth2Auth.callCustomApi(
            url,
            'GET',
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentTypes,
            accepts
        );
        if (health.status !== 'UP') {
            logger.error(`${nameService} is DOWN `);
            isValid = false;
        } else {
            const reset = '\x1b[0m';
            const green = '\x1b[32m';
            logger.info(`${green}${nameService} is UP!${reset}`);
        }
    } catch (error) {
        logger.error(`${nameService} is not reachable error: `, error);
        isValid = false;
    }
}

/**
 * Get deployed application
 *
 */
async function getApplications(): Promise<{ list: { entries: any[] } }> {
    const url = `${args.host}/deployment-service/v1/applications`;

    const pathParams = {};
    const queryParams = {};
    const headerParams = {};
    const formParams = {};
    const bodyParam = {};
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];

    try {
        await alfrescoJsApiDevops.login(args.devopsUsername, args.devopsPassword);

        const result = alfrescoJsApiDevops.oauth2Auth.callCustomApi(
            url,
            'GET',
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentTypes,
            accepts
        );
        result.on('error', (error) => {
            logger.error(`Get application by status ${error} `);
        });
        return result;
    } catch (error) {
        logger.error(`Get application by status ${error.status} `);
        isValid = false;
    }
}

/**
 * Get descriptors
 *
 * @returns deployment service descriptors
 */
function getDescriptors() {
    const url = `${args.host}/deployment-service/v1/descriptors`;

    const pathParams = {};
    const queryParams = {};
    const headerParams = {};
    const formParams = {};
    const bodyParam = {};
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];

    try {
        return alfrescoJsApiDevops.oauth2Auth.callCustomApi(
            url,
            'GET',
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentTypes,
            accepts
        );
    } catch (error) {
        logger.error(`Get Descriptors ${error.status} `);
        isValid = false;
    }
}

/**
 * Get projects
 *
 * @returns deployment service projects
 */
function getProjects() {
    const url = `${args.host}/modeling-service/v1/projects`;

    const pathParams = {};
    const queryParams = { maxItems: 1000 };
    const headerParams = {};
    const formParams = {};
    const bodyParam = {};
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];

    try {
        return alfrescoJsApiModeler.oauth2Auth.callCustomApi(
            url,
            'GET',
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentTypes,
            accepts
        );
    } catch (error) {
        logger.error('Get Projects' + error.status);
        isValid = false;
    }
}

/**
 * Get project release
 *
 * @param projectId project id
 * @returns project release
 */
function getProjectRelease(projectId: string) {
    const url = `${args.host}/modeling-service/v1/projects/${projectId}/releases`;

    const pathParams = {};
    const queryParams = {};
    const headerParams = {};
    const formParams = {};
    const bodyParam = {};
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];

    try {
        return alfrescoJsApiModeler.oauth2Auth.callCustomApi(
            url,
            'GET',
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentTypes,
            accepts
        );
    } catch (error) {
        logger.error('Get Projects Release' + error.status);
        isValid = false;
    }
}

/**
 * Release project
 *
 * @param projectId project id
 */
async function releaseProject(projectId: string) {
    const url = `${args.host}/modeling-service/v1/projects/${projectId}/releases`;

    const pathParams = {};
    const queryParams = {};
    const headerParams = {};
    const formParams = {};
    const bodyParam = {};
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];

    try {
        return alfrescoJsApiModeler.oauth2Auth.callCustomApi(
            url,
            'POST',
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentTypes,
            accepts
        );
    } catch (error) {
        await deleteProject(projectId);
        logger.error('Post Projects Release' + error.status);
        isValid = false;
    }
}

/**
 * Delete project
 *
 * @param projectId project id
 * @returns response payload
 */
function deleteProject(projectId: string) {
    const url = `${args.host}/modeling-service/v1/projects/${projectId}`;

    const pathParams = {};
    const queryParams = {};
    const headerParams = {};
    const formParams = {};
    const bodyParam = {};
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];

    try {
        return alfrescoJsApiModeler.oauth2Auth.callCustomApi(
            url,
            'DELETE',
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentTypes,
            accepts
        );
    } catch (error) {
        logger.error('Delete project error' + error.status);
        isValid = false;
    }
}

/**
 * Import and release project
 *
 * @param absoluteFilePath path to project file
 */
async function importAndReleaseProject(absoluteFilePath: string) {
    const fileContent = fs.createReadStream(absoluteFilePath);

    try {
        const project = await alfrescoJsApiModeler.oauth2Auth.callCustomApi(
            `${args.host}/modeling-service/v1/projects/import`,
            'POST',
            {},
            {},
            {},
            { file: fileContent },
            {},
            ['multipart/form-data'],
            ['application/json']
        );
        logger.info(`Project imported`);
        logger.info(`Create release`);

        return await alfrescoJsApiModeler.oauth2Auth.callCustomApi(
            `${args.host}/modeling-service/v1/projects/${project.entry.id}/releases`,
            'POST',
            {},
            {},
            {},
            {},
            {},
            ['application/json'],
            ['application/json']
        );
    } catch (error) {
        logger.error(`Not able to import the project/create the release ${absoluteFilePath} with status: ${error}`);
        isValid = false;
        throw error;
    }
}

/**
 * Deletes descriptor
 *
 * @param name descriptor name
 * @returns response payload
 */
function deleteDescriptor(name: string) {
    const url = `${args.host}/deployment-service/v1/descriptors/${name}`;

    const pathParams = {};
    const queryParams = {};
    const headerParams = {};
    const formParams = {};
    const bodyParam = {};
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];

    try {
        return alfrescoJsApiDevops.oauth2Auth.callCustomApi(
            url,
            'DELETE',
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentTypes,
            accepts
        );
    } catch (error) {
        logger.error('Delete descriptor' + error.status);
        isValid = false;
    }
}

/**
 * Deploys a model
 *
 * @param model model object
 * @returns response payload
 */
function deploy(model: any) {
    const url = `${args.host}/deployment-service/v1/applications`;

    const pathParams = {};
    const queryParams = {};
    const headerParams = {};
    const formParams = {};
    const bodyParam = model;
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];

    try {
        return alfrescoJsApiDevops.oauth2Auth.callCustomApi(
            url,
            'POST',
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentTypes,
            accepts
        );
    } catch (error) {
        logger.error('Deploy post' + error.status);
        isValid = false;
    }
}

/**
 * Initialise default endpoint token
 *
 * @param options token options
 * @returns options
 */
function initializeDefaultToken(options: any): any {
    options.tokenEndpoint = options.tokenEndpoint.replace('${clientId}', options.clientId);
    return options;
}

/**
 * Get a new Alfresco Api instance
 *
 * @param configArgs command params
 * @returns a new instance of Alfresco Api client
 */
function getAlfrescoJsApiInstance(configArgs: ConfigArgs): AlfrescoApi {
    let ssoHost = configArgs.oauth;
    ssoHost = ssoHost ?? configArgs.host;

    const config: AlfrescoApiConfig = {
        provider: 'BPM',
        hostBpm: `${configArgs.host}`,
        authType: 'OAUTH',
        contextRoot: 'alfresco',
        oauth2: {
            host: `${ssoHost}`,
            tokenUrl: `${ssoHost}/${configArgs.tokenEndpoint}`,
            clientId: `${configArgs.clientId}`,
            scope: `${configArgs.scope}`,
            secret: `${configArgs.secret}`,
            implicitFlow: false,
            silentLogin: false,
            redirectUri: '/'
        }
    };
    return new AlfrescoApi(config);
}

/**
 * Deploy missing applications
 *
 * @param tag tag
 * @param envs environments
 */
async function deployMissingApps(tag?: string, envs?: string[]) {
    const deployedApps = await getApplications();
    const failingApps = findFailingApps(deployedApps.list.entries);
    const missingApps = findMissingApps(deployedApps.list.entries);

    if (failingApps.length > 0) {
        failingApps.forEach((app) => {
            const reset = '\x1b[0m';
            const bright = '\x1b[1m';
            const red = '\x1b[31m';
            logger.error(`${red}${bright}ERROR: App ${app.entry.name} down or inaccessible ${reset}${red} with status ${app.entry.status}${reset}`);
        });
        exit(1);
    } else if (missingApps.length > 0) {
        logger.warn(`Missing apps: ${JSON.stringify(missingApps)}`);
        await checkIfAppIsReleased(missingApps, tag, envs);
    } else {
        const reset = '\x1b[0m';
        const green = '\x1b[32m';
        logger.info(`${green}All the apps are correctly deployed${reset}`);
    }
}

/**
 * Check if application is released
 *
 * @param missingApps applications
 * @param tag tag
 * @param envs environments
 */
async function checkIfAppIsReleased(missingApps: any[], tag?: string, envs?: string[]) {
    const projectList = await getProjects();
    let TIME = 5000;
    let noError = true;

    for (let i = 0; i < missingApps.length; i++) {
        noError = true;
        const currentAbsentApp = missingApps[i];
        const project = projectList.list.entries.find((currentApp: any) => currentAbsentApp.name === currentApp.entry.name);
        let projectRelease: any;

        if (project === undefined) {
            logger.warn('Missing project: Create the project for ' + currentAbsentApp.name);

            try {
                projectRelease = await importProjectAndRelease(currentAbsentApp, tag);
            } catch (error) {
                logger.info(`error status ${error.status}`);

                if (error.status !== 409) {
                    logger.info(`Not possible to upload the project ${currentAbsentApp.name} status  : ${JSON.stringify(error)}`);
                    exit(1);
                } else {
                    logger.error(`Not possible to upload the project because inconsistency CS - Modelling try to delete manually the node`);
                    exit(1);
                }
            }
        } else {
            TIME += 5000;

            logger.info('Project ' + project.entry.name + ' found');

            const projectReleaseList = await getProjectRelease(project.entry.id);

            if (projectReleaseList.list.entries.length === 0) {
                logger.warn('Project needs release');
                projectRelease = await releaseProject(project);
                logger.warn(`Project released: ${projectRelease.id}`);
            } else {
                logger.info('Project already has release');

                // getting the latest project release
                let currentReleaseVersion = -1;
                projectReleaseList.list.entries.forEach((currentRelease: any) => {
                    if (currentRelease.entry.version > currentReleaseVersion) {
                        currentReleaseVersion = currentRelease.entry.version;
                        projectRelease = currentRelease;
                    }
                });
            }
        }

        if (noError) {
            await checkDescriptorExist(currentAbsentApp.name);
            await sleep(TIME);

            if (envs && envs.length > 0) {
                for (const envId of envs) {
                    await deployWithPayload(currentAbsentApp, projectRelease, envId);
                }
            } else {
                await deployWithPayload(currentAbsentApp, projectRelease);
            }
        }
    }
}

/**
 * Deploy with a payload
 *
 * @param currentAbsentApp current application
 * @param projectRelease project release
 * @param envId environment id
 */
async function deployWithPayload(currentAbsentApp: any, projectRelease: any, envId?: string): Promise<void> {
    const deployPayload = {
        name: currentAbsentApp.name,
        releaseId: projectRelease.entry.id,
        security: currentAbsentApp.security,
        infrastructure: currentAbsentApp.infrastructure,
        variables: currentAbsentApp.variables,
        environmentId: envId
    };

    logger.info(`Deploying ${currentAbsentApp.name} ${envId ? 'on env: ' + envId : ''}`);
    await deploy(deployPayload);
    logger.info(`Deployed ${currentAbsentApp.name} ${envId ? 'on env: ' + envId : ''}`);
}

/**
 * Check if descriptor exists
 *
 * @param name descriptor name
 */
async function checkDescriptorExist(name: string): Promise<boolean> {
    logger.info(`Check descriptor ${name} exist in the list `);
    const descriptorList = await getDescriptors();

    if (descriptorList?.list && descriptorList.entries) {
        for (const descriptor of descriptorList.list.entries) {
            if (descriptor.entry.name === name) {
                if (descriptor.entry.deployed === false) {
                    await deleteDescriptor(descriptor.entry.name);
                }
            }
        }
    }
    return false;
}

/**
 * Import and release project
 *
 * @param app application
 * @param tag tag
 */
async function importProjectAndRelease(app: any, tag?: string) {
    const appLocationReplaced = app.file_location(tag);

    logger.warn('App fileLocation ' + appLocationReplaced);
    await getFileFromRemote(appLocationReplaced, app.name);

    logger.warn('Project imported ' + app.name);
    const projectRelease = await importAndReleaseProject(`${app.name}.zip`);

    await deleteLocalFile(`${app.name}`);
    return projectRelease;
}

/**
 * Find missing applications
 *
 * @param deployedApps applications
 * @returns list of missing apps
 */
function findMissingApps(deployedApps: any[]): any[] {
    const result = [];

    Object.keys(ACTIVITI_CLOUD_APPS).forEach((key) => {
        const isPresent = deployedApps.find((currentApp: any) => ACTIVITI_CLOUD_APPS[key].name === currentApp.entry.name);

        if (!isPresent) {
            result.push(ACTIVITI_CLOUD_APPS[key]);
        }
    });

    return result;
}

/**
 * Find failing applications
 *
 * @param deployedApps applications
 * @returns list of failing apps
 */
function findFailingApps(deployedApps: any[]): any[] {
    const result = [];

    Object.keys(ACTIVITI_CLOUD_APPS).forEach((key) => {
        const failingApp = deployedApps.filter(
            (currentApp: any) => ACTIVITI_CLOUD_APPS[key].name === currentApp.entry.name && 'Running' !== currentApp.entry.status
        );

        if (failingApp?.length > 0) {
            result.push(...failingApp);
        }
    });

    return result;
}

/**
 * Get file from the remote
 *
 * @param url url to file
 * @param name name
 */
async function getFileFromRemote(url: string, name: string): Promise<void> {
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response;
        })
        .then((response) => new Promise<void>((resolve, reject) => {
            const outputFile = fs.createWriteStream(`${name}.zip`);
            response.body.pipe(outputFile);
            outputFile.on('finish', () => {
                logger.info(`The file is finished downloading.`);
                resolve();
            });
            outputFile.on('error', (error) => {
                logger.error(`Not possible to download the project form remote`);
                reject(error);
            });
        }))
        .catch((error) => {
            logger.error(`Failed to fetch file from remote: ${error.message}`);
            throw error;
        });
}

/**
 * Deletes local file
 *
 * @param name file name
 */
async function deleteLocalFile(name: string) {
    logger.info(`Deleting local file ${name}.zip`);
    fs.unlinkSync(`${name}.zip`);
}

/**
 * Perform a timeout
 *
 * @param time delay in milliseconds
 */
async function sleep(time: number) {
    logger.info(`Waiting for ${time} sec...`);
    await new Promise((done) => setTimeout(done, time));
    logger.info(`Done...`);
    return;
}

/**
 * Init AAE environment command
 */
export default async function main() {
    program
        .version('0.1.0')
        .description(
            'The following command is in charge of Initializing the activiti cloud env with the default apps' +
                'adf-cli init-aae-env --host "gateway_env" --modelerUsername "modelerusername" --modelerPassword "modelerpassword" --devopsUsername "devevopsusername" --devopsPassword "devopspassword"'
        )
        .option('-h, --host [type]', 'Host gateway')
        .option('--oauth [type]', 'SSO host')
        .option('--clientId [type]', 'sso client')
        .option('--secret [type]', 'sso secret', '')
        .option('--scope [type]', 'sso scope', 'openid')
        .option('--tokenEndpoint [type]', 'discovery token Endpoint', 'auth/realms/${clientId}/protocol/openid-connect/token')
        .option('--modelerUsername [type]', 'username of a user with role ACTIVIT_MODELER')
        .option('--modelerPassword [type]', 'modeler password')
        .option('--devopsUsername [type]', 'username of a user with role ACTIVIT_DEVOPS')
        .option('--devopsPassword [type]', 'devops password')
        .option('--tag [type]', 'tag name of the codebase')
        .option('--envs [type...]', 'environment ids of the envs where to deploy the app')
        .parse(argv);

    if (argv.includes('-h') || argv.includes('--help')) {
        program.outputHelp();
        return;
    }

    const options = initializeDefaultToken(program.opts());

    args = {
        host: options.host,
        clientId: options.clientId,
        devopsUsername: options.devopsUsername,
        devopsPassword: options.devopsPassword,
        modelerUsername: options.modelerUsername,
        modelerPassword: options.modelerPassword,
        oauth: options.oauth,
        tokenEndpoint: options.tokenEndpoint,
        scope: options.scope,
        secret: options.secret,
        tag: options.tag,
        envs: options.envs
    };

    alfrescoJsApiModeler = getAlfrescoJsApiInstance(args);

    AAE_MICROSERVICES.map(async (serviceName) => {
        await healthCheck(serviceName);
    });

    await alfrescoJsApiModeler.login(args.modelerUsername, args.modelerPassword).then(
        () => {
            const reset = '\x1b[0m';
            const green = '\x1b[32m';
            logger.info(`${green}login SSO ok${reset}`);
        },
        (error) => {
            logger.error(`login SSO error ${JSON.stringify(error)} ${args.modelerUsername}`);
            exit(1);
        }
    );

    if (isValid) {
        const reset = '\x1b[0m';
        const green = '\x1b[32m';
        logger.info(`${green}The environment is up and running ${reset}`);
        alfrescoJsApiDevops = getAlfrescoJsApiInstance(args);
        await alfrescoJsApiDevops.login(args.devopsUsername, args.devopsPassword).then(
            () => {
                logger.info('login SSO ok devopsUsername');
            },
            (error) => {
                logger.error(`login SSO error ${JSON.stringify(error)} ${args.devopsUsername}`);
                exit(1);
            }
        );

        await deployMissingApps(args.tag, args.envs);
    } else {
        logger.error('The environment is not up');
        exit(1);
    }
}
