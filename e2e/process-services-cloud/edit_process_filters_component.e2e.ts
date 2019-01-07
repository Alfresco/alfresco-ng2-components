/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/tasksCloudDemoPage';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/processCloudDemoPage';
import { AppListCloudComponent } from '../pages/adf/process_cloud/appListCloudComponent';
import { Util } from '../util/util';

import { Tasks } from '../actions/APS-cloud/tasks';

describe('Edit process filters cloud', () => {

    describe('Edit process Filters', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        let appListCloudComponent = new AppListCloudComponent();
        let tasksCloudDemoPage = new TasksCloudDemoPage();
        let processCloudDemoPage = new ProcessCloudDemoPage();

        const path = '/auth/realms/springboot';
        let silentLogin;
        const simpleApp = 'simple-app';

        beforeAll(async () => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostSso, TestConfig.adf.hostSso + path, silentLogin);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginAPS(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        });

        beforeEach((done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
            processCloudDemoPage.clickOnProcessFilters();
            done();
        });

        afterEach((done) => {
            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('START DATE');
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()).toEqual('START DATE');
            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveButton();
            done();
        });

        fit('[C291786] Delete Save and Save as actions should be displayed when clicking on custom filter header', () => {
            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('All Processes');
            processCloudDemoPage.editProcessFilterCloudComponent().checkSaveButtonIsDisplayed().checkSaveAsButtonIsDisplayed()
                .checkDeleteButtonIsDisplayed();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkSaveButtonIsEnabled()).toEqual(false);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkSaveAsButtonIsEnabled()).toEqual(false);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkDeleteButtonIsEnabled()).toEqual(true);
        });

        xit('[C291795] New filter is added when clicking Save As button', () => {
            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('New');
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkSaveButtonIsEnabled()).toEqual(false);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkSaveAsButtonIsEnabled()).toEqual(false);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkDeleteButtonIsEnabled()).toEqual(true);
            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()).toEqual('START DATE');
            processCloudDemoPage.customProcessFilter('custom-new').clickProcessFilter();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            processCloudDemoPage.editProcessFilterCloudComponent().clickDeleteButton();
        });

        it('[C291796] Two filters with same name can be created when clicking the Save As button', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('NAME');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton().setFilterName('New').clickOnSaveButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('NAME');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton();
            tasksCloudDemoPage.customTaskFilter('custom-new').clickTaskFilter();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton();
        });

        it('[C291797] A filter is overrided when clicking on save button', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('NAME');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('NAME');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton();
        });

        it('[C291798] A filter is deleted when clicking on delete button', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('New');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            tasksCloudDemoPage.customTaskFilter('New').checkTaskFilterNotDisplayed();
        });

        it('[C291799] Task filter dialog is displayed when clicking on Save As button', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().checkSaveButtonIsEnabled()
                .checkCancelButtonIsEnabled();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getTitle()).toEqual('Save filter as');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()).toEqual('My Tasks');
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().clickOnCancelButton();
        });

        it('[C291800] Task filter should not be created when task filter dialog is closed', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()).toEqual('My Tasks');
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('Cancel');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()).toEqual('Cancel');
            tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().clickOnCancelButton();
            tasksCloudDemoPage.customTaskFilter('Cancel').checkTaskFilterNotDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toEqual('My Tasks');
            tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()).toEqual('Created Date');
        });

        it('[C291801] Save button of task filter dialog should be disabled when task name is empty', () => {
            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();

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

    });

});
