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
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { AppListCloudComponent } from '../pages/adf/process-cloud/appListCloudComponent';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';

import { ProcessDefinitions } from '../actions/APS-cloud/process-definitions';
import { ProcessInstances } from '../actions/APS-cloud/process-instances';

describe('Process list cloud', () => {

    describe('Process List - selection', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        let appListCloudComponent = new AppListCloudComponent();
        let processCloudDemoPage = new ProcessCloudDemoPage();
        let tasksCloudDemoPage = new TasksCloudDemoPage();

        const processDefinitionService: ProcessDefinitions = new ProcessDefinitions();
        const processInstancesService: ProcessInstances = new ProcessInstances();

        let silentLogin;
        const simpleApp = 'simple-app';
        const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
        let noOfProcesses = 3, response;
        let processInstances = [];

        beforeAll(async (done) => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginAPS(user, password);

            await processDefinitionService.init(user, password);
            let processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            await processInstancesService.init(user, password);
            //runningProcess = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);

            for (let i = 0; i < noOfProcesses; i++) {
                response = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
                console.log("Response: ", response);
                //await tasksService.claimTask(response.entry.id, simpleApp);
                processInstances.push(response.entry.id);
            }

            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            tasksCloudDemoPage.clickSettingsButton().disableDisplayTaskDetails();
            tasksCloudDemoPage.clickAppButton();
            done();

        });

        it('[C291914] Should not be able to select any row when selection mode is set to None', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('None');
            tasksCloudDemoPage.clickAppButton();

            processCloudDemoPage.processListCloudComponent().getDataTable().selectRowByRowName(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkNoRowIsSelected();
        });

        it('[C291918] Should be able to select only one row when selection mode is set to Single', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('Single');
            tasksCloudDemoPage.clickAppButton();

            processCloudDemoPage.processListCloudComponent().getDataTable().selectRowByRowName(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkRowIsSelectedByName(processInstances[0]);
            expect(processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(1);
            processCloudDemoPage.processListCloudComponent().getDataTable().selectRowByRowName(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkRowIsSelectedByName(processInstances[1]);
            expect(processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(1);
        });

        it('[C291919] Should be able to select only one row when selection mode is set to Multiple', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('Multiple');
            tasksCloudDemoPage.clickAppButton();

            processCloudDemoPage.processListCloudComponent().getDataTable().selectRowByRowName(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkRowIsSelectedByName(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().getDataTable().selectRowByNameWithKeyboard(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkRowIsSelectedByName(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkRowIsSelectedByName(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkRowIsNotSelectedByName(processInstances[2]);
        });

        it('[C291916] Should be able to select multiple row when multiselect is true', () => {
            tasksCloudDemoPage.clickSettingsButton().enableMultiSelection();
            tasksCloudDemoPage.clickAppButton();

            processCloudDemoPage.processListCloudComponent().getDataTable().clickCheckboxByName(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkRowIsCheckedByName(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().getDataTable().clickCheckboxByName(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkRowIsCheckedByName(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkRowIsNotCheckedByName(processInstances[2]);
            processCloudDemoPage.processListCloudComponent().getDataTable().clickCheckboxByName(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkRowIsNotCheckedByName(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkRowIsCheckedByName(processInstances[0]);
        });

        it('[C291915] Should be possible select all the rows when multiselect is true', () => {
            tasksCloudDemoPage.clickSettingsButton().enableMultiSelection();
            tasksCloudDemoPage.clickAppButton();

            processCloudDemoPage.processListCloudComponent().getDataTable().checkAllRowsButtonIsDisplayed().checkAllRows();
            processCloudDemoPage.processListCloudComponent().getDataTable().checkRowIsCheckedByName(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().getDataTable().clickCheckboxByName(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkRowIsCheckedByName(processInstances[2]);
        });

    });

});
