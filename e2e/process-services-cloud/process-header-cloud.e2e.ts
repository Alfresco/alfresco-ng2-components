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
import CONSTANTS = require('../util/constants');
import { Util } from '../util/util';
import moment = require('moment');

import { ProcessDefinitions } from '../actions/APS-cloud/process-definitions';
import { ProcessInstances } from '../actions/APS-cloud/process-instances';
import { Query } from '../actions/APS-cloud/query';

import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { LoginSSOPage } from '@alfresco/adf-testing';
import { SettingsPage } from '../pages/adf/settingsPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { ProcessHeaderCloudComponent } from '../pages/adf/process-cloud/ProcessHeaderCloudComponent';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { browser } from 'protractor';

describe('Process Header cloud component', () => {

    describe('Process Header cloud component', () => {

        const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
        const simpleApp = 'simple-app', subProcessApp = 'projectsubprocess';
        let formatDate = 'DD-MM-YYYY';

        let processHeaderCloudPage = new ProcessHeaderCloudComponent();

        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        let processCloudDemoPage = new ProcessCloudDemoPage();

        const processDefinitionService: ProcessDefinitions = new ProcessDefinitions();
        const processInstancesService: ProcessInstances = new ProcessInstances();
        const queryService: Query = new Query();

        let silentLogin;
        let runningProcess, runningCreatedDate, parentCompleteProcess, childCompleteProcess, completedCreatedDate;

        beforeAll(async (done) => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            browser.ignoreSynchronization = true;
            loginSSOPage.loginSSOIdentityService(user, password);

            await processDefinitionService.init(user, password);
            let processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            let childProcessDefinition = await processDefinitionService.getProcessDefinitions(subProcessApp);

            await processInstancesService.init(user, password);
            runningProcess = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key,
                simpleApp, {name: Util.generateRandomString(), businessKey: 'test'});
            runningCreatedDate = moment(runningProcess.entry.startDate).format(formatDate);
            parentCompleteProcess = await processInstancesService.createProcessInstance(childProcessDefinition.list.entries[0].entry.key,
                subProcessApp, {name: 'cris'});

            let parentProcessInstance = await queryService.getProcessInstanceSubProcesses(parentCompleteProcess.entry.id,
                subProcessApp);
            childCompleteProcess = parentProcessInstance.list.entries[0];
            completedCreatedDate = moment(childCompleteProcess.entry.startDate).format(formatDate);

            done();
        });

        beforeEach(async (done) => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            done();
        });

        it('[C291943] Should display process details for running process', async () => {
            await appListCloudComponent.goToApp(simpleApp);
            tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
            processCloudDemoPage.clickOnProcessFilters();

            processCloudDemoPage.runningProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcess.entry.name);

            processCloudDemoPage.processListCloudComponent().checkProcessListIsLoaded();
            processCloudDemoPage.processListCloudComponent().selectRow(runningProcess.entry.name);
            expect(processHeaderCloudPage.getId()).toEqual(runningProcess.entry.id);
            expect(processHeaderCloudPage.getName()).toEqual(runningProcess.entry.name);
            expect(processHeaderCloudPage.getStatus()).toEqual(runningProcess.entry.status);
            expect(processHeaderCloudPage.getInitiator()).toEqual(runningProcess.entry.initiator);
            expect(processHeaderCloudPage.getStartDate()).toEqual(runningCreatedDate);
            expect(processHeaderCloudPage.getParentId()).toEqual(CONSTANTS.PROCESS_DETAILS.NO_PARENT);
            expect(processHeaderCloudPage.getBusinessKey()).toEqual(runningProcess.entry.businessKey);
            expect(processHeaderCloudPage.getLastModified()).toEqual(runningCreatedDate);
        });

        it('[C291944] Should display process details for completed process', async () => {
            await appListCloudComponent.goToApp(subProcessApp);
            tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
            processCloudDemoPage.clickOnProcessFilters();

            processCloudDemoPage.completedProcessesFilter().checkProcessFilterIsDisplayed();
            processCloudDemoPage.completedProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Completed Processes');
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(childCompleteProcess.entry.name);

            processCloudDemoPage.processListCloudComponent().checkProcessListIsLoaded();
            processCloudDemoPage.processListCloudComponent().selectRowById(childCompleteProcess.entry.id);

            expect(processHeaderCloudPage.getId()).toEqual(childCompleteProcess.entry.id);
            expect(processHeaderCloudPage.getName()).toEqual(childCompleteProcess.entry.name);
            expect(processHeaderCloudPage.getStatus()).toEqual(childCompleteProcess.entry.status);
            expect(processHeaderCloudPage.getInitiator()).toEqual(childCompleteProcess.entry.initiator);
            expect(processHeaderCloudPage.getStartDate()).toEqual(completedCreatedDate);
            expect(processHeaderCloudPage.getParentId()).toEqual(childCompleteProcess.entry.parentId);
            expect(processHeaderCloudPage.getBusinessKey()).toEqual(CONSTANTS.PROCESS_DETAILS.NO_BUSINESS_KEY);
            expect(processHeaderCloudPage.getLastModified()).toEqual(completedCreatedDate);
        });

    });

});
