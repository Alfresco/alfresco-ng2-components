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
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import {
    LoginSSOPage, AppListCloudPage, StringUtil, TaskHeaderCloudPage,
    StartTasksCloudPage, PeopleCloudComponentPage, TasksService, ApiService, IdentityService, RolesService, SettingsPage, GroupIdentityService
} from '@alfresco/adf-testing';
import { TaskDetailsCloudDemoPage } from '../pages/adf/demo-shell/process-services/taskDetailsCloudDemoPage';
import resources = require('../util/resources');
import CONSTANTS = require('../util/constants');

describe('Start Task', () => {

    const loginSSOPage = new LoginSSOPage();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const startTask = new StartTasksCloudPage();
    const peopleCloudComponent = new PeopleCloudComponentPage();
    const taskDetailsCloudDemoPage = new TaskDetailsCloudDemoPage();
    const settingsPage = new SettingsPage();
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
    let apsUser, testUser, apsUserRoleId, activitiUser, groupInfo;
    const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;

    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;
    let rolesService: RolesService;

    beforeAll(async (done) => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        rolesService = new RolesService(apiService);
        testUser = await identityService.createIdentityUser();
        apsUserRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.APS_USER);
        await identityService.assignRole(testUser.idIdentityService, apsUserRoleId, CONSTANTS.ROLES.APS_USER);
        apsUser = await identityService.createActivitiUserWithRole(apiService);
        await identityService.assignRole(apsUser.idIdentityService, apsUserRoleId, CONSTANTS.ROLES.APS_USER);

        activitiUser = await identityService.createIdentityUser();
        groupInfo = await groupIdentityService.getGroupInfoByGroupName("hr");
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.email, testUser.password);

        await settingsPage.setProviderBpmSso(
            browser.params.config.bpmHost,
            browser.params.config.oauth2.host,
            browser.params.config.identityHost);
        loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
        done();
    });

    afterAll(async (done) => {
        try {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            const tasksService = new TasksService(apiService);

            const tasks = [standaloneTaskName, unassignedTaskName, reassignTaskName];
            for (let i = 0; i < tasks.length; i++) {
                const taskId = await tasksService.getTaskId(tasks[i], simpleApp);
                if (taskId) {
                    await tasksService.deleteTask(taskId, simpleApp);
                }
            }
            await identityService.deleteIdentityUser(activitiUser.idIdentityService);
            await identityService.deleteIdentityUser(apsUser.idIdentityService);
            await identityService.deleteIdentityUser(testUser.idIdentityService);
        } catch (error) {
        }
        done();
    });

    beforeEach(() => {
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        appListCloudComponent.checkAppIsDisplayed(simpleApp);
        appListCloudComponent.goToApp(simpleApp);
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
    });

    it('[C297675] Should create a task unassigned when assignee field is empty in Start Task form', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkFormIsDisplayed();
        peopleCloudComponent.clearAssignee();
        startTask.addName(unassignedTaskName);
        startTask.clickStartButton();
        tasksCloudDemoPage.editTaskFilterCloudComponent()
            .clickCustomiseFilterHeader()
            .clearAssignee()
            .setStatusFilterDropDown('CREATED');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(unassignedTaskName);
        const taskId = tasksCloudDemoPage.taskListCloudComponent().getIdCellValue(unassignedTaskName);
        tasksCloudDemoPage.taskListCloudComponent().selectRow(unassignedTaskName);
        taskDetailsCloudDemoPage.checkTaskDetailsHeaderIsDisplayed();
        expect(taskDetailsCloudDemoPage.getTaskDetailsHeader()).toContain(taskId);
        expect(taskHeaderCloudPage.getAssignee()).toBe('No assignee');
    });

    xit('[C291956] Should be able to create a new standalone task without assignee', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkFormIsDisplayed();
        expect(peopleCloudComponent.getAssignee()).toContain(apsUser.firstName, 'does not contain Admin');
        startTask.addName(unassignedTaskName);
        startTask.clickStartButton();
        startTask.checkStartButtonIsEnabled();
        tasksCloudDemoPage.editTaskFilterCloudComponent()
            .clickCustomiseFilterHeader()
            .setStatusFilterDropDown('CREATED')
            .clearAssignee();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(unassignedTaskName);
    });

    xit('[C290166] Should be possible to cancel a task', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkFormIsDisplayed();
        startTask.checkStartButtonIsDisabled()
            .blur(startTask.name)
            .checkValidationErrorIsDisplayed(requiredError);
        startTask.addName(standaloneTaskName)
            .addDescription('descriptions')
            .addDueDate('12/12/2018');
        startTask.checkStartButtonIsEnabled();
        startTask.clickCancelButton();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(standaloneTaskName);
    });

    it('[C290180] Should be able to create a new standalone task', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkFormIsDisplayed();
        startTask.addName(standaloneTaskName)
            .addDescription('descriptions')
            .addDueDate('12/12/2018')
            .addPriority('50')
            .clickStartButton();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(standaloneTaskName);
    });

    it('[C290181] Should be displayed an error message if task name exceed 255 characters', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkFormIsDisplayed();
        startTask.addName(taskName255Characters)
            .checkStartButtonIsEnabled();
        startTask.addName(taskNameBiggerThen255Characters)
            .blur(startTask.name)
            .checkValidationErrorIsDisplayed(lengthValidationError)
            .checkStartButtonIsDisabled()
            .clickCancelButton();
    });

    xit('[C291774] Should be displayed an error message if the date is invalid', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.addDueDate('12/12/2018')
            .checkStartButtonIsEnabled();
        startTask.addDueDate('invalid date')
            .blur(startTask.dueDate)
            .validateDate(dateValidationError)
            .checkStartButtonIsDisabled()
            .clickCancelButton();
    });

    xit('[C290182] Should be possible to assign the task to another user', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkFormIsDisplayed();
        startTask.addName(standaloneTaskName);
        peopleCloudComponent.searchAssigneeAndSelect(`${activitiUser.firstName} ${activitiUser.lastName}`);
        startTask.checkStartButtonIsEnabled();
        startTask.clickStartButton();
        tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(standaloneTaskName);
    });

    xit('[C291953] Assignee field should display the logged user as default', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkFormIsDisplayed();
        expect(peopleCloudComponent.getAssignee()).toContain(apsUser.firstName, 'does not contain Admin');
        startTask.clickCancelButton();
    });

    xit('[C305050] Should be able to reassign the removed user when starting a new task', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkFormIsDisplayed();
        startTask.addName(reassignTaskName);
        expect(peopleCloudComponent.getAssignee()).toBe(`${apsUser.firstName} ${apsUser.lastName}`);
        peopleCloudComponent.searchAssignee(apsUser.username);
        peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName} ${apsUser.lastName}`);
        peopleCloudComponent.selectAssigneeFromList(`${apsUser.firstName} ${apsUser.lastName}`);
        startTask.clickStartButton();
        tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(reassignTaskName);
        tasksCloudDemoPage.taskListCloudComponent().selectRow(reassignTaskName);
        expect(taskHeaderCloudPage.getAssignee()).toBe(apsUser.username);
    });

});
