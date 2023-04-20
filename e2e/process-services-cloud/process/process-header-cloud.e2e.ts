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

import { createApiService, AppListCloudPage, GroupIdentityService, IdentityService, LoginPage, ProcessDefinitionsService, ProcessHeaderCloudPage, ProcessInstancesService, QueryService, StringUtil, LocalStorageUtil } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { ProcessCloudDemoPage } from './../pages/process-cloud-demo.page';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import CONSTANTS = require('../../util/constants');
import * as moment from 'moment';
import { EditProcessFilterConfiguration } from './../config/edit-process-filter.config';

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
        const taskList = tasksCloudDemoPage.taskListCloudComponent();

        const processCloudDemoPage = new ProcessCloudDemoPage();
        const editProcessFilter = processCloudDemoPage.editProcessFilterCloudComponent();
        const processFilter = processCloudDemoPage.processFilterCloudComponent;
        const processList = processCloudDemoPage.processListCloudComponent();

        const editProcessFilterConfiguration = new EditProcessFilterConfiguration();
        const editProcessFilterConfigFile = editProcessFilterConfiguration.getConfiguration();

        const apiService = createApiService();
        const identityService = new IdentityService(apiService);
        const groupIdentityService = new GroupIdentityService(apiService);
        const processDefinitionService = new ProcessDefinitionsService(apiService);
        const processInstancesService = new ProcessInstancesService(apiService);
        const queryService = new QueryService(apiService);

        let testUser; let groupInfo;

        let runningProcess; let runningCreatedDate; let parentCompleteProcess; let childCompleteProcess; let completedCreatedDate;
        const PROCESSES = CONSTANTS.PROCESS_FILTERS;

        beforeAll(async () => {
            await apiService.loginWithProfile('identityAdmin');

            testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);
            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

            await apiService.login(testUser.username, testUser.password);

            const simpleProcess = await processDefinitionService.getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.simpleProcess, simpleApp);

            const processparent = await processDefinitionService.getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SUB_PROCESS_APP.processes.processparent, subProcessApp);

            runningProcess = await processInstancesService.createProcessInstance(simpleProcess.entry.key,
                simpleApp, { name: StringUtil.generateRandomString(), businessKey: 'test' });

            runningCreatedDate = moment(runningProcess.entry.startDate).format(formatDate);

            parentCompleteProcess = await processInstancesService.createProcessInstance(processparent.entry.key,
                subProcessApp);

            const parentProcessInstance = await queryService.getProcessInstanceSubProcesses(parentCompleteProcess.entry.id,
                subProcessApp);

            childCompleteProcess = parentProcessInstance.list.entries[0];

            completedCreatedDate = moment(childCompleteProcess.entry.startDate).format(formatDate);

            await loginSSOPage.login(testUser.username, testUser.password);
            await LocalStorageUtil.setConfigField('adf-edit-process-filter', JSON.stringify(editProcessFilterConfigFile));
        });

        afterAll(async () => {
            await apiService.loginWithProfile('identityAdmin');
            await identityService.deleteIdentityUser(testUser.idIdentityService);
        });

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
        });

        it('[C305010] Should display process details for running process', async () => {
            await appListCloudComponent.goToApp(simpleApp);
            await taskList.checkTaskListIsLoaded();
            await processFilter.clickOnProcessFilters();
            await processFilter.clickRunningProcessesFilter();

            await expect(await processFilter.getActiveFilterName()).toBe(PROCESSES.RUNNING);

            await editProcessFilter.setFilter({ processName: runningProcess.entry.name });
            await processList.getDataTable().waitTillContentLoaded();
            await processList.checkContentIsDisplayedByName(runningProcess.entry.name);

            await processList.selectRow(runningProcess.entry.name);
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
            await taskList.checkTaskListIsLoaded();
            await processFilter.clickOnProcessFilters();

            await processFilter.clickCompletedProcessesFilter();
            await expect(await processFilter.getActiveFilterName()).toBe(PROCESSES.COMPLETED);

            await editProcessFilter.setFilter({ initiator: `${testUser.firstName} ${testUser.lastName}` });
            await processList.getDataTable().waitTillContentLoaded();
            await processList.checkContentIsDisplayedByName(childCompleteProcess.entry.name);

            await processList.checkProcessListIsLoaded();
            await processList.selectRowById(childCompleteProcess.entry.id);

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
