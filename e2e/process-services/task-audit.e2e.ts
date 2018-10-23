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

import { LoginPage } from '../pages/adf/loginPage';
import { ProcessServicesPage } from '../pages/adf/process_services/processServicesPage';
import { TasksPage } from '../pages/adf/process_services/tasksPage';

import CONSTANTS = require('../util/constants');

import Tenant = require('../models/APS/Tenant');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';

import path = require('path');
import Util = require('../util/util');

describe('Task Audit', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let processUserModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let taskPage = new TasksPage();
    let taskTaskApp = 'Audit task task app';
    let taskCustomApp = 'Audit task custom app';
    let taskCompleteCustomApp = 'Audit completed task custom app';
    let auditLogFile = path.join('./e2e/download/', 'Audit.pdf');
    let appModel;

    beforeAll(async (done) => {
        let users = new UsersActions();
        let apps = new AppsActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        this.alfrescoJsApi.activiti.taskApi.createNewTask({name: taskTaskApp});

        appModel = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    it('[C260386] Should Audit file be downloaded when clicking on Task Audit log icon on a standalone running task', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.tasksListPage().checkTaskIsDisplayedInTasksList(taskTaskApp);

        taskPage.taskDetails().clickAuditLogButton();
        expect(Util.fileExists(auditLogFile, 10)).toBe(true);
    });

    it('[C260389] Should Audit file be downloaded when clicking on Task Audit log icon on a standalone completed task', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.tasksListPage().checkTaskIsDisplayedInTasksList(taskTaskApp);

        taskPage.completeTaskNoForm();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        taskPage.tasksListPage().selectTaskFromTasksList(taskTaskApp);
        expect(taskPage.formFields().getCompletedTaskNoFormMessage()).toEqual('Task ' + taskTaskApp + ' completed');

        taskPage.taskDetails().clickAuditLogButton();
        expect(Util.fileExists(auditLogFile, 20)).toBe(true);
    });

    it('[C263944] Should Audit file be downloaded when clicking on Task Audit log icon on a custom app standalone completed task', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();

        taskPage.createNewTask().addName(taskCompleteCustomApp).clickStartButton();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.tasksListPage().checkTaskIsDisplayedInTasksList(taskCompleteCustomApp);

        taskPage.completeTaskNoForm();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        taskPage.tasksListPage().selectTaskFromTasksList(taskCompleteCustomApp);
        expect(taskPage.formFields().getCompletedTaskNoFormMessage()).toEqual('Task ' + taskCompleteCustomApp + ' completed');

        taskPage.taskDetails().clickAuditLogButton();
        expect(Util.fileExists(auditLogFile, 20)).toBe(true);
    });

    it('[C263943] Should Audit file be downloaded when clicking on Task Audit log icon on a custom app standalone running task', () => {
        processServicesPage.goToProcessServices().goToApp(appModel.name).clickTasksButton();

        taskPage.createNewTask().addName(taskCustomApp).clickStartButton();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.tasksListPage().checkTaskIsDisplayedInTasksList(taskCustomApp);

        taskPage.taskDetails().clickAuditLogButton();
        expect(Util.fileExists(auditLogFile, 10)).toBe(true);
    });

});
