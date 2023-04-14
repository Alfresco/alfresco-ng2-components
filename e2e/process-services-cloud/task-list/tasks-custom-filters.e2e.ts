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

import {
    StringUtil,
    TasksService,
    QueryService,
    ProcessDefinitionsService,
    ProcessInstancesService,
    LoginPage, createApiService,
    IdentityService,
    GroupIdentityService,
    AppListCloudPage, TaskListCloudComponentPage
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';

describe('Task filters cloud', () => {

    describe('Filters', () => {

        const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

        const loginSSOPage = new LoginPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();

        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const editTaskFilter = tasksCloudDemoPage.editTaskFilterCloud;
        const taskList = new TaskListCloudComponentPage();
        const apiService = createApiService();
        const identityService = new IdentityService(apiService);
        const groupIdentityService = new GroupIdentityService(apiService);
        const tasksService = new TasksService(apiService);
        const processDefinitionService = new ProcessDefinitionsService(apiService);
        const processInstancesService = new ProcessInstancesService(apiService);
        const queryService = new QueryService(apiService);

        const createdTaskName = StringUtil.generateRandomString();
            const completedTaskName = StringUtil.generateRandomString();
            const assignedTaskName = StringUtil.generateRandomString(); const deletedTaskName = StringUtil.generateRandomString();
        let assignedTask; let deletedTask; let testUser; let groupInfo;
        const orderByNameAndPriority = ['cCreatedTask', 'dCreatedTask', 'eCreatedTask'];
        let priority = 1;
        const nrOfTasks = 3;

        beforeAll(async () => {
            await apiService.loginWithProfile('identityAdmin');

            testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);

            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
            await apiService.login(testUser.username, testUser.password);

            await tasksService.createStandaloneTask(createdTaskName, simpleApp);

            assignedTask = await tasksService.createStandaloneTask(assignedTaskName, simpleApp);
            await tasksService.claimTask(assignedTask.entry.id, simpleApp);
            await tasksService.createAndCompleteTask(completedTaskName, simpleApp);
            deletedTask = await tasksService.createStandaloneTask(deletedTaskName, simpleApp);
            await tasksService.deleteTask(deletedTask.entry.id, simpleApp);
            for (let i = 0; i < nrOfTasks; i++) {
                await tasksService.createStandaloneTask(orderByNameAndPriority[i], simpleApp, { priority });
                priority = priority + 1;
            }

            const processDefinition = await processDefinitionService
                .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.simpleProcess, simpleApp);

            const processInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
            const secondProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);

            await queryService.getProcessInstanceTasks(secondProcessInstance.entry.id, simpleApp);
            await processInstancesService.suspendProcessInstance(processInstance.entry.id, simpleApp);
            await processInstancesService.deleteProcessInstance(secondProcessInstance.entry.id, simpleApp);
            await queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp);

            await loginSSOPage.login(testUser.username, testUser.password);

        }, 5 * 60 * 1000);

        afterAll(async () => {
            await apiService.loginWithProfile('identityAdmin');
            await identityService.deleteIdentityUser(testUser.idIdentityService);

        }, 60000);

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
            await taskList.getDataTable().waitForTableBody();
        });

        it('[C290045] Should display only tasks with Assigned status when Assigned is selected from status dropdown', async () => {
            await editTaskFilter.openFilter();
            await editTaskFilter.setStatusFilterDropDown('Assigned');

            await taskList.checkContentIsDisplayedByName(assignedTaskName);
            await taskList.checkContentIsNotDisplayedByName(createdTaskName);
            await taskList.checkContentIsNotDisplayedByName(completedTaskName);
            await taskList.checkContentIsNotDisplayedByName(deletedTaskName);
        });

        it('[C290061] Should display only tasks with Completed status when Completed is selected from status dropdown', async () => {
            await editTaskFilter.openFilter();
            await editTaskFilter.setStatusFilterDropDown('Completed');

            await taskList.checkContentIsDisplayedByName(completedTaskName);
            await taskList.checkContentIsNotDisplayedByName(assignedTaskName);
            await taskList.checkContentIsNotDisplayedByName(createdTaskName);
            await taskList.checkContentIsNotDisplayedByName(deletedTaskName);
        });

        it('[C290139] Should display only tasks with all statuses when All is selected from status dropdown', async () => {
            await editTaskFilter.openFilter();
            await editTaskFilter.clearAssignee();
            await editTaskFilter.setStatusFilterDropDown('All');

            await taskList.checkContentIsDisplayedByName(deletedTaskName);
            await taskList.checkContentIsDisplayedByName(assignedTaskName);
            await taskList.checkContentIsDisplayedByName(createdTaskName);
            await taskList.checkContentIsDisplayedByName(completedTaskName);
        });

        it('[C290060] Should display only tasks with Created status when Created is selected from status dropdown', async () => {
            await editTaskFilter.openFilter();
            await editTaskFilter.clearAssignee();
            await editTaskFilter.setStatusFilterDropDown('Created');

            await taskList.checkContentIsDisplayedByName(createdTaskName);
            await taskList.checkContentIsNotDisplayedByName(assignedTaskName);
            await taskList.checkContentIsNotDisplayedByName(completedTaskName);
            await taskList.checkContentIsNotDisplayedByName(deletedTaskName);
        });

        it('[C290155] Should display only tasks with Cancelled status when Cancelled is selected from status dropdown', async () => {
            await editTaskFilter.openFilter();
            await editTaskFilter.clearAssignee();
            await editTaskFilter.setStatusFilterDropDown('Cancelled');

            await taskList.checkContentIsDisplayedByName(deletedTaskName);
            await taskList.checkContentIsNotDisplayedByName(assignedTaskName);
            await taskList.checkContentIsNotDisplayedByName(completedTaskName);
            await taskList.checkContentIsNotDisplayedByName(createdTaskName);
        });

        describe('Dropdown', () => {
            let taskAssigned;

            beforeEach(async () => {
                const processDefinition = await processDefinitionService
                    .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.candidateUsersGroup, simpleApp);

                const processInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
                taskAssigned = await queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp);
                await processInstancesService.suspendProcessInstance(processInstance.entry.id, simpleApp);
            });

            it('[C317658] Should display only tasks with Suspended status when SUSPENDED is selected from status dropdown', async () => {
                await editTaskFilter.openFilter();
                await editTaskFilter.clearAssignee();
                await editTaskFilter.setStatusFilterDropDown('Suspended');
                await taskList.checkContentIsDisplayedByName(taskAssigned.list.entries[0].entry.name);
            });
        });
    });
});
