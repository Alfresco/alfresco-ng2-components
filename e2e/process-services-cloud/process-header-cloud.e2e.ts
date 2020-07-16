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

import { ApiService, AppListCloudPage, GroupIdentityService, IdentityService, LoginPage, ProcessDefinitionsService, ProcessHeaderCloudPage, ProcessInstancesService, QueryService, StringUtil, LocalStorageUtil } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { ProcessCloudDemoPage } from './pages/process-cloud-demo.page';
import { TasksCloudDemoPage } from './pages/tasks-cloud-demo.page';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import CONSTANTS = require('../util/constants');
import moment = require('moment');
import { EditProcessFilterConfiguration } from './config/edit-process-filter.config';

describe('Process Header cloud component', () => {

    describe('Process Header cloud component', () => {
        const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
        const subProcessApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SUB_PROCESS_APP.name;
        const formatDate = 'MMM D, YYYY';

        const processHeaderCloudPage = new ProcessHeaderCloudPage();

        const loginSSOPage = new LoginPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const processCloudDemoPage = new ProcessCloudDemoPage();
        const editProcessFilterConfiguration = new EditProcessFilterConfiguration();
        const editProcessFilterConfigFile = editProcessFilterConfiguration.getConfiguration();

        const apiService = new ApiService();
        const identityService = new IdentityService(apiService);
        const groupIdentityService = new GroupIdentityService(apiService);
        const processDefinitionService = new ProcessDefinitionsService(apiService);
        const processInstancesService = new ProcessInstancesService(apiService);
        const queryService = new QueryService(apiService);

        let testUser, groupInfo;

        let runningProcess, runningCreatedDate, parentCompleteProcess, childCompleteProcess, completedCreatedDate;
        const PROCESSES = CONSTANTS.PROCESS_FILTERS;

        beforeAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

            testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);
            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

            await apiService.login(testUser.email, testUser.password);

            const dropdownRestProcess = await processDefinitionService.getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.dropdownrestprocess, simpleApp);

            const processparent = await processDefinitionService.getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SUB_PROCESS_APP.processes.processparent, subProcessApp);

            runningProcess = await processInstancesService.createProcessInstance(dropdownRestProcess.entry.key,
                simpleApp, { name: StringUtil.generateRandomString(), businessKey: 'test' });

            runningCreatedDate = moment(runningProcess.entry.startDate).format(formatDate);

            parentCompleteProcess = await processInstancesService.createProcessInstance(processparent.entry.key,
                subProcessApp);

            const parentProcessInstance = await queryService.getProcessInstanceSubProcesses(parentCompleteProcess.entry.id,
                subProcessApp);

            childCompleteProcess = parentProcessInstance.list.entries[0];

            completedCreatedDate = moment(childCompleteProcess.entry.startDate).format(formatDate);

            await loginSSOPage.login(testUser.email, testUser.password);
            await LocalStorageUtil.setConfigField('adf-edit-process-filter', JSON.stringify(editProcessFilterConfigFile));
        });

        afterAll(async() => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);
        });

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
        });

        it('[C305010] Should display process details for running process', async () => {
            await appListCloudComponent.goToApp(simpleApp);
            await tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
            await processCloudDemoPage.processFilterCloudComponent.clickOnProcessFilters();
            await processCloudDemoPage.processFilterCloudComponent.clickRunningProcessesFilter();

            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe(PROCESSES.RUNNING);

            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ processName: runningProcess.entry.name });
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcess.entry.name);

            await processCloudDemoPage.processListCloudComponent().selectRow(runningProcess.entry.name);
            await expect(await processHeaderCloudPage.getId()).toEqual(runningProcess.entry.id);
            await expect(await processHeaderCloudPage.getName()).toEqual(runningProcess.entry.name);
            await expect(await processHeaderCloudPage.getStatus()).toEqual('RUNNING');
            await expect(await processHeaderCloudPage.getInitiator()).toEqual(runningProcess.entry.initiator);
            await expect(await processHeaderCloudPage.getStartDate()).toEqual(runningCreatedDate);
            await expect(await processHeaderCloudPage.getParentId()).toEqual(CONSTANTS.PROCESS_DETAILS.NO_PARENT);
            await expect(await processHeaderCloudPage.getBusinessKey()).toEqual(runningProcess.entry.businessKey);
            await expect(await processHeaderCloudPage.getLastModified()).toEqual(runningCreatedDate);
        });

        it('[C305008] Should display process details for completed process', async () => {
            await appListCloudComponent.goToApp(subProcessApp);
            await tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
            await processCloudDemoPage.processFilterCloudComponent.clickOnProcessFilters();

            await processCloudDemoPage.processFilterCloudComponent.clickCompletedProcessesFilter();
            await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe(PROCESSES.COMPLETED);

            await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ initiator: testUser.username });
            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(childCompleteProcess.entry.name);

            await processCloudDemoPage.processListCloudComponent().checkProcessListIsLoaded();
            await processCloudDemoPage.processListCloudComponent().selectRowById(childCompleteProcess.entry.id);

            await expect(await processHeaderCloudPage.getId()).toEqual(childCompleteProcess.entry.id);
            await expect(await processHeaderCloudPage.getName()).toEqual(CONSTANTS.PROCESS_DETAILS.NO_NAME);
            await expect(await processHeaderCloudPage.getStatus()).toEqual('COMPLETED');
            await expect(await processHeaderCloudPage.getInitiator()).toEqual(childCompleteProcess.entry.initiator);
            await expect(await processHeaderCloudPage.getStartDate()).toEqual(completedCreatedDate);
            await expect(await processHeaderCloudPage.getParentId()).toEqual(childCompleteProcess.entry.parentId);
            await expect(await processHeaderCloudPage.getBusinessKey()).toEqual(CONSTANTS.PROCESS_DETAILS.NO_BUSINESS_KEY);
            await expect(await processHeaderCloudPage.getLastModified()).toEqual(completedCreatedDate);
        });
   });
});
