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
    LoginPage, createApiService,
    AppListCloudPage, LocalStorageUtil, IdentityService, GroupIdentityService
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';
import { TaskListCloudConfiguration } from './../config/task-list-cloud.config';

describe('Edit task filters and task list properties', () => {
    const SORT_ORDER = {
        ASC: 'Ascending',
        DESC: 'Descending'
    };

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

    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;
    let createdTask; let notDisplayedTask; let noPriorityTask; let lowPriorityTask; let normalPriorityTask; let hightPriorityTask; let subTask;
        let otherOwnerTask; let testUser; let groupInfo;

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);

        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

        await apiService.login(testUser.username, testUser.password);

        otherOwnerTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
        await tasksService.claimTask(otherOwnerTask.entry.id, simpleApp);

        createdTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
        await tasksService.claimTask(createdTask.entry.id, simpleApp);

        noPriorityTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp, { priority: 0 });
        lowPriorityTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp, { priority: 1 });
        normalPriorityTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp, { priority: 2 });
        hightPriorityTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp, { priority: 3 });
        await tasksService.claimTask(noPriorityTask.entry.id, simpleApp);
        await tasksService.claimTask(lowPriorityTask.entry.id, simpleApp);
        await tasksService.claimTask(normalPriorityTask.entry.id, simpleApp);
        await tasksService.claimTask(hightPriorityTask.entry.id, simpleApp);

        notDisplayedTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), candidateBaseApp);
        await tasksService.claimTask(notDisplayedTask.entry.id, candidateBaseApp);

        subTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp, { parentTaskId: createdTask.entry.id });
        await tasksService.claimTask(subTask.entry.id, simpleApp);

        const jsonFile = new TaskListCloudConfiguration().getConfiguration();

        await loginSSOPage.login(testUser.username, testUser.password);
        await LocalStorageUtil.setConfigField('adf-cloud-task-list', JSON.stringify(jsonFile));
        await LocalStorageUtil.setConfigField('adf-edit-task-filter', JSON.stringify({
            filterProperties: [
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
            sortProperties: [
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
            actions: [
                'save',
                'saveAs',
                'delete'
            ]
        }));
    }, 5 * 60 * 1000);

    afterAll(async () => {
        await apiService.loginWithProfile('identityAdmin');
        await identityService.deleteIdentityUser(testUser.idIdentityService);
    });

    describe('Edit task filters and task list properties - sort properties', () => {
        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
            await editTaskFilter.openFilter();
            await taskFilter.checkTaskFilterIsDisplayed('my-tasks');
        });

        it('[C306901] Should display tasks sorted by task name when taskName is selected from sort dropdown', async () => {
            await editTaskFilter.setStatusFilterDropDown('Assigned');
            await editTaskFilter.setSortFilterDropDown('name');
            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.ASC);

            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.ASC, 'Task Name')).toBe(true);

            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.DESC);
            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.DESC, 'Task Name')).toBe(true);
        });

        it('[C290156] Should display tasks ordered by id when Id is selected from sort dropdown', async () => {
            await editTaskFilter.setStatusFilterDropDown('Assigned');
            await editTaskFilter.setSortFilterDropDown('id');
            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.ASC);

            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.ASC, 'Id')).toBe(true);

            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.DESC);
            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.DESC, 'Id')).toBe(true);
        });

        it('[C306903] Should display tasks sorted by processDefinitionId when processDefinitionId is selected from sort dropdown', async () => {
            await editTaskFilter.setStatusFilterDropDown('Assigned');
            await editTaskFilter.setSortFilterDropDown('processDefinitionId');
            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.ASC);
            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.ASC, 'ProcessDefinitionId')).toBe(true);

            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.DESC);
            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.DESC, 'ProcessDefinitionId')).toBe(true);
        });

        it('[C306905] Should display tasks sorted by processInstanceId when processInstanceId is selected from sort dropdown', async () => {
            await editTaskFilter.setStatusFilterDropDown('Assigned');
            await editTaskFilter.setSortFilterDropDown('processInstanceId');
            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.ASC);

            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.ASC, 'ProcessInstanceId')).toBe(true);

            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.DESC);
            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.DESC, 'ProcessInstanceId')).toBe(true);
        });

        it('[C306907] Should display tasks sorted by assignee when assignee is selected from sort dropdown', async () => {
            await editTaskFilter.clearAssignee();
            await editTaskFilter.setStatusFilterDropDown('All');
            await editTaskFilter.setSortFilterDropDown('assignee');
            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.ASC);

            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.ASC, 'Assignee')).toBe(true);

            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.DESC);
            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.DESC, 'Assignee')).toBe(true);
        });

        it('[C306911] Should display tasks sorted by parentTaskId when parentTaskId is selected from sort dropdown', async () => {
            await editTaskFilter.clearAssignee();
            await editTaskFilter.setStatusFilterDropDown('All');
            await editTaskFilter.setSortFilterDropDown('parentTaskId');
            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.ASC);

            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.ASC, 'ParentTaskId')).toBe(true);

            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.DESC);
            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.DESC, 'ParentTaskId')).toBe(true);
        });

        it('[C290087] Should display tasks ordered by priority when Priority is selected from sort dropdown', async () => {
            await editTaskFilter.setStatusFilterDropDown('All');
            await editTaskFilter.setSortFilterDropDown('priority');
            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.ASC);

            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.ASC, 'Priority', 'PRIORITY')).toBe(true);

            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.DESC);
            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.DESC, 'Priority', 'PRIORITY')).toBe(true);
        });

        it('[C307115] Should display tasks sorted by owner when owner is selected from sort dropdown', async () => {
            await editTaskFilter.clearAssignee();
            await editTaskFilter.setStatusFilterDropDown('All');
            await editTaskFilter.setSortFilterDropDown('owner');
            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.ASC);

            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.ASC, 'Owner')).toBe(true);

            await editTaskFilter.setOrderFilterDropDown(SORT_ORDER.DESC);
            await expect(await taskList.getDataTable().checkListIsSorted(SORT_ORDER.DESC, 'Owner')).toBe(true);
        });
    });
});
