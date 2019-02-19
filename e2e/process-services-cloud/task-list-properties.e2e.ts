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

import { Tasks } from '../actions/APS-cloud/tasks';
import { ProcessDefinitions } from '../actions/APS-cloud/process-definitions';
import { ProcessInstances } from '../actions/APS-cloud/process-instances';

describe('Edit task filters and task list properties', () => {

    describe('Edit task filters and task list properties', () => {
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
        let createdTask, notDisplayedTask, processDefinition, processInstance;

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

            browser.driver.sleep(15000);

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
            browser.driver.sleep(5000);
            configEditorPage.clickSaveButton();
            browser.driver.sleep(35000);
            browser.driver.sleep(5000);

            await tasksService.init(user, password);
            createdTask = await tasksService.createStandaloneTask(Util.generateRandomString(), simpleApp);
            await tasksService.claimTask(createdTask.entry.id, simpleApp);
            notDisplayedTask = await tasksService.createStandaloneTask(Util.generateRandomString(), candidateUserApp);
            await tasksService.claimTask(notDisplayedTask.entry.id, candidateUserApp);

            await processDefinitionService.init(user, password);
            processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            await processInstancesService.init(user, password);
            processInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            console.log("bbb: ", processInstance);
            done();
        });

        beforeEach((done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            done();
        });

        it('[C292004] Filter by appName', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent();//.setAppNameDropDown(simpleApp);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getAppNameDropDownValue()).toEqual(simpleApp);

            //tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsDisplayedByName(createdTask.entry.name);
            //tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsNotDisplayedByName(notDisplayedTask.entry.name);

            tasksCloudDemoPage.editTaskFilterCloudComponent().setAppNameDropDown(candidateUserApp);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getAppNameDropDownValue()).toEqual(candidateUserApp);

            //tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsNotDisplayedByName(createdTask.entry.name);
            //tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsDisplayedByName(notDisplayedTask.entry.name);
        });

        it('[C297476] Filter by taskName', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setTaskName(createdTask.entry.name);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getTaskName()).toEqual(createdTask.entry.name);

            //tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsDisplayedByName(createdTask.entry.name);
            //expect(tasksCloudDemoPage.taskListCloudComponent().getDataTable().getNumberOfRowsDisplayedWithSameName(createdTask.entry.name)).toEqual(1);
        });

        it('[C297613] Should be able to see No tasks found when typing a task name that does not exist', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setTaskName('invalidName');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getTaskName()).toEqual('invalidName');

            expect(tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C297480] Should be able to see only tasks that are part of a specific process when processInstanceId is set', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setProcessDefinitionId(processDefinition.list.entries[0].entry.id)
                .setStateFilterDropDown('ALL').setAssignment('');
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsDisplayed();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkSpinnerIsNotDisplayed();

            //verifica si taskul in sine daca apare si ca celalat nu apare eventual: //tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsDisplayedByName(createdTask.entry.name);
            tasksCloudDemoPage.taskListCloudComponent().getAllRowsByColumn('ProcessDefinitionId').then(function (list) {
                expect (list.every(elem => elem == processDefinition.list.entries[0].entry.id)).toEqual(true);
            });
        });

        it('[C297682] Should be able to see No tasks found when typing an invalid processDefinitionId', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setProcessDefinitionId('invalidTaskId');

            expect(tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

    });

});
