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

import { LoginPage, StringUtil, Widget, ApplicationService } from '@alfresco/adf-testing';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';
import { AppsActions } from '../actions/APS/apps.actions';
import { FormModelActions } from '../actions/APS/form-model.actions';
import { UsersActions } from '../actions/users.actions';
import { StandaloneTask } from '../models/APS/standalone-task';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { FiltersPage } from '../pages/adf/process-services/filters.page';
import { TaskDetailsPage } from '../pages/adf/process-services/task-details.page';
import { TasksListPage } from '../pages/adf/process-services/tasks-list.page';
import CONSTANTS = require('../util/constants');
import { TasksPage } from '../pages/adf/process-services/tasks.page';

describe('Task Details - Form', () => {
    const loginPage = new LoginPage();
    const tasksListPage = new TasksListPage();
    const taskDetailsPage = new TaskDetailsPage();
    const taskPage = new TasksPage();
    const filtersPage = new FiltersPage();
    const widget = new Widget();
    let task, otherTask, user, newForm, attachedForm, otherAttachedForm;
    let newTask;

    beforeAll(async () => {
        const users = new UsersActions();
        const attachedFormModel = {
            'name': StringUtil.generateRandomString(),
            'description': '',
            'modelType': 2,
            'stencilSet': 0
        };
        const otherTaskModel = new StandaloneTask();
        const otherAttachedFormModel = {
            'name': StringUtil.generateRandomString(),
            'description': '',
            'modelType': 2,
            'stencilSet': 0
        };
        const newFormModel = {
            'name': StringUtil.generateRandomString(),
            'description': '',
            'modelType': 2,
            'stencilSet': 0
        };

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        user = await users.createTenantAndUser(this.alfrescoJsApi);
        await this.alfrescoJsApi.login(user.email, user.password);

        attachedForm = await this.alfrescoJsApi.activiti.modelsApi.createModel(attachedFormModel);
        newForm = await this.alfrescoJsApi.activiti.modelsApi.createModel(newFormModel);

        const otherEmptyTask = await this.alfrescoJsApi.activiti.taskApi.createNewTask(otherTaskModel);
        otherAttachedForm = await this.alfrescoJsApi.activiti.modelsApi.createModel(otherAttachedFormModel);

        await this.alfrescoJsApi.activiti.taskApi.attachForm(otherEmptyTask.id, { 'formId': otherAttachedForm.id });
        otherTask = await this.alfrescoJsApi.activiti.taskApi.getTask(otherEmptyTask.id);

        await loginPage.loginToProcessServicesUsingUserModel(user);
   });

    afterAll( async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(user.tenantId);
    });

    beforeEach(async () => {
        const emptyTask = await this.alfrescoJsApi.activiti.taskApi.createNewTask(new StandaloneTask());
        await this.alfrescoJsApi.activiti.taskApi.attachForm(emptyTask.id, { 'formId': attachedForm.id });
        task = await this.alfrescoJsApi.activiti.taskApi.getTask(emptyTask.id);

        await (await new NavigationBarPage().navigateToProcessServicesPage()).goToTaskApp();
        await tasksListPage.checkTaskListIsLoaded();
        await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await tasksListPage.checkTaskListIsLoaded();
    });

    it('[C280018] Should be able to change the form in a task', async () => {
        await tasksListPage.selectRow(task.name);
        await taskDetailsPage.clickForm();

        await taskDetailsPage.checkAttachFormDropdownIsDisplayed();
        await taskDetailsPage.checkAttachFormButtonIsDisabled();

        await taskDetailsPage.selectAttachFormOption(newForm.name);
        await taskDetailsPage.checkSelectedForm(newForm.name);
        await taskDetailsPage.checkAttachFormButtonIsEnabled();

        await taskDetailsPage.checkCancelAttachFormIsDisplayed();
        await taskDetailsPage.clickCancelAttachForm();

        await taskDetailsPage.checkFormIsAttached(attachedForm.name);

        await taskDetailsPage.clickForm();

        await taskDetailsPage.checkAttachFormDropdownIsDisplayed();
        await taskDetailsPage.selectAttachFormOption(newForm.name);

        await taskDetailsPage.checkAttachFormButtonIsDisplayed();
        await taskDetailsPage.clickAttachFormButton();

        await taskDetailsPage.checkFormIsAttached(newForm.name);
    });

    it('[C280019] Should be able to remove the form form a task', async () => {
        await tasksListPage.selectRow(task.name);
        await taskDetailsPage.clickForm();

        await taskDetailsPage.checkRemoveAttachFormIsDisplayed();
        await taskDetailsPage.clickRemoveAttachForm();

        await taskDetailsPage.checkFormIsAttached('No form');

        await expect(await taskDetailsPage.getFormName()).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
    });

    it('[C280557] Should display task details when selecting another task while the Attach Form dialog is displayed', async () => {
        await tasksListPage.selectRow(task.name);
        await taskDetailsPage.clickForm();

        await taskDetailsPage.checkRemoveAttachFormIsDisplayed();

        await tasksListPage.selectRow(otherTask.name);
        await taskDetailsPage.checkFormIsAttached(otherAttachedForm.name);
    });

    describe('Task Details - Complete form with visibility conditions on tabs', () => {

        const widgets = {
            textOneId: 'textone',
            textTwoId: 'texttwo',
            textThreeId: 'textthree',
            textFourId: 'textfour',
            numberOneId: 'numberone'
        };

        const value = {
            displayTab: 'showTab',
            notDisplayTab: 'anythingElse'
        };

        const tab = {
            tabWithFields: 'tabWithFields',
            tabFieldValue: 'tabBasicFieldValue',
            tabFieldField: 'tabBasicFieldField',
            tabFieldVar: 'tabBasicFieldVar'
        };

        const formActions = new FormModelActions();
        let app, appActions: AppsActions;

        beforeAll(async () => {
            app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;
            appActions = new AppsActions();
            const applicationsService = new ApplicationService(this.alfrescoJsApi);
            await applicationsService.importPublishDeployApp(app.file_path);
        });

        beforeEach(async () => {
            newTask = await this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: StringUtil.generateRandomString() });
            const form = await formActions.getFormByName(this.alfrescoJsApi, app.visibilityProcess.formName);
            await this.alfrescoJsApi.activiti.taskApi.attachForm(newTask.id, { 'formId': form.id });

            await (await new NavigationBarPage().navigateToProcessServicesPage()).goToTaskApp();
            await tasksListPage.checkTaskListIsLoaded();
            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
        });

        it('[C315190] Should be able to complete a standalone task with visible tab with empty value for field', async () => {
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldValue);

            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().isWidgetNotVisible(widgets.textThreeId);

            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldValue);

            await taskDetailsPage.checkCompleteFormButtonIsDisplayed();
            await taskDetailsPage.clickCompleteFormTask();
            await tasksListPage.checkContentIsNotDisplayed(newTask.name);

            await tasksListPage.checkTaskListIsLoaded();
            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
            await tasksListPage.checkContentIsDisplayed(newTask.name);
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldValue);
        });

        it('[C315191] Should be able to complete a standalone task with invisible tab with empty value for field', async () => {
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldValue);

            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().isWidgetNotVisible(widgets.textThreeId);

            await taskDetailsPage.checkCompleteFormButtonIsDisplayed();
            await taskDetailsPage.clickCompleteFormTask();
            await tasksListPage.checkContentIsNotDisplayed(newTask.name);

            await tasksListPage.checkTaskListIsLoaded();
            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
            await tasksListPage.checkContentIsDisplayed(newTask.name);
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldValue);
        });

        it('[C315192] Should not be able to complete a standalone task with visible tab with invalid value for field', async () => {
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.textWidget().setValue(widgets.textTwoId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.tab().clickTabByLabel(tab.tabFieldField);
            await widget.textWidget().setValue(widgets.numberOneId, value.displayTab);

            await expect(await taskDetailsPage.isCompleteButtonWithFormEnabled()).toEqual(false);
        });

        it('[C315193] Should be able to complete a standalone task with invisible tab with invalid value for field', async () => {
            // ACTIVITI-3746
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.textWidget().setValue(widgets.textTwoId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.tab().clickTabByLabel(tab.tabFieldField);
            await widget.textWidget().setValue(widgets.numberOneId, value.displayTab);

            await widget.tab().clickTabByLabel(tab.tabWithFields);
            await widget.textWidget().setValue(widgets.textOneId, value.notDisplayTab);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldField);

            await taskDetailsPage.checkCompleteFormButtonIsDisplayed();
            await taskDetailsPage.clickCompleteFormTask();
            await tasksListPage.checkContentIsNotDisplayed(newTask.name);

            await tasksListPage.checkTaskListIsLoaded();
            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
            await tasksListPage.checkContentIsDisplayed(newTask.name);
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldValue);
        });

        it('[C315194] Should be able to complete a standalone task with invisible tab with valid value', async () => {
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.textWidget().setValue(widgets.textTwoId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.tab().clickTabByLabel(tab.tabFieldField);
            await widget.textWidget().setValue(widgets.numberOneId, '123');

            await widget.tab().clickTabByLabel(tab.tabWithFields);
            await widget.textWidget().setValue(widgets.textOneId, value.notDisplayTab);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldField);

            await taskDetailsPage.checkCompleteFormButtonIsDisplayed();
            await taskDetailsPage.clickCompleteFormTask();
            await tasksListPage.checkContentIsNotDisplayed(newTask.name);

            await tasksListPage.checkTaskListIsLoaded();
            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
            await tasksListPage.checkContentIsDisplayed(newTask.name);
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldValue);
        });

        it('[C315195] Should be able to complete a standalone task with visible tab with valid value for field', async () => {
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.textWidget().setValue(widgets.textTwoId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.tab().clickTabByLabel(tab.tabFieldField);
            await widget.textWidget().setValue(widgets.numberOneId, '123');

            await taskDetailsPage.checkCompleteFormButtonIsDisplayed();
            await taskDetailsPage.clickCompleteFormTask();
            await tasksListPage.checkContentIsNotDisplayed(newTask.name);

            await tasksListPage.checkTaskListIsLoaded();
            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
            await tasksListPage.checkContentIsDisplayed(newTask.name);
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldValue);
        });

        it('[C315197] Should be able to complete a process task with visible tab with empty value for field', async () => {
            await appActions.startProcess(this.alfrescoJsApi, app, app.visibilityProcess.name);

            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await tasksListPage.checkTaskListIsLoaded();

            await tasksListPage.selectRow(app.visibilityProcess.taskName);
            await expect(await taskDetailsPage.getParentName()).toEqual(app.visibilityProcess.name);

            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.textWidget().setValue(widgets.textTwoId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.tab().clickTabByLabel(tab.tabFieldField);
            await widget.textWidget().setValue(widgets.numberOneId, '123');

            await taskDetailsPage.checkCompleteFormButtonIsDisplayed();
            await taskDetailsPage.clickCompleteFormTask();
            await tasksListPage.checkContentIsNotDisplayed(app.visibilityProcess.taskName);

            await tasksListPage.checkTaskListIsLoaded();
            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
            await tasksListPage.checkContentIsDisplayed(app.visibilityProcess.taskName);
            await tasksListPage.selectRow(app.visibilityProcess.taskName);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldValue);
        });

        it('[C212922] Should a User task form be refreshed, saved or completed.', async () => {
            await appActions.startProcess(this.alfrescoJsApi, app, app.processName);

            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await tasksListPage.checkTaskListIsLoaded();

            await tasksListPage.selectRow(app.taskName);
            await expect(await taskDetailsPage.getParentName()).toEqual(app.processName);

            await widget.textWidget().isWidgetVisible(app.form_fields.form_fieldId);
            await widget.textWidget().setValue(app.form_fields.form_fieldId, 'value');

            await taskPage.formFields().refreshForm();

            await widget.textWidget().isWidgetVisible(app.form_fields.form_fieldId);
            await expect(await widget.textWidget().getFieldValue(app.form_fields.form_fieldId)).toEqual('');

            await widget.textWidget().setValue(app.form_fields.form_fieldId, 'value');
            await taskPage.taskDetails().saveTaskForm();

            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await tasksListPage.checkTaskListIsLoaded();

            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
            await expect(await widget.textWidget().getFieldValue(app.form_fields.form_fieldId)).toEqual('value');

            await taskDetailsPage.clickCompleteFormTask();
        });
    });
});
