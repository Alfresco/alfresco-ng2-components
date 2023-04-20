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
    AppListCloudPage,
    StringUtil, createApiService,
    LoginPage,
    TasksService,
    IdentityService,
    GroupIdentityService
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';

describe('Edit task filters cloud', () => {

    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();

    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const editTaskFilter = tasksCloudDemoPage.editTaskFilterCloud;
    const taskFilter = tasksCloudDemoPage.taskFilterCloudComponent;

    const apiService = createApiService();
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);
    const tasksService = new TasksService(apiService);

    let testUser; let groupInfo;

    const completedTaskName = StringUtil.generateRandomString();
        const assignedTaskName = StringUtil.generateRandomString();

    async function clickTaskFilter(name: string) {
        await taskFilter.clickTaskFilter(name);
    }

    async function waitTillContentLoaded() {
        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
    }

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

        await apiService.login(testUser.username, testUser.password);
        const assignedTask = await tasksService.createStandaloneTask(assignedTaskName, simpleApp);
        await tasksService.claimTask(assignedTask.entry.id, simpleApp);
        await tasksService.createAndCompleteTask(completedTaskName, simpleApp);

        await loginSSOPage.login(testUser.username, testUser.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('identityAdmin');
        await identityService.deleteIdentityUser(testUser.idIdentityService);
    });

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(simpleApp);
    });

    afterEach(async () => {
        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();
    });

    it('[C291785] All the filters property should be set up accordingly with the Query Param', async () => {
        await editTaskFilter.openFilter();
        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');
        await expect(await editTaskFilter.getStatusFilterDropDownValue()).toEqual('Assigned', `Status is no 'Assigned'`);
        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('createdDate', `Sort filter is not 'createdDate'`);
        await expect(await editTaskFilter.getOrderFilterDropDownValue()).toEqual('Descending', `Order is not 'Descending'`);

        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assignedTaskName);
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTaskName);

        await clickTaskFilter('completed-tasks');
        await waitTillContentLoaded();

        await expect(await taskFilter.getActiveFilterName()).toBe('Completed Tasks');
        await expect(await editTaskFilter.getStatusFilterDropDownValue()).toEqual('Completed', `Status is not 'Completed'`);
        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('createdDate', `Sort filter is not 'createdDate'`);
        await expect(await editTaskFilter.getOrderFilterDropDownValue()).toEqual('Descending', `Order is not 'Descending'`);

        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(assignedTaskName);
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
        await editTaskFilter.closeFilter();
    });

    it('[C306896] Delete Save and Save as actions should be displayed and disabled when clicking on default filter header', async () => {
        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await editTaskFilter.openFilter();
        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');

        await editTaskFilter.checkSaveButtonIsDisplayed();
        await editTaskFilter.checkSaveAsButtonIsDisplayed();
        await editTaskFilter.checkDeleteButtonIsDisplayed();

        await expect(await editTaskFilter.checkSaveButtonIsEnabled()).toEqual(false);
        await expect(await editTaskFilter.checkSaveAsButtonIsEnabled()).toEqual(false);
        await expect(await editTaskFilter.checkDeleteButtonIsEnabled()).toEqual(false);
        await editTaskFilter.closeFilter();
    });

    it('[C586756] Delete, Save and Save as actions should be displayed and enabled when clicking on custom filter header', async () => {
        await createNewCustomFilter('New');

        await clickTaskFilter('custom-new');
        await waitTillContentLoaded();

        await editTaskFilter.openFilter();
        await clickTaskFilter('custom-new');
        await waitTillContentLoaded();

        await expect(await taskFilter.getActiveFilterName()).toBe('New');

        await editTaskFilter.setSortFilterDropDown('priority');
        await editTaskFilter.checkSaveButtonIsDisplayed();
        await editTaskFilter.checkSaveAsButtonIsDisplayed();
        await editTaskFilter.checkDeleteButtonIsDisplayed();

        await expect(await editTaskFilter.checkSaveButtonIsEnabled()).toEqual(true);
        await expect(await editTaskFilter.checkSaveAsButtonIsEnabled()).toEqual(true);
        await expect(await editTaskFilter.checkDeleteButtonIsEnabled()).toEqual(true);
    });

    it('[C291795] New filter is added when clicking Save As button', async () => {
        await createNewCustomFilter('New');
        await expect(await taskFilter.getActiveFilterName()).toBe('New');
        await editTaskFilter.openFilter();
        await expect(await editTaskFilter.checkSaveButtonIsEnabled()).toEqual(false);
        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('id');
        await expect(await editTaskFilter.checkSaveAsButtonIsEnabled()).toEqual(false);
        await expect(await editTaskFilter.checkDeleteButtonIsEnabled()).toEqual(true);
        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('createdDate');
        await clickTaskFilter('custom-new');
        await waitTillContentLoaded();

        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('id');
        await editTaskFilter.clickDeleteButton();
    });

    it('[C291796] Two filters with same name can be created when clicking the Save As button', async () => {
        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await editTaskFilter.openFilter();
        await editTaskFilter.setSortFilterDropDown('id');

        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await editTaskFilter.clickSaveAsButton();

        const editTaskFilterDialog = editTaskFilter.editTaskFilterDialog();
        await editTaskFilterDialog.setFilterName('New');
        await editTaskFilterDialog.clickOnSaveButton();

        await expect(await taskFilter.getActiveFilterName()).toBe('New');
        await editTaskFilter.openFilter();

        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('id');
        await editTaskFilter.setSortFilterDropDown('priority');
        await editTaskFilter.clickSaveAsButton();
        await editTaskFilter.editTaskFilterDialog().setFilterName('New');
        await editTaskFilter.editTaskFilterDialog().clickOnSaveButton();

        await expect(await taskFilter.getActiveFilterName()).toBe('New');
        await editTaskFilter.openFilter();
        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('priority');
        await editTaskFilter.clickDeleteButton();
        await clickTaskFilter('custom-new');
        await waitTillContentLoaded();

        await editTaskFilter.openFilter();
        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('id');
        await editTaskFilter.clickDeleteButton();
    });

    it('[C291797] A filter is overridden when clicking on save button', async () => {
        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await editTaskFilter.openFilter();
        await editTaskFilter.setSortFilterDropDown('id');

        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await editTaskFilter.clickSaveAsButton();

        const editTaskFilterDialog = await editTaskFilter.editTaskFilterDialog();
        await editTaskFilterDialog.setFilterName('New');
        await editTaskFilterDialog.clickOnSaveButton();

        await expect(await taskFilter.getActiveFilterName()).toBe('New');
        await editTaskFilter.openFilter();
        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('id');
        await editTaskFilter.setSortFilterDropDown('name');
        await editTaskFilter.clickSaveButton();
        await editTaskFilter.openFilter();

        await expect(await taskFilter.getActiveFilterName()).toBe('New');
        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('name');
        await editTaskFilter.clickDeleteButton();
    });

    it('[C291798] A filter is deleted when clicking on delete button', async () => {
        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await editTaskFilter.openFilter();
        await editTaskFilter.setSortFilterDropDown('id');

        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await editTaskFilter.clickSaveAsButton();

        const editTaskFilterDialog = await editTaskFilter.editTaskFilterDialog();
        await editTaskFilterDialog.setFilterName('New');
        await editTaskFilterDialog.clickOnSaveButton();

        await expect(await taskFilter.getActiveFilterName()).toBe('New');
        await editTaskFilter.openFilter();
        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('id');
        await editTaskFilter.clickDeleteButton();

        await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');
        await taskFilter.checkTaskFilterNotDisplayed('New');
    });

    it('[C291800] Task filter should not be created when task filter dialog is closed', async () => {
        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await editTaskFilter.openFilter();
        await editTaskFilter.setSortFilterDropDown('priority');

        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('priority');
        await editTaskFilter.clickSaveAsButton();

        const dialog = editTaskFilter.editTaskFilterDialog();

        await expect(await dialog.getFilterName()).toEqual('My Tasks');
        await dialog.setFilterName('Cancel');
        await expect(await dialog.getFilterName()).toEqual('Cancel');
        await dialog.clickOnCancelButton();

        await taskFilter.checkTaskFilterNotDisplayed('Cancel');
        await expect(await taskFilter.getActiveFilterName()).toEqual('My Tasks');

        await clickTaskFilter('completed-tasks');
        await waitTillContentLoaded();
        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();
        await editTaskFilter.openFilter();

        await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');
        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('createdDate');

        await editTaskFilter.closeFilter();
    });

    it('[C291801] Save button of task filter dialog should be disabled when task name is empty', async () => {
        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await editTaskFilter.openFilter();
        await editTaskFilter.setSortFilterDropDown('id');

        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('id');
        await editTaskFilter.clickSaveAsButton();

        const dialog = editTaskFilter.editTaskFilterDialog();

        await expect(await dialog.getFilterName()).toEqual('My Tasks');
        await dialog.clearFilterName();
        await expect(await dialog.getFilterName()).toEqual('');
        await expect(await dialog.checkSaveButtonIsEnabled()).toEqual(false);
        await expect(await dialog.checkCancelButtonIsEnabled()).toEqual(true);
        await dialog.clickOnCancelButton();
    });

    it('[C291799] Task filter dialog is displayed when clicking on Save As button', async () => {
        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await editTaskFilter.openFilter();
        await editTaskFilter.setSortFilterDropDown('id');
        await expect(await editTaskFilter.getSortFilterDropDownValue()).toEqual('id');
        await editTaskFilter.clickSaveAsButton();

        const dialog = editTaskFilter.editTaskFilterDialog();

        await expect(await dialog.checkSaveButtonIsEnabled()).toEqual(true);
        await expect(await dialog.checkCancelButtonIsEnabled()).toEqual(true);
        await expect(await dialog.getTitle()).toEqual('Save filter as');
        await expect(await dialog.getFilterName()).toEqual('My Tasks');
        await dialog.clickOnCancelButton();
    });

    async function createNewCustomFilter(name: string): Promise<void> {
        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await editTaskFilter.openFilter();
        await editTaskFilter.setSortFilterDropDown('id');

        await clickTaskFilter('my-tasks');
        await waitTillContentLoaded();

        await editTaskFilter.clickSaveAsButton();

        const dialog = editTaskFilter.editTaskFilterDialog();
        await dialog.setFilterName(name);
        await dialog.clickOnSaveButton();
    }
});
