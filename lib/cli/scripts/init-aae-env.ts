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
import { ACTIVITI_CLOUD_APPS } from '@alfresco/adf-testing';

/* tslint:disable */
const alfrescoApi = require('@alfresco/js-api');
/* tslint:enable */
import request = require('request');
import * as fs from 'fs';

export interface ConfigArgs {
    username: string;
    password: string;
    clientId: string;
    host: string;
    oauth: string;
    identityHost: boolean;
}

async function getDeployedApplicationsByStatus(args: ConfigArgs, apiService: any, status: string, logger: logging.Logger) {
    const url = `${args.host}/deployment-service/v1/applications`;

    const pathParams = {}, queryParams = {status: status},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    let data;
    try {
        data = await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
        return data.list.entries;
    } catch (error) {
        logger.error(`Not possible get the applications from deployment-service ${JSON.stringify(error)} `);
        process.exit(1);
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
        },
        identityHost: `${args.identityHost}`
    };
    return new alfrescoApi.AlfrescoApiCompatibility(config);
}

async function _login(args: ConfigArgs, alfrescoJsApi: any, logger: logging.Logger) {
    logger.info(`Perform login...`);
    await alfrescoJsApi.login(args.username, args.password);
    return alfrescoJsApi;
}

async function _deployMissingApps(args: ConfigArgs, logger: logging.Logger) {
    const alfrescoJsApi = getAlfrescoJsApiInstance(args);
    await _login(args, alfrescoJsApi, logger);
    const deployedApps = await getDeployedApplicationsByStatus(args, alfrescoJsApi, '', logger);
    const absentApps = findMissingApps(deployedApps);

    if (absentApps.length > 0) {
        logger.warn(`Missing apps: ${JSON.stringify(absentApps)}`);
        await checkIfAppIsReleased(args, alfrescoJsApi, absentApps, logger);
    } else {
        logger.warn(`All the apps are correctly deployed`);
    }
}

async function getAppProjects(args: ConfigArgs, apiService: any, logger: logging.Logger) {
    const url = `${args.host}/modeling-service/v1/projects?maxItems=200&skipCount=0`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    let data;
    try {
        data = await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
        return data.list.entries;
    } catch (error) {
        logger.error(`Not possible get the application from modeling-service ` + error);
        process.exit(1);
    }
}

async function checkIfAppIsReleased(args: ConfigArgs, apiService: any, absentApps: any [], logger: logging.Logger) {
    const projectList = await getAppProjects(args, apiService, logger);
    let TIME = 5000;
    let noError = true;
    for (let i = 0; i < absentApps.length; i++) {
        noError = true;
        const currentAbsentApp = absentApps[i];
        const app = projectList.find((currentApp: any) => {
            return currentAbsentApp.name === currentApp.entry.name;
        });
        let projectRelease: any;
        if (app === undefined) {
            logger.warn('Missing project: Create the project for ' + currentAbsentApp.name);
            try {
                const uploadedApp = await importProjectApp(args, apiService, currentAbsentApp, logger);
                logger.warn('Project imported ' + currentAbsentApp.name);
                if (uploadedApp) {
                    projectRelease = await releaseProject(args, apiService, uploadedApp, logger);
                }
            } catch (error) {
                if (error.status !== 409) {
                    logger.info(`Not possible to upload the project ${app.name} status  : ${JSON.stringify(error.status)}  ${JSON.stringify(error.response.text)}`);
                    process.exit(1);
                } else {
                    logger.error(`Not possible to upload the project because inconsistency CS - Modelling try to delete manually the node`);
                    noError = false;
                }
            }
        } else {
            TIME += 5000;
            logger.info('Project ' + app.entry.name + ' found');

            const projectReleaseList = await getReleaseAppProjectId(args, apiService, app.entry.id, logger);

            if (projectReleaseList.list.entries.length === 0) {
                logger.warn('Project needs release');
                projectRelease = await releaseProject(args, apiService, app, logger);
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
            await checkDescriptorExist(args, apiService, currentAbsentApp.name, logger);
            await sleep(TIME, logger);
            await deployApp(args, apiService, currentAbsentApp, projectRelease.entry.id, logger);
        }
    }
}

async function deployApp(args: ConfigArgs, apiService: any, appInfo: any, projectReleaseId: string, logger: logging.Logger) {
    logger.warn(`Deploy app ${appInfo.name} with projectReleaseId ${projectReleaseId}`);

    const url = `${args.host}/deployment-service/v1/applications`;

    const pathParams = {};
    const bodyParam = {
        'name': appInfo.name,
        'releaseId': projectReleaseId,
        'security': appInfo.security
    };

    logger.debug(`Deploy with body: ${JSON.stringify(bodyParam)}`);

    const headerParams = {}, formParams = {}, queryParams = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
    } catch (error) {
        logger.error(`Not possible to deploy the project ${appInfo.name} status  :  ${JSON.stringify(error.status)}  ${JSON.stringify(error.response.text)}`);
        // await deleteSiteByName(name);
        process.exit(1);
    }
}

async function checkDescriptorExist(args: ConfigArgs, apiService: any, name: string, logger: logging.Logger) {
    logger.info(`Check descriptor ${name} exist in the list `);
    const descriptorList: [] = await getDescriptorList(args, apiService, logger);
    descriptorList.forEach( async(descriptor: any) => {
        if (descriptor.entry.name === name) {
            if (descriptor.entry.deployed === false) {
                await deleteDescriptor(args, apiService, descriptor.entry.name, logger);
            }
        }
    });
    return false;
}

async function getDescriptorList(args: ConfigArgs, apiService: any, logger: logging.Logger) {
    const url = `${args.host}/deployment-service/v1/descriptors?page=0&size=50&sort=lastModifiedAt,desc`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    let data;
    try {
        data = await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
        return data.list.entries;
    } catch (error) {
        logger.error(`Not possible get the descriptors from deployment-service ${JSON.stringify(error)} `);
    }

}

async function deleteDescriptor(args: ConfigArgs, apiService: any, name: string, logger: logging.Logger) {
    logger.warn(`Delete the descriptor ${name}`);

    const url = `${args.host}/deployment-service/v1/descriptors/${name}`;

    const pathParams = {};
    const bodyParam = {};

    const headerParams = {}, formParams = {}, queryParams = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'DELETE', pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts);
    } catch (error) {
        logger.error(`Not possible to delete the descriptor ${name} status  :  ${JSON.stringify(error.status)}  ${JSON.stringify(error.response.text)}`);
    }
}

async function releaseProject(args: ConfigArgs, apiService: any, app: any, logger: logging.Logger) {
    const url = `${args.host}/modeling-service/v1/projects/${app.entry.id}/releases`;

    logger.info(`Release ID  ${app.entry.id}`);
    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
    } catch (error) {
        logger.info(`Not possible to release the project ${app.entry.name} status  : $ \n ${JSON.stringify(error.status)}  \n ${JSON.stringify(error.response.text)}`);
        process.exit(1);
    }
}

async function getReleaseAppProjectId(args: ConfigArgs, apiService: any, projectId: string, logger: logging.Logger) {
    const url = `${args.host}/modeling-service/v1/projects/${projectId}/releases`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
    } catch (error) {
        logger.error(`Not possible to get the release of the project ${projectId} ` + JSON.stringify(error));
        process.exit(1);
    }

}

async function importProjectApp(args: ConfigArgs, apiService: any, app: any, logger: logging.Logger) {
    await getFileFromRemote(app.file_location, app.name, logger);

    const file = fs.createReadStream(`${app.name}.zip`).on('error', () => {logger.error(`${app.name}.zip does not exist`); });

    const url = `${args.host}/modeling-service/v1/projects/import`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {'file': file}, bodyParam = {},
        contentTypes = ['multipart/form-data'], accepts = ['application/json'];

    logger.warn(`import app ${app.file_location}`);
    const result = await apiService.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
        contentTypes, accepts);
    deleteLocalFile(`${app.name}`, logger);
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

async function getFileFromRemote(url: string, name: string, logger: logging.Logger) {
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

async function deleteLocalFile(name: string, logger: logging.Logger) {
    logger.info(`Deleting local file ${name}.zip`);
    fs.unlinkSync(`${name}.zip`);
}

async function sleep(time: number, logger: logging.Logger) {
    logger.info(`Waiting for ${time} sec...`);
    await new Promise(done => setTimeout(done, time));
    logger.info(`Done...`);
    return;
}

export default async function (args: ConfigArgs, logger: logging.Logger) {
    await _deployMissingApps(args, logger);
}
