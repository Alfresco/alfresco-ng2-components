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

import {
    StringUtil,
    TasksService,
    QueryService,
    ProcessDefinitionsService,
    ProcessInstancesService,
    LoginSSOPage,
    ApiService,
    IdentityService, GroupIdentityService
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';

describe('Task filters cloud', () => {

    describe('Filters', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const apiService = new ApiService(
            browser.params.config.oauth2.clientId,
            browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
        );
        let tasksService: TasksService;
        let identityService: IdentityService;
        let groupIdentityService: GroupIdentityService;
        let processDefinitionService: ProcessDefinitionsService;
        let processInstancesService: ProcessInstancesService;
        let queryService: QueryService;

        const createdTaskName = StringUtil.generateRandomString(),
            completedTaskName = StringUtil.generateRandomString(),
            assignedTaskName = StringUtil.generateRandomString(), deletedTaskName = StringUtil.generateRandomString();
        const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
        let assignedTask, deletedTask, testUser, groupInfo;
        const orderByNameAndPriority = ['cCreatedTask', 'dCreatedTask', 'eCreatedTask'];
        let priority = 30;
        const nrOfTasks = 3;

        beforeAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            identityService = new IdentityService(apiService);
            groupIdentityService = new GroupIdentityService(apiService);
            testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);

            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
            await apiService.login(testUser.email, testUser.password);

            tasksService = new TasksService(apiService);
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

            processDefinitionService = new ProcessDefinitionsService(apiService);
            const processDefinition = await processDefinitionService
                .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.simpleProcess, simpleApp);

            processInstancesService = new ProcessInstancesService(apiService);
            const processInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
            const secondProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);

            queryService = new QueryService(apiService);

            await browser.sleep(4000); // eventual consistency query
            await queryService.getProcessInstanceTasks(secondProcessInstance.entry.id, simpleApp);
            await processInstancesService.suspendProcessInstance(processInstance.entry.id, simpleApp);
            await processInstancesService.deleteProcessInstance(secondProcessInstance.entry.id, simpleApp);
            await queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp);

            await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);

        }, 5 * 60 * 1000);

        afterAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);

        }, 60000);

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

        });

        it('[C290045] Should display only tasks with Assigned status when Assigned is selected from status dropdown', async () => {
            await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ASSIGNED');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assignedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(deletedTaskName);
        });

        it('[C290061] Should display only tasks with Completed status when Completed is selected from status dropdown', async () => {
            await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('COMPLETED');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(assignedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(deletedTaskName);
        });

        it('[C290139] Should display only tasks with all statuses when All is selected from status dropdown', async () => {
            await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(deletedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assignedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
        });

        it('[C290060] Should display only tasks with Created status when Created is selected from status dropdown', async () => {
            await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CREATED');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(assignedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(deletedTaskName);
        });

        it('[C290155] Should display only tasks with Cancelled status when Cancelled is selected from status dropdown', async () => {
            await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CANCELLED');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(deletedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(assignedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTaskName);
        });

        it('[C317658] Should display only tasks with Suspended status when SUSPENDED is selected from status dropdown', async () => {
            const processDefinition = await processDefinitionService
                .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.dropdownrestprocess, simpleApp);

            const processInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);

            const taskAssigned = await queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp);

            await processInstancesService.suspendProcessInstance(processInstance.entry.id, simpleApp);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('SUSPENDED');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(taskAssigned.list.entries[0].entry.name);

        });
    });
});
