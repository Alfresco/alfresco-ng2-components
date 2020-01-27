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

import { ACTIVITI_CLOUD_APPS, DeploymentAPI, ModelingAPI } from '@alfresco/adf-testing';
import * as program from 'commander';

/* tslint:disable */
const alfrescoApi = require('@alfresco/js-api');
/* tslint:enable */
import request = require('request');
import * as fs from 'fs';
import { logger } from './logger';

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

let browser: any;
let deploymentAPI: DeploymentAPI;
let modelingAPI: ModelingAPI;

export const AAE_MICROSERVICES = [
    'deployment-service',
    'modeling-service',
    'dmn-service'
];

async function healthCheck(args: ConfigArgs, apiService: any, nameService: string, result: any) {
    const url = `${args.host}/${nameService}/actuator/health`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        const health = await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
        if (health.status !== 'UP' ) {
            logger.error(`${nameService} is DOWN `);
            result.isValid = false;
        } else {
            logger.info(`${nameService} is UP!`);
        }
    } catch (error) {
        logger.error(`${nameService} is not reachable ${error.status} `);
        result.isValid = false;
    }
}

function getAlfrescoJsApiInstance(args: ConfigArgs) {
    const config = {
        provider: 'BPM',
        hostBpm: `${args.host}`,
        authType: 'OAUTH',
        oauth2: {
            host: `${args.oauth}`,
            clientId: `${args.clientId}`,
            scope: 'openid',
            secret: '',
            implicitFlow: false,
            silentLogin: false,
            redirectUri: '/'
        }
    };
    return new alfrescoApi.AlfrescoApiCompatibility(config);
}

async function login(args: ConfigArgs, alfrescoJsApi: any) {
    logger.info(`Perform login...`);
    try {
    await alfrescoJsApi.login(args.modelerUsername, args.modelerPassword);
    } catch (error) {
        logger.error(`Not able to login. Credentials ${args.modelerUsername}:${args.modelerPassword} are not valid`);
        process.exit(1);
    }
    return alfrescoJsApi;
}

async function deployMissingApps() {
    const deployedApps = await deploymentAPI.getApplicationByStatus('');
    const absentApps = findMissingApps(deployedApps.list.entries);

    if (absentApps.length > 0) {
        logger.warn(`Missing apps: ${JSON.stringify(absentApps)}`);
        await checkIfAppIsReleased(absentApps);
    } else {
        logger.warn(`All the apps are correctly deployed`);
    }
}

async function checkIfAppIsReleased(absentApps: any []) {
    const projectList = await modelingAPI.getProjects();
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

            const projectReleaseList = await modelingAPI.getProjectRelease(project.entry.id);

            if (projectReleaseList.list.entries.length === 0) {
                logger.warn('Project needs release');
                projectRelease = await modelingAPI.releaseProject(project);
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
            await deploymentAPI.deploy(deployPayload);
        }
    }
}

async function checkDescriptorExist(name: string) {
    logger.info(`Check descriptor ${name} exist in the list `);
    const descriptorList = await deploymentAPI.getDescriptors();
    descriptorList.list.entries.forEach( async(descriptor: any) => {
        if (descriptor.entry.name === name) {
            if (descriptor.entry.deployed === false) {
                await deploymentAPI.deleteDescriptor(descriptor.entry.name);
            }
        }
    });
    return false;
}

async function importProjectAndRelease(app: any) {
    await getFileFromRemote(app.file_location, app.name);
    logger.warn('Project imported ' + app.name);
    const result = await modelingAPI.importAndReleaseProject(`${app.name}.zip`);
    deleteLocalFile(`${app.name}`);
    return result;
}

function findMissingApps(deployedApps: any []) {
    const absentApps: any [] = [];
    Object.keys(ACTIVITI_CLOUD_APPS).forEach((key) => {
        const isPresent = deployedApps.find((currentApp: any) => {
            return ACTIVITI_CLOUD_APPS[key].name === currentApp.entry.name;
        });

        if (!isPresent) {
            absentApps.push(ACTIVITI_CLOUD_APPS[key]);
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

async function initConfiguration(args: ConfigArgs) {
    browser = {
        params: {
            config: {
                log: true
            },
            adminapp: {
                apiConfig: {
                    authType: 'OAUTH',
                    identityHost: args.identityHost,
                    oauth2: {
                        host: args.oauth,
                        authPath: '/protocol/openid-connect/token/',
                        clientId: args.clientId,
                        scope: 'openid',
                        implicitFlow: false,
                        redirectUri: ''
                    },
                    bpmHost: args.host,
                    providers: 'BPM'
                },
                modeler: args.modelerUsername,
                modeler_password: args.modelerPassword,
                devops: args.devopsUsername,
                devops_password: args.devopsPassword
            }
        }
    };

    global['protractor'] = {browser: browser};

    deploymentAPI = new DeploymentAPI();
    modelingAPI = new ModelingAPI();

    await deploymentAPI.setUp();
    await modelingAPI.setUp();
}

export default async function (args: ConfigArgs) {
    await main(args);
}

async function main(args: ConfigArgs) {

    program
        .version('0.1.0')
        .description('The following command is in charge of Initializing the activiti cloud env with the default apps' +
            'adf-cli init-aae-env --host "gateway_env"  --oauth "identity_env" --identityHost "identity_env" --modelerUsername "modelerusername" --modelerPassword "modelerpassword" --devopsUsername "devevopsusername" --devopsPassword "devopspassword"')
        .option('-h, --host [type]', 'Host gateway')
        .option('-o, --oauth [type]', 'Host sso server')
        .option('--clientId[type]', 'sso client')
        .option('--modelerUsername [type]', 'username of a user with role ACTIVIT_MODELER')
        .option('--modelerPassword [type]', 'modeler password')
        .option('--devopsUsername [type]', 'username of a user with role ACTIVIT_DEVOPS')
        .option('--devopsPassword [type]', 'devops password')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
    }

    await initConfiguration(args);

    const alfrescoJsApi = getAlfrescoJsApiInstance(args);
    await login(args, alfrescoJsApi);

    const result = { isValid: true };

    AAE_MICROSERVICES.map(async (serviceName) => {
        await healthCheck(args, alfrescoJsApi, serviceName, result);
    });

    if (result.isValid) {
        logger.error('The envirorment is up and running');
        await deployMissingApps();
    } else {
        logger.error('The envirorment is not up');
        process.exit(1);
    }

}
