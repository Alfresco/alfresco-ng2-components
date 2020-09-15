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

import {
    ApiService,
    ApplicationsUtil,
    BrowserActions,
    LoginPage,
    ProcessUtil,
    StringUtil,
    UsersActions
} from '@alfresco/adf-testing';
import { ProcessServicesPage } from './pages/process-services.page';
import { TasksPage } from './pages/tasks.page';
import { browser } from 'protractor';
import { TaskRepresentation } from '@alfresco/js-api';
import Task = require('../models/APS/Task');
import TaskModel = require('../models/APS/TaskModel');
import FormModel = require('../models/APS/FormModel');
import CONSTANTS = require('../util/constants');
import moment = require('moment');

describe('Task Details component', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const processServices = new ProcessServicesPage();
    const loginPage = new LoginPage();
    const taskPage = new TasksPage();

    const apiService = new ApiService();

    let processUserModel, appModel;
    const tasks = ['Modifying task', 'Information box', 'No form', 'Not Created', 'Refreshing form', 'Assignee task', 'Attach File'];
    const TASK_DATE_FORMAT = 'll';
    let formModel;

    const taskFormModel = {
        'name': StringUtil.generateRandomString(),
        'description': '',
        'modelType': 2,
        'stencilSet': 0
    };

    beforeAll(async () => {
        const usersActions = new UsersActions(apiService);

        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        processUserModel = await usersActions.createUser();

        await apiService.getInstance().login(processUserModel.email, processUserModel.password);
        const applicationsService = new ApplicationsUtil(apiService);
        appModel = await applicationsService.importPublishDeployApp(app.file_path);
        await loginPage.login(processUserModel.email, processUserModel.password);
    });

    afterAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
    });

    beforeEach(async () => {
        await BrowserActions.getUrl(browser.baseUrl + '/activiti');
    });

    it('[C260506] Should display task details for standalone task - Task App', async () => {
        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await taskPage.createTask({ name: tasks[1], description: 'Description', formName: app.formName });
        await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

        const allTasks = await apiService.getInstance().activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));

        const taskModel = new TaskModel(allTasks.data[0]);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        await expect(await taskPage.taskDetails().getCreated()).toEqual(moment(taskModel.getCreated()).format(TASK_DATE_FORMAT));
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

        const taskForm = await apiService.getInstance().activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);
        formModel = new FormModel(taskForm);

        await taskPage.taskDetails().waitFormNameEqual(formModel.getName());
    });

    it('[C263946] Should display task details for standalone task - Custom App', async () => {
        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.createTask({ name: tasks[1], description: 'Description', formName: app.formName });
        await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

        const allTasks = await apiService.getInstance().activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));

        const taskModel = new TaskModel(allTasks.data[0]);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());

        await expect(await taskPage.taskDetails().getCreated()).toEqual(moment(taskModel.getCreated()).format(TASK_DATE_FORMAT));
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

        const taskForm = await apiService.getInstance().activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);

        formModel = new FormModel(taskForm);

        await taskPage.taskDetails().waitFormNameEqual(formModel.getName());
    });

    it('[C286706] Should display task details for task - Task App', async () => {
        await new ProcessUtil(apiService).startProcessOfApp(appModel.name);

        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

        const allTasks = await apiService.getInstance().activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));

        const taskModel = new TaskModel(allTasks.data[0]);

        await taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        await expect(await taskPage.taskDetails().getCreated()).toEqual(moment(taskModel.getCreated()).format(TASK_DATE_FORMAT));
        await expect(await taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        await expect(await taskPage.taskDetails().getDescription()).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION);
        await expect(await taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        await expect(await taskPage.taskDetails().getCategory()).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY);
        await expect(await taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        await expect(await taskPage.taskDetails().getParentName()).toEqual(appModel.definition.models[1].name);
        await expect(await taskPage.taskDetails().getDuration()).toEqual('');
        await expect(await taskPage.taskDetails().getEndDate()).toEqual('');
        await expect(await taskPage.taskDetails().getParentTaskId()).toEqual('');
        await expect(await taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);

        const taskForm = await apiService.getInstance().activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);

        formModel = new FormModel(taskForm);

        await taskPage.taskDetails().waitFormNameEqual(formModel.getName());
    });

    it('[C286705] Should display task details for task - Custom App', async () => {
        await new ProcessUtil(apiService).startProcessOfApp(appModel.name);

        await (await processServices.goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

        const allTasks = await apiService.getInstance().activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        const taskModel = new TaskModel(allTasks.data[0]);

        await taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        await expect(await taskPage.taskDetails().getCreated()).toEqual(moment(taskModel.getCreated()).format(TASK_DATE_FORMAT));
        await expect(await taskPage.taskDetails().getId()).toEqual(taskModel.getId());
        await expect(await taskPage.taskDetails().getDescription()).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION);
        await expect(await taskPage.taskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
        await expect(await taskPage.taskDetails().getCategory()).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY);
        await expect(await taskPage.taskDetails().getDueDate()).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE);
        await expect(await taskPage.taskDetails().getParentName()).toEqual(appModel.definition.models[1].name);
        await expect(await taskPage.taskDetails().getDuration()).toEqual('');
        await expect(await taskPage.taskDetails().getEndDate()).toEqual('');
        await expect(await taskPage.taskDetails().getParentTaskId()).toEqual('');
        await expect(await taskPage.taskDetails().getStatus()).toEqual(CONSTANTS.TASK_STATUS.RUNNING);

        const taskForm = await apiService.getInstance().activiti.taskFormsApi.getTaskForm(allTasks.data[0].id);

        formModel = new FormModel(taskForm);

        await taskPage.taskDetails().waitFormNameEqual(formModel.getName());
    });

    it('[C286708] Should display task details for subtask - Task App', async () => {
        const taskName = 'TaskAppSubtask';
        const checklistName = 'TaskAppChecklist';
        await apiService.getInstance().activiti.taskApi.createNewTask(new TaskRepresentation({ 'name': taskName }));

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

        const allTasks = await apiService.getInstance().activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));

        const taskModel = new TaskModel(allTasks.data[0]);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        await expect(await taskPage.taskDetails().getCreated()).toEqual(moment(taskModel.getCreated()).format(TASK_DATE_FORMAT));
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

        await new ProcessUtil(apiService).startProcessOfApp(appModel.name);

        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

        const dialog = await taskPage.clickOnAddChecklistButton();
        await dialog.addName(checklistName);
        await dialog.clickCreateChecklistButton();

        await taskPage.checkChecklistIsDisplayed(checklistName);

        await taskPage.tasksListPage().checkContentIsDisplayed(checklistName);
        await taskPage.tasksListPage().selectRow(checklistName);

        const allTasks = await apiService.getInstance().activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));

        const taskModel = new TaskModel(allTasks.data[0]);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        await expect(await taskPage.taskDetails().getCreated()).toEqual(moment(taskModel.getCreated()).format(TASK_DATE_FORMAT));
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
        const taskId = await apiService.getInstance().activiti.taskApi.createNewTask(new TaskRepresentation({ 'name': taskName }));
        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await taskPage.tasksListPage().checkContentIsDisplayed(taskName);
        await taskPage.tasksListPage().selectRow(taskName);

        await taskPage.completeTaskNoForm();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().selectRow(taskName);

        const getTaskResponse = await apiService.getInstance().activiti.taskApi.getTask(taskId.id);

        const taskModel = new TaskModel(getTaskResponse);
        await taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName());
        await expect(await taskPage.taskDetails().getCreated()).toEqual(moment(taskModel.getCreated()).format(TASK_DATE_FORMAT));
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
        const form = await apiService.getInstance().activiti.modelsApi.createModel(taskFormModel);
        const task = await apiService.getInstance().activiti.taskApi.createNewTask(new TaskRepresentation({ 'name': taskName }));
        await apiService.getInstance().activiti.taskApi.attachForm(task.id, { 'formId': form.id });
        await apiService.getInstance().activiti.taskApi.completeTaskForm(task.id, { values: { label: null } });

        await (await processServices.goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);

        await taskPage.tasksListPage().checkContentIsDisplayed(taskName);
        await taskPage.tasksListPage().selectRow(taskName);

        await taskPage.taskDetails().checkEditableAssigneeIsNotDisplayed();
        await taskPage.taskDetails().checkEditableFormIsNotDisplayed();
        await taskPage.taskDetails().checkDueDatePickerButtonIsNotDisplayed();
    });
});
