/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import {
    AdminTenantsApi,
    AdminUsersApi,
    AlfrescoApi,
    TenantRepresentation,
    AppDefinitionsApi,
    RuntimeAppDefinitionsApi,
    UserRepresentation,
    AppDefinitionUpdateResultRepresentation
} from '@alfresco/js-api';
import { argv, exit } from 'node:process';
import { spawnSync } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { Command } from 'commander';
import * as path from 'path';
import { logger } from './logger';
import { throwError } from 'rxjs';

interface InitApsEnvArgs {
    host?: string;
    clientId?: string;
    username?: string;
    password?: string;
    license?: string;
}

const program = new Command();
const MAX_RETRY = 10;
let counter = 0;
const TIMEOUT = 6000;
const TENANT_DEFAULT_ID = 1;
const TENANT_DEFAULT_NAME = 'default';
const CONTENT_DEFAULT_NAME = 'adw-content';
const ACTIVITI_APPS = require('./resources').ACTIVITI_APPS;

let alfrescoJsApi: AlfrescoApi;

/**
 * Init APS command
 */
export default async function main() {
    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host')
        .option('--clientId [type]', 'sso client', 'alfresco')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .option('--license [type]', 'APS license S3 path ')
        .parse(argv);

    const opts = program.opts();
    await checkEnv(opts);

    logger.info(`***** Step 1 - Check License *****`);

    let licenceUploaded = false;
    const hasValidLicense = await hasLicense(opts);
    if (!hasValidLicense) {
        logger.info(`Aps License missing`);
        const isLicenseFileDownloaded = await downloadLicenseFile(opts.license);
        if (isLicenseFileDownloaded) {
            licenceUploaded = await updateLicense(opts);
        }
    } else {
        licenceUploaded = true;
        logger.info(`Aps License present`);
    }

    let tenantId: number;
    if (licenceUploaded) {
        logger.info(`***** Step 2 - Check Tenant *****`);
        logger.info(`is tenantId:${TENANT_DEFAULT_ID} with name:${TENANT_DEFAULT_NAME} present?`);
        try {
            const hasDefault = await hasDefaultTenant(TENANT_DEFAULT_ID, TENANT_DEFAULT_NAME);
            tenantId = TENANT_DEFAULT_ID;
            if (!hasDefault) {
                // the tenantId should be equal to TENANT_DEFAULT_ID if we choose 1 as id.
                tenantId = await createDefaultTenant(TENANT_DEFAULT_NAME);
            }
            logger.info(`***** Step 3 - Add Content Repo *****`);
            const isContentPresent = await isContentRepoPresent(opts, TENANT_DEFAULT_ID, CONTENT_DEFAULT_NAME);
            if (!isContentPresent) {
                logger.info(`No content repo with name ${CONTENT_DEFAULT_NAME} found`);
                await addContentRepoWithBasic(opts, TENANT_DEFAULT_ID, CONTENT_DEFAULT_NAME);
            }
            logger.info(`***** Step 4 - Create users *****`);
            const users = await getDefaultApsUsersFromRealm(opts);
            if (tenantId && users && users.length > 0) {
                for (let i = 0; i < users.length; i++) {
                    await createUsers(tenantId, users[i]);
                }
                for (let i = 0; i < users.length; i++) {
                    logger.info('Impersonate user: ' + users[i].username);
                    await alfrescoJsApi.login(users[i].username, 'password');
                    await authorizeUserToContentRepo(opts, users[i]);

                    const defaultUser = 'hruser';
                    if (users[i].username.includes(defaultUser)) {
                        logger.info(`***** Step initialize APS apps for user ${defaultUser} *****`);
                        await initializeDefaultApps();
                    }
                }
            } else {
                logger.info('Something went wrong. Was not able to create the users');
            }
        } catch (error) {
            logger.info(`Aps something went wrong. Tenant id ${tenantId}`);
            exit(1);
        }
    } else {
        logger.info('APS license error: check the configuration');
        exit(1);
    }
}

/**
 * Initialise default applications
 */
async function initializeDefaultApps() {
    for (let x = 0; x < ACTIVITI_APPS.apps.length; x++) {
        const appInfo = ACTIVITI_APPS.apps[x];
        const isDeployed = await isDefaultAppDeployed(appInfo.name);
        if (isDeployed !== undefined && !isDeployed) {
            const appDefinition = await importPublishApp(`${appInfo.name}`);
            await deployApp(appDefinition.appDefinition.id);
        } else {
            logger.info(`***** App ${appInfo.name} already deployed *****`);
        }
    }
}

/**
 * Check environment
 *
 * @param opts command options
 */
async function checkEnv(opts: InitApsEnvArgs) {
    try {
        alfrescoJsApi = new AlfrescoApi({
            provider: 'ALL',
            hostBpm: opts.host,
            hostEcm: opts.host,
            authType: 'OAUTH',
            contextRoot: 'alfresco',
            oauth2: {
                host: `${opts.host}/auth/realms/alfresco`,
                clientId: `${opts.clientId}`,
                scope: 'openid',
                redirectUri: '/'
            }
        });
        await alfrescoJsApi.login(opts.username, opts.password);
    } catch (e) {
        if (e.error.code === 'ETIMEDOUT') {
            logger.error('The env is not reachable. Terminating');
            exit(1);
        }
        logger.info('Login error environment down or inaccessible');
        counter++;
        if (MAX_RETRY === counter) {
            logger.error('Give up');
            exit(1);
        } else {
            logger.error(`Retry in 1 minute attempt N ${counter}`);
            sleep(TIMEOUT);
            await checkEnv(opts);
        }
    }
}

/**
 * Check if the default tenant is present
 *
 * @param tenantId tenant id
 * @param tenantName tenant name
 * @returns `true` if tenant is found, otherwise `false`
 */
async function hasDefaultTenant(tenantId: number, tenantName: string): Promise<boolean> {
    let tenant: TenantRepresentation;

    try {
        const adminTenantsApi = new AdminTenantsApi(alfrescoJsApi);
        tenant = await adminTenantsApi.getTenant(tenantId);
    } catch (error) {
        logger.info(`Aps: does not have tenant with id: ${tenantId}`);
        return false;
    }

    if (tenant.name === tenantName) {
        logger.info(`Aps: has default tenantId: ${tenantId} and name ${tenantName}`);
        return true;
    } else {
        logger.info(`Wrong configuration. Another tenant has been created with id ${tenant.id} and name ${tenant.name}`);
        throwError(`Wrong configuration. Another tenant has been created with id ${tenant.id} and name ${tenant.name}`);
        return false;
    }
}

/**
 * Create default tenant
 *
 * @param tenantName tenant name
 */
async function createDefaultTenant(tenantName: string) {
    const tenantPost = {
        active: true,
        maxUsers: 10000,
        name: tenantName
    };

    try {
        const adminTenantsApi = new AdminTenantsApi(alfrescoJsApi);
        const tenant = await adminTenantsApi.createTenant(tenantPost);
        logger.info(`APS: Tenant ${tenantName} created with id: ${tenant.id}`);
        return tenant.id;
    } catch (error) {
        logger.info(`APS: not able to create the default tenant: ${JSON.parse(error.message)}`);
        return null;
    }
}

/**
 * Create users
 *
 * @param tenantId tenant id
 * @param user user object
 */
async function createUsers(tenantId: number, user: any) {
    logger.info(`Create user ${user.email} on tenant: ${tenantId}`);
    const passwordCamelCase = 'Password';
    const userJson = new UserRepresentation({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: 'active',
        type: 'enterprise',
        password: passwordCamelCase,
        tenantId
    });

    try {
        const adminUsersApi = new AdminUsersApi(alfrescoJsApi);
        const userInfo = await adminUsersApi.createNewUser(userJson);
        logger.info(`APS: User ${userInfo.email} created with id: ${userInfo.id}`);
        return user;
    } catch (error) {
        logger.info(`APS: not able to create the default user: ${error.message}`);
    }
}

/**
 * Update Activiti license
 *
 * @param opts command options
 */
async function updateLicense(opts: InitApsEnvArgs) {
    const fileContent = createReadStream(path.join(__dirname, '/activiti.lic'));

    try {
        await alfrescoJsApi.oauth2Auth.callCustomApi(
            `${opts.host}/activiti-app/api/enterprise/license`,
            'POST',
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            { file: fileContent },
            { /* empty */ },
            ['multipart/form-data'],
            ['application/json']
        );
        logger.info(`Aps License uploaded!`);
        return true;
    } catch (error) {
        logger.error(`Aps License failed!`, error.message);
        return false;
    }
}

/**
 * Check if default application is deployed
 *
 * @param appName application name
 * @returns `true` if application is deployed, otherwise `false`
 */
async function isDefaultAppDeployed(appName: string): Promise<boolean> {
    logger.info(`Verify ${appName} already deployed`);
    try {
        const runtimeAppDefinitionsApi = new RuntimeAppDefinitionsApi(alfrescoJsApi);
        const availableApps = await runtimeAppDefinitionsApi.getAppDefinitions();
        const defaultApp = availableApps.data?.filter((app) => app.name?.includes(appName));
        return defaultApp && defaultApp.length > 0;
    } catch (error) {
        logger.error(`Aps app failed to import/Publish!`);
        return false;
    }
}

/**
 * Import and publish the application
 *
 * @param appName application name
 */
async function importPublishApp(appName: string): Promise<AppDefinitionUpdateResultRepresentation> {
    const appNameExtension = `../resources/${appName}.zip`;
    logger.info(`Import app ${appNameExtension}`);
    const pathFile = path.join(__dirname, appNameExtension);
    const fileContent = createReadStream(pathFile);

    try {
        const appDefinitionsApi = new AppDefinitionsApi(alfrescoJsApi);
        const result = await appDefinitionsApi.importAndPublishApp(fileContent, { renewIdmEntries: true });
        logger.info(`Aps app imported and published!`);
        return result;
    } catch (error) {
        logger.error(`Aps app failed to import/Publish!`, error.message);
        return null;
    }
}

/**
 * Deploy application
 *
 * @param appDefinitionId app definition id
 */
async function deployApp(appDefinitionId: number) {
    logger.info(`Deploy app with id ${appDefinitionId}`);
    const body = {
        appDefinitions: [{ id: appDefinitionId }]
    };

    try {
        const runtimeAppDefinitionsApi = new RuntimeAppDefinitionsApi(alfrescoJsApi);
        await runtimeAppDefinitionsApi.deployAppDefinitions(body);
        logger.info(`Aps app deployed`);
    } catch (error) {
        logger.error(`Aps app failed to deploy!`);
    }
}

/**
 * Checks if Activiti app has license
 *
 * @param opts command options
 */
async function hasLicense(opts: InitApsEnvArgs): Promise<boolean> {
    try {
        const license = await alfrescoJsApi.oauth2Auth.callCustomApi(
            `${opts.host}/activiti-app/api/enterprise/license`,
            'GET',
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            ['application/json'],
            ['application/json']
        );
        if (license && license.status === 'valid') {
            logger.info(`Aps has a valid License!`);
            return true;
        }
        logger.info(`Aps does NOT have a valid License!`);
        return false;
    } catch (error) {
        logger.error(`Aps not able to check the license`);
        return false;
    }
}

/**
 * Get default users from the realm
 *
 * @param opts command options
 */
async function getDefaultApsUsersFromRealm(opts: InitApsEnvArgs) {
    try {
        const users: any[] = await alfrescoJsApi.oauth2Auth.callCustomApi(
            `${opts.host}/auth/admin/realms/alfresco/users`,
            'GET',
            { /* empty */ },
            { max: 1000 },
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            ['application/json'],
            ['application/json']
        );
        const usernamesOfApsDefaultUsers = ['hruser', 'salesuser', 'superadminuser'];
        const apsDefaultUsers = users.filter((user) => usernamesOfApsDefaultUsers.includes(user.username));
        logger.info(`Keycloak found ${apsDefaultUsers.length} users`);
        return apsDefaultUsers;
    } catch (error) {
        logger.error(`APS: not able to fetch user: ${error.message}`);
        return null;
    }
}

/**
 * Validate that ACS repo for Activiti is present
 *
 * @param opts command options
 * @param tenantId tenant id
 * @param contentName content service name
 */
async function isContentRepoPresent(opts: InitApsEnvArgs, tenantId: number, contentName: string): Promise<boolean> {
    try {
        const contentRepos = await alfrescoJsApi.oauth2Auth.callCustomApi(
            `${opts.host}/activiti-app/app/rest/integration/alfresco?tenantId=${tenantId}`,
            'GET',
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            ['application/json'],
            ['application/json']
        );
        return !!contentRepos.data.find((repo) => repo.name === contentName);
    } catch (error) {
        logger.error(`APS: not able to create content: ${error.message}`);
        return null;
    }
}

/**
 * Add content service with basic auth
 *
 * @param opts command options
 * @param tenantId tenant id
 * @param name content name
 */
async function addContentRepoWithBasic(opts: InitApsEnvArgs, tenantId: number, name: string) {
    logger.info(`Create Content with name ${name} and basic auth`);

    const body = {
        alfrescoTenantId: '',
        authenticationType: 'basic',
        name,
        repositoryUrl: `${opts.host}/alfresco`,
        shareUrl: `${opts.host}/share`,
        // sitesFolder: '', not working on activiti 1.11.1.1
        tenantId,
        version: '6.1.1'
    };

    try {
        const content = await alfrescoJsApi.oauth2Auth.callCustomApi(
            `${opts.host}/activiti-app/api/enterprise/integration/alfresco`,
            'POST',
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            body,
            ['application/json'],
            ['application/json']
        );
        logger.info(`Content created!`);
        return content;
    } catch (error) {
        logger.error(`APS: not able to create content: ${error.message}`);
    }
}

/**
 * Authorize activiti user to ACS repo
 *
 * @param opts command options
 * @param user user object
 */
async function authorizeUserToContentRepo(opts: InitApsEnvArgs, user: any) {
    logger.info(`Authorize user ${user.email}`);
    try {
        const content = await alfrescoJsApi.oauth2Auth.callCustomApi(
            `${opts.host}/activiti-app/app/rest/integration/alfresco`,
            'GET',
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            ['application/json'],
            ['application/json']
        );
        logger.info(`Found ${content.data?.length} contents`);
        if (content.data) {
            for (let i = 0; i < content.data.length; i++) {
                if (content.data[i].authenticationType === 'basic') {
                    await authorizeUserToContentWithBasic(opts, user.username, content.data[i].id);
                }
            }
        }
        return;
    } catch (error) {
        logger.error(`APS: not able to authorize content: ${error.message}`);
    }
}

/**
 * Authorize user with content using basic auth
 *
 * @param opts command options
 * @param username username
 * @param contentId content id
 */
async function authorizeUserToContentWithBasic(opts: InitApsEnvArgs, username: string, contentId: string) {
    logger.info(`Authorize ${username} on contentId: ${contentId} in basic auth`);
    try {
        const body = { username, password: 'password' };
        const content = await alfrescoJsApi.oauth2Auth.callCustomApi(
            `${opts.host}/activiti-app/api/enterprise/integration/alfresco/${contentId}/account`,
            'POST',
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            { /* empty */ },
            body,
            ['application/json'],
            ['application/json']
        );
        logger.info(`User authorized!`);
        return content;
    } catch (error) {
        logger.error(`APS: not able to authorize content: ${error.message}`);
    }
}

/**
 * Download APS license file
 *
 * @param apsLicensePath path to license file
 */
async function downloadLicenseFile(apsLicensePath: string) {
    const args = [`s3`, `cp`, apsLicensePath, `./`];
    const result = spawnSync(`aws`, args, {
        cwd: path.resolve(__dirname, `./`),
        shell: false
    });

    if (result.status !== 0) {
        logger.error(`Not able to download the APS license from S3 bucket.\nCommand aws ${args.join(' ')} - failed with:\n${result.output}`);
        return false;
    }
    logger.info(`Aps license file download from S3 bucket`);
    return true;
}

/**
 * Perform a delay
 *
 * @param delay timeout in milliseconds
 */
function sleep(delay: number) {
    const start = new Date().getTime();
    while (new Date().getTime() < start + delay) { /* empty */ }
}
