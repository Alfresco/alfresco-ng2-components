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

import { ProcessDefinitions } from '../actions/APS-cloud/process-definitions';
import { ProcessInstances } from '../actions/APS-cloud/process-instances';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ConfigEditorPage } from '../pages/adf/configEditorPage';
import { ProcessListCloudConfiguration } from './processListCloud.config';

describe('Process list cloud', () => {

    describe('Process List', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const configEditor = new ConfigEditorPage();
        let appListCloudComponent = new AppListCloudComponent();
        let processCloudDemoPage = new ProcessCloudDemoPage();

        const processDefinitionService: ProcessDefinitions = new ProcessDefinitions();
        const processInstancesService: ProcessInstances = new ProcessInstances();

        let silentLogin;
        const simpleApp = 'candidateuserapp';
        const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
        let jsonFile;
        let runningProcess;

        beforeAll(async () => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginAPS(user, password);

            await processDefinitionService.init(user, password);
            let processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            await processInstancesService.init(user, password);
            runningProcess = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);

        });

        beforeEach(async (done) => {
            let processListCloudConfiguration = new ProcessListCloudConfiguration();
            jsonFile = processListCloudConfiguration.getConfiguration();
            done();
            navigationBarPage.clickConfigEditorButton();
            configEditor.clickProcessListCloudConfiguration();
            configEditor.clickClearButton();
            configEditor.enterBigConfigurationText(JSON.stringify(jsonFile)).clickSaveButton();

            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.runningProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.processListCloudComponent().checkProcessListIsLoaded();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcess.entry.id);
            done();
        });

        it('[C291997] Should be able to change the default columns', async() => {

            expect(processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfColumns()).toBe(13);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('id');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('name');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('status');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('startDate');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('appName');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('businessKey');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('description');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('initiator');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('lastModified');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('processName');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('processId');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('processDefinitionId');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('processDefinitionKey');

        });

    });

});
