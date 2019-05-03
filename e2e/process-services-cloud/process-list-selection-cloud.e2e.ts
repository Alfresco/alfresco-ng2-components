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
import { LoginSSOPage } from '@alfresco/adf-testing';
import { SettingsPage } from '@alfresco/adf-testing';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';

import { ProcessDefinitionsService, ApiService } from '@alfresco/adf-testing';
import { ProcessInstancesService } from '@alfresco/adf-testing';

import resources = require('../util/resources');

describe('Process list cloud', () => {

    describe('Process List - selection', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const processCloudDemoPage = new ProcessCloudDemoPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();

        let processDefinitionService: ProcessDefinitionsService;
        let processInstancesService: ProcessInstancesService;

        const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
        const noOfProcesses = 3;
        let response;
        const processInstances = [];

        beforeAll(async (done) => {
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, false);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginSSOIdentityService(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            const apiService = new ApiService('activiti', TestConfig.adf.hostBPM, TestConfig.adf.hostSso, 'BPM');
            await apiService.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            processDefinitionService = new ProcessDefinitionsService(apiService);
            const processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);

            processInstancesService = new ProcessInstancesService(apiService);
            for (let i = 0; i < noOfProcesses; i++) {
                response = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
                processInstances.push(response.entry.id);
            }

            done();
        });

        beforeEach(async (done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            tasksCloudDemoPage.clickSettingsButton().disableDisplayProcessDetails();
            tasksCloudDemoPage.clickAppButton();
            done();
        });

        it('[C297469] Should NOT be able to select a process when settings are set to None', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('None');
            tasksCloudDemoPage.clickAppButton();
            expect(processCloudDemoPage.getActiveFilterName()).toEqual('Running Processes');

            processCloudDemoPage.processListCloudComponent().selectRowById(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkNoRowIsSelected();
        });

        it('[C297468] Should be able to select only one process when settings are set to Single', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('Single');
            tasksCloudDemoPage.clickAppButton();
            expect(processCloudDemoPage.getActiveFilterName()).toEqual('Running Processes');

            processCloudDemoPage.processListCloudComponent().selectRowById(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().checkRowIsSelectedById(processInstances[0]);
            expect(processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(1);
            processCloudDemoPage.processListCloudComponent().selectRowById(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().checkRowIsSelectedById(processInstances[1]);
            expect(processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(1);
        });

        it('[C297470] Should be able to select multiple processes using keyboard', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('Multiple');
            tasksCloudDemoPage.clickAppButton();
            expect(processCloudDemoPage.getActiveFilterName()).toEqual('Running Processes');

            processCloudDemoPage.processListCloudComponent().selectRowById(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().checkRowIsSelectedById(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().selectRowWithKeyboard(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().checkRowIsSelectedById(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().checkRowIsSelectedById(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().checkRowIsNotSelectedById(processInstances[2]);
            expect(processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(2);
        });

        it('[C297465] Should be able to select multiple processes using checkboxes', () => {
            tasksCloudDemoPage.clickSettingsButton().enableMultiSelection();
            tasksCloudDemoPage.clickAppButton();
            expect(processCloudDemoPage.getActiveFilterName()).toEqual('Running Processes');

            processCloudDemoPage.processListCloudComponent().checkCheckboxById(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().checkRowIsCheckedById(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().checkCheckboxById(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().checkRowIsCheckedById(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().checkRowIsNotCheckedById(processInstances[2]);
            processCloudDemoPage.processListCloudComponent().checkCheckboxById(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().checkRowIsNotCheckedById(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().checkRowIsCheckedById(processInstances[0]);
        });

        it('[C299125] Should be possible to select all the rows when multiselect is true', () => {
            tasksCloudDemoPage.clickSettingsButton().enableMultiSelection();
            tasksCloudDemoPage.clickAppButton();
            expect(processCloudDemoPage.getActiveFilterName()).toEqual('Running Processes');

            processCloudDemoPage.processListCloudComponent().getDataTable().checkAllRowsButtonIsDisplayed().checkAllRows();
            processCloudDemoPage.processListCloudComponent().checkRowIsCheckedById(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().checkRowIsCheckedById(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().checkRowIsCheckedById(processInstances[2]);

            processCloudDemoPage.processListCloudComponent().getDataTable().checkAllRowsButtonIsDisplayed().uncheckAllRows();
            processCloudDemoPage.processListCloudComponent().checkRowIsNotCheckedById(processInstances[0]);
            processCloudDemoPage.processListCloudComponent().checkRowIsNotCheckedById(processInstances[1]);
            processCloudDemoPage.processListCloudComponent().checkRowIsNotCheckedById(processInstances[2]);
        });

    });

});
