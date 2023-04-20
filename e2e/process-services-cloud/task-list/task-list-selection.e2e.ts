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

import { createApiService,
    AppListCloudPage,
    GroupIdentityService,
    IdentityService,
    LoginPage,
    StringUtil,
    TasksService
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('Task list cloud - selection', () => {

    describe('Task list cloud - selection', () => {

        const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

        const loginSSOPage = new LoginPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const taskFilter = tasksCloudDemoPage.taskFilterCloudComponent;

        const apiService = createApiService();
        const identityService = new IdentityService(apiService);
        const groupIdentityService = new GroupIdentityService(apiService);
        const tasksService = new TasksService(apiService);

        const noOfTasks = 3;
        let response; let testUser; let groupInfo;
        const tasks = [];

        beforeAll(async () => {
            await apiService.loginWithProfile('identityAdmin');

            testUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);

            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
            await apiService.login(testUser.username, testUser.password);

            for (let i = 0; i < noOfTasks; i++) {
                response = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
                await tasksService.claimTask(response.entry.id, simpleApp);
                tasks.push(response.entry.name);
            }

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
            await taskFilter.checkTaskFilterIsDisplayed('my-tasks');
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.disableDisplayTaskDetails();
            await tasksCloudDemoPage.clickAppButton();
        });

        it('[C291914] Should not be able to select any row when selection mode is set to None', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.selectSelectionMode('None');
            await tasksCloudDemoPage.disableDisplayTaskDetails();
            await tasksCloudDemoPage.clickAppButton();
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkNoRowIsSelected();
        });

        it('[C291918] Should be able to select only one row when selection mode is set to Single', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.selectSelectionMode('Single');
            await tasksCloudDemoPage.disableDisplayTaskDetails();
            await tasksCloudDemoPage.clickAppButton();
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();

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
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();

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
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();

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
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();

            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkAllRowsButtonIsDisplayed();
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkAllRows();
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[0]);
            await tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[1]);
            await tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[2]);
        });

        it('[C297472] Should be able to see selected tasks with Multiselection and Testing switched on', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.enableMultiSelection();
            await tasksCloudDemoPage.enableTestingMode();
            await tasksCloudDemoPage.clickAppButton();
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();

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
