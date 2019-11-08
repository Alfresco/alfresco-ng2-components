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

import {
    TasksService, QueryService, ProcessDefinitionsService, ProcessInstancesService,
    LoginSSOPage, ApiService, IdentityService, GroupIdentityService, StringUtil, DateUtil
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage, LocalStorageUtil } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { ProcessListCloudConfiguration } from './config/process-list-cloud.config';
import { EditProcessFilterConfiguration } from './config/edit-process-filter.config';
import { ProcessListPage } from '../pages/adf/process-services/processListPage';
import moment = require('moment');

describe('Process filters cloud', () => {
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const processCloudDemoPage = new ProcessCloudDemoPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const processListPage = new ProcessListPage();
    const apiService = new ApiService(
        browser.params.config.oauth2.clientId,
        browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
    );
    const beforeDate = moment().add(-1, 'days').format('DD/MM/YYYY');
    const currentDate = DateUtil.formatDate('DD/MM/YYYY');
    const afterDate = moment().add(1, 'days').format('DD/MM/YYYY');
    const processListCloudConfiguration = new ProcessListCloudConfiguration();
    const editProcessFilterConfiguration = new EditProcessFilterConfiguration();
    const processListCloudConfigFile = processListCloudConfiguration.getConfiguration();
    const editProcessFilterConfigFile = editProcessFilterConfiguration.getConfiguration();

    let tasksService: TasksService;
    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;
    let processDefinitionService: ProcessDefinitionsService;
    let processInstancesService: ProcessInstancesService;
    let queryService: QueryService;

    let completedProcess, runningProcessInstance, suspendProcessInstance, testUser, anotherUser, groupInfo,
        anotherProcessInstance, processDefinition, anotherProcessDefinition,
        differentAppUserProcessInstance, simpleAppProcessDefinition;
    const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    beforeAll(async () => {

        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);

        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);
        anotherUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);

        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await identityService.addUserToGroup(anotherUser.idIdentityService, groupInfo.id);

        await apiService.login(anotherUser.email, anotherUser.password);
        processDefinitionService = new ProcessDefinitionsService(apiService);
        simpleAppProcessDefinition = await processDefinitionService
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.simpleProcess, simpleApp);

        processInstancesService = new ProcessInstancesService(apiService);
        differentAppUserProcessInstance = await processInstancesService.createProcessInstance(simpleAppProcessDefinition.entry.key, simpleApp, {
            'name': StringUtil.generateRandomString(),
            'businessKey': StringUtil.generateRandomString()
        });

        await apiService.login(testUser.email, testUser.password);
        processDefinition = await processDefinitionService
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.candidateGroupProcess, candidateBaseApp);

        anotherProcessDefinition = await processDefinitionService
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.anotherCandidateGroupProcess, candidateBaseApp);

        runningProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            'name': StringUtil.generateRandomString(),
            'businessKey': StringUtil.generateRandomString()
        });

        anotherProcessInstance = await processInstancesService.createProcessInstance(anotherProcessDefinition.entry.key, candidateBaseApp, {
            'name': StringUtil.generateRandomString(),
            'businessKey': StringUtil.generateRandomString()
        });

        suspendProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            'name': StringUtil.generateRandomString(),
            'businessKey': StringUtil.generateRandomString()
        });
        await processInstancesService.suspendProcessInstance(suspendProcessInstance.entry.id, candidateBaseApp);

        completedProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            'name': StringUtil.generateRandomString(),
            'businessKey': StringUtil.generateRandomString()
        });
        queryService = new QueryService(apiService);

        await browser.sleep(4000); // eventual consistency query
        const task = await queryService.getProcessInstanceTasks(completedProcess.entry.id, candidateBaseApp);
        tasksService = new TasksService(apiService);
        const claimedTask = await tasksService.claimTask(task.list.entries[0].entry.id, candidateBaseApp);
        await tasksService.completeTask(claimedTask.entry.id, candidateBaseApp);

        await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
        await LocalStorageUtil.setConfigField('adf-edit-process-filter', JSON.stringify(editProcessFilterConfigFile));
        await LocalStorageUtil.setConfigField('adf-cloud-process-list', JSON.stringify(processListCloudConfigFile));

    });

    afterAll(async () => {
        await processInstancesService.deleteProcessInstance(runningProcessInstance.entry.id, candidateBaseApp);
        await processInstancesService.deleteProcessInstance(anotherProcessInstance.entry.id, candidateBaseApp);
        await processInstancesService.deleteProcessInstance(suspendProcessInstance.entry.id, candidateBaseApp);

        await apiService.login(anotherUser.email, anotherUser.password);
        await processInstancesService.deleteProcessInstance(differentAppUserProcessInstance.entry.id, simpleApp);

        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

        await identityService.deleteIdentityUser(testUser.idIdentityService);
        await identityService.deleteIdentityUser(anotherUser.idIdentityService);

    });

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(candidateBaseApp);
        await tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
        await processCloudDemoPage.clickOnProcessFilters();
    });

    it('[C306887] Should be able to filter by appName', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setAppNameDropDown(candidateBaseApp);
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('initiator', testUser.username);

        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(differentAppUserProcessInstance.entry.name);
    });

    it('[C306889] Should be able to see "No process found" when using an app with no processes in the appName field', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setAppNameDropDown('subprocessapp');
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('initiator', testUser.username);

        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await expect(await processListPage.getDisplayedProcessListTitle()).toEqual('No Processes Found');
    });

    it('[C306890] Should be able to filter by initiator', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('initiator', testUser.username);

        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(differentAppUserProcessInstance.entry.name);
    });

    it('[C306891] Should be able to see "No process found" when providing an initiator whitout processes', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('initiator', anotherUser.username);

        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await expect(await processListPage.getDisplayedProcessListTitle()).toEqual('No Processes Found');
    });

    it('[C311315] Should be able to filter by process definition id', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processDefinitionId', processDefinition.entry.id);

        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);

        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processDefinitionId', anotherProcessDefinition.entry.id);
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311316] Should be able to filter by process definition key', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processDefinitionKey', processDefinition.entry.key);
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);

        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processDefinitionKey', anotherProcessDefinition.entry.key);
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311317] Should be able to filter by process instance id', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processInstanceId', runningProcessInstance.entry.id);
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);

        await browser.driver.sleep(1000);
        await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfRows()).toBe(1);

        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processInstanceId', anotherProcessInstance.entry.id);
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
        await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfRows()).toBe(1);
    });

    it('[C311321] Should be able to filter by process name', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processName', runningProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);

        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processName', anotherProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C306892] Should be able to filter by process status - Running', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('RUNNING');
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(suspendProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(completedProcess.entry.name);
    });

    it('[C306892] Should be able to filter by process status - Completed', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('COMPLETED');
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(completedProcess.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(suspendProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(anotherProcessInstance.entry.name);
    });

    it('[C306892] Should be able to filter by process status - Suspended', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('SUSPENDED');

        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(suspendProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(anotherProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(completedProcess.entry.name);
    });

    it('[C306892] Should be able to filter by process status - All', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('ALL');
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(suspendProcessInstance.entry.name);
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(completedProcess.entry.name);
    });

    it('[C311318] Should be able to filter by lastModifiedFrom - displays record when date = currentDate', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedFrom', currentDate);
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311318] Should be able to filter by lastModifiedFrom - displays record when date = beforeDate', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedFrom', beforeDate);
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311318] Should be able to filter by lastModifiedFrom - does not display record when date = afterDate', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedFrom', afterDate);
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311319] Should be able to filter by lastModifiedTo - displays record when date = currentDate', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedTo', currentDate);
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311319] Should be able to filter by lastModifiedTo - does not display record when date = beforeDate', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedTo', beforeDate);
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311319] Should be able to filter by lastModifiedTo - displays record when date = afterDate', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedTo', afterDate);
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311319] Should not display any processes when the lastModifiedFrom and lastModifiedTo are set to a future date', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedFrom', afterDate);
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedTo', afterDate);
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await expect(await processListPage.getDisplayedProcessListTitle()).toEqual('No Processes Found');
    });

});
