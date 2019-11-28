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
    SettingsPage, StringUtil, TasksService,
    LoginPage, ApiService,
    AppListCloudPage, LocalStorageUtil, IdentityService, GroupIdentityService
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { TaskListCloudConfiguration } from './config/task-list-cloud.config';

describe('Edit task filters and task list properties', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();

    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const settingsPage = new SettingsPage();

    let tasksService: TasksService;
    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;
    const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers);

    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;
    let createdTask, notDisplayedTask, priorityTask, subTask,
        otherOwnerTask, testUser, groupInfo;
    const priority = 30;

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

        priorityTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp, { priority: priority });
        await tasksService.claimTask(priorityTask.entry.id, simpleApp);

        notDisplayedTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), candidateBaseApp);
        await tasksService.claimTask(notDisplayedTask.entry.id, candidateBaseApp);

        subTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp, { 'parentTaskId': createdTask.entry.id });
        await tasksService.claimTask(subTask.entry.id, simpleApp);

        const jsonFile = new TaskListCloudConfiguration().getConfiguration();
        await settingsPage.setProviderBpmSso(
            browser.params.config.bpmHost,
            browser.params.config.oauth2.host,
            browser.params.config.identityHost, false, false);

        await loginPage.login(testUser.email, testUser.password);

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
                'standalone',
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
                'standalone',
                'owner',
                'assignee'
            ],
            'actions': [
                'save',
                'saveAs',
                'delete'
            ]
        }));
    });

    afterAll(async (done) => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await identityService.deleteIdentityUser(testUser.idIdentityService);
        done();
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
