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
import resources = require('../util/resources');

import { LoginPage } from '../pages/adf/loginPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { TasksListPage } from '../pages/adf/process-services/tasksListPage';
import { TaskDetailsPage } from '../pages/adf/process-services/taskDetailsPage';
import { AppNavigationBarPage } from '../pages/adf/process-services/appNavigationBarPage';
import { AppSettingsToggles } from '../pages/adf/process-services/dialog/appSettingsToggles';
import { TaskFiltersDemoPage } from '../pages/adf/demo-shell/process-services/taskFiltersDemoPage';

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';
import { browser } from 'protractor';

describe('Task', () => {

    describe('Filters', () => {

        let loginPage = new LoginPage();
        let navigationBarPage = new NavigationBarPage();
        let processServicesPage = new ProcessServicesPage();
        let tasksPage = new TasksPage();
        let tasksListPage = new TasksListPage();
        let taskDetailsPage = new TaskDetailsPage();
        let taskFiltersDemoPage = new TaskFiltersDemoPage();

        let app = resources.Files.APP_WITH_DATE_FIELD_FORM;
        let appId, tenantId;

        beforeAll(async (done) => {

            this.alfrescoJsApi = new AlfrescoApi({
                provider: 'BPM',
                hostBpm: TestConfig.adf.url
            });

            done();
        });

        beforeEach(async (done) => {

            let apps = new AppsActions();
            let users = new UsersActions();

            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            let user = await users.createTenantAndUser(this.alfrescoJsApi);

            tenantId = user.tenantId;

            await this.alfrescoJsApi.login(user.email, user.password);

            let appModel = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

            appId = appModel.id;

            loginPage.loginToProcessServicesUsingUserModel(user);

            navigationBarPage.navigateToProcessServicesPage();

            processServicesPage.checkApsContainer();
            processServicesPage.goToApp(app.title);

            done();
        });

        afterEach(async (done) => {

            await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);

            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

            done();
        });

        it('[C279967] Should display default filters when an app is deployed', () => {
            taskFiltersDemoPage.involvedTasksFilter().checkTaskFilterIsDisplayed();
            taskFiltersDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            taskFiltersDemoPage.queuedTasksFilter().checkTaskFilterIsDisplayed();
            taskFiltersDemoPage.completedTasksFilter().checkTaskFilterIsDisplayed();
        });

        it('[C260330] Should display Task Filter List when app is in Task Tab', () => {
            tasksPage.createNewTask().addName('Test').clickStartButton();
            taskFiltersDemoPage.myTasksFilter().clickTaskFilter();
            tasksListPage.checkContentIsDisplayed('Test');
            expect(taskFiltersDemoPage.checkActiveFilterActive()).toBe('My Tasks');
            expect(taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

            taskFiltersDemoPage.queuedTasksFilter().clickTaskFilter();
            expect(taskFiltersDemoPage.checkActiveFilterActive()).toBe('Queued Tasks');
            tasksListPage.checkContentIsNotDisplayed('Test');
            expect(taskDetailsPage.checkTaskDetailsEmpty()).toBeDefined();

            taskFiltersDemoPage.involvedTasksFilter().clickTaskFilter();
            expect(taskFiltersDemoPage.checkActiveFilterActive()).toBe('Involved Tasks');
            tasksListPage.checkContentIsDisplayed('Test');
            expect(taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

            taskFiltersDemoPage.completedTasksFilter().clickTaskFilter();
            expect(taskFiltersDemoPage.checkActiveFilterActive()).toBe('Completed Tasks');
            tasksListPage.checkContentIsNotDisplayed('Test');
            expect(taskDetailsPage.checkTaskDetailsEmpty()).toBeDefined();
        });

        it('[C260348] Should display task in Complete Tasks List when task is completed', () => {
            expect(taskFiltersDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()).toBeDefined();
            expect(taskFiltersDemoPage.queuedTasksFilter().checkTaskFilterIsDisplayed()).toBeDefined();
            expect(taskFiltersDemoPage.involvedTasksFilter().checkTaskFilterIsDisplayed()).toBeDefined();
            expect(taskFiltersDemoPage.completedTasksFilter().checkTaskFilterIsDisplayed).toBeDefined();

            expect(taskFiltersDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()).toBeDefined();
            expect(taskFiltersDemoPage.queuedTasksFilter().checkTaskFilterIsDisplayed()).toBeDefined();
            expect(taskFiltersDemoPage.involvedTasksFilter().checkTaskFilterIsDisplayed).toBeDefined();
            expect(taskFiltersDemoPage.completedTasksFilter().checkTaskFilterIsDisplayed).toBeDefined();

            tasksPage.createNewTask().addName('Test').clickStartButton();
            taskFiltersDemoPage.myTasksFilter().clickTaskFilter();
            tasksListPage.checkContentIsDisplayed('Test');
            expect(taskFiltersDemoPage.checkActiveFilterActive()).toBe('My Tasks');
            expect(taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

            taskFiltersDemoPage.queuedTasksFilter().clickTaskFilter();
            expect(taskFiltersDemoPage.checkActiveFilterActive()).toBe('Queued Tasks');
            expect(tasksListPage.getNoTasksFoundMessage()).toBe('No Tasks Found');
            expect(taskDetailsPage.getEmptyTaskDetailsMessage()).toBe('No task details found');

            taskFiltersDemoPage.involvedTasksFilter().clickTaskFilter();
            expect(taskFiltersDemoPage.checkActiveFilterActive()).toBe('Involved Tasks');
            tasksListPage.checkContentIsDisplayed('Test');
            expect(taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

            taskFiltersDemoPage.completedTasksFilter().clickTaskFilter();
            expect(taskFiltersDemoPage.checkActiveFilterActive()).toBe('Completed Tasks');
            expect(tasksListPage.getNoTasksFoundMessage()).toBe('No Tasks Found');
            expect(taskDetailsPage.getEmptyTaskDetailsMessage()).toBe('No task details found');
        });

        it('[C260349] Should sort task by name when Name sorting is clicked', () => {
            tasksPage.createNewTask().addName('Test1').clickStartButton();
            taskDetailsPage.clickCompleteTask();
            tasksPage.createNewTask().addName('Test2').clickStartButton();
            taskDetailsPage.clickCompleteTask();
            tasksPage.createNewTask().addName('Test3').clickStartButton();

            tasksPage.createNewTask().addName('Test4').clickStartButton();
            tasksListPage.checkContentIsDisplayed('Test4');
            tasksListPage.checkRowIsSelected('Test4');
            tasksListPage.checkContentIsDisplayed('Test3');
            taskDetailsPage.checkTaskDetailsDisplayed();

            tasksPage.clickSortByNameAsc();
            expect(tasksListPage.getDataTable().contentInPosition(1)).toBe('Test3');
            tasksPage.clickSortByNameDesc();
            expect(tasksListPage.getDataTable().contentInPosition(1)).toBe('Test4');

            taskFiltersDemoPage.completedTasksFilter().clickTaskFilter();
            tasksListPage.checkContentIsDisplayed('Test1');
            tasksListPage.checkContentIsDisplayed('Test2');
            expect(tasksListPage.getDataTable().contentInPosition(1)).toBe('Test2');

            tasksPage.clickSortByNameAsc();
            expect(tasksListPage.getDataTable().contentInPosition(1)).toBe('Test1');

            taskFiltersDemoPage.involvedTasksFilter().clickTaskFilter();
            tasksListPage.checkContentIsDisplayed('Test3');
            tasksListPage.checkContentIsDisplayed('Test4');
        });

        it('[C277264] Should display task filter results when task filter is selected', () => {
            tasksPage.createNewTask().addName('Test').clickStartButton();

            taskFiltersDemoPage.myTasksFilter().clickTaskFilter();
            tasksListPage.checkContentIsDisplayed('Test');
            expect(taskDetailsPage.getTaskDetailsTitle()).toBe('Test');
        });
    });

    describe('Custom Filters', () => {

        let loginPage = new LoginPage();
        let navigationBarPage = new NavigationBarPage();
        let processServicesPage = new ProcessServicesPage();
        let appNavigationBarPage = new AppNavigationBarPage();
        let appSettingsToggles = new AppSettingsToggles();
        let taskFiltersDemoPage = new TaskFiltersDemoPage();

        let user;
        let appId;
        let importedApp;

        let taskFilterId;

        let app = resources.Files.APP_WITH_PROCESSES;

        beforeAll(async (done) => {
            let apps = new AppsActions();
            let users = new UsersActions();

            this.alfrescoJsApi = new AlfrescoApi({
                provider: 'BPM',
                hostBpm: TestConfig.adf.url
            });

            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            user = await users.createTenantAndUser(this.alfrescoJsApi);

            await this.alfrescoJsApi.login(user.email, user.password);

            importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

            let appDefinitions = await this.alfrescoJsApi.activiti.appsApi.getAppDefinitions();

            appId = appDefinitions.data.find((currentApp) => {
                return currentApp.modelId === importedApp.id;
            }).id;

            await loginPage.loginToProcessServicesUsingUserModel(user);

            done();

        });

        beforeEach(async () => {
            navigationBarPage.navigateToProcessServicesPage();
            processServicesPage.checkApsContainer();
            processServicesPage.goToApp(app.title);
        });

        it('[C260350] Should display a new filter when a filter is added', () => {
            browser.controlFlow().execute(async () => {
                let newFilter = new this.alfrescoJsApi.activiti.UserProcessInstanceFilterRepresentation();
                newFilter.name = 'New Task Filter';
                newFilter.appId = appId;
                newFilter.icon = 'glyphicon-filter';
                newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };

                let result = await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

                taskFilterId = result.id;
                return result;
            });

            browser.refresh();

            taskFiltersDemoPage.customTaskFilter('New Task Filter').checkTaskFilterIsDisplayed();

            browser.controlFlow().execute(() => {
                let result = this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(taskFilterId);
                return result;
            });
        });

        it('[C286447] Should display the task filter icon when a custom filter is added', () => {
            browser.controlFlow().execute(async () => {
                let newFilter = new this.alfrescoJsApi.activiti.UserProcessInstanceFilterRepresentation();
                newFilter.name = 'New Task Filter with icon';
                newFilter.appId = appId;
                newFilter.icon = 'glyphicon-cloud';
                newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };

                let result = await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

                taskFilterId = result.id;
                return result;
            });

            browser.refresh();
            appNavigationBarPage.clickSettingsButton();
            browser.sleep(500);
            appSettingsToggles.enableTaskFiltersIcon();
            appNavigationBarPage.clickTasksButton();

            taskFiltersDemoPage.customTaskFilter('New Task Filter with icon').checkTaskFilterIsDisplayed();
            expect(taskFiltersDemoPage.customTaskFilter('New Task Filter with icon').getTaskFilterIcon()).toEqual('cloud');

            browser.controlFlow().execute(() => {
                let result = this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(taskFilterId);
                return result;
            });
        });

        it('[C286449] Should display task filter icons only when showIcon property is set on true', () => {
            taskFiltersDemoPage.myTasksFilter().checkTaskFilterHasNoIcon();

            appNavigationBarPage.clickSettingsButton();
            appSettingsToggles.enableTaskFiltersIcon();
            appNavigationBarPage.clickTasksButton();

            taskFiltersDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(taskFiltersDemoPage.myTasksFilter().getTaskFilterIcon()).toEqual('inbox');
        });

        it('[C260353] Should display changes on a filter when this filter is edited', () => {
            browser.controlFlow().execute(async () => {
                let newFilter = new this.alfrescoJsApi.activiti.UserProcessInstanceFilterRepresentation();
                newFilter.name = 'New Task Filter';
                newFilter.appId = appId;
                newFilter.icon = 'glyphicon-filter';
                newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };

                let result = await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

                taskFilterId = result.id;
                return result;
            });

            browser.refresh();

            taskFiltersDemoPage.customTaskFilter('New Task Filter').checkTaskFilterIsDisplayed();

            browser.controlFlow().execute(() => {
                let newFilter = new this.alfrescoJsApi.activiti.UserProcessInstanceFilterRepresentation();
                newFilter.name = 'Task Filter Edited';
                newFilter.appId = appId;
                newFilter.icon = 'glyphicon-filter';
                newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };

                let result = this.alfrescoJsApi.activiti.userFiltersApi.updateUserTaskFilter(taskFilterId, newFilter);
                return result;
            });

            browser.refresh();

            taskFiltersDemoPage.customTaskFilter('Task Filter Edited').checkTaskFilterIsDisplayed();

            browser.controlFlow().execute(() => {
                let result = this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(taskFilterId);
                return result;
            });
        });

        it('[C286448] Should display changes on a task filter when this filter icon is edited', () => {
            browser.controlFlow().execute(async () => {
                let newFilter = new this.alfrescoJsApi.activiti.UserProcessInstanceFilterRepresentation();
                newFilter.name = 'Task Filter Edited icon';
                newFilter.appId = appId;
                newFilter.icon = 'glyphicon-filter';
                newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };

                let result = await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

                taskFilterId = result.id;
                return result;
            });

            browser.refresh();

            taskFiltersDemoPage.customTaskFilter('Task Filter Edited icon').checkTaskFilterIsDisplayed();

            browser.controlFlow().execute(() => {
                let newFilter = new this.alfrescoJsApi.activiti.UserProcessInstanceFilterRepresentation();
                newFilter.name = 'Task Filter Edited icon';
                newFilter.appId = appId;
                newFilter.icon = 'glyphicon-cloud';
                newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };

                let result = this.alfrescoJsApi.activiti.userFiltersApi.updateUserTaskFilter(taskFilterId, newFilter);
                return result;
            });

            browser.refresh();
            appNavigationBarPage.clickSettingsButton();

            browser.sleep(500);

            appSettingsToggles.enableTaskFiltersIcon();
            appNavigationBarPage.clickTasksButton();

            taskFiltersDemoPage.customTaskFilter('Task Filter Edited icon').checkTaskFilterIsDisplayed();
            expect(taskFiltersDemoPage.customTaskFilter('Task Filter Edited icon').getTaskFilterIcon()).toEqual('cloud');
        });

        it('[C260354] Should not display task filter when this filter is deleted', () => {
            browser.controlFlow().execute(async () => {
                let newFilter = new this.alfrescoJsApi.activiti.UserProcessInstanceFilterRepresentation();
                newFilter.name = 'New Task Filter';
                newFilter.appId = appId;
                newFilter.icon = 'glyphicon-filter';
                newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };

                let result = await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

                taskFilterId = result.id;
                return result;
            });

            browser.refresh();

            taskFiltersDemoPage.customTaskFilter('New Task Filter').checkTaskFilterIsDisplayed();

            browser.controlFlow().execute(() => {
                let result = this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(taskFilterId);
                return result;
            });

            browser.refresh();

            taskFiltersDemoPage.customTaskFilter('New Task Filter').checkTaskFilterNotDisplayed();
        });

    });

});
