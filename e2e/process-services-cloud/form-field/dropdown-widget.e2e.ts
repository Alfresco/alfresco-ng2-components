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

import { createApiService, AppListCloudPage, GroupIdentityService, IdentityService,
    LoginPage, NotificationHistoryPage, ProcessCloudWidgetPage, ProcessDefinitionsService,
    ProcessInstancesService, QueryService, TaskFormCloudComponent, TaskHeaderCloudPage,
    TasksService
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { TasksCloudDemoPage } from '.././pages/tasks-cloud-demo.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('Form Field Component - Dropdown Widget', () => {

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();

    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const taskFilter = tasksCloudDemoPage.taskFilterCloudComponent;
    const taskList = tasksCloudDemoPage.taskListCloudComponent();

    const taskFormCloudComponent = new TaskFormCloudComponent();
    const notificationHistoryPage = new NotificationHistoryPage();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const widget = new ProcessCloudWidgetPage();

    const apiService = createApiService();
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);
    const processDefinitionService = new ProcessDefinitionsService(apiService);
    const processInstancesService = new ProcessInstancesService(apiService);
    const queryService = new QueryService(apiService);
    const tasksService = new TasksService(apiService);

    const dropdown = widget.dropdown();

    let runningProcessInstance, runningProcessInstanceMultiselect, testUser, groupInfo, tasklist, tasklistMulti, taskMulti, task;
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    beforeAll(async () => {
        const { processes } = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP;
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);

        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.username, testUser.password);

        const processDefinition = await processDefinitionService.getProcessDefinitionByName(processes.dropdownOptionsProcess, simpleApp);
        const processDefinitionMultiselect = await processDefinitionService.getProcessDefinitionByName(processes['multiselect-dropdown'], simpleApp);

        await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
        await processInstancesService.createProcessInstance(processDefinitionMultiselect.entry.key, simpleApp);
        runningProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
        runningProcessInstanceMultiselect = await processInstancesService.createProcessInstance(processDefinitionMultiselect.entry.key, simpleApp);

        tasklist = await queryService.getProcessInstanceTasks(runningProcessInstance.entry.id, simpleApp);
        task = await tasklist.list.entries[0];
        tasklistMulti = await queryService.getProcessInstanceTasks(runningProcessInstanceMultiselect.entry.id, simpleApp);
        taskMulti = await tasklistMulti.list.entries[0];
        await tasksService.claimTask(task.entry.id, simpleApp);
        await tasksService.claimTask(taskMulti.entry.id, simpleApp);

        await loginSSOPage.login(testUser.username, testUser.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('identityAdmin');
        await identityService.deleteIdentityUser(testUser.idIdentityService);
   });

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(simpleApp);
    });

    it('Should be able to finish task with mulitselect dropdown form field', async () => {
        const optionsToSelect = ['First', 'Third'];
        await taskFilter.clickTaskFilter('my-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(taskMulti.entry.name);
        await taskList.selectRow(taskMulti.entry.name);

        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
        await dropdown.openDropdown('#DropdownMultiselect');
        await dropdown.selectMultipleOptions(optionsToSelect);
        await dropdown.closeDropdown();

        const optionsSelected = [await dropdown.getSelectedOptionText('DropdownMultiselect')];

        await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
        await taskFormCloudComponent.clickCompleteButton();
        await taskFilter.clickTaskFilter('completed-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(taskMulti.entry.name);
        await taskList.selectRow(taskMulti.entry.name);

        await taskFormCloudComponent.formFields().checkFormIsDisplayed();
        await taskFormCloudComponent.formFields().checkWidgetIsVisible('DropdownMultiselect');

        optionsSelected.push(await dropdown.getSelectedOptionText('DropdownMultiselect'));

        await expect(optionsSelected.toString().replace(/\s+/g, '')).toEqual([optionsToSelect, optionsToSelect].toString());
    });

    it('[C309878] Should be able to select a dropdown option, save and complete the task form', async () => {
        await taskFilter.clickTaskFilter('my-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(task.entry.name);
        await taskList.selectRow(task.entry.name);

        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

        await taskFormCloudComponent.formFields().checkFormIsDisplayed();
        await taskFormCloudComponent.formFields().checkWidgetIsVisible('DropdownOptions');
        await dropdown.selectOption('option2', 'dropdown-cloud-widget mat-select');

        await expect(await dropdown.getSelectedOptionText('DropdownOptions')).toBe('option2');

        await taskFormCloudComponent.checkSaveButtonIsDisplayed();
        await taskFormCloudComponent.clickSaveButton();

        await expect(await dropdown.getSelectedOptionText('DropdownOptions')).toBe('option2');

        await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
        await taskFormCloudComponent.clickCompleteButton();

        await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');

        await taskList.checkContentIsNotDisplayedByName(task.entry.name);
        await notificationHistoryPage.checkNotifyContains('Task has been saved successfully');

        await taskFilter.clickTaskFilter('completed-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(task.entry.name);
        await taskList.selectRow(task.entry.name);

        await taskFormCloudComponent.formFields().checkFormIsDisplayed();
        await taskFormCloudComponent.formFields().checkWidgetIsVisible('DropdownOptions');

        await expect(await dropdown.getSelectedOptionText('DropdownOptions')).toBe('option2');

        await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
    });
});
