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

import { browser } from 'protractor';
import { createApiService,
    AppListCloudPage,
    GroupIdentityService,
    IdentityService,
    LocalStorageUtil,
    LoginPage,
    ProcessDefinitionsService,
    ProcessInstancesService,
    StatusType,
    TaskFormCloudComponent,
    TaskHeaderCloudPage
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';
import { ProcessInstanceCloud } from '@alfresco/adf-process-services-cloud';
import { taskFilterConfiguration } from './../config/task-filter.config';

describe('Task claim/release', () => {

    const candidateApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP;

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();

    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const editTaskFilter = tasksCloudDemoPage.editTaskFilterCloud;
    const taskList = tasksCloudDemoPage.taskListCloudComponent();

    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();

    const apiService = createApiService();
    const processDefinitionService = new ProcessDefinitionsService(apiService);
    const processInstancesService = new ProcessInstancesService(apiService);
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);

    let processInstance: ProcessInstanceCloud;

    describe('candidate user', () => {
        beforeAll(async () => {
            await apiService.login(browser.params.testConfig.users.hrUser.username, browser.params.testConfig.users.hrUser.password);
            const processDefinition = await processDefinitionService.getProcessDefinitionByName(candidateApp.processes.candidateUserProcess, candidateApp.name);
            processInstance = (await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateApp.name)).entry;
        });

        beforeEach(async () => {
            await navigateToApp(browser.params.testConfig.users.hrUser);
        });

        afterAll(async () => {
            await processInstancesService.deleteProcessInstance(processInstance.id, processInstance.appName);
            await navigationBarPage.clickLogoutButton();
        });

        it('[C306874] Should be able to Claim/Release a process task which has a candidate user', async () => {
            await setStatusTaskFilter('Created', processInstance.id);

            await taskList.checkContentIsDisplayedByName(candidateApp.tasks.candidateUserTask);
            await taskList.selectRow(candidateApp.tasks.candidateUserTask);

            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkClaimButtonIsDisplayed();
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual('No assignee');

            await taskFormCloudComponent.clickClaimButton();
            await browser.refresh();
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkReleaseButtonIsDisplayed();

            await expect(await taskHeaderCloudPage.getStatus()).toEqual('ASSIGNED');
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual(browser.params.testConfig.users.hrUser.username);

            await taskFormCloudComponent.clickReleaseButton();
            await browser.refresh();
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkClaimButtonIsDisplayed();
            await expect(await taskHeaderCloudPage.getStatus()).toEqual('CREATED');
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual('No assignee');
        });

    });

    describe('candidate group', () => {
        let candidate;

        beforeAll(async () => {
            await apiService.loginWithProfile('identityAdmin');
            candidate = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);
            const groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(candidate.idIdentityService, groupInfo.id);

            await apiService.login(browser.params.testConfig.users.hrUser.username, browser.params.testConfig.users.hrUser.password);
            const processDefinition = await processDefinitionService.getProcessDefinitionByName(candidateApp.processes.uploadFileProcess, candidateApp.name);
            processInstance = (await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateApp.name)).entry;
        });

        afterAll(async () => {
            await apiService.loginWithProfile('identityAdmin');
            await identityService.deleteIdentityUser(candidate.idIdentityService);

            await apiService.login(browser.params.testConfig.users.hrUser.username, browser.params.testConfig.users.hrUser.password);
            await processInstancesService.deleteProcessInstance(processInstance.id, processInstance.appName);
            await navigationBarPage.clickLogoutButton();
        });

        it('[C306875] should be able to Claim/Release a process task which has a candidate group', async () => {
            await navigateToApp(browser.params.testConfig.users.hrUser);
            await setStatusTaskFilter('Created', processInstance.id);

            await taskList.checkContentIsDisplayedByName(candidateApp.tasks.uploadFileTask);
            await taskList.selectRow(candidateApp.tasks.uploadFileTask);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkClaimButtonIsDisplayed();
            await expect(await taskHeaderCloudPage.getStatus()).toEqual('CREATED');
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual('No assignee');

            await taskFormCloudComponent.clickClaimButton();
            await browser.refresh();
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkReleaseButtonIsDisplayed();
            await expect(await taskHeaderCloudPage.getStatus()).toEqual('ASSIGNED');
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual(browser.params.testConfig.users.hrUser.username);

            await taskFormCloudComponent.clickReleaseButton();
            await browser.refresh();
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkClaimButtonIsDisplayed();
            await expect(await taskHeaderCloudPage.getStatus()).toEqual('CREATED');
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual('No assignee');

            await navigationBarPage.clickLogoutButton();
            await navigateToApp(candidate);
            await setStatusTaskFilter('Created', processInstance.id);

            await taskList.checkContentIsDisplayedByName(candidateApp.tasks.uploadFileTask);
            await taskList.selectRow(candidateApp.tasks.uploadFileTask);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkClaimButtonIsDisplayed();
            await expect(await taskHeaderCloudPage.getStatus()).toEqual('CREATED');
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual('No assignee');

            await taskFormCloudComponent.clickClaimButton();
            await browser.refresh();
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkReleaseButtonIsDisplayed();
            await expect(await taskHeaderCloudPage.getStatus()).toEqual('ASSIGNED');
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual(candidate.username);

            await taskFormCloudComponent.clickReleaseButton();
            await browser.refresh();
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkClaimButtonIsDisplayed();
            await expect(await taskHeaderCloudPage.getStatus()).toEqual('CREATED');
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual('No assignee');
        });

    });

    async function navigateToApp(user: { username: string; password: string }) {
        await loginSSOPage.login(user.username, user.password);
        await LocalStorageUtil.setConfigField('adf-edit-task-filter', JSON.stringify(taskFilterConfiguration));
        await navigationBarPage.navigateToProcessServicesCloudPage();

        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(candidateApp.name);

        await taskList.getDataTable().waitForTableBody();
    }

    async function setStatusTaskFilter(status: StatusType, processInstanceId: string) {
        await editTaskFilter.openFilter();
        await editTaskFilter.clearAssignee();
        await editTaskFilter.setStatusFilterDropDown(status);

        await editTaskFilter.setProcessInstanceId(processInstanceId);
        await editTaskFilter.closeFilter();
    }
});
