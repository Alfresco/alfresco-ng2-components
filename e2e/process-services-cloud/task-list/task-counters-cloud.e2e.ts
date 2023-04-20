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
import {
    LoginPage,
    TasksService, createApiService,
    AppListCloudPage,
    StringUtil,
    IdentityService,
    GroupIdentityService,
    NotificationHistoryPage,
    ProcessInstancesService,
    ProcessDefinitionsService,
    QueryService
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';

describe('Task counters cloud', () => {

    describe('Task Counters', () => {

        const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

        const loginSSOPage = new LoginPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const notificationHistoryPage = new NotificationHistoryPage();
        const taskFilter = tasksCloudDemoPage.taskFilterCloudComponent;

        const apiService = createApiService();
        const identityService = new IdentityService(apiService);
        const groupIdentityService = new GroupIdentityService(apiService);
        const tasksService = new TasksService(apiService);
        const processDefinitionService = new ProcessDefinitionsService(apiService);
        const processInstancesService = new ProcessInstancesService(apiService);
        const queryService = new QueryService(apiService);

        let testUser; let groupInfo;

        const createdTaskName = StringUtil.generateRandomString();

        beforeAll(async () => {
            await apiService.loginWithProfile('identityAdmin');

            testUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);
            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

            await apiService.login(testUser.username, testUser.password);
            await loginSSOPage.login(testUser.username, testUser.password);
        });

        afterAll(async () => {
            await apiService.loginWithProfile('identityAdmin');
            await identityService.deleteIdentityUser(testUser.idIdentityService);
        });

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
        });

        it('[C593065] Should display notification in counter when process started', async () => {
            await taskFilter.checkTaskFilterCounter('my-tasks');
            await expect(await taskFilter.getTaskFilterCounter('my-tasks')).toBe('0');

            const processDefinition = await processDefinitionService.getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.uploadSingleMultipleFiles, simpleApp);
            const processInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp, { name: StringUtil.generateRandomString() });
            const task = await queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp);
            await tasksService.claimTask(task.list.entries[0].entry.id, simpleApp);

            await notificationHistoryPage.checkNotificationCenterHasNewNotifications();
            await notificationHistoryPage.clickNotificationButton();
            await notificationHistoryPage.checkNotificationIsPresent(`task has been assigned`);

            await notificationHistoryPage.clickMarkAsRead();
            await processInstancesService.deleteProcessInstance(processInstance.entry.id, simpleApp);
        });

        it('[C593066] Should display notification in counter when task assigned', async () => {
            await taskFilter.checkTaskFilterCounter('my-tasks');
            await expect(await taskFilter.getTaskFilterCounter('my-tasks')).toBe('0');

            const taskCounter = await taskFilter.getTaskFilterCounter('my-tasks');
            const assigneeTask = await tasksService.createStandaloneTask(createdTaskName, simpleApp);
            await tasksService.claimTask(assigneeTask.entry.id, simpleApp);

            await taskFilter.checkNotificationCounterValue('my-tasks', (parseInt(taskCounter, 10) + 1).toString());

            await notificationHistoryPage.clickNotificationButton();
            await notificationHistoryPage.clickMarkAsRead();
            await tasksService.deleteTask(assigneeTask.entry.id, simpleApp);
        });

        it('[C290009] Should display notification in task center', async () => {
            await taskFilter.checkTaskFilterCounter('my-tasks');
            const assigneeTask = await tasksService.createStandaloneTask(createdTaskName, simpleApp);
            await tasksService.claimTask(assigneeTask.entry.id, simpleApp);

            await notificationHistoryPage.checkNotificationCenterHasNewNotifications();
            await notificationHistoryPage.clickNotificationButton();
            await notificationHistoryPage.checkNotificationIsPresent(`${assigneeTask.entry.name} task has been assigned`);

            await notificationHistoryPage.clickMarkAsRead();
            await tasksService.deleteTask(assigneeTask.entry.id, simpleApp);
        });
    });
});
