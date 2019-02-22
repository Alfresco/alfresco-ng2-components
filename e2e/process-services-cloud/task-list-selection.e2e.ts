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

import { LoginSSOPage } from '../pages/adf/loginSSOPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudComponent } from '../pages/adf/process-cloud/appListCloudComponent';
import { ConfigEditorPage } from '../pages/adf/configEditorPage';
import { TaskListCloudConfiguration } from './taskListCloud.config';

import { Util } from '../util/util';
import moment = require('moment');
import { DateUtil } from '../util/dateUtil';

import { Tasks } from '../actions/APS-cloud/tasks';
import { ProcessDefinitions } from '../actions/APS-cloud/process-definitions';
import { ProcessInstances } from '../actions/APS-cloud/process-instances';

describe('Task list cloud - selection', () => {

    describe('Task list cloud - selection', () => {
        const configEditorPage = new ConfigEditorPage();
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        let appListCloudComponent = new AppListCloudComponent();
        let tasksCloudDemoPage = new TasksCloudDemoPage();

        const tasksService: Tasks = new Tasks();
        const processDefinitionService: ProcessDefinitions = new ProcessDefinitions();
        const processInstancesService: ProcessInstances = new ProcessInstances();

        let silentLogin;
        const simpleApp = 'simple-app';
        const candidateUserApp = 'candidateuserapp';
        let noTasksFoundMessage = 'No Tasks Found';
        const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
        let createdTask, notAssigned, notDisplayedTask, processDefinition, processInstance, priorityTask, subTask;
        let priority = 30;

        let beforeDate = moment().add(-1, 'days').format('DD/MM/YYYY');
        let currentDate = DateUtil.formatDate('DD/MM/YYYY');
        let afterDate = moment().add(1, 'days').format('DD/MM/YYYY');

        beforeAll(async (done) => {
            silentLogin = false;
            let jsonFile = new TaskListCloudConfiguration().getConfiguration();
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginAPS(user, password);

            navigationBarPage.clickConfigEditorButton();

            configEditorPage.clickTaskListCloudConfiguration();
            configEditorPage.clickClearButton();
            configEditorPage.enterBigConfigurationText(JSON.stringify(jsonFile)).clickSaveButton();

            browser.driver.sleep(5000);

            configEditorPage.clickEditTaskConfiguration();
            configEditorPage.clickClearButton();
            browser.driver.sleep(5000);
            configEditorPage.enterConfiguration('{' +
                '"properties": [' +
                '"appName",' + '"state",' + '"assignment",' +
                '"taskName",' + '"parentTaskId",' + '"priority",' +
                '"standAlone",' + '"owner",' +'"processDefinitionId",' +'"processInstanceId",' +
                '"lastModifiedFrom",' +'"lastModifiedTo",' +'"sort",' +'"order"' +
                ']' +
                '}');
            configEditorPage.clickSaveButton();

            await tasksService.init(user, password);
            createdTask = await tasksService.createStandaloneTask(Util.generateRandomString(), simpleApp);
            await tasksService.claimTask(createdTask.entry.id, simpleApp);
            notAssigned = await tasksService.createStandaloneTask(Util.generateRandomString(), simpleApp);
            priorityTask = await tasksService.createStandaloneTask(Util.generateRandomString(), simpleApp, {priority: priority});
            await tasksService.claimTask(priorityTask.entry.id, simpleApp);
            notDisplayedTask = await tasksService.createStandaloneTask(Util.generateRandomString(), candidateUserApp);
            await tasksService.claimTask(notDisplayedTask.entry.id, candidateUserApp);

            /*await processDefinitionService.init(user, password);
            processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            await processInstancesService.init(user, password);
            processInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);*/

            /*subTask = await tasksService.createStandaloneSubtask(createdTask.entry.id, simpleApp, Util.generateRandomString());
            await tasksService.claimTask(subTask.entry.id, simpleApp);*/

            done();
        });

        beforeEach((done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            done();
        });

        /*it('[C292004] Filter by appName', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getAppNameDropDownValue()).toEqual(simpleApp);

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(createdTask.entry.name);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(notDisplayedTask.entry.name);

            tasksCloudDemoPage.editTaskFilterCloudComponent().setAppNameDropDown(candidateUserApp);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getAppNameDropDownValue()).toEqual(candidateUserApp);

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(notDisplayedTask.entry.name);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(createdTask.entry.name);
        });*/

        it('[C291916] Should be able to select multiple row when multiselect is true', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.clickMultiSelect();
            /*expect(tasksCloudDemoPage.getAppName()).toEqual(simpleApp);

            tasksCloudDemoPage.taskListCloudComponent().getDataTable().clickCheckboxByName(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsCheckedByName(createdTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().clickCheckboxByName(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsCheckedByName(assignedTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsNotCheckedByName(multipleTaskName);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().clickCheckboxByName(assignedTaskName);
            taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsNotCheckedByName(assignedTaskName);
            taskListCloudDemoPage.taskListCloud().getDataTable().checkRowIsCheckedByName(createdTaskName);*/
        });

    });

});
