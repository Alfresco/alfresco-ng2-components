/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { LoginSSOPage } from '../pages/adf/loginSSOPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TaskListCloudDemoPage } from '../pages/adf/demo-shell/taskListCloudDemoPage';
import moment = require('moment');

import { Tasks } from '../actions/APS-cloud/tasks';
import { ProcessDefinitions } from '../actions/APS-cloud/process-definitions';
import { ProcessInstances } from '../actions/APS-cloud/process-instances';

import TestConfig = require('../test.config');
import resources = require('../util/resources');
import { Util } from '../util/util';

import AlfrescoApi = require('alfresco-js-api-node');
import { DateUtil } from '../util/dateUtil';

describe('Task List - Properties', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    let navigationBarPage = new NavigationBarPage();
    let taskListCloudDemoPage = new TaskListCloudDemoPage();

    const tasksService: Tasks = new Tasks();
    const processDefinitionService: ProcessDefinitions = new ProcessDefinitions();
    const processInstancesService: ProcessInstances = new ProcessInstances();

    const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
    const createdTaskName = Util.generateRandomString(), notDisplayedTaskName = Util.generateRandomString(),
        assignedTaskName = Util.generateRandomString(), multipleTaskName = Util.generateRandomString();
    const simpleApp = 'simple-app';
    const candidateUserApp = 'candidateuserapp';
    let createdTask, notDisplayedTask, assignedTask, multipleTask;
    let invalidName = 'invalidName', invalidTaskId = '0000';
    let currentDate = DateUtil.formatDate('MM/DD/YYYY');

    let noTasksFoundMessage = 'No Tasks Found';
    let processDefinition, processInstance;

    beforeAll(async (done) => {
        let silentLogin = false;
        settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, silentLogin);
        loginSSOPage.clickOnSSOButton();
        loginSSOPage.loginAPS(user, password);

        await tasksService.init(user, password);
        createdTask = await tasksService.createStandaloneTask(createdTaskName, simpleApp);

        multipleTask = await tasksService.createStandaloneTask(multipleTaskName, simpleApp);

        notDisplayedTask = await tasksService.createStandaloneTask(notDisplayedTaskName, candidateUserApp);

        assignedTask = await tasksService.createStandaloneTask(assignedTaskName, simpleApp);
        await tasksService.claimTask(assignedTask.entry.id, simpleApp);

        await processDefinitionService.init(user, password);
        processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
        await processInstancesService.init(user, password);
        processInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);

        done();
    });

    beforeEach(async (done) => {
        await navigationBarPage.navigateToTaskListCloudPage();
        done();
    });

    //failing due to ADF-3893
    it('[C291895] Should be able to see only the tasks of a specific app when typing the exact app name in the appName field', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).typeCurrentDate(currentDate);
        expect(taskListCloudDemoPage.getAppName()).toEqual(simpleApp);

        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsDisplayedByName(createdTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsNotDisplayedByName(notDisplayedTaskName);
    });

    //failing due to ADF-3914
    it('[C291896] Should be able to see No tasks found when typing not existent app name in the appName field', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(invalidTaskId);
        expect(taskListCloudDemoPage.getAppName()).toEqual(invalidTaskId);

        expect(taskListCloudDemoPage.taskListCloud().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

    //failing due to ADF-3915
    it('[C291905] Should be able to see only the tasks with specific name when typing the name in the task name field', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).typeTaskName(createdTaskName);
        expect(taskListCloudDemoPage.getTaskName()).toEqual(createdTaskName);

        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsDisplayedByName(createdTaskName);
        expect(taskListCloudDemoPage.taskListCloud().getDataTable().getNumberOfRowsDisplayedWithSameName(createdTaskName)).toEqual(1);
    });

    //failing due to ADF-3914
    it('[C280571] Should be able to see No tasks found when typing a task name that does not exist', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).typeTaskName(invalidName);
        expect(taskListCloudDemoPage.getTaskName()).toEqual(invalidName);

        expect(taskListCloudDemoPage.taskListCloud().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

    //failing due to ADF-3915
    it('[C291906] Should be able to see only the task with specific taskId when typing it in the task Id field', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).typeTaskId(createdTask.entry.id);
        expect(taskListCloudDemoPage.getTaskId()).toEqual(createdTask.entry.id);

        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsDisplayedByName(createdTask.entry.name);
        expect(taskListCloudDemoPage.taskListCloud().getDataTable().getAllDisplayedRows()).toBe(1);
    });

    //failing due to ADF-3914
    it('[C291907] Should be able to see No tasks found when typing an invalid taskId', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).typeTaskId(invalidTaskId);
        expect(taskListCloudDemoPage.getTaskId()).toEqual(invalidTaskId);

        expect(taskListCloudDemoPage.taskListCloud().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

    //failing due to ADF-3915, ADF-3916
    it('[C291908] Should be able to see only tasks that are part of a specific process when processDefinitionId is set', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).typeProcessDefinitionId(processDefinition.list.entries[0].entry.key);

        //nu stiu exact la ce sa ma astept in tabel
        expect(taskListCloudDemoPage.taskListCloud().getDataTable().getAllDisplayedRows()).toBe(1);
        taskListCloudDemoPage.getAllProcessDefinitionIds().then(function (list) {
            expect(Util.arrayContainsArray(list, [processDefinition.list.entries[0].entry.key])).toEqual(true);
        });
    });

    //failing due to ADF-3914
    it('[C291909] Should be able to see No tasks found when typing an invalid processDefinitionId', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).typeProcessDefinitionId(invalidTaskId);

        expect(taskListCloudDemoPage.taskListCloud().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

    //failing due to ADF-3915
    it('[C291910] Should be able to see only tasks that are part of a specific process when processInstanceId is set', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).typeProcessInstanceId(processInstance.entry.id);
        expect(taskListCloudDemoPage.getProcessInstanceId()).toEqual(processInstance.entry.id);

        expect(taskListCloudDemoPage.taskListCloud().getDataTable().getAllDisplayedRows()).toBe(1);
        taskListCloudDemoPage.getAllProcessInstanceIds().then(function (list) {
            expect(Util.arrayContainsArray(list, [processInstance.entry.id])).toEqual(true);
        });
    });

    //failing due to ADF-3914
    it('[C291911] Should be able to see No tasks found when typing an invalid processInstanceId', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeProcessInstanceId(invalidTaskId);
        expect(taskListCloudDemoPage.getProcessInstanceId()).toEqual(invalidTaskId);

        expect(taskListCloudDemoPage.taskListCloud().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

    //failing due to ADF-3915
    it('[C291912] Should be able to see only tasks that are assigned to a specific user when assignee is set', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).typeAssignee('admin.adf');
        expect(taskListCloudDemoPage.getAssignee()).toEqual('admin.adf');

        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsDisplayedByName(assignedTask.entry.name);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsNotDisplayedByName(createdTask.entry.name);
    });

    //failing due to ADF-3914
    fit('[C291913] Should be able to see No tasks found when typing an invalid user to assignee field', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).typeAssignee(invalidTaskId);
        expect(taskListCloudDemoPage.getAssignee()).toEqual(invalidTaskId);

        expect(taskListCloudDemoPage.taskListCloud().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

    //failing due to ADF-3915, ADF-3893
    it('[C291914] Should not be able to select any row when selection mode is set to None', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).typeCurrentDate(currentDate).selectSelectionMode('None');
        expect(taskListCloudDemoPage.getAppName()).toEqual(simpleApp);

        taskListCloudDemoPage.taskListCloud().getDataTable().selectRowByRowName(createdTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkNoRowIsSelected();
    });

    //failing due to ADF-3915, ADF-3893
    it('[C291918] Should be able to select only one row when selection mode is set to Single', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).typeCurrentDate(currentDate).selectSelectionMode('Single');
        expect(taskListCloudDemoPage.getAppName()).toEqual(simpleApp);

        taskListCloudDemoPage.taskListCloud().getDataTable().selectRowByRowName(createdTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsSelectedByName(createdTaskName);
        expect(taskListCloudDemoPage.taskListCloud().getDataTable().getNumberOfSelectedRows()).toEqual(1);
        taskListCloudDemoPage.taskListCloud().getDataTable().selectRowByRowName(assignedTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsSelectedByName(assignedTaskName);
        expect(taskListCloudDemoPage.taskListCloud().getDataTable().getNumberOfSelectedRows()).toEqual(1);
    });

    //failing due to ADF-3915, ADF-3893
    it('[C291919] Should be able to select only one row when selection mode is set to Multiple', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).typeCurrentDate(currentDate).selectSelectionMode('Multiple');
        expect(taskListCloudDemoPage.getAppName()).toEqual(simpleApp);

        taskListCloudDemoPage.taskListCloud().getDataTable().selectRowByRowName(createdTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsSelectedByName(createdTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().selectRowByNameWithKeyboard(assignedTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsSelectedByName(createdTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsSelectedByName(assignedTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsNotSelectedByName(multipleTaskName);
    });


    it('[C291916] Should be able to select multiple row when multiselect is true', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).enableMultiSelect();
        expect(taskListCloudDemoPage.getAppName()).toEqual(simpleApp);

        taskListCloudDemoPage.taskListCloud().getDataTable().clickCheckboxByName(createdTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsCheckedByName(createdTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().clickCheckboxByName(assignedTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsCheckedByName(assignedTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsNotCheckedByName(multipleTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().clickCheckboxByName(assignedTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsNotCheckedByName(assignedTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsCheckedByName(createdTaskName);
    });

    it('[C291915] Should be possible select all the rows when multiselect is true', () => {
        taskListCloudDemoPage.clickResetButton();

        taskListCloudDemoPage.typeAppName(simpleApp).enableMultiSelect();
        expect(taskListCloudDemoPage.getAppName()).toEqual(simpleApp);

        taskListCloudDemoPage.taskListCloud().getDataTable().checkAllRows();
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsCheckedByName(createdTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().clickCheckboxByName(assignedTaskName);
        taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsCheckedByName(multipleTaskName);
    });
});
