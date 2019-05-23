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
import { AppListCloudPage, StringUtil, ApiService, LoginSSOPage, TasksService, QueryService,
    ProcessDefinitionsService, ProcessInstancesService } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { TaskDetailsCloudDemoPage } from '../pages/adf/demo-shell/process-services/taskDetailsCloudDemoPage';

import resources = require('../util/resources');

describe('Complete task - cloud directive', () => {

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const taskDetailsCloudDemoPage = new TaskDetailsCloudDemoPage();

    let tasksService: TasksService;
    let processDefinitionService: ProcessDefinitionsService;
    let processInstancesService: ProcessInstancesService;
    let queryService: QueryService;

    let completedTask, createdTask, assigneeTask, toBeCompletedTask, completedProcess, claimedTask;
    const candidateuserapp = resources.ACTIVITI7_APPS.CANDIDATE_USER_APP.name;
    const completedTaskName = StringUtil.generateRandomString(), assignedTaskName = StringUtil.generateRandomString();

    beforeAll(async (done) => {
        const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers);
        await apiService.login(browser.params.identityUser.email, browser.params.identityUser.password);

        tasksService = new TasksService(apiService);
        createdTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), candidateuserapp);

        assigneeTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), candidateuserapp);
        await tasksService.claimTask(assigneeTask.entry.id, candidateuserapp);

        toBeCompletedTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), candidateuserapp);
        await tasksService.claimTask(toBeCompletedTask.entry.id, candidateuserapp);

        completedTask = await tasksService.createStandaloneTask(assignedTaskName, candidateuserapp);
        await tasksService.claimTask(completedTask.entry.id, candidateuserapp);
        await tasksService.createAndCompleteTask(completedTaskName, candidateuserapp);

        processDefinitionService = new ProcessDefinitionsService(apiService);
        const processDefinition = await processDefinitionService.getProcessDefinitions(candidateuserapp);

        processInstancesService = new ProcessInstancesService(apiService);
        completedProcess = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, candidateuserapp);

        queryService = new QueryService(apiService);
        const task = await queryService.getProcessInstanceTasks(completedProcess.entry.id, candidateuserapp);
        tasksService = new TasksService(apiService);
        claimedTask = await tasksService.claimTask(task.list.entries[0].entry.id, candidateuserapp);

        browser.get('/');
        loginSSOPage.loginSSOIdentityService(browser.params.identityUser.email, browser.params.identityUser.password);
        done();
    });

    beforeEach(() => {
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        appListCloudComponent.goToApp(candidateuserapp);
    });

    it('[C307093] Complete button is not displayed when the task is already completed', () => {
        tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
        expect(tasksCloudDemoPage.getActiveFilterName()).toBe('Completed Tasks');
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
        tasksCloudDemoPage.taskListCloudComponent().selectRow(completedTaskName);
        taskDetailsCloudDemoPage.checkTaskDetailsHeaderIsDisplayed();
        taskDetailsCloudDemoPage.taskFormCloud().checkCompleteButtonIsNotDisplayed();
    });

    it('[C307095] Task can not be completed by owner user', () => {
        tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
        tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().clearAssignee().setStatusFilterDropDown('CREATED');

        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name);
        tasksCloudDemoPage.taskListCloudComponent().selectRow(createdTask.entry.name);
        taskDetailsCloudDemoPage.checkTaskDetailsHeaderIsDisplayed();
        taskDetailsCloudDemoPage.taskFormCloud().checkCompleteButtonIsNotDisplayed();
    });

    it('[C307110] Task list is displayed after clicking on Cancel button', () => {
        tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assigneeTask.entry.name);
        tasksCloudDemoPage.taskListCloudComponent().selectRow(assigneeTask.entry.name);
        taskDetailsCloudDemoPage.checkTaskDetailsHeaderIsDisplayed();
        taskDetailsCloudDemoPage.taskFormCloud().clickCancelButton();

        expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assigneeTask.entry.name);
    });

    it('[C307094] Standalone Task can be completed by a user that is owner and assignee', () => {
        tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(toBeCompletedTask.entry.name);
        tasksCloudDemoPage.taskListCloudComponent().selectRow(toBeCompletedTask.entry.name);
        taskDetailsCloudDemoPage.checkTaskDetailsHeaderIsDisplayed();
        taskDetailsCloudDemoPage.taskFormCloud().checkCompleteButtonIsDisplayed().clickCompleteButton();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(toBeCompletedTask.entry.name);

        tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(toBeCompletedTask.entry.name);
        taskDetailsCloudDemoPage.taskFormCloud().checkCompleteButtonIsNotDisplayed();
    });

    it('[C307111] Task of a process can be completed by a user that is owner and assignee', () => {
        tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(claimedTask.entry.name);
        tasksCloudDemoPage.taskListCloudComponent().selectRow(claimedTask.entry.name);
        taskDetailsCloudDemoPage.checkTaskDetailsHeaderIsDisplayed();
        taskDetailsCloudDemoPage.taskFormCloud().checkCompleteButtonIsDisplayed().clickCompleteButton();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(claimedTask.entry.name);

        tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(claimedTask.entry.name);
        taskDetailsCloudDemoPage.taskFormCloud().checkCompleteButtonIsNotDisplayed();
    });

});
