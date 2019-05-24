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

import { browser } from 'protractor';
import {
    ProcessDefinitionsService,
    ProcessInstancesService,
    LoginSSOPage,
    ApiService,
    LocalStorageUtil,
    SettingsPage
} from '@alfresco/adf-testing';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';

import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessListCloudConfiguration } from './processListCloud.config';

import resources = require('../util/resources');

describe('Process list cloud', () => {

    describe('Process List', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const processCloudDemoPage = new ProcessCloudDemoPage();
        const settingsPage = new SettingsPage();

        let processDefinitionService: ProcessDefinitionsService;
        let processInstancesService: ProcessInstancesService;

        const candidateuserapp = resources.ACTIVITI7_APPS.CANDIDATE_USER_APP.name;
        let jsonFile;
        let runningProcess;

        beforeAll(async (done) => {
            const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, 'BPM');
            await apiService.login(browser.params.identityUser.email, browser.params.identityUser.password);

            processDefinitionService = new ProcessDefinitionsService(apiService);
            const processDefinition = await processDefinitionService.getProcessDefinitions(candidateuserapp);
            processInstancesService = new ProcessInstancesService(apiService);
            runningProcess = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, candidateuserapp);

            await settingsPage.setProviderBpmSso(
                browser.params.config.bpmHost,
                browser.params.config.oauth2.host,
                browser.params.config.identityHost);
            loginSSOPage.loginSSOIdentityService(browser.params.identityUser.email, browser.params.identityUser.password);
            done();
        });

        beforeEach(async (done) => {
            const processListCloudConfiguration = new ProcessListCloudConfiguration();
            jsonFile = processListCloudConfiguration.getConfiguration();

            await LocalStorageUtil.setConfigField('adf-cloud-process-list', JSON.stringify(jsonFile));

            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(candidateuserapp);
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.runningProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.processListCloudComponent().checkProcessListIsLoaded();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcess.entry.id);
            done();
        });

        it('[C291997] Should be able to change the default columns', async () => {

            expect(processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfColumns()).toBe(12);
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('id');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('name');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('status');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('startDate');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('appName');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('businessKey');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('initiator');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('lastModified');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('processName');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('processId');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('processDefinitionId');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('processDefinitionKey');

        });

    });

});
