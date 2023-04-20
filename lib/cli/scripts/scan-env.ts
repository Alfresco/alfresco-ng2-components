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

import { AlfrescoApi, PeopleApi, NodesApi, GroupsApi, SitesApi, SearchApi, AlfrescoApiConfig } from '@alfresco/js-api';
import program from 'commander';
import { logger } from './logger';

interface PeopleTally { enabled: number; disabled: number }
interface RowToPrint { label: string; value: number }

const MAX_ATTEMPTS = 1;
const TIMEOUT = 180000;
const MAX_PEOPLE_PER_PAGE = 100;
const USERS_HOME_RELATIVE_PATH = 'User Homes';

const reset = '\x1b[0m';
const grey = '\x1b[90m';
const cyan = '\x1b[36m';
const yellow = '\x1b[33m';
const bright = '\x1b[1m';
const red = '\x1b[31m';
const green = '\x1b[32m';

let jsApiConnection: any;
let loginAttempts: number = 0;

export default async function main(_args: string[]) {

    // eslint-disable-next-line no-console
    console.log = () => {};

    program
        .version('0.1.0')
        .option('--host <type>', 'Remote environment host')
        .option('--clientId [type]', 'sso client', 'alfresco')
        .option('-p, --password <type>', 'password ')
        .option('-u, --username <type>', 'username ')
        .parse(process.argv);

    logger.info(`${cyan}${bright}Initiating environment scan...${reset}`);
    await attemptLogin();

    const rowsToPrint: Array<RowToPrint> = [];
    const peopleCount = await getPeopleCount();
    rowsToPrint.push({ label: 'Active Users', value: peopleCount.enabled });
    rowsToPrint.push({ label: 'Deactivated Users', value: peopleCount.disabled });
    rowsToPrint.push({ label: `User's Home Folders`, value: await getHomeFoldersCount() });
    rowsToPrint.push({ label: 'Groups', value: await getGroupsCount() });
    rowsToPrint.push({ label: 'Sites', value: await getSitesCount() });
    rowsToPrint.push({ label: 'Files', value: await getFilesCount() });

    logger.info(generateTable(rowsToPrint));
}

function generateTable(rowsToPrint: Array<RowToPrint>) {
    const columnWidths = rowsToPrint.reduce((maxWidths, row: RowToPrint) => ({
            labelColumn: Math.max(maxWidths.labelColumn, row.label.length),
            valueColumn: Math.max(maxWidths.valueColumn, row.value.toString().length)
        }), { labelColumn: 12, valueColumn: 1 });

    const horizontalLine = ''.padEnd(columnWidths.labelColumn + columnWidths.valueColumn + 5, '═');
    const headerText = 'ENVIRONM'.padStart(Math.floor((columnWidths.labelColumn + columnWidths.valueColumn + 3) / 2), ' ')
        + 'ENT SCAN'.padEnd(Math.ceil((columnWidths.labelColumn + columnWidths.valueColumn + 3) / 2), ' ');

    let tableString = `${grey}╒${horizontalLine}╕${reset}
${grey}│ ${bright}${cyan}${headerText} ${grey}│${reset}
${grey}╞${horizontalLine}╡${reset}`;
    rowsToPrint.forEach(row => {
        tableString += `\n${grey}│${reset} ${row.label.padEnd(columnWidths.labelColumn, ' ')}   ${yellow}${row.value.toString().padEnd(columnWidths.valueColumn, ' ')} ${grey}│${reset}`;
    });
    tableString += `\n${grey}╘${horizontalLine}╛${reset}`;

    return tableString;
}

async function attemptLogin() {
    logger.info(`    Logging into ${yellow}${program.host}${reset} with user ${yellow}${program.username}${reset}`);
    try {
        jsApiConnection = new AlfrescoApi({
            provider: 'ALL',
            hostBpm: program.host,
            hostEcm: program.host,
            authType: 'OAUTH',
            oauth2: {
                host: `${program.host}/auth/realms/alfresco`,
                clientId: `${program.clientId}`,
                scope: 'openid',
                redirectUri: '/',
                implicitFlow: false
            }
        } as unknown as AlfrescoApiConfig);
        await jsApiConnection.login(program.username, program.password);
        logger.info(`    ${green}Login SSO successful${reset}`);
    } catch (err) {
        await handleLoginError(err);
    }
}

async function handleLoginError(loginError) {
    if (loginAttempts === 0) {
        logger.error(`    ${red}Login SSO error${reset}`);
    }
    checkEnvReachable(loginError);
    loginAttempts++;
    if (MAX_ATTEMPTS === loginAttempts) {
        if (loginError && loginError.response && loginError?.response?.text) {
            try {
                const parsedJson = JSON.parse(loginError?.response?.text);
                if (typeof parsedJson === 'object' && parsedJson.error) {
                    const { stackTrace, ...errorWithoutDeprecatedProperty } = parsedJson.error;
                    logger.error(errorWithoutDeprecatedProperty);
                }
            } catch (jsonParseError) {
                logger.error(`    ${red}Could not parse the error response. Possibly non json format${reset}`);
            }
        }
        logger.error(`    ${red}Give up${reset}`);
        failScript();
    } else {
        logger.error(`    Retry in 1 minute attempt N ${loginAttempts}`);
        await wait(TIMEOUT);
        await attemptLogin();
    }
}

function checkEnvReachable(loginError) {
    const failingErrorCodes = ['ENOTFOUND', 'ETIMEDOUT', 'ECONNREFUSED'];
    if (typeof loginError === 'object' && failingErrorCodes.indexOf(loginError.code) > -1) {
        logger.error(`    ${red}The environment is not reachable (${loginError.code})${reset}`);
        failScript();
    }
}

async function getPeopleCount(skipCount: number = 0): Promise<PeopleTally> {
    if (skipCount === 0) {
        logger.info(`    Fetching number of users`);
    }
    try {
        const peopleApi = new PeopleApi(jsApiConnection);
        const apiResult = await peopleApi.listPeople({
            fields: ['enabled'],
            maxItems: MAX_PEOPLE_PER_PAGE,
            skipCount
        });
        const result: PeopleTally = apiResult.list.entries.reduce((peopleTally: PeopleTally, currentPerson) => {
            if (currentPerson.entry.enabled) {
                peopleTally.enabled++;
            } else {
                peopleTally.disabled++;
            }
            return peopleTally;
        }, { enabled: 0, disabled: 0 });
        if (apiResult.list.pagination.hasMoreItems) {
            const more = await getPeopleCount(apiResult.list.pagination.skipCount + MAX_PEOPLE_PER_PAGE);
            result.enabled += more.enabled;
            result.disabled += more.disabled;
        }
        return result;
    } catch (error) {
        handleError(error);
    }
}

async function getHomeFoldersCount(): Promise<number> {
    logger.info(`    Fetching number of home folders`);
    try {
        const nodesApi = new NodesApi(jsApiConnection);
        const homesFolderApiResult = await nodesApi.listNodeChildren('-root-', {
            maxItems: 1,
            relativePath: USERS_HOME_RELATIVE_PATH
        });
        return homesFolderApiResult.list.pagination.totalItems;
    } catch (error) {
        handleError(error);
    }
}

async function getGroupsCount(): Promise<number> {
    logger.info(`    Fetching number of groups`);
    try {
        const groupsApi = new GroupsApi(jsApiConnection);
        const groupsApiResult = await groupsApi.listGroups({ maxItems: 1 });
        return groupsApiResult.list.pagination.totalItems;
    } catch (error) {
        handleError(error);
    }
}

async function getSitesCount(): Promise<number> {
    logger.info(`    Fetching number of sites`);
    try {
        const sitesApi = new SitesApi(jsApiConnection);
        const sitesApiResult = await sitesApi.listSites({ maxItems: 1 });
        return sitesApiResult.list.pagination.totalItems;
    } catch (error) {
        handleError(error);
    }
}

async function getFilesCount(): Promise<number> {
    logger.info(`    Fetching number of files`);
    try {
        const searchApi = new SearchApi(jsApiConnection);
        const searchApiResult = await searchApi.search({
            query: {
                query: 'select * from cmis:document',
                language: 'cmis'
            },
            paging: {
                maxItems: 1
            }
        });
        return searchApiResult.list.pagination.totalItems;
    } catch (error) {
        handleError(error);
    }
}

function handleError(error) {
    logger.error(`    ${red}Error encountered${reset}`);
    if (error && error.response && error?.response?.text) {
        try {
            const parsedJson = JSON.parse(error?.response?.text);
            if (typeof parsedJson === 'object' && parsedJson.error) {
                const { stackTrace, ...errorWithoutDeprecatedProperty } = parsedJson.error;
                logger.error(errorWithoutDeprecatedProperty);
            }
        } catch (jsonParseError) {
            logger.error(`    ${red}Could not parse the error response. Possibly non json format${reset}`);
        }
    }
    failScript();
}

function failScript() {
    logger.error(`${red}${bright}Environment scan failed. Exiting${reset}`);
    process.exit(0);
}

async function wait(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
