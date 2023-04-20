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

import { browser, protractor } from 'protractor';
import { createApiService,
    AppListCloudPage,
    LoginPage,
    ProcessCloudWidgetPage,
    ProcessDefinitionsService,
    ProcessInstancesService,
    QueryService,
    StringUtil,
    TaskFormCloudComponent,
    TaskHeaderCloudPage,
    TasksService,
    FormCloudService,
    Logger
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';

describe('Task form cloud component', () => {

    const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;
    const candidateBaseAppProcesses = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes;
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const simpleAppProcess = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes;
    const simpleAppForm = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.forms;

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();

    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const editTaskFilter = tasksCloudDemoPage.editTaskFilterCloud;
    const taskFilter = tasksCloudDemoPage.taskFilterCloudComponent;
    const taskList = tasksCloudDemoPage.taskListCloudComponent();

    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const widget = new ProcessCloudWidgetPage();

    const apiService = createApiService();
    const tasksService = new TasksService(apiService);
    const queryService = new QueryService(apiService);
    const processDefinitionService = new ProcessDefinitionsService(apiService);
    const processInstancesService = new ProcessInstancesService(apiService);
    const formCloudService = new FormCloudService(apiService);

    const completedTaskName = StringUtil.generateRandomString(); const assignedTaskName = StringUtil.generateRandomString();
    const myTasksFilter = 'my-tasks';
    const completedTasksFilter = 'completed-tasks';
    const dateFieldId = 'Date0rzbb6';
    const defaultDate = '2020-07-09';
    const changedDate = '2020-07-10';
    const dropdownFieldId = 'DropdownOptions';

    let completedTask; let createdTask; let assigneeTask; let toBeCompletedTask; let formValidationsTask; let formTaskId; let assigneeTaskId; let assigneeReleaseTask; let candidateUsersTask ;
    let dateTimerTaskId; let dateTimerTask; let dateTimerChangedTaskId; let dateTimerChangedTask; let dropdownOptionsTask;

    beforeAll(async () => {
        try {
            await apiService.loginWithProfile('hrUser');
            createdTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), candidateBaseApp);

            assigneeTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), candidateBaseApp);
            await tasksService.claimTask(assigneeTask.entry.id, candidateBaseApp);

            const formToTestValidationsKey = await formCloudService.getIdByFormName(candidateBaseApp,
                    browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.forms.formtotestvalidations);

            formValidationsTask = await tasksService.createStandaloneTaskWithForm(StringUtil.generateRandomString(), candidateBaseApp, formToTestValidationsKey);
            await tasksService.claimTask(formValidationsTask.entry.id, candidateBaseApp);

            toBeCompletedTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), candidateBaseApp);
            await tasksService.claimTask(toBeCompletedTask.entry.id, candidateBaseApp);

            completedTask = await tasksService.createStandaloneTask(assignedTaskName, candidateBaseApp);
            await tasksService.claimTask(completedTask.entry.id, candidateBaseApp);
            await tasksService.createAndCompleteTask(completedTaskName, candidateBaseApp);

            let processDefinition = await processDefinitionService
                    .getProcessDefinitionByName(candidateBaseAppProcesses.candidateUserProcess, candidateBaseApp);

            const candidateUsersProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp);

            const processInstanceTasks = await queryService.getProcessInstanceTasks(candidateUsersProcessInstance.entry.id, candidateBaseApp);
            candidateUsersTask = processInstanceTasks.list.entries[0];
            await tasksService.claimTask(candidateUsersTask.entry.id, candidateBaseApp);

            processDefinition = await processDefinitionService
                    .getProcessDefinitionByName(candidateBaseAppProcesses.candidateUserProcess, candidateBaseApp);

            const formProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp);
            const formTasks = await queryService.getProcessInstanceTasks(formProcess.entry.id, candidateBaseApp);
            formTaskId = formTasks.list.entries[0].entry.id;

            const dropdownOptionsId = await formCloudService.getIdByFormName(simpleApp, simpleAppForm.dropdownWithOptions.name);
            dropdownOptionsTask = await tasksService.createStandaloneTaskWithForm(StringUtil.generateRandomString(),
                simpleApp, dropdownOptionsId);
            await tasksService.claimTask(dropdownOptionsTask.entry.id, simpleApp);

            const timerProcessDefinition = await processDefinitionService
                .getProcessDefinitionByName(simpleAppProcess.intermediateDateProcessVarTimer, simpleApp);
            const dateTimerProcess = await processInstancesService.createProcessInstance(timerProcessDefinition.entry.key, simpleApp);
            dateTimerTask = await queryService.getProcessInstanceTasks(dateTimerProcess.entry.id, simpleApp);
            dateTimerTaskId = dateTimerTask.list.entries[0].entry.id;

            const timerChangedProcessDefinition = await processDefinitionService
                .getProcessDefinitionByName(simpleAppProcess.intermediateDateProcessVarTimer, simpleApp);
            const dateTimerChangedProcess = await processInstancesService.createProcessInstance(timerChangedProcessDefinition.entry.key, simpleApp);
            dateTimerChangedTask = await queryService.getProcessInstanceTasks(dateTimerChangedProcess.entry.id, simpleApp);
            dateTimerChangedTaskId = dateTimerChangedTask.list.entries[0].entry.id;

            /* cspell: disable-next-line */
            const assigneeProcessDefinition = await processDefinitionService.getProcessDefinitionByName(simpleAppProcess.calledprocess, simpleApp);
            const assigneeProcess = await processInstancesService.createProcessInstance(assigneeProcessDefinition.entry.key, simpleApp);
            assigneeReleaseTask = await queryService.getProcessInstanceTasks(assigneeProcess.entry.id, simpleApp);
            assigneeTaskId = assigneeReleaseTask.list.entries[0].entry.id;

            await loginSSOPage.loginWithProfile('hrUser');
        } catch (error) {
            Logger.error('Error in beforeAll: ', error);
        }

    }, 5 * 60 * 1000);

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
    });

    afterAll(async () => {
        await browser.executeScript('window.sessionStorage.clear();');
        await browser.executeScript('window.localStorage.clear();');
    });

    it('[C310366] Should refresh buttons and form after an action is complete', async () => {
        await appListCloudComponent.goToApp(candidateBaseApp);
        await taskFilter.clickTaskFilter(myTasksFilter);
        await taskList.getDataTable().waitTillContentLoaded();

        await expect(taskFilter.getActiveFilterName()).toBe('My Tasks');
        await editTaskFilter.openFilter();
        await editTaskFilter.clearAssignee();
        await editTaskFilter.setStatusFilterDropDown('Created');

        await taskList.checkContentIsDisplayedById(formTaskId);
        await taskList.selectRowByTaskId(formTaskId);

        await taskFormCloudComponent.checkFormIsReadOnly();
        await taskFormCloudComponent.checkClaimButtonIsDisplayed();
        await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        await taskFormCloudComponent.checkReleaseButtonIsNotDisplayed();

        await taskFormCloudComponent.clickClaimButton();
        await taskFormCloudComponent.checkFormIsDisplayed();

        await taskFormCloudComponent.checkFormIsNotReadOnly();
        await taskFormCloudComponent.checkClaimButtonIsNotDisplayed();
        await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
        await taskFormCloudComponent.checkReleaseButtonIsDisplayed();

        await taskFormCloudComponent.clickCompleteButton();
        await openTaskByIdFromFilters(completedTasksFilter, formTaskId);

        await taskFormCloudComponent.checkFormIsReadOnly();
        await taskFormCloudComponent.checkClaimButtonIsNotDisplayed();
        await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        await taskFormCloudComponent.checkReleaseButtonIsNotDisplayed();
        await taskFormCloudComponent.checkCancelButtonIsDisplayed();
    });

    it('[C306872] Should not be able to Release a process task which has only assignee', async () => {
        await appListCloudComponent.goToApp(simpleApp);
        await openTaskByIdFromFilters(myTasksFilter, assigneeTaskId);

        await expect(await taskHeaderCloudPage.getAssignee()).toEqual(assigneeReleaseTask.list.entries[0].entry.assignee);
        await expect(await taskHeaderCloudPage.getStatus()).toEqual('ASSIGNED');
        await taskFormCloudComponent.checkReleaseButtonIsNotDisplayed();
    });

    it('[C310200] Should be able to save a task form', async () => {
        const selectedOption = 'option1';
        const dropdownId = '#DropdownOptions';

        await goToAppOpenDropdownTaskByNameFromFilters(myTasksFilter, dropdownOptionsTask.entry.name);
        await widget.dropdown().openDropdown(dropdownId);
        await widget.dropdown().selectOption(selectedOption, dropdownId );
        await taskFormCloudComponent.checkSaveButtonIsDisplayed();
        await taskFormCloudComponent.clickSaveButton();

        await navigationBarPage.clickHomeButton();
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await goToAppOpenDropdownTaskByNameFromFilters(myTasksFilter, dropdownOptionsTask.entry.name);

        await expect(await widget.dropdown().getSelectedOptionText(dropdownFieldId)).toBe(selectedOption);
    });

    it('[C313200] Should be able to complete a Task form with process date variable mapped to a Date widget in the form', async () => {
        await appListCloudComponent.goToApp(simpleApp);
        await openTaskByIdFromFilters(myTasksFilter, dateTimerTaskId);
        await verifyDateInput(dateFieldId, defaultDate);
        await completeTask();
        await verifyDateCompletedTask(dateTimerTaskId, defaultDate);

        await openTaskByIdFromFilters(myTasksFilter, dateTimerChangedTaskId );
        await verifyDateInput(dateFieldId, defaultDate);
        await widget.dateWidget().clearDateInput(dateFieldId);
        await widget.dateWidget().setDateInput(dateFieldId, changedDate );
        await completeTask();

        await verifyDateCompletedTask(dateTimerChangedTaskId, changedDate);
    });

    describe('Candidate Base App', () => {
        beforeEach(async () => {
            await appListCloudComponent.goToApp(candidateBaseApp);
        });

        it('[C307032] Should display the appropriate title for the unclaim option of a Task', async () => {
            await openTaskByIdFromFilters(myTasksFilter, candidateUsersTask.entry.id);
            await expect(await taskFormCloudComponent.getReleaseButtonText()).toBe('RELEASE');
        });

        it('[C310142] Empty content is displayed when having a task without form', async () => {
            await taskFilter.clickTaskFilter(myTasksFilter);
            await taskList.getDataTable().waitTillContentLoaded();

            await taskList.checkContentIsDisplayedByName(assigneeTask.entry.name);
            await taskList.selectRow(assigneeTask.entry.name);
            await taskFormCloudComponent.checkFormIsNotDisplayed();
            await expect(await taskFormCloudComponent.getFormTitle()).toBe(assigneeTask.entry.name);
            await taskFormCloudComponent.checkFormContentIsEmpty();
            await expect(await taskFormCloudComponent.getEmptyFormContentTitle()).toBe(`No form available`);
            await expect(await taskFormCloudComponent.getEmptyFormContentSubtitle()).toBe(`Attach a form that can be viewed later`);
        });

        it('[C310199] Should not be able to complete a task when required field is empty or invalid data is added to a field', async () => {
            await taskFilter.clickTaskFilter(myTasksFilter);
            await taskList.getDataTable().waitTillContentLoaded();

            await selectTaskByName(formValidationsTask.entry.name);
            await taskFormCloudComponent.formFields().checkFormIsDisplayed();
            await taskFormCloudComponent.formFields().checkWidgetIsVisible('Text0tma8h');
            await taskFormCloudComponent.formFields().checkWidgetIsVisible('Date0m1moq');
            await taskFormCloudComponent.formFields().checkWidgetIsVisible('Number0klykr');
            await taskFormCloudComponent.formFields().checkWidgetIsVisible('Amount0mtp1h');

            await expect(await taskFormCloudComponent.isCompleteButtonEnabled()).toBe(false);
            await widget.textWidget().setValue('Text0tma8h', 'Some random text');
            await expect(await taskFormCloudComponent.isCompleteButtonEnabled()).toBe(true);

            await widget.dateWidget().setDateInput('Date0m1moq', 'invalid date');
            await browser.actions().sendKeys(protractor.Key.ENTER).perform();
            await expect(await taskFormCloudComponent.isCompleteButtonEnabled()).toBe(false);

            await widget.dateWidget().setDateInput('Date0m1moq', '20-10-2018');
            await browser.actions().sendKeys(protractor.Key.ENTER).perform();
            await expect(await taskFormCloudComponent.isCompleteButtonEnabled()).toBe(true);

            await widget.numberWidget().setFieldValue('Number0klykr', 'invalid number');
            await expect(await taskFormCloudComponent.isCompleteButtonEnabled()).toBe(false);

            await widget.numberWidget().setFieldValue('Number0klykr', '26');
            await expect(await taskFormCloudComponent.isCompleteButtonEnabled()).toBe(true);

            await widget.amountWidget().setFieldValue('Amount0mtp1h', 'invalid amount');
            await expect(await taskFormCloudComponent.isCompleteButtonEnabled()).toBe(false);

            await widget.amountWidget().setFieldValue('Amount0mtp1h', '660');
            await expect(await taskFormCloudComponent.isCompleteButtonEnabled()).toBe(true);
        });

        it('[C307093] Complete button is not displayed when the task is already completed', async () => {
            await taskFilter.clickTaskFilter(completedTasksFilter);
            await taskList.getDataTable().waitTillContentLoaded();

            await expect(await taskFilter.getActiveFilterName()).toBe('Completed Tasks');
            await taskList.checkContentIsDisplayedByName(completedTaskName);
            await taskList.selectRow(completedTaskName);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
            await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        });

        it('[C307095] Task can not be completed by owner user', async () => {
            await taskFilter.clickTaskFilter(myTasksFilter);
            await taskList.getDataTable().waitTillContentLoaded();

            await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');
            await editTaskFilter.openFilter();

            await editTaskFilter.clearAssignee();
            await editTaskFilter.setStatusFilterDropDown('Created');

            await selectTaskByName(createdTask.entry.name);
            await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        });

        it('[C307110] Task list is displayed after clicking on Cancel button', async () => {
            await taskFilter.clickTaskFilter(myTasksFilter);
            await taskList.getDataTable().waitTillContentLoaded();

            await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');

            await selectTaskByName(assigneeTask.entry.name);
            await taskFormCloudComponent.clickCancelButton();

            await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');
            await taskList.checkContentIsDisplayedByName(assigneeTask.entry.name);
        });

        it('[C307094] Standalone Task can be completed by a user that is owner and assignee', async () => {
            await taskFilter.clickTaskFilter(myTasksFilter);
            await taskList.getDataTable().waitTillContentLoaded();

            await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');

            await selectTaskByName(toBeCompletedTask.entry.name);
            await completeTask();
            await taskList.checkContentIsNotDisplayedByName(toBeCompletedTask.entry.name);

            await taskFilter.clickTaskFilter(completedTasksFilter);
            await taskList.getDataTable().waitTillContentLoaded();

            await taskList.checkContentIsDisplayedByName(toBeCompletedTask.entry.name);
            await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        });

        it('[C307111] Task of a process can be completed by a user that is owner and assignee', async () => {
            await taskFilter.clickTaskFilter(myTasksFilter);
            await taskList.getDataTable().waitTillContentLoaded();

            await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');

            await selectTaskByName(completedTask.entry.name);
            await completeTask();
            await taskList.checkContentIsNotDisplayedByName(completedTask.entry.name);

            await taskFilter.clickTaskFilter(completedTasksFilter);
            await taskList.getDataTable().waitTillContentLoaded();

            await taskList.checkContentIsDisplayedByName(completedTask.entry.name);
            await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        });
    });

    async function openTaskByIdFromFilters(filterName: string, taskId: string): Promise<void> {
        await taskFilter.clickTaskFilter(filterName);
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedById(taskId);
        await taskList.selectRowByTaskId(taskId);
    }

    async function verifyDateInput(widgetId: string, input: string): Promise<void> {
        await widget.dateWidget().checkWidgetIsVisible(widgetId);
        await expect(await widget.dateWidget().getDateInput(widgetId)).toBe(input);
    }

    async function selectTaskByName(taskName: string): Promise<void> {
        await taskList.checkContentIsDisplayedByName(taskName);
        await taskList.selectRow(taskName);
        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
    }

    async function verifyDateCompletedTask(taskId: string, input: string): Promise<void> {
        await openTaskByIdFromFilters(completedTasksFilter, taskId );
        await taskFormCloudComponent.checkFormIsReadOnly();
        await verifyDateInput(dateFieldId, input);
        await taskFormCloudComponent.clickCancelButton();
    }

    async function goToAppOpenDropdownTaskByNameFromFilters(filterName: string, taskName: string): Promise<void> {
        await appListCloudComponent.goToApp(simpleApp);
        await taskFilter.clickTaskFilter(filterName);
        await taskList.getDataTable().waitTillContentLoaded();

        await taskList.checkContentIsDisplayedByName(taskName);
        await taskList.selectRow(taskName);
        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
        await widget.dropdown().isWidgetVisible(dropdownFieldId);
    }

    async function completeTask(): Promise<void> {
        await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
        await taskFormCloudComponent.clickCompleteButton();
    }
});
