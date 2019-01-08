/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/tasksCloudDemoPage';
import { AppListCloudComponent } from '../pages/adf/process-cloud/appListCloudComponent';
import { Tasks } from '../actions/APS-cloud/tasks';

describe('Task filters cloud', () => {

    describe('Task Filters', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        let appListCloudComponent = new AppListCloudComponent();
        let tasksCloudDemoPage = new TasksCloudDemoPage();
        const tasksService: Tasks = new Tasks();
        const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;

        const path = '/auth/realms/springboot';
        let silentLogin;
        const newTask = 'newTask', completedTask = 'completedTask1';
        const simpleApp = 'simple-app';

        beforeAll(() => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostSso, TestConfig.adf.hostSso + path, silentLogin);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginAPS(user, password);
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

        it('[C290009] Should display default filters and created task', async() => {
            await tasksService.init(user, password);
            let task =  await tasksService.createStandaloneTask(newTask, simpleApp);
            await tasksService.claimTask(task.entry.id, simpleApp);

            tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.checkActiveFilterActive()).toBe('Completed Tasks');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(newTask);

            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.checkActiveFilterActive()).toBe('My Tasks');

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(newTask);
        });

        it('[C289955] Should display task in Complete Tasks List when task is completed', async() => {
            await tasksService.init(user, password);
            let task = await tasksService.createStandaloneTask(completedTask, simpleApp);

            await tasksService.claimTask(task.entry.id, simpleApp);
            await tasksService.completeTask(task.entry.id, simpleApp);

            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.checkActiveFilterActive()).toBe('My Tasks');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(completedTask);

            tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.checkActiveFilterActive()).toBe('Completed Tasks');

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(completedTask);
        });

    });

});
