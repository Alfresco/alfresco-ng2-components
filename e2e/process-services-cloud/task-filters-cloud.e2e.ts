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
import { LoginSSOPage, TasksService, ApiService, AppListCloudPage, StringUtil, SettingsPage, IdentityService, RolesService, GroupIdentityService } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import resources = require('../util/resources');
import CONSTANTS = require('../util/constants');

describe('Task filters cloud', () => {

    describe('Task Filters', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const settingsPage = new SettingsPage();
        let tasksService: TasksService;
        let identityService: IdentityService;
        let rolesService: RolesService;
        let groupIdentityService: GroupIdentityService;
        let testUser, apsUserRoleId, groupInfo;
        const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, 'BPM');

        const newTask = StringUtil.generateRandomString(5), completedTask = StringUtil.generateRandomString(5);
        const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;

        beforeAll(async(done) => {

            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            identityService = new IdentityService(apiService);
            groupIdentityService = new GroupIdentityService(apiService);
            rolesService = new RolesService(apiService);
            testUser = await identityService.createIdentityUser();
            apsUserRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.APS_USER);
            await identityService.assignRole(testUser.idIdentityService, apsUserRoleId, CONSTANTS.ROLES.APS_USER);
            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

            await apiService.login(testUser.email, testUser.password);
            await settingsPage.setProviderBpmSso(
                browser.params.config.bpmHost,
                browser.params.config.oauth2.host,
                browser.params.config.identityHost);
            loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
            done();
        });

        afterAll(async(done) => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);
            done();
        });

        beforeEach(() => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
        });

        it('[C290011] Should display default filters when an app is deployed', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            tasksCloudDemoPage.completedTasksFilter().checkTaskFilterIsDisplayed();
        });

        it('[C290009] Should display default filters and created task', async () => {
            tasksService = new TasksService(apiService);

            const task = await tasksService.createStandaloneTask(newTask, simpleApp);
            await tasksService.claimTask(task.entry.id, simpleApp);

            tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('Completed Tasks');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(newTask);

            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(newTask);
        });

        it('[C289955] Should display task in Complete Tasks List when task is completed', async () => {
            tasksService = new TasksService(apiService);

            const toBeCompletedTask = await tasksService.createStandaloneTask(completedTask, simpleApp);
            await tasksService.claimTask(toBeCompletedTask.entry.id, simpleApp);
            await tasksService.completeTask(toBeCompletedTask.entry.id, simpleApp);

            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTask);

            tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('Completed Tasks');

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTask);
        });

        it('[C291792] Should select the first task filter from the list as default', () => {

            expect(tasksCloudDemoPage.firstFilterIsActive()).toBe(true);
        });

    });

});
