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

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import { LoginAPSPage } from '../pages/adf/loginApsPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import TasksListPage = require('../pages/adf/process_services/tasksListPage');
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/tasksCloudDemoPage';
import { AppListCloudComponent } from '../pages/adf/process_cloud/appListCloudComponent';

import AlfrescoApi = require('alfresco-js-api-node');
import { Tasks } from '../actions/APS-cloud/tasks';
import { ProcessDefinitions } from '../actions/APS-cloud/process-definitions';
import { ProcessInstances } from '../actions/APS-cloud/process-instances';
import { Query } from '../actions/APS-cloud/query';
import { browser } from 'protractor';
import Util = require('../util/util');

describe('Task filters cloud', () => {

    describe('Filters', () => {
        const settingsPage = new SettingsPage();
        const loginApsPage = new LoginAPSPage();
        const navigationBarPage = new NavigationBarPage();
        let appListCloudComponent = new AppListCloudComponent();
        let tasksCloudDemoPage = new TasksCloudDemoPage();
        const tasksService: Tasks = new Tasks();
        const processDefinitionService: ProcessDefinitions = new ProcessDefinitions();
        const processInstancesService: ProcessInstances = new ProcessInstances();
        const queryService: Query = new Query();

        const path = '/auth/realms/springboot';
        let silentLogin;
        const createdTaskName = Util.generateRandomString(), completedTaskName = Util.generateRandomString(),
            assignedTaskName = Util.generateRandomString(), deletedTaskName = Util.generateRandomString();
        const simpleApp = 'simple-app';//schimba app; sa fie creat de userul asta;
        const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
        let createdTask, assignedTask, completedTask, deletedTask;
        let orderByNameAndPriority = ['cCreatedTask', 'dCreatedTask', 'eCreatedTask'];
        let suspendedTasks, cancelledTasks;

        beforeAll(async () => {
            silentLogin = false;
            await settingsPage.setProviderBpmSso(TestConfig.adf.hostSso, TestConfig.adf.hostSso + path, silentLogin);
            await loginApsPage.clickOnSSOButton();
            browser.ignoreSynchronization = true;
            await loginApsPage.loginAPS(user, password);

            await tasksService.init(user, password);
            createdTask = await tasksService.createStandaloneTask(createdTaskName, simpleApp);

            assignedTask = await tasksService.createStandaloneTask(assignedTaskName, simpleApp);
            await tasksService.claimTask(assignedTask.entry.id, simpleApp);
            completedTask = await tasksService.createStandaloneTask(completedTaskName, simpleApp);
            await tasksService.claimTask(completedTask.entry.id, simpleApp);
            await tasksService.completeTask(completedTask.entry.id, simpleApp);
            deletedTask = await tasksService.createStandaloneTask(deletedTaskName, simpleApp);
            await tasksService.deleteTask(deletedTask.entry.id, simpleApp);
            await tasksService.createStandaloneTask(orderByNameAndPriority[0], simpleApp, {priority: 30});
            await tasksService.createStandaloneTask(orderByNameAndPriority[1], simpleApp, {priority: 50});
            await tasksService.createStandaloneTask(orderByNameAndPriority[2], simpleApp, {priority: 80});

            await processDefinitionService.init(user, password);
            let processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            await processInstancesService.init(user, password);
            let processInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            await queryService.init(user, password);
            suspendedTasks = await queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp);
            await processInstancesService.suspendProcessInstance(processInstance.entry.id, simpleApp);

            await processDefinitionService.init(user, password);
            let processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            await processInstancesService.init(user, password);
            let processInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            await queryService.init(user, password);
            cancelledTasks = await queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp);
            let kkt = await processInstancesService.deleteProcessInstance(processInstance.entry.id, simpleApp);
        });

        beforeEach(async (done) => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.goToApp(simpleApp);
            done();
        });

        it('[C290045] Should display only tasks with Assigned state when Assigned is selected from state dropdown', async() => {
            tasksCloudDemoPage.clickCustomiseFilter().setStateFilterDropDown('ASSIGNED')
                .setSortFilterDropDown('Created Date').setOrderFilterDropDown('DESC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(completedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(deletedTaskName);
        });

        //this test is failing due to ACTIVITI-2501
        xit('[C290060] Should display only tasks with Created state when Created is selected from state dropdown', async() => {
            tasksCloudDemoPage.clickCustomiseFilter().setStateFilterDropDown('CREATED')
                .setSortFilterDropDown('Created Date').setOrderFilterDropDown('DESC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(completedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(deletedTaskName);
        });

        it('[C290061] Should display only tasks with Completed state when Completed is selected from state dropdown', async() => {
            tasksCloudDemoPage.clickCustomiseFilter().setStateFilterDropDown('COMPLETED')
                .setSortFilterDropDown('Created Date').setOrderFilterDropDown('DESC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(completedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(deletedTaskName);
        });

        // this test is failing due to ACTIVITI-2501
        xit('[C290068] Should display only tasks with Deleted state when Deleted is selected from state dropdown', async() => {
            tasksCloudDemoPage.clickCustomiseFilter().setStateFilterDropDown('DELETED')
                .setSortFilterDropDown('Created Date').setOrderFilterDropDown('DESC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(deletedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(completedTaskName);
        });

        it('[C290139] Should display only tasks with all states when All is selected from state dropdown', async() => {
            tasksCloudDemoPage.clickCustomiseFilter().setStateFilterDropDown('ALL')
                .setSortFilterDropDown('Created Date').setOrderFilterDropDown('DESC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(deletedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(completedTaskName);
        });

        it('[C290154] Should display only tasks with suspended states when Suspended is selected from state dropdown', async() => {
            tasksCloudDemoPage.clickCustomiseFilter().setStateFilterDropDown('SUSPENDED')
                .setSortFilterDropDown('Created Date').setOrderFilterDropDown('DESC');

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(suspendedTasks.list.entries[0].entry.id);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(deletedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(completedTaskName);
        });

        it('[C290155] Should display only tasks with cancelled states when CANCELLED is selected from state dropdown', async() => {
            tasksCloudDemoPage.clickCustomiseFilter().setStateFilterDropDown('CANCELLED')
                .setSortFilterDropDown('Created Date').setOrderFilterDropDown('DESC');

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(cancelledTasks.list.entries[0].entry.id);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(deletedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(completedTaskName);
        });

        it('[C290069] Should display tasks ordered by name when Name is selected from sort dropdown', async() => {
            tasksCloudDemoPage.clickCustomiseFilter().setStateFilterDropDown('CREATED')
                .setSortFilterDropDown('NAME').setOrderFilterDropDown('ASC');

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().getAllRowsNameColumn().then(function (list) {

                let initialList = list.slice(0);
                list.sort();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });

            tasksCloudDemoPage.setOrderFilterDropDown('DESC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().getAllRowsNameColumn().then(function (list) {
                let initialList = list.slice(0);
                list.sort();
                list.reverse();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });
        });

        xit('[C290087] Should display tasks ordered by priority when Priority is selected from sort dropdown', async() => {
            tasksCloudDemoPage.clickCustomiseFilter().setSortFilterDropDown('PRIORITY');
            tasksCloudDemoPage.clickCustomiseFilter().setOrderFilterDropDown('ASC');

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().getAllRowsNameColumn().then(function (list) {
                expect(JSON.stringify(list) === JSON.stringify(orderByNameAndPriority)).toEqual(true);
            });

            tasksCloudDemoPage.clickCustomiseFilter().setOrderFilterDropDown('DESC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().getAllRowsNameColumn().then(function (list) {
                orderByNameAndPriority.reverse();
                expect(JSON.stringify(list) === JSON.stringify(orderByNameAndPriority)).toEqual(true);
            });
        });

        it('[C290156] Should display tasks ordered by id when Id is selected from sort dropdown', async() => {
            tasksCloudDemoPage.clickCustomiseFilter().setStateFilterDropDown('CREATED')
                .setSortFilterDropDown('ID').setOrderFilterDropDown('ASC');

            tasksCloudDemoPage.getAllRowsByIdColumn().then(function (list) {
                let initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });

            tasksCloudDemoPage.setOrderFilterDropDown('DESC');
            tasksCloudDemoPage.getAllRowsByIdColumn().then(function (list) {
                let initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                list.reverse();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });
        });

    });

});
