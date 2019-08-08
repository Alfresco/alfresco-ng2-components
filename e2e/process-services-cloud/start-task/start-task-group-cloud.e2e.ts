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
    SettingsPage,
    GroupIdentityService, RolesService
} from '@alfresco/adf-testing';
import resources = require('../../util/resources');

describe('Start Task - Group Cloud Component', () => {

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const startTask = new StartTasksCloudPage();
    const peopleCloudComponent = new PeopleCloudComponentPage();
    const settingsPage = new SettingsPage();
    const apiService = new ApiService(
        browser.params.config.oauth2.clientId,
        browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
    );
    const groupCloud = new GroupCloudComponentPage();

    const bothGroupsTaskName = StringUtil.generateRandomString(5);
    const oneGroupTaskName = StringUtil.generateRandomString(5);
    let apsUser, testUser, hrGroup, testGroup;
    const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;

    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;

    beforeAll(async (done) => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        testUser = await identityService.createIdentityUser();
        apsUser = await identityService.createIdentityUser();

        hrGroup = await groupIdentityService.getGroupInfoByGroupName('hr');
        testGroup = await groupIdentityService.getGroupInfoByGroupName('testgroup');

        const rolesService = new RolesService(apiService);
        const apsAdminRoleId = await rolesService.getRoleIdByRoleName(identityService.ROLES.APS_USER);
        await groupIdentityService.assignRole(testGroup.id, apsAdminRoleId, identityService.ROLES.APS_USER);

        await identityService.addUserToGroup(testUser.idIdentityService, testGroup.id);
        await identityService.addUserToGroup(apsUser.idIdentityService, hrGroup.id);

        await settingsPage.setProviderBpmSso(
            browser.params.config.bpmHost,
            browser.params.config.oauth2.host,
            browser.params.config.identityHost);

        done();
    });

    afterAll(async (done) => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        const tasksService = new TasksService(apiService);

        const bothGroupsTaskId = await tasksService.getTaskId(bothGroupsTaskName, simpleApp);
        await tasksService.deleteTask(bothGroupsTaskId, simpleApp);

        const oneGroupTaskId = await tasksService.getTaskId(oneGroupTaskName, simpleApp);
        await tasksService.deleteTask(oneGroupTaskId, simpleApp);

        await identityService.deleteIdentityUser(apsUser.idIdentityService);
        await identityService.deleteIdentityUser(testUser.idIdentityService);

        done();
    });

    beforeEach(async () => {
        await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        appListCloudComponent.checkAppIsDisplayed(simpleApp);
        appListCloudComponent.goToApp(simpleApp);
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkFormIsDisplayed();
    });

    afterEach(() => {
        navigationBarPage.clickLogoutButton();
    });

    it('[C291954] Should be able to select/delete an group for a standalone task', async () => {
        peopleCloudComponent.clearAssignee();

        groupCloud.searchGroups(testGroup.name);

        groupCloud.checkGroupIsDisplayed(testGroup.name);
        groupCloud.selectGroupFromList(testGroup.name);
        groupCloud.checkSelectedGroup(testGroup.name);

        groupCloud.searchGroups(hrGroup.name);
        groupCloud.checkGroupIsDisplayed(hrGroup.name);
        groupCloud.selectGroupFromList(hrGroup.name);
        groupCloud.checkSelectedGroup(hrGroup.name);

        groupCloud.removeSelectedGroup(testGroup.name);
        groupCloud.checkGroupNotSelected(testGroup.name);

        startTask.addName(oneGroupTaskName);
        startTask.clickStartButton();

        navigationBarPage.clickLogoutButton();
        await loginSSOPage.loginSSOIdentityService(apsUser.email, apsUser.password);
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        appListCloudComponent.checkAppIsDisplayed(simpleApp);
        appListCloudComponent.goToApp(simpleApp);
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

        tasksCloudDemoPage.editTaskFilterCloudComponent()
            .clickCustomiseFilterHeader()
            .clearAssignee()
            .setStatusFilterDropDown('CREATED');

        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(oneGroupTaskName);
    });

    it('[C291955] Should be able to select multiple groups when the selection mode=multiple', async () => {
        peopleCloudComponent.clearAssignee();

        groupCloud.searchGroups(testGroup.name);
        groupCloud.checkGroupIsDisplayed(testGroup.name);
        groupCloud.selectGroupFromList(testGroup.name);
        groupCloud.checkSelectedGroup(testGroup.name);

        groupCloud.searchGroups(hrGroup.name);
        groupCloud.checkGroupIsDisplayed(hrGroup.name);
        groupCloud.selectGroupFromList(hrGroup.name);
        groupCloud.checkSelectedGroup(hrGroup.name);

        startTask.addName(bothGroupsTaskName);
        startTask.clickStartButton();

        navigationBarPage.clickLogoutButton();
        await loginSSOPage.loginSSOIdentityService(apsUser.email, apsUser.password);
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        appListCloudComponent.checkAppIsDisplayed(simpleApp);
        appListCloudComponent.goToApp(simpleApp);
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

        tasksCloudDemoPage.editTaskFilterCloudComponent()
            .clickCustomiseFilterHeader()
            .clearAssignee()
            .setStatusFilterDropDown('CREATED');

        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(bothGroupsTaskName);
    });

    it('[C291993] Should NOT be able to find a group already selected', () => {
        groupCloud.searchGroups(testGroup.name);
        groupCloud.checkGroupIsDisplayed(testGroup.name);
        groupCloud.selectGroupFromList(testGroup.name);
        groupCloud.checkSelectedGroup(testGroup.name);

        groupCloud.searchGroups(testGroup.name);
        groupCloud.checkGroupIsNotDisplayed(testGroup.name);
    });

    it('[C291995] Should be able to add a group previously removed', async () => {
        groupCloud.searchGroups(testGroup.name);
        groupCloud.checkGroupIsDisplayed(testGroup.name);
        groupCloud.selectGroupFromList(testGroup.name);
        groupCloud.checkSelectedGroup(testGroup.name);

        groupCloud.removeSelectedGroup(testGroup.name);
        groupCloud.checkGroupNotSelected(testGroup.name);

        groupCloud.searchGroups(testGroup.name);
        groupCloud.checkGroupIsDisplayed(testGroup.name);
        groupCloud.selectGroupFromList(testGroup.name);
        groupCloud.checkSelectedGroup(testGroup.name);
    });

});
