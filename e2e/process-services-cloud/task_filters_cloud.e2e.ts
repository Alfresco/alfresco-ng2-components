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

import { LoginAPSPage } from '../pages/adf/loginApsPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/tasksCloudDemoPage';
import { AppListCloudComponent } from '../pages/adf/process_cloud/appListCloudComponent';

import { Tasks } from '../actions/APS-cloud/tasks';
import { browser } from 'protractor';

describe('Task filters cloud', () => {

    describe('Filters', () => {
        const settingsPage = new SettingsPage();
        const loginApsPage = new LoginAPSPage();
        const navigationBarPage = new NavigationBarPage();
        let appListCloudComponent = new AppListCloudComponent();
        let tasksCloudDemoPage = new TasksCloudDemoPage();
        const tasksService: Tasks = new Tasks();

        const path = '/auth/realms/springboot';
        let silentLogin;
        const newTask = 'newTask', completedTask = 'completedTask1', myTask = 'myTask';
        const simpleApp = 'simple-app';
        const user = 'devopsuser', password = 'password';

        beforeAll(async () => {
            silentLogin = false;
            await settingsPage.setProviderBpmSso(TestConfig.adf.hostSso, TestConfig.adf.hostSso + path, silentLogin);
            await loginApsPage.clickOnSSOButton();
            browser.ignoreSynchronization = true;
            await loginApsPage.loginAPS(user, password);
        });

        beforeEach(async (done) => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
            done();
        });

        it('[C290011] Should display default filters when an app is deployed', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
        });

        it('[C290009] Should display default filters and created task', async() => {
            await tasksService.init(user, password);
            await tasksService.createStandaloneTask(newTask, simpleApp);

            tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.checkActiveFilterActive()).toBe('Completed Tasks');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(newTask);

            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.checkActiveFilterActive()).toBe('My Tasks');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(newTask);
        });

        // failing due to ACTIVITI-2463
        xit('[C289955] Should display task in Complete Tasks List when task is completed', async() => {
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

        it('[C289957] Should display task filter results when task filter is selected', async () => {
            await tasksService.init(user, password);
            let task = await tasksService.createStandaloneTask(myTask, simpleApp);

            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.checkActiveFilterActive()).toBe('My Tasks');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(myTask);
        });
    });

});
