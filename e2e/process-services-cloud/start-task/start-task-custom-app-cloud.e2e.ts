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

import { browser } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksCloudDemoPage } from '.././pages/tasks-cloud-demo.page';
import {
    LoginPage,
    AppListCloudPage,
    StringUtil,
    TaskHeaderCloudPage,
    StartTasksCloudPage,
    PeopleCloudComponentPage,
    TasksService, createApiService,
    IdentityService,
    GroupIdentityService
} from '@alfresco/adf-testing';

describe('Start Task', () => {

    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    const loginSSOPage = new LoginPage();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();

    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const editTaskFilter = tasksCloudDemoPage.editTaskFilterCloud;
    const taskFilter = tasksCloudDemoPage.taskFilterCloudComponent;
    const taskList = tasksCloudDemoPage.taskListCloudComponent();

    const startTask = new StartTasksCloudPage();
    const peopleCloudComponent = new PeopleCloudComponentPage();

    const apiService = createApiService();
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);

    const standaloneTaskName = StringUtil.generateRandomString(5);
    const reassignTaskName = StringUtil.generateRandomString(5);
    const unassignedTaskName = StringUtil.generateRandomString(5);
    const taskName255Characters = StringUtil.generateRandomString(255);
    const taskNameBiggerThen255Characters = StringUtil.generateRandomString(256);
    const lengthValidationError = 'Length exceeded, 255 characters max.';
    const requiredError = 'Field required';
    const dateValidationError = 'Date format DD/MM/YYYY';
    let apsUser; let testUser; let activitiUser; let groupInfo;

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);
        apsUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER, identityService.ROLES.ACTIVITI_USER]);

        activitiUser = await identityService.createIdentityUser();
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await identityService.addUserToGroup(apsUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.username, testUser.password);

        await loginSSOPage.login(testUser.username, testUser.password);
    });

    afterAll(async () => {
        const tasksService = new TasksService(apiService);

        let taskId = await tasksService.getTaskId(standaloneTaskName, simpleApp);
        await tasksService.deleteTask(taskId, simpleApp);
        taskId = await tasksService.getTaskId(unassignedTaskName, simpleApp);
        await tasksService.deleteTask(taskId, simpleApp);

        await apiService.login(apsUser.username, apsUser.password);
        taskId = await tasksService.getTaskId(reassignTaskName, simpleApp);
        await tasksService.deleteTask(taskId, simpleApp);

        await apiService.loginWithProfile('identityAdmin');
        await identityService.deleteIdentityUser(activitiUser.idIdentityService);
        await identityService.deleteIdentityUser(apsUser.idIdentityService);
        await identityService.deleteIdentityUser(testUser.idIdentityService);
    });

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.checkAppIsDisplayed(simpleApp);
        await appListCloudComponent.goToApp(simpleApp);
        await taskList.getDataTable().waitForTableBody();
    });

    it('[C297675] Should create a task unassigned when assignee field is empty in Start Task form', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await peopleCloudComponent.clearAssigneeFromChip(testUser.username);
        await startTask.addName(unassignedTaskName);
        await startTask.clickStartButton();

        await editTaskFilter.openFilter();
        await editTaskFilter.clearAssignee();
        await editTaskFilter.setStatusFilterDropDown('Created');
        await taskList.getDataTable().waitForTableBody();
        await taskList.checkContentIsDisplayedByName(unassignedTaskName);
        const taskId = await taskList.getIdCellValue(unassignedTaskName);
        await taskList.selectRow(unassignedTaskName);
        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
        await expect(await taskHeaderCloudPage.getId()).toBe(taskId);
        await expect(await taskHeaderCloudPage.getAssignee()).toBe('No assignee');
    });

    it('[C291956] Should be able to create a new standalone task without assignee', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await peopleCloudComponent.clearAssigneeFromChip(testUser.username);
        await startTask.addName(unassignedTaskName);
        await startTask.checkStartButtonIsEnabled();
        await startTask.clickStartButton();

        await editTaskFilter.openFilter();
        await editTaskFilter.setStatusFilterDropDown('Created');
        await editTaskFilter.clearAssignee();
        await taskList.checkContentIsDisplayedByName(unassignedTaskName);
    });

    it('[C290166] Should be possible to cancel a task', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await startTask.checkStartButtonIsDisabled();
        await startTask.blur(await startTask.name);
        await startTask.checkValidationErrorIsDisplayed(requiredError);
        await startTask.addName(standaloneTaskName);
        await startTask.addDescription('descriptions');
        await startTask.addDueDate('12/12/2018');
        await startTask.checkStartButtonIsEnabled();
        await startTask.clickCancelButton();
        await taskList.checkContentIsNotDisplayedByName(standaloneTaskName);
    });

    it('[C290180] Should be able to create a new standalone task', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await startTask.addName(standaloneTaskName);
        await startTask.addDescription('descriptions');
        await startTask.addDueDate('12/12/2018');
        await startTask.addPriority('Normal');
        await startTask.clickStartButton();
        await taskList.checkContentIsDisplayedByName(standaloneTaskName);
    });

    it('[C290181] Should be displayed an error message if task name exceed 255 characters', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await startTask.addName(taskName255Characters);
        await startTask.checkStartButtonIsEnabled();
        await startTask.addName(taskNameBiggerThen255Characters);
        await startTask.blur(await startTask.name);
        await startTask.checkValidationErrorIsDisplayed(lengthValidationError);
        await startTask.checkStartButtonIsDisabled();
        await startTask.clickCancelButton();
    });

    it('[C291774] Should be displayed an error message if the date is invalid', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.addDueDate('12/12/2018');
        await startTask.checkStartButtonIsEnabled();
        await startTask.addDueDate('invalid date');
        await startTask.blur(await startTask.dueDate);
        await startTask.validateDate(dateValidationError);
        await startTask.checkStartButtonIsDisabled();
        await startTask.clickCancelButton();
    });

    it('[C290182] Should be possible to assign the task to another user', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await startTask.addName(standaloneTaskName);
        await peopleCloudComponent.searchAssigneeAndSelect(`${apsUser.firstName} ${apsUser.lastName}`);

        await startTask.checkStartButtonIsEnabled();
        await startTask.clickStartButton();

        await browser.driver.sleep(1000);

        await taskFilter.clickTaskFilter('my-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');
    });

    it('[C305050] Should be able to reassign the removed user when starting a new task', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await startTask.addName(reassignTaskName);

        await peopleCloudComponent.checkSelectedPeople(`${testUser.firstName} ${testUser.lastName}`);
        await peopleCloudComponent.searchAssignee(apsUser.username);
        await peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName} ${apsUser.lastName}`);
        await peopleCloudComponent.selectAssigneeFromList(`${apsUser.firstName} ${apsUser.lastName}`);
        await startTask.clickStartButton();

        await editTaskFilter.openFilter();
        await editTaskFilter.clearAssignee();
        await editTaskFilter.setStatusFilterDropDown('All');

        await taskList.checkContentIsDisplayedByName(reassignTaskName);

        await browser.driver.sleep(1000);

        await taskList.selectRow(reassignTaskName);

        await expect(await taskHeaderCloudPage.getAssignee()).toBe(apsUser.username);
    });
});
