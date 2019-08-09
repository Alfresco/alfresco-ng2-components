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

import resources = require('../util/resources');

import { LoginPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { TasksListPage } from '../pages/adf/process-services/tasksListPage';
import { TaskDetailsPage } from '../pages/adf/process-services/taskDetailsPage';
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/processServiceTabBarPage';
import { AppSettingsToggles } from '../pages/adf/process-services/dialog/appSettingsToggles';
import { TaskFiltersDemoPage } from '../pages/adf/demo-shell/process-services/taskFiltersDemoPage';

import { AlfrescoApiCompatibility as AlfrescoApi, UserProcessInstanceFilterRepresentation } from '@alfresco/js-api';
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';
import { browser } from 'protractor';

describe('Task', () => {

    describe('Filters', () => {

        const loginPage = new LoginPage();
        const navigationBarPage = new NavigationBarPage();
        const processServicesPage = new ProcessServicesPage();
        const tasksPage = new TasksPage();
        const tasksListPage = new TasksListPage();
        const taskDetailsPage = new TaskDetailsPage();
        const taskFiltersDemoPage = new TaskFiltersDemoPage();

        const app = resources.Files.APP_WITH_DATE_FIELD_FORM;
        let appId, tenantId;

        beforeAll(async (done) => {

            this.alfrescoJsApi = new AlfrescoApi({
                provider: 'BPM',
                hostBpm: browser.params.testConfig.adf_aps.host
            });

            done();
        });

        beforeEach(async (done) => {

            const apps = new AppsActions();
            const users = new UsersActions();

            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

            const user = await users.createTenantAndUser(this.alfrescoJsApi);

            tenantId = user.tenantId;

            await this.alfrescoJsApi.login(user.email, user.password);

            const appModel = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

            appId = appModel.id;

            await loginPage.loginToProcessServicesUsingUserModel(user);

            await navigationBarPage.navigateToProcessServicesPage();

            await processServicesPage.checkApsContainer();
            await processServicesPage.goToApp(app.title);

            done();
        });

        afterEach(async (done) => {

            await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);

            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

            await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

            done();
        });

        it('[C279967] Should display default filters when an app is deployed', async () => {
            await taskFiltersDemoPage.involvedTasksFilter().checkTaskFilterIsDisplayed();
            await taskFiltersDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await taskFiltersDemoPage.queuedTasksFilter().checkTaskFilterIsDisplayed();
            await taskFiltersDemoPage.completedTasksFilter().checkTaskFilterIsDisplayed();
        });

        it('[C260330] Should display Task Filter List when app is in Task Tab', async () => {
            const task = await tasksPage.createNewTask();
            await task.addName('Test');
            await task.clickStartButton();
            await taskFiltersDemoPage.myTasksFilter().clickTaskFilter();
            await tasksListPage.checkContentIsDisplayed('Test');
            expect(await taskFiltersDemoPage.checkActiveFilterActive()).toBe('My Tasks');
            expect(await taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

            await taskFiltersDemoPage.queuedTasksFilter().clickTaskFilter();
            expect(await taskFiltersDemoPage.checkActiveFilterActive()).toBe('Queued Tasks');
            await tasksListPage.checkContentIsNotDisplayed('Test');
            expect(await taskDetailsPage.checkTaskDetailsEmpty()).toBeDefined();

            await taskFiltersDemoPage.involvedTasksFilter().clickTaskFilter();
            expect(await taskFiltersDemoPage.checkActiveFilterActive()).toBe('Involved Tasks');
            await tasksListPage.checkContentIsDisplayed('Test');
            expect(await taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

            await taskFiltersDemoPage.completedTasksFilter().clickTaskFilter();
            expect(await taskFiltersDemoPage.checkActiveFilterActive()).toBe('Completed Tasks');
            await tasksListPage.checkContentIsNotDisplayed('Test');
            expect(await taskDetailsPage.checkTaskDetailsEmpty()).toBeDefined();
        });

        it('[C260348] Should display task in Complete Tasks List when task is completed', async () => {
            expect(await taskFiltersDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()).toBeDefined();
            expect(await taskFiltersDemoPage.queuedTasksFilter().checkTaskFilterIsDisplayed()).toBeDefined();
            expect(await taskFiltersDemoPage.involvedTasksFilter().checkTaskFilterIsDisplayed()).toBeDefined();
            expect(await taskFiltersDemoPage.completedTasksFilter().checkTaskFilterIsDisplayed).toBeDefined();

            expect(await taskFiltersDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()).toBeDefined();
            expect(await taskFiltersDemoPage.queuedTasksFilter().checkTaskFilterIsDisplayed()).toBeDefined();
            expect(await taskFiltersDemoPage.involvedTasksFilter().checkTaskFilterIsDisplayed).toBeDefined();
            expect(await taskFiltersDemoPage.completedTasksFilter().checkTaskFilterIsDisplayed).toBeDefined();

            const task = await tasksPage.createNewTask();
            await task.addName('Test');
            await task.clickStartButton();
            await taskFiltersDemoPage.myTasksFilter().clickTaskFilter();
            await tasksListPage.checkContentIsDisplayed('Test');
            expect(await taskFiltersDemoPage.checkActiveFilterActive()).toBe('My Tasks');
            expect(await taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

            await taskFiltersDemoPage.queuedTasksFilter().clickTaskFilter();
            expect(await taskFiltersDemoPage.checkActiveFilterActive()).toBe('Queued Tasks');
            expect(await tasksListPage.getNoTasksFoundMessage()).toBe('No Tasks Found');
            expect(await taskDetailsPage.getEmptyTaskDetailsMessage()).toBe('No task details found');

            await taskFiltersDemoPage.involvedTasksFilter().clickTaskFilter();
            expect(await taskFiltersDemoPage.checkActiveFilterActive()).toBe('Involved Tasks');
            await tasksListPage.checkContentIsDisplayed('Test');
            expect(await taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

            await taskFiltersDemoPage.completedTasksFilter().clickTaskFilter();
            expect(await taskFiltersDemoPage.checkActiveFilterActive()).toBe('Completed Tasks');
            expect(await tasksListPage.getNoTasksFoundMessage()).toBe('No Tasks Found');
            expect(await taskDetailsPage.getEmptyTaskDetailsMessage()).toBe('No task details found');
        });

        it('[C260349] Should sort task by name when Name sorting is clicked', async () => {
            const task = await tasksPage.createNewTask();
            await task.addName('Test1');
            await task.clickStartButton();

            await taskDetailsPage.clickCompleteTask();

            const task2 = await tasksPage.createNewTask();
            await task2.addName('Test2');
            await task2.clickStartButton();

            await taskDetailsPage.clickCompleteTask();

            const task3 = await tasksPage.createNewTask();
            await task3.addName('Test3');
            await task3.clickStartButton();

            const task4 = await tasksPage.createNewTask();
            await task4.addName('Test4');
            await task4.clickStartButton();

            await tasksListPage.checkContentIsDisplayed('Test4');
            await tasksListPage.checkRowIsSelected('Test4');
            await tasksListPage.checkContentIsDisplayed('Test3');
            await taskDetailsPage.checkTaskDetailsDisplayed();

            await tasksPage.clickSortByNameAsc();
            expect(await tasksListPage.getDataTable().contentInPosition(1)).toBe('Test3');
            await tasksPage.clickSortByNameDesc();
            expect(await tasksListPage.getDataTable().contentInPosition(1)).toBe('Test4');

            await taskFiltersDemoPage.completedTasksFilter().clickTaskFilter();
            await tasksListPage.checkContentIsDisplayed('Test1');
            await tasksListPage.checkContentIsDisplayed('Test2');
            expect(await tasksListPage.getDataTable().contentInPosition(1)).toBe('Test2');

            await tasksPage.clickSortByNameAsc();
            expect(await tasksListPage.getDataTable().contentInPosition(1)).toBe('Test1');

            await taskFiltersDemoPage.involvedTasksFilter().clickTaskFilter();
            await tasksListPage.checkContentIsDisplayed('Test3');
            await tasksListPage.checkContentIsDisplayed('Test4');
        });

        it('[C277264] Should display task filter results when task filter is selected', async () => {
            const task = await tasksPage.createNewTask();
            await task.addName('Test');
            await task.clickStartButton();

            await taskFiltersDemoPage.myTasksFilter().clickTaskFilter();
            await tasksListPage.checkContentIsDisplayed('Test');
            expect(await taskDetailsPage.getTaskDetailsTitle()).toBe('Test');
        });
    });

    describe('Custom Filters', () => {

        const loginPage = new LoginPage();
        const navigationBarPage = new NavigationBarPage();
        const processServicesPage = new ProcessServicesPage();
        const processServiceTabBarPage = new ProcessServiceTabBarPage();
        const appSettingsToggles = new AppSettingsToggles();
        const taskFiltersDemoPage = new TaskFiltersDemoPage();

        let user;
        let appId;
        let importedApp;

        let taskFilterId;

        const app = resources.Files.APP_WITH_PROCESSES;

        beforeAll(async (done) => {
            const apps = new AppsActions();
            const users = new UsersActions();

            this.alfrescoJsApi = new AlfrescoApi({
                provider: 'BPM',
                hostBpm: browser.params.testConfig.adf_aps.host
            });

            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

            user = await users.createTenantAndUser(this.alfrescoJsApi);

            await this.alfrescoJsApi.login(user.email, user.password);

            importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

            const appDefinitions = await this.alfrescoJsApi.activiti.appsApi.getAppDefinitions();

            appId = appDefinitions.data.find((currentApp) => {
                return currentApp.modelId === importedApp.id;
            }).id;

            await loginPage.loginToProcessServicesUsingUserModel(user);

            done();

        });

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesPage();
            await processServicesPage.checkApsContainer();
            await processServicesPage.goToApp(app.title);
        });

        it('[C260350] Should display a new filter when a filter is added', async () => {
            const newFilter: any = new UserProcessInstanceFilterRepresentation();
            newFilter.name = 'New Task Filter';
            newFilter.appId = appId;
            newFilter.icon = 'glyphicon-filter';
            newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };

            const result = await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

            taskFilterId = result.id;

            await browser.refresh();

            await taskFiltersDemoPage.customTaskFilter('New Task Filter').checkTaskFilterIsDisplayed();

            await this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(taskFilterId);
        });

        it('[C286447] Should display the task filter icon when a custom filter is added', async () => {
            const newFilter: any = new UserProcessInstanceFilterRepresentation();
            newFilter.name = 'New Task Filter with icon';
            newFilter.appId = appId;
            newFilter.icon = 'glyphicon-cloud';
            newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };

            const result = await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

            taskFilterId = result.id;

            await browser.refresh();
            await processServiceTabBarPage.clickSettingsButton();
            await browser.sleep(500);
            await appSettingsToggles.enableTaskFiltersIcon();
            await processServiceTabBarPage.clickTasksButton();

            await taskFiltersDemoPage.customTaskFilter('New Task Filter with icon').checkTaskFilterIsDisplayed();
            expect(await taskFiltersDemoPage.customTaskFilter('New Task Filter with icon').getTaskFilterIcon()).toEqual('cloud');

            await this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(taskFilterId);
        });

        it('[C286449] Should display task filter icons only when showIcon property is set on true', async () => {
            await taskFiltersDemoPage.myTasksFilter().checkTaskFilterHasNoIcon();

            await processServiceTabBarPage.clickSettingsButton();
            await appSettingsToggles.enableTaskFiltersIcon();
            await processServiceTabBarPage.clickTasksButton();

            await taskFiltersDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(await taskFiltersDemoPage.myTasksFilter().getTaskFilterIcon()).toEqual('inbox');
        });

        it('[C260353] Should display changes on a filter when this filter is edited', async () => {
            const newFilter: any = new UserProcessInstanceFilterRepresentation();
            newFilter.name = 'New Task Filter';
            newFilter.appId = appId;
            newFilter.icon = 'glyphicon-filter';
            newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };

            const result = await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

            taskFilterId = result.id;

            await browser.refresh();

            await taskFiltersDemoPage.customTaskFilter('New Task Filter').checkTaskFilterIsDisplayed();

            const newFilter2: any = new UserProcessInstanceFilterRepresentation();
            newFilter.name = 'Task Filter Edited';
            newFilter.appId = appId;
            newFilter.icon = 'glyphicon-filter';
            newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };

            const result2 = await this.alfrescoJsApi.activiti.userFiltersApi.updateUserTaskFilter(taskFilterId, newFilter2);

            await browser.refresh();

            await taskFiltersDemoPage.customTaskFilter('Task Filter Edited').checkTaskFilterIsDisplayed();

            await this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(result.id);
            await this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(result2.id);
        });

        it('[C286448] Should display changes on a task filter when this filter icon is edited', async () => {
            const newFilter: any = new UserProcessInstanceFilterRepresentation();
            newFilter.name = 'Task Filter Edited icon';
            newFilter.appId = appId;
            newFilter.icon = 'glyphicon-filter';
            newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };

            const result = await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

            taskFilterId = result.id;

            await browser.refresh();

            await taskFiltersDemoPage.customTaskFilter('Task Filter Edited icon').checkTaskFilterIsDisplayed();

            const newFilter2: any = new UserProcessInstanceFilterRepresentation();
            newFilter.name = 'Task Filter Edited icon';
            newFilter.appId = appId;
            newFilter.icon = 'glyphicon-cloud';
            newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };

            const result2 = this.alfrescoJsApi.activiti.userFiltersApi.updateUserTaskFilter(taskFilterId, newFilter2);

            await browser.refresh();
            await processServiceTabBarPage.clickSettingsButton();

            await browser.sleep(500);

            await appSettingsToggles.enableTaskFiltersIcon();
            await processServiceTabBarPage.clickTasksButton();

            await taskFiltersDemoPage.customTaskFilter('Task Filter Edited icon').checkTaskFilterIsDisplayed();
            expect(await taskFiltersDemoPage.customTaskFilter('Task Filter Edited icon').getTaskFilterIcon()).toEqual('cloud');

            await this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(result.id);
            await this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(result2.id);
        });

        it('[C260354] Should not display task filter when this filter is deleted', async () => {
            const newFilter: any = new UserProcessInstanceFilterRepresentation();
            newFilter.name = 'New Task Filter';
            newFilter.appId = appId;
            newFilter.icon = 'glyphicon-filter';
            newFilter.filter = <any> { sort: 'created-desc', state: 'completed', assignment: 'involved' };

            const result = await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

            taskFilterId = result.id;

            await browser.refresh();

            await taskFiltersDemoPage.customTaskFilter('New Task Filter').checkTaskFilterIsDisplayed();

            const result2 = await this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(taskFilterId);

            await browser.refresh();

            await taskFiltersDemoPage.customTaskFilter('New Task Filter').checkTaskFilterNotDisplayed();

            await this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(result.id);
            await this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(result2.id);

        });

    });

});
