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

import { browser } from 'protractor';

import { LoginPage } from '../pages/adf/LoginPage';
import { ProcessServicesPage } from '../pages/adf/process_services/processServicesPage';
import { TasksPage } from '../pages/adf/process_services/tasksPage';

import CONSTANTS = require('../util/constants');

import Tenant = require('../models/APS/Tenant');
import Task = require('../models/APS/Task');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';
import fs = require('fs');
import path = require('path');
import Util = require('..ro/util/util');

describe('Start Task - Task App', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let processUserModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let taskPage = new TasksPage();
    let tasks = ['Standalone task', 'Completed standalone task', 'Add a form', 'Remove form'];
    let noFormMessage = 'No forms attached';

    beforeAll(async (done) => {
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        let pathFile = path.join(TestConfig.main.rootPath + app.file_location);
        let file = fs.createReadStream(pathFile);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        await this.alfrescoJsApi.activiti.appsApi.importAppDefinition(file);

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    it('[C260421] Should a standalone task be displayed when creating a new task without form', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(tasks[0]).clickStartButton()
            .then(() => {
                taskPage.tasksListPage().checkTaskIsDisplayedInTasksList(tasks[0]);
                taskPage.formFields().noFormIsDisplayed();
                expect(taskPage.taskDetails().getFormName()).toEqual(CONSTANTS.TASKDETAILS.NO_FORM);
                expect(taskPage.formFields().getNoFormMessage()).toEqual(noFormMessage);
            });
    });

    it('[C268910] Should a standalone task be displayed in completed tasks when completing it', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(tasks[1]).clickStartButton()
            .then(() => {
                taskPage.tasksListPage().checkTaskIsDisplayedInTasksList(tasks[1]);
                taskPage.formFields().noFormIsDisplayed();

                taskPage.completeTaskNoForm();
                taskPage.filtersPage().goToFilter(CONSTANTS.TASKFILTERS.COMPL_TASKS);
                taskPage.tasksListPage().selectTaskFromTasksList(tasks[1]);
                expect(taskPage.formFields().getCompletedTaskNoFormMessage()).toEqual('Task ' + tasks[1] + ' completed');

                taskPage.formFields().noFormIsDisplayed();
                expect(taskPage.taskDetails().getFormName()).toEqual(CONSTANTS.TASKDETAILS.NO_FORM);
            });
    });

    it('[C268911] Should allow adding a form to a standalone task when clicking on Add form button', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(tasks[2]).clickStartButton()
            .then(() => {
                taskPage.tasksListPage().checkTaskIsDisplayedInTasksList(tasks[2]);
                taskPage.formFields().noFormIsDisplayed();

                taskPage.formFields().clickOnAttachFormButton().selectForm(app.formName).clickOnAttachFormButton();
                expect(taskPage.taskDetails().getFormName()).toEqual(app.formName);
            });
    });

    it('[C268912] Should a standalone task be displayed when removing the form from APS', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(tasks[3]).addForm(app.formName).clickStartButton();

        taskPage.tasksListPage().checkTaskIsDisplayedInTasksList(tasks[3]);
        expect(taskPage.taskDetails().getFormName()).toEqual(app.formName);

        browser.controlFlow().execute(async () => {
            const listOfTasks = await this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
            await this.alfrescoJsApi.activiti.taskApi.removeForm(listOfTasks.data[0].id);
        });

        browser.refresh();
        taskPage.tasksListPage().checkTaskIsDisplayedInTasksList(tasks[3]);
        taskPage.checkTaskTitle(tasks[3]);

        taskPage.formFields().noFormIsDisplayed();
        expect(taskPage.taskDetails().getFormName()).toEqual(CONSTANTS.TASKDETAILS.NO_FORM);
        expect(taskPage.formFields().getNoFormMessage()).toEqual(noFormMessage);
    });

});
