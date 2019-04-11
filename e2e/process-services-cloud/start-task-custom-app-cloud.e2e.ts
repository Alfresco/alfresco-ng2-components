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
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import {
    LoginSSOPage, SettingsPage, AppListCloudPage, StringUtil, TaskHeaderCloudPage,
    StartTasksCloudPage, PeopleCloudComponentPage, TasksService, ApiService, IdentityService
} from '@alfresco/adf-testing';
import { browser } from 'protractor';

describe('Start Task', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const startTask = new StartTasksCloudPage();
    const peopleCloudComponent = new PeopleCloudComponentPage();
    const standaloneTaskName = StringUtil.generateRandomString(5);
    const reassignTaskName = StringUtil.generateRandomString(5);
    const unassignedTaskName = StringUtil.generateRandomString(5);
    const taskName255Characters = StringUtil.generateRandomString(255);
    const taskNameBiggerThen255Characters = StringUtil.generateRandomString(256);
    const lengthValidationError = 'Length exceeded, 255 characters max.';
    const requiredError = 'Field required';
    const dateValidationError = 'Date format DD/MM/YYYY';
    const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
    const appName = 'simple-app';
    let silentLogin, activitiUser;
    let tasksService: TasksService;
    let identityService: IdentityService;

    beforeAll(async(done) => {
        const apiService = new ApiService('activiti', TestConfig.adf.hostBPM, TestConfig.adf.hostSso, 'BPM');
        await apiService.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        identityService = new IdentityService(apiService);
        tasksService = new TasksService(apiService);
        activitiUser = await identityService.createIdentityUser();

        silentLogin = false;
        settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
        loginSSOPage.clickOnSSOButton();
        browser.ignoreSynchronization = true;
        loginSSOPage.loginSSOIdentityService(user, password);
        done();
    });

    afterAll(async (done) => {
        const tasks = [ standaloneTaskName, unassignedTaskName, reassignTaskName ];
        for (let i = 0; i < tasks.length; i++) {
            const taskId = await tasksService.getTaskId(tasks[i], appName);
            await tasksService.deleteTask(taskId, appName);
        }
        await identityService.deleteIdentityUser(activitiUser.idIdentityService);
        done();
    });

    beforeEach((done) => {
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        appListCloudComponent.checkAppIsDisplayed(appName);
        appListCloudComponent.goToApp(appName);
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        done();
    });

    it('[C290166] Should be possible to cancel a task', () => {
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

    it('[C291774] Should be displayed an error message if the date is invalid', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.addDueDate('12/12/2018')
                 .checkStartButtonIsEnabled();
        startTask.addDueDate('invalid date')
                 .blur(startTask.dueDate)
                 .validateDate(dateValidationError)
                 .checkStartButtonIsDisabled()
                 .clickCancelButton();
    });

    it('[C290182] Should be possible to assign the task to another user', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkFormIsDisplayed();
        startTask.addName(standaloneTaskName);
        peopleCloudComponent.searchAssigneeAndSelect(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
        startTask.checkStartButtonIsEnabled();
        startTask.clickStartButton();
        tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(standaloneTaskName);
    });

    it('[C291953] Assignee field should display the logged user as default', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkFormIsDisplayed();
        expect(peopleCloudComponent.getAssignee()).toContain('Admin', 'does not contain Admin');
        startTask.clickCancelButton();
    });

    it('[C291956] Should be able to create a new standalone task without assignee', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkFormIsDisplayed();
        expect(peopleCloudComponent.getAssignee()).toContain('Admin', 'does not contain Admin');
        startTask.clearField(peopleCloudComponent.peopleCloudSearch);
        startTask.addName(unassignedTaskName);
        startTask.clickStartButton();
        startTask.checkStartButtonIsEnabled();
        tasksCloudDemoPage.editTaskFilterCloudComponent()
            .clickCustomiseFilterHeader()
            .setStatusFilterDropDown('CREATED')
            .clearAssignee();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(unassignedTaskName);
    });

    it('[C305050] Should be able to reassign the removed user when starting a new task', () => {

        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkFormIsDisplayed();
        startTask.addName(reassignTaskName);
        expect(peopleCloudComponent.getAssignee()).toBe('Administrator ADF');
        startTask.clearField(peopleCloudComponent.peopleCloudSearch);
        peopleCloudComponent.searchAssignee(user);
        peopleCloudComponent.checkUserIsDisplayed('Administrator ADF');
        peopleCloudComponent.selectAssigneeFromList('Administrator ADF');
        startTask.clickStartButton();
        tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(reassignTaskName);
        tasksCloudDemoPage.taskListCloudComponent().selectRow(reassignTaskName);
        expect(taskHeaderCloudPage.getAssignee()).toBe('admin.adf');
    });

    it('[C297675] Should create a task unassigned when assignee field is empty in Start Task form', () => {

        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkFormIsDisplayed();
        startTask.addName(unassignedTaskName);
        startTask.clearField(peopleCloudComponent.peopleCloudSearch);
        startTask.clickStartButton();
        tasksCloudDemoPage.editTaskFilterCloudComponent()
            .clickCustomiseFilterHeader()
            .clearAssignee()
            .setStatusFilterDropDown('CREATED');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(unassignedTaskName);
        const taskId = tasksCloudDemoPage.taskListCloudComponent().getIdCellValue(unassignedTaskName);
        tasksCloudDemoPage.taskListCloudComponent().selectRow(unassignedTaskName);
        expect(taskHeaderCloudPage.getTaskDetailsHeader()).toContain(taskId);
        expect(taskHeaderCloudPage.getAssignee()).toBe('No assignee');
    });

});
