/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

    let testUser: { idIdentityService: string; username: string; password: string };
    const runningTasks = {};
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    beforeAll(async () => {
        const { processes } = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP;
        let runningProcessInstance: Record<string, any>;
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);
        const groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.username, testUser.password);

        const processesData = ['dropdownOptionsProcess', 'multiselect-dropdown', 'dropdown-search'];

        for (const process of processesData) {
            const processDef = await processDefinitionService.getProcessDefinitionByName(processes[process], simpleApp);
            await processInstancesService.createProcessInstance(processDef.entry.key, simpleApp);
            runningProcessInstance = await processInstancesService.createProcessInstance(processDef.entry.key, simpleApp);
            const tasklist = await queryService.getProcessInstanceTasks(runningProcessInstance.entry.id, simpleApp);
            await tasksService.claimTask(tasklist.list.entries[0].entry.id, simpleApp);
            runningTasks[process] = tasklist.list.entries[0].entry;
        }

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

    it('[C601606] Should be able to finish task with multiselect dropdown form field', async () => {
        const optionsToSelect = ['First', 'Third'];
        const { name: multiselectTaskName } = runningTasks['multiselect-dropdown'];

        await taskFilter.clickTaskFilter('my-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(multiselectTaskName);
        await taskList.selectRow(multiselectTaskName);

        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
        await dropdown.openDropdown('#DropdownMultiselect');
        await dropdown.selectMultipleOptions(optionsToSelect);
        await dropdown.closeDropdownFor('DropdownMultiselect');

        const optionsSelected = [await dropdown.getSelectedOptionText('DropdownMultiselect')];

        await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
        await taskFormCloudComponent.clickCompleteButton();
        await taskFilter.clickTaskFilter('completed-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(multiselectTaskName);
        await taskList.selectRow(multiselectTaskName);

        await taskFormCloudComponent.formFields().checkFormIsDisplayed();
        await taskFormCloudComponent.formFields().checkWidgetIsVisible('DropdownMultiselect');

        optionsSelected.push(await dropdown.getSelectedOptionText('DropdownMultiselect'));

        await expect(optionsSelected.toString().replace(/\s+/g, '')).toEqual([optionsToSelect, optionsToSelect].toString());
    });

    it('[C309878] Should be able to select a dropdown option, save and complete the task form', async () => {
        const { name: dropdownOptionTaskName } = runningTasks['dropdownOptionsProcess'];
        await taskFilter.clickTaskFilter('my-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(dropdownOptionTaskName);
        await taskList.selectRow(dropdownOptionTaskName);

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

        await taskList.checkContentIsNotDisplayedByName(dropdownOptionTaskName);
        await notificationHistoryPage.checkNotifyContains('Task has been saved successfully');

        await taskFilter.clickTaskFilter('completed-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(dropdownOptionTaskName);
        await taskList.selectRow(dropdownOptionTaskName);

        await taskFormCloudComponent.formFields().checkFormIsDisplayed();
        await taskFormCloudComponent.formFields().checkWidgetIsVisible('DropdownOptions');

        await expect(await dropdown.getSelectedOptionText('DropdownOptions')).toBe('option2');

        await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
    });

    it('[C601606] Should be able to search and select multiple options from multiple choice dropdown', async () => {
        const { name: dropdownOptionTaskName } = runningTasks['dropdown-search'];
        const expectedOptions = ['Albania', 'Colombia', 'Italy', 'Poland', 'United Kingdom of Great Britain and Northern Ireland'];
        const dropdownId = 'DropdownCountriesMultiple';

        await taskFilter.clickTaskFilter('my-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(dropdownOptionTaskName);
        await taskList.selectRow(dropdownOptionTaskName);

        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

        await taskFormCloudComponent.formFields().checkFormIsDisplayed();
        await dropdown.openDropdown(`#${dropdownId}`);
        await dropdown.searchAndChooseOptionsFromList(...expectedOptions);
        await dropdown.closeDropdownFor(dropdownId);

        const actualSelectedOptions = await dropdown.getSelectedOptionText(dropdownId);
        await expect(actualSelectedOptions).toEqual(expectedOptions.join(', '));
    });

    it('[C601606] Should be able to search and select single options from the single choice dropdown', async () => {
        const { name: dropdownOptionTaskName } = runningTasks['dropdown-search'];
        const firstOption = 'Mauritius';
        const expectedOption = 'Namibia';
        const dropdownId = 'DropdownCountriesSingle';

        await taskFilter.clickTaskFilter('my-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(dropdownOptionTaskName);
        await taskList.selectRow(dropdownOptionTaskName);

        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

        await taskFormCloudComponent.formFields().checkFormIsDisplayed();
        await dropdown.openDropdown(`#${dropdownId}`);
        await dropdown.searchAndChooseOptionFromList(firstOption);
        await dropdown.openDropdown(`#${dropdownId}`);
        await dropdown.searchAndChooseOptionFromList(expectedOption);

        const actualSelectedOptions = await dropdown.getSelectedOptionText(dropdownId);
        await expect(actualSelectedOptions).toEqual(expectedOption);
    });

    it('[C601606] Should not be able to search if there is less than 6 options to choose', async () => {
        const { name: dropdownOptionTaskName } = runningTasks['dropdown-search'];
        const dropdownId = 'DropdownSingleFive';
        await taskFilter.clickTaskFilter('my-tasks');
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(dropdownOptionTaskName);
        await taskList.selectRow(dropdownOptionTaskName);

        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

        await taskFormCloudComponent.formFields().checkFormIsDisplayed();
        await dropdown.openDropdown(`#${dropdownId}`);

        const searchDropdownFieldIsPresent = await dropdown.searchElementLocator.isPresent(1000);
        await expect(searchDropdownFieldIsPresent).toBeFalsy();
    });
});
