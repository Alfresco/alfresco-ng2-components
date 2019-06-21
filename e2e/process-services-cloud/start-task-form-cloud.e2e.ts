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

import { browser } from 'protractor';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import {
    LoginSSOPage,
    AppListCloudPage,
    StringUtil,
    StartTasksCloudPage,
    ApiService,
    IdentityService,
    SettingsPage,
    GroupIdentityService,
    TaskFormCloudComponent,
    Widget, LocalStorageUtil, StartProcessCloudPage, TaskHeaderCloudPage, ProcessHeaderCloudPage, TasksService
} from '@alfresco/adf-testing';
import resources = require('../util/resources');
import { StartProcessCloudConfiguration } from './config/start-process-cloud.config';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { ProcessDetailsCloudDemoPage } from '../pages/adf/demo-shell/process-services-cloud/processDetailsCloudDemoPage';

describe('Start Task Form', () => {

    const loginSSOPage = new LoginSSOPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const startTask = new StartTasksCloudPage();
    const processDetailsCloudDemoPage = new ProcessDetailsCloudDemoPage();
    const settingsPage = new SettingsPage();
    const widget = new Widget();
    const startProcessPage = new StartProcessCloudPage();
    const processCloudDemoPage = new ProcessCloudDemoPage();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const processHeaderCloud = new ProcessHeaderCloudPage();
    const apiService = new ApiService(
        browser.params.config.oauth2.clientId,
        browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
    );
    const startProcessCloudConfiguration = new StartProcessCloudConfiguration();
    const startProcessCloudConfig = startProcessCloudConfiguration.getConfiguration();

    const standaloneTaskName = StringUtil.generateRandomString(5);
    const startEventFormProcess = StringUtil.generateRandomString(5);
    let testUser, groupInfo, processId, taskId;
    const candidateBaseApp = resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.name;

    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;

    beforeAll(async (done) => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.roles.aps_user]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.email, testUser.password);

        await settingsPage.setProviderBpmSso(
            browser.params.config.bpmHost,
            browser.params.config.oauth2.host,
            browser.params.config.identityHost);
        loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
        await LocalStorageUtil.setConfigField('adf-cloud-start-process', JSON.stringify(startProcessCloudConfig));
        done();
    });

    afterAll(async (done) => {
        try {
            await apiService.login(testUser.email, testUser.password);
            const tasksService = new TasksService(apiService);
            const taskID = await tasksService.getTaskId(standaloneTaskName, candidateBaseApp);
            await tasksService.deleteTask(taskID, candidateBaseApp);
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);
        } catch (error) {
        }
        done();
    });

    describe('StandaloneTask with form', () => {

        beforeEach(() => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.checkAppIsDisplayed(candidateBaseApp);
            appListCloudComponent.goToApp(candidateBaseApp);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        });

        it('[C307976] Should be able to start and save a task with a form', () => {
            tasksCloudDemoPage.openNewTaskForm();
            startTask.checkFormIsDisplayed();
            startTask.addName(standaloneTaskName);
            startTask.selectFormDefinition('StartEventForm');
            startTask.clickStartButton();
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(standaloneTaskName);
            tasksCloudDemoPage.taskListCloudComponent().selectRow(standaloneTaskName);
            taskFormCloudComponent.formFields().checkFormIsDisplayed();
            taskFormCloudComponent.formFields().checkWidgetIsVisible('FirstName');
            taskFormCloudComponent.formFields().checkWidgetIsVisible('Number07vyx9');
            widget.textWidget().setValue('FirstName', 'sample');
            widget.numberWidget().setFieldValue('Number07vyx9', 26);
            taskFormCloudComponent.checkSaveButtonIsDisplayed().clickSaveButton();
            expect(widget.textWidget().getFieldValue('FirstName')).toBe('sample');
            expect(widget.numberWidget().getFieldValue('Number07vyx9')).toBe('26');

            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.checkAppIsDisplayed(candidateBaseApp);
            appListCloudComponent.goToApp(candidateBaseApp);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(standaloneTaskName);
            tasksCloudDemoPage.taskListCloudComponent().selectRow(standaloneTaskName);
            taskFormCloudComponent.formFields().checkFormIsDisplayed();
            expect(widget.textWidget().getFieldValue('FirstName')).toBe('sample');
            expect(widget.numberWidget().getFieldValue('Number07vyx9')).toBe('26');
            taskFormCloudComponent.checkCompleteButtonIsDisplayed();
        });

    });

    describe('Start a process with a start event form', () => {

        beforeEach(() => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.checkAppIsDisplayed(candidateBaseApp);
            appListCloudComponent.goToApp(candidateBaseApp);
            processCloudDemoPage.openNewProcessForm();
            startProcessPage.clearField(startProcessPage.processNameInput);
            startProcessPage.enterProcessName(startEventFormProcess);
            startProcessPage.selectFromProcessDropdown('processwithstarteventform');
            startProcessPage.formFields().checkFormIsDisplayed();
        });
        it('[C311277] Should be able to start a process with a start event form - default values', async () => {

            expect(widget.textWidget().getFieldValue('FirstName')).toBe('sample name');
            expect(widget.numberWidget().getFieldValue('Number07vyx9')).toBe('17');
        });

        it('[C311277] Should be able to start a process with a start event form - form validation', async () => {

            expect(widget.textWidget().getErrorMessage('FirstName')).toBe('Enter no more than 10 characters');
            expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);

            widget.textWidget().setValue('FirstName', 'Sam');
            expect(widget.textWidget().getErrorMessage('FirstName')).toBe('Enter at least 5 characters');
            expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);
            widget.numberWidget().setFieldValue('Number07vyx9', 9);
            expect(widget.numberWidget().getErrorMessage('Number07vyx9')).toBe('Can\'t be less than 10');
            expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);
            widget.numberWidget().setFieldValue('Number07vyx9', 99999);
            expect(widget.numberWidget().getErrorMessage('Number07vyx9')).toBe('Can\'t be greater than 1,000');
            expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);
        });

        it('[C311277] Should be able to start a process with a start event form - claim and complete the process', async () => {

            widget.textWidget().setValue('FirstName', 'Sample');
            widget.numberWidget().setFieldValue('Number07vyx9', 100);
            expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(true);
            startProcessPage.clickStartProcessButton();
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('processName', startEventFormProcess);
            processCloudDemoPage.processListCloudComponent().checkProcessListIsLoaded();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(startEventFormProcess);

            processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', startEventFormProcess);
            processDetailsCloudDemoPage.checkTaskIsDisplayed('StartEventFormTask');
            processId = await processHeaderCloud.getId();
            processDetailsCloudDemoPage.selectProcessTaskByName('StartEventFormTask');
            taskFormCloudComponent.clickClaimButton();
            taskId = await taskHeaderCloudPage.getId();
            taskFormCloudComponent.checkCompleteButtonIsDisplayed().clickCompleteButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedById(taskId);

            tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(taskId);
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.completedProcessesFilter().clickProcessFilter();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(processId);

        });

    });
});
