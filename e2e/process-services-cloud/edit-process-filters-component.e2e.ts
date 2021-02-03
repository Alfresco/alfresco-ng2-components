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

import {
    ApiService,
    AppListCloudPage,
    GroupIdentityService,
    IdentityService,
    LoginPage
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { ProcessCloudDemoPage } from './pages/process-cloud-demo.page';
import { TasksCloudDemoPage } from './pages/tasks-cloud-demo.page';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import CONSTANTS = require('../util/constants');

describe('Edit process filters cloud', () => {

    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const processCloudDemoPage = new ProcessCloudDemoPage();
    const editProcessFilter = processCloudDemoPage.editProcessFilterCloudComponent();
    const processFilter = processCloudDemoPage.processFilterCloudComponent;

    const apiService = new ApiService();
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);

    let testUser, groupInfo;

    const PROCESSES = CONSTANTS.PROCESS_FILTERS;

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

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
        await tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
        await processFilter.clickOnProcessFilters();

        await editProcessFilter.openFilter();
        await editProcessFilter.checkCustomiseFilterHeaderIsExpanded();
        await processFilter.clickAllProcessesFilter();
    });

    it('[C291804] Delete Save and Save as actions should be displayed when clicking on default filter header', async () => {
        await processFilter.clickAllProcessesFilter();
        await expect(await processFilter.getActiveFilterName()).toBe('All');
        await editProcessFilter.checkSaveButtonIsDisplayed();
        await editProcessFilter.checkSaveAsButtonIsDisplayed();
        await editProcessFilter.checkDeleteButtonIsDisplayed();
    });

    it('[C586757] Delete Save and Save as actions should be displayed and enabled when clicking on custom filter header', async () => {
        await createNewProcessCustomFilter('New');
        await expect(await processFilter.getActiveFilterName()).toBe('New');
        await processFilter.clickProcessFilter('custom-new');
        await editProcessFilter.openFilter();
        await editProcessFilter.setSortFilterDropDown('Start Date');
        await expect(await editProcessFilter.getSortFilterDropDownValue()).toEqual('Start Date');

        await editProcessFilter.checkSaveButtonIsDisplayed();
        await editProcessFilter.checkSaveAsButtonIsDisplayed();
        await editProcessFilter.checkDeleteButtonIsDisplayed();

        await expect(await editProcessFilter.checkSaveButtonIsEnabled()).toEqual(true);
        await expect(await editProcessFilter.checkSaveAsButtonIsEnabled()).toEqual(true);
        await expect(await editProcessFilter.checkDeleteButtonIsEnabled()).toEqual(true);
    });

    it('[C291805] New process filter is added when clicking Save As button', async () => {
        await createNewProcessCustomFilter('New');
        await browser.driver.sleep(1000);

        await expect(await processFilter.getActiveFilterName()).toBe('New');
        await editProcessFilter.openFilter();
        await expect(await editProcessFilter.getSortFilterDropDownValue()).toEqual('Id');
        await processFilter.clickAllProcessesFilter();
        await expect(await editProcessFilter.getSortFilterDropDownValue()).toEqual('Start Date');
        await processFilter.clickProcessFilter('custom-new');
        await expect(await editProcessFilter.getSortFilterDropDownValue()).toEqual('Id');
        await editProcessFilter.clickDeleteButton();
    });

    it('[C291806] Two process filters with same name can be created when clicking the Save As button', async () => {
        await editProcessFilter.setSortFilterDropDown('Id');
        await editProcessFilter.clickSaveAsButton();
        await editProcessFilter.editProcessFilterDialog().setFilterName('New');
        await editProcessFilter.editProcessFilterDialog().clickOnSaveButton();

        await browser.driver.sleep(1000);

        await editProcessFilter.openFilter();
        await editProcessFilter.checkCustomiseFilterHeaderIsExpanded();
        await expect(await processFilter.getActiveFilterName()).toBe('New');
        await expect(await editProcessFilter.getSortFilterDropDownValue()).toEqual('Id');
        await editProcessFilter.setSortFilterDropDown('Process Name');
        await expect(await editProcessFilter.getSortFilterDropDownValue()).toEqual('Process Name');
        await editProcessFilter.clickSaveAsButton();

        await editProcessFilter.editProcessFilterDialog().setFilterName('New');
        await editProcessFilter.editProcessFilterDialog().clickOnSaveButton();
        await editProcessFilter.openFilter();
        await editProcessFilter.checkCustomiseFilterHeaderIsExpanded();

        await browser.driver.sleep(1000);

        await expect(await processFilter.getActiveFilterName()).toBe('New');
        await expect(await editProcessFilter.getSortFilterDropDownValue()).toEqual('Process Name');
        await editProcessFilter.clickDeleteButton();

        await browser.driver.sleep(1000);

        await processFilter.clickProcessFilter('custom-new');
        await editProcessFilter.openFilter();
        await editProcessFilter.checkCustomiseFilterHeaderIsExpanded();
        await expect(await editProcessFilter.getSortFilterDropDownValue()).toEqual('Id');
        await editProcessFilter.clickDeleteButton();
    });

    it('[C291807] A process filter is overrided when clicking on save button', async () => {
        await editProcessFilter.setSortFilterDropDown('Id');
        await processFilter.clickAllProcessesFilter();
        await editProcessFilter.clickSaveAsButton();
        await editProcessFilter.editProcessFilterDialog().setFilterName('New');
        await editProcessFilter.editProcessFilterDialog().clickOnSaveButton();

        await browser.driver.sleep(1000);

        await expect(await processFilter.getActiveFilterName()).toBe('New');
        await editProcessFilter.openFilter();
        await editProcessFilter.checkCustomiseFilterHeaderIsExpanded();
        await expect(await editProcessFilter.getSortFilterDropDownValue()).toEqual('Id');
        await editProcessFilter.setSortFilterDropDown('Process Name');
        await expect(await editProcessFilter.getSortFilterDropDownValue()).toEqual('Process Name');
        await editProcessFilter.clickSaveButton();
        await editProcessFilter.openFilter();
        await editProcessFilter.checkCustomiseFilterHeaderIsExpanded();

        await browser.driver.sleep(1000);

        await expect(await processFilter.getActiveFilterName()).toBe('New');
        await expect(await editProcessFilter.getSortFilterDropDownValue()).toEqual('Process Name');
        await editProcessFilter.clickDeleteButton();
    });

    it('[C291808] A process filter is deleted when clicking on delete button', async () => {
        await editProcessFilter.setSortFilterDropDown('Id');
        await processFilter.clickAllProcessesFilter();
        await editProcessFilter.clickSaveAsButton();
        await editProcessFilter.editProcessFilterDialog().setFilterName('New');

        await browser.driver.sleep(1000);

        await editProcessFilter.editProcessFilterDialog().clickOnSaveButton();
        await editProcessFilter.openFilter();
        await expect(await processFilter.getActiveFilterName()).toBe('New');
        await expect(await editProcessFilter.getSortFilterDropDownValue()).toEqual('Id');
        await editProcessFilter.clickDeleteButton();

        await browser.driver.sleep(1000);

        await expect(await processFilter.getActiveFilterName()).toBe(CONSTANTS.PROCESS_FILTERS.RUNNING);
        await processFilter.checkProcessFilterNotDisplayed('New');
    });

    it('[C291810] Process filter should not be created when process filter dialog is closed', async () => {
        await editProcessFilter.setSortFilterDropDown('Id');
        await processFilter.clickAllProcessesFilter();
        await editProcessFilter.clickSaveAsButton();
        await editProcessFilter.editProcessFilterDialog().setFilterName('Cancel');
        await expect(await editProcessFilter.editProcessFilterDialog().getFilterName()).toEqual('Cancel');
        await editProcessFilter.editProcessFilterDialog().clickOnCancelButton();
        await processFilter.checkProcessFilterNotDisplayed('Cancel');
        await expect(await processFilter.getActiveFilterName()).toEqual(PROCESSES.ALL);
        await processFilter.clickRunningProcessesFilter();
        await expect(await processFilter.getActiveFilterName()).toEqual(PROCESSES.RUNNING);
        await editProcessFilter.openFilter();
        await processFilter.clickAllProcessesFilter();
        await expect(await processFilter.getActiveFilterName()).toEqual(PROCESSES.ALL);
        await expect(await editProcessFilter.getSortFilterDropDownValue()).toEqual('Start Date');
        await editProcessFilter.openFilter();
    });

    it('[C291811] Save button of process filter dialog should be disabled when process name is empty', async () => {
        await editProcessFilter.setSortFilterDropDown('Id');
        await processFilter.clickAllProcessesFilter();
        await editProcessFilter.clickSaveAsButton();

        const dialog = editProcessFilter.editProcessFilterDialog();
        await dialog.clearFilterName();

        await expect(await dialog.getFilterName()).toEqual('');
        await expect(await dialog.checkSaveButtonIsEnabled()).toEqual(false);
        await expect(await dialog.checkCancelButtonIsEnabled()).toEqual(true);
        await dialog.clickOnCancelButton();

        await editProcessFilter.openFilter();
        await editProcessFilter.checkCustomiseFilterHeaderIsExpanded();
        await editProcessFilter.setSortFilterDropDown('Start Date');
        await expect(await editProcessFilter.getSortFilterDropDownValue()).toEqual('Start Date');
        await editProcessFilter.clickSaveButton();
    });

    it('[C291809] Process filter dialog is displayed when clicking on Save As button', async () => {
        await editProcessFilter.setSortFilterDropDown('Name');
        await processFilter.clickAllProcessesFilter();
        await editProcessFilter.clickSaveAsButton();

        const dialog = editProcessFilter.editProcessFilterDialog();

        await expect(await dialog.checkCancelButtonIsEnabled()).toEqual(true);
        await expect(await dialog.checkSaveButtonIsEnabled()).toEqual(true);
        await expect(await dialog.getTitle()).toEqual('Save filter as');
        await expect(await dialog.getFilterName()).toEqual(PROCESSES.ALL);
        await dialog.clickOnCancelButton();
    });

    async function createNewProcessCustomFilter(name: string): Promise<void> {
        await editProcessFilter.setSortFilterDropDown('Id');
        await processFilter.clickAllProcessesFilter();

        await editProcessFilter.clickSaveAsButton();
        await editProcessFilter.editProcessFilterDialog().setFilterName(name);
        await editProcessFilter.editProcessFilterDialog().clickOnSaveButton();
    }
});
