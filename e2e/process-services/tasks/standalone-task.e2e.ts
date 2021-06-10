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

import { browser } from 'protractor';

import { ApiService, createApiService, ApplicationsUtil, LoginPage, UsersActions } from '@alfresco/adf-testing';
import { TasksPage } from './../pages/tasks.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import CONSTANTS = require('../../util/constants');
import Task = require('../../models/APS/Task');
import { TaskActionsApi, TasksApi } from '@alfresco/js-api';

describe('Start Task - Task App', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const taskPage = new TasksPage();

    let processUserModel;
    const noFormMessage = 'No forms attached';

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationUtil = new ApplicationsUtil(apiService);
    const tasksApi = new TasksApi(apiService.getInstance());
    const taskActionsApi = new TaskActionsApi(apiService.getInstance());

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        processUserModel = await usersActions.createUser();

        await apiService.login(processUserModel.username, processUserModel.password);

        await applicationUtil.importApplication(app.file_path);

        await loginPage.login(processUserModel.username, processUserModel.password);
    });

    beforeEach(async () => {
        await browser.refresh();
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
    });

    it('[C260421] Should a standalone task be displayed when creating a new task without form', async () => {
        const task = await taskPage.createNewTask();
        await task.addName('Standalone task');
        await task.clickStartButton();
        await taskPage.tasksListPage().checkContentIsDisplayed('Standalone task');
        await taskPage.taskDetails().noFormIsDisplayed();

        const taskDetails = await taskPage.taskDetails();
        await taskDetails.checkCompleteTaskButtonIsDisplayed();
        await taskDetails.checkCompleteTaskButtonIsEnabled();
        await taskPage.taskDetails().checkAttachFormButtonIsDisplayed();
        await taskPage.taskDetails().checkAttachFormButtonIsEnabled();
        await taskPage.taskDetails().waitFormNameEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
        await expect(await taskDetails.getNoFormMessage()).toEqual(noFormMessage);
    });

    it('[C268910] Should a standalone task be displayed in completed tasks when completing it', async () => {
        const task = await taskPage.createNewTask();
        await task.addName('Completed standalone task');
        await task.clickStartButton();

        await taskPage.tasksListPage().checkContentIsDisplayed('Completed standalone task');
        await taskPage.formFields().noFormIsDisplayed();

        await taskPage.completeTaskNoForm();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().selectRow('Completed standalone task');
        await expect(await taskPage.formFields().getCompletedTaskNoFormMessage()).toEqual('Task ' + 'Completed standalone task' + ' completed');

        await taskPage.formFields().noFormIsDisplayed();
        await taskPage.taskDetails().waitFormNameEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
    });

    it('[C268911] Should allow adding a form to a standalone task when clicking on Add form button', async () => {
        const task = await taskPage.createNewTask();
        await task.addName('Add a form');
        await task.clickStartButton();

        await taskPage.tasksListPage().checkContentIsDisplayed('Add a form');
        await taskPage.formFields().noFormIsDisplayed();
        await taskPage.taskDetails().clickAttachFormButton();

        const formFields = await taskPage.formFields();
        await formFields.selectForm(app.formName);
        await formFields.clickOnAttachFormButton();

        await taskPage.formFields().checkFormIsDisplayed();
        await taskPage.taskDetails().checkCompleteFormButtonIsDisplayed();

        await taskPage.taskDetails().waitFormNameEqual(app.formName);
    });

    it('[C268912] Should a standalone task be displayed when removing the form from APS', async () => {
        const task = await taskPage.createNewTask();
        const taskDetails = await taskPage.taskDetails();
        await task.addName('Remove form');
        await task.selectForm(app.formName);
        await task.clickStartButton();

        await taskPage.tasksListPage().checkContentIsDisplayed('Remove form');
        await taskPage.taskDetails().waitFormNameEqual(app.formName);

        const listOfTasks = await tasksApi.listTasks(new Task({ sort: 'created-desc' }));
        await taskActionsApi.removeForm(listOfTasks.data[0].id);

        await browser.refresh();
        await taskPage.tasksListPage().checkContentIsDisplayed('Remove form');
        await taskPage.checkTaskTitle('Remove form');

        await taskPage.formFields().noFormIsDisplayed();
        await taskPage.taskDetails().waitFormNameEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
        await expect(await taskDetails.getNoFormMessage()).toEqual(noFormMessage);
    });
});
