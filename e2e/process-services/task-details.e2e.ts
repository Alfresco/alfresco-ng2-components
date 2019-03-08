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

import AlfrescoApi = require('alfresco-js-api-node');
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

import { LoginPage } from '../pages/adf/loginPage';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { browser } from 'protractor';

describe('Task Details component', () => {

    const processServices = new ProcessServicesPage();
    let processUserModel, appModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let tasks = ['Modifying task', 'Information box', 'No form', 'Not Created', 'Refreshing form', 'Assignee task', 'Attach File'];
    let TASK_DATA_FORMAT = 'mmm dd yyyy';
    let formModel;
    let apps;

    let loginPage = new LoginPage();
    let taskPage = new TasksPage();

    beforeAll(async (done) => {
        let users = new UsersActions();
        apps = new AppsActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        appModel = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    beforeEach(async (done) => {
        await browser.get(TestConfig.adf.url + '/activiti');
        done();
    });

    it('[C260506] Should display task details for standalone task - Task App', async () => {
        processServices.goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.createNewTask().addName(tasks[1]).addDescription('Description')
            .addForm(app.formName).clickStartButton();
        expect(taskPage.taskDetails().getTitle()).toEqual('Activities');

        let allTasks = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        });

        let taskModel = new TaskModel(allTasks.data[0]);
        taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        expect(taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        expect(taskPage.taskDetails().getDescription())
            .toEqual(taskModel.getDescription() === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : taskModel.getDescription());
        expect(taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        expect(taskPage.taskDetails().getCategory())
            .toEqual(taskModel.getCategory() === null ? CONSTANTS.TASK_DETAILS.NO_CATEGORY : taskModel.getCategory());
        expect(taskPage.taskDetails().getDueDate())
            .toEqual(taskModel.getDueDate() === null ? CONSTANTS.TASK_DETAILS.NO_DATE : taskModel.getDueDate());
        expect(taskPage.taskDetails().getParentName())
            .toEqual(taskModel.getParentTaskName() === null ? CONSTANTS.TASK_DETAILS.NO_PARENT : taskModel.getParentTaskName());
        expect(taskPage.taskDetails().getParentTaskId())
            .toEqual(taskModel.getParentTaskId() === null ? '' : taskModel.getParentTaskId());
        expect(taskPage.taskDetails().getDuration())
            .toEqual(taskModel.getDuration() === null ? '' : taskModel.getDuration() + ' ms');
        expect(taskPage.taskDetails().getEndDate())
            .toEqual(taskModel.getEndDate() === null ? '' : dateFormat(taskModel.getEndDate(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);

        let taskForm = await browser.controlFlow().execute(async () => {
            return await this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);
        });

        formModel = new FormModel(taskForm);

        expect(taskPage.taskDetails().getFormName())
            .toEqual(formModel.getName() === null ? CONSTANTS.TASK_DETAILS.NO_FORM : formModel.getName());
    });

    it('[C263946] Should display task details for standalone task - Custom App', async () => {
        processServices.goToApp(appModel.name).clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.createNewTask().addName(tasks[1]).addDescription('Description')
            .addForm(app.formName).clickStartButton();
        expect(taskPage.taskDetails().getTitle()).toEqual('Activities');

        let allTasks = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        });

        let taskModel = new TaskModel(allTasks.data[0]);
        taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());

        expect(taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        expect(taskPage.taskDetails().getDescription())
            .toEqual(taskModel.getDescription() === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : taskModel.getDescription());
        expect(taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        expect(taskPage.taskDetails().getCategory())
            .toEqual(taskModel.getCategory() === null ? CONSTANTS.TASK_DETAILS.NO_CATEGORY : taskModel.getCategory());
        expect(taskPage.taskDetails().getDueDate())
            .toEqual(taskModel.getDueDate() === null ? CONSTANTS.TASK_DETAILS.NO_DATE : taskModel.getDueDate());
        expect(taskPage.taskDetails().getParentName())
            .toEqual(taskModel.getParentTaskName() === null ? CONSTANTS.TASK_DETAILS.NO_PARENT : taskModel.getParentTaskName());
        expect(taskPage.taskDetails().getDuration())
            .toEqual(taskModel.getDuration() === null ? '' : taskModel.getDuration() + ' ms');
        expect(taskPage.taskDetails().getEndDate())
            .toEqual(taskModel.getEndDate() === null ? '' : dateFormat(taskModel.getEndDate(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getParentTaskId())
            .toEqual(taskModel.getParentTaskId() === null ? '' : taskModel.getParentTaskId());
        expect(taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);

        let taskForm = await browser.controlFlow().execute(async () => {
            return await this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);
        });

        formModel = new FormModel(taskForm);

        expect(taskPage.taskDetails().getFormName())
            .toEqual(formModel.getName() === null ? CONSTANTS.TASK_DETAILS.NO_FORM : formModel.getName());
    });

    it('[C286706] Should display task details for task - Task App', async () => {
        browser.controlFlow().execute(async () => {
            await apps.startProcess(this.alfrescoJsApi, appModel);
        });

        processServices.goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        expect(taskPage.taskDetails().getTitle()).toEqual('Activities');

        let allTasks = await browser.controlFlow().execute(async () => {
            return await this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({sort: 'created-desc'}));
        });

        let taskModel = new TaskModel(allTasks.data[0]);

        taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        expect(taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        expect(taskPage.taskDetails().getDescription())
            .toEqual(taskModel.getDescription() === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : taskModel.getDescription());
        expect(taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        expect(taskPage.taskDetails().getCategory())
            .toEqual(taskModel.getCategory() === null ? CONSTANTS.TASK_DETAILS.NO_CATEGORY : taskModel.getCategory());
        expect(taskPage.taskDetails().getDueDate())
            .toEqual(taskModel.getDueDate() === null ? CONSTANTS.TASK_DETAILS.NO_DATE : taskModel.getDueDate());
        expect(taskPage.taskDetails().getParentName())
            .toEqual(appModel.definition.models[0].name);
        expect(taskPage.taskDetails().getParentTaskId())
            .toEqual(taskModel.getParentTaskId() === null ? '' : taskModel.getParentTaskId());
        expect(taskPage.taskDetails().getDuration())
            .toEqual(taskModel.getDuration() === null ? '' : taskModel.getDuration() + ' ms');
        expect(taskPage.taskDetails().getEndDate())
            .toEqual(taskModel.getEndDate() === null ? '' : dateFormat(taskModel.getEndDate(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);

        let taskForm = await browser.controlFlow().execute(async () => {
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

        let allTasks = await browser.controlFlow().execute(async () => {
            return await this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({sort: 'created-desc'}));
        });

        let taskModel = new TaskModel(allTasks.data[0]);

        taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        expect(taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        expect(taskPage.taskDetails().getDescription())
            .toEqual(taskModel.getDescription() === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : taskModel.getDescription());
        expect(taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        expect(taskPage.taskDetails().getCategory())
            .toEqual(taskModel.getCategory() === null ? CONSTANTS.TASK_DETAILS.NO_CATEGORY : taskModel.getCategory());
        expect(taskPage.taskDetails().getDueDate())
            .toEqual(taskModel.getDueDate() === null ? CONSTANTS.TASK_DETAILS.NO_DATE : taskModel.getDueDate());
        expect(taskPage.taskDetails().getParentName())
            .toEqual(appModel.definition.models[0].name);
        expect(taskPage.taskDetails().getParentTaskId())
            .toEqual(taskModel.getParentTaskId() === null ? '' : taskModel.getParentTaskId());
        expect(taskPage.taskDetails().getDuration())
            .toEqual(taskModel.getDuration() === null ? '' : taskModel.getDuration() + ' ms');
        expect(taskPage.taskDetails().getEndDate())
            .toEqual(taskModel.getEndDate() === null ? '' : dateFormat(taskModel.getEndDate(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);

        let taskForm = await browser.controlFlow().execute(async () => {
            return await this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);
        });

        formModel = new FormModel(taskForm);

        expect(taskPage.taskDetails().getFormName())
            .toEqual(formModel.getName() === null ? CONSTANTS.TASK_DETAILS.NO_FORM : formModel.getName());
    });

    it('[C286708] Should display task details for subtask - Task App', async() => {
        let taskName = 'TaskAppSubtask';
        let checklistName = 'TaskAppChecklist';
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

        let allTasks = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        });

        let checklistTask = new TaskModel(allTasks.data[0]);
        let taskModel = new TaskModel(allTasks.data[0]);
        taskPage.tasksListPage().checkContentIsDisplayed(checklistTask.getName());
        expect(taskPage.taskDetails().getCreated()).toEqual(dateFormat(checklistTask.getCreated(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getId()).toEqual(checklistTask.getId());
        expect(taskPage.taskDetails().getDescription())
            .toEqual(checklistTask.getDescription() === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : taskModel.getDescription());
        expect(taskPage.taskDetails().getAssignee()).toEqual(checklistTask.getAssignee().getEntireName());
        expect(taskPage.taskDetails().getCategory())
            .toEqual(checklistTask.getCategory() === null ? CONSTANTS.TASK_DETAILS.NO_CATEGORY : checklistTask.getCategory());
        expect(taskPage.taskDetails().getDueDate())
            .toEqual(checklistTask.getDueDate() === null ? CONSTANTS.TASK_DETAILS.NO_DATE : checklistTask.getDueDate());
        expect(taskPage.taskDetails().getParentName())
            .toEqual(checklistTask.getParentTaskName() === null ? CONSTANTS.TASK_DETAILS.NO_PARENT : checklistTask.getParentTaskName());
        expect(taskPage.taskDetails().getParentTaskId())
            .toEqual(checklistTask.getParentTaskId() === null ? '' : checklistTask.getParentTaskId());
        expect(taskPage.taskDetails().getDuration())
            .toEqual(checklistTask.getDuration() === null ? '' : checklistTask.getDuration() + ' ms');
        expect(taskPage.taskDetails().getEndDate())
            .toEqual(checklistTask.getEndDate() === null ? '' : dateFormat(checklistTask.getEndDate(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);
    });

    it('[C286707] Should display task details for subtask - Custom App', async() => {
        let checklistName = 'CustomAppChecklist';

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

        let allTasks = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        });

        let checklistTask = new TaskModel(allTasks.data[0]);
        let taskModel = new TaskModel(allTasks.data[0]);
        taskPage.tasksListPage().checkContentIsDisplayed(checklistTask.getName());
        expect(taskPage.taskDetails().getCreated()).toEqual(dateFormat(checklistTask.getCreated(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getId()).toEqual(checklistTask.getId());
        expect(taskPage.taskDetails().getDescription())
            .toEqual(checklistTask.getDescription() === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : taskModel.getDescription());
        expect(taskPage.taskDetails().getAssignee()).toEqual(checklistTask.getAssignee().getEntireName());
        expect(taskPage.taskDetails().getCategory())
            .toEqual(checklistTask.getCategory() === null ? CONSTANTS.TASK_DETAILS.NO_CATEGORY : checklistTask.getCategory());
        expect(taskPage.taskDetails().getDueDate())
            .toEqual(checklistTask.getDueDate() === null ? CONSTANTS.TASK_DETAILS.NO_DATE : checklistTask.getDueDate());
        expect(taskPage.taskDetails().getParentName())
            .toEqual(checklistTask.getParentTaskName() === null ? CONSTANTS.TASK_DETAILS.NO_PARENT : checklistTask.getParentTaskName());
        expect(taskPage.taskDetails().getParentTaskId())
            .toEqual(checklistTask.getParentTaskId() === null ? '' : checklistTask.getParentTaskId());
        expect(taskPage.taskDetails().getDuration())
            .toEqual(checklistTask.getDuration() === null ? '' : checklistTask.getDuration() + ' ms');
        expect(taskPage.taskDetails().getEndDate())
            .toEqual(checklistTask.getEndDate() === null ? '' : dateFormat(checklistTask.getEndDate(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);
    });

    it('[C286709] Should display task details for completed task - Task App', async() => {
        let taskName = 'TaskAppCompleted';
        let taskId = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.createNewTask({'name': taskName});
        });

        processServices.goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.tasksListPage().checkContentIsDisplayed(taskName).selectRow('Name', taskName);

        taskPage.completeTaskNoForm();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        taskPage.tasksListPage().selectRow(taskName);

        let getTaskResponse = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.getTask(taskId.id);
        });

        let completedTask = new TaskModel(getTaskResponse);
        taskPage.tasksListPage().checkContentIsDisplayed(completedTask.getName());
        expect(taskPage.taskDetails().getCreated()).toEqual(dateFormat(completedTask.getCreated(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getId()).toEqual(completedTask.getId());
        expect(taskPage.taskDetails().getDescription())
            .toEqual(completedTask.getDescription() === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : completedTask.getDescription());
        expect(taskPage.taskDetails().getAssignee()).toEqual(completedTask.getAssignee().getEntireName());
        expect(taskPage.taskDetails().getCategory())
            .toEqual(completedTask.getCategory() === null ? CONSTANTS.TASK_DETAILS.NO_CATEGORY : completedTask.getCategory());
        expect(taskPage.taskDetails().getDueDate())
            .toEqual(completedTask.getDueDate() === null ? CONSTANTS.TASK_DETAILS.NO_DATE : completedTask.getDueDate());
        expect(taskPage.taskDetails().getParentName())
            .toEqual(completedTask.getParentTaskName() === null ? CONSTANTS.TASK_DETAILS.NO_PARENT : completedTask.getParentTaskName());
        expect(taskPage.taskDetails().getParentTaskId())
            .toEqual(completedTask.getParentTaskId() === null ? '' : completedTask.getParentTaskId());
        expect(taskPage.taskDetails().getDuration())
            .toEqual(completedTask.getDuration() === null ? '' : completedTask.getDuration() + ' ms');
        expect(taskPage.taskDetails().getEndDate())
            .toEqual(completedTask.getEndDate() === null ? '' : dateFormat(completedTask.getEndDate(), TASK_DATA_FORMAT));
        expect(taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.COMPLETED);
    });

});
