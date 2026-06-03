/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { parseArgs } from 'node:util';
import { spawnSync } from 'node:child_process';
import { createReadStream } from 'node:fs';
import * as path from 'path';
import { logger } from './logger';

interface InitApsEnvArgs {
    host?: string;
    clientId?: string;
    username?: string;
    password?: string;
    license?: string;
}
const MAX_RETRY = 10;
const RETRY_DELAY_MS = 6000;
const TENANT_DEFAULT_ID = 1;
const TENANT_DEFAULT_NAME = 'default';
const CONTENT_DEFAULT_NAME = 'adw-content';
const ACTIVITI_APPS = require('./resources').ACTIVITI_APPS;

let alfrescoJsApi: AlfrescoApi;

/**
 * Init APS command
 */
export default async function main() {
    if (argv.includes('-h') || argv.includes('--help')) {
        console.log(`
Usage: init-aps-env [options]

Initialize APS environment

Options:
  --host <host>         Remote environment host
  --clientId <id>       SSO client (default: "alfresco")
  -p, --password <pass> Password
  -u, --username <user> Username
  --license <path>      APS license S3 path
  -h, --help            Display help for command
`);
        exit(0);
    }

    const { values } = parseArgs({
        args: argv.slice(2),
        options: {
            host: {
                type: 'string'
            },
            clientId: {
                type: 'string',
                default: 'alfresco'
            },
            password: {
                type: 'string',
                short: 'p'
            },
            username: {
                type: 'string',
                short: 'u'
            },
            license: {
                type: 'string'
            }
        },
        allowPositionals: true
    });

    const opts: InitApsEnvArgs = {
        host: values.host as string | undefined,
        clientId: values.clientId as string | undefined,
        username: values.username as string | undefined,
        password: values.password as string | undefined,
        license: values.license as string | undefined
    };

    await checkEnv(opts);

    const e2eAppReady = await ensureE2eApplicationDeployed();
    if (e2eAppReady) {
        logger.info(`APS environment already initialized (terraform). Skipping.`);
        return;
    }

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
                for (const user of users) {
                    await createUsers(tenantId, user);
                }
                for (const user of users) {
                    logger.info('Impersonate user: ' + user.username);
                    await alfrescoJsApi.login(user.username, 'password');
                    await authorizeUserToContentRepo(opts, user);

                    if (user.username.includes('hruser')) {
                        logger.info(`***** Step initialize APS apps for user hruser *****`);
                        await initializeDefaultApps();
                    }
                }
            } else {
                logger.info('Something went wrong. Was not able to create the users');
            }
        } catch (error: any) {
            logger.error(`Aps something went wrong. Tenant id ${tenantId}: ${formatError(error)}`);
            exit(1);
        }
    } else {
        logger.info('APS license error: check the configuration');
        exit(1);
    }
}

/**
 * Ensure e2e-Application is deployed for hruser.
 * If the app is already present, returns true (skip full init).
 * If hruser can log in but the app is missing, imports, publishes and deploys it.
 * Returns false only if hruser cannot log in or deployment fails.
 */
async function ensureE2eApplicationDeployed(): Promise<boolean> {
    try {
        await alfrescoJsApi.login('hruser', 'password');
        const runtimeAppDefinitionsApi = new RuntimeAppDefinitionsApi(alfrescoJsApi);
        const availableApps = await runtimeAppDefinitionsApi.getAppDefinitions();
        const e2eApp = availableApps.data?.filter((app) => app.name?.includes('e2e-Application'));
        if (e2eApp && e2eApp.length > 0) {
            logger.info(`e2e-Application is already deployed for hruser`);
            return true;
        }
        logger.info(`e2e-Application not found for hruser - uploading and deploying it now`);
        const appDefinition = await importPublishApp('e2e-Application');
        if (appDefinition?.appDefinition?.id) {
            await deployApp(appDefinition.appDefinition.id);
            logger.info(`e2e-Application successfully deployed for hruser`);
            return true;
        }
        logger.info(`Failed to import/deploy e2e-Application for hruser - proceeding with full initialization`);
        return false;
    } catch (error: any) {
        logger.info(`Unable to verify APS state for hruser - proceeding with initialization: ${formatError(error)}`);
        return false;
    }
}

/**
 * Initialise default applications
 */
async function initializeDefaultApps() {
    for (const appInfo of ACTIVITI_APPS.apps) {
        const isDeployed = await isDefaultAppDeployed(appInfo.name);
        if (!isDeployed) {
            const appDefinition = await importPublishApp(appInfo.name);
            if (!appDefinition?.appDefinition?.id) {
                logger.error(`Failed to import app ${appInfo.name}, skipping deployment.`);
                continue;
            }
            await deployApp(appDefinition.appDefinition.id);
        } else {
            logger.info(`***** App ${appInfo.name} already deployed *****`);
        }
    }
}

/**
 * Check environment state and authenticate. Retries on transient failures.
 *
 * @param opts command options
 * @param attempt current attempt number
 */
async function checkEnv(opts: InitApsEnvArgs, attempt = 1) {
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
    } catch (error: any) {
        const errorCode = error?.error?.code;

        if (errorCode === 'ETIMEDOUT' || error?.status === 504) {
            logger.warn('Login attempt timed out or received a gateway error, environment may still be starting up.');
        } else {
            logger.error('Login error, environment down or inaccessible.');
        }

        if (attempt >= MAX_RETRY) {
            logger.error('Give up');
            exit(1);
        }

        logger.warn(`Retry in ${RETRY_DELAY_MS / 1000} seconds, attempt ${attempt}`);
        await wait(RETRY_DELAY_MS);
        await checkEnv(opts, attempt + 1);
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
        const errorMessage = `Wrong configuration. Another tenant has been created with id ${tenant.id} and name ${tenant.name}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
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
    } catch (error: any) {
        logger.info(`APS: not able to create the default tenant: ${formatError(error)}`);
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
    } catch (error: any) {
        logger.info(`APS: not able to create the default user: ${formatError(error)}`);
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
            {},
            {},
            {},
            { file: fileContent },
            {},
            ['multipart/form-data'],
            ['application/json']
        );
        logger.info(`Aps License uploaded!`);
        return true;
    } catch (error: any) {
        logger.error(`Aps License failed! ${formatError(error)}`);
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
    } catch (error: any) {
        logger.error(`Failed to check if ${appName} is deployed: ${formatError(error)}`);
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
    } catch (error: any) {
        logger.error(`Aps app failed to import/Publish! ${formatError(error)}`);
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
    } catch (error: any) {
        logger.error(`Aps app failed to deploy: ${formatError(error)}`);
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
            {},
            {},
            {},
            {},
            {},
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
            {},
            { max: 1000 },
            {},
            {},
            {},
            ['application/json'],
            ['application/json']
        );
        const usernamesOfApsDefaultUsers = ['hruser', 'salesuser', 'superadminuser'];
        const apsDefaultUsers = users.filter((user) => usernamesOfApsDefaultUsers.includes(user.username));
        logger.info(`Keycloak found ${apsDefaultUsers.length} users`);
        return apsDefaultUsers;
    } catch (error: any) {
        logger.error(`APS: not able to fetch user: ${formatError(error)}`);
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
            {},
            {},
            {},
            {},
            {},
            ['application/json'],
            ['application/json']
        );
        return !!contentRepos.data.find((repo) => repo.name === contentName);
    } catch (error: any) {
        logger.error(`APS: not able to check content repo: ${formatError(error)}`);
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
            {},
            {},
            {},
            {},
            body,
            ['application/json'],
            ['application/json']
        );
        logger.info(`Content created!`);
        return content;
    } catch (error: any) {
        logger.error(`APS: not able to create content: ${formatError(error)}`);
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
            {},
            {},
            {},
            {},
            {},
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
    } catch (error: any) {
        logger.error(`APS: not able to authorize content: ${formatError(error)}`);
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
            {},
            {},
            {},
            {},
            body,
            ['application/json'],
            ['application/json']
        );
        logger.info(`User authorized!`);
        return content;
    } catch (error: any) {
        logger.error(`APS: not able to authorize content: ${formatError(error)}`);
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
 * Format an error for logging.
 *
 * @param error error object
 */
function formatError(error: any): string {
    if (!error) {
        return 'Unknown error';
    }

    if (typeof error === 'string') {
        return error;
    }

    return error?.message || error?.stack || JSON.stringify(error);
}

/**
 * Async delay.
 *
 * @param ms milliseconds to wait
 */
function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
