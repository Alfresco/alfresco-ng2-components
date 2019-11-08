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
import { GroupIdentityService, IdentityService, LoginSSOPage } from '@alfresco/adf-testing';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { ProcessDefinitionsService, ApiService } from '@alfresco/adf-testing';
import { ProcessInstancesService } from '@alfresco/adf-testing';

describe('Process list cloud', () => {

    describe('Process List - selection', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const processCloudDemoPage = new ProcessCloudDemoPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();

        let processDefinitionService: ProcessDefinitionsService;
        let processInstancesService: ProcessInstancesService;
        let identityService: IdentityService;
        let groupIdentityService: GroupIdentityService;
        let testUser, groupInfo;

        const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
        const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, 'BPM');
        const noOfProcesses = 3;
        const processInstances = [];

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
                .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.simpleProcess, simpleApp);

            processInstancesService = new ProcessInstancesService(apiService);
            for (let i = 0; i < noOfProcesses; i++) {
                const response = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
                processInstances.push(response.entry.id);
            }

            await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);

        });

        afterAll(async() => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);

        });

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await expect(processInstances.length).toEqual(noOfProcesses, 'Wrong preconditions');
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
            await processCloudDemoPage.clickOnProcessFilters();
            await processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            await expect(await processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.disableDisplayProcessDetails();
            await tasksCloudDemoPage.clickAppButton();
        });

        it('[C297469] Should NOT be able to select a process when settings are set to None', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.selectSelectionMode('None');
            await tasksCloudDemoPage.clickAppButton();
            await processCloudDemoPage.isProcessFiltersListVisible();
            await expect(await processCloudDemoPage.getActiveFilterName()).toEqual('Running Processes');

            await processCloudDemoPage.processListCloudComponent().selectRowById(processInstances[0]);
            await processCloudDemoPage.processListCloudComponent().getDataTable().checkNoRowIsSelected();
        });

        it('[C297468] Should be able to select only one process when settings are set to Single', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.selectSelectionMode('Single');
            await tasksCloudDemoPage.clickAppButton();
            await processCloudDemoPage.isProcessFiltersListVisible();
            await expect(await processCloudDemoPage.getActiveFilterName()).toEqual('Running Processes');

            await processCloudDemoPage.processListCloudComponent().selectRowById(processInstances[0]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsSelectedById(processInstances[0]);
            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(1);
            await processCloudDemoPage.processListCloudComponent().selectRowById(processInstances[1]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsSelectedById(processInstances[1]);
            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(1);
        });

        it('[C297470] Should be able to select multiple processes using keyboard', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.selectSelectionMode('Multiple');
            await tasksCloudDemoPage.clickAppButton();
            await processCloudDemoPage.isProcessFiltersListVisible();
            await expect(await processCloudDemoPage.getActiveFilterName()).toEqual('Running Processes');

            await processCloudDemoPage.processListCloudComponent().selectRowById(processInstances[0]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsSelectedById(processInstances[0]);
            await processCloudDemoPage.processListCloudComponent().selectRowWithKeyboard(processInstances[1]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsSelectedById(processInstances[0]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsSelectedById(processInstances[1]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsNotSelectedById(processInstances[2]);
            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(2);
        });

        it('[C297465] Should be able to select multiple processes using checkboxes', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.enableMultiSelection();
            await tasksCloudDemoPage.clickAppButton();
            await processCloudDemoPage.isProcessFiltersListVisible();
            await expect(await processCloudDemoPage.getActiveFilterName()).toEqual('Running Processes');

            await processCloudDemoPage.processListCloudComponent().checkCheckboxById(processInstances[0]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsCheckedById(processInstances[0]);
            await processCloudDemoPage.processListCloudComponent().checkCheckboxById(processInstances[1]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsCheckedById(processInstances[1]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsNotCheckedById(processInstances[2]);
            await processCloudDemoPage.processListCloudComponent().checkCheckboxById(processInstances[1]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsNotCheckedById(processInstances[1]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsCheckedById(processInstances[0]);
        });

        it('[C299125] Should be possible to select all the rows when multiselect is true', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.enableMultiSelection();
            await tasksCloudDemoPage.clickAppButton();
            await processCloudDemoPage.isProcessFiltersListVisible();
            await expect(await processCloudDemoPage.getActiveFilterName()).toEqual('Running Processes');

            await processCloudDemoPage.processListCloudComponent().getDataTable().checkAllRowsButtonIsDisplayed();
            await processCloudDemoPage.processListCloudComponent().getDataTable().checkAllRows();
            await processCloudDemoPage.processListCloudComponent().checkRowIsCheckedById(processInstances[0]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsCheckedById(processInstances[1]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsCheckedById(processInstances[2]);

            await processCloudDemoPage.processListCloudComponent().getDataTable().checkAllRowsButtonIsDisplayed();
            await processCloudDemoPage.processListCloudComponent().getDataTable().uncheckAllRows();

            await processCloudDemoPage.processListCloudComponent().checkRowIsNotCheckedById(processInstances[0]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsNotCheckedById(processInstances[1]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsNotCheckedById(processInstances[2]);
        });

    });

});
