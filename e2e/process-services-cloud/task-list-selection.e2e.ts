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

import { LoginSSOPage } from '../pages/adf/loginSSOPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudComponent } from '../pages/adf/process-cloud/appListCloudComponent';
import { TaskListCloudConfiguration } from './taskListCloud.config';

import { Util } from '../util/util';
import moment = require('moment');

import { Tasks } from '../actions/APS-cloud/tasks';
describe('Task list cloud - selection', () => {

    describe('Task list cloud - selection', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        let appListCloudComponent = new AppListCloudComponent();
        let tasksCloudDemoPage = new TasksCloudDemoPage();

        const tasksService: Tasks = new Tasks();

        let silentLogin;
        const simpleApp = 'simple-app';
        const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
        let noOfTasks = 3, response;
        let tasks = [];

        beforeAll(async (done) => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginAPS(user, password);

            await tasksService.init(user, password);
            for (let i = 0; i < noOfTasks; i++) {
                response = await tasksService.createStandaloneTask(Util.generateRandomString(), simpleApp);
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

        it('[C291914] Should not be able to select any row when selection mode is set to None', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('None');
            tasksCloudDemoPage.clickAppButton();

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().selectRowByRowName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkNoRowIsSelected();
        });

        it('[C291918] Should be able to select only one row when selection mode is set to Single', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('Single');
            tasksCloudDemoPage.clickAppButton();

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().selectRowByRowName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsSelectedByName(tasks[0]);
            expect(tasksCloudDemoPage.taskListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(1);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().selectRowByRowName(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsSelectedByName(tasks[1]);
            expect(tasksCloudDemoPage.taskListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(1);
        });

        it('[C291919] Should be able to select only one row when selection mode is set to Multiple', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('Multiple');
            tasksCloudDemoPage.clickAppButton();

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().selectRowByRowName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsSelectedByName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().selectRowByNameWithKeyboard(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsSelectedByName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsSelectedByName(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsNotSelectedByName(tasks[2]);
        });

        it('[C291916] Should be able to select multiple row when multiselect is true', () => {
            tasksCloudDemoPage.clickSettingsButton().enableMultiSelection();
            tasksCloudDemoPage.clickAppButton();

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().clickCheckboxByName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsCheckedByName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().clickCheckboxByName(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsCheckedByName(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsNotCheckedByName(tasks[2]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().clickCheckboxByName(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsNotCheckedByName(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsCheckedByName(tasks[0]);
        });

        it('[C291915] Should be possible select all the rows when multiselect is true', () => {
            tasksCloudDemoPage.clickSettingsButton().enableMultiSelection();
            tasksCloudDemoPage.clickAppButton();

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkAllRowsButtonIsDisplayed().checkAllRows();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsCheckedByName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().clickCheckboxByName(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsCheckedByName(tasks[2]);
        });

    });

});
