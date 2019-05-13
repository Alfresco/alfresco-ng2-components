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

import TestConfig = require('../test.config');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { Tenant } from '../models/APS/tenant';
import Task = require('../models/APS/Task');
import TaskModel = require('../models/APS/TaskModel');
import FormModel = require('../models/APS/FormModel');
import { AppsActions } from '../actions/APS/apps.actions';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';

import resources = require('../util/resources');
import CONSTANTS = require('../util/constants');
import dateFormat = require('dateformat');

import { LoginPage, BrowserActions } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { browser } from 'protractor';

describe('Task Details component', () => {

    const processServices = new ProcessServicesPage();
    let processUserModel, appModel;
    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const tasks = ['Modifying task', 'Information box', 'No form', 'Not Created', 'Refreshing form', 'Assignee task', 'Attach File'];
    const TASK_DATA_FORMAT = 'mmm dd yyyy';
    let formModel;
    let apps;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();

    beforeAll(async (done) => {
        const users = new UsersActions();
        apps = new AppsActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        const newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        appModel = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    beforeEach(async (done) => {
        await BrowserActions.getUrl(TestConfig.adf.url + '/activiti');
        done();
    });

    it('[C260506] Should display task details for standalone task - Task App', async () => {
        processServices.goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.createNewTask()
            .addName(tasks[1])
            .addDescription('Description')
            .addForm(app.formName)
            .clickStartButton();
        expect(taskPage.taskDetails().getTitle()).toEqual('Activities');

        const allTasks = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        });

        const taskModel = new TaskModel(allTasks.data[0]);
        taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        expect(taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        expect(taskPage.taskDetails().getDescription()).toEqual(taskModel.getDescription());
        expect(taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        expect(taskPage.taskDetails().getCategory()).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY);
        expect(taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        expect(taskPage.taskDetails().getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
        expect(taskPage.taskDetails().getParentTaskId()).toEqual('');
        expect(taskPage.taskDetails().getDuration()).toEqual('');
        expect(taskPage.taskDetails().getEndDate()).toEqual('');
        expect(taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);

        const taskForm = await browser.controlFlow().execute(async () => {
            return await this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);
        });

        formModel = new FormModel(taskForm);

        expect(taskPage.taskDetails().getFormName()).toEqual(formModel.getName());
    });

    it('[C263946] Should display task details for standalone task - Custom App', async () => {
        processServices.goToApp(appModel.name).clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.createNewTask()
            .addName(tasks[1])
            .addDescription('Description')
            .addForm(app.formName)
            .clickStartButton();
        expect(taskPage.taskDetails().getTitle()).toEqual('Activities');

        const allTasks = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        });

        const taskModel = new TaskModel(allTasks.data[0]);
        taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());

        expect(taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        expect(taskPage.taskDetails().getDescription()).toEqual(taskModel.getDescription());
        expect(taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        expect(taskPage.taskDetails().getCategory()).toEqual(taskModel.getCategory());
        expect(taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        expect(taskPage.taskDetails().getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
        expect(taskPage.taskDetails().getDuration()).toEqual('' );
        expect(taskPage.taskDetails().getEndDate()).toEqual('');
        expect(taskPage.taskDetails().getParentTaskId()).toEqual('');
        expect(taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);

        const taskForm = await browser.controlFlow().execute(async () => {
            return await this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);
        });

        formModel = new FormModel(taskForm);

        expect(taskPage.taskDetails().getFormName()).toEqual(formModel.getName());
    });

    it('[C286706] Should display task details for task - Task App', async () => {
        browser.controlFlow().execute(async () => {
            await apps.startProcess(this.alfrescoJsApi, appModel);
        });

        processServices.goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        expect(taskPage.taskDetails().getTitle()).toEqual('Activities');

        const allTasks = await browser.controlFlow().execute(async () => {
            return await this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({sort: 'created-desc'}));
        });

        const taskModel = new TaskModel(allTasks.data[0]);

        taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        expect(taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        expect(taskPage.taskDetails().getDescription()).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION);
        expect(taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        expect(taskPage.taskDetails().getCategory()).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY);
        expect(taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        expect(taskPage.taskDetails().getParentName()).toEqual(appModel.definition.models[0].name);
        expect(taskPage.taskDetails().getDuration()).toEqual('' );
        expect(taskPage.taskDetails().getEndDate()).toEqual('');
        expect(taskPage.taskDetails().getParentTaskId()).toEqual('');
        expect(taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);

        const taskForm = await browser.controlFlow().execute(async () => {
            return await this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);
        });

        formModel = new FormModel(taskForm);

        expect(taskPage.taskDetails().getFormName())
            .toEqual(formModel.getName() === null ? CONSTANTS.TASK_DETAILS.NO_FORM : formModel.getName());
    });

    it('[C286705] Should display task details for task - Custom App', async () => {
        browser.controlFlow().execute(async () => {
            await apps.startProcess(this.alfrescoJsApi, appModel);
        });

        processServices.goToApp(appModel.name).clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        expect(taskPage.taskDetails().getTitle()).toEqual('Activities');

        const allTasks = await browser.controlFlow().execute(async () => {
            return await this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({sort: 'created-desc'}));
        });

        const taskModel = new TaskModel(allTasks.data[0]);

        taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        expect(taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        expect(taskPage.taskDetails().getDescription()).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION);
        expect(taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        expect(taskPage.taskDetails().getCategory()).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY);
        expect(taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        expect(taskPage.taskDetails().getParentName()).toEqual(appModel.definition.models[0].name);
        expect(taskPage.taskDetails().getDuration()).toEqual('' );
        expect(taskPage.taskDetails().getEndDate()).toEqual('');
        expect(taskPage.taskDetails().getParentTaskId()).toEqual('');
        expect(taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);

        const taskForm = await browser.controlFlow().execute(async () => {
            return await this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);
        });

        formModel = new FormModel(taskForm);

        expect(taskPage.taskDetails().getFormName())
            .toEqual(formModel.getName() === null ? CONSTANTS.TASK_DETAILS.NO_FORM : formModel.getName());
    });

    it('[C286708] Should display task details for subtask - Task App', async() => {
        const taskName = 'TaskAppSubtask';
        const checklistName = 'TaskAppChecklist';
        browser.controlFlow().execute(async () => {
            await this.alfrescoJsApi.activiti.taskApi.createNewTask({'name': taskName});
        });

        processServices.goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.tasksListPage().checkContentIsDisplayed(taskName);
        taskPage.tasksListPage().selectRow(taskName);

        taskPage.clickOnAddChecklistButton().addName(checklistName).clickCreateChecklistButton();
        taskPage.checkChecklistIsDisplayed(checklistName);

        taskPage.tasksListPage().checkContentIsDisplayed(checklistName);
        taskPage.tasksListPage().selectRow(checklistName);

        const allTasks = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        });

        const taskModel = new TaskModel(allTasks.data[0]);
        taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        expect(taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        expect(taskPage.taskDetails().getDescription()).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION);
        expect(taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        expect(taskPage.taskDetails().getCategory()).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY);
        expect(taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        expect(taskPage.taskDetails().getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
        expect(taskPage.taskDetails().getDuration()).toEqual('');
        expect(taskPage.taskDetails().getEndDate()).toEqual('');
        expect(taskPage.taskDetails().getParentTaskId()).toEqual(taskModel.getParentTaskId());
        expect(taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);
    });

    it('[C286707] Should display task details for subtask - Custom App', async() => {
        const checklistName = 'CustomAppChecklist';

        browser.controlFlow().execute(async () => {
            await apps.startProcess(this.alfrescoJsApi, appModel);
        });

        processServices.goToApp(appModel.name).clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        expect(taskPage.taskDetails().getTitle()).toEqual('Activities');

        taskPage.clickOnAddChecklistButton().addName(checklistName).clickCreateChecklistButton();
        taskPage.checkChecklistIsDisplayed(checklistName);

        taskPage.tasksListPage().checkContentIsDisplayed(checklistName);
        taskPage.tasksListPage().selectRow(checklistName);

        const allTasks = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        });

        const taskModel = new TaskModel(allTasks.data[0]);
        taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        expect(taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        expect(taskPage.taskDetails().getDescription()).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION);
        expect(taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        expect(taskPage.taskDetails().getCategory()).toEqual(taskModel.getCategory());
        expect(taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        expect(taskPage.taskDetails().getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
        expect(taskPage.taskDetails().getDuration()).toEqual('');
        expect(taskPage.taskDetails().getEndDate()).toEqual('');
        expect(taskPage.taskDetails().getParentTaskId()).toEqual(taskModel.getParentTaskId());
        expect(taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);
    });

    it('[C286709] Should display task details for completed task - Task App', async() => {
        const taskName = 'TaskAppCompleted';
        const taskId = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.createNewTask({'name': taskName});
        });

        processServices.goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.tasksListPage().checkContentIsDisplayed(taskName).selectRow('Name', taskName);

        taskPage.completeTaskNoForm();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        taskPage.tasksListPage().selectRow(taskName);

        const getTaskResponse = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.getTask(taskId.id);
        });

        const taskModel = new TaskModel(getTaskResponse);
        taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        expect(taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        expect(taskPage.taskDetails().getDescription()).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION);
        expect(taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        expect(taskPage.taskDetails().getCategory()).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY);
        expect(taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        expect(taskPage.taskDetails().getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
        expect(taskPage.taskDetails().getDuration()).toEqual(taskPage.taskDetails().getDuration());
        expect(taskPage.taskDetails().getEndDate()).toEqual(taskPage.taskDetails().getEndDate());
        expect(taskPage.taskDetails().getParentTaskId()).toEqual('');
        expect(taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.COMPLETED);
    });

});
