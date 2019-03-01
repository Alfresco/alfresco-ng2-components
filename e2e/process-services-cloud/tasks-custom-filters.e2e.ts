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
import resources = require('../util/resources');

import { LoginSSOPage } from '../pages/adf/loginSSOPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksListPage } from '../pages/adf/process_services/tasksListPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudComponent } from '../pages/adf/process-cloud/appListCloudComponent';

import AlfrescoApi = require('alfresco-js-api-node');
import { Tasks } from '../actions/APS-cloud/tasks';
import { ProcessDefinitions } from '../actions/APS-cloud/process-definitions';
import { ProcessInstances } from '../actions/APS-cloud/process-instances';
import { Query } from '../actions/APS-cloud/query';
import { Util } from '../util/util';

describe('Task filters cloud', () => {

    describe('Filters', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudComponent();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const tasksService: Tasks = new Tasks();
        const processDefinitionService: ProcessDefinitions = new ProcessDefinitions();
        const processInstancesService: ProcessInstances = new ProcessInstances();
        const queryService: Query = new Query();

        let silentLogin;
        const createdTaskName = Util.generateRandomString(), completedTaskName = Util.generateRandomString(),
            assignedTaskName = Util.generateRandomString(), deletedTaskName = Util.generateRandomString();
        const simpleApp = 'simple-app';
        const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
        let createdTask, assignedTask, completedTask, deletedTask;
        let orderByNameAndPriority = ['cCreatedTask', 'dCreatedTask', 'eCreatedTask'];
        let suspendedTasks, cancelledTasks;
        let priority = 30, nrOfTasks = 3;

        beforeAll(async () => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginAPS(user, password);

            await tasksService.init(user, password);
            createdTask = await tasksService.createStandaloneTask(createdTaskName, simpleApp);

            assignedTask = await tasksService.createStandaloneTask(assignedTaskName, simpleApp);
            await tasksService.claimTask(assignedTask.entry.id, simpleApp);
            completedTask = await tasksService.createAndCompleteTask(completedTaskName, simpleApp);
            deletedTask = await tasksService.createStandaloneTask(deletedTaskName, simpleApp);
            await tasksService.deleteTask(deletedTask.entry.id, simpleApp);
            for ( let i = 0; i < nrOfTasks; i++ ) {
                await tasksService.createStandaloneTask(orderByNameAndPriority[i], simpleApp, {priority: priority});
                priority = priority + 20;
            }

            await processDefinitionService.init(user, password);
            let processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            await processInstancesService.init(user, password);
            let processInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            let secondProcessInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            await queryService.init(user, password);
            suspendedTasks = await queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp);
            cancelledTasks = await queryService.getProcessInstanceTasks(secondProcessInstance.entry.id, simpleApp);
            await processInstancesService.suspendProcessInstance(processInstance.entry.id, simpleApp);
            await processInstancesService.deleteProcessInstance(secondProcessInstance.entry.id, simpleApp);
            await queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp);
        });

        beforeEach(async (done) => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
            done();
        });

        it('[C290045] Should display only tasks with Assigned state when Assigned is selected from state dropdown', () => {
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setStateFilterDropDown('ASSIGNED');

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(completedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(deletedTaskName);
        });

        it('[C290061] Should display only tasks with Completed state when Completed is selected from state dropdown', () => {
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setStateFilterDropDown('COMPLETED');

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(completedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(deletedTaskName);
        });

        it('[C290139] Should display only tasks with all states when All is selected from state dropdown', () => {
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().clearAssignment()
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setAssignment('')
                .setStateFilterDropDown('ALL');

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(deletedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(completedTaskName);
        });

        it('[C290154] Should display only tasks with suspended states when Suspended is selected from state dropdown', () => { 
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setAssignment('')
                .setStateFilterDropDown('SUSPENDED');  
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(suspendedTasks.list.entries[0].entry.id);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(deletedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(completedTaskName);
        });

        it('[C290060] Should display only tasks with Created state when Created is selected from state dropdown', () => { 
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setAssignment('').setStateFilterDropDown('CREATED');  
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(createdTaskName); 
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(assignedTaskName); 
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(completedTaskName); 
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(deletedTaskName); 
        });

        it('[C290069] Should display tasks ordered by name when Name is selected from sort dropdown', () => {
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setStateFilterDropDown('ASSIGNED')
                .setSortFilterDropDown('NAME').setOrderFilterDropDown('ASC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().getAllRowsNameColumn().then( (list) => {
                let initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });

            tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().getAllRowsNameColumn().then( (list) => {
                let initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                list.reverse();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });
        });

        it('[C290156] Should display tasks ordered by id when Id is selected from sort dropdown', () => {
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setStateFilterDropDown('ASSIGNED')
                .setSortFilterDropDown('ID').setOrderFilterDropDown('ASC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();

            tasksCloudDemoPage.getAllRowsByIdColumn().then( (list) => {
                let initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });

            tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.getAllRowsByIdColumn().then( (list) => {
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
