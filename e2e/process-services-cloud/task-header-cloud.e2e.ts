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
import { ApiService, StringUtil, IdentityService, GroupIdentityService, LocalStorageUtil } from '@alfresco/adf-testing';
import moment = require('moment');
import { browser } from 'protractor';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { LoginSSOPage, AppListCloudPage, TaskHeaderCloudPage, TasksService } from '@alfresco/adf-testing';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';

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
    let defaultDate;
    let groupInfo, testUser;
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const priority = 30;
    const description = 'descriptionTask';
    const formatDate = 'MMM D, YYYY';
    const defaultFormat = 'M/D/YY';

    const taskHeaderCloudPage = new TaskHeaderCloudPage();

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers);
    let tasksService: TasksService;
    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;

    beforeAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);

        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.email, testUser.password);

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
        defaultDate = moment(completedTask.entry.createdDate).format(defaultFormat);

        const subTaskId = await tasksService.createStandaloneSubtask(createdTaskId.entry.id, simpleApp, StringUtil.generateRandomString());
        await tasksService.claimTask(subTaskId.entry.id, simpleApp);
        subTask = await tasksService.getTask(subTaskId.entry.id, simpleApp);
        subTaskCreatedDate = moment(subTask.entry.createdDate).format(formatDate);

        await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);

    });

    afterAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await identityService.deleteIdentityUser(testUser.idIdentityService);
    });

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(simpleApp);
    });

    it('[C291943] Should display task details for assigned task', async () => {
        await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(basicCreatedTaskName);
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(basicCreatedTaskName);
        await expect(await taskHeaderCloudPage.getId()).toEqual(basicCreatedTask.entry.id);
        await expect(await taskHeaderCloudPage.getDescription())
            .toEqual(basicCreatedTask.entry.description === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : basicCreatedTask.entry.description);
        await expect(await taskHeaderCloudPage.getStatus()).toEqual(basicCreatedTask.entry.status);
        await expect(await taskHeaderCloudPage.getPriority()).toEqual(basicCreatedTask.entry.priority === 0 ? '' : basicCreatedTask.entry.priority.toString());
        await expect(await taskHeaderCloudPage.getCategory()).toEqual(!basicCreatedTask.entry.category ?
            CONSTANTS.TASK_DETAILS.NO_CATEGORY : basicCreatedTask.entry.category);
        await expect(await taskHeaderCloudPage.getDueDate()).toEqual(basicCreatedTask.entry.dueDate === null ?
            CONSTANTS.TASK_DETAILS.NO_DATE : basicCreatedDate);
        await expect(await taskHeaderCloudPage.getEndDate()).toEqual('');
        await expect(await taskHeaderCloudPage.getCreated()).toEqual(basicCreatedDate);
        await expect(await taskHeaderCloudPage.getAssignee()).toEqual(basicCreatedTask.entry.assignee === null ? '' : basicCreatedTask.entry.assignee);
        await expect(await taskHeaderCloudPage.getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
    });

    it('[C291944] Should display task details for completed task', async () => {
        await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        await tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(completedTaskName);
        await expect(await taskHeaderCloudPage.getId()).toEqual(completedTask.entry.id);
        await expect(await taskHeaderCloudPage.getDescription())
            .toEqual(completedTask.entry.description === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : completedTask.entry.description);
        await expect(await taskHeaderCloudPage.getStatus()).toEqual(completedTask.entry.status);
        await expect(await taskHeaderCloudPage.getPriority()).toEqual(completedTask.entry.priority === '0' ? '' : completedTask.entry.priority.toString());
        await expect(await taskHeaderCloudPage.getCategory()).toEqual(!completedTask.entry.category ?
            CONSTANTS.TASK_DETAILS.NO_CATEGORY : completedTask.entry.category);
        await expect(await taskHeaderCloudPage.getDueDate()).toEqual(completedTask.entry.dueDate === null ?
            CONSTANTS.TASK_DETAILS.NO_DATE : completedCreatedDate);
        await expect(await taskHeaderCloudPage.getEndDate()).toEqual(completedEndDate);
        await expect(await taskHeaderCloudPage.getCreated()).toEqual(completedCreatedDate);
        await expect(await taskHeaderCloudPage.getAssignee()).toEqual(completedTask.entry.assignee === null ? '' : completedTask.entry.assignee);
        await expect(await taskHeaderCloudPage.getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
    });

    it('[C291945] Should Parent Name and Parent Id not be empty in task details for sub task', async () => {
        await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(subTask.entry.name);
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(subTask.entry.name);
        await expect(await taskHeaderCloudPage.getId()).toEqual(subTask.entry.id);
        await expect(await taskHeaderCloudPage.getDescription())
            .toEqual(subTask.entry.description === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : subTask.entry.description);
        await expect(await taskHeaderCloudPage.getStatus()).toEqual(subTask.entry.status);
        await expect(await taskHeaderCloudPage.getPriority()).toEqual(subTask.entry.priority === 0 ? '' : subTask.entry.priority.toString());
        await expect(await taskHeaderCloudPage.getCategory()).toEqual(!subTask.entry.category ?
            CONSTANTS.TASK_DETAILS.NO_CATEGORY : subTask.entry.category);
        await expect(await taskHeaderCloudPage.getDueDate()).toEqual(subTask.entry.dueDate === null ?
            CONSTANTS.TASK_DETAILS.NO_DATE : subTaskCreatedDate);
        await expect(await taskHeaderCloudPage.getEndDate()).toEqual('');
        await expect(await taskHeaderCloudPage.getCreated()).toEqual(subTaskCreatedDate);
        await expect(await taskHeaderCloudPage.getAssignee()).toEqual(subTask.entry.assignee === null ? '' : subTask.entry.assignee);
        await expect(await taskHeaderCloudPage.getParentName()).toEqual(basicCreatedTask.entry.name);
        await expect(await taskHeaderCloudPage.getParentTaskId())
            .toEqual(subTask.entry.parentTaskId === null ? '' : subTask.entry.parentTaskId);
    });

    describe('Default Date format', () => {
        beforeEach(async () => {
            await LocalStorageUtil.setConfigField('dateValues', '{' +
                '"defaultDateFormat": "shortDate",' +
                '"defaultDateTimeFormat": "M/d/yy, h:mm a",' +
                '"defaultLocale": "uk"' +
                '}');
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
        });

        it('[C311280] Should pick up the default date format from the app configuration', async () => {
            await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            await tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(completedTaskName);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
            await expect(await taskHeaderCloudPage.getCreated()).toEqual(defaultDate);
        });
    });
});
