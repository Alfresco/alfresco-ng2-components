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

import {
    TasksService, QueryService, ProcessDefinitionsService, ProcessInstancesService,
    LoginSSOPage, ApiService, SettingsPage
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage, LocalStorageUtil, BrowserActions } from '@alfresco/adf-testing';
import resources = require('../util/resources');
import { browser } from 'protractor';

describe('Process list cloud', () => {

    describe('Process List', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const processCloudDemoPage = new ProcessCloudDemoPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();

        let tasksService: TasksService;
        let processDefinitionService: ProcessDefinitionsService;
        let processInstancesService: ProcessInstancesService;
        let queryService: QueryService;

        let completedProcess, runningProcessInstance, switchProcessInstance, noOfApps;
        const candidateuserapp = resources.ACTIVITI7_APPS.CANDIDATE_USER_APP.name;

        beforeAll(async (done) => {
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, false);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginSSOIdentityService(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await LocalStorageUtil.setConfigField('adf-edit-process-filter', JSON.stringify({
                'filterProperties': [
                    'appName',
                    'status',
                    'processInstanceId',
                    'order',
                    'sort',
                    'order'
                ],
                'sortProperties': [
                    'id',
                    'name',
                    'status',
                    'startDate'
                ],
                'actions': [
                    'save',
                    'saveAs',
                    'delete'
                ]
            }));

            const apiService = new ApiService('activiti', TestConfig.adf.hostBPM, TestConfig.adf.hostSso, 'BPM');
            await apiService.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            processDefinitionService = new ProcessDefinitionsService(apiService);
            const processDefinition = await processDefinitionService.getProcessDefinitions(candidateuserapp);

            processInstancesService = new ProcessInstancesService(apiService);
            await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, candidateuserapp);

            runningProcessInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, candidateuserapp);
            switchProcessInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, candidateuserapp);

            completedProcess = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, candidateuserapp);
            queryService = new QueryService(apiService);

            const task = await queryService.getProcessInstanceTasks(completedProcess.entry.id, candidateuserapp);
            tasksService = new TasksService(apiService);
            const claimedTask = await tasksService.claimTask(task.list.entries[0].entry.id, candidateuserapp);
            await tasksService.completeTask(claimedTask.entry.id, candidateuserapp);
            done();
        });

        beforeEach(async (done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(candidateuserapp);
            tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
            processCloudDemoPage.clickOnProcessFilters();
            done();
        });

        xit('[C290069] Should display processes ordered by name when Name is selected from sort dropdown', async () => {
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setStatusFilterDropDown('RUNNING')
                .setSortFilterDropDown('Name').setOrderFilterDropDown('ASC');
            processCloudDemoPage.processListCloudComponent().getAllRowsNameColumn().then(function (list) {
                const initialList = list.slice(0);
                list.sort();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });

            processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC');
            processCloudDemoPage.processListCloudComponent().getAllRowsNameColumn().then(function (list) {
                const initialList = list.slice(0);
                list.sort();
                list.reverse();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });
        });

        it('[C291783] Should display processes ordered by id when Id is selected from sort dropdown', async () => {
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setStatusFilterDropDown('RUNNING')
                .setSortFilterDropDown('Id').setOrderFilterDropDown('ASC');
            processCloudDemoPage.processListCloudComponent().getDataTable();
            browser.driver.sleep(1000);
            processCloudDemoPage.getAllRowsByIdColumn().then(function (list) {
                const initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });

            processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC');
            processCloudDemoPage.processListCloudComponent().getDataTable();
            browser.driver.sleep(1000);
            processCloudDemoPage.getAllRowsByIdColumn().then(function (list) {
                const initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                list.reverse();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });
        });

        it('[C297697] The value of the filter should be preserved when saving it', async () => {
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()
                .setProcessInstanceId(completedProcess.entry.id);

            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('New');

            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(completedProcess.entry.id);
            expect(processCloudDemoPage.processListCloudComponent().getDataTable().numberOfRows()).toBe(1);

            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()).toEqual(completedProcess.entry.id);
        });

        it('[C297646] Should display the filter dropdown fine , after switching between saved filters', async () => {

            noOfApps = processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().getNumberOfAppNameOptions();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()).toBe(true);
            BrowserActions.closeMenuAndDialogs();
            processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('RUNNING')
                .setAppNameDropDown(candidateuserapp).setProcessInstanceId(runningProcessInstance.entry.id);

            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcessInstance.entry.id);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getNumberOfAppNameOptions()).toBe(noOfApps);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()).toBe(true);
            BrowserActions.closeMenuAndDialogs();

            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('SavedFilter').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('SavedFilter');

            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()).toEqual(runningProcessInstance.entry.id);

            processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('RUNNING')
                .setAppNameDropDown(candidateuserapp).setProcessInstanceId(switchProcessInstance.entry.id);

            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(switchProcessInstance.entry.id);
            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('SwitchFilter').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('SwitchFilter');

            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()).toEqual(switchProcessInstance.entry.id);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getNumberOfAppNameOptions()).toBe(noOfApps);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()).toBe(true);
            BrowserActions.closeMenuAndDialogs();
        });

    });

});
