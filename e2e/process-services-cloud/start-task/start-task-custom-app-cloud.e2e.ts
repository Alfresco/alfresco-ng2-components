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
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import {
    LoginSSOPage,
    AppListCloudPage,
    StringUtil,
    TaskHeaderCloudPage,
    StartTasksCloudPage,
    PeopleCloudComponentPage,
    TasksService,
    ApiService,
    IdentityService,
    GroupIdentityService
} from '@alfresco/adf-testing';

describe('Start Task', () => {

    const loginSSOPage = new LoginSSOPage();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const startTask = new StartTasksCloudPage();
    const peopleCloudComponent = new PeopleCloudComponentPage();
    const apiService = new ApiService(
        browser.params.config.oauth2.clientId,
        browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
    );

    const standaloneTaskName = StringUtil.generateRandomString(5);
    const reassignTaskName = StringUtil.generateRandomString(5);
    const unassignedTaskName = StringUtil.generateRandomString(5);
    const taskName255Characters = StringUtil.generateRandomString(255);
    const taskNameBiggerThen255Characters = StringUtil.generateRandomString(256);
    const lengthValidationError = 'Length exceeded, 255 characters max.';
    const requiredError = 'Field required';
    const dateValidationError = 'Date format DD/MM/YYYY';
    let apsUser, testUser, activitiUser, groupInfo;
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;

    beforeAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);
        apsUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER, identityService.ROLES.ACTIVITI_USER]);

        activitiUser = await identityService.createIdentityUser();
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await identityService.addUserToGroup(apsUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.email, testUser.password);

        await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
    });

    afterAll(async () => {
        const tasksService = new TasksService(apiService);

        let taskId = await tasksService.getTaskId(standaloneTaskName, simpleApp);
        await tasksService.deleteTask(taskId, simpleApp);
        taskId = await tasksService.getTaskId(unassignedTaskName, simpleApp);
        await tasksService.deleteTask(taskId, simpleApp);

        await apiService.login(apsUser.email, apsUser.password);
        taskId = await tasksService.getTaskId(reassignTaskName, simpleApp);
        await tasksService.deleteTask(taskId, simpleApp);

        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await identityService.deleteIdentityUser(activitiUser.idIdentityService);
        await identityService.deleteIdentityUser(apsUser.idIdentityService);
        await identityService.deleteIdentityUser(testUser.idIdentityService);

    });

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.checkAppIsDisplayed(simpleApp);
        await appListCloudComponent.goToApp(simpleApp);
        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
    });

    it('[C297675] Should create a task unassigned when assignee field is empty in Start Task form', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await peopleCloudComponent.clearAssignee();
        await startTask.addName(unassignedTaskName);
        await startTask.clickStartButton();
        await tasksCloudDemoPage.editTaskFilterCloudComponent();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CREATED');
        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(unassignedTaskName);
        const taskId = await tasksCloudDemoPage.taskListCloudComponent().getIdCellValue(unassignedTaskName);
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(unassignedTaskName);
        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
        await expect(await taskHeaderCloudPage.getId()).toBe(taskId);
        await expect(await taskHeaderCloudPage.getAssignee()).toBe('No assignee');
    });

    it('[C291956] Should be able to create a new standalone task without assignee', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await peopleCloudComponent.clearAssignee();
        await startTask.addName(unassignedTaskName);
        await startTask.checkStartButtonIsEnabled();
        await startTask.clickStartButton();
        await tasksCloudDemoPage.editTaskFilterCloudComponent();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CREATED');
        await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(unassignedTaskName);
    });

    it('[C290166] Should be possible to cancel a task', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await startTask.checkStartButtonIsDisabled();
        await startTask.blur(await startTask.name);
        await startTask.checkValidationErrorIsDisplayed(requiredError);
        await startTask.addName(standaloneTaskName);
        await startTask.addDescription('descriptions');
        await startTask .addDueDate('12/12/2018');
        await startTask.checkStartButtonIsEnabled();
        await startTask.clickCancelButton();
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(standaloneTaskName);
    });

    it('[C290180] Should be able to create a new standalone task', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await startTask.addName(standaloneTaskName);
        await startTask.addDescription('descriptions');
        await startTask.addDueDate('12/12/2018');
        await startTask.addPriority('50');
        await startTask.clickStartButton();
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(standaloneTaskName);
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

        await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();

        await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
    });

    it('[C291953] Assignee field should display the logged user as default', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await expect(await peopleCloudComponent.getAssignee()).toContain(testUser.firstName, 'does not contain Admin');
        await startTask.clickCancelButton();
    });

    it('[C305050] Should be able to reassign the removed user when starting a new task', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await startTask.addName(reassignTaskName);

        await expect(await peopleCloudComponent.getAssignee()).toBe(`${testUser.firstName} ${testUser.lastName}`);
        await peopleCloudComponent.searchAssignee(apsUser.username);
        await peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName} ${apsUser.lastName}`);
        await peopleCloudComponent.selectAssigneeFromList(`${apsUser.firstName} ${apsUser.lastName}`);
        await startTask.clickStartButton();

        await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL');

        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(reassignTaskName);

        await browser.driver.sleep(1000);

        await tasksCloudDemoPage.taskListCloudComponent().selectRow(reassignTaskName);

        await expect(await taskHeaderCloudPage.getAssignee()).toBe(apsUser.username);
    });

});
