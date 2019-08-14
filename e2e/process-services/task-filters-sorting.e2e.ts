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
import { TaskFiltersDemoPage } from '../pages/adf/demo-shell/process-services/taskFiltersDemoPage';

import { AlfrescoApiCompatibility as AlfrescoApi, UserProcessInstanceFilterRepresentation } from '@alfresco/js-api';
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';
import { browser } from 'protractor';

describe('Task Filters Sorting', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const tasksPage = new TasksPage();
    const tasksListPage = new TasksListPage();
    const taskDetailsPage = new TaskDetailsPage();
    const taskFiltersDemoPage = new TaskFiltersDemoPage();

    let user;
    let appId;
    let importedApp;

    const app = resources.Files.APP_WITH_PROCESSES;

    const tasks = [
        { name: 'Task 1 Completed', dueDate: '01/01/2019' },
        { name: 'Task 2 Completed', dueDate: '02/01/2019' },
        { name: 'Task 3 Completed', dueDate: '03/01/2019' },
        { name: 'Task 4', dueDate: '01/01/2019' },
        { name: 'Task 5', dueDate: '02/01/2019' },
        { name: 'Task 6', dueDate: '03/01/2019' }];

    beforeAll(async () => {
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

        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await processServicesPage.goToApp(app.title);

        const task = await tasksPage.createNewTask();
        await task.addName(tasks[0].name);
        await task.addDueDate(tasks[0].dueDate);
        await task.clickStartButton();

        await taskDetailsPage.clickCompleteTask();

        const task2 = await tasksPage.createNewTask();

        await task2.addName(tasks[1].name);
        await task2.addDueDate(tasks[1].dueDate);
        await task2.clickStartButton();
        await taskDetailsPage.clickCompleteTask();

        const task3 = await tasksPage.createNewTask();
        await task3.addName(tasks[2].name);
        await task3.addDueDate(tasks[2].dueDate);
        await task3.clickStartButton();
        await taskDetailsPage.clickCompleteTask();

        const task4 = await tasksPage.createNewTask();
        await task4.addName(tasks[3].name);
        await task4.addDueDate(tasks[3].dueDate);
        await task4.clickStartButton();

        const task5 = await tasksPage.createNewTask();
        await task5.addName(tasks[4].name);
        await task5.addDueDate(tasks[4].dueDate);
        await task5.clickStartButton();

        const task6 = await tasksPage.createNewTask();
        await task6.addName(tasks[5].name);
        await task6.addDueDate(tasks[5].dueDate);
        await task6.clickStartButton();

    });

    it('[C277254] Should display tasks under new filter from newest to oldest when they are completed', async () => {
        const newFilter: any = new UserProcessInstanceFilterRepresentation();
        newFilter.name = 'Newest first';
        newFilter.appId = appId;
        newFilter.icon = 'glyphicon-filter';
        newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };

        await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

        await browser.refresh();

        await taskFiltersDemoPage.customTaskFilter('Newest first').clickTaskFilter();

        await expect(await tasksListPage.getDataTable().contentInPosition(1)).toBe(tasks[2].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(2)).toBe(tasks[1].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(3)).toBe(tasks[0].name);

    });

    it('[C277255] Should display tasks under new filter from oldest to newest when they are completed', async () => {
        const newFilter: any = new UserProcessInstanceFilterRepresentation();
        newFilter.name = 'Newest last';
        newFilter.appId = appId;
        newFilter.icon = 'glyphicon-filter';
        newFilter.filter = { sort: 'created-asc', state: 'completed', assignment: 'involved' };

        await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

        await browser.refresh();

        await taskFiltersDemoPage.customTaskFilter('Newest last').clickTaskFilter();

        await expect(await tasksListPage.getDataTable().contentInPosition(1)).toBe(tasks[0].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(2)).toBe(tasks[1].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(3)).toBe(tasks[2].name);
    });

    it('[C277256] Should display tasks under new filter from closest due date to farthest when they are completed', async () => {
        const newFilter: any = new UserProcessInstanceFilterRepresentation();
        newFilter.name = 'Due first';
        newFilter.appId = appId;
        newFilter.icon = 'glyphicon-filter';
        newFilter.filter = { sort: 'due-desc', state: 'completed', assignment: 'involved' };

        await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

        await browser.refresh();

        await taskFiltersDemoPage.customTaskFilter('Due first').clickTaskFilter();

        await expect(await tasksListPage.getDataTable().contentInPosition(1)).toBe(tasks[2].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(2)).toBe(tasks[1].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(3)).toBe(tasks[0].name);
    });

    it('[C277257] Should display tasks under new filter from farthest due date to closest when they are completed', async () => {
        const newFilter: any = new UserProcessInstanceFilterRepresentation();
        newFilter.name = 'Due last';
        newFilter.appId = appId;
        newFilter.icon = 'glyphicon-filter';
        newFilter.filter = { sort: 'due-asc', state: 'completed', assignment: 'involved' };

        await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

        await browser.refresh();

        await taskFiltersDemoPage.customTaskFilter('Due last').clickTaskFilter();

        await expect(await tasksListPage.getDataTable().contentInPosition(1)).toBe(tasks[0].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(2)).toBe(tasks[1].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(3)).toBe(tasks[2].name);
    });

    it('[C277258] Should display tasks under new filter from newest to oldest when they are open  ', async () => {
        const newFilter: any = new UserProcessInstanceFilterRepresentation();
        newFilter.name = 'Newest first Open';
        newFilter.appId = appId;
        newFilter.icon = 'glyphicon-filter';
        newFilter.filter = { sort: 'created-desc', state: 'open', assignment: 'involved' };

        await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

        await browser.refresh();

        await taskFiltersDemoPage.customTaskFilter('Newest first Open').clickTaskFilter();

        await expect(await tasksListPage.getDataTable().contentInPosition(1)).toBe(tasks[5].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(2)).toBe(tasks[4].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(3)).toBe(tasks[3].name);
    });

    it('[C277259] Should display tasks under new filter from oldest to newest when they are open', async () => {
        const newFilter: any = new UserProcessInstanceFilterRepresentation();
        newFilter.name = 'Newest last Open';
        newFilter.appId = appId;
        newFilter.icon = 'glyphicon-filter';
        newFilter.filter = { sort: 'created-asc', state: 'open', assignment: 'involved' };

        await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

        await browser.refresh();

        await taskFiltersDemoPage.customTaskFilter('Newest last Open').clickTaskFilter();

        await expect(await tasksListPage.getDataTable().contentInPosition(1)).toBe(tasks[3].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(2)).toBe(tasks[4].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(3)).toBe(tasks[5].name);
    });

    it('[C277260] Should display tasks under new filter from closest due date to farthest when they are open', async () => {
        const newFilter: any = new UserProcessInstanceFilterRepresentation();
        newFilter.name = 'Due first Open';
        newFilter.appId = appId;
        newFilter.icon = 'glyphicon-filter';
        newFilter.filter = { sort: 'due-desc', state: 'open', assignment: 'involved' };

        await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

        await browser.refresh();

        await taskFiltersDemoPage.customTaskFilter('Due first Open').clickTaskFilter();

        await expect(await tasksListPage.getDataTable().contentInPosition(1)).toBe(tasks[5].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(2)).toBe(tasks[4].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(3)).toBe(tasks[3].name);
    });

    it('[C277261] Should display tasks under new filter from farthest due date to closest when they are open', async () => {
        const newFilter: any = new UserProcessInstanceFilterRepresentation();
        newFilter.name = 'Due last Open';
        newFilter.appId = appId;
        newFilter.icon = 'glyphicon-filter';
        newFilter.filter = { sort: 'due-asc', state: 'open', assignment: 'involved' };

        await this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter);

        await browser.refresh();

        await taskFiltersDemoPage.customTaskFilter('Due last Open').clickTaskFilter();

        await expect(await tasksListPage.getDataTable().contentInPosition(1)).toBe(tasks[3].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(2)).toBe(tasks[4].name);
        await expect(await tasksListPage.getDataTable().contentInPosition(3)).toBe(tasks[5].name);

    });
});
