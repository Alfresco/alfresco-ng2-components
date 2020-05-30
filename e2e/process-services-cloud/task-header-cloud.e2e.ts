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
import {
    ApiService,
    AppListCloudPage,
    GroupIdentityService,
    IdentityService,
    LocalStorageUtil,
    LoginSSOPage,
    StringUtil,
    TaskHeaderCloudPage,
    TasksService,
    StartTasksCloudPage,
    PeopleCloudComponentPage
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasks-cloud-demo.page';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import moment = require('moment');

const isValueInvalid = (value: any): boolean => {
    return value === null || value === undefined;
};

describe('Task Header cloud component', () => {
    const basicCreatedTaskName = StringUtil.generateRandomString();
    const completedTaskName = StringUtil.generateRandomString();
    const unclaimedTaskName = StringUtil.generateRandomString();
    let basicCreatedTask: any;
    let basicCreatedDate: any;
    let completedTask: any;
    let completedCreatedDate: string;
    let dueDate: string;
    let subTask: any;
    let subTaskCreatedDate: string;
    let completedEndDate: string;
    let defaultDate: string;
    let groupInfo: any;
    let testUser: any;
    let unclaimedTask: any;
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const priority = 30;
    const description = 'descriptionTask';
    const formatDate = 'MMM D, YYYY';
    const dateTimeFormat = 'MMM D, Y, H:mm';
    const defaultFormat = 'M/D/YY';

    const taskHeaderCloudPage = new TaskHeaderCloudPage();

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const startTaskCloudPage = new StartTasksCloudPage();
    const peopleCloudComponentPage = new PeopleCloudComponentPage();
    const apiService = new ApiService();
    let tasksService: TasksService;
    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;

    const createCompletedTask = async function () {
        const completedTaskId = await tasksService.createStandaloneTask(completedTaskName,
            simpleApp, { priority: priority, description: description, dueDate: basicCreatedTask.entry.createdDate });
        await tasksService.claimTask(completedTaskId.entry.id, simpleApp);
        await tasksService.completeTask(completedTaskId.entry.id, simpleApp);
        return tasksService.getTask(completedTaskId.entry.id, simpleApp);
    };

    const createSubTask = async function (createdTaskId) {
        const subTaskId = await tasksService.createStandaloneSubtask(createdTaskId.entry.id, simpleApp, StringUtil.generateRandomString());
        await tasksService.claimTask(subTaskId.entry.id, simpleApp);
        return  tasksService.getTask(subTaskId.entry.id, simpleApp);
    };

    const createTask = async function () {
        const createdTaskId = await tasksService.createStandaloneTask(basicCreatedTaskName, simpleApp);
        await tasksService.claimTask(createdTaskId.entry.id, simpleApp);
        basicCreatedTask = await tasksService.getTask(createdTaskId.entry.id, simpleApp);
        basicCreatedDate = moment(basicCreatedTask.entry.createdDate).format(formatDate);
        return createdTaskId;
    };

    beforeAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);

        testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.email, testUser.password);

        tasksService = new TasksService(apiService);

        unclaimedTask = await tasksService.createStandaloneTask(unclaimedTaskName, simpleApp);

        const createdTaskId = await createTask();

        completedTask = await createCompletedTask();

        completedCreatedDate = moment(completedTask.entry.createdDate).format(formatDate);
        dueDate = moment(completedTask.entry.dueDate).format(dateTimeFormat);
        completedEndDate = moment(completedTask.entry.endDate).format(formatDate);
        defaultDate = moment(completedTask.entry.createdDate).format(defaultFormat);

        subTask = await createSubTask(createdTaskId);
        subTaskCreatedDate = moment(subTask.entry.createdDate).format(formatDate);

        await browser.sleep(3000);
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
        await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(basicCreatedTaskName);
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(basicCreatedTaskName);

        await expect(await taskHeaderCloudPage.getId()).toEqual(basicCreatedTask.entry.id);
        await expect(await taskHeaderCloudPage.getDescription())
            .toEqual(isValueInvalid(basicCreatedTask.entry.description) ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : basicCreatedTask.entry.description);
        await expect(await taskHeaderCloudPage.getStatus()).toEqual('ASSIGNED');
        await expect(await taskHeaderCloudPage.getPriority()).toEqual(basicCreatedTask.entry.priority.toString());
        await expect(await taskHeaderCloudPage.getCategory()).toEqual(!basicCreatedTask.entry.category ?
            CONSTANTS.TASK_DETAILS.NO_CATEGORY : basicCreatedTask.entry.category);
        await expect(await taskHeaderCloudPage.getDueDate()).toEqual(isValueInvalid(basicCreatedTask.entry.dueDate) ?
            CONSTANTS.TASK_DETAILS.NO_DATE : basicCreatedDate);
        await expect(await taskHeaderCloudPage.getEndDate()).toEqual('');
        await expect(await taskHeaderCloudPage.getCreated()).toEqual(basicCreatedDate);
        await expect(await taskHeaderCloudPage.getAssignee()).toEqual(isValueInvalid(basicCreatedTask.entry.assignee) ? '' : basicCreatedTask.entry.assignee);
        await expect(await taskHeaderCloudPage.getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
    });

    it('[C291944] Should display task details for completed task', async () => {
        await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('completed-tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(completedTaskName);

        await expect(await taskHeaderCloudPage.getId()).toEqual(completedTask.entry.id);
        await expect(await taskHeaderCloudPage.getDescription())
            .toEqual(isValueInvalid(completedTask.entry.description) ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : completedTask.entry.description);
        await expect(await taskHeaderCloudPage.getStatus()).toEqual('COMPLETED');
        await expect(await taskHeaderCloudPage.getPriority()).toEqual(completedTask.entry.priority.toString());
        await expect(await taskHeaderCloudPage.getCategory()).toEqual(!completedTask.entry.category ?
            CONSTANTS.TASK_DETAILS.NO_CATEGORY : completedTask.entry.category);
        await expect(await taskHeaderCloudPage.getDueDate()).toEqual(isValueInvalid(completedTask.entry.dueDate) ?
            CONSTANTS.TASK_DETAILS.NO_DATE : dueDate);
        await expect(await taskHeaderCloudPage.getEndDate()).toEqual(completedEndDate);
        await expect(await taskHeaderCloudPage.getCreated()).toEqual(completedCreatedDate);
        await expect(await taskHeaderCloudPage.getAssignee()).toEqual(isValueInvalid(completedTask.entry.assignee) ? '' : completedTask.entry.assignee);
        await expect(await taskHeaderCloudPage.getParentName()).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT);
    });

    it('[C291945] Should Parent Name and Parent Id not be empty in task details for sub task', async () => {
        await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(subTask.entry.name);
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(subTask.entry.name);

        await expect(await taskHeaderCloudPage.getId()).toEqual(subTask.entry.id);
        await expect(await taskHeaderCloudPage.getDescription())
            .toEqual(isValueInvalid(subTask.entry.description) ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : subTask.entry.description);
        await expect(await taskHeaderCloudPage.getStatus()).toEqual('ASSIGNED');
        await expect(await taskHeaderCloudPage.getPriority()).toEqual(subTask.entry.priority.toString());
        await expect(await taskHeaderCloudPage.getCategory()).toEqual(!subTask.entry.category ?
            CONSTANTS.TASK_DETAILS.NO_CATEGORY : subTask.entry.category);
        await expect(await taskHeaderCloudPage.getDueDate()).toEqual(isValueInvalid(subTask.entry.dueDate) ? CONSTANTS.TASK_DETAILS.NO_DATE : subTaskCreatedDate);
        await expect(await taskHeaderCloudPage.getEndDate()).toEqual('');
        await expect(await taskHeaderCloudPage.getCreated()).toEqual(subTaskCreatedDate);
        await expect(await taskHeaderCloudPage.getAssignee()).toEqual(isValueInvalid(subTask.entry.assignee) ? '' : subTask.entry.assignee);
        await expect(await taskHeaderCloudPage.getParentName()).toEqual(basicCreatedTask.entry.name);
        await expect(await taskHeaderCloudPage.getParentTaskId())
            .toEqual(isValueInvalid(subTask.entry.parentTaskId) ? '' : subTask.entry.parentTaskId);
    });

    it('[C309698] Should validate the Priority field', async () => {
        const myTaskName = `Test_C309698_${StringUtil.generateRandomString()}`;
        await tasksCloudDemoPage.clickStartNewTaskButton();
        await startTaskCloudPage.addName(myTaskName);
        await startTaskCloudPage.typePriorityOf('50');
        await startTaskCloudPage.clickStartButton();
        await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(myTaskName);
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(myTaskName);
        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

        await taskHeaderCloudPage.priorityCardTextItem.enterTextField('$$%£W21');
        const errorMessage = await taskHeaderCloudPage.priorityCardTextItem.getErrorMessage();
        await expect(errorMessage).toBe('Enter a different value');

        await taskHeaderCloudPage.priorityCardTextItem.enterTextField('600');
        const currentValue = await taskHeaderCloudPage.priorityCardTextItem.getFieldValue();
        await expect(currentValue).toBe('600');
    });

    it('[C309698] Should validate the Priority field', async () => {
        await tasksCloudDemoPage.editTaskFilterCloud.openFilter();
        await tasksCloudDemoPage.editTaskFilterCloud.setStatusFilterDropDown('ALL');
        await tasksCloudDemoPage.editTaskFilterCloud.clearAssignee();

        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(unclaimedTask.entry.name);
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(unclaimedTask.entry.name);
        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

        const currentAssignee = await taskHeaderCloudPage.assigneeCardTextItem.getFieldValue();
        await expect(currentAssignee).toBe('No assignee');

        await taskHeaderCloudPage.priorityCardTextItem.checkElementIsReadonly();
        await taskHeaderCloudPage.statusCardTextItem.checkElementIsReadonly();
    });

    it('[C291991] Should be able to assign a task only to the users that have access to the selected app', async () => {
        await tasksCloudDemoPage.clickStartNewTaskButton();
        const currentAssignee = await peopleCloudComponentPage.getChipAssignee();
        await expect(currentAssignee).toContain(testUser.firstName, 'Invalid Assignee first name set for the new task');
        await expect(currentAssignee).toContain(testUser.lastName, 'Invalid Assignee last name set for the new task');

        await peopleCloudComponentPage.searchAssignee('hrUser');
        await peopleCloudComponentPage.selectAssigneeFromList('HR User');
        await peopleCloudComponentPage.checkSelectedPeople('HR User');

        await peopleCloudComponentPage.searchAssignee('processAdmin');
        await peopleCloudComponentPage.selectAssigneeFromList('Process Admin User');
        await peopleCloudComponentPage.checkSelectedPeople('Process Admin User');

        await peopleCloudComponentPage.searchAssignee('modeler');
        await peopleCloudComponentPage.checkNoResultsFoundError();
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
            await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('completed-tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(completedTaskName);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
            await expect(await taskHeaderCloudPage.getCreated()).toEqual(defaultDate);
        });
    });
});
