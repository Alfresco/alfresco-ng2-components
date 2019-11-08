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
    AppListCloudPage,
    StringUtil,
    ApiService,
    LoginSSOPage,
    TasksService,
    ProcessDefinitionsService,
    ProcessInstancesService,
    TaskHeaderCloudPage,
    TaskFormCloudComponent,
    Widget, IdentityService, GroupIdentityService, QueryService
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { FormCloudService } from '../../lib/testing/src/lib/form-cloud/actions/form-cloud.service';

describe('Task form cloud component', () => {

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const widget = new Widget();
    const formToTestValidationsKey = 'form-49904910-603c-48e9-8c8c-1d442c0fa524';

    let tasksService: TasksService;
    let processDefinitionService: ProcessDefinitionsService;
    let processInstancesService: ProcessInstancesService;
    let identityService: IdentityService;

    let completedTask, createdTask, assigneeTask, toBeCompletedTask, formValidationsTask, testUser, formTaskId;
    const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const completedTaskName = StringUtil.generateRandomString(), assignedTaskName = StringUtil.generateRandomString();
    const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers);
    const apiServiceHrUser = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers);

    const visibilityConditionTasks = [];

    const tab = {
        tabWithFields: 'tabWithFields',
        tabFieldValue: 'tabBasicFieldValue',
        tabVarValue: 'tabBasicVarValue',
        tabVarField: 'tabBasicVarField',
        tabFieldField: 'tabBasicFieldField',
        tabVarVar: 'tabBasicVarVar',
        tabFieldVar: 'tabBasicFieldVar',
        tabNextOperators: 'tabNextOperators'
    };

    const widgets = {
        textOneId: 'TextOne',
        textTwoId: 'TextTwo',
        textThreeId: 'TextThree',
        textFourId: 'TextFour',
        numberOneId: 'NumberOne'
    };

    const value = {
        displayTab: 'showTab',
        notDisplayTab: 'anythingElse'
    };

    beforeAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

        identityService = new IdentityService(apiService);
        const groupIdentityService = new GroupIdentityService(apiService);

        await apiServiceHrUser.login(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);
        const formCloudService = new FormCloudService(apiServiceHrUser);

        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);

        const groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.email, testUser.password);

        tasksService = new TasksService(apiServiceHrUser);
        const queryService = new QueryService(apiServiceHrUser);
        createdTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), candidateBaseApp);

        assigneeTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), candidateBaseApp);
        await tasksService.claimTask(assigneeTask.entry.id, candidateBaseApp);

        const tabVisibilityFieldsId = await formCloudService.getIdByFormName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name, browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.forms.tabVisibilityFields.name);

        const tabVisibilityVarsId = await formCloudService.getIdByFormName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name, browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.forms.tabVisibilityVars.name);

        for (let i = 0; i < 3; i++) {
            visibilityConditionTasks[i] = await tasksService.createStandaloneTaskWithForm(StringUtil.generateRandomString(),
                simpleApp, tabVisibilityFieldsId);
            await tasksService.claimTask(visibilityConditionTasks[i].entry.id, simpleApp);
        }

        for (let i = 3; i < 6; i++) {
            visibilityConditionTasks[i] = await tasksService.createStandaloneTaskWithForm(StringUtil.generateRandomString(),
                simpleApp, tabVisibilityVarsId);
            await tasksService.claimTask(visibilityConditionTasks[i].entry.id, simpleApp);
        }

        formValidationsTask = await tasksService.createStandaloneTaskWithForm(StringUtil.generateRandomString(), candidateBaseApp, formToTestValidationsKey);
        await tasksService.claimTask(formValidationsTask.entry.id, candidateBaseApp);

        toBeCompletedTask = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), candidateBaseApp);
        await tasksService.claimTask(toBeCompletedTask.entry.id, candidateBaseApp);

        completedTask = await tasksService.createStandaloneTask(assignedTaskName, candidateBaseApp);
        await tasksService.claimTask(completedTask.entry.id, candidateBaseApp);
        await tasksService.createAndCompleteTask(completedTaskName, candidateBaseApp);

        processDefinitionService = new ProcessDefinitionsService(apiServiceHrUser);

        let processDefinition = await processDefinitionService
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.candidateUserProcess, candidateBaseApp);

        processInstancesService = new ProcessInstancesService(apiServiceHrUser);
        await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp);

        processDefinition = await processDefinitionService.getProcessDefinitionByName('dropdownrestprocess', simpleApp);
        const formProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp);
        const formTasks = await queryService.getProcessInstanceTasks(formProcess.entry.id, simpleApp);
        formTaskId = formTasks.list.entries[0].entry.id;

        await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);

    }, 5 * 60 * 1000);

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
    });

    afterAll(async () => {
        try {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);
        } catch (error) {
        }
        await browser.executeScript('window.sessionStorage.clear();');
        await browser.executeScript('window.localStorage.clear();');
    });

    it('[C310366] Should refresh buttons and form after an action is complete', async () => {
        await appListCloudComponent.goToApp(simpleApp);
        await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        await expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
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
        await tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(formTaskId);
        await tasksCloudDemoPage.taskListCloudComponent().selectRowByTaskId(formTaskId);

        await taskFormCloudComponent.checkFormIsReadOnly();
        await taskFormCloudComponent.checkClaimButtonIsNotDisplayed();
        await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        await taskFormCloudComponent.checkReleaseButtonIsNotDisplayed();
        await taskFormCloudComponent.checkCancelButtonIsDisplayed();
    });

    describe('Candidate Base App', () => {

        beforeEach(async () => {
            await appListCloudComponent.goToApp(candidateBaseApp);
        });

        it('[C307032] Should display the appropriate title for the unclaim option of a Task', async () => {
            await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assigneeTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(assigneeTask.entry.name);
            await expect(await taskFormCloudComponent.getReleaseButtonText()).toBe('RELEASE');
        });

        it('[C310142] Empty content is displayed when having a task without form', async () => {
            await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assigneeTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(assigneeTask.entry.name);
            await taskFormCloudComponent.checkFormIsNotDisplayed();
            await expect(await taskFormCloudComponent.getFormTitle()).toBe(assigneeTask.entry.name);
            await taskFormCloudComponent.checkFormContentIsEmpty();
            await expect(await taskFormCloudComponent.getEmptyFormContentTitle()).toBe(`No form available`);
            await expect(await taskFormCloudComponent.getEmptyFormContentSubtitle()).toBe(`Attach a form that can be viewed later`);
        });

        it('[C310199] Should not be able to complete a task when required field is empty or invalid data is added to a field', async () => {
            await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
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
            await tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('Completed Tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(completedTaskName);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
            await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        });

        it('[C307095] Task can not be completed by owner user', async () => {
            await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
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
            await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assigneeTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(assigneeTask.entry.name);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
            await taskFormCloudComponent.clickCancelButton();

            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assigneeTask.entry.name);
        });

        it('[C307094] Standalone Task can be completed by a user that is owner and assignee', async () => {
            await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(toBeCompletedTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(toBeCompletedTask.entry.name);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
            await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
            await taskFormCloudComponent.clickCompleteButton();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(toBeCompletedTask.entry.name);

            await tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(toBeCompletedTask.entry.name);
            await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        });

        it('[C307111] Task of a process can be completed by a user that is owner and assignee', async () => {
            await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTask.entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(completedTask.entry.name);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
            await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
            await taskFormCloudComponent.clickCompleteButton();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTask.entry.name);

            await tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTask.entry.name);
            await taskFormCloudComponent.checkCompleteButtonIsNotDisplayed();
        });
    });

    describe('Complete task with form - cloud directive', () => {

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.goToApp(simpleApp);
        });

        it('[C315174] Should be able to complete a standalone task with visible tab with empty value for field', async () => {
            await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(visibilityConditionTasks[0].entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(visibilityConditionTasks[0].entry.name);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldValue);
            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().isWidgetNotVisible(widgets.textTwoId);
            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldValue);

            await taskFormCloudComponent.clickCompleteButton();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(visibilityConditionTasks[0].entry.name);

            await tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(visibilityConditionTasks[0].entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(visibilityConditionTasks[0].entry.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldValue);
        });

        it('[C315177] Should be able to complete a standalone task with invisible tab with invalid value for field', async () => {
            await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(visibilityConditionTasks[1].entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(visibilityConditionTasks[1].entry.name);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);
            await widget.textWidget().isWidgetVisible(widgets.textOneId);

            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.textWidget().setValue(widgets.textThreeId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);
            await widget.tab().clickTabByLabel(tab.tabFieldField);
            await widget.textWidget().isWidgetVisible(widgets.numberOneId);
            await widget.textWidget().setValue(widgets.numberOneId, value.displayTab);

            await widget.tab().clickTabByLabel(tab.tabWithFields);
            await widget.textWidget().setValue(widgets.textOneId, value.notDisplayTab);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldField);

            await taskFormCloudComponent.clickCompleteButton();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(visibilityConditionTasks[1].entry.name);

            await tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(visibilityConditionTasks[1].entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(visibilityConditionTasks[1].entry.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldField);
        });

        it('[C315178] Should be able to complete a standalone task with invisible tab with valid value', async () => {
            await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(visibilityConditionTasks[2].entry.name);

            await tasksCloudDemoPage.taskListCloudComponent().selectRow(visibilityConditionTasks[2].entry.name);

            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldVar);
            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().isWidgetNotVisible(widgets.textFourId);

            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldVar);
            await widget.tab().clickTabByLabel(tab.tabFieldVar);
            await widget.textWidget().isWidgetVisible(widgets.textFourId);
            await widget.textWidget().setValue(widgets.textFourId, value.displayTab);

            await widget.tab().clickTabByLabel(tab.tabWithFields);
            await widget.textWidget().setValue(widgets.textOneId, value.notDisplayTab);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldVar);
            await taskFormCloudComponent.clickCompleteButton();

            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(visibilityConditionTasks[2].entry.name);

            await tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(visibilityConditionTasks[2].entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(visibilityConditionTasks[2].entry.name);

            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldVar);
        });

        it('[C315175] Should be able to complete a standalone task with invisible tab with empty value for field', async () => {
            await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(visibilityConditionTasks[3].entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(visibilityConditionTasks[3].entry.name);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabVarValue);
            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().isWidgetNotVisible(widgets.textTwoId);

            await taskFormCloudComponent.clickCompleteButton();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(visibilityConditionTasks[3].entry.name);

            await tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(visibilityConditionTasks[3].entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(visibilityConditionTasks[3].entry.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabVarValue);
        });

        it('[C315176] Should not be able to complete a standalone task with visible tab with invalid value for field', async () => {
            await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(visibilityConditionTasks[4].entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(visibilityConditionTasks[4].entry.name);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabVarField);
            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().isWidgetNotVisible(widgets.numberOneId);

            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabVarField);

            await widget.tab().clickTabByLabel(tab.tabVarField);
            await widget.textWidget().setValue(widgets.numberOneId, value.displayTab);

            await expect(await taskFormCloudComponent.isCompleteButtonEnabled()).toEqual(false);
        });

        it('[C315179] Should be able to complete a standalone task with visible tab with valid value for field', async () => {
            await tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');

            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(visibilityConditionTasks[5].entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(visibilityConditionTasks[5].entry.name);
            await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();

            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabVarVar);
            await widget.textWidget().isWidgetVisible(widgets.textOneId);

            await widget.tab().clickTabByLabel(tab.tabVarVar);
            await widget.textWidget().setValue(widgets.textThreeId, value.displayTab);

            await taskFormCloudComponent.clickCompleteButton();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(visibilityConditionTasks[5].entry.name);

            await tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(visibilityConditionTasks[5].entry.name);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(visibilityConditionTasks[5].entry.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabVarVar);
        });

    });

});
