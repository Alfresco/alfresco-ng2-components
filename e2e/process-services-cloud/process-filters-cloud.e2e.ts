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

import { browser } from 'protractor';
import {
    TasksService,
    QueryService,
    ProcessDefinitionsService,
    ProcessInstancesService,
    LoginSSOPage,
    ApiService,
    SettingsPage,
    IdentityService,
    GroupIdentityService
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import resources = require('../util/resources');

describe('Process filters cloud', () => {

    describe('Process Filters', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const processCloudDemoPage = new ProcessCloudDemoPage();
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

        let runningProcess, completedProcess, testUser, groupInfo;
        const candidateBaseApp = resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.name;

        beforeAll(async (done) => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            identityService = new IdentityService(apiService);
            groupIdentityService = new GroupIdentityService(apiService);
            testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.roles.aps_user]);

            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
            await apiService.login(testUser.email, testUser.password);

            processDefinitionService = new ProcessDefinitionsService(apiService);
            const processDefinition = await processDefinitionService.getProcessDefinitionByName('candidateGroupProcess', candidateBaseApp);
            processInstancesService = new  ProcessInstancesService(apiService);
            runningProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp);

            completedProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp);
            queryService = new QueryService(apiService);
            const task = await queryService.getProcessInstanceTasks(completedProcess.entry.id, candidateBaseApp);
            tasksService = new TasksService(apiService);
            const claimedTask = await tasksService.claimTask(task.list.entries[0].entry.id, candidateBaseApp);
            await tasksService.completeTask(claimedTask.entry.id, candidateBaseApp);

            await settingsPage.setProviderBpmSso(
                browser.params.config.bpmHost,
                browser.params.config.oauth2.host,
                browser.params.config.identityHost);
            loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
            done();
        }, 5 * 60 * 1000);

        afterAll(async(done) => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);
            done();
        });

        beforeEach((done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(candidateBaseApp);
            tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
            processCloudDemoPage.clickOnProcessFilters();
            done();
        });

        it('[C290021] Should be able to view default filters', () => {
            processCloudDemoPage.completedProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.runningProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
        });

        it('[C290043] Should display process in Running Processes List when process is started', () => {
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            processCloudDemoPage.runningProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcess.entry.id);

            processCloudDemoPage.completedProcessesFilter().clickProcessFilter();
            processCloudDemoPage.completedProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Completed Processes');
            processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedById(runningProcess.entry.id);

            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('All Processes');
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcess.entry.id);
        });

        it('[C290044] Should display process in Completed Processes List when process is completed', () => {
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            processCloudDemoPage.runningProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedById(completedProcess.entry.id);

            processCloudDemoPage.completedProcessesFilter().clickProcessFilter();
            processCloudDemoPage.completedProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Completed Processes');
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(completedProcess.entry.id);

            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('All Processes');
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(completedProcess.entry.id);
        });
    });

});
