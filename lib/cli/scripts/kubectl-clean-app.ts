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
import moment from 'moment-es6';
import { exec } from './exec';
/* tslint:disable */
import { AlfrescoApi } from '@alfresco/js-api';
/* tslint:enable */

import { logger } from './logger';

function getAlfrescoJsApiInstance() {
    const config = {
        provider: 'BPM',
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

async function login(username: string, password: string, alfrescoJsApi: any) {
    logger.info(`Perform login...`);
    try {
    await alfrescoJsApi.login(username, password);
    } catch (error) {
        logger.error(`Login error: ${error} `);
        process.exit(1);
    }
    logger.info(`Perform done...`);
}

async function deleteDescriptor(apiService: any, name: string) {
    logger.warn(`Delete the descriptor ${name}`);

    const url = `${options.host}/deployment-service/v1/descriptors/${name}`;

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

async function deleteProject(apiService: any, projectId: string) {
    logger.warn(`Delete the project ${projectId}`);

    const url = `${options.host}/modeling-service/v1/projects/${projectId}`;

    const pathParams = {};
    const bodyParam = {};

    const headerParams = {}, formParams = {}, queryParams = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'DELETE', pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts);
    } catch (error) {
        logger.error(`Not possible to delete the project ${projectId} status  :  ${JSON.stringify(error.status)}  ${JSON.stringify(error.response.text)}`);
    }
}

async function deleteProjectByName(apiService: any, name: string) {
    logger.warn(`Get the project by name ${name}`);
    const url = `${options.host}/modeling-service/v1/projects?name=${name}`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        const data = await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
        for (let i = 0; i < data.list.entries.length;  i++ ) {
            if (data.list.entries[i].entry.name === name) {
                await deleteProject(apiService, data.list.entries[i].entry.id);
            }
        }
    } catch (error) {
        logger.error(`Not possible to get the project with name ${name} ` + JSON.stringify(error));
        process.exit(1);
    }
}

async function getApplicationsByName(apiService: any, name: string) {
    logger.warn(`Get the applications by name ${name}`);
    const url = `${options.host}/deployment-service/v1/applications?name=${name}`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        const apps =  await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
        return apps ? apps.list.entries : [];
    } catch (error) {
        logger.error(`Not possible to get the applications with name ${name} ` + JSON.stringify(error));
        process.exit(1);
    }
}

async function undeployApplication(apiService: any, name: string) {
    logger.warn(`Undeploy the application ${name}`);

    const url = `${options.host}/deployment-service/v1/applications/${name}`;

    const pathParams = {};
    const bodyParam = {};

    const headerParams = {}, formParams = {}, queryParams = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'DELETE', pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts);
    } catch (error) {
        logger.error(`Not possible to undeploy the applications ${name} status  :  ${JSON.stringify(error.status)}  ${JSON.stringify(error.response.text)}`);
    }
}

function setCluster() {
    logger.info('Perform set-cluster...');
    const response = exec('kubectl', [`config`, `set-cluster`, `${options.clusterEnv}`, `--server=${options.clusterUrl}`], {});
    logger.info(response);
}

function setCredentials() {
    logger.info('Perform set-credentials...');
    const response = exec('kubectl', [`config`, `set-credentials`, `${options.rancherUsername}`, `--token=${options.rancherToken}`], {});
    logger.info(response);
}

function setContext() {
    logger.info('Perform set-context...');
    const response = exec('kubectl', [`config`, `set-context`, `${options.clusterEnv}`, `--cluster=${options.clusterEnv}`, `--user=${options.rancherUsername}`], {});
    logger.info(response);
}

function useContext() {
    logger.info('Perform use-context...');
    const response = exec('kubectl', [`config`, `use-context`, `${options.clusterEnv}`], {});
    logger.info(response);
}

let options;

export default async function main(_args: string[]) {

    program
        .version('0.2.0')
        .description('The following command is in charge of cleaning the releases/application/descriptor related to an app passed as input' +
            'adf-cli kubectl-clean-app --host "gateway_env" --modelerUsername "modelerusername" --modelerPassword "modelerpassword" --oauth "identity_env" --username "username" --password "password"')
        .requiredOption('-h, --host [type]', 'Host gateway')
        .requiredOption('-o, --oauth [type]', 'Host sso server')
        .requiredOption('--clientId[type]', 'sso client')
        .requiredOption('--devopsUsername [type]', 'username of user with ACTIVITI_DEVOPS role')
        .requiredOption('--devopsPassword [type]', 'password of user with ACTIVITI_DEVOPS role')
        .requiredOption('--modelerUsername [type]', 'username of a user with role ACTIVIT_MODELER')
        .requiredOption('--modelerPassword [type]', 'modeler password')
        .requiredOption('--rancherUsername [type]', 'rancher username')
        .requiredOption('--rancherPassword [type]', 'rancher password')
        .option('--apps [type]', 'list of namespaces')
        .option('--enableLike [boolean]', 'Enable the like for app name')
        .option('--intervalTime [string]', 'In case of enableLike it specify the time related to the createDate')
        .parse(process.argv);

    options = program.opts();

    const alfrescoJsApiModeler = getAlfrescoJsApiInstance();
    await login(options.modelerUsername, options.modelerPassword, alfrescoJsApiModeler).then(() => {
        logger.info('login SSO ok');
    }, (error) => {
        logger.info(`login SSO error ${JSON.stringify(error)}`);
        process.exit(1);
    });

    const alfrescoJsApiDevops = getAlfrescoJsApiInstance();
    await login(options.devopsUsername, options.devopsPassword, alfrescoJsApiDevops).then(() => {
        logger.info('login SSO ok');
    }, (error) => {
        logger.info(`login SSO error ${JSON.stringify(error)}`);
        process.exit(1);
    });

    if (options.apps !== undefined) {
        setCluster();
        setCredentials();
        setContext();
        useContext();

        const applications = options.apps.includes(',') ? options.apps.split(',') : [options.apps];
        const interval = options.intervalTime ? options.intervalTime : '30 min';
        const extractTimeRange = interval.split(' ')[0];
        logger.info(`Extract time ${extractTimeRange} from interval: ${interval}`);
        for (let i = 0; i < applications.length;  i++ ) {
            logger.info(`Perform action on app: ${applications[i]}`);
            if (options.enableLike) {
                const applicationsByName = await getApplicationsByName(alfrescoJsApiDevops, applications[i]);
                logger.info(`Found  ${applicationsByName.length} apps`);
                for (let y = 0; y < applicationsByName.length;  y++ ) {
                    const application = applicationsByName[y].entry;
                    logger.info(`Analyze app:  ${application.name} `);
                    const diffAsMinutes = moment.duration(moment().diff(moment(application.createdAt))).asMinutes();
                    if (diffAsMinutes > extractTimeRange) {
                        logger.info(`The app: ${application} is older than ${interval}. Can delete it`);
                        await undeployApplication(alfrescoJsApiDevops, application.name);
                        await deleteDescriptor(alfrescoJsApiDevops, application.name);
                        await deleteProjectByName(alfrescoJsApiModeler, application.name);
                    } else {
                        logger.info(`The app: ${application} is recent than ${interval}. Skip delete`);
                    }
                }
            } else {
                await undeployApplication(alfrescoJsApiDevops, applications[i]);
                await deleteDescriptor(alfrescoJsApiDevops, applications[i]);
                await deleteProjectByName(alfrescoJsApiModeler, applications[i]);
            }
        }
    }

}
