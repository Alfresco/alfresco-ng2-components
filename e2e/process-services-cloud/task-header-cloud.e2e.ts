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

import CONSTANTS = require('../util/constants');
import { ApiService, StringUtil, SettingsPage } from '@alfresco/adf-testing';
import moment = require('moment');
import { browser } from 'protractor';

import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { LoginSSOPage, AppListCloudPage, TaskHeaderCloudPage, TasksService } from '@alfresco/adf-testing';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import resources = require('../util/resources');

describe('Task Header cloud component', () => {
    const basicCreatedTaskName = StringUtil.generateRandomString();
    const completedTaskName = StringUtil.generateRandomString();
    let basicCreatedTask;
    let basicCreatedDate;
    let completedTask;
    let completedCreatedDate;
    let subTask;
    let subTaskCreatedDate;
    let completedEndDate;
    const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
    const priority = 30;
    const description = 'descriptionTask';
    const formatDate = 'DD-MM-YYYY';

    const taskHeaderCloudPage = new TaskHeaderCloudPage();

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const settingsPage = new SettingsPage();
    let tasksService: TasksService;

    beforeAll(async (done) => {
        const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers);
        await apiService.login(browser.params.identityUser.email, browser.params.identityUser.password);

        tasksService = new TasksService(apiService);

        const createdTaskId = await tasksService.createStandaloneTask(basicCreatedTaskName, simpleApp);
        await tasksService.claimTask(createdTaskId.entry.id, simpleApp);
        basicCreatedTask = await tasksService.getTask(createdTaskId.entry.id, simpleApp);
        basicCreatedDate = moment(basicCreatedTask.entry.createdDate).format(formatDate);

        const completedTaskId = await tasksService.createStandaloneTask(completedTaskName,
            simpleApp, {priority: priority, description: description, dueDate: basicCreatedTask.entry.createdDate});
        await tasksService.claimTask(completedTaskId.entry.id, simpleApp);
        await tasksService.completeTask(completedTaskId.entry.id, simpleApp);
        completedTask = await tasksService.getTask(completedTaskId.entry.id, simpleApp);
        completedCreatedDate = moment(completedTask.entry.createdDate).format(formatDate);
        completedEndDate = moment(completedTask.entry.endDate).format(formatDate);

        const subTaskId = await tasksService.createStandaloneSubtask(createdTaskId.entry.id, simpleApp, StringUtil.generateRandomString());
        await tasksService.claimTask(subTaskId.entry.id, simpleApp);
        subTask = await tasksService.getTask(subTaskId.entry.id, simpleApp);
        subTaskCreatedDate = moment(subTask.entry.createdDate).format(formatDate);

        await settingsPage.setProviderBpmSso(
            browser.params.config.bpmHost,
            browser.params.config.oauth2.host,
            browser.params.config.identityHost);
        loginSSOPage.loginSSOIdentityService(browser.params.identityUser.email, browser.params.identityUser.password);
        done();
    });

    beforeEach(() => {
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        appListCloudComponent.goToApp(simpleApp);
    });

    it('[C291943] Should display task details for assigned task', () => {
        tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(basicCreatedTaskName);
        tasksCloudDemoPage.taskListCloudComponent().selectRow(basicCreatedTaskName);
        expect(taskHeaderCloudPage.getId()).toEqual(basicCreatedTask.entry.id);
        expect(taskHeaderCloudPage.getDescription())
            .toEqual(basicCreatedTask.entry.description === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : basicCreatedTask.entry.description);
        expect(taskHeaderCloudPage.getStatus()).toEqual(basicCreatedTask.entry.status);
        expect(taskHeaderCloudPage.getPriority()).toEqual(basicCreatedTask.entry.priority === 0 ? '' : basicCreatedTask.entry.priority.toString());
        expect(taskHeaderCloudPage.getCategory()).toEqual(!basicCreatedTask.entry.category ?
            CONSTANTS.TASK_DETAILS.NO_CATEGORY : basicCreatedTask.entry.category);
        expect(taskHeaderCloudPage.getDueDate()).toEqual(basicCreatedTask.entry.dueDate === null ?
            CONSTANTS.TASK_DETAILS.NO_DATE : basicCreatedDate);
        expect(taskHeaderCloudPage.getEndDate()).toEqual('');
        expect(taskHeaderCloudPage.getCreated()).toEqual(basicCreatedDate);
        expect(taskHeaderCloudPage.getAssignee()).toEqual(basicCreatedTask.entry.assignee === null ? '' : basicCreatedTask.entry.assignee);
        expect(taskHeaderCloudPage.getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
        expect(taskHeaderCloudPage.getParentTaskId())
            .toEqual(basicCreatedTask.entry.parentTaskId === null ? '' : basicCreatedTask.entry.parentTaskId);
    });

    it('[C291944] Should display task details for completed task', () => {
        tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
        tasksCloudDemoPage.taskListCloudComponent().selectRow(completedTaskName);
        expect(taskHeaderCloudPage.getId()).toEqual(completedTask.entry.id);
        expect(taskHeaderCloudPage.getDescription())
            .toEqual(completedTask.entry.description === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : completedTask.entry.description);
        expect(taskHeaderCloudPage.getStatus()).toEqual(completedTask.entry.status);
        expect(taskHeaderCloudPage.getPriority()).toEqual(completedTask.entry.priority === '0' ? '' : completedTask.entry.priority.toString());
        expect(taskHeaderCloudPage.getCategory()).toEqual(!completedTask.entry.category ?
            CONSTANTS.TASK_DETAILS.NO_CATEGORY : completedTask.entry.category);
        expect(taskHeaderCloudPage.getDueDate()).toEqual(completedTask.entry.dueDate === null ?
            CONSTANTS.TASK_DETAILS.NO_DATE : completedCreatedDate);
        expect(taskHeaderCloudPage.getEndDate()).toEqual(completedEndDate);
        expect(taskHeaderCloudPage.getCreated()).toEqual(completedCreatedDate);
        expect(taskHeaderCloudPage.getAssignee()).toEqual(completedTask.entry.assignee === null ? '' : completedTask.entry.assignee);
        expect(taskHeaderCloudPage.getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
        expect(taskHeaderCloudPage.getParentTaskId())
            .toEqual(completedTask.entry.parentTaskId === null ? '' : completedTask.entry.parentTaskId);
    });

    it('[C291945] Should Parent Name and Parent Id not be empty in task details for sub task', () => {
        tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(subTask.entry.name);
        tasksCloudDemoPage.taskListCloudComponent().selectRow(subTask.entry.name);
        expect(taskHeaderCloudPage.getId()).toEqual(subTask.entry.id);
        expect(taskHeaderCloudPage.getDescription())
            .toEqual(subTask.entry.description === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : subTask.entry.description);
        expect(taskHeaderCloudPage.getStatus()).toEqual(subTask.entry.status);
        expect(taskHeaderCloudPage.getPriority()).toEqual(subTask.entry.priority === 0 ? '' : subTask.entry.priority.toString());
        expect(taskHeaderCloudPage.getCategory()).toEqual(!subTask.entry.category ?
            CONSTANTS.TASK_DETAILS.NO_CATEGORY : subTask.entry.category);
        expect(taskHeaderCloudPage.getDueDate()).toEqual(subTask.entry.dueDate === null ?
            CONSTANTS.TASK_DETAILS.NO_DATE : subTaskCreatedDate);
        expect(taskHeaderCloudPage.getEndDate()).toEqual('');
        expect(taskHeaderCloudPage.getCreated()).toEqual(subTaskCreatedDate);
        expect(taskHeaderCloudPage.getAssignee()).toEqual(subTask.entry.assignee === null ? '' : subTask.entry.assignee);
        expect(taskHeaderCloudPage.getParentName()).toEqual(basicCreatedTask.entry.name);
        expect(taskHeaderCloudPage.getParentTaskId())
            .toEqual(subTask.entry.parentTaskId === null ? '' : subTask.entry.parentTaskId);
    });
});
