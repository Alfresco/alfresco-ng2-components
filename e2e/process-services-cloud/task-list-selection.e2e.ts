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

import { ApiService, LoginSSOPage, TasksService, IdentityService, GroupIdentityService } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import { StringUtil } from '@alfresco/adf-testing';

describe('Task list cloud - selection', () => {

    describe('Task list cloud - selection', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const apiService = new ApiService(
            browser.params.config.oauth2.clientId,
            browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
        );

        let tasksService: TasksService;
        let identityService: IdentityService;
        let groupIdentityService: GroupIdentityService;

        const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
        const noOfTasks = 3;
        let response, testUser, groupInfo;
        const tasks = [];

        beforeAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            identityService = new IdentityService(apiService);
            groupIdentityService = new GroupIdentityService(apiService);
            testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);

            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
            await apiService.login(testUser.email, testUser.password);

            tasksService = new  TasksService(apiService);

            for (let i = 0; i < noOfTasks; i++) {
                response = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
                await tasksService.claimTask(response.entry.id, simpleApp);
                tasks.push(response.entry.name);
            }

            await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);

        });

        afterAll(async() => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);

        });

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.disableDisplayTaskDetails();
            await tasksCloudDemoPage.clickAppButton();
        });

        it('[C291914] Should not be able to select any row when selection mode is set to None', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.selectSelectionMode('None');
            await tasksCloudDemoPage.disableDisplayTaskDetails();
            await tasksCloudDemoPage.clickAppButton();
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkNoRowIsSelected();
        });

        it('[C291918] Should be able to select only one row when selection mode is set to Single', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.selectSelectionMode('Single');
            await tasksCloudDemoPage.disableDisplayTaskDetails();
            await tasksCloudDemoPage.clickAppButton();
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[0]);
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(1);

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[1]);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(tasks[1]);
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[1]);
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(1);
        });

        it('[C291919] Should be able to select only one row when selection mode is set to Multiple', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.enableMultiSelection();
            await tasksCloudDemoPage.disableDisplayTaskDetails();
            await tasksCloudDemoPage.clickAppButton();
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[0]);

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[1]);
            await tasksCloudDemoPage.taskListCloudComponent().selectRowWithKeyboard(tasks[1]);
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[1]);
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsNotSelected(tasks[2]);
        });

        it('[C291916] Should be able to select multiple row when multiselect is true', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.disableDisplayTaskDetails();
            await tasksCloudDemoPage.clickAppButton();
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[0]);

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[1]);
            await tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[1]);
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[1]);

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[2]);
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsNotChecked(tasks[2]);
            await tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[1]);
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsNotChecked(tasks[1]);
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[0]);
        });

        it('[C291915] Should be possible select all the rows when multiselect is true', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.disableDisplayTaskDetails();
            await tasksCloudDemoPage.clickAppButton();
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkAllRowsButtonIsDisplayed();
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkAllRows();
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[1]);
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[2]);
        });

        it('[C297472] Should be able to see selected tasks with Multiselection and Testing switched on', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.enableTestingMode();
            await tasksCloudDemoPage.clickAppButton();
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[1]);
            await tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[1]);

            await expect(await tasksCloudDemoPage.getNoOfSelectedRows()).toBe(2);
            await expect(await tasksCloudDemoPage.getSelectedTaskRowText('1')).toBe(tasks[0]);
            await expect(await tasksCloudDemoPage.getSelectedTaskRowText('2')).toBe(tasks[1]);
        });

    });

});
