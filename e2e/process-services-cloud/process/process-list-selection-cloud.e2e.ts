/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { createApiService, AppListCloudPage, GroupIdentityService, IdentityService, LoginPage, ProcessDefinitionsService, ProcessInstancesService, LocalStorageUtil } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { ProcessCloudDemoPage } from './../pages/process-cloud-demo.page';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ProcessDetailsCloudDemoPage } from './../pages/process-details-cloud-demo.page';
import { EditProcessFilterConfiguration } from './../config/edit-process-filter.config';
import CONSTANTS = require('../../util/constants');

describe('Process list cloud', () => {

    describe('Process List - selection', () => {

        const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

        const loginSSOPage = new LoginPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();

        const processCloudDemoPage = new ProcessCloudDemoPage();
        const editProcessFilter = processCloudDemoPage.editProcessFilterCloudComponent();
        const processList = processCloudDemoPage.processListCloudComponent();
        const processFilter = processCloudDemoPage.processFilterCloudComponent;

        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const processDetailsCloudDemoPage = new ProcessDetailsCloudDemoPage();

        const apiService = createApiService();
        const identityService = new IdentityService(apiService);
        const groupIdentityService = new GroupIdentityService(apiService);
        const processDefinitionService = new ProcessDefinitionsService(apiService);
        const processInstancesService = new ProcessInstancesService(apiService);

        let testUser; let groupInfo;

        const noOfProcesses = 3;
        const processInstances = [];
        const editProcessFilterConfiguration = new EditProcessFilterConfiguration();
        const editProcessFilterConfigFile = editProcessFilterConfiguration.getConfiguration();
        const PROCESSES = CONSTANTS.PROCESS_FILTERS;

        const checkRowIsSelectedById = async (mode = 'Single') => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.selectSelectionMode(mode);
            await tasksCloudDemoPage.clickAppButton();
            await processFilter.isProcessFiltersListVisible();
            await expect(await processFilter.getActiveFilterName()).toEqual(PROCESSES.RUNNING);
            await editProcessFilter.setFilter({ initiator: `${testUser.firstName} ${testUser.lastName}`});
            await processList.getDataTable().waitTillContentLoaded();
            await processList.selectRowById(processInstances[0]);
            await processList.checkRowIsSelectedById(processInstances[0]);
        };

        beforeAll(async () => {
            await apiService.loginWithProfile('identityAdmin');

            testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);
            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

            await apiService.login(testUser.username, testUser.password);
            const processDefinition = await processDefinitionService
                .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.simpleProcess, simpleApp);

            for (let i = 0; i < noOfProcesses; i++) {
                const response = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
                processInstances.push(response.entry.id);
            }

            await loginSSOPage.login(testUser.username, testUser.password);
            await LocalStorageUtil.setConfigField('adf-edit-process-filter', JSON.stringify(editProcessFilterConfigFile));
        });

        afterAll(async () => {
            await apiService.loginWithProfile('identityAdmin');
            await identityService.deleteIdentityUser(testUser.idIdentityService);
        });

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await expect(processInstances.length).toEqual(noOfProcesses, 'Wrong preconditions');
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
            await processFilter.clickOnProcessFilters();
            await processFilter.clickRunningProcessesFilter();
            await expect(await processFilter.getActiveFilterName()).toBe(PROCESSES.RUNNING);
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.disableDisplayProcessDetails();
            await tasksCloudDemoPage.clickAppButton();
        });

        it('[C297469] Should NOT be able to select a process when settings are set to None', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.selectSelectionMode('None');
            await tasksCloudDemoPage.clickAppButton();
            await processFilter.isProcessFiltersListVisible();
            await expect(await processFilter.getActiveFilterName()).toEqual(PROCESSES.RUNNING);
            await editProcessFilter.openFilter();
            await editProcessFilter.setInitiator(`${testUser.firstName} ${testUser.lastName}`);
            await processList.getDataTable().waitTillContentLoaded();
            await processList.selectRowById(processInstances[0]);
            await processList.getDataTable().checkNoRowIsSelected();
        });

        it('[C297468] Should be able to select only one process when settings are set to Single', async () => {
            await checkRowIsSelectedById();
            await expect(await processList.getDataTable().getNumberOfSelectedRows()).toEqual(1);
            await processList.selectRowById(processInstances[1]);
            await processList.checkRowIsSelectedById(processInstances[1]);
            await expect(await processList.getDataTable().getNumberOfSelectedRows()).toEqual(1);
        });

        it('[C297470] Should be able to select multiple processes using keyboard', async () => {
            await checkRowIsSelectedById('Multiple');
            await processList.selectRowWithKeyboard(processInstances[1]);
            await processList.checkRowIsSelectedById(processInstances[0]);
            await processList.checkRowIsSelectedById(processInstances[1]);
            await processList.checkRowIsNotSelectedById(processInstances[2]);
            await expect(await processList.getDataTable().getNumberOfSelectedRows()).toEqual(2);
        });

        it('[C297465] Should be able to select multiple processes using checkboxes', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.enableMultiSelection();
            await tasksCloudDemoPage.clickAppButton();
            await processFilter.isProcessFiltersListVisible();
            await expect(await processFilter.getActiveFilterName()).toEqual(PROCESSES.RUNNING);
            await editProcessFilter.setFilter({ initiator: `${testUser.firstName} ${testUser.lastName}`});
            await processList.getDataTable().waitTillContentLoaded();
            await processList.checkCheckboxById(processInstances[0]);
            await processList.checkRowIsCheckedById(processInstances[0]);
            await processList.checkCheckboxById(processInstances[1]);
            await processList.checkRowIsCheckedById(processInstances[1]);
            await processList.checkRowIsNotCheckedById(processInstances[2]);
            await processList.checkCheckboxById(processInstances[1]);
            await processList.checkRowIsNotCheckedById(processInstances[1]);
            await processList.checkRowIsCheckedById(processInstances[0]);
        });

        it('[C299125] Should be possible to select all the rows when multiselect is true', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.enableMultiSelection();
            await tasksCloudDemoPage.clickAppButton();
            await processFilter.isProcessFiltersListVisible();
            await editProcessFilter.setFilter({ initiator: `${testUser.firstName} ${testUser.lastName}`});
            await processList.getDataTable().waitTillContentLoaded();
            await expect(await processFilter.getActiveFilterName()).toEqual(PROCESSES.RUNNING);
            await browser.sleep(1000);
            await processList.getDataTable().checkAllRowsButtonIsDisplayed();
            await processList.getDataTable().checkAllRows();
            await processList.checkRowIsCheckedById(processInstances[0]);
            await processList.checkRowIsCheckedById(processInstances[1]);
            await processList.checkRowIsCheckedById(processInstances[2]);

            await processList.getDataTable().checkAllRowsButtonIsDisplayed();
            await processList.getDataTable().uncheckAllRows();
            await processList.checkRowIsNotCheckedById(processInstances[0]);
            await processList.checkRowIsNotCheckedById(processInstances[1]);
            await processList.checkRowIsNotCheckedById(processInstances[2]);
        });

        it('[C297467] Should be able to see selected processes', async () => {
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.enableMultiSelection();
            await tasksCloudDemoPage.enableTestingMode();
            await tasksCloudDemoPage.clickAppButton();
            await processFilter.isProcessFiltersListVisible();
            await expect(await processFilter.getActiveFilterName()).toEqual(PROCESSES.RUNNING);
            await editProcessFilter.setFilter({ initiator: `${testUser.firstName} ${testUser.lastName}`});
            await processList.getDataTable().waitTillContentLoaded();
            await processList.checkCheckboxById(processInstances[0]);
            await processList.checkRowIsCheckedById(processInstances[0]);
            await processDetailsCloudDemoPage.checkListedSelectedProcessInstance(processInstances[0]);

            await processList.checkCheckboxById(processInstances[1]);
            await processList.checkRowIsCheckedById(processInstances[1]);
            await processDetailsCloudDemoPage.checkListedSelectedProcessInstance(processInstances[1]);
        });
    });
});
