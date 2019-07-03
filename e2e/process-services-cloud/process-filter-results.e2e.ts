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
    LoginSSOPage, ApiService, SettingsPage, IdentityService, GroupIdentityService, StringUtil, DateUtil
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage, LocalStorageUtil } from '@alfresco/adf-testing';
import resources = require('../util/resources');
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
    const settingsPage = new SettingsPage();
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

    let completedProcess, runningProcessInstance, suspendProcessInstance, testUser, anotherUser, groupInfo, anotherProcessInstance, processDefinition, anotherProcessDefinition,
        differentAppUserProcessInstance, simpleAppProcessDefinition;
    const candidateBaseApp = resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.name;
    const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;

    beforeAll(async (done) => {

        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER]);
        anotherUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER]);

        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await identityService.addUserToGroup(anotherUser.idIdentityService, groupInfo.id);

        await apiService.login(anotherUser.email, anotherUser.password);
        processDefinitionService = new ProcessDefinitionsService(apiService);
        simpleAppProcessDefinition = await processDefinitionService.getProcessDefinitionByName('simpleProcess', simpleApp);
        processInstancesService = new ProcessInstancesService(apiService);
        differentAppUserProcessInstance = await processInstancesService.createProcessInstance(simpleAppProcessDefinition.entry.key, simpleApp, {
            'name': StringUtil.generateRandomString(),
            'businessKey': StringUtil.generateRandomString()
        });

        await apiService.login(testUser.email, testUser.password);
        processDefinition = await processDefinitionService.getProcessDefinitionByName('candidateGroupProcess', candidateBaseApp);
        anotherProcessDefinition = await processDefinitionService.getProcessDefinitionByName('anotherCandidateGroupProcess', candidateBaseApp);

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

        const task = await queryService.getProcessInstanceTasks(completedProcess.entry.id, candidateBaseApp);
        tasksService = new TasksService(apiService);
        const claimedTask = await tasksService.claimTask(task.list.entries[0].entry.id, candidateBaseApp);
        await tasksService.completeTask(claimedTask.entry.id, candidateBaseApp);

        await settingsPage.setProviderBpmSso(
            browser.params.config.bpmHost,
            browser.params.config.oauth2.host,
            browser.params.config.identityHost);
        loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
        await LocalStorageUtil.setConfigField('adf-edit-process-filter', JSON.stringify(editProcessFilterConfigFile));
        await LocalStorageUtil.setConfigField('adf-cloud-process-list', JSON.stringify(processListCloudConfigFile));
        done();
    });

    afterAll(async (done) => {
        await processInstancesService.deleteProcessInstance(runningProcessInstance.entry.id, candidateBaseApp);
        await processInstancesService.deleteProcessInstance(anotherProcessInstance.entry.id, candidateBaseApp);
        await processInstancesService.deleteProcessInstance(suspendProcessInstance.entry.id, candidateBaseApp);

        await apiService.login(anotherUser.email, anotherUser.password);
        await processInstancesService.deleteProcessInstance(differentAppUserProcessInstance.entry.id, simpleApp);

        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await identityService.deleteIdentityUser(testUser.idIdentityService);
        await identityService.deleteIdentityUser(anotherUser.idIdentityService);
        done();
    });

    beforeEach(() => {
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        appListCloudComponent.goToApp(candidateBaseApp);
        tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
        processCloudDemoPage.clickOnProcessFilters();
    });

    it('[C306887] Should be able to filter by appName', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setAppNameDropDown(candidateBaseApp).setProperty('initiator', testUser.username);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(differentAppUserProcessInstance.entry.name);
    });

    it('[C306889] Should be able to see "No process found" when using an app with no processes in the appName field', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setAppNameDropDown('subprocessapp').setProperty('initiator', testUser.username);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(processListPage.checkProcessListTitleIsDisplayed()).toEqual('No Processes Found');
    });

    it('[C306890] Should be able to filter by initiator', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('initiator', testUser.username);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(differentAppUserProcessInstance.entry.name);
    });

    it('[C306891] Should be able to see "No process found" when providing an initiator whitout processes', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('initiator', anotherUser.username);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(processListPage.checkProcessListTitleIsDisplayed()).toEqual('No Processes Found');
    });

    it('[C311315] Should be able to filter by process definition id', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('processDefinitionId', processDefinition.entry.id);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);

        processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processDefinitionId', anotherProcessDefinition.entry.id);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311316] Should be able to filter by process definition key', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('processDefinitionKey', processDefinition.entry.key);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);

        processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processDefinitionKey', anotherProcessDefinition.entry.key);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311317] Should be able to filter by process instance id', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('processInstanceId', runningProcessInstance.entry.id);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
        expect(processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfRows()).toBe(1);

        processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processInstanceId', anotherProcessInstance.entry.id);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
        expect(processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfRows()).toBe(1);
    });

    it('[C311321] Should be able to filter by process name', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('processName', runningProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);

        processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processName', anotherProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C306892] Should be able to filter by process status - Running', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setStatusFilterDropDown('RUNNING');
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(suspendProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(completedProcess.entry.name);
    });

    it('[C306892] Should be able to filter by process status - Completed', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setStatusFilterDropDown('COMPLETED');
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(completedProcess.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(suspendProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(anotherProcessInstance.entry.name);
    });

    it('[C306892] Should be able to filter by process status - Suspended', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setStatusFilterDropDown('SUSPENDED');
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(suspendProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(anotherProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(completedProcess.entry.name);
    });

    it('[C306892] Should be able to filter by process status - All', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setStatusFilterDropDown('ALL');
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(suspendProcessInstance.entry.name);
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(completedProcess.entry.name);
    });

    it('[C311318] Should be able to filter by lastModifiedFrom - displays record when date = currentDate', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('lastModifiedFrom', currentDate);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311318] Should be able to filter by lastModifiedFrom - displays record when date = beforeDate', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('lastModifiedFrom', beforeDate);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311318] Should be able to filter by lastModifiedFrom - does not display record when date = afterDate', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('lastModifiedFrom', afterDate);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311319] Should be able to filter by lastModifiedTo - displays record when date = currentDate', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('lastModifiedTo', currentDate);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311319] Should be able to filter by lastModifiedTo - does not display record when date = beforeDate', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('lastModifiedTo', beforeDate);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311319] Should be able to filter by lastModifiedTo - displays record when date = afterDate', async () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('lastModifiedTo', afterDate);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name);
    });

    it('[C311319] Should not display any processes when the lastModifiedFrom and lastModifiedTo are set to a future date', () => {
        processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('lastModifiedFrom', afterDate);
        processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedTo', afterDate);
        processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        expect(processListPage.checkProcessListTitleIsDisplayed()).toEqual('No Processes Found');
    });

});
