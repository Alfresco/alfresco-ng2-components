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
    AppListCloudPage, LocalStorageUtil, IdentityService, SettingsPage, GroupIdentityService
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { TaskListCloudConfiguration } from './taskListCloud.config';

import resources = require('../util/resources');

describe('Edit task filters and task list properties - filter properties and Sort properties', () => {

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

    const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
    const candidateBaseApp = resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.name;
    let createdTask, notDisplayedTask, processDefinition, priorityTask, subTask, otherOwnerTask, testUser, groupInfo;
    const priority = 30;

    beforeAll(async (done) => {

        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        tasksService = new TasksService(apiService);
        const settingsPage = new SettingsPage();

        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.roles.aps_user]);

        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.email, testUser.password);
        otherOwnerTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
        await tasksService.claimTask(otherOwnerTask.entry.id, simpleApp);

        createdTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
        await tasksService.claimTask(createdTask.entry.id, simpleApp);
        await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
        priorityTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp, {priority: priority});
        await tasksService.claimTask(priorityTask.entry.id, simpleApp);
        notDisplayedTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), candidateBaseApp);
        await tasksService.claimTask(notDisplayedTask.entry.id, candidateBaseApp);

        processDefinitionService = new ProcessDefinitionsService(apiService);
        processDefinition = await processDefinitionService.getProcessDefinitionByName('simpleProcess', simpleApp);
        processInstancesService = new ProcessInstancesService(apiService);
        await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);

        subTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp, {'parentTaskId': createdTask.entry.id});
        await tasksService.claimTask(subTask.entry.id, simpleApp);

        const jsonFile = new TaskListCloudConfiguration().getConfiguration();

        await settingsPage.setProviderBpmSso(
            browser.params.config.bpmHost,
            browser.params.config.oauth2.host,
            browser.params.config.identityHost);
        loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
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
        done();
    });

    afterAll(async (done) => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await identityService.deleteIdentityUser(testUser.idIdentityService);
        done();
    });

    beforeEach(() => {
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        appListCloudComponent.goToApp(simpleApp);
        tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
        tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
    });

    it('[C306901] Should display tasks sorted by task name when taskName is selected from sort dropdown', async () => {
        tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ASSIGNED')
            .setSortFilterDropDown('Name').setOrderFilterDropDown('ASC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByNameColumn('asc')).toBe(true, 'List is not sorted');

        tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByNameColumn('desc')).toBe(true, 'List is not sorted');
    });

    it('[C290156] Should display tasks ordered by id when Id is selected from sort dropdown', async () => {
        tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ASSIGNED')
            .setSortFilterDropDown('Id').setOrderFilterDropDown('ASC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByIdColumn('asc')).toBe(true, 'List is not sorted');

        tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByIdColumn('desc')).toBe(true, 'List is not sorted');
    });

    it('[C306903] Should display tasks sorted by processDefinitionId when processDefinitionId is selected from sort dropdown', async () => {
        tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ASSIGNED')
            .setSortFilterDropDown('ProcessDefinitionId').setOrderFilterDropDown('ASC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByProcessDefinitionIdColumn('asc')).toBe(true, 'List is not sorted');

        tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByProcessDefinitionIdColumn('desc')).toBe(true, 'List is not sorted');
    });

    it('[C306905] Should display tasks sorted by processInstanceId when processInstanceId is selected from sort dropdown', async () => {
        tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ASSIGNED')
            .setSortFilterDropDown('ProcessInstanceId').setOrderFilterDropDown('ASC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByProcessInstanceIdColumn('asc')).toBe(true, 'List is not sorted');

        tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByProcessInstanceIdColumn('desc')).toBe(true, 'List is not sorted');
    });

    it('[C306907] Should display tasks sorted by assignee when assignee is selected from sort dropdown', async () => {
        tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee().setStatusFilterDropDown('ALL')
            .setSortFilterDropDown('Assignee').setOrderFilterDropDown('ASC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByAssigneeColumn('asc')).toBe(true, 'List is not sorted');

        tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByAssigneeColumn('desc')).toBe(true, 'List is not sorted');

    });

    it('[C306911] Should display tasks sorted by parentTaskId when parentTaskId is selected from sort dropdown', async () => {
        tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee().setStatusFilterDropDown('ALL')
            .setSortFilterDropDown('ParentTaskId').setOrderFilterDropDown('ASC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByParentTaskIdColumn('asc')).toBe(true, 'List is not sorted');

        tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByParentTaskIdColumn('desc')).toBe(true, 'List is not sorted');
    });

    it('[C306909] Should display tasks sorted by priority when priority is selected from sort dropdown', async () => {
        tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee().setStatusFilterDropDown('ALL')
            .setSortFilterDropDown('Priority').setOrderFilterDropDown('ASC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByPriorityColumn('asc')).toBe(true, 'List is not sorted');

        tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByPriorityColumn('desc')).toBe(true, 'List is not sorted');
    });

    it('[C307114] Should display tasks sorted by standAlone when standAlone is selected from sort dropdown', async () => {
        tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee().setStatusFilterDropDown('ALL')
            .setSortFilterDropDown('StandAlone').setOrderFilterDropDown('ASC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByStandAloneColumn('asc')).toBe(true, 'List is not sorted');

        tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByStandAloneColumn('desc')).toBe(true, 'List is not sorted');
    });

    it('[C307115] Should display tasks sorted by owner when owner is selected from sort dropdown', async () => {
        tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee().setStatusFilterDropDown('ALL')
            .setSortFilterDropDown('Owner').setOrderFilterDropDown('ASC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByOwnerColumn('asc')).toBe(true, 'List is not sorted');

        tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(tasksCloudDemoPage.taskListCloudComponent().checkListIsSortedByOwnerColumn('desc')).toBe(true, 'List is not sorted');
    });

});
