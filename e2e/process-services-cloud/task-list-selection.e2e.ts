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

import TestConfig = require('../test.config');

import { ApiService, LoginSSOPage, TasksService } from '@alfresco/adf-testing';
import { SettingsPage } from '../pages/adf/settingsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import { StringUtil } from '@alfresco/adf-testing';
import { browser } from 'protractor';

describe('Task list cloud - selection', () => {

    describe('Task list cloud - selection', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        let appListCloudComponent = new AppListCloudPage();
        let tasksCloudDemoPage = new TasksCloudDemoPage();

        let tasksService: TasksService;

        let silentLogin;
        const simpleApp = 'simple-app';
        const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
        let noOfTasks = 3, response;
        let tasks = [];

        beforeAll(async (done) => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            browser.ignoreSynchronization = true;
            loginSSOPage.loginSSOIdentityService(user, password);

            const apiService = new ApiService('activiti', TestConfig.adf.url, TestConfig.adf.hostSso, 'BPM');
            await apiService.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            tasksService = new  TasksService(apiService);

            for (let i = 0; i < noOfTasks; i++) {
                response = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
                await tasksService.claimTask(response.entry.id, simpleApp);
                tasks.push(response.entry.name);
            }

            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            tasksCloudDemoPage.clickSettingsButton().disableDisplayTaskDetails();
            tasksCloudDemoPage.clickAppButton();
            done();
        });

        afterEach(async (done) => {
            await browser.refresh();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
            done();
        });

        it('[C291914] Should not be able to select any row when selection mode is set to None', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('None');
            tasksCloudDemoPage.clickSettingsButton().disableDisplayTaskDetails();
            tasksCloudDemoPage.clickAppButton();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().selectRow(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkNoRowIsSelected();
        });

        it('[C291918] Should be able to select only one row when selection mode is set to Single', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('Single');
            tasksCloudDemoPage.clickSettingsButton().disableDisplayTaskDetails();
            tasksCloudDemoPage.clickAppButton();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().selectRow(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[0]);
            expect(tasksCloudDemoPage.taskListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(1);

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().selectRow(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[1]);
            expect(tasksCloudDemoPage.taskListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(1);
        });

        it('[C291919] Should be able to select only one row when selection mode is set to Multiple', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('Multiple');
            tasksCloudDemoPage.clickSettingsButton().disableDisplayTaskDetails();
            tasksCloudDemoPage.clickAppButton();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().selectRow(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[0]);

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().selectRowWithKeyboard(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsNotSelected(tasks[2]);
        });

        it('[C291916] Should be able to select multiple row when multiselect is true', () => {
            tasksCloudDemoPage.clickSettingsButton().enableMultiSelection();
            tasksCloudDemoPage.clickSettingsButton().disableDisplayTaskDetails();
            tasksCloudDemoPage.clickAppButton();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[0]);

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[1]);

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[2]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsNotChecked(tasks[2]);
            tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsNotChecked(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[0]);
        });

        it('[C291915] Should be possible select all the rows when multiselect is true', () => {
            tasksCloudDemoPage.clickSettingsButton().enableMultiSelection();
            tasksCloudDemoPage.clickSettingsButton().disableDisplayTaskDetails();
            tasksCloudDemoPage.clickAppButton();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            tasksCloudDemoPage.taskListCloudComponent().getDataTable()
                .checkAllRowsButtonIsDisplayed()
                .checkAllRows();
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[2]);
        });

    });

});
