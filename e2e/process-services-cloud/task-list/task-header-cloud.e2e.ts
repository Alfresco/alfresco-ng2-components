/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import CONSTANTS = require('../../util/constants');
import { createApiService,
    AppListCloudPage,
    GroupIdentityService,
    IdentityService,
    LoginPage,
    StringUtil,
    TaskHeaderCloudPage,
    TasksService,
    PeopleCloudComponentPage
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import * as moment from 'moment';

const isValueInvalid = (value: any): boolean => value === null || value === undefined;

describe('Task Header cloud component', () => {

    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();

    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const editTaskFilter = tasksCloudDemoPage.editTaskFilterCloud;
    const taskFilter = tasksCloudDemoPage.taskFilterCloudComponent;
    const taskList = tasksCloudDemoPage.taskListCloudComponent();

    const peopleCloudComponentPage = new PeopleCloudComponentPage();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();

    const apiService = createApiService();
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);
    const tasksService = new TasksService(apiService);

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
    let groupInfo: any;
    let testUser: any;
    let unclaimedTask: any;
    const priority = 0;
    const description = 'descriptionTask';
    const formatDate = 'MMM D, YYYY';
    const dateTimeFormat = 'MMM D, Y, H:mm';

    const createCompletedTask = async function() {
        const completedTaskId = await tasksService.createStandaloneTask(completedTaskName,
            simpleApp, { priority, description, dueDate: basicCreatedTask.entry.createdDate });
        await tasksService.claimTask(completedTaskId.entry.id, simpleApp);
        await tasksService.completeTask(completedTaskId.entry.id, simpleApp);
        return tasksService.getTask(completedTaskId.entry.id, simpleApp);
    };

    const createSubTask = async function(createdTaskId) {
        const subTaskId = await tasksService.createStandaloneSubtask(createdTaskId.entry.id, simpleApp, StringUtil.generateRandomString());
        await tasksService.claimTask(subTaskId.entry.id, simpleApp);
        return  tasksService.getTask(subTaskId.entry.id, simpleApp);
    };

    const createTask = async function() {
        const createdTaskId = await tasksService.createStandaloneTask(basicCreatedTaskName, simpleApp);
        await tasksService.claimTask(createdTaskId.entry.id, simpleApp);
        basicCreatedTask = await tasksService.getTask(createdTaskId.entry.id, simpleApp);
        basicCreatedDate = moment(basicCreatedTask.entry.createdDate).format(formatDate);
        return createdTaskId;
    };

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.username, testUser.password);

        unclaimedTask = await tasksService.createStandaloneTask(unclaimedTaskName, simpleApp);

        const createdTaskId = await createTask();

        completedTask = await createCompletedTask();

        completedCreatedDate = moment(completedTask.entry.createdDate).format(formatDate);
        dueDate = moment(completedTask.entry.dueDate).format(dateTimeFormat);
        completedEndDate = moment(completedTask.entry.endDate).format(formatDate);

        subTask = await createSubTask(createdTaskId);
        subTaskCreatedDate = moment(subTask.entry.createdDate).format(formatDate);

        await browser.sleep(3000);
        await loginSSOPage.login(testUser.username, testUser.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('identityAdmin');
        await identityService.deleteIdentityUser(testUser.idIdentityService);
    });

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(simpleApp);
    });

    it('[C291943] Should display task details for assigned task', async () => {
        await taskFilter.clickTaskFilter('my-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(basicCreatedTaskName);
        await taskList.selectRow(basicCreatedTaskName);
        await tasksCloudDemoPage.waitTillContentLoaded();
        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

        await expect(await taskHeaderCloudPage.getId()).toEqual(basicCreatedTask.entry.id);
        await expect(await taskHeaderCloudPage.getDescription())
            .toEqual(isValueInvalid(basicCreatedTask.entry.description) ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : basicCreatedTask.entry.description);
        await expect(await taskHeaderCloudPage.getStatus()).toEqual('ASSIGNED');
        await expect(await taskHeaderCloudPage.getPriority()).toEqual('None');
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
        await taskFilter.clickTaskFilter('completed-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(completedTaskName);
        await taskList.selectRow(completedTaskName);
        await tasksCloudDemoPage.waitTillContentLoaded();
        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

        await expect(await taskHeaderCloudPage.getId()).toEqual(completedTask.entry.id);
        await expect(await taskHeaderCloudPage.getDescription())
            .toEqual(isValueInvalid(completedTask.entry.description) ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : completedTask.entry.description);
        await expect(await taskHeaderCloudPage.getStatus()).toEqual('COMPLETED');
        await expect(await taskHeaderCloudPage.getReadonlyPriority()).toEqual('None');
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
        await taskFilter.clickTaskFilter('my-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(subTask.entry.name);
        await taskList.selectRow(subTask.entry.name);
        await tasksCloudDemoPage.waitTillContentLoaded();
        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

        await expect(await taskHeaderCloudPage.getId()).toEqual(subTask.entry.id);
        await expect(await taskHeaderCloudPage.getDescription())
            .toEqual(isValueInvalid(subTask.entry.description) ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : subTask.entry.description);
        await expect(await taskHeaderCloudPage.getStatus()).toEqual('ASSIGNED');
        await expect(await taskHeaderCloudPage.getPriority()).toEqual('None');
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
        await editTaskFilter.openFilter();
        await editTaskFilter.setStatusFilterDropDown('All');
        await editTaskFilter.clearAssignee();

        await taskList.checkContentIsDisplayedByName(unclaimedTask.entry.name);
        await taskList.selectRow(unclaimedTask.entry.name);
        await tasksCloudDemoPage.waitTillContentLoaded();

        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

        const currentAssignee = await taskHeaderCloudPage.assigneeCardTextItem.getFieldValue();
        await expect(currentAssignee).toBe('No assignee');

        await taskHeaderCloudPage.priorityCardSelectItem.checkElementIsReadonly();
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

        await peopleCloudComponentPage.searchAssignee('modeler');
        await peopleCloudComponentPage.checkNoResultsFoundError();
    });
});
