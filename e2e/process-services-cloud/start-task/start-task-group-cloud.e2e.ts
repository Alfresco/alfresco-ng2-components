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
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksCloudDemoPage } from '.././pages/tasks-cloud-demo.page';
import {
    LoginPage,
    AppListCloudPage,
    StringUtil,
    GroupCloudComponentPage,
    StartTasksCloudPage,
    PeopleCloudComponentPage,
    TasksService, createApiService,
    IdentityService,
    GroupIdentityService
} from '@alfresco/adf-testing';

describe('Start Task - Group Cloud Component', () => {

    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();

    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const editTaskFilter = tasksCloudDemoPage.editTaskFilterCloud;

    const startTask = new StartTasksCloudPage();
    const peopleCloudComponent = new PeopleCloudComponentPage();
    const groupCloud = new GroupCloudComponentPage();

    const apiService = createApiService();
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);

    const bothGroupsTaskName = StringUtil.generateRandomString(5);
    const oneGroupTaskName = StringUtil.generateRandomString(5);
    let apsUser; let testUser; let hrGroup; let testGroup;

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUser();
        hrGroup = await groupIdentityService.getGroupInfoByGroupName('hr');

        apsUser = await identityService.createIdentityUser();
        testGroup = await groupIdentityService.getGroupInfoByGroupName('testgroup');

        await identityService.addUserToGroup(testUser.idIdentityService, hrGroup.id);
        await identityService.addUserToGroup(apsUser.idIdentityService, testGroup.id);

        await loginSSOPage.login(testUser.username, testUser.password);
    });

    afterAll(async () => {
        await apiService.login(testUser.username, testUser.password);
        const tasksService = new TasksService(apiService);

        const bothGroupsTaskId = await tasksService.getTaskId(bothGroupsTaskName, simpleApp);
        await tasksService.deleteTask(bothGroupsTaskId, simpleApp);

        const oneGroupTaskId = await tasksService.getTaskId(oneGroupTaskName, simpleApp);
        await tasksService.deleteTask(oneGroupTaskId, simpleApp);

        await apiService.loginWithProfile('identityAdmin');
        await identityService.deleteIdentityUser(apsUser.idIdentityService);
        await identityService.deleteIdentityUser(testUser.idIdentityService);
   });

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.checkAppIsDisplayed(simpleApp);
        await appListCloudComponent.goToApp(simpleApp);
        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
    });

    it('[C291954] Should be able to select/delete an group for a standalone task', async () => {
        await peopleCloudComponent.clearAssignee();

        await groupCloud.searchGroups(testGroup.name);
        await groupCloud.checkGroupIsDisplayed(testGroup.name);
        await groupCloud.selectGroupFromList(testGroup.name);
        await groupCloud.checkSelectedGroup(testGroup.name);

        await groupCloud.searchGroups(hrGroup.name);
        await groupCloud.checkGroupIsDisplayed(hrGroup.name);
        await groupCloud.selectGroupFromList(hrGroup.name);
        await groupCloud.checkSelectedGroup(hrGroup.name);

        await groupCloud.removeSelectedGroup(testGroup.name);
        await groupCloud.checkGroupNotSelected(testGroup.name);

        await startTask.addName(oneGroupTaskName);
        await startTask.clickStartButton();

        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        await editTaskFilter.openFilter();
        await editTaskFilter.clearAssignee();

        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(oneGroupTaskName);
    });

    it('[C291955] Should be able to select multiple groups when the selection mode=multiple', async () => {
        await peopleCloudComponent.clearAssignee();

        await groupCloud.searchGroups(testGroup.name);
        await groupCloud.checkGroupIsDisplayed(testGroup.name);
        await groupCloud.selectGroupFromList(testGroup.name);
        await groupCloud.checkSelectedGroup(testGroup.name);

        await groupCloud.searchGroups(hrGroup.name);
        await groupCloud.checkGroupIsDisplayed(hrGroup.name);
        await groupCloud.selectGroupFromList(hrGroup.name);
        await groupCloud.checkSelectedGroup(hrGroup.name);

        await startTask.addName(bothGroupsTaskName);
        await startTask.clickStartButton();

        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        await editTaskFilter.openFilter();
        await editTaskFilter.clearAssignee();

        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(bothGroupsTaskName);
    });

    it('[C291993] Should NOT be able to find a group already selected', async () => {
        await groupCloud.searchGroups(testGroup.name);
        await groupCloud.checkGroupIsDisplayed(testGroup.name);
        await groupCloud.selectGroupFromList(testGroup.name);
        await groupCloud.checkSelectedGroup(testGroup.name);

        await groupCloud.searchGroups(testGroup.name);
        await groupCloud.checkGroupIsNotDisplayed(testGroup.name);
    });

    it('[C291995] Should be able to add a group previously removed', async () => {
        await groupCloud.searchGroups(testGroup.name);
        await groupCloud.checkGroupIsDisplayed(testGroup.name);
        await groupCloud.selectGroupFromList(testGroup.name);
        await groupCloud.checkSelectedGroup(testGroup.name);

        await groupCloud.removeSelectedGroup(testGroup.name);
        await browser.sleep(1000);
        await groupCloud.checkGroupNotSelected(testGroup.name);

        await groupCloud.searchGroups(testGroup.name);
        await groupCloud.checkGroupIsDisplayed(testGroup.name);
        await groupCloud.selectGroupFromList(testGroup.name);
        await groupCloud.checkSelectedGroup(testGroup.name);
    });
});
