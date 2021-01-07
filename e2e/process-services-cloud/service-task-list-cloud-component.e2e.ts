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

import { browser
} from 'protractor';
import {
    LoginPage,
    ApiService,
    IdentityService,
    GroupIdentityService,
    ProcessDefinitionsService,
    ProcessInstancesService
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import { ServiceTaskListPage } from './pages/service-task-list.page';
import CONSTANTS = require('../util/constants');

describe('Service task list cloud', () => {

    describe('Service Task Filters', () => {

        const loginSSOPage = new LoginPage();
        const navigationBarPage = new NavigationBarPage();
        const serviceTaskListPage = new ServiceTaskListPage();

        const apiService = new ApiService();
        const identityService = new IdentityService(apiService);
        const groupIdentityService = new GroupIdentityService(apiService);
        const processDefinitionService = new ProcessDefinitionsService(apiService);
        const processInstancesService = new ProcessInstancesService(apiService);

        const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
        /* cspell:disable-next-line */
        const activityNameSimpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.multiinstanceservicetask;

        let testUser, groupInfo;

        beforeAll(async () => {
            await apiService.loginWithProfile('identityAdmin');

            testUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);
            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

            await apiService.login(testUser.email, testUser.password);
            const processDefinition = await processDefinitionService
              /* cspell:disable-next-line */
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.multiinstanceservicetask, simpleApp);
            await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);

            /* cspell:disable-next-line */
            await loginSSOPage.login(browser.params.testConfig.users.superadmin.username, browser.params.testConfig.users.superadmin.password);
        });

        afterAll(async () => {
            await apiService.loginWithProfile('identityAdmin');
            await identityService.deleteIdentityUser(testUser.idIdentityService);
        });

        it('[C587515] Should be able to select a filter service task and see only the service task related to the selected app', async () => {
            await navigationBarPage.navigateToServiceTaskListCloudPage();
            await serviceTaskListPage.checkServiceTaskFiltersDisplayed();
            await serviceTaskListPage.checkSearchServiceTaskFiltersDisplayed();
            await serviceTaskListPage.checkServiceTaskListDisplayed();

            await serviceTaskListPage.clickCompletedServiceTask();
            await serviceTaskListPage.clickSearchHeaderServiceTask();
            await serviceTaskListPage.searchByActivityName(activityNameSimpleApp);
            await serviceTaskListPage.checkServiceTaskListResultsIsLoaded();

            await expect(await serviceTaskListPage.getStatusText()).toBe(CONSTANTS.SERVICE_TASK_STATUS.COMPLETED);
        });
    });
});
