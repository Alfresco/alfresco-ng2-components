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

import TestConfig = require('../test.config');
import resources = require('../util/resources');
import { browser } from 'protractor';
import CONSTANTS = require('../util/constants');
import dateFormat = require('dateformat');
import { Util } from '../util/util';

import AlfrescoApi = require('alfresco-js-api-node');
import { Tasks } from '../actions/APS-cloud/tasks';
import { ProcessDefinitions } from '../actions/APS-cloud/process-definitions';
import { ProcessInstances } from '../actions/APS-cloud/process-instances';
import { Query } from '../actions/APS-cloud/query';

import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { LoginSSOPage } from '../pages/adf/loginSSOPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { AppListCloudComponent } from '../pages/adf/process-cloud/appListCloudComponent';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { TaskDetailsCloudComponent } from '../pages/adf/process-cloud/TaskDetailsCloudComponent'

describe('Task Header cloud component', () => {

    let appModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
    let tasks = ['Modifying task', 'Information box', 'No form', 'Not Created', 'Refreshing form', 'Assignee task', 'Attach File'];
    let TASK_DATA_FORMAT = 'mmm dd yyyy';
    let formModel;
    let createdTaskName = Util.generateRandomString();
    let createdTask;
    const simpleApp = 'simple-app';
    let priority = 30, description="descriptionTask";

    let taskPage = new TasksPage();
    let taskDetailsCloudPage = new TaskDetailsCloudComponent();

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudComponent();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const tasksService: Tasks = new Tasks();

    let silentLogin;

    beforeAll(async (done) => {
        silentLogin = false;
        settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, silentLogin);
        loginSSOPage.clickOnSSOButton();
        loginSSOPage.loginAPS(user, password);

        await tasksService.init(user, password);
        let createdTaskId = await tasksService.createStandaloneTask(createdTaskName, simpleApp, {priority: priority, description: description});
        await tasksService.claimTask(createdTaskId.entry.id, simpleApp);
        createdTask = await tasksService.getTask(createdTaskId.entry.id, simpleApp);
        console.log("Created tasks: ", createdTask);

        done();
    });

    beforeEach(async (done) => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(simpleApp);
        done();
    });

    fit('[C260506] Should display task details for standalone task - Task App', async () => {
        tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(createdTaskName);
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().selectRowByContentName(createdTaskName);
        browser.driver.sleep(5000);
        expect(taskDetailsCloudPage.getId()).toEqual(createdTask.entry.id);
        expect(taskDetailsCloudPage.getDescription())
            .toEqual(createdTask.entry.description === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : createdTask.entry.description);
        expect(taskDetailsCloudPage.getStatus()).toEqual(createdTask.entry.status);
        expect(taskDetailsCloudPage.getPriority()).toEqual(createdTask.entry.priority === null ? '' : createdTask.entry.priority.toString());
        expect(taskDetailsCloudPage.getCategory()).toEqual(createdTask.entry.category === null ?
            CONSTANTS.TASK_DETAILS.NO_CATEGORY: createdTask.entry.category);


        //let allTasks = await browser.controlFlow().execute(async () => {
        //    return this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        //});

        //let taskModel = new TaskModel(allTasks.data[0]);
        /*taskPage.tasksListPage().getDataTable().checkContentIsDisplayed(taskModel.getName());
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
            .toEqual(formModel.getName() === null ? CONSTANTS.TASK_DETAILS.NO_FORM : formModel.getName());*/
    });

    it('[C263946] Should display task details for standalone task - Custom App', async () => {
        navigationBarPage.navigateToProcessServicesPage().goToApp(appModel.name).clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.createNewTask().addName(tasks[1]).addDescription('Description')
            .addForm(app.formName).clickStartButton();
        expect(taskPage.taskDetails().getTitle()).toEqual('Activities');

        let allTasks = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        });

        let taskModel = new TaskModel(allTasks.data[0]);
        taskPage.tasksListPage().getDataTable().checkContentIsDisplayed(taskModel.getName());

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

        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        expect(taskPage.taskDetails().getTitle()).toEqual('Activities');

        let allTasks = await browser.controlFlow().execute(async () => {
            return await this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({sort: 'created-desc'}));
        });

        let taskModel = new TaskModel(allTasks.data[0]);

        taskPage.tasksListPage().getDataTable().checkContentIsDisplayed(taskModel.getName());
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

        navigationBarPage.navigateToProcessServicesPage().goToApp(appModel.name).clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        expect(taskPage.taskDetails().getTitle()).toEqual('Activities');

        let allTasks = await browser.controlFlow().execute(async () => {
            return await this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({sort: 'created-desc'}));
        });

        let taskModel = new TaskModel(allTasks.data[0]);

        taskPage.tasksListPage().getDataTable().checkContentIsDisplayed(taskModel.getName());
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

        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.tasksListPage().getDataTable().checkContentIsDisplayed(taskName).selectRowByContentName(taskName);

        taskPage.clickOnAddChecklistButton().addName(checklistName).clickCreateChecklistButton();
        taskPage.checkChecklistIsDisplayed(checklistName);

        taskPage.tasksListPage().getDataTable().checkContentIsDisplayed(checklistName).selectRowByContentName(checklistName);

        let allTasks = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        });

        let checklistTask = new TaskModel(allTasks.data[0]);
        let taskModel = new TaskModel(allTasks.data[0]);
        taskPage.tasksListPage().getDataTable().checkContentIsDisplayed(checklistTask.getName());
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

        navigationBarPage.navigateToProcessServicesPage().goToApp(appModel.name).clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        expect(taskPage.taskDetails().getTitle()).toEqual('Activities');

        taskPage.clickOnAddChecklistButton().addName(checklistName).clickCreateChecklistButton();
        taskPage.checkChecklistIsDisplayed(checklistName);

        taskPage.tasksListPage().getDataTable().checkContentIsDisplayed(checklistName).selectRowByContentName(checklistName);

        let allTasks = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
        });

        let checklistTask = new TaskModel(allTasks.data[0]);
        let taskModel = new TaskModel(allTasks.data[0]);
        taskPage.tasksListPage().getDataTable().checkContentIsDisplayed(checklistTask.getName());
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

        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.tasksListPage().getDataTable().checkContentIsDisplayed(taskName).selectRowByContentName(taskName);

        taskPage.completeTaskNoForm();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        taskPage.tasksListPage().getDataTable().selectRowByContentName(taskName);

        let getTaskResponse = await browser.controlFlow().execute(async () => {
            return this.alfrescoJsApi.activiti.taskApi.getTask(taskId.id);
        });

        let completedTask = new TaskModel(getTaskResponse);
        taskPage.tasksListPage().getDataTable().checkContentIsDisplayed(completedTask.getName());
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
