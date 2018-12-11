/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { LoginSSOPage } from '../pages/adf/loginSSOPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/processCloudDemoPage';
import { AppListCloudComponent } from '../pages/adf/process_cloud/appListCloudComponent';

import { ProcessDefinitions } from '../actions/APS-cloud/process-definitions';
import { ProcessInstances } from '../actions/APS-cloud/process-instances';
import { Tasks } from '../actions/APS-cloud/tasks';
import { Query } from '../actions/APS-cloud/query';

describe('Process filters cloud', () => {

    describe('Process Filters', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        let appListCloudComponent = new AppListCloudComponent();
        let processCloudDemoPage = new ProcessCloudDemoPage();

        const tasksService: Tasks = new Tasks();
        const processDefinitionService: ProcessDefinitions = new ProcessDefinitions();
        const processInstancesService: ProcessInstances = new ProcessInstances();
        const queryService: Query = new Query();

        const path = '/auth/realms/springboot';
        let silentLogin;
        let runningProcess, completedProcess;
        const simpleApp = 'candidateuserapp';
        const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;

        beforeAll(async () => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostSso, TestConfig.adf.hostSso + path, silentLogin);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginAPS(user, password);

            await processDefinitionService.init(user, password);
            let processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            await processInstancesService.init(user, password);
            runningProcess = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);

            let processInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            await queryService.init(user, password);
            let task = await queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp);
            await tasksService.init(user, password);
            let claimedTask = await tasksService.claimTask(task.list.entries[0].entry.id, simpleApp);
            await tasksService.completeTask(claimedTask.entry.id, simpleApp);
        });

        beforeEach((done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
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
            expect(processCloudDemoPage.checkActiveFilterActive()).toBe('Running Processes');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkContentIsDisplayed(runningProcess.entry.id);

            processCloudDemoPage.completedProcessesFilter().clickProcessFilter();
            processCloudDemoPage.completedProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.checkActiveFilterActive()).toBe('Completed Processes');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkContentIsNotDisplayed(runningProcess.entry.id);

            processCloudDemoPage.allProcessesFilter().clickProcessFilter();
            processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed();
            expect(processCloudDemoPage.checkActiveFilterActive()).toBe('All Processes');
            processCloudDemoPage.processListCloudComponent().getDataTable().checkContentIsDisplayed(runningProcess.entry.id);
        });

        xit('[C289957] Should display task filter results when task filter is selected', () => {
            tasksService.init(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            let task = tasksService.createStandaloneTask(myTask, simpleApp);

            tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            expect(tasksCloudDemoPage.checkActiveFilterActive()).toBe('My Tasks');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(myTask);
        });
    });

});
