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
    DateUtil,
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
import { ProcessListPage } from '../../process-services/pages/process-list.page';
import { EditProcessFilterConfiguration } from './../config/edit-process-filter.config';
import { ProcessListCloudConfiguration } from './../config/process-list-cloud.config';
import * as moment from 'moment';

describe('Process filters cloud', () => {

    // en-US values for the process status
    const PROCESS_STATUS = {
        ALL: 'All',
        RUNNING: 'Running',
        SUSPENDED: 'Suspended',
        COMPLETED: 'Completed'
    };

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();

    const processCloudDemoPage = new ProcessCloudDemoPage();
    const editProcessFilter = processCloudDemoPage.editProcessFilterCloudComponent();
    const processList = processCloudDemoPage.processListCloudComponent();

    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const processListPage = new ProcessListPage();

    const apiService = createApiService();
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);
    const processDefinitionService = new ProcessDefinitionsService(apiService);
    const processInstancesService = new ProcessInstancesService(apiService);
    const queryService = new QueryService(apiService);
    const tasksService = new TasksService(apiService);

    const beforeDate = moment().add(-1, 'days').format('DD/MM/YYYY');
    const currentDate = DateUtil.formatDate('DD/MM/YYYY');
    const afterDate = moment().add(1, 'days').format('DD/MM/YYYY');
    const processListCloudConfiguration = new ProcessListCloudConfiguration();
    const editProcessFilterConfiguration = new EditProcessFilterConfiguration();
    const processListCloudConfigFile = processListCloudConfiguration.getConfiguration();
    const editProcessFilterConfigFile = editProcessFilterConfiguration.getConfiguration();

    let completedProcess; let runningProcessInstance; let suspendProcessInstance; let testUser; let anotherUser; let groupInfo;
        let anotherProcessInstance; let processDefinition; let anotherProcessDefinition;
        let differentAppUserProcessInstance; let simpleAppProcessDefinition;
    const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    const setProcessName = async (propertyValue: string, propertyName = 'lastModifiedTo') => {
        await editProcessFilter.openFilter();
        await editProcessFilter.setProperty(propertyName, propertyValue);
        await processList.getDataTable().waitTillContentLoaded();
        await editProcessFilter.setProcessName(runningProcessInstance.entry.name);
    };

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);
        anotherUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);

        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await identityService.addUserToGroup(anotherUser.idIdentityService, groupInfo.id);

        await apiService.login(anotherUser.username, anotherUser.password);
        simpleAppProcessDefinition = await processDefinitionService
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.simpleProcess, simpleApp);

        differentAppUserProcessInstance = await processInstancesService.createProcessInstance(simpleAppProcessDefinition.entry.key, simpleApp, {
            name: StringUtil.generateRandomString(),
            businessKey: StringUtil.generateRandomString()
        });

        await apiService.login(testUser.username, testUser.password);
        processDefinition = await processDefinitionService
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.candidateGroupProcess, candidateBaseApp);

        anotherProcessDefinition = await processDefinitionService
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.anotherCandidateGroupProcess, candidateBaseApp);

        runningProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            name: StringUtil.generateRandomString(),
            businessKey: StringUtil.generateRandomString()
        });

        anotherProcessInstance = await processInstancesService.createProcessInstance(anotherProcessDefinition.entry.key, candidateBaseApp, {
            name: StringUtil.generateRandomString(),
            businessKey: StringUtil.generateRandomString()
        });

        suspendProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            name: StringUtil.generateRandomString(),
            businessKey: StringUtil.generateRandomString()
        });
        await processInstancesService.suspendProcessInstance(suspendProcessInstance.entry.id, candidateBaseApp);

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
        await processInstancesService.deleteProcessInstance(runningProcessInstance.entry.id, candidateBaseApp);
        await processInstancesService.deleteProcessInstance(anotherProcessInstance.entry.id, candidateBaseApp);
        await processInstancesService.deleteProcessInstance(suspendProcessInstance.entry.id, candidateBaseApp);

        await apiService.login(anotherUser.username, anotherUser.password);
        await processInstancesService.deleteProcessInstance(differentAppUserProcessInstance.entry.id, simpleApp);

        await apiService.loginWithProfile('identityAdmin');

        await identityService.deleteIdentityUser(testUser.idIdentityService);
        await identityService.deleteIdentityUser(anotherUser.idIdentityService);
   });

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(candidateBaseApp);
        await tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
        await processCloudDemoPage.processFilterCloudComponent.clickOnProcessFilters();
        await processCloudDemoPage.processFilterCloudComponent.clickRunningProcessesFilter();
    });

    it('[C306887] Should be able to filter by appName', async () => {
        await editProcessFilter.openFilter();
        await editProcessFilter.setAppNameDropDown(candidateBaseApp);
        await processList.getDataTable().waitTillContentLoaded();
        await editProcessFilter.setInitiator(`${testUser.firstName} ${testUser.lastName}`);

        await processList.getDataTable().waitTillContentLoaded();
        await processList.checkContentIsDisplayedByName(runningProcessInstance.entry.name);
        await processList.checkContentIsNotDisplayedByName(differentAppUserProcessInstance.entry.name);
    });

    it('[C306889] Should be able to see "No process found" when using an app with no processes in the appName field', async () => {
        await editProcessFilter.openFilter();
        await editProcessFilter.setAppNameDropDown('subprocessapp');
        await processList.getDataTable().waitTillContentLoaded();
        await editProcessFilter.setInitiator(`${testUser.firstName} ${testUser.lastName}`);
        await processList.getDataTable().waitTillContentLoaded();

        await expect(await processListPage.getDisplayedProcessListTitle()).toEqual('No Processes Found');
    });

    it('[C306890] Should be able to filter by initiator', async () => {
        await editProcessFilter.openFilter();
        await editProcessFilter.setInitiator(`${testUser.firstName} ${testUser.lastName}`);

        await processList.getDataTable().waitTillContentLoaded();
        await processList.checkContentIsDisplayedByName(runningProcessInstance.entry.name);
        await processList.checkContentIsNotDisplayedByName(differentAppUserProcessInstance.entry.name);
    });

    it('[C311315] Should be able to filter by process definition id', async () => {
        await editProcessFilter.openFilter();
        await editProcessFilter.setProperty('processDefinitionId', processDefinition.entry.id);
        await processList.getDataTable().waitTillContentLoaded();
        await processList.checkContentIsDisplayedByName(runningProcessInstance.entry.name);

        await editProcessFilter.setProperty('processDefinitionId', anotherProcessDefinition.entry.id);
        await processList.getDataTable().waitTillContentLoaded();
        await processList.checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        await processList.checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311316] Should be able to filter by process definition key', async () => {
        await editProcessFilter.openFilter();
        await editProcessFilter.setProperty('processDefinitionKey', processDefinition.entry.key);
        await processList.getDataTable().waitTillContentLoaded();
        await editProcessFilter.setProcessName(runningProcessInstance.entry.name);
        await processList.getDataTable().waitTillContentLoaded();
        await processList.checkContentIsDisplayedByName(runningProcessInstance.entry.name);

        await editProcessFilter.setProcessName(anotherProcessInstance.entry.name);
        await processList.getDataTable().waitTillContentLoaded();
        await editProcessFilter.setProperty('processDefinitionKey', anotherProcessDefinition.entry.key);
        await processList.getDataTable().waitTillContentLoaded();
        await processList.checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        await processList.checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311317] Should be able to filter by process instance id', async () => {
        await editProcessFilter.openFilter();
        await editProcessFilter.setProperty('processInstanceId', runningProcessInstance.entry.id);
        await processList.getDataTable().waitTillContentLoaded();
        await processList.checkContentIsDisplayedByName(runningProcessInstance.entry.name);

        await expect(await processList.getDataTable().getNumberOfRows()).toBe(1);

        await editProcessFilter.setProperty('processInstanceId', anotherProcessInstance.entry.id);
        await processList.getDataTable().waitTillContentLoaded();
        await processList.checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        await processList.checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
        await expect(await processList.getDataTable().getNumberOfRows()).toBe(1);
    });

    it('[C311321] Should be able to filter by process name', async () => {
        await editProcessFilter.openFilter();
        await editProcessFilter.setProcessName(runningProcessInstance.entry.name);
        await processList.getDataTable().waitTillContentLoaded();
        await processList.checkContentIsDisplayedByName(runningProcessInstance.entry.name);

        await editProcessFilter.setProcessName(anotherProcessInstance.entry.name);
        await processList.getDataTable().waitTillContentLoaded();
        await processList.checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        await processList.checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C306892] Should be able to filter by process status - Running', async () => {
        await editProcessFilter.openFilter();
        await editProcessFilter.setStatusFilterDropDown(PROCESS_STATUS.RUNNING);
        await processList.getDataTable().waitTillContentLoaded();
        await editProcessFilter.setProcessName(runningProcessInstance.entry.name);
        await processList.checkContentIsDisplayedByName(runningProcessInstance.entry.name);

        await editProcessFilter.setProcessName(suspendProcessInstance.entry.name);
        await processList.checkContentIsNotDisplayedByName(suspendProcessInstance.entry.name);

        await editProcessFilter.setProcessName(anotherProcessInstance.entry.name);
        await processList.checkContentIsDisplayedByName(anotherProcessInstance.entry.name);

        await editProcessFilter.setProcessName(completedProcess.entry.name);
        await processList.checkContentIsNotDisplayedByName(completedProcess.entry.name);
    });

    it('[C306892] Should be able to filter by process status - Completed', async () => {
        await editProcessFilter.openFilter();
        await editProcessFilter.setStatusFilterDropDown(PROCESS_STATUS.COMPLETED);
        await processList.getDataTable().waitTillContentLoaded();
        await editProcessFilter.setProcessName(completedProcess.entry.name);
        await processList.checkContentIsDisplayedByName(completedProcess.entry.name);

        await editProcessFilter.setProcessName(runningProcessInstance.entry.name);
        await processList.checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);

        await editProcessFilter.setProcessName(suspendProcessInstance.entry.name);
        await processList.checkContentIsNotDisplayedByName(suspendProcessInstance.entry.name);

        await editProcessFilter.setProcessName(anotherProcessInstance.entry.name);
        await processList.checkContentIsNotDisplayedByName(anotherProcessInstance.entry.name);
    });

    it('[C306892] Should be able to filter by process status - Suspended', async () => {
        await editProcessFilter.openFilter();
        await editProcessFilter.setStatusFilterDropDown(PROCESS_STATUS.SUSPENDED);
        await processList.getDataTable().waitTillContentLoaded();
        await editProcessFilter.setProcessName(suspendProcessInstance.entry.name);
        await processList.checkContentIsDisplayedByName(suspendProcessInstance.entry.name);

        await editProcessFilter.setProcessName(runningProcessInstance.entry.name);
        await processList.checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);

        await editProcessFilter.setProcessName(anotherProcessInstance.entry.name);
        await processList.checkContentIsNotDisplayedByName(anotherProcessInstance.entry.name);

        await editProcessFilter.setProcessName(completedProcess.entry.name);
        await processList.checkContentIsNotDisplayedByName(completedProcess.entry.name);
    });

    it('[C306892] Should be able to filter by process status - All', async () => {
        await processCloudDemoPage.processFilterCloudComponent.clickAllProcessesFilter();

        await editProcessFilter.openFilter();
        await editProcessFilter.setStatusFilterDropDown(PROCESS_STATUS.ALL);

        await processList.checkContentIsDisplayedByName(runningProcessInstance.entry.name);
        await processList.checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        await processList.checkContentIsDisplayedByName(suspendProcessInstance.entry.name);
        await processList.checkContentIsDisplayedByName(completedProcess.entry.name);
    });

    it('[C311318] Should be able to filter by lastModifiedFrom - displays record when date = currentDate', async () => {
        await setProcessName(currentDate, 'lastModifiedFrom');
        await processList.checkContentIsDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311318] Should be able to filter by lastModifiedFrom - displays record when date = beforeDate', async () => {
        await setProcessName(beforeDate, 'lastModifiedFrom');
        await processList.checkContentIsDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311318] Should be able to filter by lastModifiedFrom - does not display record when date = afterDate', async () => {
        await editProcessFilter.openFilter();
        await editProcessFilter.setProcessName(runningProcessInstance.entry.name);
        await processList.getDataTable().waitTillContentLoaded();
        await editProcessFilter.setProperty('lastModifiedFrom', afterDate);
        await processList.checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311319] Should be able to filter by lastModifiedTo - displays record when date = currentDate', async () => {
        await setProcessName(currentDate);
        await processList.checkContentIsDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311319] Should be able to filter by lastModifiedTo - does not display record when date = beforeDate', async () => {
        await setProcessName(beforeDate);
        await processList.checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311319] Should be able to filter by lastModifiedTo - displays record when date = afterDate', async () => {
        await editProcessFilter.openFilter();
        await editProcessFilter.setProperty('lastModifiedTo', afterDate);
        await processList.getDataTable().waitTillContentLoaded();
        await editProcessFilter.setProcessName(runningProcessInstance.entry.name);
        await processList.checkContentIsDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311319] Should not display any processes when the lastModifiedFrom and lastModifiedTo are set to a future date', async () => {
        await editProcessFilter.openFilter();
        await editProcessFilter.setProperty('lastModifiedFrom', afterDate);
        await processList.getDataTable().waitTillContentLoaded();
        await editProcessFilter.setProperty('lastModifiedTo', afterDate);
        await expect(await processListPage.getDisplayedProcessListTitle()).toEqual('No Processes Found');
    });
});
