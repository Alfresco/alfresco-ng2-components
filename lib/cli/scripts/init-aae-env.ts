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

import * as program from 'commander';

/* tslint:disable */
const alfrescoApi = require('@alfresco/js-api');
/* tslint:enable */
import request = require('request');
import * as fs from 'fs';
import { logger } from './logger';

let alfrescoJsApi: any;
let args: ConfigArgs;
let isValid = true;

export interface ConfigArgs {
    modelerUsername: string;
    modelerPassword: string;
    devopsUsername: string;
    devopsPassword: string;
    clientId: string;
    host: string;
    oauth: string;
    identityHost: boolean;
}

export const AAE_MICROSERVICES = [
    'deployment-service',
    'modeling-service',
    'dmn-service'
];

async function healthCheck(nameService: string) {
    const url = `${args.host}/${nameService}/actuator/health`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        const health = await alfrescoJsApi.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
        if (health.status !== 'UP') {
            logger.error(`${nameService} is DOWN `);
            isValid = false;
        } else {
            logger.info(`${nameService} is UP!`);
        }
    } catch (error) {
        logger.error(`${nameService} is not reachable ${error.status} `);
        isValid = false;
    }
}

function getApplicationByStatus(status: string) {
    const url = `${args.host}/v1/applications/`;

    const pathParams = {}, queryParams = { status: status },
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        return alfrescoJsApi.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

    } catch (error) {
        logger.error(error.status);
        isValid = false;
    }
}

function getDescriptors() {
    const url = `${args.host}/v1/descriptors`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        return alfrescoJsApi.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

    } catch (error) {
        logger.error(error.status);
        isValid = false;
    }
}

function getProjects() {
    const url = `${args.host}/v1/projects/'`;

    const pathParams = {}, queryParams = { maxItems: 1000 },
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        return alfrescoJsApi.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

    } catch (error) {
        logger.error(error.status);
        isValid = false;
    }
}

function getProjectRelease(projectId: string) {
    const url = `${args.host}/v1/projects/${projectId}/releases`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        return alfrescoJsApi.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

    } catch (error) {
        logger.error(error.status);
        isValid = false;
    }
}

function releaseProject(projectId: string) {
    const url = `${args.host}/v1/projects/${projectId}/releases`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        return alfrescoJsApi.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

    } catch (error) {
        logger.error(error.status);
        isValid = false;
    }
}

async function importAndReleaseProject(absoluteFilePath: string) {
    const fileContent = await fs.createReadStream(absoluteFilePath);

    try {
        const project = await alfrescoJsApi.oauth2Auth.callCustomApi(`${args.host}/v1/projects/import`, 'POST', {}, {}, {}, { file: fileContent }, {}, ['multipart/form-data'], ['application/json']);

        await alfrescoJsApi.oauth2Auth.callCustomApi(`${args.host}/v1/projects/${project.entry.id}/releases`, 'POST', {}, {}, {}, {}, {},
            ['application/json'], ['application/json']);

    } catch (error) {
        logger.error(error.status);
        isValid = false;
    }
}

function deleteDescriptor(name: string) {
    const url = `${args.host}/v1/descriptors/${name}`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        return alfrescoJsApi.oauth2Auth.callCustomApi(url, 'DELETE', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

    } catch (error) {
        logger.error(error.status);
        isValid = false;
    }
}

function deploy(model: any) {
    const url = `${args.host}/v1/applications/`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = model,
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        return alfrescoJsApi.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

    } catch (error) {
        logger.error(error.status);
        isValid = false;
    }
}

function getAlfrescoJsApiInstance(configArgs: ConfigArgs) {
    const config = {
        provider: 'BPM',
        hostBpm: `${configArgs.host}`,
        authType: 'OAUTH',
        oauth2: {
            host: `${configArgs.oauth}`,
            clientId: `${configArgs.clientId}`,
            scope: 'openid',
            secret: '',
            implicitFlow: false,
            silentLogin: false,
            redirectUri: '/'
        }
    };
    return new alfrescoApi.AlfrescoApiCompatibility(config);
}

async function deployMissingApps() {
    const deployedApps = await getApplicationByStatus('');
    const absentApps = findMissingApps(deployedApps.list.entries);

    if (absentApps.length > 0) {
        logger.warn(`Missing apps: ${JSON.stringify(absentApps)}`);
        await checkIfAppIsReleased(absentApps);
    } else {
        logger.warn(`All the apps are correctly deployed`);
    }
}

async function checkIfAppIsReleased(absentApps: any []) {
    const projectList = await getProjects();
    let TIME = 5000;
    let noError = true;

    for (let i = 0; i < absentApps.length; i++) {
        noError = true;
        const currentAbsentApp = absentApps[i];
        const project = projectList.list.entries.find((currentApp: any) => {
            return currentAbsentApp.name === currentApp.entry.name;
        });
        let projectRelease: any;

        if (project === undefined) {

            logger.warn('Missing project: Create the project for ' + currentAbsentApp.name);

            try {
                projectRelease = await importProjectAndRelease(currentAbsentApp);
            } catch (error) {
                logger.info(`error status ${error.status}`);

                if (error.status !== 409) {
                    logger.info(`Not possible to upload the project ${project.entry.name} status  : ${JSON.stringify(error.status)}  ${JSON.stringify(error.response.text)}`);
                    process.exit(1);
                } else {
                    logger.error(`Not possible to upload the project because inconsistency CS - Modelling try to delete manually the node`);
                    process.exit(1);
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
            const deployPayload = {
                'name': currentAbsentApp.name,
                'releaseId': projectRelease.entry.id,
                'security': currentAbsentApp.security,
                'infrastructure': currentAbsentApp.infrastructure,
                'variables': currentAbsentApp.variables
            };
            await deploy(deployPayload);
        }
    }
}

async function checkDescriptorExist(name: string) {
    logger.info(`Check descriptor ${name} exist in the list `);
    const descriptorList = await getDescriptors();
    descriptorList.list.entries.forEach(async (descriptor: any) => {
        if (descriptor.entry.name === name) {
            if (descriptor.entry.deployed === false) {
                await deleteDescriptor(descriptor.entry.name);
            }
        }
    });
    return false;
}

async function importProjectAndRelease(app: any) {
    await getFileFromRemote(app.file_location, app.name);
    logger.warn('Project imported ' + app.name);
    const projectRelease = await importAndReleaseProject(`${app.name}.zip`);
    deleteLocalFile(`${app.name}`);
    return projectRelease;
}

function findMissingApps(deployedApps: any []) {
    const absentApps: any [] = [];
    ['candidatebaseapp', 'simpleapp', 'subprocessapp'].forEach((app) => {
        const isPresent = deployedApps.find((currentApp: any) => {
            return app === currentApp.entry.name;
        });

        if (!isPresent) {
            absentApps.push(app);
        }
    });
    return absentApps;
}

async function getFileFromRemote(url: string, name: string) {
    return new Promise((resolve, reject) => {
        request(url)
            .pipe(fs.createWriteStream(`${name}.zip`))
            .on('finish', () => {
                logger.info(`The file is finished downloading.`);
                resolve();
            })
            .on('error', (error: any) => {
                reject(error);
            });
    });
}

async function deleteLocalFile(name: string) {
    logger.info(`Deleting local file ${name}.zip`);
    fs.unlinkSync(`${name}.zip`);
}

async function sleep(time: number) {
    logger.info(`Waiting for ${time} sec...`);
    await new Promise(done => setTimeout(done, time));
    logger.info(`Done...`);
    return;
}

export default async function (configArgs: ConfigArgs) {
    await main(configArgs);
}

async function main(configArgs: ConfigArgs) {

    args = configArgs;

    program
        .version('0.1.0')
        .description('The following command is in charge of Initializing the activiti cloud env with the default apps' +
            'adf-cli init-aae-env --host "gateway_env"  --oauth "identity_env" --identityHost "identity_env" --modelerUsername "modelerusername" --modelerPassword "modelerpassword" --devopsUsername "devevopsusername" --devopsPassword "devopspassword"')
        .option('-h, --host [type]', 'Host gateway')
        .option('-o, --oauth [type]', 'Host sso server')
        .option('-jsonAppsPath, --oauth [type]', 'Host sso server')
        .option('--clientId[type]', 'sso client')
        .option('--modelerUsername [type]', 'username of a user with role ACTIVIT_MODELER')
        .option('--modelerPassword [type]', 'modeler password')
        .option('--devopsUsername [type]', 'username of a user with role ACTIVIT_DEVOPS')
        .option('--devopsPassword [type]', 'devops password')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
        return;
    }

    alfrescoJsApi = getAlfrescoJsApiInstance(args);
    await alfrescoJsApi.login(args.modelerUsername, args.modelerPassword);

    AAE_MICROSERVICES.map(async (serviceName) => {
        await healthCheck(serviceName);
    });

    if (isValid) {
        logger.error('The environment is up and running');
        await deployMissingApps();
    } else {
        logger.error('The environment is not up');
        process.exit(1);
    }

}
