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

import { LoginPage } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import CONSTANTS = require('../util/constants');

import { Tenant } from '../models/APS/tenant';
import Task = require('../models/APS/Task');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import fs = require('fs');
import path = require('path');

describe('Start Task - Task App', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    let processUserModel;
    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const taskPage = new TasksPage();
    const tasks = ['Standalone task', 'Completed standalone task', 'Add a form', 'Remove form'];
    const noFormMessage = 'No forms attached';

    beforeAll(async (done) => {
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        const newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        const pathFile = path.join(TestConfig.main.rootPath + app.file_location);
        const file = fs.createReadStream(pathFile);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        await this.alfrescoJsApi.activiti.appsApi.importAppDefinition(file);

        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    beforeEach(async (done) => {
        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        done();
    });

    it('[C260421] Should a standalone task be displayed when creating a new task without form', () => {

        taskPage.createNewTask().addName(tasks[0]).clickStartButton();
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        taskPage.taskDetails().noFormIsDisplayed();
        taskPage.taskDetails().checkCompleteTaskButtonIsDisplayed().checkCompleteTaskButtonIsEnabled();
        taskPage.taskDetails().checkAttachFormButtonIsDisplayed();
        taskPage.taskDetails().checkAttachFormButtonIsEnabled();
        expect(taskPage.taskDetails().getFormName()).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
        expect(taskPage.formFields().getNoFormMessage()).toEqual(noFormMessage);
    });

    it('[C268910] Should a standalone task be displayed in completed tasks when completing it', () => {
        taskPage.createNewTask().addName(tasks[1]).clickStartButton();
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[1]);
        taskPage.formFields().noFormIsDisplayed();

        taskPage.completeTaskNoForm();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        taskPage.tasksListPage().selectRow(tasks[1]);
        expect(taskPage.formFields().getCompletedTaskNoFormMessage()).toEqual('Task ' + tasks[1] + ' completed');

        taskPage.formFields().noFormIsDisplayed();
        expect(taskPage.taskDetails().getFormName()).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
    });

    it('[C268911] Should allow adding a form to a standalone task when clicking on Add form button', () => {
        taskPage.createNewTask().addName(tasks[2]).clickStartButton();
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[2]);
        taskPage.formFields().noFormIsDisplayed();

        taskPage.formFields().clickOnAttachFormButton().selectForm(app.formName).clickOnAttachFormButton();
        expect(taskPage.taskDetails().getFormName()).toEqual(app.formName);
    });

    it('[C268912] Should a standalone task be displayed when removing the form from APS', () => {
        taskPage.createNewTask().addName(tasks[3]).addForm(app.formName).clickStartButton();

        taskPage.tasksListPage().checkContentIsDisplayed(tasks[3]);
        expect(taskPage.taskDetails().getFormName()).toEqual(app.formName);

        browser.controlFlow().execute(async () => {
            const listOfTasks = await this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
            await this.alfrescoJsApi.activiti.taskApi.removeForm(listOfTasks.data[0].id);
        });

        browser.refresh();
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[3]);
        taskPage.checkTaskTitle(tasks[3]);

        taskPage.formFields().noFormIsDisplayed();
        expect(taskPage.taskDetails().getFormName()).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
        expect(taskPage.formFields().getNoFormMessage()).toEqual(noFormMessage);
    });

});
