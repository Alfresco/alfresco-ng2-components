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

import {
    TasksService, QueryService, ProcessDefinitionsService, ProcessInstancesService,
    LoginSSOPage, ApiService, SettingsPage, IdentityService, GroupIdentityService, Widget, NotificationHistoryPage, TaskHeaderCloudPage, TaskFormCloudComponent
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import resources = require('../../util/resources');
import { browser } from 'protractor';

describe('Form Field Component - Dropdown Widget',  () => {
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const notificationHistoryPage = new NotificationHistoryPage();
    const settingsPage = new SettingsPage();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const widget = new Widget();
    const dropdown = widget.dropdown();
    const apiService = new ApiService(
        browser.params.config.oauth2.clientId,
        browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
    );

    let tasksService: TasksService;
    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;
    let processDefinitionService: ProcessDefinitionsService;
    let processInstancesService: ProcessInstancesService;
    let queryService: QueryService;

    let runningProcessInstance, testUser, groupInfo, tasklist, task;
    const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;

    beforeAll(async (done) => {

        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER]);

        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.email, testUser.password);

        processDefinitionService = new ProcessDefinitionsService(apiService);
        const processDefinition = await processDefinitionService
            .getProcessDefinitionByName(resources.ACTIVITI7_APPS.SIMPLE_APP.processes.dropdownrestprocess, simpleApp);

        processInstancesService = new ProcessInstancesService(apiService);
        await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);

        runningProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
        queryService = new QueryService(apiService);

        await browser.driver.sleep(4000); // eventual consistency query
        tasklist = await queryService.getProcessInstanceTasks(runningProcessInstance.entry.id, simpleApp);
        task = await tasklist.list.entries[0];
        tasksService = new TasksService(apiService);
        await tasksService.claimTask(task.entry.id, simpleApp);

        await settingsPage.setProviderBpmSso(
            browser.params.config.bpmHost,
            browser.params.config.oauth2.host,
            browser.params.config.identityHost);
        loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
        done();
    });

    afterAll(async (done) => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await identityService.deleteIdentityUser(testUser.idIdentityService);
        done();
    });

    beforeEach(() => {
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        appListCloudComponent.goToApp(simpleApp);

        identityService.deleteIdentityUser(testUser.idIdentityService);
    });

    it('[C290069] Should be able to read rest service dropdown options, save and complete the task form', async () => {
        tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(task.entry.name);
        tasksCloudDemoPage.taskListCloudComponent().selectRow(task.entry.name);
        taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
        taskFormCloudComponent.formFields().checkFormIsDisplayed();
        taskFormCloudComponent.formFields().checkWidgetIsVisible('Dropdown097maj');
        dropdown.selectOption('Clementine Bauch', 'dropdown-cloud-widget mat-select');
        expect(dropdown.getSelectedOptionText('Dropdown097maj')).toBe('Clementine Bauch');
        taskFormCloudComponent.checkSaveButtonIsDisplayed().clickSaveButton();
        expect(dropdown.getSelectedOptionText('Dropdown097maj')).toBe('Clementine Bauch');
        taskFormCloudComponent.checkCompleteButtonIsDisplayed().clickCompleteButton();
        expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(task.entry.name);
        notificationHistoryPage.checkNotifyContains('Task has been saved successfully');

        tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
        tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(task.entry.name);
        tasksCloudDemoPage.taskListCloudComponent().selectRow(task.entry.name);
        taskFormCloudComponent.formFields().checkFormIsDisplayed();
        taskFormCloudComponent.formFields().checkWidgetIsVisible('Dropdown097maj');
        expect(dropdown.getSelectedOptionText('Dropdown097maj')).toBe('Clementine Bauch');
        taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
    });

});
