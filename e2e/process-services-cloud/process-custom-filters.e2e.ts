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

import { TasksService, QueryService, ProcessDefinitionsService, ProcessInstancesService, LoginSSOPage, ApiService } from '@alfresco/adf-testing';
import { SettingsPage } from '../pages/adf/settingsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import { ConfigEditorPage } from '../pages/adf/configEditorPage';

import { browser, protractor } from 'protractor';

describe('Process list cloud', () => {

    describe('Process List', () => {
        const configEditorPage = new ConfigEditorPage();
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        let appListCloudComponent = new AppListCloudPage();
        let processCloudDemoPage = new ProcessCloudDemoPage();
        let tasksCloudDemoPage = new TasksCloudDemoPage();

        let tasksService: TasksService;
        let processDefinitionService: ProcessDefinitionsService;
        let processInstancesService: ProcessInstancesService;
        let queryService: QueryService;

        let silentLogin;
        let completedProcess, runningProcessInstance, switchProcessInstance, noOfApps;
        const simpleApp = 'candidateuserapp';

        beforeAll(async () => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            browser.ignoreSynchronization = true;
            loginSSOPage.loginSSOIdentityService(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            navigationBarPage.clickConfigEditorButton();
            configEditorPage.clickEditProcessCloudConfiguration();
            configEditorPage.clickClearButton();
            configEditorPage.enterConfiguration('{' +
                '"properties": [' +
                '"appName",' + '"state",' + '"processInstanceId",' + '"sort",' + '"order"' +
                ']' +
                '}');
            configEditorPage.clickSaveButton();

            const apiService = new ApiService('activiti', TestConfig.adf.url, TestConfig.adf.hostSso, 'BPM');
            await apiService.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            processDefinitionService = new ProcessDefinitionsService(apiService);
            let processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            processInstancesService = new ProcessInstancesService(apiService);
            await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            runningProcessInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            switchProcessInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);

            completedProcess = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            queryService = new QueryService(apiService);

            let task = await queryService.getProcessInstanceTasks(completedProcess.entry.id, simpleApp);
            tasksService = new TasksService(apiService);
            let claimedTask = await tasksService.claimTask(task.list.entries[0].entry.id, simpleApp);
            await tasksService.completeTask(claimedTask.entry.id, simpleApp);
        });

        beforeEach((done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
            processCloudDemoPage.clickOnProcessFilters();
            done();
        });

        it('[C290069] Should display processes ordered by name when Name is selected from sort dropdown', async () => {
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setStatusFilterDropDown('RUNNING')
                .setSortFilterDropDown('NAME').setOrderFilterDropDown('ASC');
            processCloudDemoPage.processListCloudComponent().getAllRowsNameColumn().then(function (list) {
                let initialList = list.slice(0);
                list.sort();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });

            processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC');
            processCloudDemoPage.processListCloudComponent().getAllRowsNameColumn().then(function (list) {
                let initialList = list.slice(0);
                list.sort();
                list.reverse();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });
        });

        it('[C291783] Should display processes ordered by id when Id is selected from sort dropdown', async () => {
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setStatusFilterDropDown('RUNNING')
                .setSortFilterDropDown('ID').setOrderFilterDropDown('ASC');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsDisplayed().checkSpinnerIsNotDisplayed();
            processCloudDemoPage.getAllRowsByIdColumn().then(function (list) {
                let initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });

            processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsDisplayed().checkSpinnerIsNotDisplayed();
            processCloudDemoPage.getAllRowsByIdColumn().then(function (list) {
                let initialList = list.slice(0);
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

            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsDisplayed().checkSpinnerIsNotDisplayed();

            expect(processCloudDemoPage.processListCloudComponent().getDataTable().numberOfRows()).toBe(1);
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(completedProcess.entry.id);

            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('New');

            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()).toEqual(completedProcess.entry.id);
        });

        it('[C297646] Should display the filter dropdown fine , after switching between saved filters', async () => {

            noOfApps = processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().getNumberOfAppNameOptions();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()).toBe(true);
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('RUNNING')
                .setAppNameDropDown(simpleApp).setProcessInstanceId(runningProcessInstance.entry.id);

            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsDisplayed().checkSpinnerIsNotDisplayed();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcessInstance.entry.id);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getNumberOfAppNameOptions()).toBe(noOfApps);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()).toBe(true);
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();

            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('SavedFilter').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('SavedFilter');

            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()).toEqual(runningProcessInstance.entry.id);

            processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('RUNNING')
                .setAppNameDropDown(simpleApp).setProcessInstanceId(switchProcessInstance.entry.id);

            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsDisplayed().checkSpinnerIsNotDisplayed();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(switchProcessInstance.entry.id);
            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('SwitchFilter').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('SwitchFilter');

            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()).toEqual(switchProcessInstance.entry.id);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getNumberOfAppNameOptions()).toBe(noOfApps);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()).toBe(true);
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        });

    });

});
