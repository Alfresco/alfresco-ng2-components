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
    StringUtil, TasksService,
    ProcessDefinitionsService, ProcessInstancesService,
    LoginPage, createApiService,
    AppListCloudPage, LocalStorageUtil, IdentityService, GroupIdentityService, DateUtil
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';
import { TaskListCloudConfiguration } from './../config/task-list-cloud.config';
import * as moment from 'moment';
import { taskFilterConfiguration } from './../config/task-filter.config';

describe('Edit task filters and task list properties', () => {

    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();

    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const editTaskFilter = tasksCloudDemoPage.editTaskFilterCloud;
    const taskFilter = tasksCloudDemoPage.taskFilterCloudComponent;
    const taskList = tasksCloudDemoPage.taskListCloudComponent();

    const apiService = createApiService();
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);
    const tasksService = new TasksService(apiService);
    const processDefinitionService = new ProcessDefinitionsService(apiService);
    const processInstancesService = new ProcessInstancesService(apiService);

    const noTasksFoundMessage = 'No Tasks Found';
    let createdTask; let notAssigned; let notDisplayedTask; let processDefinition; let processInstance; let priorityTask; let subTask;
        let otherOwnerTask; let testUser; let groupInfo; let simpleTask;
    const priority = 1;

    const beforeDate = moment().add(-1, 'days').format('DD/MM/YYYY');
    const currentDate = DateUtil.formatDate('DD/MM/YYYY');
    const afterDate = moment().add(1, 'days').format('DD/MM/YYYY');

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);

        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

        await apiService.login(testUser.username, testUser.password);

        otherOwnerTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
        await tasksService.claimTask(otherOwnerTask.entry.id, simpleApp);

        createdTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
        await tasksService.claimTask(createdTask.entry.id, simpleApp);

        simpleTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
        notAssigned = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
        priorityTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp, { priority });
        await tasksService.claimTask(priorityTask.entry.id, simpleApp);

        notDisplayedTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), candidateBaseApp);
        await tasksService.claimTask(notDisplayedTask.entry.id, candidateBaseApp);

        processDefinition = await processDefinitionService
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.candidateUsersGroup, simpleApp);

        processInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);

        subTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp, { parentTaskId: createdTask.entry.id });
        await tasksService.claimTask(subTask.entry.id, simpleApp);

        const jsonFile = new TaskListCloudConfiguration().getConfiguration();

        await loginSSOPage.login(testUser.username, testUser.password);
        await LocalStorageUtil.setConfigField('adf-cloud-task-list', JSON.stringify(jsonFile));
        await LocalStorageUtil.setConfigField('adf-edit-task-filter', JSON.stringify(taskFilterConfiguration));
    }, 5 * 60 * 1000);

    afterAll(async () => {
        await apiService.loginWithProfile('identityAdmin');
        await identityService.deleteIdentityUser(testUser.idIdentityService);
    });

    describe('Edit task filters and task list properties - filter properties', () => {

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
            await editTaskFilter.openFilter();
            await taskFilter.checkTaskFilterIsDisplayed('my-tasks');
        });

        it('[C292004] Filter by appName', async () => {
            await expect(await editTaskFilter.getAppNameDropDownValue()).toEqual(simpleApp);
            await editTaskFilter.closeFilter();

            await taskList.checkContentIsDisplayedByName(createdTask.entry.name);
            await taskList.checkContentIsNotDisplayedByName(notDisplayedTask.entry.name);

            await editTaskFilter.openFilter();
            await editTaskFilter.setAppNameDropDown(candidateBaseApp);
            await expect(await editTaskFilter.getAppNameDropDownValue()).toEqual(candidateBaseApp);

            await editTaskFilter.closeFilter();
            await taskList.checkContentIsDisplayedByName(notDisplayedTask.entry.name);
            await taskList.checkContentIsNotDisplayedByName(createdTask.entry.name);
        });

        it('[C291906] Should be able to see only the task with specific taskId when typing it in the task Id field', async () => {
            await editTaskFilter.setId(createdTask.entry.id);
            await expect(await editTaskFilter.getId()).toEqual(createdTask.entry.id);
            await editTaskFilter.closeFilter();
            await taskList.checkContentIsDisplayedById(createdTask.entry.id);
            await taskList.getRowsWithSameId(createdTask.entry.id).then(async (list) => {
                await expect(list.length).toEqual(1);
            });
        });

        it('[C291907] Should be able to see No tasks found when typing an invalid task id', async () => {
            await editTaskFilter.setId('invalidId');
            await expect(await editTaskFilter.getId()).toEqual('invalidId');

            await editTaskFilter.closeFilter();
            await expect(await taskList.getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297476] Filter by taskName', async () => {
            await editTaskFilter.setTaskName(createdTask.entry.name);
            await expect(await editTaskFilter.getTaskName()).toEqual(createdTask.entry.name);
            await editTaskFilter.closeFilter();
            await taskList.getRowsWithSameName(createdTask.entry.name).then(async (list) => {
                await expect(list.length).toEqual(1);
            });
        });

        it('[C297613] Should be able to see No tasks found when typing a task name that does not exist', async () => {
            await editTaskFilter.setTaskName('invalidName');
            await expect(await editTaskFilter.getTaskName()).toEqual('invalidName');
            await editTaskFilter.closeFilter();
            await expect(await taskList.getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297480] Should be able to see only tasks that are part of a specific process when processInstanceId is set', async () => {
            await editTaskFilter.setProcessInstanceId(processInstance.entry.id);
            await editTaskFilter.setStatusFilterDropDown('All');
            await editTaskFilter.clearAssignee();
            await editTaskFilter.closeFilter();

            await expect(await taskList.getDataTable().getNumberOfRows()).toBe(1);

            await taskList.checkContentIsDisplayedByProcessInstanceId(processInstance.entry.id);
        });

        it('[C297684] Should be able to see No tasks found when typing an invalid processInstanceId', async () => {
            await editTaskFilter.setProcessInstanceId('invalidTaskId');
            await editTaskFilter.closeFilter();
            await expect(await taskList.getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297478] Should be able to see only tasks that are assigned to a specific user when assignee is set', async () => {
            await editTaskFilter.setAssignee(testUser.username);
            await editTaskFilter.closeFilter();
            await taskList.checkContentIsDisplayedByName(createdTask.entry.name);
            await taskList.checkContentIsNotDisplayedByName(notAssigned.entry.name);
        });

        it('[C297686] Should be able to see No tasks found when typing an invalid user to assignee field', async () => {
            await editTaskFilter.setAssignee('invalid');
            await editTaskFilter.closeFilter();
            await expect(await taskList.getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297482] Should be able to see only tasks with specific priority when priority is set', async () => {
            await editTaskFilter.setPriority('Low');
            await editTaskFilter.closeFilter();
            await taskList.checkContentIsDisplayedByName(priorityTask.entry.name);
            await taskList.checkContentIsNotDisplayedByName(createdTask.entry.name);
        });

        it('[C297687] Should be able to see No tasks found when typing unused value for priority field', async () => {
            await editTaskFilter.setPriority('Normal');
            await editTaskFilter.closeFilter();
            await expect(await taskList.getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297481] Should be able to see only tasks with specific parentTaskId when parentTaskId is set', async () => {
            await editTaskFilter.setParentTaskId(subTask.entry.parentTaskId);
            await editTaskFilter.closeFilter();
            await taskList.checkContentIsDisplayedByName(subTask.entry.name);
            await taskList.checkContentIsNotDisplayedByName(createdTask.entry.name);
        });

        it('[C297486] Filter by Owner', async () => {
            await editTaskFilter.setStatusFilterDropDown('All');
            await editTaskFilter.clearAssignee();
            await editTaskFilter.setOwner(testUser.username);
            await editTaskFilter.closeFilter();
            await taskList.checkContentIsDisplayedByName(notAssigned.entry.name);
            await taskList.checkContentIsDisplayedByName(createdTask.entry.name);
            await editTaskFilter.openFilter();
            await editTaskFilter.setOwner('invalid');
            await editTaskFilter.closeFilter();

            await expect(await taskList.getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297484] Task is displayed when typing into lastModifiedFrom field a date before the task CreatedDate', async () => {
            await editTaskFilter.setLastModifiedFrom(beforeDate);
            await editTaskFilter.closeFilter();
            await taskList.checkContentIsDisplayedByName(createdTask.entry.name);

            await editTaskFilter.openFilter();
            await editTaskFilter.setLastModifiedFrom(afterDate);
            await editTaskFilter.closeFilter();
            await taskList.checkContentIsNotDisplayedByName(createdTask.entry.name);
        });

        it('[C297689] Task is not displayed when typing into lastModifiedFrom field the same date as tasks CreatedDate', async () => {
            await editTaskFilter.setLastModifiedFrom(currentDate);
            await editTaskFilter.setTaskName(simpleTask.entry.name);
            await editTaskFilter.closeFilter();
            await taskList.checkContentIsNotDisplayedByName(simpleTask.entry.name);
        });

        it('[C297485] Task is displayed when typing into lastModifiedTo field a date after the task CreatedDate', async () => {
            await editTaskFilter.setLastModifiedTo(afterDate);
            await editTaskFilter.closeFilter();
            await taskList.checkContentIsDisplayedByName(createdTask.entry.name);

            await editTaskFilter.openFilter();
            await editTaskFilter.setLastModifiedTo(beforeDate);
            await editTaskFilter.closeFilter();
            await taskList.checkContentIsNotDisplayedByName(createdTask.entry.name);
        });

        it('[C297690] Task is not displayed when typing into lastModifiedTo field the same date as tasks CreatedDate', async () => {
            await editTaskFilter.setLastModifiedTo(currentDate);
            await editTaskFilter.setTaskName(simpleTask.entry.name);
            await editTaskFilter.closeFilter();
            await taskList.checkContentIsNotDisplayedByName(simpleTask.entry.name);
        });

        it('[C297691] Task is not displayed when typing into lastModifiedFrom field a date before the task due date  ' +
            'and into lastModifiedTo a date before task due date', async () => {
            await editTaskFilter.setLastModifiedFrom(beforeDate);
            await editTaskFilter.setLastModifiedTo(beforeDate);
            await editTaskFilter.setTaskName(createdTask.entry.name);
            await editTaskFilter.closeFilter();
            await expect(await taskList.getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297692] Task is displayed when typing into lastModifiedFrom field a date before the tasks due date ' +
            'and into lastModifiedTo a date after', async () => {
            await editTaskFilter.setLastModifiedFrom(beforeDate);
            await editTaskFilter.setLastModifiedTo(afterDate);
            await editTaskFilter.setTaskName(createdTask.entry.name);
            await editTaskFilter.closeFilter();
            await taskList.checkContentIsDisplayedByName(createdTask.entry.name);
        });

        it('[C297693] Task is not displayed when typing into lastModifiedFrom field a date after the tasks due date ' +
            'and into lastModifiedTo a date after', async () => {
            await editTaskFilter.setLastModifiedFrom(afterDate);
            await editTaskFilter.setLastModifiedTo(afterDate);
            await editTaskFilter.closeFilter();
            await expect(await taskList.getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });
    });
});
