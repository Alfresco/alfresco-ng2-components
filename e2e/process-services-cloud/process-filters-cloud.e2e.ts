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

import TestConfig = require('../test.config');

import { TasksService, QueryService, ProcessDefinitionsService, ProcessInstancesService, LoginSSOPage, ApiService, SettingsPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';

import resources = require('../util/resources');

describe('Process filters cloud', () => {

    describe('Process Filters', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const processCloudDemoPage = new ProcessCloudDemoPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();

        let tasksService: TasksService;
        let processDefinitionService: ProcessDefinitionsService;
        let processInstancesService: ProcessInstancesService;
        let queryService: QueryService;

        let runningProcess, completedProcess;
        const simpleApp = resources.ACTIVITI7_APPS.CANDIDATE_USER_APP.name;
        const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;

        beforeAll(async (done) => {
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, false);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginSSOIdentityService(user, password);

            const apiService = new ApiService('activiti', TestConfig.adf.hostBPM, TestConfig.adf.hostSso, 'BPM');
            await apiService.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            processDefinitionService = new ProcessDefinitionsService(apiService);
            const processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            processInstancesService = new  ProcessInstancesService(apiService);
            runningProcess = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);

            completedProcess = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            queryService = new QueryService(apiService);
            const task = await queryService.getProcessInstanceTasks(completedProcess.entry.id, simpleApp);
            tasksService = new TasksService(apiService);
            const claimedTask = await tasksService.claimTask(task.list.entries[0].entry.id, simpleApp);
            await tasksService.completeTask(claimedTask.entry.id, simpleApp);
            done();
        });

        beforeEach((done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
            processCloudDemoPage.clickOnProcessFilters();
            done();
        });

        it('[C290021] Should be able to view default filters', () => {
            processCloudDemoPage.completedProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.runningProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
        });

        it('[C290043] Should display process in Running Processes List when process is started', () => {
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            processCloudDemoPage.runningProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcess.entry.id);

            processCloudDemoPage.completedProcessesFilter().clickProcessFilter();
            processCloudDemoPage.completedProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Completed Processes');
            processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedById(runningProcess.entry.id);

            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('All Processes');
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcess.entry.id);
        });

        it('[C290044] Should display process in Completed Processes List when process is completed', () => {
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            processCloudDemoPage.runningProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedById(completedProcess.entry.id);

            processCloudDemoPage.completedProcessesFilter().clickProcessFilter();
            processCloudDemoPage.completedProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Completed Processes');
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(completedProcess.entry.id);

            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('All Processes');
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(completedProcess.entry.id);
        });
    });

});
