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
import resources = require('../util/resources');

import { LoginPage } from '../pages/adf/LoginPage';
import NavigationBarPage = require('../pages/adf/navigationBarPage');
import { ProcessServicesPage } from '../pages/adf/process_services/processServicesPage';
import { TasksPage } from '../pages/adf/process_services/tasksPage';
import TasksListPage = require('../pages/adf/process_services/tasksListPage');
import TaskFiltersPage = require('../pages/adf/process_services/taskFiltersPage');
import { TaskDetailsPage } from '../pages/adf/process_services/taskDetailsPage';
import { AppNavigationBarPage } from '../pages/adf/process_services/appNavigationBarPage';
import { AppSettingsToggles } from '../pages/adf/process_services/dialog/appSettingsToggles';

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
        let taskFiltersPage = new TaskFiltersPage();
        let taskDetailsPage = new TaskDetailsPage();

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

            navigationBarPage.clickProcessServicesButton();

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
            taskFiltersPage.checkTaskFilterDisplayed('Involved Tasks');
            taskFiltersPage.checkTaskFilterDisplayed('My Tasks');
            taskFiltersPage.checkTaskFilterDisplayed('Queued Tasks');
            taskFiltersPage.checkTaskFilterDisplayed('Completed Tasks');
        });

        it('[C260330] Should display Task Filter List when app is in Task Tab', () => {
            tasksPage.clickOnCreateButton();
            taskFiltersPage.clickNewTaskButton();
            tasksPage.createNewTask().addName('Test').clickStartButton();
            taskFiltersPage.clickMyTaskTaskFilter();
            tasksListPage.checkTaskIsDisplayedInTasksList('Test');
            expect(taskFiltersPage.checkActiveFilterActive()).toBe('My Tasks');
            expect(taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

            taskFiltersPage.clickQueuedTaskFilter();
            expect(taskFiltersPage.checkActiveFilterActive()).toBe('Queued Tasks');
            tasksListPage.checkTaskIsNotDisplayedInTasksList('Test');
            expect(taskDetailsPage.checkTaskDetailsEmpty()).toBeDefined();

            taskFiltersPage.clickInvolvedTaskFilter();
            expect(taskFiltersPage.checkActiveFilterActive()).toBe('Involved Tasks');
            tasksListPage.checkTaskIsDisplayedInTasksList('Test');
            expect(taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

            taskFiltersPage.clickCompletedTaskFilter();
            expect(taskFiltersPage.checkActiveFilterActive()).toBe('Completed Tasks');
            tasksListPage.checkTaskIsNotDisplayedInTasksList('Test');
            expect(taskDetailsPage.checkTaskDetailsEmpty()).toBeDefined();
        });

        it('[C260348] Should display task in Complete Tasks List when task is completed', () => {
            expect(taskFiltersPage.checkMyTasksFilter()).toBeDefined();
            expect(taskFiltersPage.checkQueuedTaskFilter()).toBeDefined();
            expect(taskFiltersPage.checkInvolvedTaskFilter()).toBeDefined();
            expect(taskFiltersPage.checkCompletedTaskFilter()).toBeDefined();
            expect(taskFiltersPage.checkTasksAccordionExtended()).toBeDefined();

            taskFiltersPage.clickTasksAccordionButton();
            expect(taskFiltersPage.checkTasksAccordionClosed()).toBeDefined();

            taskFiltersPage.clickTasksAccordionButton();
            expect(taskFiltersPage.checkMyTasksFilter()).toBeDefined();
            expect(taskFiltersPage.checkQueuedTaskFilter()).toBeDefined();
            expect(taskFiltersPage.checkInvolvedTaskFilter()).toBeDefined();
            expect(taskFiltersPage.checkCompletedTaskFilter()).toBeDefined();

            tasksPage.clickOnCreateButton();
            taskFiltersPage.clickNewTaskButton();
            tasksPage.createNewTask().addName('Test').clickStartButton();
            taskFiltersPage.clickMyTaskTaskFilter();
            tasksListPage.checkTaskIsDisplayedInTasksList('Test');
            expect(taskFiltersPage.checkActiveFilterActive()).toBe('My Tasks');
            expect(taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

            taskFiltersPage.clickQueuedTaskFilter();
            expect(taskFiltersPage.checkActiveFilterActive()).toBe('Queued Tasks');
            expect(taskFiltersPage.checkEmptyTaskList()).toBe('No Tasks Found');
            expect(taskFiltersPage.checkEmptyTaskDetails()).toBe('No task details found');

            taskFiltersPage.clickInvolvedTaskFilter();
            expect(taskFiltersPage.checkActiveFilterActive()).toBe('Involved Tasks');
            tasksListPage.checkTaskIsDisplayedInTasksList('Test');
            expect(taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

            taskFiltersPage.clickCompletedTaskFilter();
            expect(taskFiltersPage.checkActiveFilterActive()).toBe('Completed Tasks');
            expect(taskFiltersPage.checkEmptyTaskList()).toBe('No Tasks Found');
            expect(taskFiltersPage.checkEmptyTaskDetails()).toBe('No task details found');
        });

        it('[C260349] Should sort task by name when Name sorting is clicked', () => {
            tasksPage.clickOnCreateButton();
            taskFiltersPage.clickNewTaskButton();
            tasksPage.createNewTask().addName('Test1').clickStartButton();
            taskDetailsPage.clickCompleteTask();
            tasksPage.clickOnCreateButton();
            taskFiltersPage.clickNewTaskButton();
            tasksPage.createNewTask().addName('Test2').clickStartButton();
            taskDetailsPage.clickCompleteTask();
            tasksPage.clickOnCreateButton();
            taskFiltersPage.clickNewTaskButton();
            tasksPage.createNewTask().addName('Test3').clickStartButton();

            tasksPage.clickOnCreateButton();
            taskFiltersPage.clickNewTaskButton();
            tasksPage.createNewTask().addName('Test4').clickStartButton();
            tasksListPage.checkTaskIsDisplayedInTasksList('Test4');
            tasksListPage.checkHighlightedTaskInTasksList('Test4');
            tasksListPage.checkTaskIsDisplayedInTasksList('Test3');
            taskDetailsPage.checkTaskDetailsDisplayed();

            tasksListPage.clickSortByName();
            expect(tasksListPage.firstTaskOnTaskList()).toBe('Test3');
            tasksListPage.clickSortByName();
            expect(tasksListPage.firstTaskOnTaskList()).toBe('Test4');

            taskFiltersPage.clickCompletedTaskFilter();
            tasksListPage.checkTaskIsDisplayedInTasksList('Test1');
            tasksListPage.checkTaskIsDisplayedInTasksList('Test2');
            expect(tasksListPage.firstTaskOnTaskList()).toBe('Test2');

            tasksListPage.clickSortByName();
            expect(tasksListPage.firstTaskOnTaskList()).toBe('Test1');

            taskFiltersPage.clickInvolvedTaskFilter();
            tasksListPage.checkTaskIsDisplayedInTasksList('Test3');
            tasksListPage.checkTaskIsDisplayedInTasksList('Test4');
        });

        it('[C277264] Should display task filter results when task filter is selected', () => {
            tasksPage.clickOnCreateButton();
            taskFiltersPage.clickNewTaskButton();
            tasksPage.createNewTask().addName('Test').clickStartButton();

            taskFiltersPage.clickTaskFilter('My Tasks');
            tasksListPage.checkTaskIsDisplayedInTasksList('Test');
            expect(taskDetailsPage.getTaskDetailsTitle()).toBe('Test');
        });
    });

    describe('Custom Filters', () => {

        let loginPage = new LoginPage();
        let navigationBarPage = new NavigationBarPage();
        let processServicesPage = new ProcessServicesPage();
        let tasksPage = new TasksPage();
        let tasksListPage = new TasksListPage();
        let taskFiltersPage = new TaskFiltersPage();
        let taskDetailsPage = new TaskDetailsPage();
        let appNavigationBarPage = new AppNavigationBarPage();
        let appSettingsToggles = new AppSettingsToggles();

        let tenantId;
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
            tenantId = user.tenantId;

            await this.alfrescoJsApi.login(user.email, user.password);

            importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

            let appDefinitions = await this.alfrescoJsApi.activiti.appsApi.getAppDefinitions();

            appId = appDefinitions.data.find((currentApp) => {
                return currentApp.modelId === importedApp.id;
            }).id;

            await loginPage.loginToProcessServicesUsingUserModel(user);

            done();

        });

        // afterAll(async(done) => {
        //     await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
        //     done();
        // });
        beforeEach(async () => {
            navigationBarPage.clickProcessServicesButton();
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

            taskFiltersPage.checkTaskFilterDisplayed('New Task Filter');

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
            appSettingsToggles.enableTaskFiltersIcon();
            appNavigationBarPage.clickTasksButton();

            taskFiltersPage.checkTaskFilterDisplayed('New Task Filter with icon');
            expect(taskFiltersPage.getTaskFilterIcon('New Task Filter with icon')).toEqual('cloud');

            browser.controlFlow().execute(() => {
                let result = this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(taskFilterId);
                return result;
            });
        });

        it('[C286449] Should display task filter icons only when showIcon property is set on true', () => {
            taskFiltersPage.checkTaskFilterHasNoIcon('My Tasks');

            appNavigationBarPage.clickSettingsButton();
            appSettingsToggles.enableTaskFiltersIcon();
            appNavigationBarPage.clickTasksButton();

            taskFiltersPage.checkTaskFilterDisplayed('My Tasks');
            expect(taskFiltersPage.getTaskFilterIcon('My Tasks')).toEqual('inbox');
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

            taskFiltersPage.checkTaskFilterDisplayed('New Task Filter');

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

            taskFiltersPage.checkTaskFilterDisplayed('Task Filter Edited');

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

            taskFiltersPage.checkTaskFilterDisplayed('Task Filter Edited icon');

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
            appSettingsToggles.enableTaskFiltersIcon();
            appNavigationBarPage.clickTasksButton();

            taskFiltersPage.checkTaskFilterDisplayed('Task Filter Edited icon');
            expect(taskFiltersPage.getTaskFilterIcon('Task Filter Edited icon')).toEqual('cloud');
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

            taskFiltersPage.checkTaskFilterDisplayed('New Task Filter');

            browser.controlFlow().execute(() => {
                let result = this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(taskFilterId);
                return result;
            });

            browser.refresh();

            taskFiltersPage.checkTaskFilterNotDisplayed('New Task Filter');
        });

    });

});
