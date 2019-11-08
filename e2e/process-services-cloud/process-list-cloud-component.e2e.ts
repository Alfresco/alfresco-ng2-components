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
    IdentityService, GroupIdentityService
} from '@alfresco/adf-testing';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessListCloudConfiguration } from './config/process-list-cloud.config';

describe('Process list cloud', () => {

    describe('Process List', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const processCloudDemoPage = new ProcessCloudDemoPage();
        const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, 'BPM');

        let processDefinitionService: ProcessDefinitionsService;
        let processInstancesService: ProcessInstancesService;
        let identityService: IdentityService;
        let groupIdentityService: GroupIdentityService;
        let testUser, groupInfo;

        const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;
        let jsonFile;
        let runningProcess;

        beforeAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            identityService = new IdentityService(apiService);
            groupIdentityService = new GroupIdentityService(apiService);
            testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);
            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

            await apiService.login(testUser.email, testUser.password);

            processDefinitionService = new ProcessDefinitionsService(apiService);
            const processDefinition = await processDefinitionService
                .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.candidateGroupProcess, candidateBaseApp);

            processInstancesService = new ProcessInstancesService(apiService);
            runningProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp);

            await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
        });

        afterAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);

        });

        beforeEach(async () => {
            const processListCloudConfiguration = new ProcessListCloudConfiguration();
            jsonFile = processListCloudConfiguration.getConfiguration();

            await LocalStorageUtil.setConfigField('adf-cloud-process-list', JSON.stringify(jsonFile));

            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(candidateBaseApp);
            await processCloudDemoPage.clickOnProcessFilters();
            await processCloudDemoPage.runningProcessesFilter().checkProcessFilterIsDisplayed();
            await processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            await expect(await processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            await processCloudDemoPage.processListCloudComponent().checkProcessListIsLoaded();
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcess.entry.id);

        });

        it('[C291997] Should be able to change the default columns', async () => {

            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfColumns()).toBe(10);
            await processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('id');
            await processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('name');
            await processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('status');
            await processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('startDate');
            await processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('appName');
            await processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('businessKey');
            await processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('initiator');
            await processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('lastModified');
            await processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('processDefinitionId');
            await processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('processDefinitionKey');

        });

    });

});
