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

import { LoginSSOPage } from '../pages/adf/loginSSOPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudComponent } from '../pages/adf/process-cloud/appListCloudComponent';
import { ConfigEditorPage } from '../pages/adf/configEditorPage';
import { TaskListCloudConfiguration } from './taskListCloud.config';

import { Util } from '../util/util';
import moment = require('moment');
import { DateUtil } from '../util/dateUtil';

import { Tasks } from '../actions/APS-cloud/tasks';
import { ProcessDefinitions } from '../actions/APS-cloud/process-definitions';
import { ProcessInstances } from '../actions/APS-cloud/process-instances';
import { NotificationPage } from '../pages/adf/notificationPage';

describe('Edit task filters and task list properties', () => {

    describe('Edit task filters and task list properties', () => {
        const configEditorPage = new ConfigEditorPage();
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        let appListCloudComponent = new AppListCloudComponent();
        let tasksCloudDemoPage = new TasksCloudDemoPage();

        const tasksService: Tasks = new Tasks();
        const processDefinitionService: ProcessDefinitions = new ProcessDefinitions();
        const processInstancesService: ProcessInstances = new ProcessInstances();
        let notificationPage = new NotificationPage();

        let silentLogin;
        const simpleApp = 'simple-app';
        const candidateUserApp = 'candidateuserapp';
        let noTasksFoundMessage = 'No Tasks Found';
        const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
        let createdTask, notAssigned, notDisplayedTask, processDefinition, processInstance, priorityTask, subTask;
        let priority = 30;

        let beforeDate = moment().add(-1, 'days').format('DD/MM/YYYY');
        let currentDate = DateUtil.formatDate('DD/MM/YYYY');
        let afterDate = moment().add(1, 'days').format('DD/MM/YYYY');

        beforeAll(async (done) => {
            silentLogin = false;
            let jsonFile = new TaskListCloudConfiguration().getConfiguration();
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginAPS(user, password);

            navigationBarPage.clickConfigEditorButton();

            configEditorPage.clickTaskListCloudConfiguration();
            configEditorPage.clickClearButton();
            configEditorPage.enterBigConfigurationText(JSON.stringify(jsonFile)).clickSaveButton();
            notificationPage.checkNotificationSnackBarIsDisplayedWithMessage('Save');
            notificationPage.checkNotificationSnackBarIsNotDisplayed();

            configEditorPage.clickEditTaskConfiguration();
            configEditorPage.clickClearButton();
            browser.driver.sleep(5000);
            configEditorPage.enterConfiguration('{' +
                '"properties": [' +
                '"appName",' + '"state",' + '"assignment",' +
                '"taskName",' + '"parentTaskId",' + '"priority",' +
                '"standAlone",' + '"owner",' + '"processDefinitionId",' + '"processInstanceId",' +
                '"lastModifiedFrom",' + '"lastModifiedTo",' + '"sort",' + '"order"' +
                ']' +
                '}');
            configEditorPage.clickSaveButton();

            await tasksService.init(user, password);
            createdTask = await tasksService.createStandaloneTask(Util.generateRandomString(), simpleApp);
            await tasksService.claimTask(createdTask.entry.id, simpleApp);
            notAssigned = await tasksService.createStandaloneTask(Util.generateRandomString(), simpleApp);
            priorityTask = await tasksService.createStandaloneTask(Util.generateRandomString(), simpleApp, {priority: priority});
            await tasksService.claimTask(priorityTask.entry.id, simpleApp);
            notDisplayedTask = await tasksService.createStandaloneTask(Util.generateRandomString(), candidateUserApp);
            await tasksService.claimTask(notDisplayedTask.entry.id, candidateUserApp);

            await processDefinitionService.init(user, password);
            processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            await processInstancesService.init(user, password);
            processInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);

            subTask = await tasksService.createStandaloneSubtask(createdTask.entry.id, simpleApp, Util.generateRandomString());
            await tasksService.claimTask(subTask.entry.id, simpleApp);

            done();
        });

        beforeEach((done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            done();
        });

        it('[C292004] Filter by appName', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getAppNameDropDownValue()).toEqual(simpleApp);

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(createdTask.entry.name);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(notDisplayedTask.entry.name);

            tasksCloudDemoPage.editTaskFilterCloudComponent().setAppNameDropDown(candidateUserApp);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getAppNameDropDownValue()).toEqual(candidateUserApp);

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(notDisplayedTask.entry.name);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTask.entry.name);
        });

        it('[C297476] Filter by taskName', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setTaskName(createdTask.entry.name);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getTaskName()).toEqual(createdTask.entry.name);

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(createdTask.entry.name);
            expect(tasksCloudDemoPage.taskListCloudComponent().getDataTable().getNumberOfRowsDisplayedByName(createdTask.entry.name)).toEqual(1);
        });

        it('[C297613] Should be able to see No tasks found when typing a task name that does not exist', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setTaskName('invalidName');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getTaskName()).toEqual('invalidName');

            expect(tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297480] Should be able to see only tasks that are part of a specific process when processInstanceId is set', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setProcessInstanceId(processInstance.entry.id)
                .setStateFilterDropDown('ALL').clearAssignment();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();

            expect(tasksCloudDemoPage.taskListCloudComponent().getDataTable().getAllDisplayedRows()).toBe(1);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(processInstance.entry.id);
        });

        it('[C297684] Should be able to see No tasks found when typing an invalid processInstanceId', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setProcessInstanceId('invalidTaskId');

            expect(tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297478] Should be able to see only tasks that are assigned to a specific user when assignee is set', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setAssignment('admin.adf');

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(createdTask.entry.name);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(notAssigned.entry.name);
        });

        it('[C297686] Should be able to see No tasks found when typing an invalid user to assignee field', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setAssignment('invalid');

            expect(tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297482] Should be able to see only tasks with specific priority when priority is set', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setPriority(priority);

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(priorityTask.entry.name);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTask.entry.name);
        });

        it('[C297687] Should be able to see No tasks found when typing unused value for priority field', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setPriority('70');

            expect(tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297481] Should be able to see only tasks with specific parentTaskId when parentTaskId is set', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setParentTaskId(subTask.entry.parentTaskId);

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(subTask.entry.name);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTask.entry.name);
        });

        it('[C297486] Filter by Owner', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setStateFilterDropDown('ALL').clearAssignment().setOwner('admin.adf');

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(notAssigned.entry.name);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(createdTask.entry.name);

            tasksCloudDemoPage.editTaskFilterCloudComponent().setOwner('invalid');

            expect(tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297484] Task is displayed when typing into lastModifiedFrom field a date before the task created date', function () {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(beforeDate);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(createdTask.entry.name);

            tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(afterDate);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTask.entry.name);
        });

        it('[C297689] Task is not displayed when typing into lastModifiedFrom field the same date as tasks created date', function () {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(currentDate);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTask.entry.name);
        });

        it('[C297485] Task is displayed when typing into lastModifiedTo field a date after the task created date', function () {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(afterDate);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(createdTask.entry.name);

            tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(beforeDate);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTask.entry.name);
        });

        it('[C297690] Task is not displayed when typing into lastModifiedTo field the same date as tasks created date', function () {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(currentDate);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTask.entry.name);
        });

        it('[C297691] Task is not displayed when typing into lastModifiedFrom field a date before the task due date  ' +
            'and into lastModifiedTo a date before task due date', function () {

            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(beforeDate);
            tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(beforeDate);
            expect(tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297692] Task is displayed when typing into lastModifiedFrom field a date before the tasks due date ' +
            'and into lastModifiedTo a date after', function () {

            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(beforeDate);
            tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(afterDate);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(createdTask.entry.name);
        });

        it('[C297693] Task is not displayed when typing into lastModifiedFrom field a date after the tasks due date ' +
            'and into lastModifiedTo a date after', function () {

            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(afterDate);
            tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(afterDate);
            expect(tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

    });

});
