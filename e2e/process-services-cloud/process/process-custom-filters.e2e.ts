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

import { createApiService,
    AppListCloudPage,
    BrowserActions,
    FilterProps,
    GroupIdentityService,
    IdentityService,
    LocalStorageUtil,
    LoginPage,
    ProcessDefinitionsService,
    ProcessInstancesService,
    QueryService,
    StringUtil,
    TasksService
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { ProcessCloudDemoPage } from './../pages/process-cloud-demo.page';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { EditProcessFilterConfiguration } from './../config/edit-process-filter.config';
import { ProcessListCloudConfiguration } from './../config/process-list-cloud.config';

describe('Process list cloud', () => {

    // en-US values for the process status
    const PROCESS_STATUS = {
        ALL: 'All',
        RUNNING: 'Running',
        SUSPENDED: 'Suspended',
        COMPLETED: 'Completed'
    };

    // en-US values for the sort direction
    const SORT_DIRECTION = {
        ASC: 'Ascending',
        DESC: 'Descending'
    };

    describe('Process List', () => {

        const loginSSOPage = new LoginPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();

        const processCloudDemoPage = new ProcessCloudDemoPage();
        const editProcessFilter = processCloudDemoPage.editProcessFilterCloudComponent();
        const processList = processCloudDemoPage.processListCloudComponent();

        const tasksCloudDemoPage = new TasksCloudDemoPage();

        const apiService = createApiService();
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

        let completedProcess; let runningProcessInstance; let switchProcessInstance; let noOfApps; let testUser; let groupInfo;
            let anotherProcessInstance;
        const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;

        beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);

        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.username, testUser.password);

        const processDefinition = await processDefinitionService
                .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.candidateGroupProcess, candidateBaseApp);

        const anotherProcessDefinition = await processDefinitionService
                .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.anotherCandidateGroupProcess, candidateBaseApp);

        await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp);

        runningProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                name: StringUtil.generateRandomString(),
                businessKey: StringUtil.generateRandomString()
            });

        anotherProcessInstance = await processInstancesService.createProcessInstance(anotherProcessDefinition.entry.key, candidateBaseApp, {
                name: StringUtil.generateRandomString(),
                businessKey: StringUtil.generateRandomString()
            });

        switchProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                name: StringUtil.generateRandomString(),
                businessKey: StringUtil.generateRandomString()
            });

        completedProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                name: StringUtil.generateRandomString(),
                businessKey: StringUtil.generateRandomString()
            });

        const task = await queryService.getProcessInstanceTasks(completedProcess.entry.id, candidateBaseApp);
        const claimedTask = await tasksService.claimTask(task.list.entries[0].entry.id, candidateBaseApp);
        await tasksService.completeTask(claimedTask.entry.id, candidateBaseApp);

        await loginSSOPage.login(testUser.username, testUser.password);
        await LocalStorageUtil.setConfigField('adf-edit-process-filter', JSON.stringify(editProcessFilterConfigFile));
        await LocalStorageUtil.setConfigField('adf-cloud-process-list', JSON.stringify(processListCloudConfigFile));
        });

        afterAll(async () => {
            await apiService.login(testUser.username, testUser.password);
            await processInstancesService.deleteProcessInstance(anotherProcessInstance.entry.id, candidateBaseApp);
            await apiService.loginWithProfile('identityAdmin');
            await identityService.deleteIdentityUser(testUser.idIdentityService);
        });

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(candidateBaseApp);
            await tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
            await processCloudDemoPage.processFilterCloudComponent.clickOnProcessFilters();
        });

        async function setFilter(props: FilterProps): Promise<void> {
            await editProcessFilter.setFilter(props);
            await waitTillContentLoaded();
        }

        async function waitTillContentLoaded() {
            await processList.getDataTable().waitTillContentLoaded();
        }

        it('[C290069] Should display processes ordered by name when Name is selected from sort dropdown', async () => {
            await setFilter({ status: PROCESS_STATUS.RUNNING });
            await setFilter({ sort: 'Name' });
            await setFilter({ order: SORT_DIRECTION.ASC });

            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.ASC, 'Process Name')).toBe(true);

            await setFilter({ order: SORT_DIRECTION.DESC});

            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.DESC, 'Process Name')).toBe(true);
        });

        it('[C291783] Should display processes ordered by id when Id is selected from sort dropdown', async () => {
            await setFilter({ status: PROCESS_STATUS.RUNNING });
            await setFilter({ sort: 'Id'});
            await setFilter({ order: SORT_DIRECTION.ASC });

            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.ASC, 'Id')).toBe(true);

            await setFilter({ order: SORT_DIRECTION.DESC});
            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.DESC, 'Id')).toBe(true);
        });

        it('[C305054] Should display processes ordered by status when Status is selected from sort dropdown', async () => {
            await setFilter({ status: PROCESS_STATUS.ALL });
            await setFilter({ sort: 'Status' });
            await setFilter({ order: SORT_DIRECTION.ASC });

            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.ASC, 'Status')).toBe(true);

            await setFilter({ order: SORT_DIRECTION.DESC});
            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.DESC, 'Status')).toBe(true);
        });

        it('[C305054] Should display processes ordered by started by when Started By is selected from sort dropdown', async () => {
            await setFilter({ status: PROCESS_STATUS.ALL });
            await setFilter({ sort: 'Started by' });
            await setFilter({ order: SORT_DIRECTION.ASC });

            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.ASC, 'Started by')).toBe(true);

            await setFilter({ order: SORT_DIRECTION.DESC});
            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.DESC, 'Started by')).toBe(true);
        });

        it('[C305054] Should display processes ordered by processdefinitionid date when ProcessDefinitionId is selected from sort dropdown', async () => {
            await setFilter({ status: PROCESS_STATUS.ALL });
            await setFilter({ sort: 'ProcessDefinitionId' });
            await setFilter({ order: SORT_DIRECTION.ASC });

            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.ASC, 'Process Definition Id')).toBe(true);

            await setFilter({ order: SORT_DIRECTION.DESC});
            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.DESC, 'Process Definition Id')).toBe(true);
        });

        it('[C305054] Should display processes ordered by processdefinitionkey date when ProcessDefinitionKey is selected from sort dropdown', async () => {
            await setFilter({ status: PROCESS_STATUS.ALL });
            await setFilter({ sort: 'ProcessDefinitionKey' });
            await setFilter({ order: SORT_DIRECTION.ASC });

            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.ASC, 'Process Definition Key')).toBe(true);

            await setFilter({ order: SORT_DIRECTION.DESC});
            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.DESC, 'Process Definition Key')).toBe(true);
        });

        it('[C305054] Should display processes ordered by last modified date when Last Modified is selected from sort dropdown', async () => {
            await setFilter({ status: PROCESS_STATUS.ALL });
            await setFilter({ sort: 'Last Modified' });
            await setFilter({ order: SORT_DIRECTION.ASC });

            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.ASC, 'Last Modified')).toBe(true);

            await setFilter({ order: SORT_DIRECTION.DESC });
            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.DESC, 'Last Modified')).toBe(true);
        });

        it('[C305054] Should display processes ordered by business key date when BusinessKey is selected from sort dropdown', async () => {
            await setFilter({ status: PROCESS_STATUS.ALL });
            await setFilter({ sort: 'Business Key' });
            await setFilter({ order: SORT_DIRECTION.ASC });

            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.ASC, 'Business Key')).toBe(true);

            await setFilter({ order: SORT_DIRECTION.DESC});
            await expect(await processList.getDataTable().checkListIsSorted(SORT_DIRECTION.DESC, 'Business Key')).toBe(true);
        });

        it('[C297697] The value of the filter should be preserved when saving it', async () => {
            await processCloudDemoPage.processFilterCloudComponent.clickAllProcessesFilter();
            await editProcessFilter.openFilter();
            await editProcessFilter.setProcessInstanceId(completedProcess.entry.id);

            await editProcessFilter.saveAs('New');

            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('New');

            await processList.checkContentIsDisplayedById(completedProcess.entry.id);
            await expect(await processList.getDataTable().numberOfRows()).toBe(1);

            await expect(await editProcessFilter.getProcessInstanceId()).toEqual(completedProcess.entry.id);
        });

        it('[C297646] Should display the filter dropdown fine , after switching between saved filters', async () => {
            await editProcessFilter.openFilter();
            noOfApps = await editProcessFilter.getNumberOfAppNameOptions();

            await expect(await editProcessFilter.checkAppNamesAreUnique()).toBe(true);
            await BrowserActions.closeMenuAndDialogs();
            await editProcessFilter.setStatusFilterDropDown(PROCESS_STATUS.RUNNING);
            await editProcessFilter.setAppNameDropDown(candidateBaseApp);
            await editProcessFilter.setProcessInstanceId(runningProcessInstance.entry.id);
            await waitTillContentLoaded();

            await processList.checkContentIsDisplayedById(runningProcessInstance.entry.id);
            await expect(await editProcessFilter.getNumberOfAppNameOptions()).toBe(noOfApps);
            await expect(await editProcessFilter.checkAppNamesAreUnique()).toBe(true);
            await BrowserActions.closeMenuAndDialogs();

            await editProcessFilter.saveAs('SavedFilter');
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('SavedFilter');

            await expect(await editProcessFilter.getProcessInstanceId()).toEqual(runningProcessInstance.entry.id);

            await editProcessFilter.setStatusFilterDropDown(PROCESS_STATUS.RUNNING);
            await editProcessFilter.setAppNameDropDown(candidateBaseApp);
            await editProcessFilter.setProcessInstanceId(switchProcessInstance.entry.id);
            await waitTillContentLoaded();

            await processList.checkContentIsDisplayedById(switchProcessInstance.entry.id);
            await editProcessFilter.saveAs('SwitchFilter');
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('SwitchFilter');

            await expect(await editProcessFilter.getProcessInstanceId()).toEqual(switchProcessInstance.entry.id);
            await expect(await editProcessFilter.getNumberOfAppNameOptions()).toBe(noOfApps);
            await expect(await editProcessFilter.checkAppNamesAreUnique()).toBe(true);
            await BrowserActions.closeMenuAndDialogs();
        });

   });
});
