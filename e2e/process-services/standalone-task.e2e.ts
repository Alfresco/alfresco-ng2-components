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

import { ApiService, LoginSSOPage } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasks.page';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import CONSTANTS = require('../util/constants');
import { Tenant } from '../models/APS/tenant';
import Task = require('../models/APS/Task');
import { UsersActions } from '../actions/users.actions';
import fs = require('fs');
import path = require('path');

describe('Start Task - Task App', () => {

    const loginPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    let processUserModel;
    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const taskPage = new TasksPage();
    const tasks = ['Standalone task', 'Completed standalone task', 'Add a form', 'Remove form'];
    const noFormMessage = 'No forms attached';
    const alfrescoJsApi = new ApiService().apiService;

    beforeAll(async () => {
        const users = new UsersActions();

        await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        const newTenant = await alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        processUserModel = await users.createApsUser(alfrescoJsApi, newTenant.id);

        const pathFile = path.join(browser.params.testConfig.main.rootPath + app.file_location);
        const file = fs.createReadStream(pathFile);

        await alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        await alfrescoJsApi.activiti.appsApi.importAppDefinition(file);

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
        await expect(await taskPage.taskDetails().getFormName()).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
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
        await expect(await taskPage.taskDetails().getFormName()).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
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
        await expect(await taskPage.taskDetails().getFormName()).toEqual(app.formName);
    });

    it('[C268912] Should a standalone task be displayed when removing the form from APS', async () => {
        const task = await taskPage.createNewTask();
        const taskDetails = await taskPage.taskDetails();
        await task.addName(tasks[3]);
        await task.selectForm(app.formName);
        await task.clickStartButton();

        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[3]);
        await expect(await taskPage.taskDetails().getFormName()).toEqual(app.formName);

        const listOfTasks = await alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        await alfrescoJsApi.activiti.taskApi.removeForm(listOfTasks.data[0].id);

        await browser.refresh();
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[3]);
        await taskPage.checkTaskTitle(tasks[3]);

        await taskPage.formFields().noFormIsDisplayed();
        await expect(await taskPage.taskDetails().getFormName()).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
        await expect(await taskDetails.getNoFormMessage()).toEqual(noFormMessage);
    });
});
