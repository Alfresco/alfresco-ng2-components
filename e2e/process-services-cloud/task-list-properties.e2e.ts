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
        let createdTask, notDisplayedTask, processDefinition, processInstance;;

        beforeAll(async (done) => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginAPS(user, password);

            navigationBarPage.clickConfigEditorButton();
            configEditorPage.clickEditTaskConfiguration();
            configEditorPage.clickClearButton();
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
            notDisplayedTask = await tasksService.createStandaloneTask(Util.generateRandomString(), candidateUserApp);
            await tasksService.claimTask(notDisplayedTask.entry.id, candidateUserApp);

            await processDefinitionService.init(user, password);
            processDefinition = await processDefinitionService.getProcessDefinitions(simpleApp);
            await processInstancesService.init(user, password);
            processInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp);
            done();
        });

        beforeEach((done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader();
            done();
        });

        it('[C291895] Should be able to see only the tasks of a specific app when typing the exact app name in the appName field', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setAppNameDropDown(simpleApp);//.typeCurrentDate(currentDate);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getAppNameDropDownValue()).toEqual(simpleApp);

            //tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsDisplayedByName(createdTask.entry.name);
            //tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsNotDisplayedByName(notDisplayedTask.entry.name);
        });

        it('[C291905] Should be able to see only the tasks with specific name when typing the name in the task name field', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setTaskName(createdTask.entry.name);
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getTaskName()).toEqual(createdTask.entry.name);

            //tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkRowIsDisplayedByName(createdTask.entry.name);
            //expect(tasksCloudDemoPage.taskListCloudComponent().getDataTable().getNumberOfRowsDisplayedWithSameName(createdTask.entry.name)).toEqual(1);
        });

        it('[C280571] Should be able to see No tasks found when typing a task name that does not exist', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setTaskName('invalidName');
            expect(tasksCloudDemoPage.editTaskFilterCloudComponent().getTaskName()).toEqual('invalidName');

            expect(tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        fit('[C291908] Should be able to see only tasks that are part of a specific process when processDefinitionId is set', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setProcessDefinitionId(processDefinition.list.entries[0].entry.id);
            browser.driver.sleep(50000);

            expect(tasksCloudDemoPage.taskListCloudComponent().getDataTable().getAllDisplayedRows()).toBe(1);
            //taskListCloudDemoPage.getAllProcessDefinitionIds().then(function (list) {
            //    expect(Util.arrayContainsArray(list, [processDefinition.list.entries[0].entry.key])).toEqual(true);
            //});
        });

        it('[C291909] Should be able to see No tasks found when typing an invalid processDefinitionId', () => {
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            tasksCloudDemoPage.editTaskFilterCloudComponent().setProcessDefinitionId('invalidTaskId');

            expect(tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

    });

});
