/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { createApiService, ApplicationsUtil, LoginPage, ModelsActions, UserModel, UsersActions } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ProcessServicesPage } from '../pages/process-services.page';
import { TasksPage } from '../pages/tasks.page';
import { TasksListPage } from '../pages/tasks-list.page';
import { TaskDetailsPage } from '../pages/task-details.page';
import { TaskFiltersDemoPage } from '../pages/task-filters-demo.page';
import { browser } from 'protractor';

describe('Task', () => {
    const app = browser.params.resources.Files.APP_WITH_DATE_FIELD_FORM;

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const tasksPage = new TasksPage();
    const tasksListPage = new TasksListPage();
    const taskDetailsPage = new TaskDetailsPage();
    const taskFiltersDemoPage = new TaskFiltersDemoPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const modelsActions = new ModelsActions(apiService);

    let appId: number;
    let user: UserModel;

    beforeEach(async () => {
        await apiService.loginWithProfile('admin');
        user = await usersActions.createUser();

        await apiService.login(user.username, user.password);
        const applicationsService = new ApplicationsUtil(apiService);
        const { id } = await applicationsService.importPublishDeployApp(app.file_path);
        appId = id;

        await loginPage.login(user.username, user.password);
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await processServicesPage.goToApp(app.title);
    });

    afterEach(async () => {
        await modelsActions.deleteModel(appId);
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(user.tenantId);
        await navigationBarPage.clickLogoutButton();
    });

    it('[C279967] Should display default filters when an app is deployed', async () => {
        await taskFiltersDemoPage.involvedTasksFilter().checkTaskFilterIsDisplayed();
        await taskFiltersDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
        await taskFiltersDemoPage.queuedTasksFilter().checkTaskFilterIsDisplayed();
        await taskFiltersDemoPage.completedTasksFilter().checkTaskFilterIsDisplayed();
    });

    it('[C260330] Should display Task Filter List when app is in Task Tab', async () => {
        await tasksPage.createTask({ name: 'Test' });
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
        await taskFiltersDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
        await taskFiltersDemoPage.queuedTasksFilter().checkTaskFilterIsDisplayed();
        await taskFiltersDemoPage.involvedTasksFilter().checkTaskFilterIsDisplayed();
        await taskFiltersDemoPage.completedTasksFilter().checkTaskFilterIsDisplayed();

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
        await tasksPage.createTask({ name: 'Test1' });
        await taskDetailsPage.clickCompleteTask();

        await tasksPage.createTask({ name: 'Test2' });
        await taskDetailsPage.clickCompleteTask();

        await tasksPage.createTask({ name: 'Test3' });
        await tasksPage.createTask({ name: 'Test4' });

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
        await tasksPage.createTask({ name: 'Test' });

        await taskFiltersDemoPage.myTasksFilter().clickTaskFilter();
        await tasksListPage.checkContentIsDisplayed('Test');
        expect(await taskDetailsPage.getTaskDetailsTitle()).toBe('Test');
    });
});
