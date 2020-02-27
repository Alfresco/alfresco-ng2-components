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
    ApiService, AppListCloudPage, GroupIdentityService, IdentityService,
    LoginSSOPage, NotificationHistoryPage, ProcessCloudWidgetPage, ProcessDefinitionsService,
    ProcessInstancesService, QueryService, TaskFormCloudComponent, TaskHeaderCloudPage,
    TasksService
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { TasksCloudDemoPage } from '../../pages/adf/demo-shell/process-services/tasks-cloud-demo.page';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';

describe('Form Field Component - Dropdown Widget', () => {
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const notificationHistoryPage = new NotificationHistoryPage();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const widget = new ProcessCloudWidgetPage();
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
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    beforeAll(async () => {

        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);

        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.email, testUser.password);

        processDefinitionService = new ProcessDefinitionsService(apiService);
        const processDefinition = await processDefinitionService
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.dropdownrestprocess, simpleApp);

        processInstancesService = new ProcessInstancesService(apiService);
        await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);

        runningProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
        queryService = new QueryService(apiService);

        await browser.sleep(4000); // eventual consistency query
        tasklist = await queryService.getProcessInstanceTasks(runningProcessInstance.entry.id, simpleApp);
        task = await tasklist.list.entries[0];
        tasksService = new TasksService(apiService);
        await tasksService.claimTask(task.entry.id, simpleApp);

        await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
    });

    afterAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await identityService.deleteIdentityUser(testUser.idIdentityService);
   });

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(simpleApp);
    });

    it('[C290069] Should be able to read rest service dropdown options, save and complete the task form', async () => {
        await tasksCloudDemoPage.taskFilterCloudComponent.clickMyTasksFilter();
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(task.entry.name);
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(task.entry.name);
        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
        await taskFormCloudComponent.formFields().checkFormIsDisplayed();
        await taskFormCloudComponent.formFields().checkWidgetIsVisible('Dropdown097maj');
        await dropdown.selectOption('Clementine Bauch', 'dropdown-cloud-widget mat-select');
        await expect(await dropdown.getSelectedOptionText('Dropdown097maj')).toBe('Clementine Bauch');
        await taskFormCloudComponent.checkSaveButtonIsDisplayed();
        await taskFormCloudComponent.clickSaveButton();
        await expect(await dropdown.getSelectedOptionText('Dropdown097maj')).toBe('Clementine Bauch');
        await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
        await taskFormCloudComponent.clickCompleteButton();
        await expect(await tasksCloudDemoPage.taskFilterCloudComponent.getActiveFilterName()).toBe('My Tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(task.entry.name);
        await notificationHistoryPage.checkNotifyContains('Task has been saved successfully');

        await tasksCloudDemoPage.taskFilterCloudComponent.clickCompletedTasksFilter();
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(task.entry.name);
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(task.entry.name);
        await taskFormCloudComponent.formFields().checkFormIsDisplayed();
        await taskFormCloudComponent.formFields().checkWidgetIsVisible('Dropdown097maj');
        await expect(await dropdown.getSelectedOptionText('Dropdown097maj')).toBe('Clementine Bauch');
        await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
    });
});
