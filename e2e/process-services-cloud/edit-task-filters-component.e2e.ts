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

import TestConfig = require('../test.config');

import { LoginSSOPage } from '../pages/adf/loginSSOPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudComponent } from '../pages/adf/process-cloud/appListCloudComponent';
import { Util } from '../util/util';

import { Tasks } from '../actions/APS-cloud/tasks';

describe('Edit task filters cloud', () => {

    describe('Edit Task Filters', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        let appListCloudComponent = new AppListCloudComponent();
        let tasksCloudDemoPage = new TasksCloudDemoPage();
        const tasksService: Tasks = new Tasks();

        let silentLogin;
        const simpleApp = 'simple-app';
        const completedTaskName = Util.generateRandomString(), assignedTaskName = Util.generateRandomString();
        let assignedTask;

        beforeAll(async () => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginAPS(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await tasksService.init(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            assignedTask = await tasksService.createStandaloneTask(assignedTaskName, simpleApp);
            await tasksService.claimTask(assignedTask.entry.id, simpleApp);
            await tasksService.createAndCompleteTask(completedTaskName, simpleApp);
        });

        beforeEach((done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            done();
        });

        afterEach((done) => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            done();
        });

        it('[C291785] All the filters property should be set up accordingly with the Query Param', () => {
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getStateFilterDropDownValue()).toEqual('ASSIGNED');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Created Date');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getOrderFilterDropDownValue()).toEqual('DESC');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTaskName);

            tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('Completed Tasks');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getStateFilterDropDownValue()).toEqual('COMPLETED');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Created Date');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getOrderFilterDropDownValue()).toEqual('DESC');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
        });

        it('[C291786] Delete Save and Save as actions should be displayed when clicking on custom filter header', () => {
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
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();

            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('New').clickOnSaveButton();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();

            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().checkSaveButtonIsEnabled()).toEqual(false);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().checkSaveAsButtonIsEnabled()).toEqual(false);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().checkDeleteButtonIsEnabled()).toEqual(true);
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Created Date');
            tasksCloudDemoPage.customTaskFilter('custom-new').clickTaskFilter();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton();
        });

        it('[C291796] Two filters with same name can be created when clicking the Save As button', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();

            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('PRIORITY');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('PRIORITY');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton();
            tasksCloudDemoPage.customTaskFilter('custom-new').clickTaskFilter();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton();
        });

        it('[C291797] A filter is overrided when clicking on save button', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('NAME');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('NAME');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton();
        });

        it('[C291798] A filter is deleted when clicking on delete button', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            tasksCloudDemoPage.customTaskFilter('New').checkTaskFilterNotDisplayed();
        });

        it('[C291800] Task filter should not be created when task filter dialog is closed', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('PRIORITY');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('PRIORITY');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()).toEqual('My Tasks');
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('Cancel');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()).toEqual('Cancel');
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().clickOnCancelButton();
            tasksCloudDemoPage.customTaskFilter('Cancel').checkTaskFilterNotDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toEqual('My Tasks');
            tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Created Date');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
        });

        it('[C291801] Save button of task filter dialog should be disabled when task name is empty', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
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
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().checkSaveButtonIsEnabled()).toEqual(true);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().checkCancelButtonIsEnabled()).toEqual(true);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getTitle()).toEqual('Save filter as');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()).toEqual('My Tasks');
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().clickOnCancelButton();
        });

    });

});
