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
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudComponent } from '../pages/adf/process-cloud/appListCloudComponent';
import { ConfigEditorPage } from '../pages/adf/configEditorPage';

import { ProcessDefinitions } from '../actions/APS-cloud/process-definitions';
import { ProcessInstances } from '../actions/APS-cloud/process-instances';
import { Tasks } from '../actions/APS-cloud/tasks';
import { Query } from '../actions/APS-cloud/query';

describe('Process list cloud', () => {

    describe('Process List', () => {
        const configEditorPage = new ConfigEditorPage();
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        let appListCloudComponent = new AppListCloudComponent();
        let processCloudDemoPage = new ProcessCloudDemoPage();
        let tasksCloudDemoPage = new TasksCloudDemoPage();

        const tasksService: Tasks = new Tasks();
        const processDefinitionService: ProcessDefinitions = new ProcessDefinitions();
        const processInstancesService: ProcessInstances = new ProcessInstances();
        const queryService: Query = new Query();

        let silentLogin;
        let completedProcess;
        const simpleApp = 'candidateuserapp';
        const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;

        beforeAll(async () => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginAPS(user, password);

            navigationBarPage.clickConfigEditorButton();
            configEditorPage.clickEditProcessCloudConfiguration();
            configEditorPage.clickClearButton();
            configEditorPage.enterConfiguration('{' +
                '"properties": [' +
                '"state",' + '"processInstanceId",' + '"sort",' + '"order"' +
                ']' +
                '}');
            configEditorPage.clickSaveButton();

            await processDefinitionService.init(user, password);
            let processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            await processInstancesService.init(user, password);
            await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);

            completedProcess = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            await queryService.init(user, password);
            let task = await queryService.getProcessInstanceTasks(completedProcess.entry.id, simpleApp);
            await tasksService.init(user, password);
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

        it('[C290069] Should display processes ordered by name when Name is selected from sort dropdown', async() => {
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setStateFilterDropDown('RUNNING')
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

        it('[C291783] Should display processes ordered by id when Id is selected from sort dropdown', async() => {
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setStateFilterDropDown('RUNNING')
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

        it('[C297697] The value of the filter should be preserved when saving it', async() => {
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()
                .setProcessInstanceId(completedProcess.entry.id);

            processCloudDemoPage.processListCloudComponent().getDataTable().checkSpinnerIsDisplayed().checkSpinnerIsNotDisplayed();

            expect(tasksCloudDemoPage.taskListCloudComponent().getDataTable().getAllDisplayedRows()).toBe(1);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(completedProcess.entry.id);

            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('New');

            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()).toEqual(completedProcess.entry.id);
        });

    });

});
