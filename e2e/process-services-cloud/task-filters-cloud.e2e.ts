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

import { LoginSSOPage, TasksService, ApiService } from '@alfresco/adf-testing';
import { SettingsPage } from '../pages/adf/settingsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import { StringUtil } from '@alfresco/adf-testing';
import { browser } from 'protractor';

describe('Task filters cloud', () => {

    describe('Task Filters', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        let appListCloudComponent = new AppListCloudPage();
        let tasksCloudDemoPage = new TasksCloudDemoPage();
        let tasksService: TasksService;
        const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;

        let silentLogin;
        const newTask = StringUtil.generateRandomString(5), completedTask = StringUtil.generateRandomString(5);
        const simpleApp = 'simple-app';

        beforeAll(() => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            browser.ignoreSynchronization = true;
            loginSSOPage.loginSSOIdentityService(user, password);
        });

        beforeEach((done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            done();
        });

        it('[C290011] Should display default filters when an app is deployed', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            tasksCloudDemoPage.completedTasksFilter().checkTaskFilterIsDisplayed();
        });

        it('[C290009] Should display default filters and created task', async () => {
            const apiService = new ApiService('activiti', TestConfig.adf.url, TestConfig.adf.hostSso, 'BPM');
            await apiService.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            tasksService = new TasksService(apiService);

            let task = await tasksService.createStandaloneTask(newTask, simpleApp);
            await tasksService.claimTask(task.entry.id, simpleApp);

            tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('Completed Tasks');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(newTask);

            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(newTask);
        });

        it('[C289955] Should display task in Complete Tasks List when task is completed', async () => {
            const apiService = new ApiService('activiti', TestConfig.adf.url, TestConfig.adf.hostSso, 'BPM');
            await apiService.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            tasksService = new TasksService(apiService);

            let task = await tasksService.createStandaloneTask(completedTask, simpleApp);

            await tasksService.claimTask(task.entry.id, simpleApp);
            await tasksService.completeTask(task.entry.id, simpleApp);

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
