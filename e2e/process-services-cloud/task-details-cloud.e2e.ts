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
import CONSTANTS = require('../util/constants');
import { Util } from '../util/util';
import moment = require('moment');

import { Tasks } from '../actions/APS-cloud/tasks';

import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { LoginSSOPage } from '@alfresco/adf-testing';
import { SettingsPage } from '../pages/adf/settingsPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { TaskHeaderCloudPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';

describe('Task Header cloud component', () => {

    const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
    let basicCreatedTaskName = Util.generateRandomString(), completedTaskName = Util.generateRandomString();
    let basicCreatedTask, basicCreatedDate, completedTask, completedCreatedDate, subTask, subTaskCreatedDate;
    const simpleApp = 'simple-app';
    let priority = 30, description = 'descriptionTask', formatDate = 'MMM DD YYYY';

    let taskHeaderCloudPage = new TaskHeaderCloudPage();

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const tasksService: Tasks = new Tasks();

    let silentLogin;

    beforeAll(async (done) => {
        silentLogin = false;
        settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
        loginSSOPage.clickOnSSOButton();
        browser.ignoreSynchronization = true;
        loginSSOPage.loginSSOIdentityService(user, password);

        await tasksService.init(user, password);
        let createdTaskId = await tasksService.createStandaloneTask(basicCreatedTaskName, simpleApp);
        await tasksService.claimTask(createdTaskId.entry.id, simpleApp);
        basicCreatedTask = await tasksService.getTask(createdTaskId.entry.id, simpleApp);
        basicCreatedDate = moment(basicCreatedTask.entry.createdDate).format(formatDate);

        let completedTaskId = await tasksService.createStandaloneTask(completedTaskName,
            simpleApp, {priority: priority, description: description, dueDate: basicCreatedTask.entry.createdDate});
        await tasksService.claimTask(completedTaskId.entry.id, simpleApp);
        await tasksService.completeTask(completedTaskId.entry.id, simpleApp);
        completedTask = await tasksService.getTask(completedTaskId.entry.id, simpleApp);
        completedCreatedDate = moment(completedTask.entry.createdDate).format(formatDate);

        let subTaskId = await tasksService.createStandaloneSubtask(createdTaskId.entry.id, simpleApp, Util.generateRandomString());
        await tasksService.claimTask(subTaskId.entry.id, simpleApp);
        subTask = await tasksService.getTask(subTaskId.entry.id, simpleApp);
        subTaskCreatedDate = moment(subTask.entry.createdDate).format(formatDate);

        done();
    });

    beforeEach(async (done) => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(simpleApp);
        done();
    });

    it('[C291943] Should display task details for assigned task', async () => {
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
        expect(taskHeaderCloudPage.getCreated()).toEqual(basicCreatedDate);
        expect(taskHeaderCloudPage.getAssignee()).toEqual(basicCreatedTask.entry.assignee === null ? '' : basicCreatedTask.entry.assignee);
        expect(taskHeaderCloudPage.getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
        expect(taskHeaderCloudPage.getParentTaskId())
            .toEqual(basicCreatedTask.entry.parentTaskId === null ? '' : basicCreatedTask.entry.parentTaskId);
    });

    it('[C291944] Should display task details for completed task', async () => {
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
        expect(taskHeaderCloudPage.getCreated()).toEqual(completedCreatedDate);
        expect(taskHeaderCloudPage.getAssignee()).toEqual(completedTask.entry.assignee === null ? '' : completedTask.entry.assignee);
        expect(taskHeaderCloudPage.getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
        expect(taskHeaderCloudPage.getParentTaskId())
            .toEqual(completedTask.entry.parentTaskId === null ? '' : completedTask.entry.parentTaskId);
    });

    it('[C291945] Should Parent Name and Parent Id not be empty in task details for sub task', async () => {
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
        expect(taskHeaderCloudPage.getCreated()).toEqual(subTaskCreatedDate);
        expect(taskHeaderCloudPage.getAssignee()).toEqual(subTask.entry.assignee === null ? '' : subTask.entry.assignee);
        expect(taskHeaderCloudPage.getParentName()).toEqual(basicCreatedTask.entry.name);
        expect(taskHeaderCloudPage.getParentTaskId())
            .toEqual(subTask.entry.parentTaskId === null ? '' : subTask.entry.parentTaskId);
    });

});
