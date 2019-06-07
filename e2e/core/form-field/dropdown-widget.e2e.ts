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

import {
    TasksService, QueryService, ProcessDefinitionsService, ProcessInstancesService,
    LoginSSOPage, ApiService, SettingsPage, IdentityService, GroupIdentityService
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import resources = require('../../util/resources');
import { browser } from 'protractor';

describe('Form Field Component - Dropdown Widget', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const settingsPage = new SettingsPage();
        const apiService = new ApiService(
            browser.params.config.oauth2.clientId,
            browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
        );

        let tasksService: TasksService;
        let identityService: IdentityService;
        let groupIdentityService: GroupIdentityService;
        let processDefinitionService: ProcessDefinitionsService;
        let processInstancesService: ProcessInstancesService;
        let queryService: QueryService;

        let runningProcessInstance, testUser, groupInfo, claimedTask;
        const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;

        beforeAll(async (done) => {

            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            identityService = new IdentityService(apiService);
            groupIdentityService = new GroupIdentityService(apiService);
            testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.roles.aps_user]);

            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
            await apiService.login(testUser.email, testUser.password);

            processDefinitionService = new ProcessDefinitionsService(apiService);
            const processDefinition = await processDefinitionService.getProcessDefinitionByName('dropdownrestprocess', simpleApp);

            processInstancesService = new ProcessInstancesService(apiService);
            await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);

            runningProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
            queryService = new QueryService(apiService);

            const task = await queryService.getProcessInstanceTasks(runningProcessInstance.entry.id, simpleApp);
            tasksService = new TasksService(apiService);
            claimedTask = await tasksService.claimTask(task.list.entries[0].entry.id, simpleApp);

            await settingsPage.setProviderBpmSso(
                browser.params.config.bpmHost,
                browser.params.config.oauth2.host,
                browser.params.config.identityHost);
            loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
            done();
        });

        afterAll(async(done) => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);
            done();
        });

        beforeEach(() => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);

        });

        it('[C290069] Should display processes ordered by name when Name is selected from sort dropdown', async () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(claimedTask);
        });

});
