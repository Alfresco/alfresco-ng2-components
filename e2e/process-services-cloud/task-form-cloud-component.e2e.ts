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

import { browser, protractor } from 'protractor';
import {
    ApiService,
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
    FormCloudService
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import { TasksCloudDemoPage } from './pages/tasks-cloud-demo.page';

describe('Task form cloud component', () => {

    const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const simpleAppProcess = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes;
    const simpleAppForm = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.forms;

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const widget = new ProcessCloudWidgetPage();

    const apiService = new ApiService();
    const tasksService = new TasksService(apiService);
    const queryService = new QueryService(apiService);
    const processDefinitionService = new ProcessDefinitionsService(apiService);
    const processInstancesService = new ProcessInstancesService(apiService);
    const formCloudService = new FormCloudService(apiService);

    let completedTask, createdTask, assigneeTask, toBeCompletedTask, formValidationsTask, formTaskId, assigneeTaskId, assigneeReleaseTask, candidateUsersTask ;
    const completedTaskName = StringUtil.generateRandomString(), assignedTaskName = StringUtil.generateRandomString();

    let dateTimerTaskId;
    let dateTimerTask;
    let dateTimerChangedTaskId, dateTimerChangedTask;
    let dropdownOptionsTask;

    beforeAll(async () => {
        await apiService.login(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);

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
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.candidateUserProcess, candidateBaseApp);

        const candidateUsersProcessInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp);

        const processInstanceTasks = await queryService.getProcessInstanceTasks(candidateUsersProcessInstance.entry.id, candidateBaseApp);
        candidateUsersTask = processInstanceTasks.list.entries[0];
        await tasksService.claimTask(candidateUsersTask.entry.id, candidateBaseApp);

        processDefinition = await processDefinitionService
            .getProcessDefinitionByName(simpleAppProcess.dropdownrestprocess, simpleApp);
        const formProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
        const formTasks = await queryService.getProcessInstanceTasks(formProcess.entry.id, simpleApp);
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

        await loginSSOPage.login(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);

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
        await appListCloudComponent.goToApp(simpleApp);
        await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
        await expect(tasksCloudDemoPage.taskFilterCloudComponent.getActiveFilterName()).toBe('My Tasks');
        await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CREATED');

        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(formTaskId);
        await tasksCloudDemoPage.taskListCloudComponent().selectRowByTaskId(formTaskId);

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
        await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('completed-tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(formTaskId);
        await tasksCloudDemoPage.taskListCloudComponent().selectRowByTaskId(formTaskId);

        await taskFormCloudComponent.checkFormIsReadOnly();
        await taskFormCloudComponent.checkClaimButtonIsNotDisplayed();
        await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        await taskFormCloudComponent.checkReleaseButtonIsNotDisplayed();
        await taskFormCloudComponent.checkCancelButtonIsDisplayed();
    });

    it('[C306872] Should not be able to Release a process task which has only assignee', async () => {
        await appListCloudComponent.goToApp(simpleApp);
        await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(assigneeTaskId);
        await tasksCloudDemoPage.taskListCloudComponent().selectRowByTaskId(assigneeTaskId);

        await expect(await taskHeaderCloudPage.getAssignee()).toEqual(assigneeReleaseTask.list.entries[0].entry.assignee);
        await expect(await taskHeaderCloudPage.getStatus()).toEqual('ASSIGNED');
        await taskFormCloudComponent.checkReleaseButtonIsNotDisplayed();
    });

    it('[C310200] Should be able to save a task form', async () => {
        await appListCloudComponent.goToApp(simpleApp);
        await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');

        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(dropdownOptionsTask.entry.name);
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(dropdownOptionsTask.entry.name);
        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

        await widget.dropdown().isWidgetVisible('DropdownOptions');
        await widget.dropdown().openDropdown('#DropdownOptions');
        await widget.dropdown().selectOption('option1', '#DropdownOptions' );

        await taskFormCloudComponent.checkSaveButtonIsDisplayed();
        await taskFormCloudComponent.clickSaveButton();

        await navigationBarPage.clickHomeButton();
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(simpleApp);
        await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(dropdownOptionsTask.entry.name);
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(dropdownOptionsTask.entry.name);
        await widget.dropdown().isWidgetVisible('DropdownOptions');

        await expect(await widget.dropdown().getSelectedOptionText('DropdownOptions')).toBe('option1');
    });

    it('[C313200] Should be able to complete a Task form with process date variable mapped to a Date widget in the form', async () => {
        await appListCloudComponent.goToApp(simpleApp);
        await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(dateTimerTaskId);
        await tasksCloudDemoPage.taskListCloudComponent().selectRowByTaskId(dateTimerTaskId);

        await widget.dateWidget().checkWidgetIsVisible('Date0rzbb6');
        await expect(await widget.dateWidget().getDateInput('Date0rzbb6')).toBe('2020-07-09');

        await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
        await taskFormCloudComponent.clickCompleteButton();

        await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('completed-tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(dateTimerTaskId);
        await tasksCloudDemoPage.taskListCloudComponent().selectRowByTaskId(dateTimerTaskId);
        await taskFormCloudComponent.checkFormIsReadOnly();
        await expect(await widget.dateWidget().getDateInput('Date0rzbb6')).toBe('2020-07-09');
        await taskFormCloudComponent.clickCancelButton();

        await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(dateTimerChangedTaskId);
        await tasksCloudDemoPage.taskListCloudComponent().selectRowByTaskId(dateTimerChangedTaskId);

        await widget.dateWidget().checkWidgetIsVisible('Date0rzbb6');
        await expect(await widget.dateWidget().getDateInput('Date0rzbb6')).toBe('2020-07-09');

        await widget.dateWidget().clearDateInput('Date0rzbb6');
        await widget.dateWidget().setDateInput('Date0rzbb6', '2020-07-10' );
        await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
        await taskFormCloudComponent.clickCompleteButton();

        await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('completed-tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(dateTimerChangedTaskId);
        await tasksCloudDemoPage.taskListCloudComponent().selectRowByTaskId(dateTimerChangedTaskId);
        await taskFormCloudComponent.checkFormIsReadOnly();
        await expect(await widget.dateWidget().getDateInput('Date0rzbb6')).toBe('2020-07-10');
    });

    describe('Candidate Base App', () => {
        beforeEach(async () => {
            await appListCloudComponent.goToApp(candidateBaseApp);
        });

        it('[C307032] Should display the appropriate title for the unclaim option of a Task', async () => {
            await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(candidateUsersTask.entry.id);
            await tasksCloudDemoPage.taskListCloudComponent().selectRowByTaskId(candidateUsersTask.entry.id);
            await expect(await taskFormCloudComponent.getReleaseButtonText()).toBe('RELEASE');
        });

        it('[C310142] Empty content is displayed when having a task without form', async () => {
            await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assigneeTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(assigneeTask.entry.name);
            await taskFormCloudComponent.checkFormIsNotDisplayed();
            await expect(await taskFormCloudComponent.getFormTitle()).toBe(assigneeTask.entry.name);
            await taskFormCloudComponent.checkFormContentIsEmpty();
            await expect(await taskFormCloudComponent.getEmptyFormContentTitle()).toBe(`No form available`);
            await expect(await taskFormCloudComponent.getEmptyFormContentSubtitle()).toBe(`Attach a form that can be viewed later`);
        });

        it('[C310199] Should not be able to complete a task when required field is empty or invalid data is added to a field', async () => {
            await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(formValidationsTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(formValidationsTask.entry.name);
            await taskFormCloudComponent.checkFormIsDisplayed();
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
            await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('completed-tasks');
            await expect(await tasksCloudDemoPage.taskFilterCloudComponent.getActiveFilterName()).toBe('Completed Tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(completedTaskName);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
            await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        });

        it('[C307095] Task can not be completed by owner user', async () => {
            await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
            await expect(await tasksCloudDemoPage.taskFilterCloudComponent.getActiveFilterName()).toBe('My Tasks');
            await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();

            await browser.driver.sleep(1000);

            await tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee();
            await tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CREATED');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(createdTask.entry.name);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
            await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        });

        it('[C307110] Task list is displayed after clicking on Cancel button', async () => {
            await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
            await expect(await tasksCloudDemoPage.taskFilterCloudComponent.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assigneeTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(assigneeTask.entry.name);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
            await taskFormCloudComponent.clickCancelButton();

            await expect(await tasksCloudDemoPage.taskFilterCloudComponent.getActiveFilterName()).toBe('My Tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assigneeTask.entry.name);
        });

        it('[C307094] Standalone Task can be completed by a user that is owner and assignee', async () => {
            await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
            await expect(await tasksCloudDemoPage.taskFilterCloudComponent.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(toBeCompletedTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(toBeCompletedTask.entry.name);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
            await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
            await taskFormCloudComponent.clickCompleteButton();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(toBeCompletedTask.entry.name);

            await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('completed-tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(toBeCompletedTask.entry.name);
            await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        });

        it('[C307111] Task of a process can be completed by a user that is owner and assignee', async () => {
            await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('my-tasks');
            await expect(await tasksCloudDemoPage.taskFilterCloudComponent.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(completedTask.entry.name);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
            await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
            await taskFormCloudComponent.clickCompleteButton();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTask.entry.name);

            await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('completed-tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTask.entry.name);
            await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        });
    });
});
