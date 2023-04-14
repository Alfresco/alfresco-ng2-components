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
    QueryService
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';

describe('Task filters cloud', () => {

    describe('Task Filters', () => {

        const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

        const loginSSOPage = new LoginPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const taskFilter = tasksCloudDemoPage.taskFilterCloudComponent;
        const taskList = tasksCloudDemoPage.taskListCloudComponent();

        const apiService = createApiService();
        const queryService = new QueryService(apiService);
        const identityService = new IdentityService(apiService);
        const groupIdentityService = new GroupIdentityService(apiService);
        const tasksService = new TasksService(apiService);

        let testUser; let groupInfo;

        const newTask = StringUtil.generateRandomString(5); const completedTask = StringUtil.generateRandomString(5);

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

        it('[C290009] Should display default filters and created task', async () => {
            const task = await tasksService.createStandaloneTask(newTask, simpleApp);
            await tasksService.claimTask(task.entry.id, simpleApp);

            await taskFilter.clickTaskFilter('completed-tasks');
            await taskList.getDataTable().waitTillContentLoaded();

            await expect(await taskFilter.getActiveFilterName()).toBe('Completed Tasks');
            await taskList.checkContentIsNotDisplayedByName(newTask);

            await taskFilter.clickTaskFilter('my-tasks');
            await taskList.getDataTable().waitTillContentLoaded();

            await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');

            await taskList.checkContentIsDisplayedByName(newTask);
        });

        it('[C289955] Should display task in Complete Tasks List when task is completed', async () => {
            const toBeCompletedTask = await tasksService.createStandaloneTask(completedTask, simpleApp);
            await tasksService.claimTask(toBeCompletedTask.entry.id, simpleApp);
            await tasksService.completeTask(toBeCompletedTask.entry.id, simpleApp);

            await queryService.getTaskByStatus(toBeCompletedTask.entry.name, simpleApp, 'COMPLETED');
            await taskFilter.clickTaskFilter('my-tasks');
            await taskList.getDataTable().waitTillContentLoaded();

            await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');
            await taskList.checkContentIsNotDisplayedByName(completedTask);

            await taskFilter.clickTaskFilter('completed-tasks');
            await taskList.getDataTable().waitTillContentLoaded();

            await expect(await taskFilter.getActiveFilterName()).toBe('Completed Tasks');

            await taskList.checkContentIsDisplayedByName(completedTask);
        });
    });
});
