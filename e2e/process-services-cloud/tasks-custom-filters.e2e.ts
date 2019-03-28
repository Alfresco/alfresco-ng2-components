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

import { LoginSSOPage } from '@alfresco/adf-testing';
import { SettingsPage } from '../pages/adf/settingsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';

import { Tasks } from '../actions/APS-cloud/tasks';
import { ProcessDefinitions } from '../actions/APS-cloud/process-definitions';
import { ProcessInstances } from '../actions/APS-cloud/process-instances';
import { Query } from '../actions/APS-cloud/query';
import { Util } from '../util/util';
import { browser } from 'protractor';

describe('Task filters cloud', () => {

    describe('Filters', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
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
        let assignedTask, deletedTask, suspendedTasks;
        const orderByNameAndPriority = ['cCreatedTask', 'dCreatedTask', 'eCreatedTask'];
        let priority = 30;
        const nrOfTasks = 3;

        beforeAll(async () => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            browser.ignoreSynchronization = true;
            loginSSOPage.loginSSOIdentityService(user, password);

            await tasksService.init(user, password);
            await tasksService.createStandaloneTask(createdTaskName, simpleApp);

            assignedTask = await tasksService.createStandaloneTask(assignedTaskName, simpleApp);
            await tasksService.claimTask(assignedTask.entry.id, simpleApp);
            await tasksService.createAndCompleteTask(completedTaskName, simpleApp);
            deletedTask = await tasksService.createStandaloneTask(deletedTaskName, simpleApp);
            await tasksService.deleteTask(deletedTask.entry.id, simpleApp);
            for (let i = 0; i < nrOfTasks; i++) {
                await tasksService.createStandaloneTask(orderByNameAndPriority[i], simpleApp, { priority: priority });
                priority = priority + 20;
            }

            await processDefinitionService.init(user, password);
            const processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            await processInstancesService.init(user, password);
            const processInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            const secondProcessInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            await queryService.init(user, password);
            suspendedTasks = await queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp);
            await queryService.getProcessInstanceTasks(secondProcessInstance.entry.id, simpleApp);
            await processInstancesService.suspendProcessInstance(processInstance.entry.id, simpleApp);
            await processInstancesService.deleteProcessInstance(secondProcessInstance.entry.id, simpleApp);
            await queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp);
        });

        beforeEach(async (done) => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
            done();
        });

        it('[C290045] Should display only tasks with Assigned status when Assigned is selected from status dropdown', () => {
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setStatusFilterDropDown('ASSIGNED');

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(deletedTaskName);
        });

        it('[C290061] Should display only tasks with Completed status when Completed is selected from status dropdown', () => {
            tasksCloudDemoPage.editTaskFilterCloudComponent()
                .clickCustomiseFilterHeader()
                .setStatusFilterDropDown('COMPLETED');

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(deletedTaskName);
        });

        it('[C290139] Should display only tasks with all statuses when All is selected from status dropdown', () => {
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().clearAssignee()
                .setStatusFilterDropDown('ALL');

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(deletedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
        });

        it('[C290154] Should display only tasks with suspended statuses when Suspended is selected from status dropdown', () => {
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().clearAssignee()
                .setStatusFilterDropDown('SUSPENDED');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(suspendedTasks.list.entries[0].entry.id);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(deletedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(assignedTaskName);
         });

        it('[C290060] Should display only tasks with Created status when Created is selected from status dropdown', () => {
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().clearAssignee().setStatusFilterDropDown('CREATED');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(deletedTaskName);
        });

        it('[C290069] Should display tasks ordered by name when Name is selected from sort dropdown', () => {
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setStatusFilterDropDown('ASSIGNED')
                .setSortFilterDropDown('Name').setOrderFilterDropDown('ASC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getAllRowsNameColumn().then( (list) => {
                const initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });

            tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getAllRowsNameColumn().then( (list) => {
                const initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                list.reverse();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });
        });

        it('[C290156] Should display tasks ordered by id when Id is selected from sort dropdown', () => {
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setStatusFilterDropDown('ASSIGNED')
                .setSortFilterDropDown('Id').setOrderFilterDropDown('ASC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();

            tasksCloudDemoPage.getAllRowsByIdColumn().then((list) => {
                const initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });

            tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.getAllRowsByIdColumn().then((list) => {
                const initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                list.reverse();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });
        });
    });
});
