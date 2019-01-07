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

        it('[C291804] Delete Save and Save as actions should be displayed when clicking on custom filter header', () => {
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

        it('[C291805] New process filter is added when clicking Save As button', () => {
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

        it('[C291806] Two process filters with same name can be created when clicking the Save As button', () => {
            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('New');
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('NAME');
            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton().setFilterName('New').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('New');
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()).toEqual('NAME');
            processCloudDemoPage.editProcessFilterCloudComponent().clickDeleteButton();
            processCloudDemoPage.customProcessFilter('custom-new').clickProcessFilter();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            processCloudDemoPage.editProcessFilterCloudComponent().clickDeleteButton();
        });

        it('[C291807] A process filter is overrided when clicking on save button', () => {
            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('New');
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('NAME');
            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('New');
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()).toEqual('NAME');
            processCloudDemoPage.editProcessFilterCloudComponent().clickDeleteButton();
        });

        xit('[C291808] A process filter is deleted when clicking on delete button', () => {
            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('New');
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            processCloudDemoPage.editProcessFilterCloudComponent().clickDeleteButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('All Processes');
            processCloudDemoPage.customProcessFilter('New').checkProcessFilterNotDisplayed();
        });

        it('[C291809] Process filter dialog is displayed when clicking on Save As button', () => {
            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().checkSaveButtonIsEnabled()).toEqual(true);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().checkCancelButtonIsEnabled()).toEqual(true);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().getTitle()).toEqual('Save filter as');
            expect(processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().getFilterName()).toEqual('All Processes');
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnCancelButton();
        });

        it('[C291810] Process filter should not be created when process filter dialog is closed', () => {
            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().getFilterName()).toEqual('All Processes');
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('Cancel');
            expect(processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().getFilterName()).toEqual('Cancel');
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnCancelButton();
            processCloudDemoPage.customProcessFilter('Cancel').checkProcessFilterNotDisplayed();
            expect(processCloudDemoPage.getActiveFilterName()).toEqual('All Processes');
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()).toEqual('START DATE');
        });

        it('[C291811] Save button of process filter dialog should be disabled when process name is empty', () => {
            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();

            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setSortFilterDropDown('ID');
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()).toEqual('ID');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();
            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().getFilterName()).toEqual('All Processes');
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clearFilterName();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().getFilterName()).toEqual('');
            expect(processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().checkSaveButtonIsEnabled()).toEqual(false);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().checkCancelButtonIsEnabled()).toEqual(true);
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnCancelButton();
        });

    });

});
