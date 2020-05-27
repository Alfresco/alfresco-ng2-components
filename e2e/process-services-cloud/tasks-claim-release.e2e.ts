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
    ApiService,
    AppListCloudPage,
    GroupIdentityService,
    IdentityService,
    LocalStorageUtil,
    LoginSSOPage,
    ProcessDefinitionsService,
    ProcessInstancesService,
    TaskFormCloudComponent,
    TaskHeaderCloudPage
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasks-cloud-demo.page';
import { ProcessInstanceCloud } from '@alfresco/adf-process-services-cloud';
import { taskFilterConfiguration } from './config/task-filter.config';

describe('Task claim/release', () => {
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const apiService = new ApiService(
        browser.params.testConfig.appConfig.oauth2.clientId,
        browser.params.testConfig.appConfig.bpmHost, browser.params.testConfig.appConfig.oauth2.host, browser.params.testConfig.appConfig.providers
    );
    const processDefinitionService = new ProcessDefinitionsService(apiService);
    const processInstancesService = new ProcessInstancesService(apiService);
    const candidateApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP;
    let processInstance: ProcessInstanceCloud;

    describe('candidate user', () => {

        beforeAll(async () => {
            await apiService.login(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);
            const processDefinition = await processDefinitionService.getProcessDefinitionByName(candidateApp.processes.candidateUserProcess, candidateApp.name);
            processInstance = (await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateApp.name)).entry;
        });

        beforeEach(async () => {
            await navigateToApp(browser.params.testConfig.hrUser);
        });

        afterAll(async () => {
            await apiService.login(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);
            await processInstancesService.deleteProcessInstance(processInstance.id, processInstance.appName);
            await navigationBarPage.clickLogoutButton();
        });

        it('[C306874] Should be able to Claim/Release a process task which has a candidate user', async () => {
            await setTaskFilter({ status: 'CREATED', processInstanceId: processInstance.id  });

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(candidateApp.tasks.candidateUserTask);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(candidateApp.tasks.candidateUserTask);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkClaimButtonIsDisplayed();
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual('No assignee');

            await taskFormCloudComponent.clickClaimButton();
            await browser.refresh();
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkReleaseButtonIsDisplayed();
            await expect(await taskHeaderCloudPage.getStatus()).toEqual('ASSIGNED');
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual(browser.params.testConfig.hrUser.email);

            await taskFormCloudComponent.clickReleaseButton();
            await browser.refresh();
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkClaimButtonIsDisplayed();
            await expect(await taskHeaderCloudPage.getStatus()).toEqual('CREATED');
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual('No assignee');
        });

   });

    describe('candidate group', () => {
        let identityService: IdentityService;
        let groupIdentityService: GroupIdentityService;
        let candidate;

        beforeAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            identityService = new IdentityService(apiService);
            groupIdentityService = new GroupIdentityService(apiService);
            candidate = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);
            const groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(candidate.idIdentityService, groupInfo.id);

            await apiService.login(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);
            const processDefinition = await processDefinitionService.getProcessDefinitionByName(candidateApp.processes.uploadFileProcess, candidateApp.name);
            processInstance = (await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateApp.name)).entry;
        });

        afterAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(candidate.idIdentityService);

            await apiService.login(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);
            await processInstancesService.deleteProcessInstance(processInstance.id, processInstance.appName);
            await navigationBarPage.clickLogoutButton();
        });

        it('[C306875] should be able to Claim/Release a process task which has a candidate group', async () => {
            await navigateToApp(browser.params.testConfig.hrUser);
            await setTaskFilter({ status: 'CREATED', processInstanceId: processInstance.id  });

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(candidateApp.tasks.uploadFileTask);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(candidateApp.tasks.uploadFileTask);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkClaimButtonIsDisplayed();
            await expect(await taskHeaderCloudPage.getStatus()).toEqual('CREATED');
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual('No assignee');

            await taskFormCloudComponent.clickClaimButton();
            await browser.refresh();
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkReleaseButtonIsDisplayed();
            await expect(await taskHeaderCloudPage.getStatus()).toEqual('ASSIGNED');
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual(browser.params.testConfig.hrUser.email);

            await taskFormCloudComponent.clickReleaseButton();
            await browser.refresh();
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await taskFormCloudComponent.checkClaimButtonIsDisplayed();
            await expect(await taskHeaderCloudPage.getStatus()).toEqual('CREATED');
            await expect(await taskHeaderCloudPage.getAssignee()).toEqual('No assignee');

            await navigationBarPage.clickLogoutButton();
            await navigateToApp(candidate);
            await setTaskFilter({ status: 'CREATED', processInstanceId: processInstance.id  });

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(candidateApp.tasks.uploadFileTask);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(candidateApp.tasks.uploadFileTask);
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

    async function navigateToApp(user) {
        await loginSSOPage.loginSSOIdentityService(user.email, user.password);
        await LocalStorageUtil.setConfigField('adf-edit-task-filter', JSON.stringify(taskFilterConfiguration));
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(candidateApp.name);
        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
    }

    async function setTaskFilter({ status, processInstanceId }) {
        await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown(status);
        await tasksCloudDemoPage.editTaskFilterCloudComponent().setProcessInstanceId(processInstanceId);
        await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
    }
});
