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
import { AppListCloudPage, StringUtil, ApiService, LoginSSOPage, TasksService, SettingsPage, IdentityService, RolesService } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import CONSTANTS = require('../util/constants');

import resources = require('../util/resources');

describe('Edit task filters cloud', () => {

    describe('Edit Task Filters', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const settingsPage = new SettingsPage();
        let tasksService: TasksService;
        let identityService: IdentityService;
        let rolesService: RolesService;
        let testUser, apsUserRoleId;
        const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, 'BPM');

        const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
        const completedTaskName = StringUtil.generateRandomString(), assignedTaskName = StringUtil.generateRandomString();

        beforeAll(async (done) => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            identityService = new IdentityService(apiService);
            rolesService = new RolesService(apiService);
            tasksService = new TasksService(apiService);
            testUser = await identityService.createIdentityUser();
            apsUserRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.APS_USER);
            await identityService.assignRole(testUser.idIdentityService, apsUserRoleId, CONSTANTS.ROLES.APS_USER);

            await apiService.login(testUser.email, testUser.password);
            const assignedTask = await tasksService.createStandaloneTask(assignedTaskName, simpleApp);
            await tasksService.claimTask(assignedTask.entry.id, simpleApp);
            await tasksService.createAndCompleteTask(completedTaskName, simpleApp);

            await settingsPage.setProviderBpmSso(
                browser.params.config.bpmHost,
                browser.params.config.oauth2.host,
                browser.params.config.identityHost);
            loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
            done();
        });

        afterAll(async(done) => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);
            done();
        });

        beforeEach(() => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
        });

        afterEach((done) => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            done();
        });

        it('[C291785] All the filters property should be set up accordingly with the Query Param', () => {
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getStatusFilterDropDownValue()).toEqual('ASSIGNED');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('CreatedDate');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getOrderFilterDropDownValue()).toEqual('DESC');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTaskName);

            tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('Completed Tasks');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getStatusFilterDropDownValue()).toEqual('COMPLETED');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('CreatedDate');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getOrderFilterDropDownValue()).toEqual('DESC');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
        });

        it('[C306896] Delete Save and Save as actions should be displayed when clicking on custom filter header', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            tasksCloudDemoPage.editTaskFilterCloudComponent().checkSaveButtonIsDisplayed().checkSaveAsButtonIsDisplayed()
                .checkDeleteButtonIsDisplayed();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().checkSaveButtonIsEnabled()).toEqual(false);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().checkSaveAsButtonIsEnabled()).toEqual(false);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().checkDeleteButtonIsEnabled()).toEqual(true);
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
        });

        it('[C291795] New filter is added when clicking Save As button', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('Id');
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();

            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('New').clickOnSaveButton();

            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().checkSaveButtonIsEnabled()).toEqual(false);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Id');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().checkSaveAsButtonIsEnabled()).toEqual(false);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().checkDeleteButtonIsEnabled()).toEqual(true);
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('CreatedDate');
            tasksCloudDemoPage.customTaskFilter('custom-new').clickTaskFilter();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Id');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton();
        });

        it('[C291796] Two filters with same name can be created when clicking the Save As button', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('Id');
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();

            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Id');
            tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('Priority');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Priority');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton();
            tasksCloudDemoPage.customTaskFilter('custom-new').clickTaskFilter();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Id');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton();
        });

        it('[C291797] A filter is overrided when clicking on save button', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('Id');
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Id');
            tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('Name');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Name');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton();
        });

        it('[C291798] A filter is deleted when clicking on delete button', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('Id');
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Id');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            tasksCloudDemoPage.customTaskFilter('New').checkTaskFilterNotDisplayed();
        });

        it('[C291800] Task filter should not be created when task filter dialog is closed', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('Priority');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Priority');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()).toEqual('My Tasks');
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('Cancel');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()).toEqual('Cancel');
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().clickOnCancelButton();
            tasksCloudDemoPage.customTaskFilter('Cancel').checkTaskFilterNotDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toEqual('My Tasks');
            tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('CreatedDate');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
        });

        it('[C291801] Save button of task filter dialog should be disabled when task name is empty', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('Id');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Id');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()).toEqual('My Tasks');
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().clearFilterName();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()).toEqual('');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().checkSaveButtonIsEnabled()).toEqual(false);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().checkCancelButtonIsEnabled()).toEqual(true);
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().clickOnCancelButton();
        });

        it('[C291799] Task filter dialog is displayed when clicking on Save As button', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('Id');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Id');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().checkSaveButtonIsEnabled()).toEqual(true);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().checkCancelButtonIsEnabled()).toEqual(true);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getTitle()).toEqual('Save filter as');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()).toEqual('My Tasks');
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().clickOnCancelButton();
        });

    });

});
