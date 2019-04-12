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

import { ApiService, LoginSSOPage, ProcessDefinitionsService, ProcessInstancesService, SettingsPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { ProcessListCloudConfiguration } from './processListCloud.config';
import { ConfigEditorPage } from '../pages/adf/configEditorPage';
import { EditProcessFilterConfiguration } from './editProcessFilter.config';

describe('Edit process filters cloud', () => {

    describe('Edit process Filters', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const processCloudDemoPage = new ProcessCloudDemoPage();
        const configEditor = new ConfigEditorPage();

        let silentLogin;
        let jsonFile;
        const simpleApp = 'simple-app';
        let processDefinitionService: ProcessDefinitionsService;
        let processInstancesService: ProcessInstancesService;

        beforeAll(async () => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            browser.ignoreSynchronization = true;
            loginSSOPage.loginSSOIdentityService(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            const editProcessFilterConfiguration = new EditProcessFilterConfiguration();
            jsonFile = editProcessFilterConfiguration.getConfiguration();
            navigationBarPage.clickConfigEditorButton();
            configEditor.clickEditProcessCloudConfiguration();
            configEditor.clickClearButton();
            configEditor.enterBigConfigurationText(JSON.stringify(jsonFile)).clickSaveButton();

            const processListCloudConfiguration = new ProcessListCloudConfiguration();
            jsonFile = processListCloudConfiguration.getConfiguration();
            navigationBarPage.clickConfigEditorButton();
            configEditor.clickProcessListCloudConfiguration();
            configEditor.clickClearButton();
            configEditor.enterBigConfigurationText(JSON.stringify(jsonFile)).clickSaveButton();

            const apiService = new ApiService('activiti', TestConfig.adf.hostBPM, TestConfig.adf.hostSso, 'BPM');
            await apiService.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            processDefinitionService = new ProcessDefinitionsService(apiService);
            const processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            processInstancesService = new ProcessInstancesService(apiService);
            await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            // const runningProcessInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            // const switchProcessInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);

            // const completedProcess = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);

        });

        beforeEach((done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().checkCustomiseFilterHeaderIsExpanded();
            done();
        });

        it('[C291804] Delete Save and Save as actions should be displayed when clicking on custom filter header', () => {
            processCloudDemoPage.allProcessesFilter().clickProcessFilter();

            processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('Id');
            processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('ASC');
            processCloudDemoPage.processListCloudComponent().checkProcessListIsLoaded();
            processCloudDemoPage.getAllRowsByIdColumn().then((list) => {
                const initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });
            processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('Id');
            processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC');
            processCloudDemoPage.getAllRowsByIdColumn().then((list) => {
                const initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                list.reverse();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });

        });
    });
});
