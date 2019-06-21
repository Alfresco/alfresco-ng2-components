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
    TasksService,
    ApiService,
    IdentityService,
    SettingsPage,
    GroupIdentityService,
    TaskFormCloudComponent,
    Widget
} from '@alfresco/adf-testing';
import resources = require('../util/resources');

describe('Start Task', () => {

    const loginSSOPage = new LoginSSOPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const startTask = new StartTasksCloudPage();
    const settingsPage = new SettingsPage();
    const widget = new Widget();
    const apiService = new ApiService(
        browser.params.config.oauth2.clientId,
        browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
    );

    const standaloneTaskName = StringUtil.generateRandomString(5);
    let testUser, groupInfo;
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

    beforeEach(() => {
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        appListCloudComponent.checkAppIsDisplayed(candidateBaseApp);
        appListCloudComponent.goToApp(candidateBaseApp);
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
    });

    it('[C297675] Should create a task unassigned when assignee field is empty in Start Task form', () => {
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
