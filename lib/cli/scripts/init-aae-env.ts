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
import request = require('request');
import * as fs from 'fs';
import { logger } from './logger';
import { AlfrescoApi } from '@alfresco/js-api';
const ACTIVITI_CLOUD_APPS = require('./resources').ACTIVITI_CLOUD_APPS;
/* tslint:enable */

let alfrescoJsApiModeler: any;
let alfrescoJsApiDevops: any;
let isValid = true;

export const AAE_MICROSERVICES = [
    'deployment-service',
    'modeling-service',
    'dmn-service'
];

async function healthCheck(nameService: string) {
    const url = `${options.host}/${nameService}/actuator/health`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        const health = await alfrescoJsApiModeler.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
        if (health.status !== 'UP') {
            logger.error(`${nameService} is DOWN `);
            isValid = false;
        } else {
            logger.info(`${nameService} is UP!`);
        }
    } catch (error) {
        logger.error(`${nameService} is not reachable error: `, error);
        isValid = false;
    }
}

async function getApplicationByStatus(status: string) {
    const url = `${options.host}/deployment-service/v1/applications/`;

    const pathParams = {}, queryParams = { status: status },
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        await alfrescoJsApiDevops.login(options.devopsUsername, options.devopsPassword);

        return alfrescoJsApiDevops.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts).on('error', (error) => {
            logger.error(`Get application by status ${error} `);
        });

    } catch (error) {
        logger.error(`Get application by status ${error.status} `);
        isValid = false;
    }
}

function getDescriptors() {
    const url = `${options.host}/deployment-service/v1/descriptors`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        return alfrescoJsApiDevops.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

    } catch (error) {
        logger.error(`Get Descriptors ${error.status} `);
        isValid = false;
    }
}

function getProjects() {
    const url = `${options.host}/modeling-service/v1/projects`;

    const pathParams = {}, queryParams = { maxItems: 1000 },
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        return alfrescoJsApiModeler.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

    } catch (error) {
        logger.error('Get Projects' + error.status);
        isValid = false;
    }
}

function getProjectRelease(projectId: string) {
    const url = `${options.host}/modeling-service/v1/projects/${projectId}/releases`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        return alfrescoJsApiModeler.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

    } catch (error) {
        logger.error('Get Projects Release' + error.status);
        isValid = false;
    }
}

function releaseProject(projectId: string) {
    const url = `${options.host}/modeling-service/v1/projects/${projectId}/releases`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        return alfrescoJsApiModeler.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

    } catch (error) {
        logger.error('Post Projects Release' + error.status);
        isValid = false;
    }
}

async function importAndReleaseProject(absoluteFilePath: string) {
    const fileContent = fs.createReadStream(absoluteFilePath);

    try {
        const project = await alfrescoJsApiModeler.oauth2Auth.callCustomApi(`${options.host}/modeling-service/v1/projects/import`, 'POST', {}, {}, {}, { file: fileContent }, {}, ['multipart/form-data'], ['application/json']);
        logger.info(`Project imported`);
        logger.info(`Create release`);
        const release = await alfrescoJsApiModeler.oauth2Auth.callCustomApi(`${options.host}/modeling-service/v1/projects/${project.entry.id}/releases`, 'POST', {}, {}, {}, {}, {},
            ['application/json'], ['application/json']);
        return release;

    } catch (error) {
        logger.error(`Not able to import the project/create the release ${absoluteFilePath} with status: ${error}`);
        isValid = false;
        throw(error);
    }
}

function deleteDescriptor(name: string) {
    const url = `${options.host}/deployment-service/v1/descriptors/${name}`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        return alfrescoJsApiDevops.oauth2Auth.callCustomApi(url, 'DELETE', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

    } catch (error) {
        logger.error('Delete descriptor' + error.status);
        isValid = false;
    }
}

function deploy(model: any) {
    const url = `${options.host}/deployment-service/v1/applications/`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = model,
        contentTypes = ['application/json'], accepts = ['application/json'];
    try {
        return alfrescoJsApiDevops.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

    } catch (error) {
        logger.error('Deploy post' + error.status);
        isValid = false;
    }
}

function getAlfrescoJsApiInstance() {
    const config = {
        provider: 'BPM',
        hostEcm: `${options.host}`,
        hostBpm: `${options.host}`,
        authType: 'OAUTH',
        oauth2: {
            host: `${options.oauth}/auth/realms/alfresco`,
            clientId: `${options.clientId}`,
            scope: 'openid',
            secret: '',
            implicitFlow: false,
            silentLogin: false,
            redirectUri: '/'
        }
    };
    return new AlfrescoApi(config);
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
                    logger.info(`Not possible to upload the project ${currentAbsentApp.name} status  : ${JSON.stringify(error)}`);
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

    if (descriptorList && descriptorList.list && descriptorList.entries) {
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

async function importProjectAndRelease(app: any) {
    await getFileFromRemote(app.file_location, app.name);
    logger.warn('Project imported ' + app.name);
    const projectRelease = await importAndReleaseProject(`${app.name}.zip`);
    await deleteLocalFile(`${app.name}`);
    return projectRelease;
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
                logger.error(`Not possible to download the project form remote`);
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

let options;

export default async function main(_args: string[]) {

    program
        .version('0.2.0')
        .description('The following command is in charge of Initializing the activiti cloud env with the default apps' +
            'adf-cli init-aae-env --host "gateway_env"  --oauth "identity_env" --modelerUsername "modelerusername" --modelerPassword "modelerpassword" --devopsUsername "devevopsusername" --devopsPassword "devopspassword"')
        .option('-h, --host [type]', 'Host gateway')
        .option('-o, --oauth [type]', 'Host sso server')
        .option('-jsonAppsPath, --oauth [type]', 'Host sso server')
        .option('--clientId [type]', 'sso client')
        .option('--modelerUsername [type]', 'username of a user with role ACTIVIT_MODELER')
        .option('--modelerPassword [type]', 'modeler password')
        .option('--devopsUsername [type]', 'username of a user with role ACTIVIT_DEVOPS')
        .option('--devopsPassword [type]', 'devops password')
        .parse(process.argv);

    options = program.opts();

    alfrescoJsApiModeler = getAlfrescoJsApiInstance();

    AAE_MICROSERVICES.map(async (serviceName) => {
        await healthCheck(serviceName);
    });

    await alfrescoJsApiModeler.login(options.modelerUsername, options.modelerPassword).then(() => {
        logger.info('login SSO ok');
    }, (error) => {
        logger.info(`login SSO error ${JSON.stringify(error)} ${options.modelerUsername}`);
        process.exit(1);
    });

    if (isValid) {
        logger.error('The environment is up and running');
        alfrescoJsApiDevops = getAlfrescoJsApiInstance();
        await alfrescoJsApiDevops.login(options.devopsUsername, options.devopsPassword).then(() => {
            logger.info('login SSO ok devopsUsername');
        }, (error) => {
            logger.info(`login SSO error ${JSON.stringify(error)} ${options.devopsUsername}`);
            process.exit(1);
        });

        await deployMissingApps();
    } else {
        logger.info('The environment is not up');
        process.exit(1);
    }

}
