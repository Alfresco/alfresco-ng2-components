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
    ApiService,
    AppListCloudPage,
    GroupIdentityService,
    IdentityService,
    LoginSSOPage,
    StringUtil,
    ProcessDefinitionsService,
    ProcessInstancesService,
    QueryService,
    TasksService,
    EditProcessFilterCloudComponentPage
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/process-cloud-demo.page';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasks-cloud-demo.page';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';

describe('Process filters cloud', () => {

    describe('Process Filters', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const processCloudDemoPage = new ProcessCloudDemoPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const editProcessFilterCloudComponentPage = new EditProcessFilterCloudComponentPage();
        const apiService = new ApiService();

        let tasksService: TasksService;
        let identityService: IdentityService;
        let groupIdentityService: GroupIdentityService;
        let processDefinitionService: ProcessDefinitionsService;
        let processInstancesService: ProcessInstancesService;
        let queryService: QueryService;

        let runningProcess, completedProcess, testUser, groupInfo;
        const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;

        beforeAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            identityService = new IdentityService(apiService);
            groupIdentityService = new GroupIdentityService(apiService);
            testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);

            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
            await apiService.login(testUser.email, testUser.password);

            processDefinitionService = new ProcessDefinitionsService(apiService);
            const processDefinition = await processDefinitionService
                .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.candidateGroupProcess, candidateBaseApp);

            processInstancesService = new ProcessInstancesService(apiService);
            runningProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                'name': StringUtil.generateRandomString(),
                'businessKey': StringUtil.generateRandomString()
            });

            completedProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                'name': StringUtil.generateRandomString(),
                'businessKey': StringUtil.generateRandomString()
            });
            queryService = new QueryService(apiService);

            const task = await queryService.getProcessInstanceTasks(completedProcess.entry.id, candidateBaseApp);
            tasksService = new TasksService(apiService);
            const claimedTask = await tasksService.claimTask(task.list.entries[0].entry.id, candidateBaseApp);
            await tasksService.completeTask(claimedTask.entry.id, candidateBaseApp);

            await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);

        }, 5 * 60 * 1000);

        afterAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);
        });

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(candidateBaseApp);
            await tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
            await processCloudDemoPage.processFilterCloudComponent.clickOnProcessFilters();
        });

        it('[C290021] Should be able to view default filters', async () => {
            await processCloudDemoPage.processFilterCloudComponent.checkCompletedProcessesFilterIsDisplayed();
            await processCloudDemoPage.processFilterCloudComponent.checkRunningProcessesFilterIsDisplayed();
            await processCloudDemoPage.processFilterCloudComponent.checkAllProcessesFilterIsDisplayed();
        });

        it('[C290043] Should display process in Running Processes List when process is started', async () => {
            await processCloudDemoPage.processFilterCloudComponent.clickRunningProcessesFilter();
            await editProcessFilterCloudComponentPage.openFilter();
            await editProcessFilterCloudComponentPage.setProcessName(runningProcess.entry.name);
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('Running Processes');
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcess.entry.id);

            await processCloudDemoPage.processFilterCloudComponent.clickCompletedProcessesFilter();
            await editProcessFilterCloudComponentPage.setProcessName(runningProcess.entry.name);
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('Completed Processes');
            await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedById(runningProcess.entry.id);

            await processCloudDemoPage.processFilterCloudComponent.clickAllProcessesFilter();
            await editProcessFilterCloudComponentPage.setProcessName(runningProcess.entry.name);
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('All Processes');
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcess.entry.id);
        });

        it('[C290044] Should display process in Completed Processes List when process is completed', async () => {
            await processCloudDemoPage.processFilterCloudComponent.clickRunningProcessesFilter();
            await editProcessFilterCloudComponentPage.openFilter();
            await editProcessFilterCloudComponentPage.setProcessName(completedProcess.entry.name);
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('Running Processes');
            await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedById(completedProcess.entry.id);

            await processCloudDemoPage.processFilterCloudComponent.clickCompletedProcessesFilter();
            await editProcessFilterCloudComponentPage.setProcessName(completedProcess.entry.name);
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('Completed Processes');
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(completedProcess.entry.id);

            await processCloudDemoPage.processFilterCloudComponent.clickAllProcessesFilter();
            await editProcessFilterCloudComponentPage.setProcessName(completedProcess.entry.name);
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('All Processes');
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(completedProcess.entry.id);
        });
    });
});
