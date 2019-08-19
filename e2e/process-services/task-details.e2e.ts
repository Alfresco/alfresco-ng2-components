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

import { LoginPage, BrowserActions, StringUtil } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { browser } from 'protractor';

describe('Task Details component', () => {

    const processServices = new ProcessServicesPage();
    let processUserModel, appModel;
    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const tasks = ['Modifying task', 'Information box', 'No form', 'Not Created', 'Refreshing form', 'Assignee task', 'Attach File'];
    const TASK_DATE_FORMAT = 'mmm d, yyyy';
    let formModel;
    let apps;

    const taskFormModel = {
        'name': StringUtil.generateRandomString(),
        'description': '',
        'modelType': 2,
        'stencilSet': 0
    };

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();

    beforeAll(async () => {
        const users = new UsersActions();
        apps = new AppsActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        const newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        appModel = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);

    });

    beforeEach(async () => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/activiti');
    });

    it('[C260506] Should display task details for standalone task - Task App', async () => {
        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        const task = await taskPage.createNewTask();
        await task.addName(tasks[1]);
        await task.addDescription('Description');
        await task.addForm(app.formName);
        await task.clickStartButton();

        await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

        const allTasks = await this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));

        const taskModel = new TaskModel(allTasks.data[0]);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        await expect(await taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATE_FORMAT));
        await expect(await taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        await expect(await taskPage.taskDetails().getDescription()).toEqual(taskModel.getDescription());
        await expect(await taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        await expect(await taskPage.taskDetails().getCategory()).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY);
        await expect(await taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        await expect(await taskPage.taskDetails().getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
        await expect(await taskPage.taskDetails().getParentTaskId()).toEqual('');
        await expect(await taskPage.taskDetails().getDuration()).toEqual('');
        await expect(await taskPage.taskDetails().getEndDate()).toEqual('');
        await expect(await taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);

        const taskForm = await this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);
        formModel = new FormModel(taskForm);

        await expect(await taskPage.taskDetails().getFormName()).toEqual(formModel.getName());
    });

    it('[C263946] Should display task details for standalone task - Custom App', async () => {
        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        const task = await taskPage.createNewTask();
        await task.addName(tasks[1]);
        await task.addDescription('Description');
        await task.addForm(app.formName);
        await task.clickStartButton();

        await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

        const allTasks = await this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));

        const taskModel = new TaskModel(allTasks.data[0]);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());

        await expect(await taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATE_FORMAT));
        await expect(await taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        await expect(await taskPage.taskDetails().getDescription()).toEqual(taskModel.getDescription());
        await expect(await taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());

        await expect(await taskPage.taskDetails().getCategory()).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY);
        await expect(await taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        await expect(await taskPage.taskDetails().getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
        await expect(await taskPage.taskDetails().getDuration()).toEqual('');
        await expect(await taskPage.taskDetails().getEndDate()).toEqual('');
        await expect(await taskPage.taskDetails().getParentTaskId()).toEqual('');
        await expect(await taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);

        const taskForm = await this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);

        formModel = new FormModel(taskForm);

        await expect(await taskPage.taskDetails().getFormName()).toEqual(formModel.getName());
    });

    it('[C286706] Should display task details for task - Task App', async () => {
        await apps.startProcess(this.alfrescoJsApi, appModel);

        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

        const allTasks = await this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));

        const taskModel = new TaskModel(allTasks.data[0]);

        await taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        await expect(await taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATE_FORMAT));
        await expect(await taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        await expect(await taskPage.taskDetails().getDescription()).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION);
        await expect(await taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        await expect(await taskPage.taskDetails().getCategory()).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY);
        await expect(await taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        await expect(await taskPage.taskDetails().getParentName()).toEqual(appModel.definition.models[0].name);
        await expect(await taskPage.taskDetails().getDuration()).toEqual('');
        await expect(await taskPage.taskDetails().getEndDate()).toEqual('');
        await expect(await taskPage.taskDetails().getParentTaskId()).toEqual('');
        await expect(await taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);

        const taskForm = await this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);

        formModel = new FormModel(taskForm);

        await expect(await taskPage.taskDetails().getFormName())
            .toEqual(formModel.getName() === null ? CONSTANTS.TASK_DETAILS.NO_FORM : formModel.getName());
    });

    it('[C286705] Should display task details for task - Custom App', async () => {
        await apps.startProcess(this.alfrescoJsApi, appModel);

        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

        const allTasks = await this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));

        const taskModel = new TaskModel(allTasks.data[0]);

        await taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        await expect(await taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATE_FORMAT));
        await expect(await taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        await expect(await taskPage.taskDetails().getDescription()).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION);
        await expect(await taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        await expect(await taskPage.taskDetails().getCategory()).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY);
        await expect(await taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        await expect(await taskPage.taskDetails().getParentName()).toEqual(appModel.definition.models[0].name);
        await expect(await taskPage.taskDetails().getDuration()).toEqual('');
        await expect(await taskPage.taskDetails().getEndDate()).toEqual('');
        await expect(await taskPage.taskDetails().getParentTaskId()).toEqual('');
        await expect(await taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);

        const taskForm = await this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);

        formModel = new FormModel(taskForm);

        await expect(await taskPage.taskDetails().getFormName())
            .toEqual(formModel.getName() === null ? CONSTANTS.TASK_DETAILS.NO_FORM : formModel.getName());
    });

    it('[C286708] Should display task details for subtask - Task App', async () => {
        const taskName = 'TaskAppSubtask';
        const checklistName = 'TaskAppChecklist';
        await this.alfrescoJsApi.activiti.taskApi.createNewTask({ 'name': taskName });

        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskName);
        await taskPage.tasksListPage().selectRow(taskName);

        const dialog = await taskPage.clickOnAddChecklistButton();
        await dialog.addName(checklistName);
        await dialog.clickCreateChecklistButton();

        await taskPage.checkChecklistIsDisplayed(checklistName);

        await taskPage.tasksListPage().checkContentIsDisplayed(checklistName);
        await taskPage.tasksListPage().selectRow(checklistName);

        const allTasks = await this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));

        const taskModel = new TaskModel(allTasks.data[0]);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        await expect(await taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATE_FORMAT));
        await expect(await taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        await expect(await taskPage.taskDetails().getDescription()).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION);
        await expect(await taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        await expect(await taskPage.taskDetails().getCategory()).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY);
        await expect(await taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        await expect(await taskPage.taskDetails().getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
        await expect(await taskPage.taskDetails().getDuration()).toEqual('');
        await expect(await taskPage.taskDetails().getEndDate()).toEqual('');
        await expect(await taskPage.taskDetails().getParentTaskId()).toEqual(taskModel.getParentTaskId());
        await expect(await taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);
    });

    it('[C286707] Should display task details for subtask - Custom App', async () => {
        const checklistName = 'CustomAppChecklist';

        await apps.startProcess(this.alfrescoJsApi, appModel);

        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

        const dialog = await taskPage.clickOnAddChecklistButton();
        await dialog.addName(checklistName);
        await dialog.clickCreateChecklistButton();

        await taskPage.checkChecklistIsDisplayed(checklistName);

        await taskPage.tasksListPage().checkContentIsDisplayed(checklistName);
        await taskPage.tasksListPage().selectRow(checklistName);

        const allTasks = await this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));

        const taskModel = new TaskModel(allTasks.data[0]);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        await expect(await taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATE_FORMAT));
        await expect(await taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        await expect(await taskPage.taskDetails().getDescription()).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION);
        await expect(await taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        await expect(await taskPage.taskDetails().getCategory()).toEqual(taskModel.getCategory());
        await expect(await taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        await expect(await taskPage.taskDetails().getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
        await expect(await taskPage.taskDetails().getDuration()).toEqual('');
        await expect(await taskPage.taskDetails().getEndDate()).toEqual('');
        await expect(await taskPage.taskDetails().getParentTaskId()).toEqual(taskModel.getParentTaskId());
        await expect(await taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);
    });

    it('[C286709] Should display task details for completed task - Task App', async () => {
        const taskName = 'TaskAppCompleted';
        const taskId = await this.alfrescoJsApi.activiti.taskApi.createNewTask({ 'name': taskName });

        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await taskPage.tasksListPage().checkContentIsDisplayed(taskName);
        await taskPage.tasksListPage().selectRow(taskName);

        await taskPage.completeTaskNoForm();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().selectRow(taskName);

        const getTaskResponse = await this.alfrescoJsApi.activiti.taskApi.getTask(taskId.id);

        const taskModel = new TaskModel(getTaskResponse);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        await expect(await taskPage.taskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASK_DATE_FORMAT));
        await expect(await taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        await expect(await taskPage.taskDetails().getDescription()).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION);
        await expect(await taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        await expect(await taskPage.taskDetails().getCategory()).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY);
        await expect(await taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        await expect(await taskPage.taskDetails().getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
        await expect(await taskPage.taskDetails().getDuration()).toEqual(await taskPage.taskDetails().getDuration());
        await expect(await taskPage.taskDetails().getEndDate()).toEqual(await taskPage.taskDetails().getEndDate());
        await expect(await taskPage.taskDetails().getParentTaskId()).toEqual('');
        await expect(await taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.COMPLETED);
    });

    it('[C260321] Should not be able to edit a completed task\'s details', async () => {
        const taskName = 'TaskCompleted';
        const form = await this.alfrescoJsApi.activiti.modelsApi.createModel(taskFormModel);
        const task = await this.alfrescoJsApi.activiti.taskApi.createNewTask({ 'name': taskName });
        await this.alfrescoJsApi.activiti.taskApi.attachForm(task.id, { 'formId': form.id });
        await this.alfrescoJsApi.activiti.taskApi.completeTaskForm(task.id, { values: { label: null } });

        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);

        await taskPage.tasksListPage().checkContentIsDisplayed(taskName);
        await taskPage.tasksListPage().selectRow(taskName);

        await taskPage.taskDetails().checkEditableAssigneeIsNotDisplayed();
        await taskPage.taskDetails().checkEditableFormIsNotDisplayed();
        await taskPage.taskDetails().checkEditDescriptionButtonIsNotDisplayed();
        await taskPage.taskDetails().checkEditPriorityButtonIsNotDisplayed();
        await taskPage.taskDetails().checkDueDatePickerButtonIsNotDisplayed();
    });

});
