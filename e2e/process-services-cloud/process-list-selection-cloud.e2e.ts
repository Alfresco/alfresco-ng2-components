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

import { ApiService, AppListCloudPage, GroupIdentityService, IdentityService, LoginPage, ProcessDefinitionsService, ProcessInstancesService, LocalStorageUtil } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { ProcessCloudDemoPage } from './pages/process-cloud-demo.page';
import { TasksCloudDemoPage } from './pages/tasks-cloud-demo.page';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import { ProcessDetailsCloudDemoPage } from './pages/process-details-cloud-demo.page';
import { EditProcessFilterConfiguration } from './config/edit-process-filter.config';
import CONSTANTS = require('../util/constants');

describe('Process list cloud', () => {

    describe('Process List - selection', () => {

        const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

        const loginSSOPage = new LoginPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const processCloudDemoPage = new ProcessCloudDemoPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const processDetailsCloudDemoPage = new ProcessDetailsCloudDemoPage();

        const apiService = new ApiService();
        const identityService = new IdentityService(apiService);
        const groupIdentityService = new GroupIdentityService(apiService);
        const processDefinitionService = new ProcessDefinitionsService(apiService);
        const processInstancesService = new ProcessInstancesService(apiService);

        let testUser, groupInfo;

        const noOfProcesses = 3;
        const processInstances = [];
        const editProcessFilterConfiguration = new EditProcessFilterConfiguration();
        const editProcessFilterConfigFile = editProcessFilterConfiguration.getConfiguration();
        const PROCESSES = CONSTANTS.PROCESS_FILTERS;

        beforeAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

            testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);
            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

            await apiService.login(testUser.email, testUser.password);
            const processDefinition = await processDefinitionService
                .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.simpleProcess, simpleApp);

            for (let i = 0; i < noOfProcesses; i++) {
                const response = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
                processInstances.push(response.entry.id);
            }

            await loginSSOPage.login(testUser.email, testUser.password);
            await LocalStorageUtil.setConfigField('adf-edit-process-filter', JSON.stringify(editProcessFilterConfigFile));
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
            await processCloudDemoPage.processFilterCloudComponent.clickOnProcessFilters();
            await processCloudDemoPage.processFilterCloudComponent.clickRunningProcessesFilter();
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe(PROCESSES.RUNNING);
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.disableDisplayProcessDetails();
            await tasksCloudDemoPage.clickAppButton();
        });

        it('[C297469] Should NOT be able to select a process when settings are set to None', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.selectSelectionMode('None');
            await tasksCloudDemoPage.clickAppButton();
            await processCloudDemoPage.processFilterCloudComponent.isProcessFiltersListVisible();
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toEqual(PROCESSES.RUNNING);
            await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
            await processCloudDemoPage.editProcessFilterCloudComponent().setInitiator(`${testUser.firstName} ${testUser.lastName}`);
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            await processCloudDemoPage.processListCloudComponent().selectRowById(processInstances[0]);
            await processCloudDemoPage.processListCloudComponent().getDataTable().checkNoRowIsSelected();
        });

        it('[C297468] Should be able to select only one process when settings are set to Single', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.selectSelectionMode('Single');
            await tasksCloudDemoPage.clickAppButton();
            await processCloudDemoPage.processFilterCloudComponent.isProcessFiltersListVisible();
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toEqual(PROCESSES.RUNNING);

            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ 'initiator': `${testUser.firstName} ${testUser.lastName}`});
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
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
            await processCloudDemoPage.processFilterCloudComponent.isProcessFiltersListVisible();
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toEqual(PROCESSES.RUNNING);
            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ 'initiator': `${testUser.firstName} ${testUser.lastName}`});
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
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
            await processCloudDemoPage.processFilterCloudComponent.isProcessFiltersListVisible();
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toEqual(PROCESSES.RUNNING);
            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ 'initiator': `${testUser.firstName} ${testUser.lastName}`});
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
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
            await processCloudDemoPage.processFilterCloudComponent.isProcessFiltersListVisible();
            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ 'initiator': `${testUser.firstName} ${testUser.lastName}`});
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toEqual(PROCESSES.RUNNING);
            await browser.sleep(1000);
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

        it('[C297467] Should be able to see selected processes', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.enableMultiSelection();
            await tasksCloudDemoPage.enableTestingMode();
            await tasksCloudDemoPage.clickAppButton();
            await processCloudDemoPage.processFilterCloudComponent.isProcessFiltersListVisible();
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toEqual(PROCESSES.RUNNING);
            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ 'initiator': `${testUser.firstName} ${testUser.lastName}`});
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            await processCloudDemoPage.processListCloudComponent().checkCheckboxById(processInstances[0]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsCheckedById(processInstances[0]);
            await processDetailsCloudDemoPage.checkListedSelectedProcessInstance(processInstances[0]);

            await processCloudDemoPage.processListCloudComponent().checkCheckboxById(processInstances[1]);
            await processCloudDemoPage.processListCloudComponent().checkRowIsCheckedById(processInstances[1]);
            await processDetailsCloudDemoPage.checkListedSelectedProcessInstance(processInstances[1]);
        });
    });
});
