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
import moment from 'moment';
import { AlfrescoApi, AlfrescoApiConfig } from '@alfresco/js-api';
import { logger } from './logger';
import * as kube from './kube-utils';
export interface ConfigArgs {
    rancherUsername?: string;
    rancherToken?: string;
    clusterEnv?: string;
    clusterUrl?: string;
    apps?: string;
    devopsUsername: string;
    devopsPassword: string;
    modelerUsername: string;
    modelerPassword: string;
    clientId: string;
    host: string;
    oauth: string;
    identityHost: boolean;
    enableLike: boolean;
    intervalTime: string;
}

function getAlfrescoJsApiInstance(args: ConfigArgs) {
    const config = {
        provider: 'BPM',
        hostBpm: `${args.host}`,
        authType: 'OAUTH',
        oauth2: {
            host: `${args.oauth}/auth/realms/alfresco`,
            clientId: `${args.clientId}`,
            scope: 'openid',
            secret: '',
            implicitFlow: false,
            silentLogin: false,
            redirectUri: '/'
        }
    };
    return new AlfrescoApi(config as unknown as AlfrescoApiConfig);
}

async function login(username: string, password: string, alfrescoJsApi: any) {
    logger.info(`Perform login...`);
    try {
    await alfrescoJsApi.login(username, password);
    } catch (error) {
        logger.error(`Not able to login. Credentials ${username}:${password} are not valid`);
        process.exit(1);
    }
    logger.info(`Perform done...`);
}

async function deleteDescriptor(args: ConfigArgs, apiService: any, name: string) {
    logger.warn(`Delete the descriptor ${name}`);

    const url = `${args.host}/deployment-service/v1/descriptors/${name}`;

    const pathParams = {};
    const bodyParam = {};

    const headerParams = {};
    const formParams = {};
    const queryParams = {};
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'DELETE', pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts);
    } catch (error) {
        logger.error(`Not possible to delete the descriptor ${name} status  :  ${JSON.stringify(error.status)}  ${JSON.stringify(error?.response?.text)}`);
    }
}

async function deleteProject(args: ConfigArgs, apiService: any, projectId: string) {
    logger.warn(`Delete the project ${projectId}`);

    const url = `${args.host}/modeling-service/v1/projects/${projectId}`;

    const pathParams = {};
    const bodyParam = {};

    const headerParams = {};
    const formParams = {};
    const queryParams = {};
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'DELETE', pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts);
    } catch (error) {
        logger.error(`Not possible to delete the project ${projectId} status  :  ${JSON.stringify(error.status)}  ${JSON.stringify(error?.response?.text)}`);
    }
}

async function deleteProjectByName(args: ConfigArgs, apiService: any, name: string) {
    logger.warn(`Get the project by name ${name}`);
    const url = `${args.host}/modeling-service/v1/projects?name=${name}`;

    const pathParams = {};
    const queryParams = {};
    const headerParams = {};
    const formParams = {};
    const bodyParam = {};
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];

    try {
        const data = await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
        for (let i = 0; i < data.list.entries.length;  i++ ) {
            if (data.list.entries[i].entry.name === name) {
                await deleteProject(args, apiService, data.list.entries[i].entry.id);
            }
        }
    } catch (error) {
        logger.error(`Not possible to get the project with name ${name} ` + JSON.stringify(error));
        process.exit(1);
    }
}

async function getApplicationsByName(args: ConfigArgs, apiService: any, name: string) {
    logger.warn(`Get the applications by name ${name}`);
    const url = `${args.host}/deployment-service/v1/applications?name=${name}`;

    const pathParams = {};
    const queryParams = {};
    const headerParams = {};
    const formParams = {};
    const bodyParam = {};
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];

    try {
        const apps =  await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
        return apps ? apps.list.entries : [];
    } catch (error) {
        logger.error(`Not possible to get the applications with name ${name} ` + JSON.stringify(error));
        process.exit(1);
    }
}

async function undeployApplication(args: ConfigArgs, apiService: any, name: string) {
    logger.warn(`Undeploy the application ${name}`);

    const url = `${args.host}/deployment-service/v1/applications/${name}`;

    const pathParams = {};
    const bodyParam = {};

    const headerParams = {};
    const formParams = {};
    const queryParams = {};
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'DELETE', pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts);
    } catch (error) {
        logger.error(`Not possible to undeploy the applications ${name} status  :  ${JSON.stringify(error.status)}  ${JSON.stringify(error?.response?.text)}`);
    }
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export default async function(args: ConfigArgs) {
    await main(args);
}

const main = async (args: ConfigArgs) => {
    program
        .version('0.1.0')
        .description('The following command is in charge of cleaning the releases/application/descriptor related to an app passed as input' +
            'adf-cli kubectl-clean-app --host "gateway_env" --modelerUsername "modelerusername" --modelerPassword "modelerpassword" --oauth "identity_env" --username "username" --password "password"')
        .option('-h, --host [type]', 'Host gateway')
        .option('-o, --oauth [type]', 'Host sso server')
        .option('--clusterEnv [type]', 'cluster Envirorment')
        .option('--clusterUrl [type]', 'cluster URL')
        .option('--clientId [type]', 'sso client')
        .option('--devopsUsername [type]', 'username of user with ACTIVITI_DEVOPS role')
        .option('--devopsPassword [type]', 'password of user with ACTIVITI_DEVOPS role')
        .option('--modelerUsername [type]', 'username of a user with role ACTIVIT_MODELER')
        .option('--modelerPassword [type]', 'modeler password')
        .option('--rancherUsername [type]', 'rancher username')
        .option('--rancherToken [type]', 'rancher token')
        .option('--apps [type]', 'Application prefix')
        .option('--enableLike [boolean]', 'Enable the like for app name')
        .option('--intervalTime [string]', 'In case of enableLike it specify the time related to the createDate')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
        return;
    }

    const alfrescoJsApiModeler = getAlfrescoJsApiInstance(args);
    await login(args.modelerUsername, args.modelerPassword, alfrescoJsApiModeler).then(() => {
        logger.info('login SSO ok');
    }, (error) => {
        logger.info(`login SSO error ${JSON.stringify(error)}`);
        process.exit(1);
    });

    const alfrescoJsApiDevops = getAlfrescoJsApiInstance(args);
    await login(args.devopsUsername, args.devopsPassword, alfrescoJsApiDevops).then(() => {
        logger.info('login SSO ok');
    }, (error) => {
        logger.info(`login SSO error ${JSON.stringify(error)}`);
        process.exit(1);
    });

    if (args.apps !== undefined) {
        kube.setCluster(args.clusterEnv, args.clusterUrl);
        kube.setCredentials(args.rancherUsername, args.rancherToken);
        kube.setContext(args.clusterEnv, args.rancherUsername);
        kube.useContext(args.clusterEnv);

        const applications = args.apps.includes(',') ? args.apps.split(',') : [args.apps];
        const interval = args.intervalTime ? args.intervalTime : '30 min';
        const extractTimeRange = parseInt(interval.split(' ')[0], 10);
        logger.info(`Extract time ${extractTimeRange} from interval: ${interval}`);

        for (let i = 0; i < applications.length;  i++ ) {
            logger.info(`Perform action on app: ${applications[i]}`);
            if (args.enableLike) {
                const applicationsByName = await getApplicationsByName(args, alfrescoJsApiDevops, applications[i]);
                logger.info(`Found  ${applicationsByName.length} apps`);

                for (let y = 0; y < applicationsByName.length;  y++ ) {
                    const application = applicationsByName[y].entry;
                    logger.info(`Analyze app:  ${application.name} `);
                    const diffAsMinutes = moment.duration(moment().diff(moment(application.createdAt))).asMinutes();

                    if (diffAsMinutes > extractTimeRange) {
                        logger.info(`The app: ${application} is older than ${interval}. Can delete it`);
                        await undeployApplication(args, alfrescoJsApiDevops, application.name);
                        await deleteDescriptor(args, alfrescoJsApiDevops, application.name);
                        await deleteProjectByName(args, alfrescoJsApiModeler, application.name);
                    } else {
                        logger.info(`The app: ${application} is recent than ${interval}. Skip delete`);
                    }
                }
            } else {
                await undeployApplication(args, alfrescoJsApiDevops, applications[i]);
                await deleteDescriptor(args, alfrescoJsApiDevops, applications[i]);
                await deleteProjectByName(args, alfrescoJsApiModeler, applications[i]);
            }
        }
    }
};
