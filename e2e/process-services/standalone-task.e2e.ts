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

import { ApiService, LoginPage, UsersActions } from '@alfresco/adf-testing';
import { TasksPage } from './pages/tasks.page';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import * as fs from 'fs';
import * as path from 'path';
import CONSTANTS = require('../util/constants');
import Task = require('../models/APS/Task');

describe('Start Task - Task App', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const taskPage = new TasksPage();

    let processUserModel;
    const tasks = ['Standalone task', 'Completed standalone task', 'Add a form', 'Remove form'];
    const noFormMessage = 'No forms attached';

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);

    beforeAll(async () => {

        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        processUserModel = await usersActions.createUser();

        const pathFile = path.join(browser.params.testConfig.main.rootPath + app.file_location);
        const file = fs.createReadStream(pathFile);

        await apiService.getInstance().login(processUserModel.email, processUserModel.password);

        await apiService.getInstance().activiti.appsApi.importAppDefinition(file);

        await loginPage.login(processUserModel.email, processUserModel.password);
   });

    beforeEach(async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
   });

    it('[C260421] Should a standalone task be displayed when creating a new task without form', async () => {
        const task = await taskPage.createNewTask();
        await task.addName(tasks[0]);
        await task.clickStartButton();
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
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
        await task.addName(tasks[1]);
        await task.clickStartButton();
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[1]);
        await taskPage.formFields().noFormIsDisplayed();

        await taskPage.completeTaskNoForm();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().selectRow(tasks[1]);
        await expect(await taskPage.formFields().getCompletedTaskNoFormMessage()).toEqual('Task ' + tasks[1] + ' completed');

        await taskPage.formFields().noFormIsDisplayed();
        await taskPage.taskDetails().waitFormNameEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
    });

    it('[C268911] Should allow adding a form to a standalone task when clicking on Add form button', async () => {
        const task = await taskPage.createNewTask();
        await task.addName(tasks[2]);
        await task.clickStartButton();

        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[2]);
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
        await task.addName(tasks[3]);
        await task.selectForm(app.formName);
        await task.clickStartButton();

        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[3]);
        await taskPage.taskDetails().waitFormNameEqual(app.formName);

        const listOfTasks = await apiService.getInstance().activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        await apiService.getInstance().activiti.taskApi.removeForm(listOfTasks.data[0].id);

        await browser.refresh();
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[3]);
        await taskPage.checkTaskTitle(tasks[3]);

        await taskPage.formFields().noFormIsDisplayed();
        await taskPage.taskDetails().waitFormNameEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
        await expect(await taskDetails.getNoFormMessage()).toEqual(noFormMessage);
    });
});
