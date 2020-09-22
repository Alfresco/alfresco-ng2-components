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

import { ApiService, AppListCloudPage, BrowserActions, GroupIdentityService, IdentityService, LocalStorageUtil, LoginPage, ProcessDefinitionsService, ProcessInstancesService, QueryService, StringUtil, TasksService } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { ProcessCloudDemoPage } from './pages/process-cloud-demo.page';
import { TasksCloudDemoPage } from './pages/tasks-cloud-demo.page';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import { EditProcessFilterConfiguration } from './config/edit-process-filter.config';
import { ProcessListCloudConfiguration } from './config/process-list-cloud.config';

describe('Process list cloud', () => {

    describe('Process List', () => {

        const loginSSOPage = new LoginPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const processCloudDemoPage = new ProcessCloudDemoPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();

        const apiService = new ApiService();
        const identityService = new IdentityService(apiService);
        const groupIdentityService = new GroupIdentityService(apiService);
        const processDefinitionService = new ProcessDefinitionsService(apiService);
        const processInstancesService = new ProcessInstancesService(apiService);
        const queryService = new QueryService(apiService);
        const tasksService = new TasksService(apiService);

        const processListCloudConfiguration = new ProcessListCloudConfiguration();
        const editProcessFilterConfiguration = new EditProcessFilterConfiguration();
        const processListCloudConfigFile = processListCloudConfiguration.getConfiguration();
        const editProcessFilterConfigFile = editProcessFilterConfiguration.getConfiguration();

        let completedProcess, runningProcessInstance, switchProcessInstance, noOfApps, testUser, groupInfo,
            anotherProcessInstance;
        const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;

        beforeAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

        testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);

        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.email, testUser.password);

        const processDefinition = await processDefinitionService
                .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.candidateGroupProcess, candidateBaseApp);

        const anotherProcessDefinition = await processDefinitionService
                .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.anotherCandidateGroupProcess, candidateBaseApp);

        await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp);

        runningProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                'name': StringUtil.generateRandomString(),
                'businessKey': StringUtil.generateRandomString()
            });

        anotherProcessInstance = await processInstancesService.createProcessInstance(anotherProcessDefinition.entry.key, candidateBaseApp, {
                'name': StringUtil.generateRandomString(),
                'businessKey': StringUtil.generateRandomString()
            });

        switchProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                'name': StringUtil.generateRandomString(),
                'businessKey': StringUtil.generateRandomString()
            });

        completedProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                'name': StringUtil.generateRandomString(),
                'businessKey': StringUtil.generateRandomString()
            });

        const task = await queryService.getProcessInstanceTasks(completedProcess.entry.id, candidateBaseApp);
        const claimedTask = await tasksService.claimTask(task.list.entries[0].entry.id, candidateBaseApp);
        await tasksService.completeTask(claimedTask.entry.id, candidateBaseApp);

        await loginSSOPage.login(testUser.email, testUser.password);
        await LocalStorageUtil.setConfigField('adf-edit-process-filter', JSON.stringify(editProcessFilterConfigFile));
        await LocalStorageUtil.setConfigField('adf-cloud-process-list', JSON.stringify(processListCloudConfigFile));
        });

        afterAll(async () => {
            await apiService.login(testUser.email, testUser.password);
            await processInstancesService.deleteProcessInstance(anotherProcessInstance.entry.id, candidateBaseApp);
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);
        });

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(candidateBaseApp);
            await tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
            await processCloudDemoPage.processFilterCloudComponent.clickOnProcessFilters();
        });

        it('[C290069] Should display processes ordered by name when Name is selected from sort dropdown', async () => {
            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ status: 'RUNNING', sort: 'Name', order: 'ASC' });
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();

            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Name')).toBe(true);

            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ order: 'DESC'});
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();

            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Name')).toBe(true);
        });

        it('[C291783] Should display processes ordered by id when Id is selected from sort dropdown', async () => {
            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ status: 'RUNNING', sort: 'Id', order: 'ASC' });
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();

            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Id')).toBe(true);

            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ order: 'DESC'});
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Id')).toBe(true);
        });

        it('[C305054] Should display processes ordered by status when Status is selected from sort dropdown', async () => {
            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ status: 'ALL', sort: 'Status', order: 'ASC' });
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();

            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Status')).toBe(true);

            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ order: 'DESC'});
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Status')).toBe(true);
        });

        it('[C305054] Should display processes ordered by initiator when Initiator is selected from sort dropdown', async () => {
            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ status: 'ALL', sort: 'Initiator', order: 'ASC' });
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();

            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Initiator')).toBe(true);

            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ order: 'DESC'});
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Initiator')).toBe(true);
        });

        it('[C305054] Should display processes ordered by processdefinitionid date when ProcessDefinitionId is selected from sort dropdown', async () => {
            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ status: 'ALL', sort: 'ProcessDefinitionId', order: 'ASC' });
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();

            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Process Definition Id')).toBe(true);

            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ order: 'DESC'});
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Process Definition Id')).toBe(true);
        });

        it('[C305054] Should display processes ordered by processdefinitionkey date when ProcessDefinitionKey is selected from sort dropdown', async () => {
            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ status: 'ALL', sort: 'ProcessDefinitionKey', order: 'ASC' });
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();

            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Process Definition Key')).toBe(true);

            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ order: 'DESC'});
            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Process Definition Key')).toBe(true);
        });

        it('[C305054] Should display processes ordered by last modified date when Last Modified is selected from sort dropdown', async () => {
            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ status: 'ALL', sort: 'Last Modified', order: 'ASC' });
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();

            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Last Modified')).toBe(true);

            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ order: 'DESC'});
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Last Modified')).toBe(true);
        });

        it('[C305054] Should display processes ordered by business key date when BusinessKey is selected from sort dropdown', async () => {
            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ status: 'ALL', sort: 'Business Key', order: 'ASC' });
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();

            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Business Key')).toBe(true);

            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ order: 'DESC'});
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Business Key')).toBe(true);
        });

        it('[C297697] The value of the filter should be preserved when saving it', async () => {
            await processCloudDemoPage.processFilterCloudComponent.clickAllProcessesFilter();
            await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
            await processCloudDemoPage.editProcessFilterCloudComponent().setProcessInstanceId(completedProcess.entry.id);

            await processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            await processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New');
            await processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnSaveButton();

            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('New');

            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(completedProcess.entry.id);
            await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().numberOfRows()).toBe(1);

            await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();

            await expect(await processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()).toEqual(completedProcess.entry.id);
        });

        it('[C297646] Should display the filter dropdown fine , after switching between saved filters', async () => {
            await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
            noOfApps = await processCloudDemoPage.editProcessFilterCloudComponent().getNumberOfAppNameOptions();

            await expect(await processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()).toBe(true);
            await BrowserActions.closeMenuAndDialogs();
            await processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('RUNNING');
            await processCloudDemoPage.editProcessFilterCloudComponent().setAppNameDropDown(candidateBaseApp);
            await processCloudDemoPage.editProcessFilterCloudComponent().setProcessInstanceId(runningProcessInstance.entry.id);
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();

            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcessInstance.entry.id);
            await expect(await processCloudDemoPage.editProcessFilterCloudComponent().getNumberOfAppNameOptions()).toBe(noOfApps);
            await expect(await processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()).toBe(true);
            await BrowserActions.closeMenuAndDialogs();

            await processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            await processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('SavedFilter');
            await processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnSaveButton();
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('SavedFilter');

            await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
            await expect(await processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()).toEqual(runningProcessInstance.entry.id);

            await processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('RUNNING');
            await processCloudDemoPage.editProcessFilterCloudComponent().setAppNameDropDown(candidateBaseApp);
            await processCloudDemoPage.editProcessFilterCloudComponent().setProcessInstanceId(switchProcessInstance.entry.id);
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();

            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(switchProcessInstance.entry.id);
            await processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            await processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('SwitchFilter');
            await processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnSaveButton();
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('SwitchFilter');

            await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
            await expect(await processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()).toEqual(switchProcessInstance.entry.id);
            await expect(await processCloudDemoPage.editProcessFilterCloudComponent().getNumberOfAppNameOptions()).toBe(noOfApps);
            await expect(await processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()).toBe(true);
            await BrowserActions.closeMenuAndDialogs();
        });

   });
});
