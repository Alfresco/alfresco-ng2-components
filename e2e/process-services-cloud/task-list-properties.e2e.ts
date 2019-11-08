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
    StringUtil, TasksService,
    ProcessDefinitionsService, ProcessInstancesService,
    LoginSSOPage, ApiService,
    AppListCloudPage, LocalStorageUtil, IdentityService, GroupIdentityService, DateUtil
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { TaskListCloudConfiguration } from './config/task-list-cloud.config';
import moment = require('moment');

describe('Edit task filters and task list properties', () => {

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();

    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();

    let tasksService: TasksService;
    let processDefinitionService: ProcessDefinitionsService;
    let processInstancesService: ProcessInstancesService;
    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;
    const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers);

    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;
    const noTasksFoundMessage = 'No Tasks Found';
    let createdTask, notAssigned, notDisplayedTask, processDefinition, processInstance, priorityTask, subTask,
        otherOwnerTask, testUser, groupInfo;
    const priority = 30;

    const beforeDate = moment().add(-1, 'days').format('DD/MM/YYYY');
    const currentDate = DateUtil.formatDate('DD/MM/YYYY');
    const afterDate = moment().add(1, 'days').format('DD/MM/YYYY');

    beforeAll(async () => {

        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        tasksService = new TasksService(apiService);

        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);

        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

        await apiService.login(testUser.email, testUser.password);

        otherOwnerTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
        await tasksService.claimTask(otherOwnerTask.entry.id, simpleApp);

        createdTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
        await tasksService.claimTask(createdTask.entry.id, simpleApp);

        notAssigned = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
        priorityTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp, { priority: priority });
        await tasksService.claimTask(priorityTask.entry.id, simpleApp);

        notDisplayedTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), candidateBaseApp);
        await tasksService.claimTask(notDisplayedTask.entry.id, candidateBaseApp);

        processDefinitionService = new ProcessDefinitionsService(apiService);
        processDefinition = await processDefinitionService
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.dropdownrestprocess, simpleApp);

        processInstancesService = new ProcessInstancesService(apiService);
        processInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);

        subTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp, { 'parentTaskId': createdTask.entry.id });
        await tasksService.claimTask(subTask.entry.id, simpleApp);

        const jsonFile = new TaskListCloudConfiguration().getConfiguration();

        await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
        await LocalStorageUtil.setConfigField('adf-cloud-task-list', JSON.stringify(jsonFile));
        await LocalStorageUtil.setConfigField('adf-edit-task-filter', JSON.stringify({
            'filterProperties': [
                'taskId',
                'appName',
                'status',
                'assignee',
                'taskName',
                'parentTaskId',
                'priority',
                'standAlone',
                'owner',
                'processDefinitionId',
                'processInstanceId',
                'lastModified',
                'sort',
                'order'
            ],
            'sortProperties': [
                'id',
                'name',
                'createdDate',
                'priority',
                'processDefinitionId',
                'processInstanceId',
                'parentTaskId',
                'priority',
                'standAlone',
                'owner',
                'assignee'
            ],
            'actions': [
                'save',
                'saveAs',
                'delete'
            ]
        }));
    }, 5 * 60 * 1000);

    afterAll(async (done) => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await identityService.deleteIdentityUser(testUser.idIdentityService);
        done();
    });

    describe('Edit task filters and task list properties - filter properties', () => {

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
            await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
        });

        it('[C292004] Filter by appName', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await expect(await tasksCloudDemoPage.editTaskFilterCloudComponent().getAppNameDropDownValue()).toEqual(simpleApp);

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(notDisplayedTask.entry.name);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setAppNameDropDown(candidateBaseApp);
            await expect(await tasksCloudDemoPage.editTaskFilterCloudComponent().getAppNameDropDownValue()).toEqual(candidateBaseApp);

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(notDisplayedTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTask.entry.name);
        });

        it('[C291906] Should be able to see only the task with specific taskId when typing it in the task Id field', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setId(createdTask.entry.id);
            await expect(await tasksCloudDemoPage.editTaskFilterCloudComponent().getId()).toEqual(createdTask.entry.id);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(createdTask.entry.id);
            await tasksCloudDemoPage.taskListCloudComponent().getRowsWithSameId(createdTask.entry.id).then(async (list) => {
                await expect(list.length).toEqual(1);
            });
        });

        it('[C291907] Should be able to see No tasks found when typing an invalid task id', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setId('invalidId');
            await expect(await tasksCloudDemoPage.editTaskFilterCloudComponent().getId()).toEqual('invalidId');

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297476] Filter by taskName', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setTaskName(createdTask.entry.name);
            await expect(await tasksCloudDemoPage.editTaskFilterCloudComponent().getTaskName()).toEqual(createdTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().getRowsWithSameName(createdTask.entry.name).then(async (list) => {
                await expect(list.length).toEqual(1);
            });
        });

        it('[C297613] Should be able to see No tasks found when typing a task name that does not exist', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setTaskName('invalidName');
            await expect(await tasksCloudDemoPage.editTaskFilterCloudComponent().getTaskName()).toEqual('invalidName');

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297480] Should be able to see only tasks that are part of a specific process when processInstanceId is set', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setProcessInstanceId(processInstance.entry.id);
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().getNumberOfRows()).toBe(1);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByProcessInstanceId(processInstance.entry.id);
        });

        it('[C297684] Should be able to see No tasks found when typing an invalid processInstanceId', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setProcessInstanceId('invalidTaskId');

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297478] Should be able to see only tasks that are assigned to a specific user when assignee is set', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setAssignee('admin.adf');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(notAssigned.entry.name);
        });

        it('[C297686] Should be able to see No tasks found when typing an invalid user to assignee field', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setAssignee('invalid');

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297482] Should be able to see only tasks with specific priority when priority is set', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setPriority(priority);

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(priorityTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTask.entry.name);
        });

        it('[C297687] Should be able to see No tasks found when typing unused value for priority field', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setPriority('87650');

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297481] Should be able to see only tasks with specific parentTaskId when parentTaskId is set', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setParentTaskId(subTask.entry.parentTaskId);

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(subTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTask.entry.name);
        });

        it('[C297486] Filter by Owner', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOwner(testUser.username);

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(notAssigned.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOwner('invalid');

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297484] Task is displayed when typing into lastModifiedFrom field a date before the task CreatedDate', async() => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(beforeDate);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(afterDate);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTask.entry.name);
        });

        it('[C297689] Task is not displayed when typing into lastModifiedFrom field the same date as tasks CreatedDate', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(currentDate);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTask.entry.name);
        });

        it('[C297485] Task is displayed when typing into lastModifiedTo field a date after the task CreatedDate', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(afterDate);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(beforeDate);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTask.entry.name);
        });

        it('[C297690] Task is not displayed when typing into lastModifiedTo field the same date as tasks CreatedDate', async () => {
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(currentDate);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTask.entry.name);
        });

        it('[C297691] Task is not displayed when typing into lastModifiedFrom field a date before the task due date  ' +
            'and into lastModifiedTo a date before task due date', async () => {

            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(beforeDate);
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(beforeDate);
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setTaskName(createdTask.entry.name);
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297692] Task is displayed when typing into lastModifiedFrom field a date before the tasks due date ' +
            'and into lastModifiedTo a date after', async () => {

            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(beforeDate);
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(afterDate);
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setTaskName(createdTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name);
        });

        it('[C297693] Task is not displayed when typing into lastModifiedFrom field a date after the tasks due date ' +
            'and into lastModifiedTo a date after', async () => {

            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(afterDate);
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(afterDate);
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

    });

    describe('Edit task filters and task list properties - sort properties', () => {

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
            await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
            await tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();

        });

        it('[C306901] Should display tasks sorted by task name when taskName is selected from sort dropdown', async () => {
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ASSIGNED');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('Name');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC');

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Name')).toBe(true);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Name')).toBe(true);

        });

        it('[C290156] Should display tasks ordered by id when Id is selected from sort dropdown', async () => {
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ASSIGNED');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('Id');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC');

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Id')).toBe(true);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Id')).toBe(true);

        });

        it('[C306903] Should display tasks sorted by processDefinitionId when processDefinitionId is selected from sort dropdown', async () => {
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ASSIGNED');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('ProcessDefinitionId');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC');
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'ProcessDefinitionId')).toBe(true);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'ProcessDefinitionId')).toBe(true);
        });

        it('[C306905] Should display tasks sorted by processInstanceId when processInstanceId is selected from sort dropdown', async () => {
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ASSIGNED');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('ProcessInstanceId');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC');

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'ProcessInstanceId')).toBe(true);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'ProcessInstanceId')).toBe(true);
        });

        it('[C306907] Should display tasks sorted by assignee when assignee is selected from sort dropdown', async () => {
            await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('Assignee');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC');

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Assignee')).toBe(true);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Assignee')).toBe(true);
        });

        it('[C306911] Should display tasks sorted by parentTaskId when parentTaskId is selected from sort dropdown', async () => {
            await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('ParentTaskId');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC');

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'ParentTaskId')).toBe(true);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'ParentTaskId')).toBe(true);
        });

        it('[C290087] Should display tasks ordered by priority when Priority is selected from sort dropdown', async () => {
            await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('Priority');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC');

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Priority')).toBe(true);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Priority')).toBe(true);

        });

        it('[C307114] Should display tasks sorted by standAlone when standAlone is selected from sort dropdown', async () => {
            await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('StandAlone');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC');

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'StandAlone')).toBe(true);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'StandAlone')).toBe(true);
        });

        it('[C307115] Should display tasks sorted by owner when owner is selected from sort dropdown', async () => {
            await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('Owner');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC');

            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Owner')).toBe(true);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
            await expect(await tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Owner')).toBe(true);
        });
    });

});
