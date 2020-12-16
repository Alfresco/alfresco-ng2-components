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

import { ApiService, AppListCloudPage, GroupIdentityService, IdentityService, LoginPage, ProcessDefinitionsService, ProcessInstancesService, QueryService, TasksService } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { TasksCloudDemoPage } from './pages/tasks-cloud-demo.page';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';

describe('Process list cloud', () => {

    describe('Process List - Custom Action Menu', () => {

        const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

        const loginSSOPage = new LoginPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();

        const apiService = new ApiService();
        const identityService = new IdentityService(apiService);
        const groupIdentityService = new GroupIdentityService(apiService);
        const processDefinitionService = new ProcessDefinitionsService(apiService);
        const processInstancesService = new ProcessInstancesService(apiService);
        const queryService = new QueryService(apiService);
        const tasksService = new TasksService(apiService);

        let testUser, groupInfo, editProcess, deleteProcess, editTask, deleteTask;

        beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

        await apiService.login(testUser.username, testUser.password);
        const processDefinition = await processDefinitionService
                .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.dropdownrestprocess, simpleApp);

        editProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
        deleteProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);

        editTask = await queryService.getProcessInstanceTasks(editProcess.entry.id, simpleApp);
        deleteTask = await queryService.getProcessInstanceTasks(deleteProcess.entry.id, simpleApp);
        await tasksService.claimTask(editTask.list.entries[0].entry.id, simpleApp);
        await tasksService.claimTask(deleteTask.list.entries[0].entry.id, simpleApp);

        await loginSSOPage.login(testUser.username, testUser.password);
        });

        afterAll(async() => {
            await apiService.loginWithProfile('identityAdmin');
            await identityService.deleteIdentityUser(testUser.idIdentityService);
        });

        beforeAll(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.enableTestingMode();
            await tasksCloudDemoPage.enableActionMenu();
            await tasksCloudDemoPage.enableContextMenu();
            await tasksCloudDemoPage.addActionIsDisplayed();
            await tasksCloudDemoPage.addAction('edit');
            await tasksCloudDemoPage.actionAdded('edit');
            await tasksCloudDemoPage.addAction('delete');
            await tasksCloudDemoPage.actionAdded('delete');
            await tasksCloudDemoPage.addDisabledAction('disabledaction');
            await tasksCloudDemoPage.actionAdded('disabledaction');
            await tasksCloudDemoPage.addInvisibleAction('invisibleaction');
            await tasksCloudDemoPage.actionAdded('invisibleaction');
            await tasksCloudDemoPage.clickAppButton();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
            await tasksCloudDemoPage.taskFilterCloudComponent.checkTaskFilterIsDisplayed('my-tasks');
        });

        it('[C315723] Should be able to see and execute custom action menu', async () => {
            await expect(await tasksCloudDemoPage.taskFilterCloudComponent.getActiveFilterName()).toBe('My Tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(editTask.list.entries[0].entry.id);
            await tasksCloudDemoPage.taskListCloudComponent().clickOptionsButton(editTask.list.entries[0].entry.id);
            await expect(await tasksCloudDemoPage.taskListCloudComponent().isCustomActionEnabled('disabledaction')).toBe(false);
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getNumberOfOptions()).toBe(3);
            await tasksCloudDemoPage.taskListCloudComponent().clickOnCustomActionMenu('edit');
            await tasksCloudDemoPage.checkActionExecuted(editTask.list.entries[0].entry.id, 'edit');
            await tasksCloudDemoPage.taskListCloudComponent().rightClickOnRow(deleteTask.list.entries[0].entry.id);
            await expect(await tasksCloudDemoPage.taskListCloudComponent().isCustomActionEnabled('disabledaction')).toBe(false);
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getNumberOfOptions()).toBe(3);
            await tasksCloudDemoPage.taskListCloudComponent().clickContextMenuActionNamed('delete');
            await tasksCloudDemoPage.checkActionExecuted(deleteTask.list.entries[0].entry.id, 'delete');
        });
   });
});
