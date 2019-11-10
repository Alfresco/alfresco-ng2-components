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
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import {
    LoginSSOPage,
    AppListCloudPage,
    StringUtil,
    GroupCloudComponentPage,
    StartTasksCloudPage,
    PeopleCloudComponentPage,
    TasksService,
    ApiService,
    IdentityService,
    GroupIdentityService, RolesService
} from '@alfresco/adf-testing';

describe('Start Task - Group Cloud Component', () => {

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const startTask = new StartTasksCloudPage();
    const peopleCloudComponent = new PeopleCloudComponentPage();
    const apiService = new ApiService(
        browser.params.config.oauth2.clientId,
        browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
    );
    const groupCloud = new GroupCloudComponentPage();

    const bothGroupsTaskName = StringUtil.generateRandomString(5);
    const oneGroupTaskName = StringUtil.generateRandomString(5);
    let apsUser, testUser, hrGroup, testGroup;
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;

    beforeAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        testUser = await identityService.createIdentityUser();
        apsUser = await identityService.createIdentityUser();

        hrGroup = await groupIdentityService.getGroupInfoByGroupName('hr');
        testGroup = await groupIdentityService.getGroupInfoByGroupName('testgroup');

        const rolesService = new RolesService(apiService);
        const apsAdminRoleId = await rolesService.getRoleIdByRoleName(identityService.ROLES.ACTIVITI_USER);
        await groupIdentityService.assignRole(testGroup.id, apsAdminRoleId, identityService.ROLES.ACTIVITI_USER);

        await identityService.addUserToGroup(testUser.idIdentityService, testGroup.id);
        await identityService.addUserToGroup(apsUser.idIdentityService, hrGroup.id);
    });

    afterAll(async () => {
        await apiService.login(testUser.email, testUser.password);
        const tasksService = new TasksService(apiService);

        const bothGroupsTaskId = await tasksService.getTaskId(bothGroupsTaskName, simpleApp);
        await tasksService.deleteTask(bothGroupsTaskId, simpleApp);

        const oneGroupTaskId = await tasksService.getTaskId(oneGroupTaskName, simpleApp);
        await tasksService.deleteTask(oneGroupTaskId, simpleApp);

        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await identityService.deleteIdentityUser(apsUser.idIdentityService);
        await identityService.deleteIdentityUser(testUser.idIdentityService);

    });

    beforeEach(async () => {
        await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.checkAppIsDisplayed(simpleApp);
        await appListCloudComponent.goToApp(simpleApp);
        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
    });

    afterEach(async () => {
        await navigationBarPage.clickLogoutButton();
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

        await navigationBarPage.clickLogoutButton();
        await loginSSOPage.loginSSOIdentityService(apsUser.email, apsUser.password);
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.checkAppIsDisplayed(simpleApp);
        await appListCloudComponent.goToApp(simpleApp);
        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

        await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CREATED');

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

        await navigationBarPage.clickLogoutButton();
        await loginSSOPage.loginSSOIdentityService(apsUser.email, apsUser.password);
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.checkAppIsDisplayed(simpleApp);
        await appListCloudComponent.goToApp(simpleApp);
        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

        await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CREATED');

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
        await groupCloud.checkGroupNotSelected(testGroup.name);

        await groupCloud.searchGroups(testGroup.name);
        await groupCloud.checkGroupIsDisplayed(testGroup.name);
        await groupCloud.selectGroupFromList(testGroup.name);
        await groupCloud.checkSelectedGroup(testGroup.name);
    });

});
