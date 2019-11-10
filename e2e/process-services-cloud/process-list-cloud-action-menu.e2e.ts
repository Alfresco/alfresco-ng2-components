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

    describe('Process List - Custom Action Menu', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const processCloudDemoPage = new ProcessCloudDemoPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();

        let processDefinitionService: ProcessDefinitionsService;
        let processInstancesService: ProcessInstancesService;
        let identityService: IdentityService;
        let groupIdentityService: GroupIdentityService;
        let testUser, groupInfo, editProcess, deleteProcess;

        const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
        const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, 'BPM');

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
            editProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
            deleteProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);

            await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
        });

        afterAll(async() => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);

        });

        beforeAll(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
            await tasksCloudDemoPage.clickSettingsButton();
            await tasksCloudDemoPage.enableTestingMode();
            await tasksCloudDemoPage.enableActionMenu();
            await tasksCloudDemoPage.enableContextMenu();
            await tasksCloudDemoPage.addActionIsDisplayed();
            await tasksCloudDemoPage.addAction('edit');
            await tasksCloudDemoPage.actionAdded('edit');
            await tasksCloudDemoPage.addAction('delete');
            await tasksCloudDemoPage.actionAdded('delete');
            await tasksCloudDemoPage.addDisabledAction('disabledaction');
            await tasksCloudDemoPage.actionAdded('disabledaction');
            await tasksCloudDemoPage.addInvisibleAction('invisibleaction');
            await tasksCloudDemoPage.actionAdded('invisibleaction');
            await tasksCloudDemoPage.clickAppButton();
            await processCloudDemoPage.clickOnProcessFilters();
            await processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
        });

        it('[C315236] Should be able to see and execute custom action menu', async () => {
            await expect(await processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            await processCloudDemoPage.processListCloudComponent().checkProcessListIsLoaded();
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(editProcess.entry.id);
            await processCloudDemoPage.processListCloudComponent().clickOptionsButton(editProcess.entry.id);
            await expect(await processCloudDemoPage.processListCloudComponent().isCustomActionEnabled('disabledaction')).toBe(false);
            await expect(await processCloudDemoPage.processListCloudComponent().getNumberOfOptions()).toBe(3);
            await processCloudDemoPage.processListCloudComponent().clickOnCustomActionMenu('edit');
            await processCloudDemoPage.checkActionExecuted(editProcess.entry.id, 'edit');
            await processCloudDemoPage.processListCloudComponent().rightClickOnRow(deleteProcess.entry.id);
            await expect(await processCloudDemoPage.processListCloudComponent().isCustomActionEnabled('disabledaction')).toBe(false);
            await expect(await processCloudDemoPage.processListCloudComponent().getNumberOfOptions()).toBe(3);
            await processCloudDemoPage.processListCloudComponent().clickContextMenuActionNamed('delete');
            await processCloudDemoPage.checkActionExecuted(deleteProcess.entry.id, 'delete');
        });

    });

});
